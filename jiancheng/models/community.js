/**
 * Created by ASUS on 2017/2/6.
 */
var mongoose = require("mongoose");
var db = require("./db");

var Schema = mongoose.Schema;
// define a schema
var communitySchema = new Schema({
    //cid，
    name : {type: String }, //社团名称，
    /*member : [{
        name : {type : String},
        id : {type : String} //todo
    }], // 成员，
    activities : [{
        name : {type : String},
        id : {type : String}
    }], // 社团活动，*/
    avatar_url: {type: String, default: "/avatar/community/default_avatar.jpg"},
    school: {type: String},//学校
    signup_at: {type: Date}, //成立时间
    member_count : {type: Number, default: 1},//社团人数, 默认最少成员为社长1人
    star: {type: Number, default: 1}, //星级， 1-5星
    profile: {type: String}, //社团简介
    lock: {type: Boolean, default: false},//冻结状态
    create_at : {type: Date, default : Date.now()+8*60*60*1000},// 上线时间
    is_delete: {type: Boolean, default: false} //删除状态
});

communitySchema.index({ name : 1});
communitySchema.index({ member : 1});
communitySchema.index({ create_at : 1});
communitySchema.index({ activities : 1});
communitySchema.index({ lock : 1});

// compile our model
var Community = db.model('community', communitySchema);

var getName = function(name, callback) {
    Community.findOne({ name : name}, callback);
};

module.exports = {
    model : Community,
    getName : getName
};