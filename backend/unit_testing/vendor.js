const Vendor = require("../models/vendor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = "DCMXIXvHBH";

async function vendorSignUp(req, res) {
    try {
        const { first_name, last_name, username, password } = req.body;
        const pass = bcrypt.hashSync(password, 10);
        if (!(username && password && first_name && last_name)) {
            return res.status(400).send("Provide all details.");
        }
        const addVendor = {
            first_name,
            last_name,
            username,
            password: pass,
            role: "VENDOR",
        };
        const token = jwt.sign(
            { user_id: addVendor._id, username, role: "VENDOR" },
            TOKEN_KEY,
            {
            expiresIn: "2h",
            }
        );
        addVendor.token = token;
        res.send(addVendor);
    } catch (Error) {
        res.send("Error occurred.");
    }
}

module.exports = {
    vendorSignUp
};