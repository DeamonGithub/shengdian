/**
 * Created by ASUS on 2017/3/16.
 */
var Book = require("../controllers").book;

module.exports = function(server) {
    server.get({path: "/api/book/grade"}, Book.grade);
};