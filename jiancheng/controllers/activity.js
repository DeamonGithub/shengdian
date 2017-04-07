/**
 * Created by ASUS on 2017/2/4.
 */
var Activity = require("../models").activity;
var Community = require("../models").community;
var User = require("../models").user;
var MClass = require("../models").mclass;
var session = require("../tools/sessions");

var Joi = require("joi");
var _ = require("lodash");
var formidable = require("formidable");
var fs = require("fs");

//发布活动
var publish = function (req, res, next) {
    console.log("#######");
    console.log("activity publish");
    var schema = Joi.object().keys({
        sid: Joi.string().length(24).required(), //todo replace by token;
        a_name : Joi.string().required(),// ����ƣ�
		site : Joi.string().required(),// ���еص㣬
		start_at : Joi.date().required(),// ����ʱ�䣬
        end_at: Joi.date().required(),
        detail: Joi.string().required(), // �����
        cid: Joi.string().length(24).required(),
        img: Joi.string()
    });
    Joi.validate(req.params, schema, function(err, value) {
        if (err) {
            console.error(err);
            sendError(406, res, next, "publish", "value fails to match the pattern", {result: 0});
            return next();
        }
        console.log("flag 1");
        User.model.findById(value.sid, function(err, user){
            if(err){
                console.error(err);
                sendError(406, res, next, "publish", "select user fails", {result: 0});
                return next();
            }
            console.log("flag 2");
            if(!user){
                console.error("user is null");
                sendError(406, res, next, "publish", "user is null", {result: 0});
            }else{
                console.log("flag 3");
                if(user.identity <= 0){
                    console.error("not authorized to publish activity");
                    sendError(401, res, next, "publish", "without authorization",
                        {result: 2, detail:"You are not authorized to perform this action."});
                }else{
                    Community.model.findById(value.cid, function(err, community){
                        if(err){
                            console.error(err);
                            sendError(406, res, next, "publish", "select user fails", {result: 0});
                            return next();
                        }
                        console.log("flag 4");
                        console.log(value);
                        var items = {
                            cid: user.community.cid,
                            sid: value.sid,
                            name: value.a_name,
                            time :{
                                start_at : value.start_at,
                                end_at : value.end_at
                            },
                            site : value.site,
                            detail : value.detail,
                            community: {
                                cname: community.name,
                                cid: community._id
                            },
                            publisher: {
                                sname: user.nickname,
                                sid: user._id
                            },
                            picture: []
                        };
                        if(value.img){
                            console.log("flag 5");
                            items.picture.push({url: value.img});
                        }
                        console.log(items);
                        Activity.model.create(items, function (err, result) {
                            if(err){
                                console.error(err);
                                sendError(406, res, next, "publish", "activity fails to create" );
                                return next();
                            }
                            var data = {
                                result : 1,
                                aid: result._id
                            };
                            console.log("flag 0");
                            sendData(200, res, next, data);
                        });
                    });
                }
            }
        });
    });
};

var uploadPicture = function(req, res, next){
    console.log("#######");
    console.log("activity uploadPicture");
    var tmpPath = req.files.wangEditorH5File.path;
    console.log("the tmpPath is :  "+ tmpPath);
    console.log("flag 1");
    var arry = tmpPath.split("_");
    var pictureName = arry[1];
    var newPath = "/jiancheng/img/activity/"+pictureName+".jpg";
    fs.rename(tmpPath, newPath, function(err){
        if(err){
            console.error(err);
            sendError(406, res, next, "upload", "rename");
            return next();
        }
        console.log("the newPath is : "+ newPath);
        var url = "/activity/"+pictureName+".jpg";
        console.log("flag 0");
        sendData(200, res, next, {url : url})
    });

};


