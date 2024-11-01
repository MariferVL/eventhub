const request = require("supertest"); // Import supertest for making HTTP requests in tests
const jwt = require("jsonwebtoken"); // Import jwt to create test tokens
const mongoose = require("mongoose"); // Import mongoose to interact with the database
const app = require("../server"); // Import the Express app
const User = require("../models/User"); // Import the User model
const bcrypt = require("bcryptjs"); // Import bcrypt for password comparison

// Before all tests, connect to the database
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// After each test, clear the User collection
afterEach(async () => {
  await User.deleteMany();
});

// After all tests, disconnect from the database
afterAll(async () => {
  await mongoose.connection.close();
});

// Test Suite for Authentication Middleware
describe("Authentication Middleware", () => {
  // Test for the authenticateToken middleware
  describe("authenticateToken", () => {
    it("should authorize a user with a valid token", async () => {
      const user = await User.create({
        username: "testuser",
        password: "hashedPassword",
        role: "user",
      });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
      );

      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe("testuser");
    });

    it("should return 401 if token is missing", async () => {
      const res = await request(app).get("/api/users/me");
      expect(res.statusCode).toBe(401);
    });

    it("should return 403 for an invalid token", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", "Bearer invalidToken");

      expect(res.statusCode).toBe(403);
    });
  });

  // Test Suite for User Update
  describe("User Update", () => {
    let user; // Variable to hold the user for tests
    let token; // Variable to hold the JWT token

    // Create a user and a token before running the tests
    beforeEach(async () => {
      user = await User.create({
        username: "testuser",
        password: await bcrypt.hash("hashedPassword", 10),
        role: "user",
      });

      token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET
      );
    });

    it("should update user details successfully", async () => {
      const res = await request(app)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "newUsername", password: "newPassword" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User details updated successfully");
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.username).toBe("newUsername");
      const isMatch = await bcrypt.compare("newPassword", updatedUser.password);
      expect(isMatch).toBe(true); // Ensure the password is hashed correctly
    });

    it("should update username only", async () => {
      const res = await request(app)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "updatedUsername" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User details updated successfully");
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.username).toBe("updatedUsername");
    });

    it("should update password only", async () => {
      const res = await request(app)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ password: "updatedPassword" });

      expect(res.statusCode).toBe(200);
      const updatedUser = await User.findById(user._id);
      const isMatch = await bcrypt.compare(
        "updatedPassword",
        updatedUser.password
      );
      expect(isMatch).toBe(true); // Ensure the password is hashed correctly
    });

    it("should return 404 if user is not found", async () => {
      const invalidToken = jwt.sign(
        { id: "609b6e6a8e2e1c0021e4c1b8", role: user.role }, // Invalid ObjectId
        process.env.JWT_SECRET
      );

      const res = await request(app)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${invalidToken}`)
        .send({ username: "shouldFail" });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });

    it("should return 400 if no new information is provided", async () => {
      const res = await request(app)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({}); // Empty body

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("No new information provided");
    });

    it("should return 400 for invalid username type", async () => {
      const res = await request(app)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: 12345 }); // Invalid username type

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid username type"); // Adjust based on your error handling
    });

    it("should return 400 for invalid password type", async () => {
      const res = await request(app)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ password: 12345 }); // Invalid password type

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid password type"); // Adjust based on your error handling
    });
  });

  //FIXME: Pending code for future feautures
  //   // Test for the authorizeRole middleware
  //   describe("authorizeRole", () => {
  //     it("should allow access if the user has the required role", async () => {
  //       const user = await User.create({
  //         username: "organizerUser",
  //         password: "hashedPassword",
  //         role: "organizer",
  //       });

  //       const token = jwt.sign(
  //         { id: user._id, role: user.role },
  //         process.env.JWT_SECRET
  //       );

  //       const res = await request(app)
  //         .put("/api/users/me")
  //         .set("Authorization", `Bearer ${token}`)
  //         .send({ username: "newOrganizerName" });

  //       expect(res.statusCode).toBe(200);

  //       // Verify the updated username directly in the database
  //       const updatedUser = await User.findById(user._id);
  //       expect(updatedUser.username).toBe("newOrganizerName");
  //     });

  //     it("should deny access if the user does not have the required role", async () => {
  //       const user = await User.create({
  //         username: "regularUser",
  //         password: "hashedPassword",
  //         role: "user",
  //       });

  //       const token = jwt.sign(
  //         { id: user._id, role: user.role },
  //         process.env.JWT_SECRET
  //       );

  //       const res = await request(app)
  //         .put("/api/users/me")
  //         .set("Authorization", `Bearer ${token}`)
  //         .send({ username: "newUserName" });

  //       expect(res.statusCode).toBe(403);
  //       expect(res.body.message).toBe("Access denied");
  //     });
  //   });
});
