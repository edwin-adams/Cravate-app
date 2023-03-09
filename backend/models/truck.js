const mongoose = require("mongoose");
const db = require("../db-connection/connection");

const roleSchema = new mongoose.Schema({
    truck_name: {
        type: String,
        required: true
    },
    truck_code:{
        type: String,
        required: true

    },
    vendorId:{
        type: String,
        required: true

    },
    address:{
        type: String,
        required: true

    },
    city:{
        type: String,
        required: true

    },
    latitude:{
        type: String,
        required: true

    },
    longitude:{
        type: String,
        required: true

    },
    truck_code:{
        type: String,
        required: true

    }
});