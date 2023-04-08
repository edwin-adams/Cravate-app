
var request = require("supertest");
var app = require('../index');
const {expect} = require('chai');
const assert = require("assert");
const UserController = require("../controllers/UserController");
const router = require("express").Router();
const User = require("../models/user");
const Admin = require("../models/admin");
const Role = require("../models/role");
const Vendor = require("../models/vendor");
const Truck = require("../models/trucks");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const { Model } = require("mongoose");
const { findOne } = require("../models/user");
const { findOneAndUpdate } = require("../models/admin");
const TOKEN_KEY = "DCMXIXvHBH";
const chai = require('chai');
const chaiHttp = require('chai-http');

// describe("POST /role/add", function () {
//   this.timeout(5000);
//   it("should add a role successfully", async function () {
//     const response = await request(app)
//       .post("/role/add")
//       .send({ role: "Customer1" });
//     expect(response.status).to.equal(200);
//     expect(response.text).to.equal("Role Created");
//   });
// });

// describe("POST /role/get", function () {
//   this.timeout(5000);
//   it("should get a role by ID", async function () {
//     const role = await Role.findOne({ roleName: "CUSTOMER" });
//     const response = await request(app)
//       .post("/role/get")
//       .send({ id: role._id });
//     expect(response.status).to.equal(200);
//     expect(response.body).to.deep.equal({ __v: 0, _id: "6430f93445ae774c1903f7c2", roleName: "CUSTOMER" });
//   });
// });

// describe("GET /roles/getall", () => {
//   it("should get all roles", async () => {
//     const roles = [      { roleName: "Manager" },      { roleName: "Employee" },      { roleName: "Customer" },    ];
//     // await Role.insertMany(roles);
//     const response = await request(app).get("/roles/getall");
//     expect(response.status).to.equal(200);
//     expect(response.body.length).to.equal(30);
//   });
// });

// describe("DELETE /role/delete", () => {
//   it("should delete a role by ID", async () => {
//     const role = await Role.create({ roleName: "Manager" });
//     const response = await request(app)
//       .delete("/role/delete")
//       .send({ _id: role._id });
//     expect(response.status).to.equal(200);
//     expect(response.text).to.equal("Role Deleted.");
//     const deletedRole = await Role.findOne({ _id: role._id });
//     expect(deletedRole).to.equalNull();
//   });
//   it("should return an error message if role is not found", async () => {
//     const response = await request(app)
//       .delete("/role/delete")
//       .send({ _id: "fakeID" });
//     expect(response.status).to.equal(200);
//     expect(response.text).to.equal("Role Not found");
//   });
// });

describe("User signUp API", () => {
  beforeEach(async () => {
    // Clear the User collection before each test
    await User.deleteMany({});
  });

  it("should create a new user with valid details", async () => {
    const newUser = {
      first_name: "Doug",
      last_name: "Judy",
      username: "dougj",
      password: "password123",
    };

    const response = await request(app).post("/user/signUp").send(newUser);

    expect(response.status).to.equal(200);
    expect(response.body.first_name).to.equal(newUser.first_name);
    expect(response.body.last_name).to.equal(newUser.last_name);
    expect(response.body.username).to.equal(newUser.username);
    expect(response.body.role).to.equal("USER");
    expect(response.body.token).to.exist;
  });

  it("should return an error when required fields are missing", async () => {
    const newUser = {
      first_name: "Doug",
      last_name: "Judy",
      password: "password123",
    };

    const response = await request(app).post("/user/signUp").send(newUser);

    expect(response.status).to.equal(400);
    expect(response.text).to.equal("Provide all details.");
  });

  it("should return an error when username already exists", async () => {
    const existingUser = {
      first_name: "Jane",
      last_name: "Judy",
      username: "janedoe",
      password: "password123",
    };
    await User.create(existingUser);

    const newUser = {
      first_name: "Doug",
      last_name: "Judy",
      username: "janedoe",
      password: "password123",
    };

    const response = await request(app).post("/user/signUp").send(newUser);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("User Exists");
  });
});

