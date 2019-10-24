var util = require('../../utils/util.js');
const app = getApp()
var WXBizDataCrypt = require('../../utils/cryptojs/RdWXBizDataCrypt.js');
var appId = "wxb5b5fac2ed9acbef";
var secret = '04e28014b4b9186a922925c4703e78da';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    address: '',
    carArray: [],
    totalPrice: '',
    time1: '',
    time: '',
    showview0: true,
    showview: false,
    showview1: true,
    registerShow: false,
    diningWay: "",
    appointmentFlg: "0",
    nowtime: "",
    showbg: false,
    liji: "立即取餐",
    tangshi: "堂食",
    zhifu: "微信支付",
    tableNumber:"点击扫码",
    mjdata:[],
    yuje:0,
    hjje:'',//优惠后的价格
    discountId:'',//优惠id
    isfload:false,
    isfload1: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    this.setData({
      diningWay: ""
    })
    if (app.globalData.openid == '' || app.globalData.customerId == ''){
      this.appLogin()
    }
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    console.log(time)
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time1: time
    });

    // console.log(time)
    this.setData({
      totalPrice: options.totleprice,
      title: options.title,
      address: options.address
    })
    // console.log(this.data.totalPrice)
    //缓存
    var cart = wx.getStorageSync("cart");
    var allGoods1 = wx.getStorageSync("allGoods");

    if (cart) {
      this.setData({
        carArray: cart,
        allGoods: allGoods1
      })
      // console.log(this.data.carArray)
      // console.log(this.data.allGoods)
      for (var i = 0; i < this.data.carArray.length; i++) {
        if (this.data.carArray[i].goodNum > 0) {
          // console.log(1)
          this.setData({
            cartShow: 'block'
          })
          this.calTotalPrice()
        }


      }


    }
    if (allGoods1) {
      try {
        //wx.setStorageSync('cart', arr)
        wx.setStorageSync('allGoods', allGoods1)
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        //wx.setStorageSync('cart', arr)
        wx.setStorageSync('allGoods', this.data.allGoods)
      } catch (e) {
        console.log(e)
      }
    }
    
    this.serchprice()
    

  },
  appLogin(){
    var host = app.globalData.host;
    wx.login({
      success: function (res) {
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
            success: function (res) {
              console.log(res)
              if (res.data.status == "1") {
                app.globalData.openid = res.data.res.openid;
                app.globalData.customerId = res.data.res.customerId;
                app.globalData.isMember = res.data.res.isMember + "";
                app.globalData.session_key = res.data.res.session_key;
                app.globalData.unionid = res.data.res.unionid;
              } else {
                
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
// 查询满减优惠
serchprice(){
  var host = app.globalData.host;
  wx.request({
    url: host + '/catering/discount/findDiscount',
    method: 'get',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: this.aa.bind(this)
    // function(data){
    //     console.log(data)

    // }
  })
},
  aa(data) {
    console.log(data)
    var result = data.data.res.result;
    var that = this;
    that.setData({
      mjdata:result
    })
    console.log( result.length)
    if (result.length==0){
      console.log("我是空数据")
      this.setData({
        hjje: this.data.totalPrice,
        yuje: 0,
        discountId: ''
      })
    }
    for(var i=0;i<result.length;i++){
      
      if (result[i].thresholdPrice!=null){
        console.log('我是有满减优惠的')
        this.setData({
          isfload:true
        })
        if (this.data.totalPrice - result[i].thresholdPrice >= 0 ){
          console.log(result[i].discountPrice)
          var sj = this.data.totalPrice - result[i].discountPrice
          console.log(sj)
          this.setData({
            hjje: sj,
            yuje: result[i].discountPrice,
            discountId: result[i].discountId
          })
        }else if (this.data.totalPrice - result[0].thresholdPrice < 0){
          this.setData({
            hjje: this.data.totalPrice,
            yuje: 0,
            discountId: ''
          })
        }
       
      }
      // else{
      //   console.log('我也走了else')
      //   this.setData({
      //     hjje: this.data.totalPrice,
      //     yuje: 0,
      //     discountId:''
      //   })
      // }
    //折扣
      if (result[i].discount!=null){
        console.log(this.data.totalPrice)
        var sj2 = result[i].discount * 0.1 * this.data.totalPrice
        var sj = sj2.toFixed(2)
        var yuje = this.data.totalPrice - sj
        console.log(yuje)
        this.setData({
          hjje: sj,
          yuje: yuje,
          isfload1: true,
          discountId: result[i].discountId
        })
      }else{

      }
    }

  },
  // 发送消息模板
  messge: function (e) {
   
   
  },
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var nowtime = year + '-' + month + '-' + day + ' ' + e.detail.value + ':00'
    this.setData({
      time: e.detail.value,
      nowtime: nowtime
    })

  },
  radioChange: function(e) {


    this.setData({
      showview1: !this.data.showview1,
      showview: !this.data.showview,
    })
    if (this.data.showview){
      console.log(this.data.showview)
      this.setData({
        appointmentFlg: "1"
      })
    }else{
      this.setData({
        appointmentFlg: "0"
      })
    }
    // if (e.detail.value == "later") {
    //   that.setData({
    //     appointmentFlg: "1",
    //     liji: "预约取餐",

    //   })
    // } else {
    //   that.setData({
    //     appointmentFlg: "0",
    //     liji: "立即取餐",

    //   })
    // }
  },
  handyuyue() {
    this.setData({
      showview: !this.data.showview,
      showview1: !this.data.showview1,
      showview0: !this.data.showview1,

    })
    if (this.data.showview) {
      console.log(this.data.showview)
      this.setData({
        appointmentFlg: "1"
      })
    } else {
      this.setData({
        appointmentFlg: "0"
      })
    }
  },
  //增加商品数量
  addCount(e) {
    console.log(e.currentTarget.dataset.goodsid)
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
      if (this.data.allGoods[_typeid].goods[_goodid].operation[_index].zhushiName) {
        var zhushiName = this.data.allGoods[_typeid].goods[_goodid].operation[_index].zhushiName;
        var xiaoshiName = this.data.allGoods[_typeid].goods[_goodid].operation[_index].xiaoshiName;
        var drinkName = this.data.allGoods[_typeid].goods[_goodid].operation[_index].drinkName;
        var menuNameList = [];
        menuNameList.push(zhushiName, xiaoshiName, drinkName)
        console.log(menuNameList)
      }
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
        types: typ,
        dishesItemId: dishesItemId,
        combMenuName: combMenuName,
        xiaoji:xiaoji,
        menuNameList: menuNameList
      };
      var arr = wx.getStorageSync('cart') || []
      var f = false;
      if (arr.length > 0) {

        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          if (arr[j].dishesItemId == dishesItemId && arr[j].operationid == operationid && arr[j].goodid == goodid) {
            
            arr[j].goodNum += 1;
            arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
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
      console.log(arr)
      // console.log(arr)
      if (arr.length > 0) {

        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          // console.log(arr[j].goodid)
          // console.log(e.currentTarget.dataset.goodsid)
          if (arr[j].goodid12 == e.currentTarget.dataset.goodsid) {
            console.log("我点击了相同的商品")
            arr[j].goodNum += 1;
            arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
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
  removeByValue2: function (array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].cardordercode == val) {
        array.splice(i, 1);
        break;
      }
    }
  },
  // 减少数量
  minusCount(e) {
    var _typeid = e.currentTarget.dataset.typeid;
    var _goodid = e.currentTarget.dataset.goodid;
    var _index = e.currentTarget.dataset.index;
    var types = e.currentTarget.dataset.types;
    console.log(e)
    var arr = wx.getStorageSync('cart') || []
    if (types == "add" || types == "half") {
      console.log("我是愿数组")
      //this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
      var mark = 'a' + _typeid + 'b' + _goodid + 'c' + _index;
      //var price = this.data.allGoods[_typeid].goods[_goodid].nowPrice;
      var price = this.data.allGoods[_typeid].goods[_goodid].operation[_index].price;
      var goodNum = this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum;
      var name = this.data.allGoods[_typeid].goods[_goodid].name;
      var typeid = this.data.allGoods[_typeid].menuId;
      var goodid = this.data.allGoods[_typeid].goods[_goodid].dishesMenuId;
      var operationid = this.data.allGoods[_typeid].goods[_goodid].operation[_index].dishesButtonId;
      var dishesItemId = this.data.allGoods[_typeid].goods[_goodid].operation[_index].dishesItemId;
      var combMenuName = this.data.allGoods[_typeid].goods[_goodid].operation[_index].combMenuName;
      var cardOrderCode = this.data.allGoods[_typeid].goods[_goodid].operation[_index].cardOrderCode;
      var xiaoji = price * goodNum

      xiaoji = parseFloat(xiaoji).toFixed(1)//计算单品的价值总和
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
        xiaoji:xiaoji
      };
      // var carArray1 = this.data.carArray.filter(item => item.mark != mark)
      // console.log(carArray1)
      // carArray1.push(obj)
      // var arr = wx.getStorageSync('cart') || []
      var f = false;
      if (arr.length > 0) {

        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          if (arr[j].dishesItemId == dishesItemId && arr[j].operationid == operationid && arr[j].goodid == goodid) {

            f = true;
            console.log(arr.length)
            if (arr[j].goodNum <= 1 && arr.length > 1) {
              console.log("我执行了移除数组方法，bing")
              arr[j].goodNum -= 1;
              arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
              this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
              this.removeByValue(arr, operationid)
              this.setData({
                carArray: arr,
                allGoods: this.data.allGoods
              })
              console.log(arr)
              try {
                wx.setStorageSync('cart', arr)
                wx.setStorageSync('allGoods', this.data.allGoods)
              } catch (e) {
                console.log(e)
              }

            } else if (arr[j].goodNum > 1) {
              console.log("我是数量大雨一的时候")
              arr[j].goodNum -= 1;
              arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
              this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
              this.setData({
                carArray: arr,
                allGoods: this.data.allGoods
              })
              console.log(arr)
              try {
                wx.setStorageSync('cart', arr)
                wx.setStorageSync('allGoods', this.data.allGoods)
              } catch (e) {
                console.log(e)
              }
            } else if (arr[j].goodNum <= 1 && arr.length <= 1) {
              var that = this
              // var num1=that.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
              // var num2=arr[j].goodNum ;
              wx.showModal({
                title: '提示',
                content: '删除最后一款餐点，您将回到菜单页，不删除您将回到订单页面',
                confirmText: "增加餐点",
                cancelText: "回订单",
                success: function(res) {
                  console.log(res)
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum -= 1;
                    arr[j].goodNum -= 1;
                    arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
                    // num2--
                    console.log(arr[j].goodNum)
                    // console.log(num2)
                    console.log(arr)
                    console.log(goodid)
                    that.removeByValue(arr, operationid)
                    that.setData({
                      carArray: arr,
                      allGoods: that.data.allGoods,
                      totalCount: 0,
                      totalPrice: 0,
                    })
                    console.log(arr)
                    try {
                      wx.setStorageSync('cart', arr)
                      wx.setStorageSync('allGoods', that.data.allGoods)
                    } catch (e) {
                      console.log(e)
                    }
                    wx.switchTab({
                      url: '../index/index'
                    })
                  } else if (res.cancel) {
                    // arr[j].goodNum = 1
                    console.log('用户点击取消')
                  }
                }
              })
            }
            // if (arr.length <= 0) {
            //   this.setData({
            //     allGoods: this.data.allGoods,
            //     carArray: [],
            //     totalCount: 0,
            //     totalPrice: 0,
            //   })
            //   console.log(this.data.allGoods)
            //   this.setData({
            //     display: 'none',
            //     cartShow: 'none'
            //   })

            // }
            //  if (arr.length <1){
            //   wx.showModal({
            //     title: '提示',
            //     content: '删除最后一款餐点，您将回到菜单页，不删除您将回到订单页面',
            //     success: function (res) {
            //       if (res.confirm) {
            //         console.log('用户点击确定')
            //         arr[j].goodNum -= 1;
            //         f = true;
            //         this.removeByValue(arr, goodid)
            //       } else if (res.cancel) {
            //         arr[j].goodNum = 1
            //         console.log('用户点击取消')
            //       }
            //     }
            //   })
            // }

          }

          //删除卡券


          else if (arr[j].cardordercode != undefined &&arr[j].cardordercode == cardOrderCode) {
            console.log("我走了删除卡券的方法")
            f = true;
            console.log(arr.length)
            if (arr[j].goodNum <= 1 && arr.length > 1) {
              console.log("我执行了移除数组方法，bing")
              arr[j].goodNum -= 1;
              arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
              this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
              this.removeByValue2(arr, cardOrderCode)
              this.setData({
                carArray: arr,
                allGoods: this.data.allGoods
              })
              console.log(arr)
              try {
                wx.setStorageSync('cart', arr)
                wx.setStorageSync('allGoods', this.data.allGoods)
              } catch (e) {
                console.log(e)
              }

            } else if (arr[j].goodNum <= 1 && arr.length <= 1) {
              var that = this
              // var num1=that.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
              // var num2=arr[j].goodNum ;
              wx.showModal({
                title: '提示',
                content: '删除最后一款餐点，您将回到菜单页，不删除您将回到订单页面',
                confirmText: "增加餐点",
                cancelText: "回订单",
                success: function (res) {
                  console.log(res)
                  if (res.confirm) {
                    console.log('用户点击确定')
                    that.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum -= 1;
                    arr[j].goodNum -= 1;
                    arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
                
                    that.removeByValue2(arr, cardOrderCode)
                    that.setData({
                      carArray: arr,
                      allGoods: that.data.allGoods,
                      totalCount: 0,
                      totalPrice: 0,
                    })
                    console.log(arr)
                    try {
                      wx.setStorageSync('cart', arr)
                      wx.setStorageSync('allGoods', that.data.allGoods)
                    } catch (e) {
                      console.log(e)
                    }
                    wx.switchTab({
                      url: '../index/index'
                    })
                  } else if (res.cancel) {
                    // arr[j].goodNum = 1
                    console.log('用户点击取消')
                  }
                }
              })
            }
          }

        }

      }
    } else { //新数组
      console.log("我是新数组")
      var arr = wx.getStorageSync('cart') || []
      var f = false;
      if (arr.length > 0) {
        console.log(arr)
        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          console.log(arr[j].goodid)
          console.log(e.currentTarget.dataset.goodsid)
          if (arr[j].goodid12 == e.currentTarget.dataset.goodsid) {
            console.log("我的数组大雨o")

            if (arr[j].goodNum <= 1 && arr.length > 1) {
              console.log("我执行了移除数组方法，bing")
              arr[j].goodNum -= 1;
              arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
              //this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
              this.removeByValue1(arr, e.currentTarget.dataset.goodsid)
              this.setData({
                carArray: arr,
                allGoods: this.data.allGoods
              })
              console.log(arr)
              try {
                wx.setStorageSync('cart', arr)
                wx.setStorageSync('allGoods', this.data.allGoods)
              } catch (e) {
                console.log(e)
              }

            } else if (arr[j].goodNum > 1) {
              console.log("我是数量大雨一的时候")
              arr[j].goodNum -= 1;
              arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
              //this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
              this.setData({
                carArray: arr,
                allGoods: this.data.allGoods
              })
              console.log(arr)
              try {
                wx.setStorageSync('cart', arr)
                wx.setStorageSync('allGoods', this.data.allGoods)
              } catch (e) {
                console.log(e)
              }
            } else if (arr[j].goodNum <= 1 && arr.length <= 1) {
              var that = this
              // var num1=that.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
              // var num2=arr[j].goodNum ;
              wx.showModal({
                title: '提示',
                content: '删除最后一款餐点，您将回到菜单页，不删除您将回到订单页面',
                success: function(res) {
                  console.log(res)
                  if (res.confirm) {
                    console.log('用户点击确定')
                    //that.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum -= 1;
                    arr[j].goodNum -= 1;
                    arr[j].xiaoji = parseFloat(arr[j].goodNum * arr[j].price).toFixed(1)
                    // num2--
                    console.log(arr[j].goodNum)
                    // console.log(num2)
                    console.log(arr)
                    //console.log(goodid)
                    that.removeByValue1(arr, e.currentTarget.dataset.goodsid)
                    that.setData({
                      carArray: arr,
                      allGoods: that.data.allGoods
                    })
                    console.log(arr)
                    try {
                      wx.setStorageSync('cart', arr)
                      wx.setStorageSync('allGoods', that.data.allGoods)
                    } catch (e) {
                      console.log(e)
                    }
                    that.setData({
                      display: 'none',
                      cartShow: 'none'
                    })
                    wx.switchTab({
                      url: '../index/index'
                    })
                  } else if (res.cancel) {
                    // arr[j].goodNum = 1
                    console.log('用户点击取消')
                  }
                }
              })
            }





            // arr[j].goodNum -= 1;

            // if (arr[j].goodNum <= 0) {
            //   console.log(111)
            //   this.removeByValue(arr, e.currentTarget.dataset.goodsid)

            // }
            // if (arr.length <= 0) {
            //   this.setData({
            //     allGoods: this.data.allGoods,
            //     carArray: [],
            //     totalCount: 0,
            //     totalPrice: 0,
            //   })
            //   this.setData({
            //     display: 'none',
            //     cartShow: 'none'
            //   })

            // }
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

    // this.setData({
    //   carArray: arr,
    //   allGoods: this.data.allGoods
    // })
    // console.log(arr)
    // try {
    //   wx.setStorageSync('cart', arr)
    //   wx.setStorageSync('allGoods', this.data.allGoods)
    // } catch (e) {
    //   console.log(e)
    // }

    this.calTotalPrice();



  },
  ychu(res) {

  },
  //计算总价
  calTotalPrice: function() {
    var carArray = this.data.carArray;
    // console.log(carArray)
    var totalPrice = 0;
    var totalCount = 0;
    for (var i = 0; i < carArray.length; i++) {
      totalPrice += carArray[i].price * carArray[i].goodNum;
      totalCount += carArray[i].goodNum
    }
    var totalPrice = parseFloat(totalPrice).toFixed(1)
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount,
      //payDesc: this.payDesc()
    });
    this.serchprice()
  },
  onShow() {
    // console.log(app.globalData.isMember)
    if (app.globalData.isMember == "1") {
      this.setData({
        registerShow: false
      })
    } else {
      this.setData({
        registerShow: true
      })
    }
  },
  // onShow(){
  //   // console.log(options)
  //   // this.setData({
  //   //   totalPrice: options.totleprice
  //   // })
  //   // console.log(this.data.totalPrice)
  //   //缓存
  //   var cart = wx.getStorageSync("cart");
  //   var allGoods1 = wx.getStorageSync("allGoods");

  //   if (cart) {
  //     this.setData({
  //       carArray: cart,
  //       allGoods: allGoods1
  //     })
  //     console.log(this.data.carArray)
  //     console.log(this.data.allGoods)
  //     for (var i = 0; i < this.data.carArray.length; i++) {
  //       if (this.data.carArray[i].goodNum > 0) {
  //         console.log(1)
  //         this.setData({
  //           cartShow: 'block'
  //         })
  //         this.calTotalPrice()
  //       }


  //     }


  //   }
  //   if (allGoods1) {
  //     try {
  //       //wx.setStorageSync('cart', arr)
  //       wx.setStorageSync('allGoods', allGoods1)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   else {
  //     try {
  //       //wx.setStorageSync('cart', arr)
  //       wx.setStorageSync('allGoods', this.data.allGoods)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  // },
  // 去登陆吆
  navtoRegister() {
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          var pc = new WXBizDataCrypt(appId, app.globalData.session_key)
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              wx.navigateTo({
                url: '/pages/register/register'
              })
              //拿到getUserInfo（）取得的res.encryptedData, res.iv，调用decryptData（）解密
              var data = pc.decryptData(res.encryptedData, res.iv)
              // data.unionId就是咱们要的东西了
              app.globalData.unionid = data.unionId
              console.log('解密后 unionid: ', app.globalData.unionid)
              
            },
            fail: function(res) {
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '您的手机无法注册会员请截图联系店员处理。' + res,
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
          })
        }
      }
    })


  },
  handmap() {
    var title = this.data.title;
    var address = this.data.address;
    wx.redirectTo({
      url: '/pages/chooseaddress/chooseaddress?title=' + title + '&address=' + address + ''
    })
  },
  formatTime() {
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    console.log(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second)
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  },
  saoma(){
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log("结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path)
        var result1 = JSON.parse(res.result);
        if (result1.restaurant == "niumaike" && result1.number != '') {
          that.setData({
            tableNumber: result1.number
          })
        }

        wx.showToast({
          title: '扫码成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        that.setData({
          tableNumber: "点击扫码"
        })
        wx.showToast({
          title: '扫码失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  handletypechange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var that = this;
    if (e.detail.value == "buy") {

      this.setData({
        diningWay: "1",
        tangshi: "外带",
        // tableNumber: "点击扫码"
      })
    } else {
      that.setData({
        diningWay: "0",
        tangshi: "堂食",
        // tableNumber: result1.number
      })
      // wx.scanCode({
      //   success: (res) => {
      //     console.log("结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path)
      //     var result1 = JSON.parse(res.result);
      //     if (result1.restaurant == "niumaike" && result1.number != '' ){
      //       that.setData({
      //         diningWay: "0",
      //         tangshi: "堂食",
      //         tableNumber: result1.number
      //       })
      //     }
          
      //     wx.showToast({
      //       title: '扫码成功',
      //       icon: 'success',
      //       duration: 2000
      //     })
      //   },
      //   fail: (res) => {
      //     that.setData({
      //       diningWay: "0",
      //       tangshi: "堂食",
      //       tableNumber: "点击扫码"
      //     })
      //     wx.showToast({
      //       title: '扫码失败',
      //       icon: 'success',
      //       duration: 2000
      //     })
      //   },
      //   complete: (res) => {
      //   }
      // })
      
    }
  },
  handletypechange1(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    if (e.detail.value == "weixin") {
      this.setData({

        zhifu: "微信支付"
      })
    } else {
      this.setData({

        zhifu: "卡券支付"
      })
    }
  },
  //lv

  quxiao() {
    this.setData({

      showbg: !this.data.showbg
    })

  },
  //确认订单
  sure() {

  },
  gotopay(e) {
    // var form_id = e.detail.formId;
    // console.log(form_id)
    this.setData({
      showbg: !this.data.showbg
    })
    if (app.globalData.isMember == "1") {

    } else {
      wx.showToast({
        title: '请注册会员',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    wx.showLoading({
      title: '等待支付',
      mask:true
    })
    var restaurantId = app.globalData.resid; //餐厅ID

    var orderPrice = this.data.hjje; //订单价格

    var payment1 = "0"; //付款方式（字典项）0:微信支付,1:支付宝支付,2:现金支付

    var payment2 = ""; //付款方式（字典项）0:微信支付,1:支付宝支付,2:现金支付

    var payment1Price = this.data.hjje; //付款方式1金额

    var payment2Price = ""; //付款方式2金额

    var createTime = this.formatTime(); //创建时间

    var clientFrom = "0"; //订单来源（字典项）：0-微信小程序，1-收银机,3-外卖订单

    var customerId = app.globalData.openid; //订单状态（字典项）：0-取消订单，1-已支付订单

    var diningWay = this.data.diningWay; //就餐方式（字典项）：0-堂食；1-打包带走

    var seat = ''; //座位号
    var formId = e.detail.formId;

    if (diningWay == "1" || diningWay == "0") {
      console.log(diningWay)
      if (diningWay == "0"){
        // if (seat == '点击扫码') {
        //   wx.showToast({
        //     title: '请点击扫码获取座位号',
        //     icon: 'none',
        //     duration: 1500
        //   })
        //   return false;
        // }else{
        //   seat = this.data.tableNumber;
        // }
        seat = '堂食';
      }else{
        seat = '打包';
      }
      
    } else {
      wx.showToast({
        title: '请选择就餐方式',
        icon: 'none',
        duration: 1500
      })
      return false;
    }

    var appointmentFlg = this.data.appointmentFlg; //预约标志（字典项）：0-非预约；1-预约
    console.log(appointmentFlg)
    if (appointmentFlg == "0") {
      var appointmentTime = ""; //预约几点到店
    } else {
      if (this.data.nowtime == "") {
        wx.showToast({
          title: '请选择预约时间',
          icon: 'none',
          duration: 1500
        })
        return false;
      } else {
        var appointmentTime = this.data.nowtime; //预约几点到店
        console.log(appointmentTime)
      }
    }

    var creditFlg = "0"; //积分订单标志(字典项)：0-非积分购买；1-积分购买

    var creditPrice = ""; //积分订单价格

    var discountId = this.data.discountId; //优惠活动ID

    var orderMenuJson = []; //订单详细信息
    var cart = wx.getStorageSync("cart");
    console.log(cart)
    var good = {};
    var wxCardId = []; //使用的卡券ID(List)
    var cardOrderCode = []; //使用的卡券的code(List)
    for (var i = 0; i < cart.length; i++) {
      console.log(cart[i].cardordercode)
      if (cart[i].cardordercode != undefined) {
        wxCardId.push(cart[i].wxcardid)
        cardOrderCode.push(cart[i].cardordercode)
      } else {
        var orderItemList = [];
        var dishesItemId = cart[i].dishesItemId + "";
        console.log(dishesItemId)
        if (dishesItemId.indexOf(",") != -1) {
          var itemIdList = cart[i].dishesItemId.split(',');
          var menuNameList = cart[i].menuNameList;
          for (var x = 0; x < itemIdList.length; x++) {
            var orderItem = {
              "dishes_item_id": itemIdList[x], //单品ID 
              "item_name": menuNameList[x], //单品名称 
              "dishes_item_price": "" //单品价格 
            }
            orderItemList.push(orderItem)
          }

        } else {
          if (cart[i].combMenuName != ''){
            var orderItem = {
              "dishes_item_id": cart[i].dishesItemId, //单品ID 
              "item_name": cart[i].combMenuName, //单品名称 
              "dishes_item_price": cart[i].price //单品价格 
            }
          }else{
            var orderItem = {
              "dishes_item_id": cart[i].dishesItemId, //单品ID 
              "item_name": cart[i].name, //单品名称 
              "dishes_item_price": cart[i].price //单品价格 
            }
          }
          
          orderItemList.push(orderItem)
        }

        good = {
          "dishes_menu_id": cart[i].goodid, //菜品ID 
          "menu_name": cart[i].name, //菜品名称 
          "menu_price": cart[i].price, //菜品价格 
          "menu_num": cart[i].goodNum, //菜品数量 
          "order_item": orderItemList
        }
        orderMenuJson.push(good)
      }
    }
    console.log(orderMenuJson)
    console.log(wxCardId)
    console.log(cardOrderCode)
    // return false;
    var that = this;
    var host = app.globalData.host;
    wx.request({
      url: host + '/catering/Routine/InsertTheNewRoder',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        restaurantId: restaurantId, //餐厅ID

        orderPrice: orderPrice, //订单价格

        payment1: payment1, //付款方式（字典项）0:微信支付,1:支付宝支付,2:现金支付

        payment2: payment2, //付款方式（字典项）0:微信支付,1:支付宝支付,2:现金支付

        payment1Price: payment1Price, //付款方式1金额

        payment2Price: payment2Price, //付款方式2金额

        createTime: createTime, //创建时间

        clientFrom: clientFrom, //订单来源（字典项）：0-微信小程序，1-收银机,3-外卖订单

        customerId: customerId, //订单状态（字典项）：0-取消订单，1-已支付订单

        diningWay: diningWay, //就餐方式（字典项）：0-堂食；1-打包带走

        appointmentTime: appointmentTime, //预约几点到店

        creditFlg: creditFlg, //积分订单标志(字典项)：0-非积分购买；1-积分购买

        creditPrice: creditPrice, //积分订单价格

        discountId: discountId, //优惠活动ID

        orderMenuJson: JSON.stringify(orderMenuJson), //订单详细信息

        appointmentFlg: appointmentFlg, //预约标志（字典项）：0-非预约；1-预约

        wxCardId: wxCardId, //预约标志（字典项）：0-非预约；1-预约

        cardOrderCode: cardOrderCode, //预约标志（字典项）：0-非预约；1-预约

        seat: seat, //座位号
        formId: formId//通知id
      },
      success: function(res) {

        wx.hideLoading()
        console.log(res)
          
          var timestamp = new Date().getTime() + '';
          var resdata = res.data.res;
          if (res.data.status == 1) {
            var orderCode1 = res.data.res.result.orderCode;
            var orderNum1 = res.data.res.result.orderNum;
            var creditNum = res.data.res.creditNum;
            wx.requestPayment({
              'timeStamp': res.data.res.timeStamp,
              'nonceStr': res.data.res.nonce_str,
              'package': 'prepay_id=' + res.data.res.prepay_id,
              'signType': 'MD5',
              'paySign': res.data.res.sign,
              'success': function (res) {
                console.log(res)
                wx.clearStorage('allGoods')
                wx.clearStorage('cart')
                that.InsertTheNewRoder(orderCode1, orderNum1, creditNum);
                var orderData1 = JSON.stringify(resdata.order[0])
                wx.redirectTo({
                  url: '/pages/shopcarpayfinish/shopcarpayfinish?orderData=' + orderData1
                })
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                })
              },
              'complete': function (res) {
                console.log(res)
              }
            })

          } else if (res.data.status == 4) {
            wx.clearStorage('allGoods')
            wx.clearStorage('cart')
            var orderData = JSON.stringify(res.data.res.order[0])
            wx.redirectTo({
              url: '/pages/shopcarpayfinish/shopcarpayfinish?orderData=' + orderData
            })
          } else if (res.data.status == 2){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
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
          }else {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
          }
          
      },
      complete: function(res) {
        wx.hideLoading()
      }
    })

  },
  //支付完成查询通知后台
  InsertTheNewRoder(orderCode, orderNum, creditNum) {
    var host = app.globalData.host;
    wx.request({
      url: host + '/catering/Routine/InsertTheNewRoderSuccess',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderCode: orderCode,
        payTF: "T"
      },
      success: function(res) {
        // wx.clearStorage('allGoods')
        // wx.clearStorage('cart')
        // wx.navigateBack({
        //   delta: 1
        // })
        // wx.showToast({
        //   title: '支付成功',
        //   icon: 'success',
        //   duration: 2000
        // })
      },
      complete: function(res) {
        console.log(res)
        wx.clearStorage('allGoods')
        wx.clearStorage('cart')
        // wx.navigateBack({
        //   delta: 1
        // })
        // wx.showToast({
        //   title: '支付成功',
        //   icon: 'success',
        //   duration: 2000
        // })
        // wx.showModal({
        //   title: '提示',
        //   content: '您的取餐号为：' + orderNum + '\n获得积分:' + creditNum,
        //   showCancel: false,
        //   confirmText: '知道了',
        //   success(res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定')
        //     } else if (res.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })
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