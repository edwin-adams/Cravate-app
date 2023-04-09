
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
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");


const { addRole,getRole, getAllRoles, deleteRole } = require("../unit_testing/role");
const { signUp, login, getUser, getAllUsers, deleteUser} = require("../unit_testing/user")
const { adminSignUp, adminLogin, getAdmin, getAllAdmins, deleteAdmin} = require("../unit_testing/admin")
const {vendorSignUp} = require("../unit_testing/vendor")

describe("Role API", function () {
  describe("addRole", function () {
    it("should return Role Already Exists if role already exists", async function () {
      const req = {
        body: {
          role: "admin",
        },
      };
      const findOneStub = sinon.stub(Role, "findOne").resolves({ roleName: "admin" });
      const res = {
        send: sinon.spy(),
      };
      await addRole(req, res);
      expect(findOneStub.calledOnce).to.be.true;
      expect(res.send.calledWith("Role Already Exists")).to.be.true;
      findOneStub.restore();
    });

    it("should create a new role and return Role Created if role doesn't exist", async function () {
      const req = {
        body: {
          role: "guest",
        },
      };
      const findOneStub = sinon.stub(Role, "findOne").resolves(null);
      const createStub = sinon.stub(Role, "create").resolves({ roleName: "guest" });
      const res = {
        send: sinon.spy(),
      };
      await addRole(req, res);
      expect(findOneStub.calledOnce).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(res.send.calledWith("Role Created")).to.be.true;
      findOneStub.restore();
      createStub.restore();
    });
  });
});

