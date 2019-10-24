// pages/orderdetail/orderdetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"青岛麦当劳金水路丽达餐厅",
    address:"山东省青岛市李沧区铜川路216号利达广场负一层",
    order:"",
    orderId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.orderid)
    if (options.orderid){
      this.setData({
        orderId: options.orderid
      })
      var that = this;
      var host = app.globalData.host;
      console.log(app.globalData.customerId)
      wx.request({
        url: host + '/catering/Routine/SelectTheOrderByGidDidOid',
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          customerId: "",
          orderId: options.orderid,
          restaurantId: ""
        },
        success: function (res) {
          if (res.data.status == "1") {
            that.setData({
              order: res.data.res.result[0]
            })
          }

          console.log(res)
        }
      })
    }
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