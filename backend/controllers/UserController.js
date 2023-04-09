const router = require("express").Router();
const User = require("../models/user");
const Admin = require("../models/admin");
const Role = require("../models/role");
const Vendor = require("../models/vendor");
const Truck = require("../models/trucks");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = "DCMXIXvHBH";

// Role API's
//This API is designed to add a new role to a database if it doesn't already exist.
router.post("/role/add", async function (req, res) {
  const body = req.body;
  const findRoles = await Role.findOne({ roleName: body.role });
  if(findRoles !== null) {
    res.send("Role Already Exists");
    return;
  }
  await Role.create({ roleName: body.role });
  res.send("Role Created");
});


//This API is designed to retrieve a specific role from a database based on the role ID provided in the request body.
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
});

//This API is designed to retrieve all roles from a database and return them to the client.
router.get("/roles/getall", async function (req, res) {
  const listRoles = await Role.find();
  if (listRoles == "") {
    return res.send({ message: "No roles found" });
  }
  res.send(listRoles);
});

//This API is designed to delete a specific role from a database based on the role ID provided in the request body.
router.delete("/role/delete", async function (req, res) {
  const id = req.body._id;
  const role = await Role.findOne(id);
  if (role == null) {
    res.send("Role Not found");
    return;
  }
  await Role.deleteOne(role);
  res.send("Role Deleted.");
});

// User API's
//This API is designed to handle user sign-up requests, adding a new user to the database if all required fields are provided and the user does not already exist.
router.post("/user/signUp", async function (req, res) {
  const { first_name, last_name, username, password } = req.body;
  const pass = bcrypt.hashSync(password, 10);
  if (!(username && password && first_name && last_name)) {
    res.status(400).send("Provide all details.");
  }
  const userExists = await User.findOne({ username: username });
  if (userExists !== null) {
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

//This API  is designed to handle user login requests by verifying the user's credentials and returning a response indicating whether the login was successful or not.
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

//This API is designed to handle requests to retrieve user data from the database based on the provided username.
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

// This API is designed to handle requests to retrieve all user data from the database.
router.get("/users/getall", async function (req, res) {
  const listUsers = await User.find();
  console.log("Users", listUsers);
  if (listUsers == "") {
    return res.send({ message: "No users found" });
  }
  res.send(listUsers);
});

//This API is designed to handle requests to delete a user from the database based on their username.
router.delete("/user/delete", async function (req, res) {
  const usn = req.body.username;
  const user = await User.findOne({ username: usn });
  if (user == null) {
    res.send("No such user exists.");
  } else {
    await User.deleteOne({ username: usn });
    res.send("User Deleted.");
  }
});

// Admin API's
//This API is designed to handle admin sign-up requests, adding a new admin to the database if all required fields are provided and the admin does not already exist.
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

//This API  is designed to handle admin login requests by verifying the admin's credentials and returning a response indicating whether the login was successful or not.
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

//This API is designed to handle requests to retrieve admin data from the database based on the provided first name.
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

// This API is designed to handle requests to retrieve all admin data from the database.
router.get("/admins/getall", async function (req, res) {
  const listAdmins = await Admin.find();
  console.log("Admins", listAdmins);
  if (listAdmins == "") {
    return res.send({ message: "No admins found" });
  }
  res.send(listAdmins);
});

//This API is designed to handle requests to delete an admin from the database based on their username.
router.delete("/admin/delete", async function (req, res) {
  const usn = req.body.username;
  const admin = await Admin.findOne({ username: usn });
  if (admin == null) {
    res.send("No such admin exists.");
  } else {
    await Admin.deleteOne({ username: usn });
    res.send("Admin Deleted.");
  }
});

// Vendor API's
//This API allows vendors to sign up by providing their first name, last name, username, and password. 
//The password is hashed using bcrypt before it is saved to the database. If any of the required fields are missing, the API returns a 400 status code with a message asking the user to provide all the details.
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
    return
  } catch (error) {
    res.send("Error occured.");
  }
});

//This API  is designed to handle vendor login requests by verifying the vendor's credentials and returning a response indicating whether the login was successful or not.
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

//This API is designed to handle requests to retrieve vendor data from the database based on the provided username.
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

// This API is designed to handle requests to retrieve all vendors data from the database.
router.get("/vendors/getall", async function (req, res) {
  const listVendors = await Vendor.find();
  console.log("Vendors", listVendors);
  if (listVendors == "") {
    return res.send({ message: "No vendors found" });
  } else {
    res.send(listVendors);
  }
});

//This API is designed to handle requests to delete a vendor from the database based on their username.
router.delete("/vendor/delete", async function (req, res) {
  const usn = req.body.username;
  const vendor = await Vendor.findOne({ username: usn });
  if (vendor == null) {
    res.send("No such vendor exists.");
  } else {
    await Vendor.deleteOne({ username: usn });
    const isFoodTruckOfVendor = await Truck.findOne({ vendorId: vendor._id });
    if (isFoodTruckOfVendor == null) {
      console.log("No food Truck Found for the vendor");
      res.send("Vendor Deleted");
      return;
    }
    await Truck.findOneAndDelete({
      vendorId: vendor._id,
    });
    console.log("Food Truck Deleted");
    res.send("Vendor Deleted.");
  }
});

// Truck API's
//This API is used to add a new truck to the database. It expects a POST request with the truck details in the request body, including the truck name and address. 
//If either the truck name or address is missing, it will return an error message.
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

//This API is designed to handle requests to retrieve truck data from the database based on the provided truck name.
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

// This API is designed to handle requests to retrieve all truck data from the database.
router.get("/truck/getall", async function (req, res) {
  const listTrucks = await Truck.find();
  if (listTrucks == "") {
    return res.send({ message: "No trucks found" });
  }
  res.send(listTrucks);
});

//This API is used to add or update the list of available dishes in a food truck.
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

//This API is used for searching for food trucks based on a search query. 
//If the search query is an empty string, it returns all the available trucks. 
//Otherwise, it first tries to find a truck with the exact truck name that matches the search query. 
//If it finds a match, it returns that truck. If it doesn't find a match, 
//it searches through all the available dishes of all the trucks and returns all the trucks that have at least one dish that matches the search query.
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

//This API is used to update the information of a truck by a vendor. 
//If the vendor is valid and there is a truck associated with it, the API updates the information of the truck and returns the updated truck information as a response. 
//If the vendor or the truck does not exist, the API returns an error message.
router.post("/truck/update", async function (req, res) {
  const body = req.body;
  const truck = await Truck.findOne({vendorId: body.vendorId});
  await Truck.findByIdAndUpdate(truck._id, req.body);
  const truck2 = await Truck.findOne({vendorId: req.body.vendorId});
  res.send(truck2);
});

//This API is used to get a truck by its vendorId. 
//The API will search for a truck in the database that has the given vendorId and will return the truck if found. 
//If no truck is found, it will return a message indicating that the truck was not found.
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

//This API allows users to submit ratings for a food truck by providing the truck ID and the rating value. 
//The API validates the input data and calculates the average rating for the truck, taking into account the previous ratings. 
//Finally, the API returns the updated truck object with the new rating information.
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
      await Truck.findOneAndUpdate({_id: body.truckId}, {ratings: avgRatings, no_of_ratings: ratingCount+1});
      const updatedTruck = await Truck.findOne({_id: body.truckId});
      res.send(updatedTruck);
    } catch (error) {
      console.log(error);
    }
});

module.exports = router;
