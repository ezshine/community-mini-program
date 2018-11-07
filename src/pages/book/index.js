// /pages/book/index.js
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    searchResult: [],
    canloadmore:false,
    page:0
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
    this.updateBookList();
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.updateBookList();
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
    this.updateBookList(keyword);
  },
  btnLoadMore: function () {
    if (this.data.canloadmore) {
      this.data.page += 1;
      this.updateBookList("",this.data.page);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  btnScan:function(){
    var that=this;
    wx.showModal({
      title: '',
      content: '请扫描图书封底的条形码',
      success:function(res){
        if(res.confirm){
          that.scanBookCode();
        }
      }
    })
  },
  scanBookCode:function(){
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        console.log(res);
        //if(res.scanType=="EAN_13"){
        wx.request({
          url: app.ServerUrl()+'/api/isbncheck.php',
          method: 'POST',
          header: {
            'Cookie': 'PHPSESSID=' + app.globalData.sessionid
          },
          data: {
            isbn: res.result,
            token: app.globalData.token
          },
          success: function (res) {
            if (parseInt(res.data.err) == 0) {
              wx.navigateTo({
                url: '/pages/book/create?isbn=' + res.data.result.isbn + '&title=' + escape(res.data.result.title) + '&coverurl=' + escape(res.data.result.coverurl),
              })
            } else {
              wx.showModal({
                title: '',
                content: res.data.msg,
              })
            }
          }
        });
        //}
      }
    })
  },
  updateBookList:function(kw="",page=0){
    var that = this;
    wx.request({
      url: app.ServerUrl()+'/api/booklist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        page: page,
        keyword: kw
      },
      success: function (res) {

        if (parseInt(res.data.err) == 0) {
          var newlist = res.data.result;
          var list = [];
          if (page <= 0) {
            list = newlist;
          } else {
            list = that.data.list.concat(newlist);
          }

          that.setData({
            list: list,
            page:page,
            canloadmore: newlist.length>=6
          });
        }
      }
    });
  },
  onLoad: function (options) {
    
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
    this.updateBookList();
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
      title: "社区共享书籍，共享知识和阅读的快乐——"+app.getAppName()+"社区书屋",
      path: '/pages/book/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})