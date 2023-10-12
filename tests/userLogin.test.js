/*
test 1 - responce must have status 200
test 2 - responce must contain token
test 3 - responce must contain object user with 2 keys "email" and "subscription" 
with type "String"
*/

const mongoose = require("mongoose");
const app = require("../app");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

require("dotenv").config();
const { DB_HOST, PORT } = process.env;

describe("user login test", () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = await app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    const user = await User.create({
      email: "userfortesting@gmail.com",
      password: await bcryptjs.hash("test123456", 10),
      token: "",
    });
    console.log("test user created:", user);
  });

  afterAll(async () => {
    const user = await User.findOneAndRemove({
      email: "userfortesting@gmail.com",
    });
    console.log("test user deleted:", user);
    await server.close();
    await mongoose.connection.close();

    console.log(`Server on port ${PORT} closed.`);
  }, 5000);

  test("responce must have status 200", async () => {
    const response = await request(app).post("/users/login").send({
      email: "userfortesting@gmail.com",
      password: "test123456",
    });

    expect(response.statusCode).toBe(200);
  }, 5000);

  test("responce must contain token", async () => {
    const response = await request(app).post("/users/login").send({
      email: "userfortesting@gmail.com",
      password: "test123456",
    });
    const { email } = jwt.decode(response.body.token);
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

    expect(response.body.token).toMatch(jwtRegex);
    expect(typeof response.body.token).toBe("string");
    expect(response.body.token).not.toBe("");
    expect(email).toBe(request.email);
  }, 5000);

  test(`responce must contain object user with 2 keys "email" and "subscription" with type "String"`, async () => {
    const response = await request(app).post("/users/login").send({
      email: "userfortesting@gmail.com",
      password: "test123456",
    });

    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
