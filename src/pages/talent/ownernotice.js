// pages/forum/create.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    textValue: '',
    testing:true
  },

  textAreaInput: function (e) {
    this.setData({
      text: e.detail.value
    });
  },
  btnTestingSwitch: function (e) {
    this.setData({
      testing: e.detail.value
    });
  },
  btnCreateSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail);
    this.btnPost();
    app.postFormId(e.detail.formId);
  },
  btnPost: function () {
    var that = this;
    if (util.trimStr(that.data.text) == '') {
      wx.showModal({
        title: '',
        content: '缺少公告内容',
      });
      return;
    }
    wx.showModal({
      title: '',
      content: '确定发布此公告吗？'+(that.data.testing?'（测试模式）':'（通知所有订阅者）'),
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '发布中...',
            mask: true
          });
          wx.request({
            url: app.ServerUrl() + '/api/postmarketnotice.php',
            method: 'POST',
            header: {
              'Cookie': 'PHPSESSID=' + app.globalData.sessionid
            },
            data: {
              text: that.data.text,
              goodsid: that.data.goodsid,
              testing: that.data.testing,
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
    wx.navigateBack({});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      goodsid:options.goodsid
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

  }
})