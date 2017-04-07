/**
 * Created by ASUS on 2017/2/6.
 */
var Activity = require("../controllers").activity;

module.exports = function(server) {
    server.post({path: "/api/activity/publish"}, Activity.publish);
    server.get({path: "/api/activity/info"}, Activity.getActivityInfo);
    server.get({path: "/api/activity/hot"}, Activity.getHotActivity);
    server.get({path: "/api/activity/list"}, Activity.getRecentActivities);
    server.post({path: "/api/activity/joinActivity"}, Activity.joinActivity);
    server.post({path: "/api/activity/picture"}, Activity.uploadPicture);
    server.get({path: "/api/activity/byclass"}, Activity.classActivity);
};