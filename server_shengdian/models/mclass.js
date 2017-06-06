/**
 * Created by ASUS on 2017/3/18.
 */
var mongoose = require("mongoose");
var db = require("./db");


var Schema = mongoose.Schema;

var ClassSchema = new Schema({
    aid: {type: String}, //活动id
    avatar_url : { type : String }, //活动头像
    mclass : {type: Number} //活动类别
});

ClassSchema.index({ username : 1});
ClassSchema.index({ sex : 1});

var Class = db.model('mclass', ClassSchema);


module.exports = {
    model : Class
};
