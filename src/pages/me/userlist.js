// pages/me/userlist.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arearank:[],
    loginlist:[],
    totalcount:0
  },
  updateUserList:function(){
    var that=this;
    wx.request({
      url: app.ServerUrl() + '/api/userlist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token
      },
      complete: function (res) {
        wx.hideLoading();
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          var totalcount=0;
          for(var item in res.data.result.arearank){
            totalcount += parseInt(res.data.result.arearank[item].count);
          }
          that.setData({
            totalcount: totalcount,
            loginlist:res.data.result.loginlist,
            arearank:res.data.result.arearank
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.updateUserList();
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
      title: that.data.totalcount+"位邻居都在用——"+app.getAppName(),
      path: '/pages/billboard/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})