describe("User login API", () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user
    testUser = {
      first_name: "Doug",
      last_name: "Judy",
      username: "dougj",
      password: bcrypt.hashSync("password123", 10),
      role: "USER"
    };
    await User.create(testUser);
  });

  afterEach(async () => {
    // Delete the test user after each test
    await User.deleteOne({ username: testUser.username });
  });

  it("should log in a user with correct credentials", async () => {
    const credentials = {
      username: "dougj",
      password: "password123"
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).to.equal(200);
    expect(response.text).to.equal("Successfully logged in.");
  });

  it("should return an error when user is not found", async () => {
    const credentials = {
      username: "nonexistentuser",
      password: "password123"
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).to.equal(200);
    expect(response.text).to.equal("User Not found");
  });

  it("should return an error when password is incorrect", async () => {
    const credentials = {
      username: "dougj",
      password: "wrongpassword"
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).to.equal(200);
    expect(response.text).to.equal("Incorrect Password.");
  });
});

describe("User get API", () => {
  beforeEach(async () => {
    // Check if user exists
    const existingUser = await User.findOne({ username: "dougj" });
  
    // If user does not exist, create a test user
    if (!existingUser) {
      const newUser = {
        first_name: "Doug",
        last_name: "Judy",
        username: "dougj",
        password: bcrypt.hashSync("password123", 10),
        role: "USER"
      };
      await User.create(newUser);
    }
  });
  

  it("should return the correct user information", async () => {
    const username = "dougj";

    const response = await request(app).post("/user/get").send({ username });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("username", username);
    expect(response.body).to.have.property("first_name", "Doug");
    expect(response.body).to.have.property("last_name", "Judy");
    expect(response.body).to.have.property("role", "USER");
  });

  it("should return an error when user is not found", async () => {
    const username = "nonexistentuser";

    const response = await request(app).post("/user/get").send({ username });

    expect(response.status).to.equal(200);
    expect(response.text).to.equal("User not found.");
  });
});


chai.use(chaiHttp);

describe('Vendor sign up API', () => {
  it('should return 400 status code if any details are missing', async () => {
    const res = await chai
      .request(app)
      .post('/vendor/signUp')
      .send({ first_name: 'Doug', last_name: 'Judy', password: 'password123' });
    expect(res).to.have.status(400);
  });

  // it('should create a new vendor account and return a JWT token', async () => {
  //   const res = await chai
  //     .request(app)
  //     .post('/vendor/signUp')
  //     .send({
  //       first_name: 'Doug',
  //       last_name: 'Judy',
  //       username: 'dougj',
  //       password: 'password123',
  //     });
  //   expect(res).to.have.status(200);
  //   expect(res.body.token).to.exist;
  // });

  it('should return "Error occurred" message if there is an error', async () => {
    const res = await chai
      .request(app)
      .post('/vendor/signUp')
      .send({
        first_name: 'Doug',
        last_name: 'Judy',
        username: 'dougj',
        password: 'password123',
      });
    expect(res).to.have.status(200);
    expect(res.text).to.equal('Error occured.');
  });
});


describe("Vendor login API", function () {
  it("should return error message if vendor is not found", function (done) {
    request(app)
      .post("/vendor/login")
      .send({ username: "nonexistent", password: "password123" })
      .expect(200)
      .expect("Vendor Not found", done);
  });

  it("should return error message if password is incorrect", function (done) {
    request(app)
      .post("/vendor/login")
      .send({ username: "dougj", password: "wrongpassword" })
      .expect(200)
      .expect("Incorrect Password.", done);
  });

  it("should return success message if login credentials are correct", function (done) {
    request(app)
      .post("/vendor/login")
      .send({ username: "dougj", password: "password123" })
      .expect(200)
      .expect("Successfully logged in.", done);
  });
});


describe('Vendor get API', () => {
  it('should return 200 status code and vendor details if vendor is found', async () => {
    const vendorUsername = 'johndoe';
    const vendorData = {
      username: vendorUsername,
    };
    await request(app)
      .post('/vendor/get')
      .send({ username: vendorUsername })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.username).to.equal(vendorUsername);
      });
  });

  it('should return 200 status code and "Vendor not found." message if vendor is not found', async () => {
    const nonExistentVendorUsername = 'nonexistentvendor';
    await request(app)
      .post('/vendor/get')
      .send({ username: nonExistentVendorUsername })
      .expect(200)
      .expect('Vendor not found.');
  });

  it('should return 200 status code if username is missing', async () => {
    await request(app)
      .post('/vendor/get')
      .send({ username: null })
      .expect(200)
      .expect('Vendor not found.');
  });
});
