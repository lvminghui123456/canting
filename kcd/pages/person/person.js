// pages/person/person.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    gender: ["","男", "女"],
    constellation: ["","白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"],
    city: ["","其他","北京", "广东", "山东", "江苏", "河南", "上海", "河北", "浙江", "香港", "陕西", "湖南", "重庆", "福建", "天津", "云南", "四川", "广西", "安徽", "海南", "江西", "湖北", "山西", "辽宁", "台湾", "黑龙", "内蒙古", "澳门", "贵州", "甘肃", "青海", "新疆", "西藏", "吉林", "宁夏"],
    index: 0,
    index1: 0,
    index2: 0,
    gender1: "",
    constellation1: "",
    city1: "",
    name1: "",
    disabled:true
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
    wx.request({
      url: host + '/catering/login/getTheCustomerMes',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        unionid: app.globalData.unionid
      },
      success: function (res) {
        if (res.data.status == "1") {
          var result = res.data.res.result;
          that.setData({
            gender1: result.gender,
            constellation1: result.constellation,
            city1: result.province,
            name1: result.nickName
          })
          for (var i = 0; i < that.data.gender.length; i++){
            if (result.gender == that.data.gender[i]){
              that.setData({
                index:i
              })
              break;
            }
            
          }
          for (var i = 0; i < that.data.constellation.length; i++) {
            if (result.constellation == that.data.constellation[i]) {
              that.setData({
                index1: i
              })
              break;
            }
            
          }
          for (var i = 0; i < that.data.city.length; i++) {
            if (result.province == that.data.city[i]) {
              that.setData({
                index2: i
              })
              break;
            }
            
          }
        }

        console.log(res)
      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.checkChange();
  },
  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
    this.checkChange();
  },
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value
    })
    this.checkChange();
  },
  getName(e) {
    var val = e.detail.value;
    this.setData({
      name: val
    });
    this.checkChange();
  },
  submit(){
    var that = this;
    wx.showLoading({
      title: '保存信息',
    })
    var that = this;
    var host = app.globalData.host;
    wx.request({
      url: host + '/catering/login/updateTheCustomerMes',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        unionid: app.globalData.unionid,
        nickName: that.data.name,
        gender: that.data.index,
        province: that.data.city[that.data.index2],
        constellation: that.data.constellation[that.data.index1],
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.status == "1") {
          var result = res.data.res.result;
          that.setData({
            disabled: true
          })
          
         
          
        }

        console.log(res)
      },complete:function(res){
        wx.hideLoading();
      }
    })
  },
  checkChange(){
    if (this.data.name == this.data.name1 && this.data.city1 == this.data.city[this.data.index2] && this.data.constellation1 == this.data.constellation[this.data.index1] && this.data.gender1 == this.data.gender[this.data.index]){

    }else{
      this.setData({
        disabled:false
      })
    }
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