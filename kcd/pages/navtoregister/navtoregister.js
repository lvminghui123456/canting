// pages/register/register.js
const app = getApp()
var WXBizDataCrypt = require('../../utils/cryptojs/RdWXBizDataCrypt.js');
var appId = "wxb5b5fac2ed9acbef";
var secret = '04e28014b4b9186a922925c4703e78da';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow:function(){
    
    app.globalData.isNavtoRes = '1';
  },
  onUnload:function(){
    
  },
  navtoregister(){
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          var pc = new WXBizDataCrypt(appId, app.globalData.session_key)
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              wx.navigateTo({
                url: '/pages/barregister/barregister'
              })
              //拿到getUserInfo（）取得的res.encryptedData, res.iv，调用decryptData（）解密
              var data = pc.decryptData(res.encryptedData, res.iv)
              // data.unionId就是咱们要的东西了
              app.globalData.unionid = data.unionId
              console.log('解密后 unionid: ', app.globalData.unionid)
              
            },
            fail: function (res) {
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '您的手机无法注册会员请截图联系店员处理。' + res,
                showCancel: false,
                confirmText: '知道了',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
      }
    })
    
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'r麦肯姆',
      path: '/pages/home/home'
    }
  }
})