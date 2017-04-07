/**
 * Created by ASUS on 2017/2/9.
 */

var moment = require("moment");

var arry = [{tm: moment()}, {tm: moment().add(7, "days")}, {tm: moment().add(3, "days")}];
console.log(arry);
console.log("#############################");
for(var i = 0; i < arry.length-1; i++){
    var k = null;
    if(arry[i].tm > arry[i+1].tm){
        k = arry[i].tm;
        arry[i].tm = arry[i+1].tm;
        arry[i+1].tm = k;
    }
}
console.log(arry);