// pages/pk/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  btnSyncTodaySubmit:function(e){
    var that=this;

    if (!app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }

    wx.getWeRunData({
      fail:function(res){
        app.authorizeCheck("scope.werun");
      },
      success:function(res) {

        var werunobj = res;
        //console.log(res);
        //const encryptedData = res.encryptedData
        wx.showLoading({
          title: '请求中',
          mask:true
        })
        wx.request({
          url: app.ServerUrl() + '/api/syncwerun.php',
          method: 'POST',
          header: {
            'Cookie': 'PHPSESSID=' + app.globalData.sessionid
          },
          data: {
            iv: werunobj.iv,
            encrypteddata: werunobj.encryptedData,
            session_key: app.globalData.session_key,
            token: app.globalData.token
          },
          complete: function () {
            
          },
          success: function (res) {
            wx.showToast({
              title: res.data.msg,
              mask:true
            })
            if (parseInt(res.data.err) == 0) {
              that.updateWerun();
            }
          }
        });
      }
    });
  },
  updateWerun:function(){
    var that=this;
    wx.showLoading({
      title: '请求中',
      mask:true
    })
    wx.request({
      url: app.ServerUrl() + '/api/getwerun.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token
      },
      complete: function () {
        //wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
          mask: true
        })
        if (parseInt(res.data.err) == 0) {
          that.setData({
            todaystep: res.data.result.todaystep,
            todaypersonal: res.data.result.todaypersonal,
            yesterdaypersonal: res.data.result.yesterdaypersonal,
            monthpersonal: res.data.result.monthpersonal,
            lastmonthpersonal: res.data.result.lastmonthpersonal
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateWerun();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.updateWerun();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "微信新功能，运动步数小区PK，看你的运动量在小区排第几~",
      path: '/pages/pk/werun',
      success: function (res) {
        // 转发成功
        that.postShareAction();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})