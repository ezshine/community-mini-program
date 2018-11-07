// pages/fuwu/create.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    title: '',
    telephone: '',
    type:''
  },
  textAreaInput: function (e) {
    this.setData({
      text: e.detail.value
    });
  },
  titleInput: function (e) {
    this.setData({
      title: e.detail.value
    });
  },
  phoneAreaInput: function (e) {
    this.setData({
      telephone: e.detail.value
    });
  },
  typeInput: function (e) {
    this.setData({
      type: e.detail.value
    });
  },
  btnPost:function(){
    var that = this;
    if (util.trimStr(that.data.telephone) == '' || util.trimStr(that.data.title) == '') {
      wx.showModal({
        title: '',
        showCancel:false,
        content: '缺少标题或电话号码',
      });
      return;
    }
    wx.showModal({
      title: '',
      content: '确定发布一键呼叫 ' + that.data.title + ' 吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '发布中...',
            mask: true
          });
          wx.request({
            url: app.ServerUrl() + '/api/postservice.php',
            method: 'POST',
            header: {
              'Cookie': 'PHPSESSID=' + app.globalData.sessionid
            },
            data: {
              text: that.data.text,
              title: that.data.title,
              telephone: that.data.telephone,
              type: that.data.type,
              token: app.globalData.token
            },
            complete: function () {
              wx.hideLoading();
            },
            success: function (res) {
              if (parseInt(res.data.err) == 0) {
                wx.showModal({
                  title: '',
                  content: res.data.msg,
                  showCancel: false,
                  success: function () {
                    that.backAndShowSuccessTips();
                  }
                });
              } else {
                wx.showToast({
                  title: res.data.msg,
                })
              }
            }
          })
        }
      }
    })
  },
  backAndShowSuccessTips: function () {
    app.getPrevPage().refresh();
    wx.navigateBack({});
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
  
  }
})