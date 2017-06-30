/**
 * Created by ASUS on 2017/1/15.
 */
var mongoose = require("mongoose");
var db = require("./db");


var Schema = mongoose.Schema;

var UserSchema = new Schema({
    nickname: {type: String}, //昵称
    username : { type : String }, //用户实名
    sex : {type: Number, default: 1}, //用户性别 ，0是男 ， 1是不公开， 2是女
    school: {type: String}, //学校
    feeling: {type: String}, //个性签名
    password : { type : String }, //密码
    sid :{type : String },
    snum : {type : String}, //学号
    avatar_url: {type: String, default: "/avatar/user/default_avatar.jpg"}, //头像
    email : {type : String}, //邮箱
    phone : {type : String}, //手机号
    create_at : {type : Date, default: Date.now}, //注册时间
    last_login : {type : Date, default: Date.now}, //最后登陆时间
    community : {
        cid : {type : String}, //社团id
        cname : {type : String} //社团名
    },
    lock : {type : Boolean, default: false},//状态锁
    login_status: {type: Boolean},
    favorite_activities : [{
        aid : {type: String},
        a_name: {type: String},
        start_at: {type: Date}
    }], //收藏活动
    identity : {type: Number, default: 2}, //身份 0是社员， 1是副会， 2是社长
    is_delete: {type: Boolean, default: false} //是否被删除
});

UserSchema.index({ username : 1});
UserSchema.index({ password : 1});

var User = db.model('user', UserSchema);

var getName = function(name, callback) {
    User.findOne({ nickname : name}, callback);
};

module.exports = {
    model : User,
    getName : getName
};
