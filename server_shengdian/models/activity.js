/**
 * Created by ASUS on 2017/2/4.
 */
var mongoose = require("mongoose");
var db = require("./db");


var Schema = mongoose.Schema;
// define a schema
var activitySchema = new Schema({
    //aid: {type: String, default },//id
    community: {
        cid: {type: String},
        cname: {type: String}
    },//�а�����
    publisher: {
        sid: {type: String}, //发布人id
        sname: {type: String} //发布人名
    },
    name: {type: String},//活动名
    picture: [{
        url: {type: String}
    }], //图片
    site: {type: String},// 活动地点
    detail: {type: String},// 活动内容
    lock: {type: Boolean, default: false},// 状态锁
    status:{ type: Number, default:1 },  //0 未处理  1 已通过  2 未通过
    create_at:{type: Date, default: Date.now()+8*60*60*1000},
    time: {
        start_at: {type: Date, default: Date.now()+8*60*60*1000},
        end_at:  {type: Date, default: Date.now()+8*60*60*1000}
    },
    like: {type: Number, default: 0},
    is_delete: {type: Boolean, default: false} //删除状态

});

activitySchema.index({ name : 1});
activitySchema.index({ site : 1});
activitySchema.index({ time : 1});
activitySchema.index({ lock : 1});
activitySchema.index({ aid : 1});

// compile our model
var Activity = db.model('activity', activitySchema);

var getName = function(name, callback) {
    Activity.findOne({ name : name}, callback);
};

module.exports = {
    model : Activity,
    getName : getName
};