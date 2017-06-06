/**
 * Created by ASUS on 2017/2/10.
 */
var redis = require("redis");
var client = redis.createClient();

client.on("error", function(err){
    console.error(err);
});

/*client.hmset("sid", {
    "key1": "123",
    "key2": 1234
} );*/

client.del("sid", function(err, reply){
    console.error(err);
    console.log("#####");
    console.dir(reply);
});




