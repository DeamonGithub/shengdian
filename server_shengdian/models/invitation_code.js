/**
 * Created by ASUS on 2017/2/19.
 */
var mongoose = require("mongoose");
var db = require("./db");

var Schema = mongoose.Schema;

var CodeSchema = new Schema({
    create_at : {type: Date, default: Date.now},
    status: {type: Boolean, default: false}, //是否被使用过
    lock: {type: Boolean, default: false},
    cid: {type: String}
});

CodeSchema.index({create_at: 1});
CodeSchema.index({cid: 1});
CodeSchema.index({status: 1});

var Code = db.model('code', CodeSchema);

var getName = function(name, callback) {
    Code.findOne({ nickname : name}, callback);
};

module.exports = {
    model : Code,
    getName : getName
};
