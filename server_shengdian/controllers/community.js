/**
 * Created by ASUS on 2017/2/6.
 */
var Community = require("../models").community;
var Activity = require("../models").activity;
var User = require("../models").user;
var Joi = require("joi");
var Code = require("../models").code;
var Video = require("../models").video;
var fs = require("fs");

//获取社团信息
var getCommunityInfo = function(req, res, next) {
    console.log("#######");
    console.log("getCommunityInfo");
    var schema = Joi.object().keys({
        cid : Joi.string() //todo
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getCommunityInfo", "value fails to match the pattern");
            return next();
        }
        Community.model.findById(value.cid, function(err, community){
            if(err){
                console.error(err);
                sendError(406, res, next, "getCommunityInfo", "select community fail or community is null");
                return next();
            }
            if(!community){
                sendError(406, res, next, "getCommunityInfo", "select community fail or community is null");
                return next();
            }
            var conditions = {
                "community.cid": value.cid
            };
            console.log("flag 1");
            Activity.model.find(conditions, null, {sort: {start_at: -1}}, function(err, activities){
                if(err){
                    console.error(err);
                    sendError(406, res, next, "getCommunityInfo", "select activities fail");
                    return next();
                }

                console.log("flag 2");
                var activityArray = [];
                if(activities.length > 0){
                    for(var i in activities){
                        var item = {};
                        item.aid = activities[i]._id;
                        item.title = activities[i].name;
                        item.start_at = activities[i].time.start_at;
                        item.end_at = activities[i].time.end_at;
                        item.site = activities[i].site;
                        item.cname = activities[i].community.cname;
                        item.illustration = activities[i].avatar_url;
                        activityArray.push(item);
                    }
                }
                User.model.find(conditions, function(err, users){
                    if(err){
                        console.error(err);
                        sendError(406, res, next, "getCommunityInfo", "select activities fail");
                        return next();
                    }
                    console.log("flag 3");
                    var userArray = [];
                    if(users.length > 0){
                        for(var i in users){
                            var item = {};
                            item.sid = users[i]._id;
                            item.nickname = users[i].nickname;
                            item.avatar = users[i].avatar_url;
                            item.sex = users[i].sex;
                            userArray.push(item);
                        }
                    }
                    var data = {
                        cname : community.name,
                        cid: community._id,
                        profile: community.profile,
                        signup_at: community.signup_at,
                        star: community.star,
                        member_count: community.member_count,
                        avatar_url: community.avatar_url,
                        school: community.school,
                        members : userArray,
                        activities : activityArray
                    };
                    console.log(data);
                    console.log("flag 0");
                    sendData(200, res, next, [data])
                });
            });
        });
    });
};

//查询社团列表
var getCommunities = function(req, res, next){
    console.log("#######");
    console.log("community getCommunities");
    var conditions = {
        lock : false,
        is_delete : false
    };
    Community.model.find(conditions, function(err, communities){
        if(err){
            console.error(err);
            sendError(406, res, next, "getCommunities", "select communities fail");
            return next();
        }
        if(communities.length <= 0){
            console.error(err);
            sendError(404, res, next, "getCommunities", "there is nothing on the db");
            return next();
        }
        var data = [];
        for(var i = 0; i < communities.length; i++){
            var item = {};
            item.cname = communities[i].name;
            item.cid = communities[i]._id;
            item.profile = communities[i].profile;
            item.avatar = communities[i].avatar_url;
            data.push(item);
        }
        console.log(data);
        console.log("flag 0");
        sendData(200, res, next, data);
    })
};

//社团注册
var register = function(req, res, next){
    console.log("#######");
    console.log("community register");
    var schema = Joi.object().keys({
        cname: Joi.string().required(),
        profile: Joi.string().required(),
        signup_at: Joi.string().required(),
        school: Joi.string().required(),
        star: Joi.number().required(),
        sid: Joi.string().required()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "community register", "value fails to match the pattern");
            return next();
        }
        console.log(value);
        console.log("flag 1");
        var items = {
            name: value.cname,
            profile: value.profile,
            signup_at: value.signup_at,
            star: value.star,
            school: value.school
        };
        Community.model.find({"name": value.cname}, function(err, community){
            if(err){
                console.error(err);
                sendError(406, res, next, "community register", "select communities fail ");
                return next();
            }
            if(community.length > 0){
                sendError(406, res, next, "community register", "社团重复注册！", {repetition: 1});
                return next();
            }
            console.log("flag 2");
            User.model.findById(value.sid, function(err, user){
                if(err || !user){
                    console.error(err);
                    sendError(406, res, next, "community register", "用户查找失败");
                    return next();
                }
                Community.model.create(items, function(err, community){
                    if(err){
                        console.error(err);
                        sendError(406, res, next, "community register", "社团插入失败");
                        return next();
                    }
                    var comm = {
                        cname: community.name,
                        cid: community._id
                    };
                    user.community = comm;
                    console.log(user);
                    user.save(function(err){
                        if(err){
                            console.error(err);
                            sendError(406, res, next, "community register", "用户保存失败");
                            return next();
                        }
                        console.log("flag 0");
                        sendData(200,  res, next, {result: 1, cid: community._id});
                    });
                });
            });

        });
    });
};

