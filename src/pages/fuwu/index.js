// pages/fuwu/index.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oriList:[],
    list:[],
    category:[]
  },
  btnCreate: function () {
    wx.navigateTo({
      url: '/pages/fuwu/create',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  btnFilter:function(e){
    var that=this;
    var id=e.currentTarget.id;
    
    that.doFilter(id);
  },
  doFilter:function(type=null){
    var that=this;
    if (type){
      var list = [];

      for (var item in that.data.oriList) {
        if (that.data.oriList[item].type == type) {
          list.push(that.data.oriList[item]);
        }
      }

      that.setData({
        type:type,
        list: list
      });
    }else{
      that.setData({
        list: that.data.oriList
      });
    }
  },
  bindCall:function(e){
    var that=this;
    var tel_arr = that.data.list[parseInt(e.currentTarget.id)].telephone.split(",");
    
    tel_arr.push("查看详情");

    var actionArr = tel_arr;
    if (that.data.isAdmin) actionArr=actionArr.concat("删除");
    wx.showActionSheet({
      itemList: actionArr,
      success: function (res) {
        if(res.tapIndex<tel_arr.length-1){
          wx.makePhoneCall({
            phoneNumber: tel_arr[res.tapIndex],
          })
        } else if (res.tapIndex == tel_arr.length - 1){
          wx.navigateTo({
            url: '/pages/fuwu/detail?id=' + that.data.list[parseInt(e.currentTarget.id)].id,
          })
        } else if (actionArr[res.tapIndex]=="删除"){
          that.deleteService(that.data.list[parseInt(e.currentTarget.id)].id);
        }
      }
    })
  },
  deleteService:function(id){
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/delservice.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        serviceid:id,
        token: app.globalData.token
      },
      success: function (res) {
        wx.showModal({
          title: '',
          showCancel:false,
          content: res.data.msg,
        })
        if (parseInt(res.data.err) == 0) {
          that.updateServiceList();
        }
      }
    });
  },
  updateServiceCategory:function(){
    var that = this;
    wx.request({
      url: app.ServerUrl()+'/api/servicecategory.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          var list = res.data.result;

          that.setData({
            category: list
          });
        }
      }
    });
  },
  updateServiceList:function(){
    var that=this;
    wx.request({
      url: app.ServerUrl()+'/api/servicelist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          var list = res.data.result;

          that.setData({
            oriList: list,
            list: list
          });

          that.doFilter(that.data.type);
        }
      }
    });
  },
  refresh:function(){
    this.updateServiceList();
  },
  onLoad: function (options) {
    var isAdmin=false;
    if (app.globalData.userInfo){
      isAdmin = app.globalData.userInfo.type == 1;
    }
    this.setData({
      isAdmin: isAdmin
    });
    if (options.type){
      this.setData({
        type: options.type
      });
    }
    this.updateServiceList();
    this.updateServiceCategory();
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
    return {
      title: app.getAppName()+'电话黄页，一键呼叫物业、外卖、送水等服务',
      path: '/pages/fuwu/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})