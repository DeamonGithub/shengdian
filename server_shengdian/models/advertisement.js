/**
 * Created by ASUS on 2017/5/23.
 */
var mongoose = require("mongoose");
var db = require("./db");


var Schema = mongoose.Schema;
// define a schema
var advertisementSchema = new Schema({

    image_url: {type: String},
    tip: {type: String},
    create_at: {type: Date, default: Date.now()},
    is_delete: {type: Boolean, default: false} //删除状态

});

advertisementSchema.index({ name : 1});
advertisementSchema.index({ site : 1});
advertisementSchema.index({ time : 1});
advertisementSchema.index({ lock : 1});
advertisementSchema.index({ aid : 1});

// compile our model
var Advertisement = db.model('advertisement', advertisementSchema);

module.exports = {
    model: Advertisement
};