/**
 * Created by ASUS on 2017/1/15.
 */
var mongoose = require("mongoose");

var db = mongoose.connect("mongodb://106.14.250.168:27017/jiancheng",{user: "jian", pass: "che3ng"});

//db.on('error', function(err){
//    console.log(err);
//});

if(!db) {
    db = null;
}
module.exports = db;