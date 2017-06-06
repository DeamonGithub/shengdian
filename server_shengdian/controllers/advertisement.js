/**
 * Created by ASUS on 2017/5/23.
 */
var Advertisement = require("../models");

var Joi = require("joi");

//interface for android banner
var getBanner = function (req, res, next){
    console.log("#######");
    console.log("getbanner");
    Advertisement.model.find({is_delete: false}, null, {sort: {create_at: -1}, limit: 5},
        function(err, items){
            if(err){
                console.error(err);
                sendError(406, res, next, "", "");
                return next();
            }
            var images = [];
            var tips = [];
            for(var i = 0; i < items.length; i++){
                var item = items[i];
                images.push(item.image_url);
                tips.push(item.tip);
            }
            sendData(200, res, next, {images: images, tips: tips});
            return next();
        });
};

var addBanner = function (req, res, next){
    console.log("#######");
    console.log("addbanner");
    var schema = Joi.object().keys({
        tip: joi.string() //todo
    });
    Joi.validate(req.params, schema, function(err, value) {
        if(err) {
            console.error(err);
            sendError(406, res, next, "", "");
            return next();
        }
        Advertisement.model.findOne({tip: value.tip}, function(err, ad){
            if(err){
                console.error(err);
                sendError(406, res, next, "", "");
                return next();
            }
            if(item){
                console.log("This advertisement already exists");
                sendError(406, res, next, "", "");
                return next();
            }
            ad.tip = value.tip;
            ad.save(function(err){
                console.log("ad save failure");
                sendError(406, res, next, "", "");
                return next();
            });
            sendData(200, res, next, {result: 0});
            return next();
        });
    });
};

var sendError = function(code, res, next, name, meg, value) {
    res.charSet('utf-8');
    res.contentType = 'json';
    var data = {
        err_name: name + " error",
        err_meg:  meg
    };
    console.log(value);
    if(value){
        _.merge(data, value );
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