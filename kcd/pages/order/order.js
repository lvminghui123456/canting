// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    orderList:[],
    show:["flase","flase"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
        customerId: app.globalData.customerId,
        orderId: "",
        restaurantId: ""
      },
      success: function (res) {
        if (res.data.status == "1") {
          that.setData({
            orderList: res.data.res.result
          })
        }

        console.log(res)
      }
    })
  },
  allShow(e){
    // var _index = e.currentTarget.dataset.index;
    // if(this.data.show[_index] == false){
    //   this.data.show[_index]
    // }
  },
  navtoDetail(e){
    var orderid = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?orderid=' + orderid
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