// pages/book/create.js
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    telephone:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  telephoneInput: function (e) {
    this.setData({
      telephone: e.detail.value
    });
  },
  btnPost:function(){
    var that=this;
    wx.request({
      url: app.ServerUrl()+'/api/postbook.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        isbn: that.data.isbn,
        title: that.data.title,
        coverurl: that.data.coverurl,
        telephone: that.data.telephone,
        token: app.globalData.token
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          wx.navigateBack({
            
          });
        } else {
          wx.showModal({
            title: '',
            content: res.data.msg,
          })
        }
      }
    });
  },
  onLoad: function (options) {
    this.setData({
      title:unescape(options.title),
      coverurl:unescape(options.coverurl),
      isbn: options.isbn
    });
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
})