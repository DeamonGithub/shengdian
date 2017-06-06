/**
 * Created by ASUS on 2017/2/28.
 */
var _ = require("lodash");

var a = {user: "aaa", pass: "sdf"};
var b = {user: "bbb", pass: "ddaswe" };
var d = {user: "ccc", pass: "sdfasf" };

var c = [];
c.push(a);
c.push(b);

var e = [];
e.push(d);

var f = _.merge(c, e);
//console.log(f

console.log(c);