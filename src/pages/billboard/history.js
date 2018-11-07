// pages/billboard/history.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  btnCreate:function(){
    wx.navigateTo({
      url: '/pages/billboard/create',
    })
  },
  btnMoreAction:function(e){
    var that = this;
    var item=that.data.billboardlist[e.currentTarget.id];
    wx.showActionSheet({
      itemList: ["删除公告"],
      success:function(res){
        if(res.tapIndex==0){
          wx.showModal({
            title: '',
            content: '确定删除公告 '+item.title+' 吗？',
            success:function(res){
              if(res.confirm){
                that.delBillboard(item.id);
              }
            }
          });
        }
      }
    });
  },
  delBillboard:function(articleid){
    var that=this;
    wx.showLoading({
      title: '请求中',
      mask:true
    })
    wx.request({
      url: app.ServerUrl() + '/api/delbillboard.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        articleid: articleid,
        token: app.globalData.token
      },
      complete:function(){
        wx.hideLoading();
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          that.updateBillBoard();
        }
      }
    });
  },
  updateBillBoard:function () {
    var that = this;
    wx.request({
      url: app.ServerUrl()+'/api/billboardlist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          var billboardlist = res.data.result;

          for (var i = 0; i < billboardlist.length; i++) {
            billboardlist[i].timedistance = util.getTimeDistance(billboardlist[i].createdate);
          }



          that.setData({
            billboardlist: billboardlist
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  refresh:function(){
    this.updateBillBoard();
  },
  onLoad: function (options) {
    this.updateBillBoard();
    this.setData({
      isAdmin:app.globalData.userInfo.type==1
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: app.getAppName()+"公告板，社区资讯及时掌握",
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