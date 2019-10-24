//app.js
// var QQMapWX = require('/pages/index/qqmap-wx-jssdk.js');
// var qqmapsdk;

var WXBizDataCrypt = require('utils/cryptojs/RdWXBizDataCrypt.js');
var appId = "wxb5b5fac2ed9acbef";
var secret = '04e28014b4b9186a922925c4703e78da';
var template = require('template/template.js');  
App({
  onLaunch: function() {
    var that = this;
    this.swiper();
    try {
      var res = wx.getSystemInfoSync()
      this.globalData.windowHeight = res.windowHeight;
      this.globalData.windowWidth = res.windowWidth;
    } catch (e) {
    }
    var host = this.globalData.host;
    // var host = "http://192.168.48.108:8050";
    wx.login({
      success: function(res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          // 登录获取openid
          wx.request({
            url: host + '/catering/applet/getOpenId',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: res.code
            },
            success: function(res) {
              console.log(res)
              if (res.data.status == "1"){
                that.globalData.openid = res.data.res.openid;
                that.globalData.customerId = res.data.res.customerId;
                that.globalData.isMember = res.data.res.isMember + "";
                that.globalData.session_key = res.data.res.session_key;
                wx.getSetting({
                  success: function (res) {
                    if (res.authSetting['scope.userInfo']) {
                      var pc = new WXBizDataCrypt(appId, that.globalData.session_key)
                      wx.getUserInfo({
                        success: function (res) {
                          console.log(res)
                          //拿到getUserInfo（）取得的res.encryptedData, res.iv，调用decryptData（）解密
                          var data = pc.decryptData(res.encryptedData, res.iv)
                          // data.unionId就是咱们要的东西了
                          that.globalData.unionid = data.unionId
                          console.log('解密后 unionid: ', that.globalData.unionid)
                        },
                        fail: function (res) {
                          console.log(res)
                        }
                      })
                    }else{
                      if (that.globalData.isMember == '1') {
                        wx.redirectTo({
                          url: '../../pages/login/login'
                        })
                      }
                    }
                  }
                })
                
                
              }else{
                wx.showModal({
                  title: '提示',
                  content: res.data.msg+'',
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
              
              console.log(res)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
   
  },
  globalData: {
    userInfo: null,
    trainBeginCity: '杭州',
    trainEndCity: '北京',
    cardList: [],
    // host: "https://www.bciuo.cn", 
    host: "https://www.niumaike.com",
    // host: "http://192.168.48.118:8050", 
    longitude: '',//经纬度
    latitude: '',//经纬度
    restaurantMenuId: '',//门店id
    title: '',//餐厅名称
    address: '',//餐厅具体地址
    imagesurl:"",
    resid:"",
    openid:"",
    isMember:"",//是否是会员
    session_key:"",
    restaruantName:"",//餐厅列表页面跳转过来的店名
    positiondetail: "",//餐厅列表页面跳转过来的地址
    restaurantid: "",//餐厅列表页面跳转过来的id
    listHeight:0,// 点餐列表高度
    containerTop:"",
    goodHeight:"", //商品高度
    template: template,
    customerId:"", //顾客id
    isNavtoRes: "0", //是否是注册也跳转过来的
    appName:"r麦肯姆", 
    unionid:"",
    isserch:"0"//是否是搜索跳转过来的
  },
  onShow() {
    //1、获取当前位置坐标
    wx.showTabBar({
      //animation: true //是否需要过渡动画
    })
    
  },
  onLoad(){
    wx.showTabBar({
      //animation: true //是否需要过渡动画
    })
  },
  //请求地址
  swiper() {
    var that = this;
    var host = this.globalData.host;
    var url = "/catering/Routine/SelectTheCyclePictureNowAll"
    // console.log(host + url)
    wx.request({
      url: host + url,

      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleswipwer.bind(this)
    })
  },
  handleswipwer(res) {
    // console.log(res)
    var imgurl = res.data.res.result[0].imageName;
    // this.setData({
    //   imagesurl: imgurl
    // })
    this.globalData.imagesurl = imgurl;
    // console.log(this.globalData.imagesurl)
  },
  
 

})