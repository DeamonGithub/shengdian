/**
 * Created by ASUS on 2017/1/15.
 */
var User = require("../controllers").user;

module.exports = function(server) {
    server.post({path: "/api/user/login"}, User.login);
    server.post({path: "/api/user/signup"}, User.register);
    server.get({path: "/api/user/info"}, User.getUserInfo);
    server.get({path: "/api/user/test"}, User.test);
    server.get({path: "/api/user/activities"}, User.getLikeActivity);
    server.post({path: "/api/user/changepwd"}, User.changePwd);
    server.post({path: "/api/user/updateinfo"}, User.changeInfo);
    server.post({path: "/api/user/change_avatar"}, User.changeAvatar);
    server.post({path: "/api/user/exit"}, User.exit);
    server.post({path: "/api/user/rmActivity"}, User.removeActivity);
};