// pages/me/timeline.js
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area: ["　　", "燕堤西街7号院", "燕堤西街6号院", "燕堤南路1号院", "燕堤南路2号院","燕堤中街6号院"],
    areaIndex:0,
    editIsShow:false,
    isowner:false,
    relation:0,
    userInfo:{},
    list:[],
    tabs: ["介绍", "话题", "书架","市集"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth:96
  },
  bindPickerChange: function (e) {
    this.setData({
      areaIndex: e.detail.value
    })
    app.globalData.userInfo.area=e.detail.value;
    this.updateUserInfo();
  },
  editInputTyping:function(e){
    this.setData({
      editVal:e.detail.value
    });
  },
  editDone:function(e){
    if(e.currentTarget.id=="slogan"){
      app.globalData.userInfo.slogan = this.data.editVal;
      this.updateUserInfo();
    } else if (e.currentTarget.id == "career") {
      app.globalData.userInfo.career = this.data.editVal;
      this.updateUserInfo();
    } else if (e.currentTarget.id == "mobile") {
      app.globalData.userInfo.mobile = this.data.editVal;
      this.updateUserInfo();
    } else if (e.currentTarget.id == "wechatid") {
      app.globalData.userInfo.wechatid = this.data.editVal;
      this.updateUserInfo();
    } else if (e.currentTarget.id == "qq") {
      app.globalData.userInfo.qq = this.data.editVal;
      this.updateUserInfo();
    } else if (e.currentTarget.id == "tag" && util.trimStr(this.data.editVal)!=""){
      app.globalData.userInfo.tags.push(this.data.editVal);
      this.updateUserInfo();
    }
    this.setData({
      userInfo: app.globalData.userInfo,
      editIsShow:false
    });
    
  },
  editShow:function(id,val,place,maxlength=20){
    this.setData({
      editIsShow: true,
      editId:id,
      editMaxLength: maxlength,
      editVal: val,
      editPlace: place
    });
  },
  updateUserInfo:function(){
    wx.request({
      url: app.ServerUrl()+'/api/updateuserinfo.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: app.globalData.userInfo,
      success: function (res) {
        
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  updateActiveTab:function(){
    if(this.data.activeIndex==0){
      this.refreshTimeLine();
    }
    else if (this.data.activeIndex == 1) {
      this.updateTopicList();
    }
    else if (this.data.activeIndex == 2) {
      this.updateBookList();
    } else if (this.data.activeIndex == 3) {
      this.updateMarketList();
    }
  },
  tabClick: function (e) {
    console.log(e.currentTarget.id);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.updateActiveTab();
  },
  init:function(){
    var that=this;
    that.setData({
      sliderWidth: that.data.sysInfo.windowWidth / that.data.tabs.length,
      sliderOffset: that.data.sysInfo.windowWidth / that.data.tabs.length * that.data.activeIndex
    });
  },
  btnHisFans:function(e){
    
  },
  btnPicPreview: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: [e.currentTarget.id],
    })
  },
  btnCreate:function(){
    wx.navigateTo({
      url: '/pages/forum/create?type=0',
    });
  },
  requestAddFollow:function(cb){
    var that=this;
    wx.request({
      url: app.ServerUrl()+'/api/addfollow.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        uid: app.globalData.userInfo.openid,
        followid: that.data.uid,
        token: app.globalData.token
      },
      success: function (res) {
        if(cb)cb(res.data);
      }
    });
  },
  requestCancelFollow:function(cb){
    var that = this;
    wx.request({
      url: app.ServerUrl()+'/api/cancelfollow.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        uid: app.globalData.userInfo.openid,
        followid: that.data.uid,
        token: app.globalData.token
      },
      success: function (res) {
        if (cb) cb(res.data);
      }
    });
  },
  btnFollowAction:function()
  {
    var that=this;
    if (that.data.relation == 0 || that.data.relation ==3){
      that.requestAddFollow(function (res) {
        wx.showToast({
          title: res.msg
        });
        if (parseInt(res.err) == 0) {
          app.globalData.userInfo.totalfollow = parseInt(app.globalData.userInfo.totalfollow)+1;
          if (that.data.relation == 0) {
            that.setData({
              relation: 2
            });
          } else {
            that.setData({
              relation: 1
            });
          }
        } 
      });
    }else{
      wx.showActionSheet({
        itemList: ["取消关注"],
        itemColor:"#FF0000",
        success:function(res){
          if(res.tapIndex==0){
            that.requestCancelFollow(function (res) {
              wx.showToast({
                title: res.msg
              });
              if (parseInt(res.err) == 0) {
                app.globalData.userInfo.totalfollow = parseInt(app.globalData.userInfo.totalfollow) -1;
                if (that.data.relation == 1) {
                  that.setData({
                    relation: 2
                  });
                } else {
                  that.setData({
                    relation: 0
                  });
                }
              }
            });
          }
        },
        fail:function(res){

        }
      })
    }
    
  },
  btnCoin:function(){
    if(!this.data.isowner)return;
    wx.navigateTo({
      url: '/pages/coincenter/index',
    })
  },
  btnAddTag:function(){
    if (this.data.isowner) {
      this.editShow('tag', '', '形容自己', 10);
    }
  },
  btnDelTag:function(e){
    var that=this;
    if (this.data.isowner) {

      wx.showModal({
        title: '',
        content: '确定删除此标签吗?',
        success:function(res){
          if(res.confirm){
            if (app.globalData.userInfo.tags.length<=1){
              wx.showToast({
                title: '请至少保留一个标签',
              });
              return;
            }
            var index = e.currentTarget.id.substr(4, e.currentTarget.id.length);
            app.globalData.userInfo.tags.splice(parseInt(index), 1);
            that.setData({
              userInfo: app.globalData.userInfo
            });

            that.updateUserInfo();
          }
        }
      })
    }
  },
  btnChangeQQ: function () {
    if (this.data.isowner) {
      this.editShow('qq', this.data.userInfo.qq, 'QQ', 15);
    }else{
      if (util.trimStr(this.data.userInfo.qq)=="")return;
      wx.setClipboardData({
        data: this.data.userInfo.qq,
        success:function(){
          wx.showModal({
            showCancel: false,
            title: '',
            content: '已将此QQ号码复制到剪贴板',
          })
        }
      });
    }
  },
  btnChangeMobile: function () {
    if (this.data.isowner) {
      this.editShow('mobile', this.data.userInfo.mobile, '联系电话', 15);
    } else {
      if (util.trimStr(this.data.userInfo.mobile) == "") return;
      wx.setClipboardData({
        data: this.data.userInfo.mobile,
        success: function () {
          wx.showModal({
            showCancel: false,
            title: '',
            content: '已将此电话号码复制到剪贴板',
          })
        }
      });
    }
  },
  btnChangeWechat: function () {
    if (this.data.isowner) {
      this.editShow('wechatid', this.data.userInfo.wechatid, '微信', 20);
    } else {
      if (util.trimStr(this.data.userInfo.wechatid) == "") return;
      wx.setClipboardData({
        data: this.data.userInfo.wechatid,
        success: function () {
          wx.showModal({
            showCancel:false,
            title: '',
            content: '已将此微信账号复制到剪贴板',
          })
        }
      });
    }
  },
  btnChangeCareer:function () {
    if (this.data.isowner) {
      this.editShow('career', this.data.userInfo.career, '职业', 10);
    }
  },
  btnChangeSlogan:function(){
    if (this.data.isowner){
      this.editShow('slogan',this.data.userInfo.slogan,'写一条酷酷的签名吧',50);
    }
  },

  inputCommentTyping: function (e) {
    var that = this;
    var index = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    var item = that.data.list[index];

    item.tempCommentText = e.detail.value;
  },
  inputCommentOnBlur: function (e) {
    var that = this;
    var index = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    var item = that.data.list[index];

    item.showCommentInput = false;
    that.setData({
      list: that.data.list
    });
  },
  btnCommentSend: function (e) {
    var that = this;
    var index = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    var item = that.data.list[index];

    if (!item.tempCommentText) return;
    if (util.trimStr(item.tempCommentText) == "") return;
    wx.request({
      url: app.ServerUrl()+'/api/postcomment.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        articleid: item.id,
        text: item.tempCommentText,
        token: app.globalData.token
      },
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
        });
        if (parseInt(res.data.err) == 0) {
          item.commentcount = parseInt(item.commentcount) + 1;
          item.commentlist.push({ id: res.data.result.commentid, authorInfo: app.globalData.userInfo, text: item.tempCommentText });

          item.tempCommentText = "";
          item.showCommentInput = false;

          that.setData({
            list: that.data.list
          });
        }
      }
    });
  },
  btnCommentItemAction: function (e) {
    var that = this;
    var commentId = e.currentTarget.id.substr(3, e.currentTarget.id.length);

    wx.showActionSheet({
      itemList: ["删除评论"],
      itemColor: "#ff0000",
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
              if (parseInt(res.data.err) == 0) that.refreshTimeLine();
            }
          });
        } else if (res.tapIndex == 1) {

        }
      }
    })
  },
  btnCommentAction: function (e) {
    var that = this;
    //showCommentInput
    var index = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    var item = that.data.list[index];

    item.showCommentInput = !item.showCommentInput;

    that.setData({
      list: that.data.list
    });
  },
  btnLikeAction: function (e) {
    var that = this;
    var index = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    var item = that.data.list[index];

    wx.request({
      url: app.ServerUrl()+'/api/likeaction.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        articleid: item.id,
        token: app.globalData.token
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          if (parseInt(res.data.result.action) == 0) {
            item.likecount = parseInt(item.likecount) - 1;
            item.isliked = false;
          } else {
            item.likecount = parseInt(item.likecount) + 1;
            item.isliked = true;
          }
          that.setData({
            list: that.data.list
          });
        }
      }
    });
  },
  btnShowLocation:function(e){
    var that=this;
    var index = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    var item = that.data.list[index];
    var gps_arr = item.gps.split(",");
    wx.openLocation({
      latitude: parseFloat(gps_arr[0]),
      longitude: parseFloat(gps_arr[1]),
      name: item.gpsaddr,
      address:item.gpscity
    });
  },
  updateTopicList: function () {
    var that = this;
    wx.request({
      url: app.ServerUrl()+'/api/topiclist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        uid: that.data.uid
      },
      success: function (res) {
        wx.hideToast();

        if (parseInt(res.data.err) == 0) {
          var list = res.data.result;
          var newlist = list;
          for (var i = 0; i < newlist.length; i++) {
            for (var item in newlist[i].pics) {
              newlist[i].pics[item] = app.CDNUrl() + "/upload/" + newlist[i].pics[item] + ".jpg";
            }
          }

          for (var i = 0; i < list.length; i++) {
            list[i].timedistance = util.getTimeDistance(list[i].createdate);
            list[i].index = i;
          }

          that.setData({
            topiclist: list
          });
        }
      }
    });
  },
  updateMarketList: function () {
    var that = this;
    wx.request({
      url: app.ServerUrl()+'/api/talentlist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        uid: that.data.uid
      },
      success: function (res) {
        wx.hideToast();

        if (parseInt(res.data.err) == 0) {
          var list = res.data.result;
          var newlist=list;
          for (var i = 0; i < newlist.length; i++){
            for (var item in newlist[i].pics) {
              newlist[i].pics[item] = app.CDNUrl() + "/upload/" + newlist[i].pics[item] + ".jpg";
            }
          }

          for (var i = 0; i < list.length; i++) {
            list[i].timedistance = util.getTimeDistance(list[i].createdate);
            list[i].index = i;
          }

          that.setData({
            marketlist: list
          });
        }
      }
    });
  },
  updateBookList: function () {
    var that = this;
    wx.request({
      url: app.ServerUrl()+'/api/booklist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        uid: that.data.uid
      },
      success: function (res) {

        if (parseInt(res.data.err) == 0) {
          var list = res.data.result;

          that.setData({
            booklist: list
          });
        }
      }
    });
  },
  refreshTimeLine:function(){
    var that=this;
    console.log(that.data.userInfo);
    wx.request({
      url: app.ServerUrl()+'/api/timeline.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        uid: that.data.uid,
        bv: app.getBuildVersion(),
        token: app.globalData.token
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          wx.setNavigationBarTitle({
            title: res.data.result.userInfo.nickname,
          });
          // var list = res.data.result.list;
          
          // for (var i = 0; i < list.length; i++) {
          //   list[i].timedistance = util.getTimeDistance(list[i].createdate);
          //   list[i].index = i;
          // }

          var userInfo = res.data.result.userInfo;
          userInfo.showFansBar=true;
          userInfo.lastlogindistance = util.getTimeDistance(userInfo.lastlogin);

          // userInfo.sex = '未知';
          // if (userInfo.gender == 2) {
          //   userInfo.sex = '女';
          // } else if (userInfo.gender == 1) {
          //   userInfo.sex = '男';
          // }

          userInfo.typedesc='未认证';
          if(userInfo.type==1){
            userInfo.typedesc='管理员';
          } else if (userInfo.type == 2){
            userInfo.typedesc = '店长';
          }

          that.setData({
            userInfo: userInfo,
            mode: res.data.result.mode,
            // list: list,
            areaIndex:res.data.result.userInfo.area,
            relation:res.data.result.relation
          });
        }
      }
    })
  },
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sysInfo: res
        });
        that.init();
      }
    });

    var isowner=false;
    if (!options.uid || options.uid == app.globalData.userInfo.openid){
      isowner=true;
    }

    this.setData({
      uid: !options.uid ? app.globalData.userInfo.openid : options.uid,
      isowner: isowner
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
	btnGetUserInfo:function(){
		// app.authorizeCheck("scope.userInfo");
		var that=this;
		app.login(function () {
			that.setData({
				uid: !that.data.uid ? app.globalData.userInfo.openid : that.data.uid
			});
			that.updateActiveTab();
		});
	},
  onShow: function () {
		var that=this;
    if (this.data.isowner) {
      // app.authorizeCheck("scope.userInfo");
    }
    this.setData({
      uid: !this.data.uid ? app.globalData.userInfo.openid : this.data.uid
    });
    this.updateActiveTab();
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
      title: app.getAppName()+"——"+that.data.userInfo.nickname+" 的社区名片",
      path: '/pages/me/timeline?uid=' + that.data.uid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})