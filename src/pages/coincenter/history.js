// pages/coincenter/history.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    canloadmore: false,
    page: 0
  },
  btnLoadMore: function () {
    if (this.data.canloadmore) {
      this.data.page += 1;
      this.updateHistory(this.data.page);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  updateHistory: function (page=0) {
    var that = this;
    wx.showLoading({
      title: '请求中',
      mask:true
    })
    wx.request({
      url: app.ServerUrl()+'/api/coinhistorylist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        page:page,
        token: app.globalData.token
      },
      complete: function (res) {
        wx.hideLoading();
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

          that.setData({
            list: list,
            page: page,
            canloadmore: newlist.length >= 6
          });
        }
      }
    });
  },
  onLoad: function (options) {
    this.updateHistory();
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
    this.updateHistory();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})