const request = require("supertest"); // Import the supertest library for making HTTP requests in tests
const mongoose = require("mongoose"); // Import mongoose for MongoDB interactions
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token management
const app = require("../server"); // Import the Express app
const User = require("../models/User"); // Import the User model

// Initial setup before running the tests
beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear the User collection after each test
afterEach(async () => {
  await User.deleteMany();
});

// Close the database connection after all tests have run
afterAll(async () => {
  await mongoose.connection.close();
});

// Test suite for user registration
describe("POST /api/auth/register", () => {
  // Test for successful user registration
  it("Should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser", // Test username
      password: "password123", // Test password
      role: "user", // Role assigned to the user
    });

    // Check that the response status code is 201 (Created)
    expect(res.statusCode).toBe(201);
    // Check that the response message indicates success
    expect(res.body.message).toBe("User registered successfully");
  });

  // Test for error when user already exists
  it("Should return an error if the user already exists", async () => {
    // Create a user in the database
    await User.create({ username: "testuser", password: "hashedPassword" });

    // Attempt to register the same user again
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
      role: "user",
    });

    // Check that the response status code is 400 (Bad Request)
    expect(res.statusCode).toBe(400);
    // Check that the response message indicates the user already exists
    expect(res.body.message).toBe("User already exists");
  });

  // Test for error if the role is invalid
  it("Should return an error if the role is invalid", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
      role: "invalidRole", // Invalid role
    });

    // Check that the response status code is 400 (Bad Request)
    expect(res.statusCode).toBe(400);
    // Check that the response message indicates the role is invalid
    expect(res.body.message).toBe("'invalidRole' is not a valid role.");
  });
});

// Test suite for user login
describe("POST /api/auth/login", () => {
  // Test for successful user authentication
  it("Should authenticate and return an access token", async () => {
    // Hash the password for the test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    // Create the user with the hashed password
    await User.create({ username: "testuser", password: hashedPassword });

    // Attempt to log in with the correct credentials
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });

    // Check that the response status code is 200 (OK)
    expect(res.statusCode).toBe(200);
    // Check that the access token is defined in the response
    expect(res.body.accessToken).toBeDefined();
  });

  // Test for error when the user does not exist
  it("Should return an error if the user does not exist", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "nonexistentuser", // Username that does not exist
      password: "password123",
    });

    // Check that the response status code is 404 (Not Found)
    expect(res.statusCode).toBe(404);
    // Check that the response message indicates the user was not found
    expect(res.body.message).toBe("User not found");
  });

  // Test for error when the password is incorrect
  it("Should return an error if the password is incorrect", async () => {
    // Hash the password for the test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    // Create the user with the hashed password
    await User.create({ username: "testuser", password: hashedPassword });

    // Attempt to log in with the wrong password
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "wrongpassword", // Incorrect password
    });

    // Check that the response status code is 400 (Bad Request)
    expect(res.statusCode).toBe(400);
    // Check that the response message indicates the password is invalid
    expect(res.body.message).toBe("Invalid password");
  });
});

// Test suite for refreshing the access token
describe("POST /api/auth/refresh-token", () => {
  // Test for successfully refreshing and returning a new access token
  it("Should refresh and return a new access token", async () => {
    // Create a user and ensure the refresh token is stored correctly
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      username: "testuser",
      password: hashedPassword,
    });
  
    // Generate a refresh token for the user
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET
    );
  
    // Store the refresh token in the user's document
    user.refreshToken = refreshToken;
    await user.save(); // Save the user with the refresh token
  
    // Now test the token refresh
    const res = await request(app).post("/api/auth/refresh-token").send({
      refreshToken, // Use the correct refresh token
    });
  
    // Check that the response status code is 200 (OK)
    expect(res.statusCode).toBe(200);
    // Check that the new access token is defined in the response
    expect(res.body.accessToken).toBeDefined();
  });
  
  // Test for error when the refresh token is not provided
  it("Should return an error if the refresh token is not sent", async () => {
    const res = await request(app).post("/api/auth/refresh-token").send();

    // Check that the response status code is 401 (Unauthorized)
    expect(res.statusCode).toBe(401);
    // Check that the response message indicates the refresh token is required
    expect(res.body.message).toBe("Refresh token required");
  });

  // Test for error when the refresh token is invalid
  it("Should return an error if the refresh token is invalid", async () => {
    const res = await request(app).post("/api/auth/refresh-token").send({
      refreshToken: "invalidToken", // Invalid refresh token
    });

    // Check that the response status code is 403 (Forbidden)
    expect(res.statusCode).toBe(403);
    // Check that the response message indicates the token is invalid or expired
    expect(res.body.message).toBe("Invalid or expired refresh token");
  });
});

// Test suite for logging out
describe("POST /api/auth/logout", () => {
  // Test for successfully logging out and revoking the refresh token
  it("Should remove the refresh token and log out", async () => {
    // Generate a refresh token for a test user
    const refreshToken = jwt.sign(
      { _id: new mongoose.Types.ObjectId(), role: "user" },
      process.env.JWT_REFRESH_SECRET
    );
    
    // Create the user with the refresh token
    await User.create({
      username: "testuser",
      password: "password123",
      refreshToken,
    });

    // Attempt to log out using the refresh token
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", `refreshToken=${refreshToken}`); // Send the refresh token as a cookie

    // Check that the response status code is 204 (No Content)
    expect(res.statusCode).toBe(204);
    // Verify that the user's refresh token is now null (logged out)
    const user = await User.findOne({ username: "testuser" });
    expect(user.refreshToken).toBeNull();
  });

  // Test for logout when the user does not have an active session
  it("Should return 204 if the user does not have a session token", async () => {
    const res = await request(app).post("/api/auth/logout");

    // Check that the response status code is 204 (No Content)
    expect(res.statusCode).toBe(204);
  });
});
