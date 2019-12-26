// var now = new Date().getTime();

//   // 下面两种转换格式都可以。
//   // var tmpTime = Date.parse(new Date(time.replace(/-/gi,"/")));
//   time = 1577327170
// //   var tmpTime = Date.parse(time.replace(/-/gi, "/"));

//   var diffValue = now - time;

//   console.log(now,time,diffValue)

console.log(GetDateDiff("2018-02-27 19:20:22","2018-02-27 09:20:22","hour"));

function GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime =new Date(startTime); //开始时间
    var eTime =new Date(endTime); //结束时间
    //作为除数的数字
    var timeType =1;
    switch (diffType) {
        case"second":
            timeType =1000;
        break;
        case"minute":
            timeType =1000*60;
        break;
        case"hour":
            timeType =1000*3600;
        break;
        case"day":
            timeType =1000*3600*24;
        break;
        default:
        break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
}