const router = require("express").Router();
const User = require("../models/user");
const Admin = require("../models/admin");
const Role = require("../models/role");
const Vendor = require("../models/vendor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const TOKEN_KEY = 'DCMXIXvHBH';

router.get("/user/get", async function (req, res) {
    const listUsers = await User.find();
    console.log("Users", listUsers);
    if(listUsers == '') {
        return res.send({message: 'No users found'});
    };
    res.send(listUsers);
});

// router.post("/add", async function(req, res) {
//     const body = { 
//         title: req.body.title,
//         author: req.body.author,
//         cost: req.body.cost
//     };
//     const addBookToDB = await Book.create(body);
//     console.log(addBookToDB);
//     res.send(body);
// });

// router.put("/edit", async function (req, res){
//     const id = req.body.id;
//     const book = await Book.findOne({_id: id});
//     if(!book) {
//         return res.send({message: 'Book Not Found'});
//     }
//     const body = req.body;
//     const bookToBeUpdated = await Book.findOneAndUpdate({ _id: id}, body);
//     const updatedBook = await Book.findOne({_id: id});
//     console.log(updatedBook);
//     res.send(updatedBook);
// });

// router.delete("/delete/:id", async function (req, res) {
//     const id = req.params.id;
//     const deleteBook = await Book.findByIdAndDelete({_id: id});
//     res.send({message: 'Book deleted'});
// });

// router.post("/signIn", async function (req, res) {
//     // const token = jwtDecode(req.headers.token);

//     // const role = token.role;
//     const { username, password } = req.body;
//     // if(role == 'USER') {
//         const user = await User.findOne({username: username});
//         const comparePassword = bcrypt.compareSync(password, user.password);
//         if(comparePassword == true) {
//             return res.send({message: "SignIn successfull"});
//         }
//         return res.send({message: "Incorrect Password"});
//     // }
//     // else{
//         const admin = await User.findOne({username: username});
//         const comparePassword = bcrypt.compareSync(password, admin.password);
//         if(comparePassword == true) {
//             return res.send({message: "SignIn successfull"});
//         }
//         return res.send({message: "Incorrect Password"});
//     // }
// });

router.post("/admin/signUp", async function (req, res) {
    const { first_name, last_name, username, password } = req.body;
    const pass = bcrypt.hashSync(password, 10);
    if (!(username && password && first_name && last_name)) {
        res.status(400).send("All input is required");
    }
    const addAdmin = await Admin.create({
        first_name,
        last_name,
        username,
        password: pass,
        role: "ADMIN"
    });
    const token = jwt.sign(
        {user_id: addAdmin._id, username, role: "ADMIN"},
        TOKEN_KEY,
        {
            expiresIn: "2h"
        }
    );

    addAdmin.token = token;

    res.send(addAdmin);
});

router.post("/user/signUp", async function (req, res) {
    const { first_name, last_name, username, password } = req.body;
    const pass = bcrypt.hashSync(password, 10);
    if (!(username && password && first_name && last_name)) {
        res.status(400).send("All input is required");
    }
    const addUser = await User.create({
        first_name,
        last_name,
        username,
        password: pass,
        role: "USER"
    });
    const token = jwt.sign(
        {user_id: addUser._id, username, role: "USER"},
        TOKEN_KEY,
        {
            expiresIn: "2h"
        }
    );

    addUser.token = token;

    res.send(addUser);
});

router.post("/vendor/signUp", async function (req, res) {
    const { first_name, last_name, username, password } = req.body;
    const pass = bcrypt.hashSync(password, 10);
    if (!(username && password && first_name && last_name)) {
        res.status(400).send("All input is required");
    }
    const addVendor = await Vendor.create({
        first_name,
        last_name,
        username,
        password: pass,
        role: "VENDOR"
    });
    const token = jwt.sign(
        {user_id: addVendor._id, username, role: "VENDOR"},
        TOKEN_KEY,
        {
            expiresIn: "2h"
        }
    );

    addVendor.token = token;

    res.send(addVendor);
});

router.get("/vendor/login", async function (req, res) {
    const { username, password } = req.body;
        const vendor = await Vendor.findOne({username: username});
        const comparePassword = bcrypt.compareSync(password, vendor.password);
        if(comparePassword == true) {
            return res.send({message: "SignIn successfull"});
        }
        return res.send({message: "Incorrect Password"});
});

router.get("/user/login", async function (req, res) {
    const { username, password } = req.body;
        const user = await User.findOne({username: username});
        const comparePassword = bcrypt.compareSync(password, user.password);
        if(comparePassword == true) {
            return res.send({message: "SignIn successfull"});
        }
        return res.send({message: "Incorrect Password"});
});

router.get("/admin/login", async function (req, res) {
    const { username, password } = req.body;
        const admin = await Admin.findOne({username: username});
        const comparePassword = bcrypt.compareSync(password, admin.password);
        if(comparePassword == true) {
            return res.send({message: "SignIn successfull"});
        }
        return res.send({message: "Incorrect Password"});
});

router.post("/role/add", async function (req, res) {
    const body = req.body;
    const addRole = await Role.create({ roleName: body.role});
    res.send({ message: 'Role Created'});
});

router.delete("/role/delete", async function (req, res) {
    const id = req.body._id;
    const role = await Role.findOne(id);
    const deleteRole = await Role.deleteOne(role);
    res.send({ message : 'Role deleted'});
});

router.get("/role/get", async function (req, res) {
    const getRoles = await Role.find();
    res.send(getRoles);
});

module.exports = router;