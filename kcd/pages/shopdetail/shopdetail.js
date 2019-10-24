const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      detallist:'',
      xq:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      console.log(options)
    this.setData({
        detallist:options,
      xq: options.speciallabellist
      })
    console.log(this.data.xq)
    var spice = this.data.xq;
     var ss = spice.split(",")
    console.log(ss)
    this.setData({
      xq: ss
    })
    console.log(typeof this.data.xq)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //导航
  adddh() {
    var that= this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则地图定位功能将无法使用',
            success: function (res) {
              if (res.cancel) {
                console.info("1授权失败返回数据");

              } else if (res.confirm) {
                //village_LBS(that);
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 5000
                      })
                      wx.getLocation({
                        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
                        success: function (res) {
                          var latitude = res.latitude
                          var longitude = res.longitude
                          var latitude1 = parseFloat(that.data.detallist.latitude)
                          var longitude1 = parseFloat(that.data.detallist.longitude)
                          wx.openLocation({
                            latitude: latitude1,
                            longitude: longitude1,
                            scale: 28,
                            name: that.data.detallist.restaruantname,
                            address: that.data.detallist.positiondetail,
                          })
                        }
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 5000
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
              var latitude = res.latitude
              var longitude = res.longitude
              var latitude1 = parseFloat(that.data.detallist.latitude)
              var longitude1 = parseFloat(that.data.detallist.longitude)
              wx.openLocation({
                latitude: latitude1 ,
                longitude: longitude1,
                scale: 28,
                name: that.data.detallist.restaruantname,
                address: that.data.detallist.positiondetail,
              })
            }
          })
        }
      }
    })

  },
  //电话
  phonecall(){
    var that= this
    wx.makePhoneCall({
      phoneNumber: that.data.detallist.phonenumber ,//仅为示例，并非真实的电话号码
      success:()=>{
            console.log("成功")
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