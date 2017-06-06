/**
 * Created by ASUS on 2017/2/28.
 */
var af = function(){
    var a = 0;
    var c = 0;
    for(var i = 0; i < 10; i++){
        setTimeout(function(){
            a++;
            console.log(a);
            c++;
            if(c == 10){
                console.log(a);
            }
        }, 1000);
    }
};
af();