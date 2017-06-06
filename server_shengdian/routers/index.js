/**
 * Created by ASUS on 2017/1/15.
 */
var user = require("./user");
var activity = require("./activity");
var community = require("./community");
var admin = require("./admin");
var book = require("./book");

module.exports = function(server) {
    user(server);
    activity(server);
    community(server);
    admin(server);
    book(server);
};