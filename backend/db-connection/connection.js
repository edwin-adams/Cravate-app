const mongoose = require("mongoose");
const URL = require("../db-connection/connectionString");

var url = URL

const connection = mongoose.createConnection(url);

module.exports = connection;