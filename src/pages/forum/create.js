// pages/forum/create.js
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxfile:9,
    files:[],
    gpsaddr:"所在位置",
    gps:'',
    gpscity:'',
    text:''
  },
  textAreaInput:function(e){
    this.setData({
      text:e.detail.value
    });
  },
  btnChooseLocation:function(){
    var that=this;
    wx.chooseLocation({
      success:function(res){
        that.setData({
          gps:res.latitude+","+res.longitude,
          gpsaddr:res.name,
          gpscity: util.getCityFromStr(res.address)
        });
      }
    });
  },
  
  btnPost:function(){
    var that=this;
    if (that.data.files.length <= 0 && util.trimStr(that.data.text)==''){
      wx.showToast({
        title: "什么都没说哦",
        icon: 'loading',
        image: '',
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      });
      return;
    }
    
    wx.showModal({
      title: '',
      content: '确定发布吗？',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: app.ServerUrl()+'/api/postarticle.php',
            method:'POST',
            header:{
              'Cookie': 'PHPSESSID=' + app.globalData.sessionid
            },
            data: {
              pics:that.data.files.join(','),
              type: that.data.type,
              text: that.data.text,
              gps: that.data.gps,
              gpsaddr: that.data.gpsaddr == '所在位置' ? "" : that.data.gpsaddr,
              gpscity: that.data.gpscity,
              token: app.globalData.token
            },
            success:function(res){
              if(parseInt(res.data.err)==0){
                if (that.data.files.length > 0) {
                  that.startUploadImage(res.data.result.articleid, that.data.files, function(){
                    that.backAndRefresh();
                  });
                } else {
                  that.backAndRefresh();
                }
              }else{
                wx.showToast({
                  title: res.data.msg,
                })
              }
            }
          })
        }
      }
    })
  },
  backAndRefresh: function () {
    wx.showModal({
      title: '',
      content: '发布成功',
      showCancel:false,
      success:function(res){
        app.getPrevPage().refresh();
        wx.navigateBack({

        });
      }
    })
  },
  startUploadImage:function(articleid,files,cb){
    var index=1;
    
    function uploadNext(){
      wx.showToast({
        title: '正在上传...' + index + "/" + files.length,
        icon: 'loading',
        mask: true,
        duration: 9999999
      });
      console.log(app.globalData.token, index, files[index - 1], files.length, articleid);
      wx.uploadFile({
        url: app.ServerUrl()+'/api/postarticlepic.php',
        filePath: files[index-1],
        name: 'picture',
        formData:{
          token:app.globalData.token,
          curindex: index,
          totalcount: files.length,
          articleid: articleid
        },
        header: {
          'Cookie': 'PHPSESSID=' + app.globalData.sessionid
        },
        success:function(res){
          console.log("success");
          console.log(res);
          var obj = JSON.parse(res.data);
          if (parseInt(obj.err)==0){
            if (index < files.length){
              index+=1;
              uploadNext();
            }else{
              wx.hideToast();
              if(cb)cb();
            }
          }else{
            
          }
        },
        fail: function (res) {
          console.log("fail");
          console.log(res);
        }
      })
    }
    uploadNext();
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'], //'original', 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        
        var files=that.data.files;
        var curLenth=files.length;
        console.log("本次选择:"+res.tempFilePaths.length);
        console.log("可选总数，当前总数:", that.data.maxfile, curLenth);
        for (var i = 0; i < that.data.maxfile - curLenth;i++){
          console.log(i);
          if (res.tempFilePaths[i]){
            console.log(i);
            files.push(res.tempFilePaths[i]);
          }
        }
        
        that.setData({
          files: files
        });
      }
    })
  },
  previewImage: function(e){
    var that=this;

    var index = e.currentTarget.id.substr(4, e.currentTarget.id.length);
    wx.showActionSheet({
      itemList: ["预览","删除此照片"],
      success:function(res){
        if(res.tapIndex==0){
          wx.previewImage({
            current: that.data.files[index], // 当前显示图片的http链接
            urls: that.data.files // 需要预览的图片http链接列表
          })
        } else if (res.tapIndex == 1){
          var files = that.data.files;
          files.splice(index, 1);
          that.setData({
            files: files
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
      type:options.type
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
	btnGetUserInfo: function () {
		// app.authorizeCheck("scope.userInfo");
		var that = this;
		app.login(function () {
			that.setData({
				uid: !that.data.uid ? app.globalData.userInfo.openid : that.data.uid
			});
		});
	},
  onShow: function () {
    // app.authorizeCheck("scope.userInfo");
		this.setData({
			uid: !this.data.uid ? app.globalData.userInfo.openid : this.data.uid
		});
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
  
  }
})