/**
 * Created by ASUS on 2017/3/16.
 */

var Library = require("../models").library;
var Test = require("../models").test;
var Joi = require("joi");
//var library = mongoose.Connection.collection("library_data");
//var Library = db.connection.collection("library_datas");

var grade = function(req, res, next){
    console.log("#######");
    console.log("book grade");
    var schema = Joi.object().keys({
        book_name :Joi.string().required()
        //sid: Joi.string().length(24).required()
    });

    Joi.validate(req.params, schema, function(err, value) {
        if (err) {
            console.error(err);
            sendError(406, res, next, "grade", "参数错误（关键参数为空或含非法字符！）");
            return next();
        }
        var a = 0;
        var b = 0;
        var c = 0;
        var d = 0;
        var rs = 0.5*0.7;
        var vs = 0.064*0.3;
        var result = 0;
        Library.model.findOne({ile: value.book_name}, function(err, book){
            if(err){
                console.error(err);
                sendError(406, res, next, "", "");
                return next();
            }
            if(book == null){
                sendError(406, res, next, "grade", "查无此书！");
                return next();
            }
            console.log("flag 1");
            console.log(book);
            if(book.field2 > 200){
                if(book.field3 > 2352){
                    result = rs+vs*0.3;
                    console.log(result);
                    sendData(200, res, next, {count: book.field1, grade: result});
                    return next();
                }
                a = Math.abs(book.field3 - 588);
                b = a/588;
                vs = Math.pow(0.4, b);
                result = rs+vs*0.3;
                console.log(result);
                sendData(200, res, next, {count: book.field1, grade: result});
                return next();
            }else if(book.field2 < 200){
                if(book.field3 > 2352){
                    result = rs+vs*0.3;
                    console.log(result);
                    sendData(200, res, next, {count: book.field1, grade:result});
                    return next();
                }
                c = Math.abs(book.field2 - 200);
                d = c * 0.0025;
                rs = rs + d * 0.7;
                a = Math.abs(book.field3 - 588);
                b = a/588;
                vs = Math.pow(0.4, b);
                result = rs+vs*0.3;
                console.log(result);
                sendData(200, res, next, {count: book.field1, grade: result});
                return next();
            }else{
                rs = rs + 0.0025*0.7;
                a = Math.abs(book.field3 - 588);
                b = a/588;
                vs = Math.pow(0.4, b);
                result = rs+vs*0.3;
                console.log(result);
                sendData(200, res, next, {count: book.field1, grade: result});
                return next();
            }
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
    grade: grade
};