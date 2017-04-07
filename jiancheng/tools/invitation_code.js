/**
 * Created by ASUS on 2017/2/19.
 */
var Code = require("../models").code;

var generate = function(cid){
    var items = {
        cid: cid
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

modules.exports = {
    generate: generate
};