/**
 * Created by ASUS on 2017/3/9.
 */
var Admin = require("../controllers").admin;

module.exports = function(server) {
    server.get({path: "/api/admin/user_count"}, Admin.getUserCount);
    server.get({path: "/api/admin/activity_count"}, Admin.getActivitiesCount);
    server.get({path: " /api/admin/user_info"}, Admin.getUsers);
    server.get({path: "/api/admin/activity_info"}, Admin.getActivities);
    server.get({path: "/api/admin/community_count"}, Admin.getCommunitiesCount);
    server.get({path: "/api/admin/community_info"}, Admin.getCommunities);
};