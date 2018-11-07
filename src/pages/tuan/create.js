// pages/forum/create.js
var app=getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxfile:4,
    files:[],
    gpsaddr: "取货地点",
    gps: '',
    gpscity: '',
    text:'',
    menu:[],
    addItemName:"",
    addItemPrice:""
  },
  btnChooseLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          gps: res.latitude + "," + res.longitude,
          gpsaddr: res.name,
          gpscity: util.getCityFromStr(res.address)
        });
      }
    });
  },
  textAreaInput:function(e){
    this.setData({
      text:e.detail.value
    });
  },
  inputAddItemName:function(e){
    this.setData({
      addItemName: e.detail.value
    });
  },
  inputAddItemPrice: function (e) {
    this.setData({
      addItemPrice: e.detail.value
    });
  },
  btnDelMenuItem:function(e){
    var that=this;
    var index=e.currentTarget.id;

    that.data.menu.splice(index,1);

    that.setData({
      menu: that.data.menu
    });
  },
  btnAddMenuItem:function(){
    var that=this;

    if (util.trimStr(that.data.addItemName)==""){
      return;
    }
    if (util.trimStr(that.data.addItemPrice) == "") {
      return;
    }
    
    that.data.menu.push({
      name: that.data.addItemName,
      price: that.data.addItemPrice
    });
    that.setData({
      addItemName:"",
      addItemPrice:"",
      menu: that.data.menu
    });
  },
  btnPost:function(){
    var that=this;
    if (util.trimStr(that.data.text)==''){
      wx.showModal({
        title: '',
        showCancel: false,
        content: '请添加接龙说明',
      });
      return;
    } else if (that.data.files.length<=0) {
      wx.showModal({
        title: '',
        showCancel: false,
        content: '请至少上传一张商品图片',
      });
      return;
    } else if(that.data.menu.length<=0){
      wx.showModal({
        title: '',
        showCancel: false,
        content: '请添加接龙商品',
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
              type: 103,
              gps: that.data.gps,
              gpsaddr: that.data.gpsaddr == '取货地点' ? "" : that.data.gpsaddr,
              gpscity: that.data.gpscity,
              title: that.data.text,
              text: JSON.stringify(that.data.menu),
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
  onShow: function () {
    app.authorizeCheck("scope.userInfo");
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