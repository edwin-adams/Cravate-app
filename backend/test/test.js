
var request = require("superset");
var app = require('../index');

describe('GET/initial', function() {
    it('respond with hello world', function(done) {
        request(app).get('/initial').expect(' { "response": "Hello WORLD"}' , done);
    });
});