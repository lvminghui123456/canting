//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('/qqmap-wx-jssdk.js');
var qqmapsdk;
var num111 = 0;
var fixed11 = false;
Page({
  data: {
    showPopover: false, //页面穿透
    imgUrls: "",
    indicatorDots: true,
    autoplay: true,
    isclsss: true,
    interval: 5000,
    duration: 1000,
    scrollHeight: app.globalData.windowHeight,
    //toView: "",
    display: "none",
    sqdw:"none",
    cartShow: "none",
    title: '', //餐厅名称
    address: '', //餐厅具体地址
    cutnum: 0,
    shopnumber: 0,
    totalPrice: 0, // 总价格
    totalCount: 0, // 总商品数
    carArray: [],
    listHeight: app.globalData.listHeight,
    containerTop: app.globalData.containerTop,
    heightList: [],
    menuview: '',
    fixed: false,
    scrollY: false,
    menu: "",
    menuType: [],
    menuLogo: [],
    toView: '',
    allGoods: [],
    scrollNum: 0,
    scrollTop: 0,
    scrollHeight: 0,
    // typeHeight: 43,
    goodHeight: '',
    detailFlag: true,
    longitude: '', //经纬度
    latitude: '', //经纬度
    restaurantMenuId: '', //门店id
    cardordercode: '', //calss,
    pageBackgroundColor: "#FCC516",
    color: "#000",
    a: 0,
    disabled:true,
    isname: '',
    
  },
  onLoad(options) {
    // wx.removeStorageSync('allGoods')
    try {
      var res = wx.getSystemInfoSync()
      this.setData({ 
        listHeight: res.windowHeight
      })
      app.globalData.listHeight = res.windowHeight
    } catch (e) {
      // Do something when catch error
    }
    var query = wx.createSelectorQuery();
    query.select('#container-top').boundingClientRect()
    query.exec((res) => {
      // console.log(res)
      this.setData({
        containerTop: res[0].height
      })
      app.globalData.containerTop = res[0].height;
      // console.log(app.globalData.containerTop)
    })

    //轮播
    this.swiper()
    //授权拒绝后再次发起授权
    // wx.getSetting({
    //   success: (res) => {
    //     console.log(res);
    //     console.log(res.authSetting['scope.userLocation']);
    //     if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
    //       wx.showModal({
    //         title: '是否授权当前位置',
    //         content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
    //         success: function(res) {
    //           if (res.cancel) {
    //             console.info("1授权失败返回数据");
                

    //           } else if (res.confirm) {
    //             //village_LBS(that);
    //             console.log("我是授权成功的")
    //             wx.openSetting({
    //               success: function(data) {
    //                 console.log(data);
    //                 if (data.authSetting["scope.userLocation"] == true) {
    //                   wx.showToast({
    //                     title: '授权成功',
    //                     icon: 'success',
    //                     duration: 5000
    //                   })
    //                   //再次授权，调用getLocationt的API
    //                   if (app.globalData.restaruantName == '') {
    //                     var that = this
    //                     wx.getLocation({
    //                       type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //                       success: function(res) {
    //                         // var latitude = res.latitude
    //                         // var longitude = res.longitude            
    //                         that.setData({
    //                           latitude: res.latitude,
    //                           longitude: res.longitude
    //                         })
    //                         // console.log(that.data.latitude)
    //                         that.address();
    //                         // console.log(that.data.restaurantId)

    //                       }
    //                     })
    //                     // console.log("我是点击了定制以后没有跳转")

    //                   } else {
    //                     console.log("我是跳转过来的")
    //                     if (app.globalData.restaurantid == app.globalData.resid) {
    //                       this.setData({
    //                         title: app.globalData.restaruantName,
    //                         address: app.globalData.positiondetail,
    //                         restaurantMenuId: app.globalData.restaurantid
    //                       })
    //                       this.shoplist();
    //                       console.log("我是点击同一个的")
    //                     } else {
    //                       try {
    //                         wx.removeStorageSync('cart')
    //                         wx.removeStorageSync('allGoods')
    //                       } catch (e) {
    //                         // Do something when catch error
    //                       }
    //                       // console.log(app.globalData.restaruantName)
    //                       this.setData({
    //                         title: app.globalData.restaruantName,
    //                         address: app.globalData.positiondetail,
    //                         restaurantMenuId: app.globalData.restaurantid
    //                       })
    //                       app.globalData.resid = app.globalData.restaurantid;
    //                       this.shoplist();
    //                       console.log("我是点击不同清除缓存的")

    //                     }

    //                   }
    //                 } else {
    //                   wx.showToast({
    //                     title: '授权失败',
    //                     icon: 'success',
    //                     duration: 5000
    //                   })
    //                 }
    //               }
    //             })
    //           }
    //         }
    //       })
    //     } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
    //     console.log("我是出事话授权")
    //       if (app.globalData.restaruantName == '') {
    //         var that = this
    //         wx.getLocation({
    //           type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //           success: function(res) {
    //             // var latitude = res.latitude
    //             // var longitude = res.longitude            
    //             that.setData({
    //               latitude: res.latitude,
    //               longitude: res.longitude
    //             })
    //             // console.log(that.data.latitude)
    //             that.address();
    //             // console.log(that.data.restaurantId)

    //           }
    //         })
    //         // console.log("我是点击了定制以后没有跳转")

    //       } else {
    //         console.log("我是跳转过来的")
    //         if (app.globalData.restaurantid == app.globalData.resid) {
    //           this.setData({
    //             title: app.globalData.restaruantName,
    //             address: app.globalData.positiondetail,
    //             restaurantMenuId: app.globalData.restaurantid
    //           })
    //           this.shoplist();
    //           console.log("我是点击同一个的")
    //         } else {
    //           try {
    //             wx.removeStorageSync('cart')
    //             wx.removeStorageSync('allGoods')
    //           } catch (e) {
    //             // Do something when catch error
    //           }
    //           // console.log(app.globalData.restaruantName)
    //           this.setData({
    //             title: app.globalData.restaruantName,
    //             address: app.globalData.positiondetail,
    //             restaurantMenuId: app.globalData.restaurantid
    //           })
    //           app.globalData.resid = app.globalData.restaurantid;
    //           this.shoplist();
    //           console.log("我是点击不同清除缓存的")

    //         }

    //       }
    //     }
    //   },//success结束
    //   // fail(res) =>{

    //   // }
    // })
    //this.gotoHomePage()//监听返回
    // if (app.globalData.restaruantName == '') {
      
    //   var that = this
    //   wx.getLocation({
    //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //     success: function (res) {
    //       // var latitude = res.latitude
    //       // var longitude = res.longitude            
    //       that.setData({
    //         latitude: res.latitude,
    //         longitude: res.longitude
    //       })
    //       // console.log(that.data.latitude)
    //       that.address();
    //       // console.log(that.data.restaurantId)
    //       console.log("我是允许的的的的")
    //       that.setData({
    //         sqdw: "none"
    //       })
    //     },
    //     fail:function(res){
          
    //       that.setData({
    //         sqdw:"block"
    //       })
    //     }
    //   })
    //   // console.log("我是点击了定制以后没有跳转")

    // } else {
    //   console.log("我是跳转过来的")
    //   if (app.globalData.restaurantid == app.globalData.resid) {
    //     this.setData({
    //       title: app.globalData.restaruantName,
    //       address: app.globalData.positiondetail,
    //       restaurantMenuId: app.globalData.restaurantid
    //     })
    //     this.shoplist();
    //     console.log("我是点击同一个的")
    //   } else {
    //     try {
    //       wx.removeStorageSync('cart')
    //       wx.removeStorageSync('allGoods')
    //     } catch (e) {
    //       // Do something when catch error
    //     }
    //     // console.log(app.globalData.restaruantName)
    //     this.setData({
    //       title: app.globalData.restaruantName,
    //       address: app.globalData.positiondetail,
    //       restaurantMenuId: app.globalData.restaurantid
    //     })
    //     app.globalData.resid = app.globalData.restaurantid;
    //     this.shoplist();
    //     console.log("我是点击不同清除缓存的")

    //   }

    // }

  },
  // 授权失败以后操作
  sqsb:function(){
    var _this = this; 
    wx.openSetting({
      success: function (data) {
        console.log(data);
       
        if (data.authSetting["scope.userLocation"] == true) {  
          _this.pandun()
         
          // _this.pandun()
          // wx.showToast({
          //   title: '授权成功',
          //   icon: 'success',
          //   duration: 5000
          // })
          
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'success',
            duration: 5000
          })
        }
      }
    })
  },
  pandun:function(){
    // var _that=this;
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success: function (res) {
    //     // var latitude = res.latitude
    //     // var longitude = res.longitude            
    //     _that.setData({
    //       latitude: res.latitude,
    //       longitude: res.longitude
    //     })
    //     // console.log(that.data.latitude)
    //     // _that.address();
    //     _that.setData({
    //       sqdw: "none"
    //     })
    //     // console.log(that.data.restaurantId)
    //     console.log("我是允许的的的的")
    //   },
    //   fail: function (res) {

    //     _that.setData({
    //       sqdw: "block"
    //     })
    //   }
    // }) 
    //可以的
    // if (app.globalData.restaruantName == '') {
    //   var that = this
    //   wx.getLocation({
    //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //     success: function (res) {
    //       // var latitude = res.latitude
    //       // var longitude = res.longitude            
    //       that.setData({
    //         latitude: res.latitude,
    //         longitude: res.longitude
    //       })
    //       // console.log(that.data.latitude)
    //       that.address();
    //       // console.log(that.data.restaurantId)
    //       that.setData({
    //       sqdw: "none"
    //     })
    //     },
    //     fail: function (res) {

    //       that.setData({
    //         sqdw: "block"
    //       })
    //     }
    //   })
    //   // console.log("我是点击了定制以后没有跳转")

    // } else {
    //   console.log("我是跳转过来的")
    //   if (app.globalData.restaurantid == app.globalData.resid) {
    //     this.setData({
    //       title: app.globalData.restaruantName,
    //       address: app.globalData.positiondetail,
    //       restaurantMenuId: app.globalData.restaurantid
    //     })
    //     this.shoplist();
    //     console.log("我是点击同一个的")
    //   } else {
    //     try {
    //       wx.removeStorageSync('cart')
    //       wx.removeStorageSync('allGoods')
    //     } catch (e) {
    //       // Do something when catch error
    //     }
    //     // console.log(app.globalData.restaruantName)
    //     this.setData({
    //       title: app.globalData.restaruantName,
    //       address: app.globalData.positiondetail,
    //       restaurantMenuId: app.globalData.restaurantid
    //     })
    //     app.globalData.resid = app.globalData.restaurantid;
    //     this.shoplist();
    //     console.log("我是点击不同清除缓存的")

    //   }

    // }
  },
  gotoHomePage: function() { //监听返回键跳转到home页面
    wx.switchTab({
      url: '../home/home',
    })
  },
  onShow() {
    // wx.removeStorageSync('allGoods')
    wx.hideTabBar({
      //animation: true //是否需要过渡动画
    })

    // console.log(app.globalData.restaruantName)
    // console.log(app.globalData.positiondetail)
    // console.log(app.globalData.restaurantid)
    if (app.globalData.restaruantName == '') {
      var that = this
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function(res) {
          // var latitude = res.latitude
          // var longitude = res.longitude            
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          // console.log(that.data.latitude)
          that.address();
          that.setData({
            sqdw: "none"
          })
          // console.log(that.data.restaurantId)

        },
        fail: function (res) {

          that.setData({
            sqdw: "block"
          })
        }
      })
      // console.log("我是点击了定制以后没有跳转")

    } else {
      console.log("我是跳转过来的")
      if (app.globalData.restaurantid == app.globalData.resid) {
        this.setData({
          title: app.globalData.restaruantName,
          address: app.globalData.positiondetail,
          restaurantMenuId: app.globalData.restaurantid
        })
        this.shoplist();
        console.log("我是点击同一个的")
      } else {
        try {
          wx.removeStorageSync('cart')
          wx.removeStorageSync('allGoods')
        } catch (e) {
          // Do something when catch error
        }
        // console.log(app.globalData.restaruantName)
        this.setData({
          title: app.globalData.restaruantName,
          address: app.globalData.positiondetail,
          restaurantMenuId: app.globalData.restaurantid
        })
        app.globalData.resid = app.globalData.restaurantid;
        this.shoplist();
        console.log("我是点击不同清除缓存的")

      }

    }
  },
  //获取当前的门店地址和id
  address() {
    // console.log(app.globalData.host)
    var that = this;
    var host = app.globalData.host;
    var url = "/catering/Routine/SelectTheBaseRestaurantForlo"
    // console.log(host + url)
    // console.log(this.data.latitude)
    wx.request({
      url: host + url,
      data: {
        longitude: this.data.longitude,
        latitude: this.data.latitude
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.aa.bind(this)

    })
  },
  onReady() {
    // console.log(this.data.totalPrice)
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.good-box').boundingClientRect()
    query.exec((res) => {
      // console.log(res)
      var listHeight = res[0].height; // 获取list高度
      that.setData({
        goodHeight: listHeight
      })
    })
  },
  aa(res) {
    console.log(res)
    var title = res.data.res.result[0].restaruantName
    var address = res.data.res.result[0].positionDetail
    var restaurantId = res.data.res.result[0].restaurantId
    // console.log(this.data.title)
    this.setData({
      title: title,
      address: address,
      restaurantMenuId: restaurantId
    })
    app.globalData.resid = restaurantId;
    app.globalData.restaurantMenuId = restaurantId;
    console.log(app.globalData.restaurantMenuId )
    this.shoplist();
  },
  //商品列表的详细信息
  shoplist() {
    //商品详细信息
    wx.showLoading({
      title: '商品列表加载中',
    })
    var that = this;
    var host = app.globalData.host;
    // var host = "http://192.168.48.108:8050"; 
    var url = "/catering/Routine/SelectTheMenuForMSI"
    // console.log(that.data.restaurantMenuId)
    wx.request({
      url: host + url,
      method: "POST",
      data: {
        restaurantMenuId: that.data.restaurantMenuId,
        unionid: app.globalData.unionid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: this.handleshoplist.bind(this)
    })
  },
  handleshoplist(res) {
    console.log(res)
    wx.hideLoading()
    var allGoods = res.data.res.result.allGoods
    var menu = res.data.res.result.menu
    var menuType = res.data.res.result.menuType
    var menuLogo = res.data.res.result.menuLogo
    var menuLogo = res.data.res.result.menuLogo
    var menuVersion = res.data.res.menuVersion
    console.log(menuVersion)
    this.setData({
      allGoods: allGoods,
      menu: menu,
      menuType: menuType,
      // toView: "M1001",
      menuLogo: menuLogo
    })


    // console.log(this.data.allGoods)
    //先获取缓存里面的版本号，如果版本号相同
    var nweb = wx.getStorageSync("menuVersion");
    if (!nweb){
      console.log("我是没有缓存的")
      try {
        wx.setStorageSync('menuVersion', menuVersion)
        //wx.setStorageSync('allGoods', this.data.allGoods)
      } catch (e) {
        // console.log(e)
      }
      this.syccart();
    }else{
      if (menuVersion == nweb) {
        console.log("我是版本相同的")
        this.syccart();
      } else {
        wx.clearStorage()
        console.log("我修改了版本")
      }
    }
    // console.log(nweb)
   
    
    
    
    this.countHeight(); //计算高度
    this.showModal1(res.data.res.open);


  },
  showModal1(open) {
    if (open) {

    } else {
      wx.showModal({
        title: '提示',
        content: '该餐厅已停止营业',
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

  },
  //获取轮播图片的信息
  swiper() {
    var that = this;
    var host = app.globalData.host;
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
    var imgurl = res.data.res.result;
    this.setData({
      imgUrls: imgurl
    })
  },
  //点击跳转到门店详情
  addadress() {
    console.log(111)
    // wx.navigateTo({
    //   url: '../chooseaddress/chooseaddress?longitude=' + this.data.longitude + '&latitude=' + this.data.latitude + ''
    // })
    wx.navigateTo({
      url: '../chooseaddress/chooseaddress'
    })
  },
  jumpTo: function(e) {

    // 获取标签元素上自定义的 data-opt 属性的值
    let target = e.target.id;

    this.setData({
      toView: target
    })
    console.log(target)
  },
  onReachBottom() {
    this.setData({
      scrollY: true
    })
  },
  onPageScroll(e) {
    // console.log(e)
    // console.log(e.scrollTop)
    var that = this;
    if (e.scrollTop >= this.data.containerTop) {
      if (this.data.fixed == true) {

      } else {
        fixed11 = true;
        var fixed = true;
        setTimeout(function () {
          if (fixed11 == fixed) {
            that.setData({
              fixed: fixed11
            });
          }
        }, 100, fixed);
        // this.setData({
        //   fixed: true
        // })
      }

      var heightList = this.data.heightList;
      for (var i = 0; i < heightList.length; i++) {
        if (e.scrollTop >= heightList[i] && e.scrollTop < heightList[i + 1]) {
          if (this.data.scrollNum == i) {

          } else {
            num111 = i;
            var num = i;
            setTimeout(function () {
              if (num111 == num){
                that.setData({
                  scrollNum: num111
                });
              }
            }, 80, num);
            // this.setData({
            //   scrollNum: i
            // });
          }

        }
      }
    } else {
      this.setData({
        menuview: 'menuTop',
        fixed: false
      })
    }
  },
  goodsToupper(e) {

  },
  countHeight() {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.good-box').boundingClientRect()
    query.exec((res) => {
      // console.log(res)
      var listHeight = res[0].height; // 获取list高度
      that.setData({
        goodHeight: listHeight
      })
    })
    var heightList = [that.data.containerTop];
    var curHeight = that.data.containerTop;
    this.data.allGoods.forEach((item) => {
      curHeight += item.goods.length * this.data.goodHeight;
      heightList.push(curHeight);
    });
    this.setData({
      heightList: heightList
    })
    console.log(heightList)
  },
  goodsScrollAct: function(e) {
    console.log(e.detail.scrollTop)
    var that = this;
    if (e.detail.scrollTop >= this.data.containerTop) {
      if (this.data.fixed == true) {

      } else {
        this.setData({
          fixed: true
        })
      }

      var heightList = this.data.heightList;
      for (var i = 0; i < heightList.length; i++) {
        if (e.detail.scrollTop >= heightList[i] && e.detail.scrollTop < heightList[i + 1]) {
          if (this.data.scrollNum == i) {

          } else {
            this.setData({
              scrollNum: i
            });
          }

        }
      }
    } else {
      this.setData({
        menuview: 'menuTop',
        fixed: false
      })
    }

  },
  selectMenuAct: function(e) {
    var that = this;
    var id = e.target.dataset.id;
    var tType = this.data.menuType[id];
    this.setData({
      scrollNum: id,
      toView: tType
    });
    var height = this.data.heightList[id]
    wx.pageScrollTo({
      scrollTop: height,
      duration: 0
    })
  },
  //获取商品缓存信息
  syccart() {
    //缓存
    var cart = wx.getStorageSync("cart");
    var allGoods1 = wx.getStorageSync("allGoods");
    // console.log(cart)
    // var allGoods = this.data.allGoods
    if (allGoods1){
      if (app.globalData.isserch==1 && cart){
        for (var i = 0; i < allGoods1.length;i++){
          for (var j = 0; j <allGoods1[i].goods.length;j++){
            for (var x = 0; x < allGoods1[i].goods[j].operation.length;x++){
                for(var h=0;h<cart.length;h++){
                  if (cart[h].dishesItemId == allGoods1[i].goods[j].operation[x].dishesItemId && cart[h].operationid == allGoods1[i].goods[j].operation[x].dishesButtonId && cart[h].goodid == allGoods1[i].goods[j].operation[x].dishesMenuId){
                    allGoods1[i].goods[j].operation[x].goodNum = cart[h].goodNum
                  }
                }
            }
          }
        }
        app.globalData.isserch =0
        this.setData({
          
          allGoods: allGoods1
        })
      }
    }
    else{
      console.log("我是一开始没有缓存要往里面加缓存的")
      try {
        // wx.setStorageSync('cart', h)
        wx.setStorageSync('allGoods', this.data.allGoods)
      } catch (e) {
        console.log(e)
      }
    }
    if (cart) {
      console.log("存在缓存并且不为空")
      this.setData({
        carArray: cart,
        // allGoods: allGoods1
      })
      console.log(this.data.carArray)
      console.log(this.data.allGoods)
      var h = this.data.carArray
      console.log(h)
      if (this.data.allGoods[0].viewId == "M0000" && allGoods1[0].viewId != "M0000"){//新数据里面有卡券，缓存里面没有
        // allGoods1.unshift(this.data.allGoods[0])//新数据的卡券赋值到缓存里面
        allGoods1 = this.data.allGoods
        console.log("新数据里面有卡券，缓存里面没有")
        // for (var i = 0; i < h.length; i++) {
        //   if (h[i].cardOrderCode){
            
        //     for(var j=0;j<allGoods1[0].goods.length;j++){
        //       for (var n = 0; n < allGoods1[0].goods[j].operation.length;n++){
        //         if (h[i].cardOrderCode == allGoods1[0].goods[j].operation[n].cardOrderCode){
        //           allGoods1[0].goods[j].operation[n].goodNum=1
        //         }
        //       }
        //     }
        //   }
        // }
        wx.removeStorageSync('cart')
        wx.removeStorageSync('allGoods')
        try {
          wx.setStorageSync('allGoods', this.data.allGoods)
          // wx.setStorageSync('allGoods', allGoods1)
        } catch (e) {
          console.log(e)
        }
        this.setData({
          display: 'none',
          cartShow: 'none'
        })
        // this.calTotalPrice()
        // this.setData({        
        //   allGoods: this.data.allGoods
        // })
       
      }
      else if (this.data.allGoods[0].viewId == "M0000" && allGoods1[0].viewId == "M0000"){//都有
        allGoods1[0]=this.data.allGoods[0]//新数据的卡券赋值到缓存里面
        console.log("都有")
        for (var i = 0; i < h.length; i++) {
          if (h[i].cardordercode) {
            var flag = 0;
            for (var j = 0; j < allGoods1[0].goods.length; j++) {
              for (var n = 0; n < allGoods1[0].goods[j].operation.length; n++) {
                if (h[i].cardordercode == allGoods1[0].goods[j].operation[n].cardOrderCode) {
                  console.log("我想等了")
                  allGoods1[0].goods[j].operation[n].goodNum = 1
                  flag=1;
                  // this.setData({
                  //   cartShow: 'block'
                  // })
                  // this.calTotalPrice()
                }
              }
            }
            if(flag == 0){
              console.log("我走了flag为0的方法")
              this.removeByValue2(h, h[i].cardordercode)
              i--
              if (h.length <= 0) {
                this.setData({
                  allGoods: allGoods1,
                  carArray: [],
                  totalCount: 0,
                  totalPrice: 0,
                })
                this.setData({
                  display: 'none',
                  cartShow: 'none'
                })
                // wx.removeStorageSync('cart')
              } else {
                this.setData({
                  carArray: h,
                  allGoods: allGoods1
                })
                try {
                  wx.setStorageSync('cart', h)
                  // wx.setStorageSync('allGoods', allGoods1)
                } catch (e) {
                  console.log(e)
                }
                this.setData({
                  cartShow: 'block'
                })
                this.calTotalPrice()
              }
            } else {

              this.setData({
                carArray: h,
                allGoods: allGoods1
              })
              if (h.length > 0) {
                this.setData({
                  cartShow: 'block'
                })
                this.calTotalPrice()
              }
            }
          }else{
            this.setData({
              cartShow: 'block',
              allGoods: allGoods1
            })
            this.calTotalPrice()
          }
        }
        console.log(allGoods1)
        // this.setData({
        //   allGoods: allGoods1
        // })
       
        // this.setData({
        //   cartShow: 'block'
        // })
        // this.calTotalPrice()
      }
      else if (allGoods1 && this.data.allGoods[0].viewId != undefined &&  this.data.allGoods[0].viewId != "M0000" && allGoods1[0].viewId == "M0000" ){//缓存有，新数据没有
        // allGoods1.shift(this.data.allGoods[0])//新数据的卡券赋值到缓存里面
        allGoods1 = this.data.allGoods
        console.log("缓存有，新数据没有")
        wx.removeStorageSync('cart')
        wx.removeStorageSync('allGoods')
        try {
          wx.setStorageSync('allGoods', this.data.allGoods)
          // wx.setStorageSync('allGoods', allGoods1)
        } catch (e) {
          console.log(e)
        }
        this.setData({
          display: 'none',
          cartShow: 'none'
        })
        // for (var i = 0; i < h.length; i++) {
        //   if (h[i].cardordercode) {
        //     this.removeByValue2(h, h[i].cardordercode)
            
        //   }
        // }
        // if (h.length <= 0) {
        //   this.setData({
        //     allGoods: allGoods1,
        //     carArray: [],
        //     totalCount: 0,
        //     totalPrice: 0,
        //   })
        //   this.setData({
        //     display: 'none',
        //     cartShow: 'none'
        //   })
        // }else{
        //   this.setData({
        //     carArray: h,
        //     allGoods: allGoods1
        //   })
        //   try {
        //     wx.setStorageSync('cart', h)
        //     // wx.setStorageSync('allGoods', allGoods1)
        //   } catch (e) {
        //     console.log(e)
        //   }
        //   this.setData({
        //     cartShow: 'block'
        //   })
        //   this.calTotalPrice()
        // }
       
      }
      //判断卡券结束
      else{//都没有
      console.log('都没有')
            this.setData({
            cartShow: 'block'
          })
        this.calTotalPrice()
        // this.setData({
        //   allGoods: allGoods1
        // })
        for (var i = 0; i < cart.length; i++) {

          if (cart[i].shopid == this.data.restaurantMenuId) {
            console.log("我是同一个餐厅的餐品缓存")
            this.setData({
              carArray: wx.getStorageSync("cart"),
              allGoods: allGoods1
            })
          } else {//不同餐厅的缓存清掉
            console.log("我是不同餐厅的，需要清除掉")
            this.setData({
              cartShow: 'none'
            })
            try {
              wx.removeStorageSync('cart')
              wx.removeStorageSync('allGoods')
            } catch (e) {
              // Do something when catch error
            }
          }
        }
      }
      console.log(this.data.restaurantMenuId)
     
      // this.setData({
      //   carArray: wx.getStorageSync("cart"),
      //   allGoods: allGoods1
      // })
      
      // for (var i = 0; i < this.data.carArray.length; i++) {
      //   if (this.data.carArray[i].goodNum > 0) {

      //     this.setData({
      //       cartShow: 'block'
      //     })
      //     this.calTotalPrice()
      //   }
      //   //console.log(h[i].goodid1)
      //   for(var x=0;x<this.data.allGoods.length;x++){
      //     if (this.data.allGoods[x].viewId == "M0000"){
      //       for (var v = 0; v < this.data.allGoods[x].goods.length;v++){
      //         if (this.data.allGoods[x].goods[v].operation[0].cardOrderCode == h[i].cardordercode){
      //           this.data.allGoods[x].goods[v].operation[0].goodNum=1
      //           }
      //         }
      //     }
      //   }
        // if (allGoods[0].viewId == "M0000"){

        // }
        // if (allGoods[0].viewId =="M0000"){
          // if (h[i].typeid1 != undefined && h[i].cardordercode == undefined) {
          //   console.log("我执行了没有卡券的方法")
          //   allGoods[h[i].typeid1].goods[h[i].goodid1].operation[h[i].index].goodNum = h[i].goodNum
          //  }
        // else if(){

        //   } 
        // }else{//没有卡券
        //   allGoods[h[i].typeid1].goods[h[i].goodid1].operation[h[i].index].goodNum = h[i].goodNum
        // }
       
        // else if (h[i].cardordercode != undefined && h[i].typeid1 != undefined) {
          // console.log(this.data.allGoods[0].goods)
         
         
          // for (var j = 0; j < this.data.allGoods[0].goods.length; j++) {
          //   if (h[i].cardordercode == this.data.allGoods[0].goods[j].operation[0].cardOrderCode && h[i].cardordercode != undefined) {
          //     console.log("我执行了有卡券可能有单品的方法")
          //     this.data.allGoods[0].goods[j].operation[0].goodNum = 1
          //   }
          // }
        // } 
        // else if (h[i].cardordercode != undefined && h[i].typeid1 == undefined){
        //   console.log("我执行了只有卡券的方法")
        //   for (var j = 0; j < this.data.allGoods[0].goods.length; j++) {
        //     if (h[i].cardordercode == this.data.allGoods[0].goods[j].operation[0].cardOrderCode && h[i].cardordercode != undefined) {

        //       this.data.allGoods[0].goods[j].operation[0].goodNum = 1
        //     }
        //   }
        //  }
        
       
        // this.setData({
        //   allGoods: allGoods
        // })
        // console.log(this.data.allGoods)
      // }
    } else {
      // console.log('缓存不存在')
      this.setData({
        cartShow: 'none',
        // display:"none"
      })
    }
    if (cart && cart.length == 0) {
      this.setData({
        cartShow: 'none',
        display: "none"
      })
    }
    // if (allGoods1) {
    //   console.log("我是存在的缓存")
    //   try {
    //     //wx.setStorageSync('cart', arr)
    //     wx.setStorageSync('allGoods', allGoods1)
    //   } catch (e) {
    //     console.log(e)
    //   }
    // } else {
    //   try {
    //     //wx.setStorageSync('cart', arr)
    //     wx.setStorageSync('allGoods', this.data.allGoods)
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }
  },
  //添加卡券到购物车
  addCard(e) {
    console.log(e)
    // if (this.data.disabled) {    //判断ok，因为初始化为 true 所以会被执行
    //   this.setData({    //进入之后把ok设置成false，这样后面再点击就没用了
    //     disabled: false,
    //   })
    // }
    var _typeid = e.currentTarget.dataset.typeid;
    var _goodid = e.currentTarget.dataset.goodid;
    var _index = e.currentTarget.dataset.index;
    var types = e.currentTarget.dataset.types;
    var typ = this.data.allGoods[_typeid].goods[_goodid].operation[_index].type;
    console.log(e.currentTarget.dataset.index)
    var arr = wx.getStorageSync('cart') || [];
    var price = 0;
    var name = e.currentTarget.dataset.name;
    var cardordercode = e.currentTarget.dataset.cardordercode;
    var wxcardid = e.currentTarget.dataset.wxcardid;
    var shopid = this.data.restaurantMenuId//缓存门店id
  //  if(arr===undefined ||arr.length==0){
  //    console.log("我是空的")
  //  }
    var flag = 1;// 1
  if(arr.length==0){

  }else{
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].cardordercode == cardordercode) {
        // var goodNum = this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum;
        // goodNum = 1;
        console.log("我连点了")
        flag = 0;
        break;
        
      } else {
        
        // arr.push(obj);
      }
    }

  }
    // var goodNum = this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum++;
    if(flag == 1){
      this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum = 1
      var goodNum = 1;
      var xiaoji = price * goodNum

      xiaoji = parseFloat(xiaoji).toFixed(1)//计算单品的价值总和
      var obj = {
        price: price,
        goodNum: goodNum,
        isname: goodNum,
        name: name,
        cardordercode: cardordercode,
        wxcardid: wxcardid,
        index: _index,
        typeid1: _typeid,
        goodid1: _goodid,
        types: typ,
        xiaoji: xiaoji,
        shopid: shopid
      };

      arr.push(obj);
      this.setData({
        carArray: arr,
        //isclass:!this.isclass,
        //cardordercode: cardordercode,     
        allGoods: this.data.allGoods,
        // disabled:false
      })
      console.log(this.data.allGoods)

      try {
        wx.setStorageSync('cart', arr)
        wx.setStorageSync('allGoods', this.data.allGoods)
      } catch (e) {
        console.log(e)
      }
      this.calTotalPrice();
      if (goodNum > 0) {
        this.setData({
          cartShow: 'block'
        })
      }
    }
    
    // for(var i=0;i<arr.length;i++){
    //   if (cardordercode == cardordercode &&!cardordercode){
    //       break;
    //   }else{
    //     arr.push(obj);
    //   }
    // }
   

    
  },
  //增加商品数量
  addCount(e) {
    console.log(e)
    var _typeid = e.currentTarget.dataset.typeid;
    var _goodid = e.currentTarget.dataset.goodid;
    var _index = e.currentTarget.dataset.index;
    var types = e.currentTarget.dataset.types;
    // console.log(types)
    if (types == "add" || types == "half") {
      console.log("我是愿数组")
      this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum++;
      var mark = 'a' + _typeid + 'b' + _goodid + 'c' + _index;
      var price = this.data.allGoods[_typeid].goods[_goodid].operation[_index].price;
      var goodNum = this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum;
      var name = this.data.allGoods[_typeid].goods[_goodid].name;
      var typeid = this.data.allGoods[_typeid].menuId;
      var goodid = this.data.allGoods[_typeid].goods[_goodid].dishesMenuId;
      var operationid = this.data.allGoods[_typeid].goods[_goodid].operation[_index].dishesButtonId;
      var dishesItemId = this.data.allGoods[_typeid].goods[_goodid].operation[_index].dishesItemId;
      var combMenuName = this.data.allGoods[_typeid].goods[_goodid].operation[_index].combMenuName;
      var typ = this.data.allGoods[_typeid].goods[_goodid].operation[_index].type;
      var xiaoji = price * goodNum
      xiaoji = parseFloat(xiaoji).toFixed(1)//计算单品的价值总和
      if (this.data.allGoods[_typeid].goods[_goodid].operation[_index].zhushiName){
        var zhushiName = this.data.allGoods[_typeid].goods[_goodid].operation[_index].zhushiName;
        var xiaoshiName = this.data.allGoods[_typeid].goods[_goodid].operation[_index].xiaoshiName;
        var drinkName = this.data.allGoods[_typeid].goods[_goodid].operation[_index].drinkName;
        var menuNameList = [];
        menuNameList.push(zhushiName, xiaoshiName, drinkName)
        console.log(menuNameList)
      }
      var shopid = this.data.restaurantMenuId//缓存门店id
     
      var obj = {
        price: price,
        goodNum: goodNum,
        xiaoji: xiaoji,
        //mark: mark,
        name: name,
        typeid: typeid,
        goodid: goodid,
        operationid: operationid,
        index: _index,
        typeid1: _typeid,
        goodid1: _goodid,
        types: typ,
        dishesItemId: dishesItemId,
        combMenuName: combMenuName,
        menuNameList: menuNameList,
        shopid: shopid
      };
      var arr = wx.getStorageSync('cart') || []
      var f = false;
      if (arr.length > 0) {

        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          if (arr[j].dishesItemId == dishesItemId && arr[j].operationid == operationid && arr[j].goodid == goodid) {
            arr[j].goodNum += 1;
            arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
            // xiaoji = xiaoji.toFixed(1)//计算单品的价值总和
            // console.log( typeof xiaoji)
            // console.log(xiaoji)
            f = true;
            try {
              wx.setStorageSync('cart', arr)
            } catch (e) {
              // console.log(e)
            }

          }
        }
        if (!f) {
          arr.push(obj);
        }
      } else {
        arr.push(obj);
      }
    } else { //定制数组
      console.log("我是现在数组")
      var arr = wx.getStorageSync('cart') || []
      var f = false;
      // console.log(arr)
      if (arr.length > 0) {

        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          // console.log(arr[j].goodid)
          // console.log(e.currentTarget.dataset.goodsid)
          if (arr[j].goodid12 == e.currentTarget.dataset.goodsid) {
            console.log("我点击了相同的商品")
            arr[j].goodNum += 1;
            arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1);
            arr[j].shopid = this.data.restaurantMenuId
            f = true;
            try {
              wx.setStorageSync('cart', arr)
            } catch (e) {
              // console.log(e)
            }

          }
        }
        if (!f) {
          arr.push(obj);
        }
      } else {
        arr.push(obj);
        // console.log(arr)
      }

    }
    this.setData({
      carArray: arr,
      allGoods: this.data.allGoods
    })
    try {
      wx.setStorageSync('cart', arr)
      wx.setStorageSync('allGoods', this.data.allGoods)
    } catch (e) {
      console.log(e)
    }

    this.calTotalPrice();
    // console.log(this.data.allGoods)
    // console.log(e)
    if (goodNum > 0) {
      this.setData({
        cartShow: 'block'
      })
    }
    // var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    // console.log(carArray1)
    // carArray1.push(obj)

    // this.setData({
    //   carArray: arr,
    //   allGoods: this.data.allGoods
    // })
    // try {
    //   wx.setStorageSync('cart', arr)
    //   wx.setStorageSync('allGoods', this.data.allGoods)
    // } catch (e) {
    //   console.log(e)
    // }

    // this.calTotalPrice();
    // console.log(this.data.allGoods)
    // console.log(e)
    // if (goodNum > 0) {
    //   this.setData({
    //     cartShow: 'block'
    //   })
    // }
    // wx.setStorage({
    //   key: 'carArray1',
    //   data: carArray1,
    // })
    // wx.setStorage({
    //   key: 'allgoods1',
    //   data: this.data.allGoods,
    // })
  },

  // 定义根据id删除数组的方法
  removeByValue: function(array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].operationid == val) {
        array.splice(i, 1);
        break;
      }
    }
  },
  removeByValue1: function(array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].goodid12 == val) {
        array.splice(i, 1);
        break;
      }
    }
  },
  removeByValue2: function(array, val) {//删除卡券
    for (var i = 0; i < array.length; i++) {
      if (array[i].cardordercode == val) {
        array.splice(i, 1);
        break;
      }
    }
  },
  
  // 减少数量
  minusCount(e) {
    console.log(e)
    var _typeid = e.currentTarget.dataset.typeid;
    var _goodid = e.currentTarget.dataset.goodid;
    var _index = e.currentTarget.dataset.index;
    var types = e.currentTarget.dataset.types;
    console.log(e)
    if (types == "add" || types == "half") {
      console.log("我是愿数组")
      if (this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum <= 0){
        this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum = 0;
      }else{
        this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
      }
      
      console.log(this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum)
      var mark = 'a' + _typeid + 'b' + _goodid + 'c' + _index;
      // var price = this.data.allGoods[_typeid].goods[_goodid].nowPrice;
      var price = this.data.allGoods[_typeid].goods[_goodid].operation[_index].price;
      var goodNum = this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum;
      var name = this.data.allGoods[_typeid].goods[_goodid].name;
      var typeid = this.data.allGoods[_typeid].menuId;
      var goodid = this.data.allGoods[_typeid].goods[_goodid].dishesMenuId;
      var operationid = this.data.allGoods[_typeid].goods[_goodid].operation[_index].dishesButtonId;
      var dishesItemId = this.data.allGoods[_typeid].goods[_goodid].operation[_index].dishesItemId;
      var combMenuName = this.data.allGoods[_typeid].goods[_goodid].operation[_index].combMenuName;
      var cardOrderCode = this.data.allGoods[_typeid].goods[_goodid].operation[_index].cardOrderCode;
      console.log(this.data.allGoods[0].goods[0].operation[0].cardOrderCode)
      var xiaoji = price * goodNum

      xiaoji = parseFloat(xiaoji).toFixed(1)//计算单品的价值总和
      var shopid = this.data.restaurantMenuId//缓存门店id
      var obj = {
        price: price,
        goodNum: goodNum,
        //mark: mark,
        name: name,
        typeid: typeid,
        goodid: goodid,
        operationid: operationid,
        index: _index,
        typeid1: _typeid,
        goodid1: _goodid,
        dishesItemId: dishesItemId,
        combMenuName: combMenuName,
        xiaoji: xiaoji,
        shopid: shopid
      };
      // var carArray1 = this.data.carArray.filter(item => item.mark != mark)
      // console.log(carArray1)
      // carArray1.push(obj)
      var arr = wx.getStorageSync('cart') || []
      console.log(arr)
      var f = false;
      if (arr.length > 0) {

        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          if (arr[j].dishesItemId == dishesItemId && arr[j].operationid == operationid && arr[j].goodid == goodid && arr[j].cardordercode == undefined) {
            console.log("我走了删除不是卡券的方法")
            arr[j].goodNum -= 1;
            arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
            f = true;
            if (arr[j].goodNum <= 0) {

              this.removeByValue(arr, operationid)

            }
            if (arr.length <= 0) {
              this.setData({
                allGoods: this.data.allGoods,
                carArray: [],
                totalCount: 0,
                totalPrice: 0,
              })
              this.setData({
                display: 'none',
                cartShow: 'none'
              })

            }
          }
          //删除卡券
          else if (arr[j].cardordercode != undefined && arr[j].cardordercode == cardOrderCode) {
            console.log("我走了删除卡券的方法")
            arr[j].goodNum -= 1;
             arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
            f = true;
            if (arr[j].goodNum <= 0) {

              this.removeByValue2(arr, cardOrderCode)

            }
            if (arr.length <= 0) {
              this.setData({
                allGoods: this.data.allGoods,
                carArray: [],
                totalCount: 0,
                totalPrice: 0,
              })
              this.setData({
                display: 'none',
                cartShow: 'none'
              })

            }
          }

        }

      }
      console.log(this.data.allgoods)
    } else { //新数组
      console.log("我是新数组")
      var arr = wx.getStorageSync('cart') || []
      var f = false;
      if (arr.length > 0) {
        // console.log(arr)
        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          console.log(arr[j].goodid12)
          console.log(e.currentTarget.dataset.goodsid)
          if (arr[j].goodid12 == e.currentTarget.dataset.goodsid) {
            console.log("我的数组大雨o")
            arr[j].goodNum -= 1;
            arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
            if (arr[j].goodNum <= 0) {

              this.removeByValue1(arr, e.currentTarget.dataset.goodsid)

            }
            if (arr.length <= 0) {
              console.log("我执行了数组的长度小于0的方法")
              this.setData({
                allGoods: this.data.allGoods,
                carArray: [],
                totalCount: 0,
                totalPrice: 0,
              })
              this.setData({
                display: 'none',
                cartShow: 'none'
              })

            }
          }

        }
        // if (!f) {
        //   arr.push(obj);
        // }
      }
      // else {
      //   arr.push(obj);
      // }

    }
    //let allGoods = this.data.allGoods;

    this.setData({
      carArray: arr,
      allGoods: this.data.allGoods
    })
    try {
      wx.setStorageSync('cart', arr)
      wx.setStorageSync('allGoods', this.data.allGoods)
    } catch (e) {
      // console.log(e)
    }

    this.calTotalPrice();



  },
  //清空购物车
  clearcar() {　
    //console.log(e)
    var carArray = this.data.carArray;
    var allgoods = this.data.allGoods;
    // wx.removeStorageSync('cart')
    // wx.removeStorageSync('allGoods')
    // console.log(allgoods)
    for (var i = 0; i < allgoods.length; i++) {
      for (var j = 0; j < allgoods[i].goods.length; j++) {
        for (var k = 0; k < allgoods[i].goods[j].operation.length; k++) {
          allgoods[i].goods[j].operation[k].goodNum = 0
        }
      }
    }
    var totalPrice = 0;
    var totalCount = 0;
    console.log(allgoods)
    this.setData({
      allGoods: allgoods,
      carArray: [],
      totalCount: 0,
      totalPrice: 0,
      display: 'none',
      cartShow: 'none'
    })
    try {
      wx.setStorageSync('cart', this.data.carArray)
       wx.setStorageSync('allGoods', this.data.allGoods)
    } catch (e) {
      console.log(e)
    }

  },
  //计算总价
  calTotalPrice: function() {
    var carArray = this.data.carArray;
    var totalPrice = 0;
    var totalCount = 0;
    for (var i = 0; i < carArray.length; i++) {
      // totalPrice += parseFloat(carArray[i].price * carArray[i].goodNum).toFixed(1);
       totalPrice += carArray[i].price * carArray[i].goodNum;
     
      totalCount += carArray[i].goodNum
    }
    
    var totalPrice = parseFloat(totalPrice).toFixed(1)
    console.log( typeof totalPrice)
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount,
      //payDesc: this.payDesc()
    });
  },
  //修改详情页
  // xiugai(){
  //   console.log(111)
  //   wx.navigateTo({
  //     url: "/pages/gooddetail/gooddetail?goodsid={{item.gid}}&title={{item.name}}&typ={{item.types}}"
  //   })
  // },
  // 显示购物车内容
  showview: function() {
    var that = this;
    var display = that.data.display === 'none' ? 'block' : 'none';


    that.setData({
      display: display,

    })
  },
  hideview: function() {
    this.setData({
      display: "none"
    })
  },
  //跳转到支付页面
  gotopay() {
    wx.setStorageSync('allGoods', this.data.allGoods)
    var totleprice = this.data.totalPrice;
    var title = this.data.title;
    var address = this.data.address;
    getCurrentPages().pop();
    wx.navigateTo({
      url: '../shopcarpay/shopcarpay?totleprice=' + totleprice + '&title=' + title + '&address=' + address + ''
    })
  },
  // 穿透
  myCatchTouch: function() {
    // console.log('stop user scroll it!');
    return;
  },
  tickmember() {
    console.log(111)
    wx.switchTab({
      url: '../member/member?customerId=1'
    })
  },
  searchFood() {
    wx.setStorageSync('allGoods', this.data.allGoods)
  },
  onShareAppMessage: function(res) {
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