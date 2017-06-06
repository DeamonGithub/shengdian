/**
 * Created by ASUS on 2017/2/15.
 */
var querystring = require("querystring");
var str = '{ "name": 123, "age": 42}';
console.log(str);
var obj = JSON.parse(str);
console.log(obj.name);