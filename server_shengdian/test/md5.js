/**
 * Created by ASUS on 2017/2/19.
 */
const crypto = require("crypto");

const hash = crypto.createHash("md5");

var pwd = hash.update("dddddd").digest('hex');

console.log(pwd);