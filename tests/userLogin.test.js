// responce must have status 200
// responce must contain token
// responce must contain object user with 2 keys "email" and "subscription" with type "String"

const mongoose = require("mongoose");
const app = require("../app");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const { loginUser } = require("../controllers/users");
// const User = require("../models/user");
// const usersRouter = require("../routes/api/auth");

require("dotenv").config();
const { DB_HOST, PORT } = process.env;

describe("user login test", () => {
  let server;

  beforeEach(async () => {
    await mongoose.connect(DB_HOST);
    server = await app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    // await request(app).post("/users/register").send({
    //   email: "userfortesting@gmail.com",
    //   password: "test123456",
    // })
  });

  afterEach(async () => {
    // await request(app).post("/users").send({})

    await server.close();
    await mongoose.connection.close();

    console.log(`Server on port ${PORT} closed.`);
  });

  test("responce must have status 200", async () => {
    const response = await request(app).post("/users/login").send({
      email: "example@example.com",
      password: "examplepassword",
    });

    expect(response.statusCode).toBe(200);
  }, 5000);

  test.only("responce must contain token", async () => {
    const response = await request(app).post("/users/login").send({
      email: "example@example.com",
      password: "examplepassword",
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
      email: "example@example.com",
      password: "examplepassword",
    });

    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
