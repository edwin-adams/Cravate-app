
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

describe("POST /role/get", function () {
  this.timeout(5000);
  it("should get a role by ID", async function () {
    const role = await Role.findOne({ roleName: "CUSTOMER" });
    const response = await request(app)
      .post("/role/get")
      .send({ id: role._id });
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ __v: 0, _id: "6430f93445ae774c1903f7c2", roleName: "CUSTOMER" });
  });
});

describe("GET /roles/getall", () => {
  it("should get all roles", async () => {
    const roles = [      { roleName: "Manager" },      { roleName: "Employee" },      { roleName: "Customer" },    ];
    // await Role.insertMany(roles);
    const response = await request(app).get("/roles/getall");
    expect(response.status).to.equal(200);
    expect(response.body.length).to.equal(30);
  });
});

// describe("DELETE /role/delete", () => {
//   it("should delete a role by ID", async () => {
//     const role = await Role.create({ roleName: "Manager" });
//     const response = await request(app)
//       .delete("/role/delete")
//       .send({ _id: role._id });
//     expect(response.status).toBe(200);
//     expect(response.text).toBe("Role Deleted.");
//     const deletedRole = await Role.findOne({ _id: role._id });
//     expect(deletedRole).toBeNull();
//   });
//   it("should return an error message if role is not found", async () => {
//     const response = await request(app)
//       .delete("/role/delete")
//       .send({ _id: "fakeID" });
//     expect(response.status).toBe(200);
//     expect(response.text).toBe("Role Not found");
//   });
// });