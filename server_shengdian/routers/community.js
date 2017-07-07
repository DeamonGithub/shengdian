/**
 * Created by ASUS on 2017/2/6.
 */
var Community = require("../controllers").community;

module.exports = function(server) {
    server.get({path: "/api/community/info"}, Community.getCommunityInfo);
    server.get({path: "/api/community/list"}, Community.getCommunities);
    server.post({path: "/api/community/code"}, Community.generateCode);
    server.post({path: "/api/community/validate_code"}, Community.validateCode);
    server.post({path: "/api/community/signup"}, Community.register);
    server.post({path: "/api/community/avatar"}, Community.uploadPicture);
    server.get({path: "/api/community/activities/count"}, Community.getActivitiesCount);
    server.post({path: "api/community/video/list"}, Community.getVideoList);
};