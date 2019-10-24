// pages/orderdetail/orderdetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     title:"", 
    address:"",
    order:"",
    orderId:''
  },
  onLoad: function (options) {
    
    
    if (options.orderData){
      var orderData = JSON.parse(options.orderData)
      console.log(orderData)
      this.setData({
        order: orderData
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周 期函数--监听页面显示
   */
  onShow: function () {
 
  },
  updateTheOrderStatus(){
    var that = this;
    var host = app.globalData.host;
    console.log(app.globalData.customerId)
    wx.request({
      url: host + '/catering/Routine/updateTheOrderStatus',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderId: that.data.orderId
      },
      success: function (res) {
        if (res.data.status == "1") {
          wx.navigateBack({
            delta: 1
          })
        }
        console.log(res)
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