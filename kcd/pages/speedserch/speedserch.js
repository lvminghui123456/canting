// pages/speedserch/speedserch.js
const app = getApp()
var QQMapWX = require('../index/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:"",
    lable:"",
    inputValue:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.shoplist()
    var that = this
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'OUBBZ-GF23W-VYMRW-RIOM7-4Y5JH-TZFQY' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            console.log(addressRes)
            var address = addressRes.result.address;
            that.setData({
              //city: address,
              city: addressRes.result.address_component.city,
              // lat: addressRes.result.location.lat,
              // lng: addressRes.result.location.lng
              // longitude: addressRes.result.location.lng,
              // latitude: addressRes.result.location.lat
            })
            console.log(address)
          }
        })
      }
    })
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

  shoplist() {
    //商品详细信息
   
    var that = this;
    var host = app.globalData.host;
    var url = "/catering/Routine/SelectTheSpecialLabel"
    console.log(that.data.restaurantMenuId)
    wx.request({
      url: host + url,
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.handleshoplist.bind(this)
    })
  },
  handleshoplist(res) {
    console.log(res)
   this.setData({
     lable:res.data.res.result
   })

  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    console.log(e.detail.value)
   
  },
  searchSubmit(e){
    var inputValue = e.detail.value
    console.log(inputValue)
    wx.redirectTo({
      url: '../chooseaddress/chooseaddress?inputValue=' + inputValue + ''
    })
  },
  handledis(e){
    console.log(e)
    var dicCode = e.currentTarget.dataset.diccode
    console.log(dicCode)
    wx.redirectTo({
      url: '../chooseaddress/chooseaddress?dicCode=' + dicCode + ''
    })
  },
  // 点击选择城市
  choosecity() {
    wx.redirectTo({
      url: '../choosecity/choosecity?id=1'
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