/**
 * Created by ASUS on 2017/1/12.
 */
var restify = require("restify");
var routers = require('./routers');


var server = restify.createServer({
    name: "jiancheng",
    version: "0.1.0"
});

var plugins = [
    restify.acceptParser(server.acceptable),
    restify.authorizationParser(),
    restify.dateParser(),
    restify.queryParser(),
    restify.jsonp(),
    restify.gzipResponse(),
    //restify.bodyParser(app.config.bodyParser),
    restify.bodyParser(),
    //restify.requestExpiry(),
    //restify.throttle(app.config.throttle),
    //restify.throttle(),
    restify.conditionalRequest()
];

server.use(plugins);

routers(server);

server.listen(8081, function() {
    console.log('%s listening at %s', server.name, server.url);
});