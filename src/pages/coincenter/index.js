// pages/coincenter/index.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  btnCoinHistory:function(){
    wx.navigateTo({
      url: '/pages/coincenter/history',
    })
  },
  btnTalent:function(){
    wx.navigateTo({
      url: '/pages/talent/list?keyword=积分',
    })
  },
  btnBook: function () {
    wx.navigateTo({
      url: '/pages/book/index',
    })
  },
  btnForum: function () {
    wx.switchTab({
      url: '/pages/forum/index',
    })
  },
  btnCheckinSubmit:function(e){
    var that = this;

    if (!app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }

    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);
    that.btnCheckin();
  },
  btnCheckin: function () {
    var that=this;

    if (that.data.result.checkined) return;
    wx.showLoading({
      title: '请求中',
      mask:true
    })
    wx.request({
      url: app.ServerUrl()+'/api/checkin.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token
      },
      fail: function (res) {
        wx.hideLoading();
      },
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
        });
        if (parseInt(res.data.err) == 0) {
          var value=parseInt(res.data.result.value);
          that.data.result.checkined=true;
          that.data.result.userinfo.coin = parseInt(that.data.result.userinfo.coin)+value;
          that.data.result.todayraise = parseInt(that.data.result.todayraise)+value;
          that.setData({
            result: that.data.result
          });
        }
      }
    });
  },
  postShareAction: function () {
    var that=this;
    wx.request({
      url: app.ServerUrl() + '/api/share.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
        });
        if (parseInt(res.data.err) == 0) {
          var value = parseInt(res.data.result.value);
          that.data.result.userinfo.coin = parseInt(that.data.result.userinfo.coin) + value;
          that.data.result.todayraise = parseInt(that.data.result.todayraise) + value;
          that.setData({
            result: that.data.result
          });
        }
      }
    });
  },
  btnWerun:function(){
    wx.navigateTo({
      url: '/pages/pk/werun',
    })
  },
  updateCoinCenter: function () {
    var that = this;

    if (!app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }

    wx.showLoading({
      title: '请求中',
      mask:true
    })
    wx.request({
      url: app.ServerUrl()+'/api/coincenter.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token
      },
      complete: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          console.log(res.data.result.userinfo);
          that.setData({
            result: res.data.result
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateCoinCenter();
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
    // this.updateCoinCenter();
		app.authorizeCheck("scope.userInfo");
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
    this.updateCoinCenter();
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
      title: "一键呼叫物业，点餐，邻里集市在家开店赚钱。"+app.getAppName()+"邻居都在用",
      path: '/pages/billboard/index',
      imageUrl:app.ServerUrl()+"/images/thumb.jpg",
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