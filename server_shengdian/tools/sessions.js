/**
 * Created by ASUS on 2017/2/10.
 */
var redis = require("redis");
var client = redis.createClient();
var cookies = require("../tools/cookies");
var md5 = require("md5");

var EXPIRES = 40*60*1000;
var key = "session_id";

var generate = function(){
    var md5Value = md5((new Date()).getTime() + Math.random());
    console.log(md5Value);
    var session = {
        session_id : md5Value,
        expires : (new Date()).getTime() + EXPIRES
    };
    client.hmset(session.session_id, session, redis.print);
    return session;
};


var validateSession = function(req, res, next, callback){
    var cookie = cookies.getCookies(req);
    console.log("the cookie is: ");
    console.log(cookie);
    var id = cookie.session_id;
    if(!id){
        //��session_id
        callback(null, req, res, next, 1);
    }else{
        client.hgetall(id, function(err, session){
            if(err){
                console.error(err);
            }
            if(session){
                console.log(session);
                console.log((new Date()).getTime());
                if(session.expires > (new Date()).getTime()){
                    //��Ч���ڣ�����ԭ����ʱ
                    session.expires = (new Date()).getTime() + EXPIRES;
                    req.session = session;
                }else{
                    //��ʱ��ɾ��ԭ����
                    client.del(id, function(err, reply){
                        if(err){
                            console.log(id);
                            console.error(err);//todo
                        }
                    });
                    callback(null, req, res, next, 3);
                    return next();
                }
            }else{
                //session_id����
                callback(null, req, res, next, 2);
                return next();
            }
            callback(err, req, res, next, 0);
        });
    }
};

module.exports = {
    generate : generate,
    validateSession: validateSession,
    EXPIRES: EXPIRES
};