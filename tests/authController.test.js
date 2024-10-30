const request = require("supertest");
const app = require("../server"); // Asegúrate de que este es el archivo de configuración de tu aplicación Express
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

beforeAll(async () => {

  // Conectar a la base de datos antes de las pruebas
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Desconectar de la base de datos después de las pruebas
  await mongoose.connection.close();
});

describe("Auth Controller", () => {
  const testUser = {
    username: "testuser",
    password: "testpassword",
    role: "user",
  };

  // Test para el registro de usuario
  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/auth/register").send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty(
        "message",
        "User registered successfully"
      );

      // Verificar que el usuario se haya guardado en la base de datos
      const userInDb = await User.findOne({ username: testUser.username });
      expect(userInDb).toBeTruthy();
    });

    it("should return 400 if user already exists", async () => {
      const res = await request(app).post("/auth/register").send(testUser);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "User already exists");
    });

    it("should return 400 if the role is invalid", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({ ...testUser, role: "invalidRole" });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty(
        "message",
        "'invalidRole' is not a valid role."
      );
    });
  });

  // Test para el inicio de sesión
  describe("POST /auth/login", () => {
    it("should login user and return access token", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ username: testUser.username, password: testUser.password });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("accessToken");
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ username: "unknownUser", password: "password" });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });

    it("should return 400 if password is invalid", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ username: testUser.username, password: "wrongpassword" });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Invalid password");
    });
  });

  // Test para el refresh token
  describe("POST /auth/refresh-token", () => {
    let refreshToken;

    beforeAll(async () => {
      const user = await User.findOne({ username: testUser.username });
      refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
      );
      user.refreshToken = refreshToken;
      await user.save();
    });

    it("should refresh access token", async () => {
      const res = await request(app)
        .post("/auth/refresh-token")
        .send({ refreshToken });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("accessToken");
    });

    it("should return 401 if refresh token is not provided", async () => {
      const res = await request(app).post("/auth/refresh-token").send({});

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("message", "Refresh token required");
    });

    it("should return 403 if refresh token is invalid", async () => {
      const res = await request(app)
        .post("/auth/refresh-token")
        .send({ refreshToken: "invalidToken" });

      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty(
        "message",
        "Invalid or expired refresh token"
      );
    });
  });

  // Test para logout
  describe("POST /auth/logout", () => {
    it("should logout user and revoke refresh token", async () => {
      const res = await request(app)
        .post("/auth/logout")
        .set("Cookie", `refreshToken=${refreshToken}`);

      expect(res.statusCode).toEqual(204);

      const user = await User.findOne({ username: testUser.username });
      expect(user.refreshToken).toBeNull(); // Verificar que el refreshToken se haya revocado
    });

    it("should return 204 if no refresh token is provided", async () => {
      const res = await request(app).post("/auth/logout").send({});

      expect(res.statusCode).toEqual(204);
    });
  });
});
