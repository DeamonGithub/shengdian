/**
 * Created by ASUS on 2017/2/6.
 */
var mongoose = require("mongoose");
var db = require("./db");

var Schema = mongoose.Schema;
// define a schema
var communitySchema = new Schema({
    //cid��
    name : {type: String }, //�������ƣ�
    /*member : [{
        name : {type : String},
        id : {type : String} //todo
    }], // ��Ա��
    activities : [{
        name : {type : String},
        id : {type : String}
    }], // ���Ż��*/
    avatar_url: {type: String, default: "/avatar/community/default_avatar.jpg"},
    school: {type: String},//ѧУ
    signup_at: {type: Date}, //����ʱ��
    member_count : {type: Number, default: 1},//��������, Ĭ�����ٳ�ԱΪ�糤1��
    star: {type: Number, default: 1}, //�Ǽ��� 1-5��
    profile: {type: String}, //���ż��
    lock: {type: Boolean, default: false},//����״̬
    create_at : {type: Date, default : Date.now()+8*60*60*1000},// ����ʱ��
    is_delete: {type: Boolean, default: false} //ɾ��״̬
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