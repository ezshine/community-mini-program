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
    title: '',
    titleValue: '',
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

  btnPost: function () {
    var that = this;
    if (util.trimStr(that.data.text) == '' || util.trimStr(that.data.title) == '') {
      wx.showModal({
        title: '',
        content: '缺少标题或介绍',
      });
      return;
    } 
    wx.showModal({
      title: '',
      content: '确定消费100积分用于发布投票 ' + that.data.title + ' 吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '发布中...',
            mask:true
          });
          wx.request({
            url: app.ServerUrl() + '/api/postarticle.php',
            method: 'POST',
            header: {
              'Cookie': 'PHPSESSID=' + app.globalData.sessionid
            },
            data: {
              type:102,
              text: that.data.text,
              title: that.data.title,
              token: app.globalData.token
            },
            complete:function(){
              wx.hideLoading();
            },
            success: function (res) {
              if (parseInt(res.data.err) == 0) {
                wx.showModal({
                  title: '',
                  content: res.data.msg,
                  showCancel:false,
                  success:function(){
                    that.backAndShowSuccessTips();
                  }
                });
              } else {
                wx.showModal({
                  title: '',
                  content: res.data.msg,
                  showCancel: false
                });
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
	btnGetUserInfo: function () {
		// app.authorizeCheck("scope.userInfo");
		var that = this;
		app.login(function () {
			that.setData({
				uid: !that.data.uid ? app.globalData.userInfo.openid : that.data.uid
			});
		});
	},
  onLoad: function (options) {
    var that = this;
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
		this.setData({
			uid: !this.data.uid ? app.globalData.userInfo.openid : this.data.uid
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

  }
})