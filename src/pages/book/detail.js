// pages/book/detail.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getBookDetail:function(isbn){
    wx.showLoading({
      title: '加载中',
      mask:true
    });
    var that = this;
    wx.request({
      url: app.ServerUrl()+'/api/booklist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        isbn: isbn
      },
      success: function (res) {
        wx.hideLoading();
        if (parseInt(res.data.err) == 0) {

          for (var item in res.data.result.list){
            res.data.result.list[item].lastlogindistance = util.getTimeDistance(res.data.result.list[item].lastlogin);
          }

          that.setData({
            result: res.data.result
          });
        }
      }
    });
  },
  btnCall:function(e){
    var that=this;
    var index = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    
    var item=that.data.result.list[index];
    var as_arr=[];
    if (item.qq){
      as_arr.push("QQ："+item.qq);
    }
    if (item.wehchatid) {
      as_arr.push("微信：" + item.wechatid);
    }
    if (item.mobile) {
      as_arr.push("电话：" + item.mobile);
    }
    if (item.mobile == "" && item.qq == "" && item.wechatid==""){
      as_arr.push("TA没有留下联系方式");
    }
    wx.showActionSheet({
      itemList: as_arr,
    })
  },
  onLoad: function (options) {
    this.getBookDetail(options.isbn);
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
      title: "《" + that.data.result.detail.title+"》——"+app.getAppName()+"书屋",
      path: '/pages/book/detail?isbn=' + that.data.result.detail.isbn,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})