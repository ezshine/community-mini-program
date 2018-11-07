// pages/me/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  btnMyShop:function(){
    wx.navigateTo({
      url: '/pages/shop/myshop',
    })
  },
  btnMedals:function(){
    wx.navigateTo({
      url: '/pages/me/medals',
    })
  },
  btnMyDetail:function(){
    wx.navigateTo({
      url: '/pages/me/timeline?uid=' + app.globalData.userInfo.openid,
    })
  },
  btnMyFans:function(){
    wx.navigateTo({
      url: '/pages/me/fans',
    })
  },
  btnMyFollow:function(){
    wx.navigateTo({
      url: '/pages/me/follow',
    })
  },
  btnMyCircle:function(){
    wx.navigateTo({
      url: '/pages/me/mycircle',
    })
  },
  btnSetting: function () {
    wx.navigateTo({
      url: '/pages/me/setting',
    })
  },
  onLoad: function (options) {
    
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
    var that = this;
    that.setData({
      headimg: app.globalData.userInfo.headimg,
      nickname: app.globalData.userInfo.nickname,
      totalfeed: app.globalData.userInfo.totalfeed,
      totalfans: app.globalData.userInfo.totalfans,
      totalfollow: app.globalData.userInfo.totalfollow
    });
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})