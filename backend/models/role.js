const mongoose = require("mongoose");
const db = require("../db-connection/connection");

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true
    }
});

const roleModel = db.model('roles', roleSchema);

module.exports = roleModel;