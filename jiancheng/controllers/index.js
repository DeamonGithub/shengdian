/**
 * Created by ASUS on 2017/1/16.
 */
var user = require("./user");
var activity = require("./activity");
var community = require("./community");
var admin = require("./admin");
var book = require("./book");

module.exports = {
    user : user,
    activity : activity,
    community : community,
    admin : admin,
    book: book
};