// pages/talent/coinexchange.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isowner:false,
    canloadmore: false,
    page: 0,
  },
  btnExchange:function(){
    var that = this;
    wx.showModal({
      title: '',
      content: '确认进行兑换吗？\r\n'+
      that.data.goodsdetail.title+
      '（'+that.data.goodsdetail.exchangecoin + '积分兑换' + that.data.goodsdetail.exchangeprice+'元）',
      success:function(res){
        if(res.confirm){
          that.postExchange();
        }
      }
    })
  },
  btnOwnerReceive:function(e){
    var that = this;
    var exchangeid = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    console.log(exchangeid);
    if(that.data.isowner){
      wx.showToast({
        title: '请求中',
        mask:true
      });
      wx.request({
        url: app.ServerUrl() + '/api/coinexchangeconfirm.php',
        method: 'POST',
        header: {
          'Cookie': 'PHPSESSID=' + app.globalData.sessionid
        },
        data: {
          token: app.globalData.token,
          exchangeid: exchangeid,
          goodsid: that.data.goodsid
        },
        success: function (res) {
          if (parseInt(res.data.err) == 0) {
            wx.showToast({
              title: res.data.msg,
            });
            that.updateExchangeDetail();
          }
        }
      });
    }
  },
  postExchange:function(){
    var that = this;
    wx.showToast({
      title: '请求中',
      mask:true
    });
    wx.request({
      url: app.ServerUrl() + '/api/postcoinexchange.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        goodsid: that.data.goodsid
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          wx.showToast({
            title: res.data.msg,
          });
          that.updateExchangeDetail();
        }
      }
    });
  },
  btnLoadMore: function () {
    if (this.data.canloadmore) {
      this.data.page += 1;
      this.updateExchangeDetail(this.data.page);
    }
  },
  updateExchangeDetail: function (page = 0) {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/exchangedetail.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        type:101,
        page:page,
        goodsid: that.data.goodsid
      },
      complete: function () {
        wx.stopPullDownRefresh();
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          // console.log(app.globalData.userInfo.openid);
          // console.log(res.data.result.goodsdetail.authorInfo.openid);
          var newlist = res.data.result.exchangehistory;

          var list = [];
          if (page <= 0) {
            list = newlist;
          } else {
            list = that.data.exchangehistory.concat(newlist);
          }

          that.setData({
            exchangehistory: list,
            page: page,
            canloadmore: newlist.length >= 10,
            goodsdetail: res.data.result.goodsdetail,
            userInfo: res.data.result.userInfo,
            isowner: app.globalData.userInfo.openid == res.data.result.goodsdetail.authorInfo.openid
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
      goodsid: options.goodsid
    });
    this.updateExchangeDetail();
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
    this.updateExchangeDetail();
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
      title: that.data.result.title + "——支持积分兑换",
      path: '/pages/talent/goodsdetail?goodsid=' + that.data.goodsid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})