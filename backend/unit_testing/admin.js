const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = "DCMXIXvHBH";

const adminSignUp = async (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    const pass = bcrypt.hashSync(password, 10);
    if (!(username && password && first_name && last_name)) {
      return res.status(400).send("Provide all details.");
    }
    const adminExists = await Admin.findOne({ username: username });
    if (adminExists !== null) {
      return res.send({ message: "Admin Exists" });
    }
    const addAdmin = {
      first_name,
      last_name,
      username,
      password: pass,
      role: "ADMIN",
      token: "testtoken",
    };
    const token = jwt.sign(
      { admin_id: addAdmin._id, username, role: "ADMIN" },
      TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
  
    addAdmin.token = token;
  
    res.send(addAdmin);
}

async function adminLogin(req, res) {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username });
  
    if (admin == null) {
      return res.send("Admin Not found");
    }
  
    const comparePassword = bcrypt.compareSync(password, admin.password);
  
    if (comparePassword == true) {
      return res.send("Successfully logged in.");
    } else {
      return res.send("Incorrect Password.");
    }
}

async function getAdmin(req, res) {
    try {
      const user = req.body.username;
      const getAdmin = { username: user, email: `${user}@example.com` }; // Simulating the response from the database
      if (getAdmin == null) {
        console.log("Admin not found.");
        return res.send("Admin not found.");
      } else {
        return res.send(getAdmin);
      }
    } catch (error) {
      console.log("Error: ", error);
      return;
    }
}

async function getAllAdmins(req, res) {
    try {
        const listAdmins = await Admin.find();
        console.log("Admins", listAdmins);
        if (listAdmins.length === 0) {
                return res.send({ message: "No Admins found" });
        }
        res.send(listAdmins);
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).send({ message: "Server error" });
    }
}

async function deleteAdmin(req, res) {
    const usn = req.body.username;
    const admin = await Admin.findOne({ username: usn });
    if (admin == null) {
      res.send("No such admin exists.");
    } else {
      await Admin.deleteOne({ username: usn });
      res.send("Admin Deleted.");
    }
  }
  

module.exports = {
    adminSignUp, adminLogin, getAdmin, getAllAdmins, deleteAdmin
};