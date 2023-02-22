const mongoose = require("mongoose");
const db = require("../db-connection/connection");

const adminSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: false
    },
    username: {
        type: String,
        unique: true,
        required: false
    },
    password: {
        type: String
    },
    token: {
        type: String
    },
})

const adminModel = db.model('admins', adminSchema);

module.exports = adminModel;