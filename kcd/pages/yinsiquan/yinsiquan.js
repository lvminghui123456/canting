// pages/jifenshiyong/jifenshiyong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var info = prevPage.data.ysqsm; //取上页data里的数据也可以修改
    console.log(info)
    this.setData({
      image: info,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})