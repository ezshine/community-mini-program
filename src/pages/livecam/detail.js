// pages/livecam/detail.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentstr: '',
    commentplaceholder: '评论一下',
    replyid: '',
    replyprefix: ''
  },
  commentInput: function (e) {
    var that = this;

    var replyid = that.data.replyid;
    var replyprefix = that.data.replyprefix;
    var commentstr = e.detail.value;
    if (e.detail.value.indexOf(replyprefix) < 0) {
      replyid = '';
      replyprefix = '';
      commentstr = '';
    }
    this.setData({
      replyid: replyid,
      replyprefix: replyprefix,
      commentstr: commentstr
    });
  },
  btnCommentAction: function (e) {
    var that = this;
    var commentId = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    wx.showActionSheet({
      itemList: ["删除此评论"],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.request({
            url: app.ServerUrl() + '/api/delcomment.php',
            method: 'POST',
            header: {
              'Cookie': 'PHPSESSID=' + app.globalData.sessionid
            },
            data: {
              commentid: commentId,
              token: app.globalData.token
            },
            success: function (res) {
              wx.showToast({
                title: res.data.msg,
              });
              if (parseInt(res.data.err) == 0) that.updateTopicDetail(that.data.result.id);
            }
          });
        }
      }
    })
  },
  btnReply: function (e) {
    var that = this;
    var index = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    var item = that.data.result.commentlist[index];

    var replyprefix = "回复" + item.authorInfo.nickname + "：";
    var replyid = item.id;
    if (item.authorInfo.openid == app.globalData.userInfo.openid) {
      replyprefix = '';
      replyid = '';
    }
    that.setData({
      replyid: replyid,
      replyprefix: replyprefix,
      commentstr: replyprefix
    });
  },
  btnPostComment: function () {
    var that = this;

    if (!app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }

    var commentstr = this.data.commentstr;
    commentstr = commentstr.substr(commentstr.indexOf(that.data.replyprefix) + that.data.replyprefix.length, commentstr.length);
    if (util.trimStr(commentstr) == "") return;

    wx.showToast({
      title: '提交中',
      mask: true
    });
    wx.request({
      url: app.ServerUrl() + '/api/postcomment.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        articleid: that.data.topicid,
        replyid: that.data.replyid,
        text: commentstr,
        token: app.globalData.token
      },
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
        });
        if (parseInt(res.data.err) == 0) {
          that.updateTopicDetail();
          // that.data.result.commentcount = parseInt(that.data.result.commentcount) + 1;
          // console.log(app.globalData.userInfo);

          // var commentItem = { id: res.data.result.commentid, authorInfo: app.globalData.userInfo, text: commentstr, timedistance: "刚刚" };
          // if(that.data.replyid!=''){
          //   commentItem.reply = { authorInfo: { nickname: that.data.replyprefix.substring(2, that.data.replyprefix.length-1)}};
          // }
          // that.data.result.commentlist.push(commentItem);

          that.setData({
            commentstr: "",
            replyprefix: '',
            replyid: ''
            // result: that.data.result
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getCamDetail:function(){
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/livecamdetail.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        camid:that.data.camid,
        token: app.globalData.token
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          that.setData({
            result: res.data.result
          });
        }
      }
    });
  },
  onLoad: function (options) {
    this.setData({
      camid:options.camid
    });
    this.getCamDetail();
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
      title: "实时影像："+that.data.result.title,
      path: '/pages/livecam/detail?camid='+that.data.camid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})