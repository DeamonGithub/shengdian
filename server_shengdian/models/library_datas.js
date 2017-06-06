/**
 * Created by ASUS on 2017/3/16.
 */
var mongoose = require("mongoose");
var db = require("./db");

var Schema = mongoose.Schema;
var librarySchema = new Schema({
    ile: {type: String},
    field1: {type: Number},
    field2: {type: Number},
    field3: {type: Number},
    field4: {type: Number}
});
librarySchema.index({ ile : 1});
librarySchema.index({ field1 : 1});
librarySchema.index({ field2 : 1});
librarySchema.index({ field3 : 1});
librarySchema.index({ field4 : 1});

//db.model('library_datas');
//var library = mongoose.collection("library_data");
var Library = db.model("library", librarySchema);
module.exports = {
    model : Library
};
