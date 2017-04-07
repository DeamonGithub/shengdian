/**
 * Created by ASUS on 2017/1/16.
 */
var db = require("./db");
var user = require("./user");
var activity = require("./activity");
var community = require("./community");
var invitation_code = require("./invitation_code");
var admin = require("./admin");
var library = require("./library_datas");
var mclass = require("./mclass");
module.exports = {
    user : user,
    activity: activity,
    community: community,
    db : db,
    code: invitation_code,
    admin: admin,
    library: library,
    mclass : mclass
};
