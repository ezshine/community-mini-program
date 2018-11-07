// pages/shop/index.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    searchResult: [],
    page:0,
    canloadmore: false
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.updateMarketList();
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.updateMarketList();
  },
  inputTyping: function (e) {
    if (util.trimStr(e.detail.value) != "") {
      this.setData({
        inputVal: util.trimStr(e.detail.value)
      });
      this.searchBy(util.trimStr(e.detail.value));
    } else {
      this.clearInput();
    }
  },
  searchBy:function(keyword){
    this.updateMarketList(0,keyword);
  },

  btnCreateSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail);
    this.btnCreate();
    app.postFormId(e.detail.formId);
  },
  btnCreate:function(){
    if (!app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      app.authorizeCheck("scope.userInfo");
      return;
    }
    wx.navigateTo({
      url: '/pages/talent/create',
    })
  },
  btnLoadMore: function () {
    if (this.data.canloadmore) {
      this.data.page += 1;
      this.updateMarketList(this.data.page);
    }
  },
  updateMarketList: function (page = 0, kw = ''){
    var that=this;
    wx.request({
      url: app.ServerUrl() +'/api/talentlist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        page: page,
        bv: app.getBuildVersion(),
        keyword:kw
      },
      complete:function(){
        wx.stopPullDownRefresh();
      },
      success: function (res) {

        if (parseInt(res.data.err) == 0) {
          var newlist = res.data.result;

          for (var i = 0; i < newlist.length; i++) {
            for (var item in newlist[i].pics) {
              newlist[i].pics[item] = app.CDNUrl() +"/upload/" + newlist[i].pics[item] + ".jpg";
            }
          }

          var list = [];
          if (page <= 0) {
            list = newlist;
          } else {
            list = that.data.list.concat(newlist);
          }

          for (var i = 0; i < list.length; i++) {
            
            list[i].timedistance = util.getTimeDistance(list[i].createdate);
            list[i].index = i;
          }

          that.setData({
            page: page,
            list: list,
            canloadmore: newlist.length >= 6
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  refresh:function(){
    this.updateMarketList();
  },
  onLoad: function (options) {
    if(options.keyword){
      this.setData({
        inputVal: options.keyword,
        inputShowed:true
      });
      this.updateMarketList(0, options.keyword);
    }else{
      this.updateMarketList();
    }
    
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
    this.updateMarketList();
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
    return {
      title: '邻里之间技能服务共享平台，看孩子找保姆做饭什么都有——'+app.getAppName(),
      path: '/pages/talent/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})