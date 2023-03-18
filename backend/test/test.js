
var request = require("superset");
var app = require('../index');
const assert = require("assert");
const UserController = require("../controllers/UserController")


// describe('GET/initial', function() {
//     it('respond with hello world', function(done) {
//         request(app).get('/initial').expect(' { "response": "Hello WORLD"}' , done);
//     });
// });

describe('myModule', function() {
    describe('#addNumbers', function() {
      it('should add two numbers together', function() {
        assert.equal(UserController.addNumbers(2, 3), 5);
      });
    });
  });