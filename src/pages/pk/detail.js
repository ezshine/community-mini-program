// pages/shop/goodsdetail.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    votevaluelist:[],
    canloadmore:false,
    page:0,
    voteFormShowed:false
  },
  btnVoteOppose:function(){
    this.setData({
      voteFormShowed:true,
      votevalue:1
    });
    //this.postVote(1);
  },
  textAreaInput:function(e){
    this.setData({
      comment:e.detail.value
    });
  },
  btnVoteSupport: function () {
    this.setData({
      voteFormShowed: true,
      votevalue:2
    });
    //this.postVote(2);
  },
  btnConfirmPostVote:function(){
    this.postVote(this.data.votevalue, this.data.comment);
    this.setData({ voteFormShowed: false, votevalue: null, comment:""});
  },
  btnCancel: function () {
    this.setData({ voteFormShowed: false, votevalue: null, comment:""});
  },
  postVote:function(votevalue,comment=''){
    var that = this;
    if (!app.globalData.userInfo.id) {
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }
    if(!votevalue)return;
    wx.showModal({
      title: '',
      content: '一人一票，不可更改！确定投' + (votevalue == 1 ? "反对" : "支持") +'票吗？',
      confirmText: '确定' + (votevalue == 1 ? "反对" : "支持"),
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.ServerUrl() + '/api/postvote.php',
            method: 'POST',
            header: {
              'Cookie': 'PHPSESSID=' + app.globalData.sessionid
            },
            data: {
              articleid: that.data.topicid,
              votevalue: votevalue,
              comment: comment,
              token: app.globalData.token
            },
            success: function (res) {
              wx.showModal({
                title: '',
                showCancel:false,
                content: res.data.msg
              });
              if(parseInt(res.data.err)==0){
                if(votevalue==1){
                  that.data.result.opposecount+=1;
                } else if (votevalue==2){
                  that.data.result.supportcount += 1;
                }
                that.setData({
                  result: that.data.result
                });
                that.updateVotevalueList();
              }
            }
          });
        }
      }
    })
  },
  btnEdit: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ["置顶", "删除"],
      success: function (res) {
        if (res.tapIndex == 0) {
          that.flashTopic();
        } else if (res.tapIndex == 1) {
          that.deleteTopic();
        }
      }
    })
  },
  flashTopic: function () {
    var that = this;
    wx.showModal({
      title: '',
      content: '将此内容置于首位，需消耗您50积分',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.ServerUrl() + '/api/flasharticle.php',
            method: 'POST',
            header: {
              'Cookie': 'PHPSESSID=' + app.globalData.sessionid
            },
            data: {
              articleid: that.data.topicid,
              token: app.globalData.token
            },
            success: function (res) {
              wx.showToast({
                title: res.data.msg,
              });
            }
          });
        }
      }
    })
  },
  deleteTopic: function () {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/delarticle.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        articleid: that.data.topicid,
        token: app.globalData.token
      },
      success: function (res) {
        wx.showModal({
          title: '',
          content: res.data.msg,
          showCancel: false,
          success: function (obj) {
            if (obj.confirm) {
              if (parseInt(res.data.err) == 0) {
                app.getPrevPage().refresh();
                wx.navigateBack({

                });
              }
            }
          }
        });
      }
    });
  },
  updatePKDetail: function () {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/votedetail.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        articleid: that.data.topicid
      },
      success: function (res) {
        wx.hideToast();

        if (parseInt(res.data.err) == 0) {
          var result = res.data.result;

          result.timedistance = util.getTimeDistance(result.createdate);

          that.setData({
            result: result
          });
        }
      }
    });
  },
  btnLoadMore: function () {
    if (this.data.canloadmore) {
      this.data.page += 1;
      this.updateVotevalueList(this.data.page);
    }
  },
  updateVotevalueList: function (page=0) {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/votevaluelist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        page:page,
        articleid: that.data.topicid
      },
      success: function (res) {
        wx.hideToast();

        if (parseInt(res.data.err) == 0) {
          var newlist = res.data.result;

          var list = [];
          if (page <= 0) {
            list = newlist;
          } else {
            list = that.data.votevaluelist.concat(newlist);
          }

          for (var i = 0; i < list.length; i++) {

            list[i].timedistance = util.getTimeDistance(list[i].createdate);
          }

          that.setData({
            votevaluelist: list,
            page: page,
            canloadmore: newlist.length >= 10
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      topicid: options.topicid
    });
    this.updatePKDetail();
    this.updateVotevalueList();
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
      title: that.data.result.title,
      path: '/pages/pk/detail?topicid=' + that.data.topicid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})