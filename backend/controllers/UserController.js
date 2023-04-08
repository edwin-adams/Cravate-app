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

// Role API's

router.post("/role/add", async function (req, res) {
  const body = req.body;
  const findRoles = await Role.findOne({ roleName: body.role });
  if(findRoles !== null) {
    res.send("Role Already Exists");
    return;
  }
  const addRole = await Role.create({ roleName: body.role });
  res.send("Role Created");
});

router.post("/role/get", async function (req, res) {
  try {
    const roleID = req.body.id;
    const getRole = await Role.findOne({ _id: roleID });
    if (getRole == null) {
      res.send("Role not found.");
    } else {
      res.send(getRole);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
  const adminExists = await Admin.findOne({ username: username });
  if (!(adminExists == null)) {
    res.send({ message: "Admin Exists" });
  }
  const addAdmin = await Admin.create({
    first_name,
    last_name,
    username,
    password: pass,
    role: "ADMIN",
  });
  const token = jwt.sign(
    { user_id: addAdmin._id, username, role: "ADMIN" },
    TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );

  addAdmin.token = token;

  res.send(addAdmin);
});

router.get("/roles/getall", async function (req, res) {
  const listRoles = await Role.find();
  if (listRoles == "") {
    return res.send({ message: "No roles found" });
  }
  res.send(listRoles);
});

router.delete("/role/delete", async function (req, res) {
  const id = req.body._id;
  const role = await Role.findOne(id);
  if (role == null) {
    res.send("Role Not found");
    return;
  }
  const deleteRole = await Role.deleteOne(role);
  res.send("Role Deleted.");
});

// User API's

router.post("/user/signUp", async function (req, res) {
  const { first_name, last_name, username, password } = req.body;
  const pass = bcrypt.hashSync(password, 10);
  if (!(username && password && first_name && last_name)) {
    res.status(400).send("Provide all details.");
  }
  const userExists = await User.findOne({ username: username });
  if (!(userExists == null)) {
    return res.send({ message: "User Exists" });
  }
  const addUser = await User.create({
    first_name,
    last_name,
    username,
    password: pass,
    role: "USER",
  });
  const token = jwt.sign(
    { user_id: addUser._id, username, role: "USER" },
    TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );

  addUser.token = token;

  res.send(addUser);
});

router.post("/user/login", async function (req, res) {
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
});

router.post("/user/get", async function (req, res) {
  try {
    const user = req.body.username;
    const getUser = await User.findOne({ username: user });
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
});

router.get("/users/getall", async function (req, res) {
  const listUsers = await User.find();
  console.log("Users", listUsers);
  if (listUsers == "") {
    return res.send({ message: "No users found" });
  }
  res.send(listUsers);
});

router.delete("/user/delete", async function (req, res) {
  const usn = req.body.username;
  const user = await User.findOne({ username: usn });
  if (user == null) {
    res.send("No such user exists.");
  } else {
    const deleteUser = await User.deleteOne({ username: usn });
    res.send("User Deleted.");
  }
});

// Admin API's

router.post("/admin/signUp", async function (req, res) {
  const { first_name, last_name, username, password } = req.body;
  const pass = bcrypt.hashSync(password, 10);
  if (!(username && password && first_name && last_name)) {
    res.status(400).send("Provide all details.");
  }
  const addAdmin = await Admin.create({
    first_name,
    last_name,
    username,
    password: pass,
    role: "ADMIN",
  });
  const token = jwt.sign(
    { user_id: addAdmin._id, username, role: "ADMIN" },
    TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );

  addAdmin.token = token;
  res.send(addAdmin);
});

router.post("/admin/login", async function (req, res) {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username: username });
  if (admin == null) {
    res.send("Admin Not found");
    return;
  }
  const comparePassword = bcrypt.compareSync(password, admin.password);
  if (comparePassword == true) {
    return res.send("Successfully logged in.");
  } else {
    return res.send("Incorrect Password.");
  }
});

router.post("/admin/get", async function (req, res) {
  try {
    const admin = req.body.firstname;
    const getAdmin = await User.findOne({ first_name: admin });
    if (getAdmin == null) {
      res.send("Admin not found.");
    } else {
      res.send(getAdmin);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
});

router.get("/admins/getall", async function (req, res) {
  const listAdmins = await Admin.find();
  console.log("Admins", listAdmins);
  if (listAdmins == "") {
    return res.send({ message: "No admins found" });
  }
  res.send(listAdmins);
});

router.delete("/admin/delete", async function (req, res) {
  const usn = req.body.username;
  const admin = await Admin.findOne({ username: usn });
  if (admin == null) {
    res.send("No such admin exists.");
  } else {
    const deleteAdmin = await Admin.deleteOne({ username: usn });
    res.send("Admin Deleted.");
  }
});

// Vendor API's

router.post("/vendor/signUp", async function (req, res) {
  try {
    const { first_name, last_name, username, password } = req.body;
    const pass = bcrypt.hashSync(password, 10);
    if (!(username && password && first_name && last_name)) {
      res.status(400).send("Provide all details.");
    }
    const addVendor = await Vendor.create({
      first_name,
      last_name,
      username,
      password: pass,
      role: "VENDOR",
    });
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
    res.send("Error occured.");
  }
});

router.post("/vendor/login", async function (req, res) {
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
});

router.post("/vendor/get", async function (req, res) {
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
});

router.get("/vendors/getall", async function (req, res) {
  const listVendors = await Vendor.find();
  console.log("Vendors", listVendors);
  if (listVendors == "") {
    return res.send({ message: "No vendors found" });
  } else {
    res.send(listVendors);
  }
});

router.delete("/vendor/delete", async function (req, res) {
  const usn = req.body.username;
  const vendor = await Vendor.findOne({ username: usn });
  if (vendor == null) {
    res.send("No such vendor exists.");
  } else {
    const deleteVendor = await Vendor.deleteOne({ username: usn });
    const isFoodTruckOfVendor = await Truck.findOne({ vendorId: vendor._id });
    if (isFoodTruckOfVendor == null) {
      console.log("No food Truck Found for the vendor");
      res.send("Vendor Deleted");
      return;
    }
    const foodTruckOfVendor = await Truck.findOneAndDelete({
      vendorId: vendor._id,
    });
    console.log("Food Truck Deleted");
    res.send("Vendor Deleted.");
  }
});

// Truck API's

router.post("/truck/add", async function (req, res) {
  const body = req.body;
  if (body.truck_name == null) {
    res.send("Truck_name should not be empty");
  }
  if (body.address == null) {
    res.send("Truck address should not be empty");
  }
  const addTruck = await Truck.create(body);
  res.send({
    truck: addTruck,
    message: "Truck Added.",
  });
});

router.post("/truck/get", async function (req, res) {
  try {
    const truck = req.body.name;
    if (truck == null) {
      res.send("Truck name is required");
    }
    const getTruck = await Truck.findOne({ truck_name: truck });
    if (getTruck == null) {
      res.send({ message: "Truck not found." });
    } else {
      res.send(getTruck);
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

router.get("/truck/getall", async function (req, res) {
  const listTrucks = await Truck.find();
  if (listTrucks == "") {
    return res.send({ message: "No trucks found" });
  }
  res.send(listTrucks);
});

router.post("/truck/addDish", async function (req, res) {
  const id = req.body.truckId;
  const truck = await Truck.findById(id);
  if (truck == null) {
    res.send({ message: "Truck Not found" });
    return;
  }
  truck.available_dishes = req.body.dishes;
  const updatedTruck = await truck.save();
  res.send({ truck: updatedTruck });
});

router.post("/search", async function (req, res) {
  const search = req.body.search;
  const lowerCaseSearch = search.toLowerCase();
  if(search == "") {
    const allTrucks = await Truck.find();
    res.send(allTrucks);
    return;
  }
  const array1 = [];
  const isTruckSearch = await Truck.findOne({ truck_name: search });
  array1.push(isTruckSearch);
  if (isTruckSearch == null) {
    const TruckArray = await Truck.find();
    const dishArray = [];
    for (let i = 0; i < TruckArray.length; i++) {
      const truck = {
        name: TruckArray[i].truck_name,
        dishes: TruckArray[i].available_dishes,
      };
      dishArray.push(truck);
    }

    let foundItems = [];
    let finalArray = [];
    
    for (let i = 0; i < dishArray.length; i++) {
      const dishes = dishArray[i].dishes.map(dish => dish.toLowerCase());
      if(dishes.includes(lowerCaseSearch)){
        foundItems.push(dishArray[i].name);
      }
    }

    if (foundItems.length > 0) {
      console.log(`Found ${search} in the following trucks:`, foundItems);
      for (let i = 0; i < foundItems.length; i++) {
        const element = foundItems[i];
        const trucks = await Truck.findOne({truck_name: element});
        finalArray.push(trucks);
      }
    } else {
      res.send(finalArray);
      return;
    }
    res.send(finalArray);
    return;
  }
  res.send(array1);
});

router.post("/truck/update", async function (req, res) {
  const body = req.body;
  const truck = await Truck.findOne({vendorId: req.body.vendorId});
  const truckUpdated = await Truck.findByIdAndUpdate(truck._id, req.body);
  const truck2 = await Truck.findOne({vendorId: req.body.vendorId});
  res.send(truck2);
});

router.post("/truck/getByVendorId", async function (req, res) {
  try {
    const vendorId = req.body.vendorId;
    if (vendorId == null) {
      res.send("VendorId is required");
    }
    const getTruck = await Truck.findOne({ vendorId: vendorId });
    if (getTruck == null) {
      res.send({ message: "Truck not found." });
    } else {
      res.send(getTruck);
    }
  } catch (error) {
    console.log("Error:", error);
  }
});

router.post("/truck/ratings", async function (req, res) {
    try {
      const body = req.body;
      console.log(body);
      if(body.truckId == null || (body.ratings == null || body.ratings == '') ) {
        res.send("TruckID and ratings required");
        return;
      }
      if(!Number.isInteger(body.ratings)) {
        if(body.ratings > 5){
          res.send("Ratings should be less than or equal to 5 or an whole integer");
          return;
        };
        res.send("Rating should be an integer");
        return;
      };
      const truck = await Truck.findOne({_id: body.truckId});
      if(truck == null) {
        console.log("Truck Not found");
      }
      const ratingCount = truck.no_of_ratings || 1;
      console.log(ratingCount, "ratingCount");
      if (truck.ratings == undefined) {
        truck.ratings = 0;
      }
      console.log(truck.ratings, "truck.ratings");
      const totalRatings = truck.ratings + body.ratings;
      console.log(totalRatings, "totalRatings");
      const avgRatings = (totalRatings/ratingCount);
      console.log(avgRatings, "avgRatings");
      const truckUpdate = await Truck.findOneAndUpdate({_id: body.truckId}, {ratings: avgRatings, no_of_ratings: ratingCount+1});
      const updatedTruck = await Truck.findOne({_id: body.truckId});
      res.send(updatedTruck);
    } catch (error) {
      console.log(error);
    }
});

module.exports = router;
