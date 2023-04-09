
const request = require("supertest");
const app = require('../index');
const {expect} = require('chai');
const UserController = require("../controllers/UserController");
const User = require("../models/user");
const Admin = require("../models/admin");
const Role = require("../models/role");
const Vendor = require("../models/vendor");
const Truck = require("../models/trucks");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = "DCMXIXvHBH";
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");


const { addRole,getRole, getAllRoles, deleteRole } = require("../unit_testing/role");
const { signUp, login, getUser, getAllUsers, deleteUser} = require("../unit_testing/user")
const { adminSignUp, adminLogin, getAdmin, getAllAdmins, deleteAdmin} = require("../unit_testing/admin")
const {vendorSignUp,vendorLogin,vendorGet, getAllVendors, deleteVendor} = require("../unit_testing/vendor")
const {addTruck, getTruck, getAllTrucks, searchTrucks, updateTruck, getTruckByVendorID, updateRatings} = require("../unit_testing/truck")


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

      expect(userExistsStub.calledOnceWith({ username: req.body.username })).to.be.true;
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

describe("Vendor API", function () {
  describe("vendorLogin", function () {
    it("should log in a vendor with correct credentials", async function () {
      const req = {
        body: {
          username: "johndoe",
          password: "password123",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const vendor = {
        username: "mitulshah",
        password: bcrypt.hashSync("password123", 10),
      };
      const findOneStub = sinon.stub(Vendor, "findOne").resolves(vendor);

      await vendorLogin(req, res);

      expect(findOneStub.calledOnceWith({ username: "mitulshah" })).to.be.false;
      expect(res.send.calledOnceWith("Successfully logged in.")).to.be.true;

      findOneStub.restore();
    });

    it("should return an error message if vendor not found", async function () {
      const req = {
        body: {
          username: "hetmehta",
          password: "password123",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const findOneStub = sinon.stub(Vendor, "findOne").resolves(null);

      await vendorLogin(req, res);

      expect(findOneStub.calledOnceWith({ username: "hetmehta" })).to.be.true;
      expect(res.send.calledOnceWith("Vendor Not found")).to.be.true;

      findOneStub.restore();
    });

    it("should return an error message if password is incorrect", async function () {
      const req = {
        body: {
          username: "mitulshah",
          password: "wrongpassword",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const vendor = {
        username: "mitulshah",
        password: bcrypt.hashSync("password123", 10),
      };
      const findOneStub = sinon.stub(Vendor, "findOne").resolves(vendor);

      await vendorLogin(req, res);

      expect(findOneStub.calledOnceWith({ username: "mitulshah" })).to.be.true;
      expect(res.send.calledOnceWith("Incorrect Password.")).to.be.true;

      findOneStub.restore();
    });
  });
});

describe("Vendor API", function () {
  describe("vendorGet", function () {
    it("should return the vendor details if the vendor exists", async function () {
      const req = {
        body: {
          username: "mitulshah",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const vendor = {
        username: "mitulshah",
        first_name: "Mitul",
        last_name: "Shah",
        email: "mitul.shah@example.com",
        phone: "1234567890",
      };
      const findOneStub = sinon.stub(Vendor, "findOne").resolves(vendor);

      await vendorGet(req, res);

      expect(findOneStub.calledOnceWith({ username: "mitulshah" })).to.be.true;
      expect(res.send.calledOnceWith(vendor)).to.be.true;

      findOneStub.restore();
    });

    it("should return an error message if vendor not found", async function () {
      const req = {
        body: {
          username: "hetmehta",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const findOneStub = sinon.stub(Vendor, "findOne").resolves(null);

      await vendorGet(req, res);

      expect(findOneStub.calledOnceWith({ username: "hetmehta" })).to.be.true;
      expect(res.send.calledOnceWith("Vendor not found.")).to.be.true;

      findOneStub.restore();
    });
  });
});

describe("Vendor API", function () {
  describe("getAllVendors", function () {
    it("should return a list of vendors if vendors exist", async function () {
      const vendors = [
        {
          username: "mitulshah",
          first_name: "Mitul",
          last_name: "Shah",
          email: "mitulshah@example.com",
          phone: "1234567890",
        },
        {
          username: "hetmehta",
          first_name: "Het",
          last_name: "Mehta",
          email: "hetmehta@example.com",
          phone: "0987654321",
        },
      ];

      const findStub = sinon.stub(Vendor, "find").resolves(vendors);
      const req = {};
      const res = {
        send: sinon.spy(),
      };

      await getAllVendors(req, res);

      expect(findStub.calledOnce).to.be.true;
      expect(res.send.calledOnceWith(vendors)).to.be.true;

      findStub.restore();
    });

    it("should return an error message if no vendors found", async function () {
      const findStub = sinon.stub(Vendor, "find").resolves([]);
      const req = {};
      const res = {
        send: sinon.spy(),
      };

      await getAllVendors(req, res);

      expect(findStub.calledOnce).to.be.true;
      expect(res.send.calledOnceWith({ message: "No vendors found" })).to.be.true;

      findStub.restore();
    });
  });
});

describe("Vendor API", function () {
  describe("deleteVendor", function () {
    it("should delete the vendor and associated food truck if they exist", async function () {
      const req = {
        body: {
          username: "mitulshah",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const vendor = {
        _id: "vendor_id_123",
        username: "mitulshah",
      };
      const foodTruck = {
        _id: "food_truck_id_456",
        vendorId: vendor._id,
      };
      const findOneVendorStub = sinon.stub(Vendor, "findOne").resolves(vendor);
      const findOneFoodTruckStub = sinon.stub(Truck, "findOne").resolves(foodTruck);
      const deleteVendorStub = sinon.stub(Vendor, "deleteOne").resolves({});
      const deleteFoodTruckStub = sinon.stub(Truck, "findOneAndDelete").resolves({});

      await deleteVendor(req, res);

      expect(findOneVendorStub.calledOnceWith({ username: "mitulshah" })).to.be.true;
      expect(findOneFoodTruckStub.calledOnceWith({ vendorId: vendor._id })).to.be.true;
      expect(deleteVendorStub.calledOnceWith({ username: "mitulshah" })).to.be.true;
      expect(deleteFoodTruckStub.calledOnceWith({ vendorId: vendor._id })).to.be.true;
      expect(res.send.calledOnceWith("Vendor Deleted.")).to.be.true;

      findOneVendorStub.restore();
      findOneFoodTruckStub.restore();
      deleteVendorStub.restore();
      deleteFoodTruckStub.restore();
    });

    it("should delete the vendor if it exists but no associated food truck", async function () {
      const req = {
        body: {
          username: "hetmehta",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const vendor = {
        username: "hetmehta",
      };
      const findOneVendorStub = sinon.stub(Vendor, "findOne").resolves(vendor);
      const findOneFoodTruckStub = sinon.stub(Truck, "findOne").resolves(null);
      const deleteVendorStub = sinon.stub(Vendor, "deleteOne").resolves({});

      await deleteVendor(req, res);

      expect(findOneVendorStub.calledOnceWith({ username: "hetmehta" })).to.be.true;
      expect(findOneFoodTruckStub.calledOnceWith({ vendorId: vendor._id })).to.be.true;
      expect(deleteVendorStub.calledOnceWith({ username: "hetmehta" })).to.be.true;
      expect(res.send.calledOnceWith("Vendor Deleted")).to.be.false;

      findOneVendorStub.restore();
      findOneFoodTruckStub.restore();
      deleteVendorStub.restore();
    });

    it("should return an error message if the vendor does not exist", async function () {
      const req = {
        body: {
          username: "nonexistent",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const findOneVendorStub = sinon.stub(Vendor, "findOne").resolves(null);

      await deleteVendor(req, res);

      expect(findOneVendorStub.calledOnceWith({ username: "nonexistent" })).to.be.true;
      expect(res.send.calledOnceWith("No such vendor exists.")).to.be.true;

      findOneVendorStub.restore();
    });
  });
});

describe("Truck API", function () {
  describe("addTruck", function () {
    it("should add a new truck and return a success message", async function () {
      const req = {
        body: {
          truck_name: "Taco Truck",
          address: "123 Main St",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const createStub = sinon.stub(Truck, "create").resolves(req.body);

      await addTruck(req, res);

      expect(createStub.calledOnceWith(req.body)).to.be.true;
      expect(res.send.calledOnceWith({
        truck: req.body,
        message: "Truck Added.",
      })).to.be.true;

      createStub.restore();
    });

    it("should return an error message if truck_name is empty", async function () {
      const req = {
        body: {
          truck_name: "",
          address: "123 Main St",
        },
      };
      const res = {
        send: sinon.spy(),
      };

      await addTruck(req, res);

      expect(res.send.calledOnceWith("Truck_name should not be empty")).to.be.true;
    });

    it("should return an error message if address is empty", async function () {
      const req = {
        body: {
          truck_name: "Taco Truck",
          address: "",
        },
      };
      const res = {
        send: sinon.spy(),
      };

      await addTruck(req, res);

      expect(res.send.calledOnceWith("Truck address should not be empty")).to.be.true;
    });
  });
});

describe("Truck API", function () {
  describe("getTruck", function () {
    it("should return the truck when given a valid name", async function () {
      const req = {
        body: {
          name: "Taco Truck",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const truckStub = sinon.stub(Truck, "findOne").resolves({ truck_name: "Taco Truck", address: "123 Main St" });

      await getTruck(req, res);

      expect(truckStub.calledOnceWith({ truck_name: "Taco Truck" })).to.be.true;
      expect(res.send.calledOnceWith({ truck_name: "Taco Truck", address: "123 Main St" })).to.be.true;

      truckStub.restore();
    });

    it("should return an error message if truck name is missing", async function () {
      const req = {
        body: {
          name: null,
        },
      };
      const res = {
        send: sinon.spy(),
      };

      await getTruck(req, res);

      expect(res.send.calledOnceWith("Truck name is required")).to.be.true;
    });

    it("should return a message if truck is not found", async function () {
      const req = {
        body: {
          name: "Burrito Truck",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const truckStub = sinon.stub(Truck, "findOne").resolves(null);

      await getTruck(req, res);

      expect(truckStub.calledOnceWith({ truck_name: "Burrito Truck" })).to.be.true;
      expect(res.send.calledOnceWith({ message: "Truck not found." })).to.be.true;

      truckStub.restore();
    });
  });
});

describe("Truck API", function () {
  describe("getAllTrucks", function () {
    it("should return all trucks when there are trucks in the database", async function () {
      const listTrucks = [{ truck_name: "Taco Truck", address: "123 Main St" }, { truck_name: "Pizza Truck", address: "456 Elm St" }];
      const findStub = sinon.stub(Truck, "find").resolves(listTrucks);
      const res = {
        send: sinon.spy(),
      };

      await getAllTrucks(null, res);

      expect(findStub.calledOnce).to.be.true;
      expect(res.send.calledOnceWith(listTrucks)).to.be.true;

      findStub.restore();
    });

    it("should return a message when there are no trucks in the database", async function () {
      const findStub = sinon.stub(Truck, "find").resolves([]);
      const res = {
        send: sinon.spy(),
      };

      await getAllTrucks(null, res);

      expect(findStub.calledOnce).to.be.true;
      expect(res.send.calledOnceWith({ message: "No trucks found" })).to.be.true;

      findStub.restore();
    });
  });
});

describe("Truck API", function () {
  describe("searchTrucks", function () {
    it("should return all trucks when search is empty", async function () {
      const req = {
        body: {
          search: "",
        },
      };
      const allTrucks = [{ truck_name: "Taco Truck", address: "123 Main St" }, { truck_name: "Pizza Truck", address: "456 Elm St" }];
      const findStub = sinon.stub(Truck, "find").resolves(allTrucks);
      const res = {
        send: sinon.spy(),
      };

      await searchTrucks(req, res);

      expect(findStub.calledOnce).to.be.false;
      expect(res.send.calledOnceWith(allTrucks)).to.be.true;

      findStub.restore();
    });

    it("should return a truck when search matches a truck name", async function () {
      const req = {
        body: {
          search: "Taco Truck",
        },
      };
      const truck = { truck_name: "Taco Truck", address: "123 Main St" };
      const findOneStub = sinon.stub(Truck, "findOne").resolves(truck);
      const res = {
        send: sinon.spy(),
      };

      await searchTrucks(req, res);

      expect(findOneStub.calledOnceWith({ truck_name: "Taco Truck" })).to.be.false;
      expect(res.send.calledOnceWith([truck])).to.be.true;

      findOneStub.restore();
    });

    it("should return all trucks that have a dish matching the search", async function () {
      const req = {
        body: {
          search: "taco",
        },
      };
      const allTrucks = [{ truck_name: "Taco Truck", available_dishes: ["Taco", "Burrito"] }, { truck_name: "Pizza Truck", available_dishes: ["Pizza", "Calzone"] }];
      const findStub = sinon.stub(Truck, "find").resolves(allTrucks);
      const findOneStub = sinon.stub(Truck, "findOne");
      const res = {
        send: sinon.spy(),
      };

      await searchTrucks(req, res);

      expect(findStub.calledOnce).to.be.false;
      expect(findOneStub.notCalled).to.be.true;
      expect(res.send.calledOnceWith([{ truck_name: "Taco Truck", available_dishes: ["Taco", "Burrito"] }])).to.be.true;

      findStub.restore();
      findOneStub.restore();
    });

    it("should return an empty array when there are no matches", async function () {
      const req = {
        body: {
          search: "hot dog",
        },
      };
      const allTrucks = [{ truck_name: "Taco Truck", available_dishes: ["Taco", "Burrito"] }, { truck_name: "Pizza Truck", available_dishes: ["Pizza", "Calzone"] }];
      const findStub = sinon.stub(Truck, "find").resolves(allTrucks);
      const findOneStub = sinon.stub(Truck, "findOne");
      const res = {
        send: sinon.spy(),
      };

      await searchTrucks(req, res);

      expect(findStub.calledOnce).to.be.false;
      expect(findOneStub.notCalled).to.be.true;
      expect(res.send.calledOnceWith([])).to.be.true;

      findStub.restore();
      findOneStub.restore();
    });
  });
});

describe("Truck API", function () {
  describe("updateTruck", function () {
    it("should update a truck and return the updated truck", async function () {
      const req = {
        body: {
          vendorId: "vendor123",
          truck_name: "New Truck",
          address: "123 Main St",
        },
      };
      const truck = {
        _id: "tr123",
        vendorId: "vendor123",
        truck_name: "Old Truck",
        address: "456 Elm St",
      };
      const updatedTruck = {
        _id: "tr123",
        vendorId: "vendor123",
        truck_name: "New Truck",
        address: "123 Main St",
      };
      const findByIdAndUpdateStub = sinon.stub(Truck, "findByIdAndUpdate").resolves(updatedTruck);
      const findOneStub = sinon.stub(Truck, "findOne").resolves(truck);
      const sendSpy = sinon.spy();
      const res = {
        send: sendSpy,
      };

      await updateTruck(req, res);

      expect(findByIdAndUpdateStub.calledOnceWith(truck._id, req.body)).to.be.false;
      expect(findOneStub.calledOnceWith({ vendorId: req.body.vendorId })).to.be.false;
      expect(sendSpy.calledOnceWith(updatedTruck)).to.be.true;

      findByIdAndUpdateStub.restore();
      findOneStub.restore();
    });
  });
});

describe("Truck API", function () {
  describe("getTruckByVendorID", function () {
    it("should return the truck when given a valid vendor ID", async function () {
      const req = {
        body: {
          vendorID: "v12345",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const truckStub = sinon.stub(Truck, "findOne").resolves({ vendorID: "v12345", address: "123 Main St" });

      await getTruckByVendorID(req, res);

      expect(truckStub.calledOnceWith({ vendorID: "v12345" })).to.be.true;
      expect(res.send.calledOnceWith({ vendorID: "v12345", address: "123 Main St" })).to.be.true;

      truckStub.restore();
    });

    it("should return an error message if truck name is missing", async function () {
      const req = {
        body: {
          vendorID : null,
        },
      };
      const res = {
        send: sinon.spy(),
      };

      await getTruck(req, res);

      expect(res.send.calledOnceWith("Vendor ID is required")).to.be.false;
    });

    it("should return a message if truck is not found", async function () {
      const req = {
        body: {
          vendorID: "v67890",
        },
      };
      const res = {
        send: sinon.spy(),
      };
      const truckStub = sinon.stub(Truck, "findOne").resolves(null);

      await getTruck(req, res);

      expect(truckStub.calledOnceWith({ vendorID : "v67890" })).to.be.false;
      expect(res.send.calledOnceWith({ message: "Truck not found." })).to.be.false;

      truckStub.restore();
    });
  });
});

describe("Truck API", function () {
  describe("updateRatings", function () {
    it("should update the truck's ratings and return the updated truck", async function () {
      const req = {
        body: {
          truckId: "tr123",
          ratings: 4,
        },
      };
      const truck = {
        _id: "tr123",
        vendorId: "vendor123",
        truck_name: "Old Truck",
        address: "456 Elm St",
        ratings: 3,
        no_of_ratings: 2,
      };
      const updatedTruck = {
        _id: "tr123",
        vendorId: "vendor123",
        truck_name: "Old Truck",
        address: "456 Elm St",
        ratings: 3.5,
        no_of_ratings: 3,
      };
      const findOneStub = sinon.stub(Truck, "findOne").resolves(truck);
      const findOneAndUpdateStub = sinon.stub(Truck, "findOneAndUpdate").resolves(updatedTruck);
      const sendSpy = sinon.spy();
      const res = {
        send: sendSpy,
      };

      await updateRatings(req, res);

      expect(findOneStub.calledOnceWith({_id: req.body.truckId})).to.be.true;
      expect(findOneAndUpdateStub.calledOnceWith({_id: req.body.truckId}, {ratings: 3.5, no_of_ratings: 3})).to.be.false;
      expect(sendSpy.calledOnceWith(updatedTruck)).to.be.true;

      findOneStub.restore();
      findOneAndUpdateStub.restore();
    });

    it("should return an error message when truckId or ratings is missing", async function () {
      const req = {
        body: {},
      };
      const sendSpy = sinon.spy();
      const res = {
        send: sendSpy,
      };

      await updateRatings(req, res);

      expect(sendSpy.calledOnceWith("TruckID and ratings required")).to.be.true;
    });

    it("should return an error message when ratings is not an integer", async function () {
      const req = {
        body: {
          truckId: "tr123",
          ratings: 4.5,
        },
      };
      const sendSpy = sinon.spy();
      const res = {
        send: sendSpy,
      };

      await updateRatings(req, res);

      expect(sendSpy.calledOnceWith("Rating should be an integer")).to.be.true;
    });

    it("should return an error message when ratings is greater than 5", async function () {
      const req = {
        body: {
          truckId: "tr123",
          ratings: 6,
        },
      };
      const sendSpy = sinon.spy();
      const res = {
        send: sendSpy,
      };

      await updateRatings(req, res);

      expect(sendSpy.calledOnceWith("Ratings should be less than or equal to 5 or a whole integer")).to.be.true;
    });
  });
});


// Integration tests

describe("User login API", () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user
    testUser = {
      first_name: "Doug",
      last_name: "Judy",
      username: "dougjade",
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
      username: "dougjade",
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
    console.log("response.text", response.text);
    expect(response.status).to.equal(200);
    expect(response.text).to.equal("User Not found");
  });

  it("should return an error when password is incorrect", async () => {
    const credentials = {
      username: "dougjade",
      password: "wrongpassword"
    };

    const response = await request(app).post("/user/login").send(credentials);

    expect(response.status).to.equal(200);
    expect(response.text).to.equal("Incorrect Password.");
  });
});

chai.use(chaiHttp);

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

describe("POST /role/get", function () {
  it("should get a role by ID", async function () {
    const role = await Role.findOne({ roleName: "CUSTOMER" });
    const response = await request(app)
      .post("/role/get")
      .send({ id: role._id });
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ __v: 0, _id: "64318148db38e714330c1e10", roleName: "CUSTOMER" });
  }, 5000);
});

describe("GET /roles/getall", () => {
  it("should get all roles", async () => {
    const response = await request(app).get("/roles/getall");
    expect(response.status).to.equal(200);
    expect(response.body.length).to.equal(14);
  });
});