//获取活动信息
var getActivityInfo = function (req, res, next) {
    console.log("#######");
    console.log("activity getActivityInfo");
    console.log("flag 1");
    var schema = Joi.object().keys({
        aid : Joi.string()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getActivityInfo", "params fails to match");
            return next();
        }
        console.log("flag 2");
        Activity.model.findById(value.aid, function(err, activity){
            if(err){
                console.error(err);
                sendError(406, res, next, "getActivityInfo", "select fail");
                return next();
            }
            console.log("flag 3");
            if(activity == null){
                sendError(406, res, next, "getActivityInfo", "activity is null");
                return next();
            }else{
                var data = {
                    aid : activity._id,
                    c_name : activity.community.cname,
                    a_name : activity.name,
                    time : activity.time,
                    site : activity.site,
                    details : activity.detail,
                    lock : activity.lock,
                    create_at: activity.create_at,
                    like: activity.like
                };
                if(activity.avatar_url != null){
                    data.avatar_url = activity.avatar_url;
                }
                console.log(data);
                console.log("flag 0");
                sendData(200, res, next, data);
            }
        });
    });
};
//获取热门活动
var getHotActivity = function(req, res, next){
    console.log("#######");
    console.log("activity getHotActivity");
    Activity.model.find({lock: false}, null, {sort: {like: -1}, limit: 5}, function(err, activities){
        if(err){
            console.error(err);
            sendError(406, res, next, "getHotActivity", "select activity fail");
            return next();
        }
        if(activities.length <= 0){
            sendError(406, res, next, "getHotActivity", "暂无热门活动");
            return next();
        }
        var tables = [];
        for(var i = 0; i<activities.length; i++){
            var activity = {};
            activity.aid = activities[i]._id;
            activity.name = activities[i].name;
            activity.like = activities[i].like;
            activity.cname = activities[i].community.cname;
            activity.time = activities[i].time;
            activity.site = activities[i].site;
            activity.detail = activities[i].detail;
            if(activities[i].avatar_url != null){
                activity.avatar_url = activities[i].avatar_url;
            }
            tables.push(activity);
        }
        console.log("flag 0");
        sendData(200, res, next, {tables: tables});
    });
};

//获取近期活动
var getRecentActivities = function(req, res, next){
    console.log("#######");
    console.log("activity getRecentActivities");
    var date = new Date();
    var conditions = {
        status : 1,
        lock : false,
        "time.end_at" : { $gt: date }
    };
    Activity.model.find(conditions, function(err, activities){
        if(err){
            console.error(err);
            sendError(406, res, next, "getRecentActivities", "select activities fail");
            return next();
        }else{
            var result = {data: []};
            if(activities.length > 0){
                for(var i = 0; i < activities.length; i++){
                    var item = {};
                    item.aid = activities[i]._id;
					item.a_name = activities[i].name;
					item.time = activities[i].time;
					item.site = activities[i].site;
                    item.cname = activities[i].community.cname;
                    item.create_at = activities[i].create_at;
                    if(activities[i].avatar_url != null){
                        item.avatar_url = activities[i].avatar_url;
                    }
                    result.data.push(item);
                }
            }
            console.log("flag 0");
            sendData(200, res, next, result);
        }
    })
};

var joinActivity = function(req, res, next){
    console.log("#######");
    console.log("activity joinActivity");
    var schame = Joi.object().keys({
        sid: Joi.string().length(24),
        aid: Joi.string().length(24)
    });
    Joi.validate(req.params, schame, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "", "");
            return next();
        }
        Activity.model.findById(value.aid, function(err, activity){
            if(err){
                console.error(err);
                sendError(406, res, next, "", "");
                return next();
            }
            if(!activity){
                sendError(406, res, next, "joinActivity", "activity is null");
                return next();
            }
            var item = {
                aid: activity._id,
                a_name: activity.a_name,
                start_at: activity.time.start_at
            };
            User.model.findById(value.sid, function(err, user){
                if(err){
                    console.error(err);
                    sendError(406, res, next, "", "");
                    return next();
                }
                if(!user){
                    sendError(406, res, next, "joinActivity", "user is null");
                    return next();
                }
                var flag = false;
                for(var i = 0; i<user.favorite_activities.length; i++){
                    if(user.favorite_activities[i].aid == value.aid){
                        flag = true;
                    }
                }
                if(!flag){
                    user.favorite_activities.push(item);
                    user.save(function(err){
                        if(err){
                            console.error(err);
                            sendError(406, res, next, "", "");
                            return next();
                        }
                        activity.like = activity.like+1;
                        activity.save(function(err){
                            if(err){
                                console.error(err);
                                sendError(406, res, next, "", "");
                                return next();
                            }
                            console.log("flag 0");
                            sendData(200, res, next, {result: 1});
                        });
                    });
                }else{
                    sendError(406, res, next, "joinActivity", "已经加入日程，请勿重复操作");
                    return next();
                }
            });
        });
    });
    /*session.validateSession(req, res, next, function(err, req, res, next, flag){
        if(err){
            console.error(err);
            sendError(406, res, next, "��֤����", "��������æ");
            return next();
        }
        console.log("flag 1");
        console.log(flag);
        if(flag != 0){
            sendError(406, res, next, "joinActivity", "please login");
        }else{

        }
    });*/
};