//生成邀请码
var generateCode = function(req, res, next){
    console.log("#######");
    console.log("community generateCode");
    var items = {
        cid: req.params.cid
    };
    Code.model.create(items, function(err, code){
        if(err){
            res.charSet('utf-8');
            res.contentType = 'json';
            res.send(406, {err_name: "code generate fail", err_meg: ""});
            return next();
        }
        res.charSet('utf-8');
        res.contentType = 'json';
        res.send(200, {code: code._id});
        return next();
    });
};

//验证邀请码
var validateCode = function(req, res, next){
    console.log("#######");
    console.log("community validateCode");
    var schema = Joi.object().keys({
        code: Joi.string().length(24).required(),
        sid: Joi.string().length(24).required()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "validateCode", "value fails to match the pattern");
            return next();
        }
        console.log("flag 1");
        Code.model.findById(value.code, function(err, code){
            if(err){
                console.error(err);
                sendError(406, res, next, "validateCode", "");
                return next();
            }
            if(!code){
                sendError(406, res, next, "validateCode", "incorrect invitation code");
                return next();
            }else{
                if(code.status == true){    //邀请码被使用过
                    sendError(406, res, next, "validateCode", "邀请码已经被使用过！", {usedflag: 1});
                    return next();
                }
                console.log("flag 2");
                if(!code.cid){
                    sendData(200, res, next, {status: false}); //邀请码没有对应社团
                }else{
                    Community.model.findById(code.cid, function(err, community){
                        if(err){
                            console.error(err);
                            sendError(406, res, next, "", "");
                            return next();
                        }
                        console.log("flag 3");
                        if(community == null){
                            console.log("community is null");
                            sendError(406, res, next, "validateCode", "the community is null");
                            return next();
                        }
                        User.model.findById(value.sid, function(err, user){
                            if(err){
                                console.error(err);
                                sendError(406, res, next, "", "");
                                return next();
                            }
                            if(!user){
                                sendError(406, res, next, "validateCode", "user is null");
                                return next();
                            }
                            user.community.cid = community._id;
                            user.community.cname = community.name;
                            user.save(function(err, result){
                                if(err){
                                    console.error(err);
                                    sendError(406, res, next, "", "");
                                    return next();
                                }
                                console.log(community.member_count);
                                community.member_count = community.member_count+1;
                                console.log("after");
                                console.log(community.member_count);
                                community.save(function(err){
                                    if(err){
                                        console.error(err);
                                        sendError(406, res, next, "", "");
                                        return next();
                                    }
                                    console.log("flag 0");
                                    code.status = true;
                                    code.save(function(err, result){
                                        if(err){
                                            console.error(err);
                                            sendError(406, res, next, "validateCode", "code used fail");
                                            return next();
                                        }
                                        sendData(200, res, next, {status: true, cid: community._id});
                                    });
                                });
                            });
                        });
                    });
                }

            }
        });
    });
};

/*var changeAvatar = function(req, res, next){
    console.log("#######");
    console.log("community changeAvatar");
    var schema = Joi.object().keys({
        cid: Joi.string().length(24).required()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "changeAvatar", "value fails to match the pattern");
            return next();
        }
        req.body.cid = value.cid;
        var avatarPath = "/jiancheng/img/avatar/community/"+value.cid+"_avatar.jpg";
        console.log(avatarPath);
        console.log("****************************");
        console.log(req);
        console.log("****************************");
        var avatar_data_json = req.body.avatar_data;
        var avatar_data = JSON.parse(avatar_data_json);
        var size = {
            left: Math.ceil(avatar_data.x),
            top: Math.ceil(avatar_data.y),
            width: Math.ceil(avatar_data.width),
            height: Math.ceil(avatar_data.height)};
        //var size = { left: 0, top: 0, width: 200, height: 200 };
        console.log("the image size is : "+ size);
        var imagePath = req.files.avatar_file.path;
        console.log("the imagePath is :  "+ imagePath);
        sharp(imagePath).extract(size).toFormat(sharp.format.jpeg).toFile(avatarPath, function(err){
            if(err){
                console.error(err);
                sendError(406, res, next, "ͷ�����ʧ��", "�ü�ʧ��");
                return next();
            }
            console.log("flag 2");
            Community.model.findById(value.cid, function(err, community){
                if(err){
                    console.error(err);
                    sendError(406, res, next, "", "");
                    return next();
                }
                console.log("flag 3");
                community.avatar_url = "/avatar/community/"+value.cid+"_avatar.jpg";
                community.save(function(err, result){
                    if(err){
                        console.error(err);
                        sendError(406, res, next, "", "");
                        return next();
                    }
                    console.log("flag 0");
                    sendData(200, res, next, {result: 0, avatar_url: result.avatar_url});
                });
            });
        });
        /!*session.validateSession(req, res, next, function(err, req, res, next, flag){
            console.log("flag is :  "+ flag);
            if(err){
                console.error(err);
                sendError(406, res, next, "��֤����", "��������æ");
                return next();
            }
            if(flag != 0){
                sendError(401, res, next, "session����", "���¼");
                return next();
            }else{

            }
        });*!/
    });
};*/

