/**
 * Created by ASUS on 2017/2/18.
 */
var Activity = require("../models").activity;
var User = require("../models").user;
var Community = require("../models").community;
var Joi = require("joi");

//用户数
var getUserCount = function(req, res, next){
    var schema = Joi.object().keys({
        rid: Joi.string().length(24).required()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getUserCount", err.details.message);
            return next();
        }
        User.model.count({}, function(err, count){
            if(err){
                console.error(err);
                sendError(406, res, next, "getUserCount", "select count fail");
                return next();
            }
            sendData(200, res, next, {totalcount: count});
        });
    });
};

var getUsers = function(req, res, next){
    console.log("#######");
    console.log("getUsers");
    var schema = Joi.object().keys({
        rid: Joi.string().length(24).required()
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getUserCount", "value fails to match the pattern");
            return next();
        }
        var condition = {
            lock: false,
            is_delete: false
        };
        User.model.find(condition, function(err, users){
            if(err){
                console.error(err);
                sendError(406, res, next, "getUserCount", "users error");
                return next();
            }
            var list = [];
            if(users.length <=0){
                sendData(200, res, next, {list: list});
                return next();
            }
            for(var i = 0; i < users.length; i++){
                var user = {};
                user.name = users[i].nickname;
                user.sid = users[i]._id;
                user.school = users[i].school;
                user.cname = users[i].community.cname;
                user.is_delete = users[i].is_delete;
                user.lock = users[i].lock;
                user.sex = users[i].sex;
                user.create_at = users[i].create_at;
                list.push(user);
            }
            console.log("flag 0");
            console.log(list);
            sendData(200, res, next, {list: list});
        })
    });
};

var getActivities = function(req, res, next){
    var schema = Joi.object().keys({
        rid: Joi.string().length(24)
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getActivities", "value fails to match the pattern");
            return next();
        }
        var condition = {
            lock: false,
            is_delete: false
        };
        Activity.model.find(condition, function(err, activities){
            if(err){
                console.error(err);
                sendError(406, res, next, "getUserCount", "users error");
                return next();
            }
            var list = [];
            if(activities.length <=0){
                sendData(200, res, next, {list: list});
                return next();
            }
            for(var i = 0; i < activities.length; i++){
                var activity = {};
                activity.name = activities[i].name;
                activity.aid = activities[i]._id;
                activity.cname = activities[i].community.cname;
                activity.is_delete = activities[i].is_delete;
                activity.lock = activities[i].lock;
                activity.create_at = activities[i].create_at;
                activity.detail = activities[i].detail;
                activity.status = activities[i].status;//0 未处理  1 已通过  2 未通过
                list.push(activity);
            }
            sendData(200, res, next, {list: list});
        })
    });

};

var getActivitiesCount = function(req, res, next){
    var schema = Joi.object().keys({
        rid: Joi.string().length(24)
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getActivities", "value fails to match the pattern");
            return next();
        }
        var count = {
            totalCount: 0,
            aliveCount: 0,
            pastCount: 0
        };
        Activity.model.count({is_delete: false}, function(err, totalCount){
            if(err){
                console.error(err);
                sendError(406, res, next, "getActivities", err);
                return next();
            }
            count.totalCount = totalCount;
            Activity.model.count({is_delete: false, lock: false}, function(err, aliveCount){
                if(err){
                    console.error(err);
                    sendError(406, res, next, "getActivities", err);
                    return next();
                }
                count.aliveCount = aliveCount;
                count.pastCount = totalCount - aliveCount;
                sendData(200, res, next, count);
            });
        });
    });
};

var getCommunitiesCount = function(req, res, next){
    var schema = Joi.object().keys({
        rid: Joi.string().length(24)
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getCommunitiesCount", "value fails to match the pattern");
            return next();
        }
        var condition = {
            is_delete: false
        };
        var count = {
            totalCount : 0,
            deleteCount : 0
        };
        Community.model.count(condition, function(err, totalCount){
            if(err){
                sendError(406, res, next, "getCommunitiesCount", "社团总数计数出错");
                return next();
            }
            count.totalCount = totalCount;
            Community.model.count({is_delete: false}, function(err, deleteCount){
                if(err){
                    sendError(406, res, next, "getCommunitiesCount", "被删除社团计数出错");
                    return next();
                }
                count.deleteCount = deleteCount;
                sendData(200, res, next, count);
            });
        });
    });
};

var getCommunities = function(req, res, next){
    var schema = Joi.object().keys({
        rid: Joi.string().length(24)
    });
    Joi.validate(req.params, schema, function(err, value){
        if(err){
            console.error(err);
            sendError(406, res, next, "getCommunities", "value fails to match the pattern");
            return next();
        }
        var condition = {
            lock: false,
            is_delete: false
        };
        Community.model.find(condition, function(err, communities){
            if(err){
                console.error(err);
                sendError(406, res, next, "getCommunities", "users error");
                return next();
            }
            var list = [];
            if(communities.length <=0){
                sendData(200, res, next, {list: list});
                return next();
            }
            for(var i = 0; i < communities.length; i++){
                var community = {};
                community.name = communities[i].name;
                community.cid = communities[i]._id;
                community.is_delete = communities[i].is_delete;
                community.lock = communities[i].lock;
                community.create_at = communities[i].create_at;
                community.member_count = communities[i].member_count;
                list.push(community);
            }
            sendData(200, res, next, {list: list});
        })
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
    getUserCount: getUserCount,
    getUsers: getUsers,
    getActivities: getActivities,
    getActivitiesCount: getActivitiesCount,
    getCommunitiesCount: getCommunitiesCount,
    getCommunities: getCommunities
};
