// pages/fuwu/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  btnCall:function(e){
    var that=this;
    var id=e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: that.data.telephones[id],
    });
  },
  btnBackHome:function(){
    wx.switchTab({
      url: '/pages/billboard/index',
    })
  },
  updateServiceDetail:function(){
    var that = this;
    wx.showLoading({
      title: '正在加载数据',
      mask:true
    })
    wx.request({
      url: app.ServerUrl() + '/api/servicedetail.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        serviceid:that.data.id,
        token: app.globalData.token
      },
      complete:function(){
        wx.hideLoading();
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          that.setData({
            result: res.data.result,
            telephones: res.data.result.telephone.split(",")
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    });
    this.updateServiceDetail();
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
    var that=this;
    return {
      title: that.data.result.title+"——"+app.getAppName()+"一键呼叫",
      path: '/pages/fuwu/detail?id=' + that.data.result.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})