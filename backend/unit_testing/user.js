const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = "DCMXIXvHBH";

const signUp = async (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    const pass = bcrypt.hashSync(password, 10);
    if (!(username && password && first_name && last_name)) {
      return res.status(400).send("Provide all details.");
    }
    const userExists = await User.findOne({ username: username });
    if (userExists !== null) {
      return res.send({ message: "User Exists" });
    }
    const addUser = {
      first_name,
      last_name,
      username,
      password: pass,
      role: "USER",
      token: "testtoken",
    };
    const token = jwt.sign(
      { user_id: addUser._id, username, role: "USER" },
      TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
  
    addUser.token = token;
  
    res.send(addUser);
}

async function login(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
  
    if (user == null) {
      return res.send("User Not found");
    }
  
    const comparePassword = bcrypt.compareSync(password, user.password);
  
    if (comparePassword == true) {
      return res.send("Successfully logged in.");
    } else {
      return res.send("Incorrect Password.");
    }
}

async function getUser(req, res) {
    try {
      const user = req.body.username;
      const getUser = { username: user, email: `${user}@example.com` }; // Simulating the response from the database
      if (getUser == null) {
        console.log("User not found.");
        return res.send("User not found.");
      } else {
        return res.send(getUser);
      }
    } catch (error) {
      console.log("Error: ", error);
      return;
    }
}

async function getAllUsers(req, res) {
    try {
        const listUsers = await User.find();
        console.log("Users", listUsers);
        if (listUsers.length === 0) {
                return res.send({ message: "No users found" });
        }
        res.send(listUsers);
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).send({ message: "Server error" });
    }
}

async function deleteUser(req, res) {
    const usn = req.body.username;
    const user = await User.findOne({ username: usn });
    if (user == null) {
      res.send("No such user exists.");
    } else {
      await User.deleteOne({ username: usn });
      res.send("User Deleted.");
    }
  }
  

module.exports = {
    signUp, login, getUser, getAllUsers, deleteUser
};