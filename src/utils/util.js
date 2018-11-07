function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function trimStr(str) {
  var s = str.replace(/(^\s*)|(\s*$)/g, "");
  return s;
}

function getTimeDistance(str) {
  //2014-10-29 18:00:00
  var ymd = str.split(" ")[0];
  var ymd_arr = ymd.split("-");
  var hms = str.split(" ")[1];
  var hms_arr = hms.split(":");

  var date1 = new Date(ymd_arr[0], ymd_arr[1] - 1, ymd_arr[2], hms_arr[0], hms_arr[1], hms_arr[2]);
  var date2 = new Date();    //结束时间  
  var date3 = date2.getTime() - date1.getTime();  //时间差的毫秒数  
  //计算出相差天数  
  var days = Math.floor(date3 / (24 * 3600 * 1000));

  //计算出小时数  

  var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
  var hours = Math.abs(Math.floor(leave1 / (3600 * 1000)));
  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000);
  //alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒");

  if (days > 0) {
    if (days / 365 >= 1) {
      return Math.floor(days / 365) + "年前";
    } else {
      return days + "天前";
    }
  } else {
    if (hours > 0) {
      return hours + "小时前";
    } else {
      if (minutes <= 3) {
        return "刚刚";
      } else {
        return minutes + "分钟前";
      }
    }
  }

  return "刚刚";
}

function getCityFromLocation(gps,cb) {
  wx.request({
    url: 'https://api.map.baidu.com/geocoder/v2/?coordtype=gcj02ll&location='+gps+'&output=json&pois=1&ak=PCgWIW1cx4YkYcY7UIYyufosUkVCf9k4',
    method: "GET",
    success: function (res) {
      if (cb) cb(res.data.result);
    }
  })
}
function getLocationFromCity(city, cb) {
  wx.request({
    url: 'https://api.map.baidu.com/geocoder/v2/?address=' + city + '&output=json&ret_coordtype=GCJ02&ak=PCgWIW1cx4YkYcY7UIYyufosUkVCf9k4',
    method: "GET",
    success: function (res) {
      if (cb) cb(res.data.result);
    }
  })
}

function getCityFromStr(str){
  var shiIndex = str.indexOf('市');
  var city = str;
  console.log(city);
  if (shiIndex>=0){
    city = city.substr(0, shiIndex);
    console.log(city);
    var provinceIndex = city.indexOf('省');
    if (provinceIndex>=0){
      city = city.substr(provinceIndex+1, city.length);
      console.log(city);
    } else if (city.indexOf('自治区')>=0){
      city = city.substr(city.indexOf('自治区')+3, city.length);
      console.log(city);
    }
  }else{
    city = city.substr(0, str.indexOf('特别行政区'));
    console.log(city);
  }

  return city;

}

module.exports = {
  formatTime: formatTime,
  getCityFromStr: getCityFromStr,
  getCityFromLocation: getCityFromLocation,
  getLocationFromCity: getLocationFromCity,
  getTimeDistance: getTimeDistance,
  trimStr: trimStr
}

