var util = require('../../utils/util.js');
const app = getApp()
var QQMapWX = require('../index/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    longitude: "",
    latitude: "",
    longitude1: "",//中心点的位置
    latitude1: "",
    markers:[],
    controls:[],
    mendian: "查看所有门店",
    imgurl: "/resourse/image/double-arrow-top.png",
    isFold: true,
    city: "",
    cityId:"",
    dicCode:'',
    shoplist1: "",
    specialLabelList: '',
    invue:'',
    cid:'',
    title:'',
    address:''

  },
  
  onShow() {
    // console.log(option)
     
    // this.address()
    console.log("show")
  },
  onLoad: function(option) {
    console.log('load')
    console.log(option)
    // if (option.longitude == undefined) {
    //   //this.getLocation();
    //   this.setData({
    //     longitude: longitude1,
    //     latitude: latitude1
    //   })
    // } else {
    //   this.setData({
    //     longitude: option.longitude,
    //     latitude: option.latitude,
    //     city: option.city
    //   })
    // }
    this.setData({
      longitude: option.longitude,
      latitude: option.latitude,
      dicCode: option.dicCode,
      invue: option.inputValue,
      cityId: option.cityid,
      cid: option.cid,
      title: option.title,
      address: option.address,
    })
    
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
            console.log(addressRes.result.address_component.city)
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
   this.getLocation();
  },
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: this.bb.bind(this)

    })
  },
  bb(res) {
    this.setData({
      longitude: res.longitude,
      latitude: res.latitude
    })
    this.address()

  },
  //详细信息
  address() {
    var that = this;
    var host = app.globalData.host;
    var url = "/catering/Routine/SelectTheBaseRestaurantForlo"
    console.log(host + url)
    console.log(this.data.longitude)
    console.log(this.data.latitude)
    console.log(this.data.cityId)
    console.log(this.data.dicCode)
    console.log(this.data.invue)
    if (this.data.invue==undefined){
      this.setData({
        invue:''
      })
    }
    if (this.data.cityId == undefined) {
      this.setData({
        cityId: ''
      })
    }
    if (this.data.dicCode == undefined) {
      this.setData({
        dicCode: ''
      })
    }
    wx.request({
      url: host + url,
      data: {
        longitude: this.data.longitude,
        latitude: this.data.latitude,
        cityId: this.data.cityId,
        dicCode: this.data.dicCode,
        restaurantName: this.data.invue,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.aa.bind(this)
    })
  },
  aa(res) {
    //console.log(res)
   
    console.log(this.data.shoplist1)
    var title = res.data.res.result[0].restaruantName
    var address = res.data.res.result[0].positionDetail;
    var longitude1 = res.data.res.result[0].longitude;
    var latitude1 = res.data.res.result[0].latitude;
    app.globalData.restaruantName = res.data.res.result[0].restaruantName
    app.globalData.positiondetail = res.data.res.result[0].positionDetail
    app.globalData.restaurantid = res.data.res.result[0].restaurantId
    if(this.data.cid==1){
      this.setData({
        longitude: this.data.longitude,
        latitude: this.data.latitude,
      })
    }else{
      this.setData({
        longitude: longitude1,
        latitude: latitude1
      })
     
    }
   
    const mark = res.data.res.result.map((value, index) => {
      return {
        iconPath: "/resourse/image/markan.png",
        id: value.restaurantId,
        latitude: value.latitude,
        longitude: value.longitude,
        width: 40,
        height:40
      }
    })
    for (var i = 0; i < mark.length; i++) {
      mark[0].iconPath = "/resourse/image/markline.png"
    }
    console.log(mark)
    this.setData({
      shoplist1: res.data.res.result,
      markers: mark
    })
    console.log(this.data.shoplist1)

  },
  
  //跳转餐厅
  tzct(e){
    console.log("我点击了跳转")
    console.log(e)
    var restaruantName = e.currentTarget.dataset.restaruantname
    var positiondetail = e.currentTarget.dataset.positiondetail
    var restaurantid = e.currentTarget.dataset.restaurantid
    app.globalData.restaruantName = e.currentTarget.dataset.restaruantname;
    app.globalData.positiondetail = e.currentTarget.dataset.positiondetail;
    app.globalData.restaurantid = e.currentTarget.dataset.restaurantid;
    app.globalData.restaurantMenuId = e.currentTarget.dataset.restaurantid;
    console.log(app.globalData.restaruantName)
   console.log(this.data.title)
    console.log(this.data.address)
    if(this.data.title==undefined){
     
      // wx.switchTab({
      //   url: '../index/index?restaruantName=' + restaruantName + '&positiondetail=' + positiondetail + '&restaurantid=' + restaurantid + ''
      // })
      wx.navigateBack({
        url: '../index/index'
      })
    }else{
      wx.redirectTo({
        url: '../shopcarpay/shopcarpay?title=' + app.globalData.restaruantName + '&address=' + app.globalData.positiondetail + ''
      })
    }
  },
  //点击图标
  markertap(e){
    console.log(e)
    console.log(e.markerId)
    console.log(this.data.shoplist1)
    var shopli = this.data.shoplist1;
    var shoparr=[];
    for(var i=0;i<shopli.length;i++){
      if (shopli[i].restaurantId == e.markerId){
        shoparr.push(shopli[i]);
      }
    }
    shopli.forEach(item => {
      if (item.restaurantId !== e.markerId) {
        shoparr.push(item);
      }
    });
    console.log(shoparr);
    
    this.setData({
      shoplist1:shoparr
    })
    console.log(this.data.markers)
    app.globalData.restaruantName = this.data.shoplist1[0].restaruantName
    app.globalData.positiondetail = this.data.shoplist1[0].positionDetail
    app.globalData.restaurantid = this.data.shoplist1[0].restaurantId
    const marker1 = this.data.markers
    for (var i = 0; i < marker1.length;i++){
      if (e.markerId == marker1[i].id){
        marker1[i].iconPath = "/resourse/image/markline.png"
      }
      else{
        marker1[i].iconPath = "/resourse/image/markan.png"
      }
    }
    console.log
    this.setData({
      markers: marker1
    })
   
  },
  
  // 切换
  switch () {
    console.log(111)
    var that = this;
    var type = that.data.mendian === '查看所有门店' ? '返回查看地图' : '查看所有门店';
    var imgurl = that.data.imgurl === '/resourse/image/double-arrow-top.png' ? '/resourse/image/double-arrow-bottom.png' : '/resourse/image/double-arrow-top.png';
    this.setData({
      isFold: !this.data.isFold,
      mendian: type,
      imgurl: imgurl

    })

  },
  // 点击选择城市
  choosecity() {
    getCurrentPages().pop();
    wx.redirectTo({
      url: '../choosecity/choosecity?id=1'
    })
  },
  //点击进入详情页
  addshop(e) {
    console.log(e)
    console.log(app.globalData.imagesurl)
    var img = app.globalData.imagesurl;
    console.log(this.data.shoplist1)
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    var distance = e.currentTarget.dataset.distance;
    var positiondetail = e.currentTarget.dataset.positiondetail;
    var restaruantname = e.currentTarget.dataset.restaruantname;
    var phonenumber = e.currentTarget.dataset.phonenumber;
    var speciallabellist = e.currentTarget.dataset.speciallabellist;
    getCurrentPages().pop();
    wx.navigateTo({
      url: '../shopdetail/shopdetail?img=' + img + '&latitude=' + latitude + '&longitude=' + longitude + '&distance=' + distance + '&positiondetail=' + positiondetail + '&phonenumber=' + phonenumber + '&speciallabellist=' + speciallabellist + '&restaruantname=' + restaruantname + ''
    })
  },
  addmain() {

    getCurrentPages().pop();
    wx.redirectTo({
      url: '../index/index'
    })
  },
  speedserch(){
    getCurrentPages().pop();
    wx.redirectTo({
      url: '../speedserch/speedserch'
    })
  }
  ,
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