var classActivity = function(req, res, next){
    console.log("#####");
    console.log("activity classActivity");
    var schema = Joi.object().keys({
        sid : Joi.string()
    });
    Joi.validate(req.params, schema, function(err, value) {
        if (err) {
            console.error(err);
            sendError(406, res, next, "classActivity", "参数为空或含非法字符！");
            return next();
        }
        //随机数产生1到5，含1不含5的数
        var num = 5 - 1;
        num = Math.random()*num + 1;
        var classCount = parseInt(num);
        console.log(classCount);
        Activity.model.find({mclass: classCount}, function(err, activities){
            if (err) {
                console.error(err);
                sendError(406, res, next, "classActivity", "查询错误！");
                return next();
            }
            if(activities.length <= 0){
                sendError(406, res, next, "classActivity", "查无数据！");
                return next();
            }
            var data = [];
            for(var k = 0; k < activities.length; k++){
                var activity = activities[k];
                var item = {
                    aid : activity._id,
                    c_name : activity.community.cname,
                    a_name : activity.name,
                    time : activity.time,
                    site : activity.site,
                    details : activity.detail,
                    lock : activity.lock,
                    create_at: activity.create_at,
                    like: activity.like
                };
                if(activity.mclass != null){
                    item.mclass = activity.mclass;
                }
                if(activity.avatar_url != null){
                    item.avatar_url = activity.avatar_url;
                }
                data.push(item);
            }
            sendData(200, res, next, data);
        });
        /*MClass.find({mclass: classCount}, function(err, someClass){
            if (err) {
                console.error(err);
                sendError(406, res, next, "classActivity", "查询错误！");
                return next();
            }
            if(someClass.length <= 0){
                sendError(406, res, next, "classActivity", "查无数据！");
                return next();
            }
            var aidArray = [];
            for(var i = 0; i <= someClass.length; i++){
                aidArray.push(someClass[i].aid);
            }
            Activity.model.find({'_id': {'$in': aidArray}}, function(err, activities){
                if (err) {
                    console.error(err);
                    sendError(406, res, next, "classActivity", "查询错误！");
                    return next();
                }
                if(activities.length <= 0){
                    sendError(406, res, next, "classActivity", "查无数据！");
                    return next();
                }
                var data = [];
                for(var k = 0; k < activities.length; k++){
                    var activity = activities[k];
                    var item = {
                        aid : activity._id,
                        c_name : activity.community.cname,
                        a_name : activity.name,
                        time : activity.time,
                        site : activity.site,
                        details : activity.detail,
                        lock : activity.lock,
                        create_at: activity.create_at,
                        like: activity.like,
                        avatar_url: avatar_url,
                        mclass: mclass
                    };
                }
            });
        });*/
    });
};

var sendError = function(code, res, next, name, meg, value) {
    res.charSet('utf-8');
    res.contentType = 'json';
    var data = {
        err_name: name + " error",
        err_meg:  meg
    };
    console.log(value);
    if(value){
        _.merge(data, value );
    }
    res.send(code, data);
    return next();
};

var sendData = function (code, res, next, data) {
    res.charSet('utf-8');
    res.contentType = 'json';
    res.send(200, data);
    return next();
};

module.exports = {
    publish : publish,
    getActivityInfo : getActivityInfo,
    getHotActivity : getHotActivity,
    getRecentActivities : getRecentActivities,
    joinActivity: joinActivity,
    uploadPicture: uploadPicture,
    classActivity: classActivity
};