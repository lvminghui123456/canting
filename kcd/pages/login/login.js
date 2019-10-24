const app = getApp()
var WXBizDataCrypt = require('../../utils/cryptojs/RdWXBizDataCrypt.js');
var appId = "wxb5b5fac2ed9acbef";
var secret = '04e28014b4b9186a922925c4703e78da';
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //用户已经授权过
              // wx.switchTab({
              //   url: 'pages/home/home'
              // })
            }
          });
        }
      }
    }) 
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      var pc = new WXBizDataCrypt(appId, app.globalData.session_key)
      wx.getUserInfo({
        success: function (res) {
          console.log(res)
          //拿到getUserInfo（）取得的res.encryptedData, res.iv，调用decryptData（）解密
          var data = pc.decryptData(res.encryptedData, res.iv)
          // data.unionId就是咱们要的东西了
          app.globalData.unionid = data.unionId
          console.log('解密后 unionid: ', app.globalData.unionid)
        },
        fail: function (res) {
          console.log(res)
        }
      })
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '../home/home'
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  }

})
