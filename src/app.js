//app.js
App({
  getVersion:function(){
    return "1.1.0";
  },
  getBuildVersion:function(){
    return 1008;
  },
  getAppName:function(){
    return "小程序名称";
  },
  CDNUrl:function(){
    return "静态文件的CDN地址";
  },
  ServerUrl:function(){
    return "API服务器的地址";
  },
  postFormId: function (formid) {
    var that = this;
    wx.request({
      url: that.ServerUrl()+'/api/reportformid.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + that.globalData.sessionid
      },
      data: {
        formid: formid,
        token: that.globalData.token
      },
      complete: function () {

      },
      success: function (res) {
        console.log(res.data);
        if (parseInt(res.data.err) == 0) {

        }
      }
    });
  },
  getPrevPage: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    return prevPage;
  },
  getPageByNaviLevel: function (level) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - level];

    return prevPage;
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that=this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    that.login();
  },
  login:function(success){
    var that=this;
    this.getUserInfo(function (obj) {
      that.getMemberInfo(obj, function (result) {
        that.globalData.userInfo = result;
        that.globalData.token = result.token;
        that.globalData.sessionid = result.sessionid;
				if (success) success();
      });
    });
  },
  authorizeCheck:function(scope){
    var that=this;
    wx.getSetting({
      success:function(res){
        if(!res.authSetting[scope]){
					wx.navigateTo({
						url: '/pages/me/login',
					})
          // wx.showModal({
          //   title: '',
          //   content: '请打开必须的授权设置',
          //   showCancel:false,
          //   success:function(res){
          //     if(res.confirm){
          //       wx.openSetting({
          //         success: function (res) {
          //           console.log(res);
          //           if (res.authSetting[scope] == true) {
          //             that.login();
          //           }
          //         }
          //       });
          //     }
          //   }
          // })
        }
      }
    })
  },
  getMemberInfo:function(obj,cb){
    var that=this;
    wx.request({
      url: that.ServerUrl()+'/api/login.php',
      method:'POST',
      data:obj,
      success:function(res){
        if(parseInt(res.data.err)==0){
          if(cb)cb(res.data.result);
        }else{
          wx.showModal({
            title: '',
            content: res.data.msg
          })
        }
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo.islogin){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res2) {
              console.log(res2);
              // console.log(res2.userInfo);
              that.globalData.userInfo = res2.userInfo;
              that.globalData.userInfo.islogin = true;
              wx.request({
                url: that.ServerUrl()+'/api/getopenid.php',
                method:'POST',
                data:{
                  code:res.code
                },
                success: function (res3) {
                  // console.log(res3);
                  that.globalData.session_key = res3.data.result.session_key;
                  that.globalData.userInfo.openid = res3.data.result.openid;
                  typeof cb == "function" && cb(that.globalData.userInfo)
                }
              })
            },
            fail:function(){
              // that.authorizeCheck("scope.userInfo");
            }
          });
        }
      })
    }
  },
  globalData:{
    userInfo:{
      islogin:false
    }
  }
})