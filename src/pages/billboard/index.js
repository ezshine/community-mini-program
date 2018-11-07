// pages/billboard/index.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    fastNavCount: 0,
    isopened: false,
    noticereaded: true,
    page: 0,
    canloadmore: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  btnLoadMore: function () {
    if (this.data.canloadmore) {
      this.data.page += 1;
      this.updateTopics(this.data.page);
    }
  },
  btnTopBannerSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);

    console.log(e.currentTarget.id);
    var index = parseInt(e.currentTarget.id);
    var item = this.data.topbanner[index];

    if (item.type == "url") {
      wx.navigateTo({
        url: '/pages/webview/index?url=' + escape(item.navigateto),
      })
    } else {
      wx.navigateTo({
        url: item.navigateto,
      })
    }
  },
  btnFastNavSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);

    var index = parseInt(e.currentTarget.id);
    var item = this.data.fastnav[index];

    if (item.type == "tab") {
      wx.switchTab({
        url: item.page,
      })
    } else if (item.type == "url") {
      wx.navigateTo({
        url: '/pages/webview/index?url=' + escape(item.page),
      })
    } else {
      wx.navigateTo({
        url: item.page,
      })
    }
  },
  btnLoginListSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);
    that.btnUserList();
  },
  btnUserList: function () {
    wx.navigateTo({
      url: '/pages/me/userlist',
    })
  },
  btnOpenSubmit: function (e) {

    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);
    that.setData({
      isopened: true
    });

    wx.getWeRunData({
      fail: function (res) {
        console.log("没有允许读取微信步数");
        // app.authorizeCheck("scope.werun");
      },
      success: function (res) {

        var werunobj = res;
        wx.request({
          url: app.ServerUrl() + '/api/syncwerun.php',
          method: 'POST',
          header: {
            'Cookie': 'PHPSESSID=' + app.globalData.sessionid
          },
          data: {
            iv: werunobj.iv,
            encrypteddata: werunobj.encryptedData,
            session_key: app.globalData.session_key,
            token: app.globalData.token
          },
          complete: function () {
            // wx.hideLoading();
          },
          success: function (res) {
            if (parseInt(res.data.err) == 0) {

            }
          }
        });
      }
    });
  },
  btnCoinCenterSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);
    that.btnCoinCenter();
  },
  btnServiceSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);
    that.btnService();
  },
  btnBookSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);
    that.btnBook();
  },
  btnTalentSubmit: function (e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail);
    app.postFormId(e.detail.formId);
    that.btnTalent();
  },
  btnLikeAction: function (e) {
    var that = this;
    var index = e.currentTarget.id.substr(3, e.currentTarget.id.length);
    var item = that.data.list[index];

    wx.request({
      url: app.ServerUrl() + '/api/likeaction.php',
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
  updateTopics: function (page = 0) {
    var that = this;
    wx.request({
      url: app.ServerUrl() + '/api/topiclist.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        page: page,
        bv: app.getBuildVersion(),
        token: app.globalData.token
      },
      complete: function () {
        wx.stopPullDownRefresh();
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          var newlist = res.data.result;

          for (var i = 0; i < newlist.length; i++) {
            for (var item in newlist[i].pics) {
              newlist[i].pics[item] = app.CDNUrl() + "/upload/" + newlist[i].pics[item] + ".jpg";
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
            list[i].authorInfo.lastlogindistance = util.getTimeDistance(list[i].authorInfo.lastlogin);
            list[i].index = i;
          }

          that.setData({
            list: list,
            page: page,
            canloadmore: newlist.length >= 9
          });
        }
      }
    })
  },
  updateBillBoard: function () {
    var that = this;
    wx.showLoading({
      title: '请求中',
      mask: true
    })
    wx.request({
      url: app.ServerUrl() + '/api/homeindex.php',
      method: 'POST',
      header: {
        'Cookie': 'PHPSESSID=' + app.globalData.sessionid
      },
      data: {
        token: app.globalData.token,
        bv: app.getBuildVersion()
      },
      complete: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
      success: function (res) {
        if (parseInt(res.data.err) == 0) {
          var billboardlist = res.data.result.billboardlist;

          for (var i = 0; i < billboardlist.length; i++) {
            billboardlist[i].timedistance = util.getTimeDistance(billboardlist[i].createdate);
          }

          wx.getStorage({
            key: 'noticereaded',
            success: function (res) {
              if (res.data != billboardlist[0].id) {
                that.setData({
                  noticereaded: false
                });
              }
            },
          })

          var nowweather = res.data.result.weather.data;
          nowweather.date = new Date().getFullYear() + "." + (new Date().getMonth()+1)+"."+new Date().getDate();
          nowweather.aqibgcolor = "#fff";
          nowweather.aqitextcolor = "#000";
          if (nowweather.aqi > 0 && nowweather.aqi <= 50) {
            nowweather.aqistr = "良好，适宜开窗换气";
            nowweather.aqibgcolor = "#fff";
            nowweather.aqitextcolor = "#000";
          }
          else if (nowweather.aqi > 50 && nowweather.aqi <= 100) {          
            nowweather.aqistr = "中等，可以开窗换气"; 
            nowweather.aqibgcolor = "#fffd38";
            nowweather.aqitextcolor = "#000";
          }
          else if (nowweather.aqi > 100 && nowweather.aqi <= 150) { 
            nowweather.aqistr = "对敏感人群不健康"; 
            nowweather.aqibgcolor = "#fd7e23";
            nowweather.aqitextcolor = "#000";
            }
          else if (nowweather.aqi > 150 && nowweather.aqi <= 200) {
            nowweather.aqistr = "轻度污染，减少户外活动";
            nowweather.aqibgcolor = "#fb0d1b";
            nowweather.aqitextcolor = "#fff";
          }
          else if (nowweather.aqi > 200 && nowweather.aqi <= 300) {
             nowweather.aqistr = "有毒害，请做好防护"; 
             nowweather.aqibgcolor = "#666";
             nowweather.aqitextcolor = "#fff";
             }
          else if (nowweather.aqi > 300) {
            nowweather.aqistr = "严重污染，不建议出门";
            nowweather.aqibgcolor = "#000";
            nowweather.aqitextcolor = "#fff";
          }


          var weather = res.data.result.weather.data.forecast;
          console.log(res.data.result.weather.data);

          weather.splice(3, 2);

          var now_arr = res.data.result.now.split("-");
          var nextMonth = now_arr[1];
          if (nextMonth > 12) nextMonth = 1;

          for (var i = 0; i < weather.length; i++) {
            var dtarr = weather[i].date.split("日星期");
            //weather[i].date = dtarr[0] + "日星期";
            if (dtarr[1] == "天") dtarr[1] = "日";

            weather[i].high = weather[i].high.split(" ")[1];
            weather[i].low = weather[i].low.split(" ")[1];
            var wdarr = weather[i].high.split(" ");
            if (i == 0) {
              // weather[i].date = weather[i].nongli;
              weather[i].week = "今天";
            } else {
              weather[i].week = "周" + dtarr[1];
            }
          }

          // var list = res.data.result.newtopics;
          // for (var i = 0; i < list.length; i++) {
          //   for(var item in list[i].pics){
          //     list[i].pics[item] = app.CDNUrl()+"/upload/" + list[i].pics[item]+".jpg";
          //   }
          //   list[i].timedistance = util.getTimeDistance(list[i].createdate);
          //   list[i].authorInfo.lastlogindistance = util.getTimeDistance(list[i].authorInfo.lastlogin);
          //   list[i].index = i;
          // }

          var newgoods = res.data.result.newgoods;
          for (var i = 0; i < newgoods.length; i++) {
            for (var item in newgoods[i].pics) {
              newgoods[i].pics[item] = app.CDNUrl() + "/upload/" + newgoods[i].pics[item] + ".jpg";
            }
          }

          var newvotes = res.data.result.newvotes;
          for (var i = 0; i < newvotes.length; i++) {
            newvotes[i].timedistance = util.getTimeDistance(newvotes[i].createdate);
          }

          //var newcomments = res.data.result.newcomments;

          that.setData({
            result: res.data.result,
            fastNavCount: res.data.result.fastnavpagecount,
            now: res.data.result.now,
            newgoods: newgoods,
            newvotes: newvotes,
            fastnav: res.data.result.fastnav,
            //newcomments: newcomments,
            topbanner: res.data.result.topbanner,
            totalmembers: res.data.result.totalmembers,
            xianhao: res.data.result.xianhao,
            billboardlist: billboardlist,
            nowweather: nowweather,
            weather: weather,
            loginlist: res.data.result.loginlist
          });

          that.updateTopics(0);
        }
      }
    });
  },
  btnWelcomeCopy: function (e) {
    var that = this;

    var now = new Date();
    var welcome = "";
    var weather = that.data.result.weather;
    console.log(weather);
    if (now.getHours() < 12) {
      welcome = "各位邻居早上好，今天是" + weather.data.forecast[0].date + "，尾号" + that.data.xianhao[0] + "。天气" + weather.data.forecast[0].type + "，最高" + weather.data.forecast[0].high + "，最低" + weather.data.forecast[0].low + "，" + weather.data.forecast[0].fengxiang + weather.data.forecast[0].fengli.replace("<![CDATA[", "").replace("]]>", "") + "。" + weather.data.ganmao;
    } else {
      welcome = "各位邻居晚上好，明天是" + weather.data.forecast[1].date + "，尾号" + that.data.xianhao[1] + "。天气" + weather.data.forecast[1].type + "，最高" + weather.data.forecast[1].high + "，最低" + weather.data.forecast[1].low + "，" + weather.data.forecast[1].fengxiang + weather.data.forecast[1].fengli.replace("<![CDATA[", "").replace("]]>", "") + "。" + weather.data.ganmao;
    }
    wx.setClipboardData({
      data: welcome,
    })
    wx.showModal({
      title: '',
      showCancel: false,
      content: '请安语已成功复制，可前往邻居群粘贴'
    })
  },
  btnHistory: function (e) {
    wx.setStorage({
      key: 'noticereaded',
      data: e.currentTarget.id,
    });
    this.setData({
      noticereaded: true
    });
    wx.navigateTo({
      url: '/pages/billboard/history',
    })
  },
  btnCoinCenter: function () {
    wx.navigateTo({
      url: '/pages/coincenter/index',
    })
  },
  btnTalent: function () {
    wx.navigateTo({
      url: '/pages/talent/list',
    })
  },
  btnBook: function () {
    wx.navigateTo({
      url: '/pages/book/index',
    })
  },
  btnService: function () {
    wx.navigateTo({
      url: '/pages/fuwu/index',
    })
  },
  btnForum: function () {
    wx.switchTab({
      url: '/pages/forum/index',
    })
  },
  refresh: function () {
    this.updateBillBoard();
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: app.getAppName(),
    })
    if (options.goodsid) {
      wx.navigateTo({
        url: '/pages/talent/goodsdetail?goodsid=' + options.goodsid,
      })
    } else if (options.topicid) {
      wx.navigateTo({
        url: '/pages/forum/detail?topicid=' + options.topicid,
      })
    } else if (options.tuanid) {
      wx.navigateTo({
        url: '/pages/tuan/detail?topicid=' + options.tuanid,
      })
    } else if (options.pkid) {
      wx.navigateTo({
        url: '/pages/pk/detail?topicid=' + options.pkid,
      })
    } else if (options.url) {
      wx.navigateTo({
        url: '/pages/webview/index?url=' + escape(options.url),
      })
    }
    this.updateBillBoard();
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
    wx.setNavigationBarTitle({
      title: app.getAppName(),
    })
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
    console.log("触发下来");
    this.updateBillBoard();
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
      title: app.getAppName() + "公告板，社区资讯及时掌握",
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