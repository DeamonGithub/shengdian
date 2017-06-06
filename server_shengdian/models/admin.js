/**
 * Created by ASUS on 2017/2/21.
 */
var mongoose = require("mongoose");
var db = require("./db");

var Schema = mongoose.Schema;

var AdminSchema = new Schema({
    create_at : {type: Date, default: Date.now},
    lock: {type: Boolean, default: false},
    name: {type: String},
    password: {type: String}
});

AdminSchema.index({create_at: 1});
AdminSchema.index({name: 1});
AdminSchema.index({password: 1});
AdminSchema.index({lock: 1});

var Admin = db.model('admin', AdminSchema);

var getName = function(name, callback) {
    Admin.findOne({ nickname : name}, callback);
};

module.exports = {
    model : Admin,
    getName : getName
};