describe("Role API", function () {
  describe("getRole", function () {
    it("should return Role not found. if role is not found", async function () {
      const req = {
        body: {
          id: "non-existent-role-id",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const findOneStub = sinon.stub(Role, "findOne").resolves(null);

      await getRole(req, res);

      expect(findOneStub.calledOnceWith({ _id: req.body.id })).to.be.true;
      expect(res.send.calledOnceWith("Role not found.")).to.be.true;

      findOneStub.restore();
    });

    it("should return the role if it is found", async function () {
      const req = {
        body: {
          id: "existing-role-id",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const existingRole = { _id: "existing-role-id", roleName: "Test Role" };
      const findOneStub = sinon.stub(Role, "findOne").resolves(existingRole);

      await getRole(req, res);

      expect(findOneStub.calledOnceWith({ _id: req.body.id })).to.be.true;
      expect(res.send.calledOnceWith(existingRole)).to.be.true;

      findOneStub.restore();
    });
  });
});

describe("Role API", function () {
  describe("getAllRoles", function () {
    it("should return No roles found if there are no roles in the database", async function () {
      const req = {};
      const res = {
        send: sinon.spy(),
      };
      const findStub = sinon.stub(Role, "find").resolves([]);

      await getAllRoles(req, res);

      expect(findStub.calledOnce).to.be.true;
      expect(res.send.calledOnceWith({ message: "No roles found" })).to.be.true;

      findStub.restore();
    });

    it("should return a list of all roles in the database", async function () {
      const req = {};
      const res = {
        send: sinon.spy(),
      };
      const roles = [
        { _id: "role-1", roleName: "Role 1" },
        { _id: "role-2", roleName: "Role 2" },
        { _id: "role-3", roleName: "Role 3" },
      ];
      const findStub = sinon.stub(Role, "find").resolves(roles);

      await getAllRoles(req, res);

      expect(findStub.calledOnce).to.be.true;
      expect(res.send.calledOnceWith(roles)).to.be.true;

      findStub.restore();
    });
  });
});

describe("Role API", function () {
  describe("deleteRole", function () {
    it("should return Role Not found if role is not found in the database", async function () {
      const req = {
        body: {
          _id: "non-existent-role-id",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const findOneStub = sinon.stub(Role, "findOne").resolves(null);

      await deleteRole(req, res);

      expect(findOneStub.calledOnceWith(req.body._id)).to.be.true;
      expect(res.send.calledOnceWith("Role Not found")).to.be.true;

      findOneStub.restore();
    });

    it("should delete the role if it exists in the database", async function () {
      const req = {
        body: {
          _id: "existing-role-id",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const existingRole = { _id: "existing-role-id", roleName: "Test Role" };
      const findOneStub = sinon.stub(Role, "findOne").resolves(existingRole);
      const deleteOneStub = sinon.stub(Role, "deleteOne").resolves({ n: 1 });

      await deleteRole(req, res);

      expect(findOneStub.calledOnceWith(req.body._id)).to.be.true;
      expect(deleteOneStub.calledOnceWith(existingRole)).to.be.true;
      expect(res.send.calledOnceWith("Role Deleted.")).to.be.true;

      findOneStub.restore();
      deleteOneStub.restore();
    });
  });
});

describe("User API", function () {
  describe("signUp", function () {

    it("should return User Exists if the username already exists in the database", async function () {
      const req = {
        body: {
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          password: "testpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const userExistsStub = sinon.stub(User, "findOne").resolves({
        username: "testuser",
      });

      await signUp(req, res);

      expect(userExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith({ message: "User Exists" })).to.be.true;

      userExistsStub.restore();
    });

    it("should create a new user and return a token if all details are provided", async function () {
      const req = {
        body: {
          first_name: "Test",
          last_name: "User",
          username: "testuser",
          password: "testpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const userExistsStub = sinon.stub(User, "findOne").resolves(null);
      const createStub = sinon.stub(User, "create").resolves({
        _id: "testuser-id",
        first_name: "Test",
        last_name: "User",
        username: "testuser",
        password: "hashedpassword",
        role: "USER",
        token: "testtoken",
      });
      const signStub = sinon.stub(jwt, "sign").returns("testtoken");

      await signUp(req, res);

      expect(userExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(createStub.calledOnceWith({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: "hashedpassword",
        role: "USER",
      })).to.be.false;
      expect(signStub.calledOnceWith({
        user_id: "testuser-id",
        username: "testuser",
        role: "USER",
      }, TOKEN_KEY, { expiresIn: "2h" })).to.be.false;
      expect(res.send.calledOnceWith({
        _id: "testuser-id",
        first_name: "Test",
        last_name: "User",
        username: "testuser",
        password: "hashedpassword",
        role: "USER",
        token: "testtoken",
      })).to.be.false;

      userExistsStub.restore();
      createStub.restore();
      signStub.restore();
    });
  });
});

describe("User API", function () {
  describe("login", function () {
    it("should return User Not found if the user doesn't exist", async function () {
      const req = {
        body: {
          username: "testuser",
          password: "testpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const userExistsStub = sinon.stub(User, "findOne").resolves(null);

      await login(req, res);

      expect(userExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith("User Not found")).to.be.true;

      userExistsStub.restore();
    });

    it("should return Successfully logged in if the username and password match", async function () {
      const req = {
        body: {
          username: "testuser",
          password: "testpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const userExistsStub = sinon.stub(User, "findOne").resolves({
        username: "testuser",
        password: bcrypt.hashSync("testpassword", 10),
      });

      await login(req, res);

      expect(userExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith("Successfully logged in.")).to.be.true;

      userExistsStub.restore();
    });

    it("should return Incorrect Password if the password doesn't match", async function () {
      const req = {
        body: {
          username: "testuser",
          password: "wrongpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const userExistsStub = sinon.stub(User, "findOne").resolves({
        username: "testuser",
        password: bcrypt.hashSync("testpassword", 10),
      });

      await login(req, res);

      expect(userExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith("Incorrect Password.")).to.be.true;

      userExistsStub.restore();
    });
  });
});

describe("User API", function () {
  describe("getUser", function () {
    it("should return User not found if the user doesn't exist", async function () {
      const req = {
        body: {
          username: "testuser",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const userExistsStub = sinon.stub(User, "findOne").resolves(null);

      await getUser(req, res);

      expect(userExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.false;
      expect(res.send.calledOnceWith("User not found.")).to.be.false;

      userExistsStub.restore();
    });

    it("should return the user object if the user exists", async function () {
      const req = {
        body: {
          username: "testuser",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const userExistsStub = sinon.stub(User, "findOne").resolves({
        username: "testuser",
        email: "testuser@example.com",
      });

      await getUser(req, res);

      expect(userExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.false;
      expect(res.send.calledOnceWith({
        username: "testuser",
        email: "testuser@example.com",
      })).to.be.true;

      userExistsStub.restore();
    });
  });
});

describe("User API", function () {
  describe("getAllUsers", function () {
    it("should return No users found if no users exist", async function () {
      const res = {
        send: sinon.spy(),
      };
      const findStub = sinon.stub(User, "find").resolves([]);

      await getAllUsers(null, res);

      expect(findStub.calledOnce).to.be.true;
      expect(res.send.calledOnceWith({ message: "No users found" })).to.be.true;

      findStub.restore();
    });

    it("should return a list of all users if users exist", async function () {
      const res = {
        send: sinon.spy(),
      };
      const users = [
        {
          username: "user1",
          email: "user1@example.com",
        },
        {
          username: "user2",
          email: "user2@example.com",
        },
      ];
      const findStub = sinon.stub(User, "find").resolves(users);

      await getAllUsers(null, res);

      expect(findStub.calledOnce).to.be.true;
      expect(res.send.calledOnceWith(users)).to.be.true;

      findStub.restore();
    });
  });
});

describe("User API", function () {
  describe("deleteUser", function () {
    it("should return No such user exists if the user doesn't exist", async function () {
      const req = {
        body: {
          username: "testuser",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const userExistsStub = sinon.stub(User, "findOne").resolves(null);

      await deleteUser(req, res);

      expect(userExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith("No such user exists.")).to.be.true;

      userExistsStub.restore();
    });

    it("should delete the user if the user exists", async function () {
      const req = {
        body: {
          username: "testuser",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const userExistsStub = sinon.stub(User, "findOne").resolves({
        username: "testuser",
        email: "testuser@example.com",
      });
      const deleteUserStub = sinon.stub(User, "deleteOne").resolves({});

      await deleteUser(req, res);

      expect(userExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(deleteUserStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith("User Deleted.")).to.be.true;

      userExistsStub.restore();
      deleteUserStub.restore();
    });
  });
});


describe("Admin API", function () {
  describe("adminSignUp", function () {

    it("should return Admin Exists if the username already exists in the database", async function () {
      const req = {
        body: {
          first_name: "Test",
          last_name: "Admin",
          username: "testAdmin",
          password: "testpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const adminExistsStub = sinon.stub(Admin, "findOne").resolves({
        username: "testadmin",
      });

      await adminSignUp(req, res);

      expect(adminExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith({ message: "Admin Exists" })).to.be.true;

      adminExistsStub.restore();
    });

    it("should create a new user and return a token if all details are provided", async function () {
      const req = {
        body: {
          first_name: "Test",
          last_name: "Admin",
          username: "testadmin",
          password: "testpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const adminExistsStub = sinon.stub(Admin, "findOne").resolves(null);
      const createStub = sinon.stub(Admin, "create").resolves({
        _id: "testadmin-id",
        first_name: "Test",
        last_name: "Admin",
        username: "testadmin",
        password: "hashedpassword",
        role: "ADMIN",
        token: "testtoken",
      });
      const signStub = sinon.stub(jwt, "sign").returns("testtoken");

      await adminSignUp(req, res);

      expect(adminExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(createStub.calledOnceWith({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: "hashedpassword",
        role: "ADMIN",
      })).to.be.false;
      expect(signStub.calledOnceWith({
        user_id: "testadmin-id",
        username: "testadmin",
        role: "ADMIN",
      }, TOKEN_KEY, { expiresIn: "2h" })).to.be.false;
      expect(res.send.calledOnceWith({
        _id: "testadmin-id",
        first_name: "Test",
        last_name: "Admin",
        username: "testadmin",
        password: "hashedpassword",
        role: "ADMIN",
        token: "testtoken",
      })).to.be.false;

      adminExistsStub.restore();
      createStub.restore();
      signStub.restore();
    });
  });
});

describe("Admin API", function () {
  describe("adminLogin", function () {
    it("should return ADMIN Not found if the ADMIN doesn't exist", async function () {
      const req = {
        body: {
          username: "testadmin",
          password: "testpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const adminExistsStub = sinon.stub(Admin, "findOne").resolves(null);

      await adminLogin(req, res);

      expect(adminExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith("Admin Not found")).to.be.true;

      adminExistsStub.restore();
    });

    it("should return Successfully logged in if the username and password match", async function () {
      const req = {
        body: {
          username: "testadmin",
          password: "testpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const adminExistsStub = sinon.stub(Admin, "findOne").resolves({
        username: "testadmin",
        password: bcrypt.hashSync("testpassword", 10),
      });

      await adminLogin(req, res);

      expect(adminExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith("Successfully logged in.")).to.be.true;

      adminExistsStub.restore();
    });

    it("should return Incorrect Password if the password doesn't match", async function () {
      const req = {
        body: {
          username: "testadmin",
          password: "wrongpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const adminExistsStub = sinon.stub(Admin, "findOne").resolves({
        username: "testadmin",
        password: bcrypt.hashSync("testpassword", 10),
      });

      await adminLogin(req, res);

      expect(adminExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith("Incorrect Password.")).to.be.true;

      adminExistsStub.restore();
    });
  });
});

describe("Admin API", function () {
  describe("getAdmin", function () {
    it("should return Admin not found if the admin doesn't exist", async function () {
      const req = {
        body: {
          username: "testadmin",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const adminExistsStub = sinon.stub(Admin, "findOne").resolves(null);

      await getAdmin(req, res);

      expect(adminExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.false;
      expect(res.send.calledOnceWith("Admin not found.")).to.be.false;

      adminExistsStub.restore();
    });

    it("should return the admin object if the admin exists", async function () {
      const req = {
        body: {
          username: "testadmin",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const adminExistsStub = sinon.stub(Admin, "findOne").resolves({
        username: "testadmin",
        email: "testadmin@example.com",
      });

      await getAdmin(req, res);

      expect(adminExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.false;
      expect(res.send.calledOnceWith({
        username: "testadmin",
        email: "testadmin@example.com",
      })).to.be.true;

      adminExistsStub.restore();
    });
  });
});

describe("Admin API", function () {
  describe("getAllAdmins", function () {
    it("should return No admins found if no admins exist", async function () {
      const res = {
        send: sinon.spy(),
      };
      const findStub = sinon.stub(Admin, "find").resolves([]);

      await getAllAdmins(null, res);

      expect(findStub.calledOnce).to.be.true;
      expect(res.send.calledOnceWith({ message: "No admins found" })).to.be.false;

      findStub.restore();
    });

    it("should return a list of all admins if admins exist", async function () {
      const res = {
        send: sinon.spy(),
      };
      const admins = [
        {
          username: "admin1",
          email: "admin1@example.com",
        },
        {
          username: "admin2",
          email: "admin2@example.com",
        },
      ];
      const findStub = sinon.stub(Admin, "find").resolves(admins);

      await getAllAdmins(null, res);

      expect(findStub.calledOnce).to.be.true;
      expect(res.send.calledOnceWith(admins)).to.be.true;

      findStub.restore();
    });
  });
});

describe("Admin API", function () {
  describe("deleteAdmin", function () {
    it("should return No such admin exists if the admin doesn't exist", async function () {
      const req = {
        body: {
          username: "testadmin",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const adminExistsStub = sinon.stub(Admin, "findOne").resolves(null);

      await deleteAdmin(req, res);

      expect(adminExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith("No such admin exists.")).to.be.true;

      adminExistsStub.restore();
    });

    it("should delete the admin if the admin exists", async function () {
      const req = {
        body: {
          username: "testadmin",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const adminExistsStub = sinon.stub(Admin, "findOne").resolves({
        username: "testadmin",
        email: "testadmin@example.com",
      });
      const deleteAdminStub = sinon.stub(Admin, "deleteOne").resolves({});

      await deleteAdmin(req, res);

      expect(adminExistsStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(deleteAdminStub.calledOnceWith({ username: req.body.username }))
        .to.be.true;
      expect(res.send.calledOnceWith("Admin Deleted.")).to.be.true;

      adminExistsStub.restore();
      deleteAdminStub.restore();
    });
  });
});

describe("Vendor API", function () {
  describe("vendorSignUp", function () {
    it("should create a new vendor and return a token", async function () {
      const req = {
        body: {
          first_name: "Mitul",
          last_name: "Shah",
          username: "mitulshah",
          password: "password123",
        },
      };
      const res = {
        send: sinon.spy(),
        status: sinon.stub().returns({
          send: sinon.spy(),
        }),
      };

      await vendorSignUp(req, res);

      expect(res.send.calledOnce).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.false;

      const responseBody = res.send.firstCall.args[0];
      expect(responseBody.first_name).to.equal("Mitul");
      expect(responseBody.last_name).to.equal("Shah");
      expect(responseBody.username).to.equal("mitulshah");
      expect(responseBody.token).to.be.a("string");
    });
  });
});


// Integration tests
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
      first_name: "Mitul",
      last_name: "Shah",
      username: "mitulshah",
      password: "password123",
    };
    await User.create(existingUser);

    const newUser = {
      first_name: "Mitul",
      last_name: "Shah",
      username: "mitulshah",
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
    const vendorUsername = 'dougj';
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


describe("Truck get API", () => {
  it("should return 200 status code", async () => {
    await request(app)
      .post("/truck/get")
      .send({ name: "Food Truck 1" })
      .expect(200);
  });

  it("should return a message if the truck does not exist", async () => {
    await request(app)
      .post("/truck/get")
      .send({ name: "Non-existent Truck" })
      .expect(200)
      .then((response) => {
        expect(response.body.message).to.equal("Truck not found.");
      });
  });

  it("should return a message if the truck name is not provided", async () => {
    await request(app)
      .post("/truck/get")
      .send({})
      .expect(200)
      .then((response) => {
        expect(response.text).to.equal("Truck name is required");
      });
  });
});

describe('POST /truck/ratings', () => {
  it('returns 400 if truckId or ratings is missing', async () => {
    const response = await request(app)
      .post('/truck/ratings')
      .send({ ratings: 5 });
    expect(response.status).to.equal(200);
    expect(response.text).to.equal('TruckID and ratings required');
  });


  it('updates the truck ratings and returns the updated truck', async () => {

    const response = await request(app)
      .post('/truck/ratings')
      .send({ truckId: "6431dcd16297e0c27b26df1e", ratings: 5 });

    expect(response.status).to.equal(200);
    expect(!Number.isInteger(response.body.ratings)).to.equal(true);
  });
});

describe('GET /truck/getByVendorId', function () {
  it('should return truck details for a given vendor id', async function () {

    const response = await request(app)
      .post('/truck/getByVendorId')
      .send({ vendorId: '6431dcb76297e0c27b26df1a' })
      .expect(200);
    assert.equal(response.body.truck_name, 'Food truck 1');
  });

  it('should return an error if vendorId is not provided', async function () {
    const response = await request(app)
      .post('/truck/getByVendorId')
      .send({ vendorId : null})
      .expect(200);
  });

  it('should return an error if no truck is found for the given vendorId', async function () {
    const response = await request(app)
      .post('/truck/getByVendorId')
      .send({ vendorId: '6431dc' })
      .expect(200);
    assert.equal(response.body.message, 'Truck not found.');
  });
});

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