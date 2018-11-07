// pages/shop/goodsdetail.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    canloadmore: false,
    page: 0,
    commentlist:[]
  },
  btnItemAdd:function(e){
    var that=this;
    var itemIndex = e.currentTarget.id;
    console.log(itemIndex);
    var amount=that.data.menu[itemIndex].amount;
    
    amount+=1;
    if (amount > 99) amount=99;

    that.data.menu[itemIndex].amount = amount;
    that.setData({
      menu:that.data.menu
    });
  },
  btnItemRemove: function (e) {
    var that = this;
    var itemIndex = e.currentTarget.id;

    var amount = that.data.menu[itemIndex].amount;

    amount -= 1;
    if (amount < 0) amount = 0;

    that.data.menu[itemIndex].amount = amount;
    that.setData({
      menu: that.data.menu
    });
  },
  btnShowLocation: function (e) {
    var that = this;
    var item = that.data.result;
    var gps_arr = item.gps.split(",");
    wx.openLocation({
      latitude: parseFloat(gps_arr[0]),
      longitude: parseFloat(gps_arr[1]),
      name: item.gpsaddr,
      address: item.gpscity
    });
  },
  btnPicPreview: function (e) {
    var that = this;
    var imgIndex = e.currentTarget.id.split("_")[1];
    var item = that.data.result;

    var pics = [];

    for (var i = 0; i < item.pics.length; i++) {
      pics.push(item.pics[i]);
    }

    wx.previewImage({
      current: pics[imgIndex],
      urls: pics,
    })
  },
  btnEdit: function () {
    var that = this;

    var itemList=[];

    if(that.data.result.disablecomment){
      itemList.push("继续接龙");
    }else{
      itemList.push("停止接龙");
    }

    itemList.push("删除接龙");

    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (res.tapIndex == 0) {
          that.pauseTopic();
        } else if (res.tapIndex == 1){
          that.deleteTopic();
        }
      }
    })
  },
  btnCommentAction: function (e) {
    var that = this;
    var commentId = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    wx.showActionSheet({
      itemList: ["删除"],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.request({
            url: app.ServerUrl()+'/api/delcomment.php',
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
              if (parseInt(res.data.err) == 0) {
                that.getTopicComments(0);
                that.data.result.commentcount = parseInt(that.data.result.commentcount) - 1;
                that.setData({
                  result: that.data.result
                });
              }
            }
          });
        }
      }
    })
  },
  btnJielongSubmit:function(e){
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);
    this.btnPostComment();
  },
  btnPostComment: function () {
    var that = this;

    if(!app.globalData.userInfo.id){
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }else{
      if (util.trimStr(app.globalData.userInfo.mobile) == "" && util.trimStr(app.globalData.userInfo.wechatid) == ""){
        wx.showModal({
          title: '',
          content: '添加电话或微信方可参与接龙',
          confirmText:"立即添加",
          success:function(res){
            if(res.confirm){
              wx.switchTab({
                url: '/pages/me/me',
              })
            }
          }
        })
        return;
      }
    }

    var isempty=true;
    var menu = that.data.menu;

    var commentstr="";

    for (var item in menu){
      if(menu[item].amount>0){
        isempty=false;
        commentstr += menu[item].name+" x"+menu[item].amount+",";
        menu[item].amount=0;
      }
    }

    if (isempty){
      wx.showModal({
        title: '',
        showCancel:false,
        content: '请添加要接龙的商品',
      })
      return;
    }

    commentstr=commentstr.substr(0,commentstr.length-1);

    wx.showToast({
      title: '提交中',
      mask:true
    });
    wx.request({
      url: app.ServerUrl()+'/api/postjielong.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        articleid: that.data.topicid,
        text: commentstr,
        token: app.globalData.token
      },
      success: function (res) {
        wx.showModal({
          title: '',
          showCancel:false,
          content: res.data.msg,
        });
        if (parseInt(res.data.err) == 0) {
          that.getTopicComments(0);
          that.data.result.commentcount = parseInt(that.data.result.commentcount) + 1;
          that.setData({
            result: that.data.result
          });
        }else{
          that.getTopicComments(0);
        }
        that.setData({
          menu: menu
        });
      }
    });
  },
  pauseTopic:function(){
    var that = this;

    var pause;
    if (that.data.result.disablecomment) {
      pause=0;
    } else {
      pause=1;
    }

    wx.request({
      url: app.ServerUrl() + '/api/pausejielong.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        articleid: that.data.topicid,
        pause: pause,
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
                
                that.data.result.disablecomment = pause;
                that.setData({
                  result:that.data.result
                });
              }
            }
          }
        });
      }
    });
  },
  deleteTopic: function () {
    var that = this;
    wx.request({
      url: app.ServerUrl()+'/api/delarticle.php',
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
  btnLoadMore: function () {
    if (this.data.canloadmore) {
      this.data.page += 1;
      this.getTopicComments(this.data.page);
    }
  },
  getTopicComments:function(page=0){
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/commentlist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        page: page,
        articleid: that.data.topicid
      },
      success: function (res) {
        wx.hideToast();
        if (parseInt(res.data.err) == 0) {
          var newlist=res.data.result;

          var list = [];
          if (page <= 0) {
            list = newlist;
          } else {
            list = that.data.commentlist.concat(newlist);
          }

          for (var i = 0; i < list.length; i++) {
            list[i].index = i;
            list[i].floor=that.data.result.commentcount-i;

            if (list[i].floor == 1) list[i].floor="龙头";
            else if (list[i].floor == that.data.result.commentcount) list[i].floor = "龙尾";

            list[i].timedistance = util.getTimeDistance(list[i].createdate);
          }

          that.setData({
            commentlist: list,
            page: page,
            canloadmore: newlist.length >= 10
          });
        }
      }
    });
  },
  updateTopicDetail: function () {
    var that = this;
    wx.request({
      url: app.ServerUrl()+'/api/topicdetail.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        bv: app.getBuildVersion(),
        articleid: that.data.topicid
      },
      success: function (res) {
        wx.hideToast();

        if (parseInt(res.data.err) == 0) {
          var result = res.data.result;

          result.timedistance = util.getTimeDistance(result.createdate);

          for (var item in result.pics) {
            result.pics[item] = app.CDNUrl() +"/upload/" + result.pics[item] + ".jpg";
          }

          var menu = JSON.parse(result.text);
          for(var item in menu){
            menu[item].amount=0;
          }

          that.setData({
            menu: menu,
            result: result
          });

          that.getTopicComments();
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
    this.updateTopicDetail();
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
      title: that.data.result.title+"，共"+that.data.result.commentcount+"人接龙",
      path: '/pages/tuan/detail?topicid=' + that.data.topicid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})