const Vendor = require("../models/vendor");
const Truck = require("../models/trucks");
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
    } catch (error) {
        res.send("Error occurred.");
    }
}

async function vendorLogin(req, res) {
    const { username, password } = req.body;
    const vendor = await Vendor.findOne({ username: username });
    if (vendor == null) {
    res.send("Vendor Not found");
    return;
    }
    const comparePassword = bcrypt.compareSync(password, vendor.password);
    if (comparePassword == true) {
    return res.send("Successfully logged in.");
    }
    return res.send("Incorrect Password.");
}

async function vendorGet(req, res) {
    try {
        const vendor = req.body.username;
        const getVendor = await Vendor.findOne({ username: vendor });
        if (getVendor == null) {
            res.send("Vendor not found.");
        } else {
            res.send(getVendor);
        }
    } catch (error) {
        console.log("Error:", error);
    }
}

async function getAllVendors(req, res) {
    const listVendors = await Vendor.find();
    if (listVendors.length === 0) {
      return res.send({ message: "No vendors found" });
    } else {
      res.send(listVendors);
    }
}  

async function deleteVendor(req, res) {
    const { username } = req.body;
  
    // Find the vendor with the given username
    const vendor = await Vendor.findOne({ username });
  
    if (!vendor) {
      // If no vendor found, return an error message
      return res.send("No such vendor exists.");
    }
  
    // Find the associated food truck, if any
    const foodTruck = await Truck.findOne({ vendorId: vendor._id });
  
    // Delete the vendor
    await Vendor.deleteOne({ username });
  
    if (foodTruck) {
      // If there is an associated food truck, delete it as well
      await Truck.findOneAndDelete({ vendorId: vendor._id });
    }
  
    // Return success message
    return res.send("Vendor Deleted.");
}
  

module.exports = {
    vendorSignUp,vendorLogin,vendorGet, getAllVendors, deleteVendor
};