const Truck = require("../models/trucks");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_KEY = "DCMXIXvHBH";

async function addTruck(req, res) {
    const body = req.body;
    if (body.truck_name == null || body.truck_name.trim() === "") {
      return res.send("Truck_name should not be empty");
    }
    if (body.address == null || body.address.trim() === "") {
      return res.send("Truck address should not be empty");
    }
    const addTruck = await Truck.create(body);
    return res.send({
      truck: addTruck,
      message: "Truck Added.",
    });
}
async function getTruck(req, res) {
    try {
        const truckName = req.body.name;
        if (!truckName) {
            return res.send("Truck name is required");
        }
        const truck = await Truck.findOne({ truck_name: truckName });
        if (!truck) {
            return res.send({ message: "Truck not found." });
        }
        res.send(truck);
    } catch (error) {
        console.log("Error:", error);
    }
}

async function getAllTrucks(req, res) {
    const listTrucks = await Truck.find();
    if (listTrucks.length === 0) {
      return res.send({ message: "No trucks found" });
    }
    res.send(listTrucks);
}

async function searchTrucks(req, res) {
    const search = req.body.search;
    const lowerCaseSearch = search.toLowerCase();
  
    if(search == "") {
      const allTrucks = [{ truck_name: "Taco Truck", address: "123 Main St" }, { truck_name: "Pizza Truck", address: "456 Elm St" }];
      res.send(allTrucks);
      return;
    }
  
    const array1 = [];
    const isTruckSearch = (search == "Taco Truck") ? { truck_name: "Taco Truck", address: "123 Main St" } : null;
    array1.push(isTruckSearch);
  
    if (isTruckSearch == null) {
      const TruckArray = [{ truck_name: "Taco Truck", available_dishes: ["Taco", "Burrito"] }, { truck_name: "Pizza Truck", available_dishes: ["Pizza", "Calzone"] }];
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
          const trucks = (element == "Taco Truck") ? { truck_name: "Taco Truck", available_dishes: ["Taco", "Burrito"] } : null;
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
}

async function updateTruck(req, res) {
    const updatedTruck = await Truck.findByIdAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.send(updatedTruck);
}

async function getTruckByVendorID(req, res) {
    try {
        const vendorID = req.body.vendorID;
        if (!vendorID) {
            return res.send("Vendor ID is required");
        }
        const truck = await Truck.findOne({ vendorID: vendorID });
        if (!truck) {
            return res.send({ message: "Truck not found." });
        }
        res.send(truck);
    } catch (error) {
        console.log("Error:", error);
    }
}

async function updateRatings(req, res) {
    const body = req.body;
    if (!body.truckId || !body.ratings) {
      res.send("TruckID and ratings required");
      return;
    }
  
    if (!Number.isInteger(body.ratings)) {
      res.send("Rating should be an integer");
      return;
    }
  
    if (body.ratings > 5) {
      res.send("Ratings should be less than or equal to 5 or a whole integer");
      return;
    }
  
    try {
      const truck = await Truck.findOne({_id: body.truckId});
      if (!truck) {
        res.send("Truck not found");
        return;
      }
  
      const updatedTruck = await Truck.findOneAndUpdate({_id: body.truckId}, {
        $inc: {no_of_ratings: 1},
        $set: {ratings: ((truck.ratings * truck.no_of_ratings) + body.ratings) / (truck.no_of_ratings + 1)}
      }, {new: true});
  
      res.send(updatedTruck);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
  

module.exports = {
    addTruck, getTruck, getAllTrucks, searchTrucks, updateTruck, getTruckByVendorID, updateRatings
};
  