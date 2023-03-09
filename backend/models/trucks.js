const mongoose = require("mongoose");
const db = require("../db-connection/connection");

const trucksSchema = new mongoose.Schema({
    truck_name: {
        type: String,
        unique: true,
        required: true
    },
    truck_code: {
        type: String,
        required: true
    },
    vendorId: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    available_dishes: {
        type: Array,
        required: true
    },
    unavailable_dishes: {
        type:Array,
        required: true
    },
    role: {
        type: String,
        enum: ['VENDOR'],
        default: 'VENDOR'
    },
    token: {
       type: String 
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const truckSchema = db.model('trucks', trucksSchema);

module.exports = truckSchema;