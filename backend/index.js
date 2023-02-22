const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const api = require("./controllers/UserController");
const bodyParser = require("body-parser");
const server = app.listen(PORT, function () {
    const host = server.address().address
    const PORT = server.address().port
    
    console.log(`Server listening at ${PORT}`)
})

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use(bodyParser.json());
app.use('/', api);