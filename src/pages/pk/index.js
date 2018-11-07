// pages/pk/index.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page:0,
    canloadmore:false
  },
  btnCreateSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail);
    this.btnCreate();
    app.postFormId(e.detail.formId);
  },
  btnCreate:function(){
    if (!app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }
    wx.navigateTo({
      url: '/pages/pk/create',
    })
  },
  btnLoadMore: function () {
    if (this.data.canloadmore) {
      this.data.page += 1;
      this.updatePKList(this.data.page);
    }
  },
  updatePKList: function (page = 0) {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/votelist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        page: page
      },
      complete: function () {
        wx.stopPullDownRefresh();
      },
      success: function (res) {

        if (parseInt(res.data.err) == 0) {
          var newlist = res.data.result;

          var list = [];
          if (page <= 0) {
            list = newlist;
          } else {
            list = that.data.list.concat(newlist);
          }

          for (var i = 0; i < list.length; i++) {

            list[i].timedistance = util.getTimeDistance(list[i].createdate);
            list[i].index = i;
          }

          that.setData({
            page: page,
            list: list,
            canloadmore: newlist.length >= 6
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  refresh:function(){
    this.updatePKList();
  },
  onLoad: function (options) {
    this.updatePKList();
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
    this.updatePKList();
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
      title: "发起民意调查，共建和谐社区——"+app.getAppName(),
      path: '/pages/pk/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})