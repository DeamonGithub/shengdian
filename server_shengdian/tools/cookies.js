/**
 * Created by ASUS on 2017/2/12.
 */
function getCookies(request){
    //Ã·»°‰Ø¿¿∆˜cookie
    var Cookies = {};
    request.headers.cookie && request.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    console.log(Cookies);
    return Cookies;
}

module.exports = {
    getCookies  : getCookies
};