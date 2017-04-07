/**
 * Created by ASUS on 2017/1/15.
 */
var User = require("../models").user;
var Activity = require("../models").activity;
var Admin = require("../models").admin;
var Library = require("../models").library;

var Joi = require("joi");
var async = require("async");
var redis = require("redis");
var session = require("../tools/sessions");
var cookies = require("../tools/cookies");
var client = redis.createClient();
var sharp = require("sharp");
var mongoose = require("mongoose");
var querystring = require("querystring");
var moment = require("moment");
var _ = require("lodash");

//用户登录
var login = function(req, res, next) {
    console.log("#######");
    console.log("the user's login information is : ");
    console.log(req.params);
    var schema = Joi.object().keys({
        name : Joi.string().min(1).max(12).regex(/[^/*.#]+$/),
        password : Joi.string().min(6).regex(/[^/*.#]+$/)
    });
    Joi.validate(req.params, schema, function(err, value) {
        if(err){
            console.error(err);
            res.charSet('utf-8');
            res.contentType = 'json';
            res.send(406, {err_name: "", err_meg: ""});
            return next();
        }
        User.model.findOne({nickname : value.name}, function(err, user) {
            if(err){
                console.error(err);
                res.charSet('utf-8');
                res.contentType = 'json';
                res.send(406, {err_name: "", err_meg: ""});
                return next();
            }
            if(!user){
                Admin.model.findOne({name: value.name}, function(err, admin){
                    if(err){
                        console.error(err);
                        sendError(406, res, next, "login", "select admin fail");
                        return next();
                    }
                    if(!admin){
                        sendError(406, res, next, "login", "admin is null");
                        return next();
                    }else{
                        if(value.password != admin.password){
                            console.log("flag 1");
                            sendError(406, res, next, "login", "Incorrect account password");
                            return next();
                        }
                        var data = {result: 1, rid: admin._id};
                        internalFunc(req, res, next, data);
                    }
                });
            }else{
                if(value.password != user.password ){

                    res.charSet('utf-8');
                    res.contentType = 'json';
                    res.send(406, {err_name: "login", err_meg: "Incorrect account password"});
                    return next();
                }else{
                    var data = {result: 1, sid: user._id};
                    internalFunc(req, res, next, data);
                }
            }
        });
        function internalFunc (req, res, next, data){
            var cookie = cookies.getCookies(req);
            var id = cookie.session_id;
            console.log("session_id is "+ id);
            if(!id){
                req.session = session.generate();
                res.setHeader("Set-Cookie", "session_id="+req.session.session_id);
                res.charSet('utf-8');
                res.contentType = 'json';
                res.send(200, data);
                return next();
            }else{
                client.hgetall(id, function(err, reply){
                    if(err){
                        console.log(err);
                        sendError(406, res, next, "login", "Server busy");
                        return next();
                    }
                    if(!reply){
                        req.session = session.generate();
                        res.header("Set-Cookie", "session_id="+req.session.session_id);
                        res.charSet('utf-8');
                        res.contentType = 'json';
                        res.send(200, data);
                        return next();
                    }else{
                        if(reply.expires >= (new Date()).getTime()){
                            reply.expires = (new Date()).getTime() + session.EXPIRES;
                            client.hmset(id, reply);
                            sendError(406, res, next, "login", "Already in the state of landing");
                        }else{
                            //清除旧session_id，生成新session_id并返回
                            client.del(id);
                            req.session = session.generate();
                            res.setHeader("Set-Cookie", "session_id="+req.session.session_id);
                            res.charSet('utf-8');
                            res.contentType = 'json';
                            console.log("flag 0");
                            res.send(200, data);
                            return next();
                        }
                    }
                });
            }
        }
    });
};

var register = function(req, res, next) {
    console.log("#######");
    console.log("user register");
    var schema = Joi.object().keys({
        u_name : Joi.string().min(1).max(12).regex(/[^'/*.#-]+$/).required(), //todo 测试正则
        password : Joi.string().min(6),
        phone : Joi.string().length(11).regex(/^1\d{10}$/),
        email : Joi.string(),
        snum : Joi.string()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            res.charSet('utf-8');
            res.contentType = 'json';
            res.send(406, {err_name: "register error", err_meg: "value fails to match the pattern"});
            return next();
        }
        User.model.findOne({nickname : value.u_name}, function(err, user){
            if(err){
                console.error(err);
                sendError(404, res, next, "register", "select user fail");
                return next();
            }
            if(user){
                sendData(200, res, next, {name_is_exist : 1});
            }else {
                var items = {
                    nickname : value.u_name,
                    password : value.password,
                    phone : value.phone,
                    email : value.email,
                    sum : value.sum
                };
                console.log(value.u_name);
                User.model.create(items, function(err, user) {
                    if(err){
                        console.error(err);
                        res.charSet('utf-8');
                        res.contentType = 'json';
                        res.send(406, {err_name: "mongoose error", err_meg: "�û�����ʧ��"});
                        return next();
                    }
                    res.charSet('utf-8');
                    res.contentType = 'json';
                    res.send(200, {result : 1, sid : user._id});
                    return next();
                });
            }
        });
    });
};

var test = function(req, res, next){
    console.log("#######");
    console.log("user test");
    console.log(Library);
};

var getUserInfo = function(req, res, next) {
    console.log("#######");
    console.log("user getUserInfo");
    var schema = Joi.object().keys({
       sid : Joi.string().length(24).required()
    });
    console.log("flag 1");
    session.validateSession(req, res, next, function(err, req, res, next, flag){
        if(err){
            console.error(err);
            sendError(406, res, next, "身份验证出错", "权限错误！");
            return next();
        }
        console.log("flag 1");
        if(flag != 0){
            sendError(406, res, next, "joinActivity", "please login");
        }else{
            Joi.validate(req.params, schema, function(err, value){
                if(err){
                    console.error(err);
                    res.charSet('utf-8');
                    res.contentType = 'json';
                    res.send(406, {err_name: "register error", err_meg: "value fails to match the pattern"});
                    return next();
                }
                console.log("the user's info is:  "+value);
                User.model.findById(value.sid, function(err, user){
                    if(err){
                        console.error(err);
                        sendError(406, res, next, "getUserInfo", "select user fail");
                        return next();
                    }
                    if(user == null){
                        console.log("user is null");
                        sendError(406, res, next, "getUserInfo", "user is null");
                    }else{
                        var items = {
                            sid : user._id,
                            snum : user.snum,
                            phone : user.phone,
                            uname : user.nickname,
                            sex: user.sex,
                            school: user.school,
                            email : user.email,
                            lock : user.lock,
                            feeling: user.feeling,
                            cid : user.community.cid,
                            cname : user.community.cname,
                            favorite_activities : user.favorite_activities,
                            identity :user.identity,
                            avatar_url: user.avatar_url,
                            community: user.community
                        };
                        res.charSet('utf-8');
                        res.contentType = 'json';
                        res.send(200, items);
                        console.log("flag 0");
                        return next();
                    }
                });
            });
        }
    });
};

//获取收藏活动
var getLikeActivity = function(req, res, next){
    console.log("#######");
    console.log("user getLikeActivity");
    var schema = Joi.object().keys({
        sid: Joi.string().length(24)
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getLikeActivity", "value fails to match the pattern");
        }
        console.log("flag 1");
        User.model.findById(value.sid, function(err, user){
            if(err){
                console.log(err);
                sendError(406, res, next, "getLikeActivity", "select user fail");
            }
            console.log(user);
            if(!user){
                console.log("user is null");
                sendError(406, res, next, "getLikeActivity", "user is null");
                return next();
            }else{
                var data = {
                    table: []
                };
                var mon = [];
                var tue = [];
                var wed = [];
                var thu = [];
                var fri = [];
                var sat = [];
                var sun = [];
                var count = 0; //回调执行完毕标志
                if(user.favorite_activities.length <= 0){
                    sendData(200, res, next, {data: "暂无数据"});
                    return next();
                }
                for(var i = 0; i<user.favorite_activities.length; i++){
                    var item = user.favorite_activities[i];
                    Activity.model.findById(item.aid, function(err, activity){
                        if(err || activity == null){
                            console.log(err);
                            sendError(406, res, next, "getLikeActivity", "select user fail");
                            return next();
                        }
                        console.log("flag 2");
                        var dayOfWeek = moment(activity.time.start_at).format("d");
                        var other = {
                            site: activity.site,
                            start_at: activity.time.start_at,
                            end_at: activity.time.end_at,
                            name: activity.name,
                            aid: activity.id
                        };
                        var date = new Date();
                        if(date < other.start_at){ //只返回开始时间小于当前时间的活动
                            console.log(dayOfWeek);
                            switch (dayOfWeek){
                                case "0":
                                    sun.push(other);
                                    break;
                                case "1":
                                    mon.push(other);
                                    break;
                                case "2":
                                    tue.push(other);
                                    break;
                                case "3":
                                    wed.push(other);
                                    break;
                                case "4":
                                    thu.push(other);
                                    break;
                                case "5":
                                    fri.push(other);
                                    break;
                                case "6":
                                    console.log("flag 2");
                                    sat.push(other);
                                    break;
                            }
                        }
                        count++;
                        if(count == user.favorite_activities.length){
                            data.table[0] = sun;
                            data.table[1] = mon;
                            data.table[2] = tue;
                            data.table[3] = wed;
                            data.table[4] = thu;
                            data.table[5] = fri;
                            data.table[6] = sat;
                            console.log(data);
                            console.log("flag 0");
                            sendData(200, res, next, data);
                        }
                    });
                }
            }
        });
    });
};
//修改密码
var changePwd = function(req, res, next){
    console.log("#######");
    console.log("user changePwd");
    var schema = Joi.object().keys({
        sid: Joi.string().length(24),
        oldpwd: Joi.string().min(6).regex(/[^/*.#]+$/),
        newpwd: Joi.string().min(6).regex(/[^/*.#]+$/)

    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "changePwd", "value fails to match the pattern");
            return next();
        }
        User.model.findById(value.sid, function(err, user){
            if(err){
                console.log(err);
                sendError(406, res, next, "changePwd", "select user fail");
                return next();
            }
            if(!user){
                console.log("user is null");
                sendError(406, res, next, "getLikeActivity", "user is null");
            }else{
                if(user.password == value.oldpwd){
                    user.password = value.newpwd;
                    user.save(function(err, result){
                       if(err){
                           console.error(err);
                           sendError(406, res, next, "changePwd", "user.save() fail", {result : 0});
                           return next();
                       }
                        console.log("flag 0");
                       sendData(200, res, next, {result: 1});
                    });
                }else{
                    sendError(406, res, next, "changePwd", "change password fail", {result : 0});
                    return next();
                }
            }
        });
    });
};

var changeInfo = function(req, res, next){
    console.log("#######");
    console.log("user changeInfo");
    var schema = Joi.object().keys({
        sid: Joi.string().length(24).required(),
        phone : Joi.string().length(11).regex(/^1\d{10}$/),
        email : Joi.string(),
        feeling: Joi.string().regex(/[^/*.#]+$/).required(),
        school: Joi.string().regex(/[^/*.#]+$/),
        sex: Joi.number()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "changeInfo", "value fails to match the pattern");
            return next();
        }
        session.validateSession(req, res, next, function(err, req, res, next, flag){
            if(err){
                consolr.error(err);
                sendError(406, res, next, "身份验证出错", "权限错误！");
                return next();
            }
            if(flag != 0){
                sendError(401, res, next, "session error", "please sign in");
            }else{
                var info = {
                    phone: value.phone,
                    email: value.email,
                    feeling: value.feeling,
                    school: value.school,
                    sex: value.sex
                };
                User.model.findById(value.sid, function(err, user){
                    if(err){
                        console.error(err);
                        sendError(406, res, next, "changeUserInfo", "用户信息查询失败！");
                        return next();
                    }
                    user.phone = value.phone;
                    user.email = value.email;
                    user.feeling = value.feeling;
                    user.school = value.school;
                    user.sex = value.sex;
                    user.save(function(err){
                        if(err){
                            console.error(err);
                            sendError(406, res, next, "changeUserInfo", "用户更新失败");
                            return next();
                        }
                        console.log("flag 0");
                        sendData(200, res, next, {result: 0})
                    });
                });
            }
        })
    });
};

var changeAvatar = function(req, res, next){
    //todo
    console.log("#######");
    console.log("user changeAvatar");
    var avatarPath = "/jiancheng/img/avatar/user/"+req.body .sid+"_avatar.jpg";
    console.log(avatarPath);
    session.validateSession(req, res, next, function(err, req, res, next, flag){
        console.log("##########");
        console.log(flag);
        if(err){
            console.error(err);
            sendError(406, res, next, "changeAvatar", "权限错误！");
            return next();
        }
        if(flag != 0){
            sendError(401, res, next, "session有误", "���¼");
            return next();
        }else{
            console.log("flag 1");
            var avatar_data_json = req.body.avatar_data;
            console.log(avatar_data_json);
            var avatar_data = JSON.parse(avatar_data_json);
            var size = {
                left: Math.ceil(avatar_data.x),
                top: Math.ceil(avatar_data.y),
                width: Math.ceil(avatar_data.width),
                height: Math.ceil(avatar_data.height)};
            //var size = { left: 0, top: 0, width: 200, height: 200 };
            console.log(size);
            var imagePath = req.files.avatar_file.path;
            console.log(imagePath);
            sharp(imagePath).extract(size).toFormat(sharp.format.jpeg).toFile(avatarPath, function(err){
                if(err){
                    console.error(err);
                    sendError(406, res, next, "ͷ�����ʧ��", "�ü�ʧ��");
                    return next();
                }
                console.log("flag 2");
                User.model.findById(req.body.sid, function(err, user){
                    if(err){
                        console.error(err);
                        sendError(406, res, next, "", "");
                        return next();
                    }
                    console.log(user.nickname);
                    var avatar_url = "/avatar/user/"+req.body.sid+"_avatar.jpg";
                    User.model.update({nickname: user.nickname}, {"$set":{avatar_url: avatar_url}},
                        {upsert: true},
                        function(err, result){
                            if(err){
                                console.error(err);
                                return next();
                            }
                            console.log("the user's avatar is :" + avatar_url);
                            console.log("flag 0");
                            sendData(200, res, next, {result: 0, avatar_url: avatar_url});
                        });
                });
            });
        }
    });

};

var exit = function(req, res, next){
    console.log("#######");
    console.log("user exit");

    var cookie = cookies.getCookies(req);
    var id = cookie.session_id;
    client.del(id, function(err, reply){
        if(err){
            console.error(err);
            sendError(406, res, next, "", "");
            return next();
        }
        if(reply == 1){
            console.log("flag 0");
            sendData(200, res, next, {result: 1});
        }else{
            sendError(406, res, next, "exit ", "user haven't exited");
            return next();
        }
    });

};

var removeActivity = function(req, res, next){
    var schema = Joi.object().keys({
        aid : Joi.string().length(24).required(),
        sid: Joi.string().length(24).required()
    });
    Joi.validate(req.params, schema, function(err, value) {
        if (err) {
            console.error(err);
            sendError(406, res, next, "removeActivity", "参数错误（关键参数为空或含非法字符！）");
            return next();
        }
        User.model.findById(value.sid, function(err, user){
            if (err) {
                console.error(err);
                sendError(406, res, next, "removeActivity", "查询失败！");
                return next();
            }
            var flag = false;
            for(var i = 0; i < user.favorite_activities.length; i++){
                if(user.favorite_activities[i].aid == value.aid){
                    user.favorite_activities.splice(i, 1);
                    flag = true;
                }
            }
            user.save(function(err){
                if (err) {
                    console.error(err);
                    sendError(406, res, next, "removeActivity", "修改错误！）");
                    return next();
                }
                if(!flag){
                    sendError(406, res, next, "removeActivity", "删除出错（aid错误！）");
                    return next();
                }
                sendData(200, res, next, {result: 0});
                return next();
            });
        });
    });
};


var sendError = function(code, res, next, name, meg, value) {
    res.charSet('utf-8');
    res.contentType = 'json';
    var data = {
        err_name: name + " error",
        err_meg: meg
    };
    if(value){
        _.merge(data, value);
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
    login : login,
    register : register,
    test : test,
    getUserInfo : getUserInfo,
    getLikeActivity: getLikeActivity,
    changePwd: changePwd,
    changeInfo: changeInfo,
    changeAvatar: changeAvatar,
    exit: exit,
    removeActivity: removeActivity
};