//上传头像图片
var uploadPicture = function(req, res, next){
    console.log("#######");
    console.log("activity uploadPicture");
    var schema = Joi.object().keys({
        cid: Joi.string().length(24).required()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "validateCode", "value fails to match the pattern");
            return next();
        }
        var tmpPath = req.files.avatar.path;
        console.log("the tmpPath is :  "+ tmpPath);
        console.log("flag 1");
        var arry = tmpPath.split("_");
        var pictureName = arry[1];
        var newPath = "/jiancheng/img/avatar/community/"+pictureName+".jpg";
        fs.rename(tmpPath, newPath, function(err){
            if(err){
                console.error(err);
                sendError(406, res, next, "upload", "rename");
                return next();
            }
            console.log("the newPath is : "+ newPath);
            var url = "/avatar/community/"+pictureName+".jpg";
            Community.model.findById(value.cid, function(err, community){
                if(err){
                    console.error(err);
                    sendError(406, res, next, "uploadPicture", "", err);
                    return next();
                }
                community.avatar_url = url;
                community.save(function(err){
                    if(err){
                        console.error(err);
                        sendError(406, res, next, "uploadPicture", "", err);
                        return next();
                    }
                    console.log("flag 0");
                    sendData(200, res, next, {result : 0, url : url})
                });
            });
        });
    });
};


var getActivitiesCount = function(req, res, next){
    console.log("#######");
    console.log("community getActivitiesCount");
    var schema = Joi.object().keys({
        cid:Joi.string().length(24).required()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getActivitiesCount", "value fails to match the pattern");
            return next();
        }
        var data = {};
        Activity.model.count({cid: value.cid}, function(err, count){
            if(err){
                console.error(err);
                sendError(406, res, next, "getActivitiesCount", "can not get total count of activities");
                return next();
            }
            data.total_count = count;
            var condition = {cid: value.cid, "time.end_at" : { $gt: date }};
            Activity.model.count(condition, function(err, count){
                if(err){
                    console.error(err);
                    sendError(406, res, next, "getActivitiesCount", "can not get recent count of activities");
                    return next();
                }
                data.recent_count = count;
                sendData(200, res, next, data);
            });
        });
    });


};

var getVideoList = function(req, res, next){
    console.log("#######");
    console.log("community getVideoList");
    var schema = Joi.object().keys({
        cid:Joi.string().length(24).required()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getActivitiesCount", "value fails to match the pattern");
            return next();
        }
        Video.model.find({cid: value.cid}, function(err, list){
            if(err){
                console.error(err);
                sendError(406, res, next, "getActivitiesCount", "can not get total count of activities");
                return next();
            }
            var data = [];
            for(var i = 0; i<list.length; i++){
                var item = {};
                item.vid = list[i]._id;
                item.title = list[i].title;
                item.path = list[i].path;
                item.cid = list[i].cid;
                item.site = list[i].site;
                item.detail = list[i].detail;
                item.start_at = list[i].start_at;
                item.illustration = list[i].illustration;
                data.push(item);
            }
            sendData(200, res, next, data)
        });
    });


};




var sendError = function(code, res, next, name, meg) {
    res.charSet('utf-8');
    res.contentType = 'json';
    res.send(code, {err_name: name + " error", err_meg: meg});
    return next();
};

var sendData = function (code, res, next, data) {
    res.charSet('utf-8');
    res.contentType = 'json';
    res.send(200, data);
    return next();
};

module.exports = {
    getCommunityInfo : getCommunityInfo,
    getCommunities : getCommunities,
    generateCode: generateCode,
    validateCode: validateCode,
    register: register,
    uploadPicture: uploadPicture,
    getActivitiesCount: getActivitiesCount,
    getVideoList: getVideoList
};