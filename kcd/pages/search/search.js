const app = getApp()
Page({
  data: {
    listHeight: app.globalData.windowHeight,
    scrollY: true,
    restaurantMenuId:'',
    inputValue:'',
    serchgood:'',//搜索商品列表
    allGoods: '',
    display: "none",
    cartShow: "none",
    totalPrice: 0, // 总价格
    totalCount: 0, // 总商品数
    title: '', //餐厅名称
    address: '', //餐厅具体地址
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      restaurantMenuId: options.restaurantMenuId,
      title: options.title,
      address: options.address
    })
   
    this.address(options.restaurantMenuId,'')
  },
  onShow(){
    this.syccart()
    app.globalData.isserch=1
    console.log(this.data.restaurantMenuId)
  },
  // onReady: function() {
  //   this.syccart()
  // }, 
 
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    var restaurantMenuId = this.data.restaurantMenuId;
    var inputValue = this.data.inputValue;
    console.log(restaurantMenuId)
    console.log(inputValue)
    this.address(restaurantMenuId, inputValue)
  },
  address(restaurantMenuId, dishesMenuName) {
    console.log(app.globalData.host)
    var that = this;
    var host = app.globalData.host;
    var url = "/catering/Routine/SelectTheMenuForMSIDim"
    console.log(host + url)
    console.log(this.data.latitude)
    wx.request({
      url: host + url,
      data: {
        restaurantMenuId: restaurantMenuId,
        dishesMenuName: dishesMenuName,
        unionid: app.globalData.unionid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: this.aa.bind(this)
    })
  },
  aa(res) {
    console.log(res)
    var serchgood = res.data.res.result.allGoods;
    this.setData({
      allGoods: serchgood
    })
    console.log(serchgood)
    //  this.syccart()
    var allGoods1 = this.data.allGoods
    var cart = wx.getStorageSync("cart");
    if(cart){
      for (var i = 0; i < allGoods1.length; i++) {
        for (var j = 0; j < allGoods1[i].goods.length; j++) {
          for (var x = 0; x < allGoods1[i].goods[j].operation.length; x++) {
            for (var h = 0; h < cart.length; h++) {
              if (cart[h].dishesItemId == allGoods1[i].goods[j].operation[x].dishesItemId && cart[h].operationid == allGoods1[i].goods[j].operation[x].dishesButtonId && cart[h].goodid == allGoods1[i].goods[j].operation[x].dishesMenuId) {
                allGoods1[i].goods[j].operation[x].goodNum = cart[h].goodNum
              }
            }
          }
        }
      }
      this.setData({
        allGoods: allGoods1
      })
    }
    
  },
  navBack(){
    wx.navigateBack({
      delta: 1
    })
  },

  //增加商品数量
  addCount(e) {
    // console.log(e)
    var _typeid = e.currentTarget.dataset.typeid;
    var _goodid = e.currentTarget.dataset.goodid;
    var _index = e.currentTarget.dataset.index;
    var types = e.currentTarget.dataset.types;
    // console.log(types)
    if (types == "add" || types == "half") {
      // console.log("我是愿数组")
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
        types: typ,
        dishesItemId: dishesItemId,
        combMenuName: combMenuName,
        xiaoji: xiaoji,
        menuNameList: menuNameList,
        shopid: shopid
      };
      var arr = wx.getStorageSync('cart') || []
      var f = false;
      if (arr.length > 0) {

        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          if (arr[j].goodid == goodid) {
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
      // console.log(arr)
      if (arr.length > 0) {

        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          // console.log(arr[j].goodid)
          // console.log(e.currentTarget.dataset.goodsid)
          if (arr[j].goodid12 == e.currentTarget.dataset.goodsid) {
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
    //  wx.setStorageSync('allGoods', this.data.allGoods)
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
  removeByValue: function (array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].operationid == val) {
        array.splice(i, 1);
        break;
      }
    }
  },
  removeByValue1: function (array, val) {
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
  //添加卡券到购物车
  addCard(e) {
    console.log(e)
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

    var goodNum = this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum++;
    goodNum = 1;
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
      xiaoji:xiaoji
    };
    arr.push(obj);

    this.setData({
      carArray: arr,
      //isclass:!this.isclass,
      //cardordercode: cardordercode,     
      allGoods: this.data.allGoods
    })
    console.log(this.data.allGoods)
    // for(var i=0;i<arr.length;i++){
    //   if (arr[i].cardordercode && arr[i].cardordercode == cardordercode){
    //     console.log(arr[i].cardordercode)
    //     this.setData({
    //          pageBackgroundColor:"#ccc",
    //          color:"#fff"
    //        })
    //   }
    // }
    // if (cardordercode == this.data.cardordercode){
    //       this.setData({
    //         pageBackgroundColor:"#ccc",
    //         color:"#fff"
    //       })
    // }
    try {
      wx.setStorageSync('cart', arr)
      //wx.setStorageSync('allGoods', this.data.allGoods)
    } catch (e) {
      console.log(e)
    }
    this.calTotalPrice();
    if (goodNum > 0) {
      this.setData({
        cartShow: 'block'
      })
    }
  },
  // 减少数量
  minusCount(e) {
    var _typeid = e.currentTarget.dataset.typeid;
    var _goodid = e.currentTarget.dataset.goodid;
    var _index = e.currentTarget.dataset.index;
    var types = e.currentTarget.dataset.types;
    console.log(e)
    if (types == "add" || types == "half") {
      console.log("我是愿数组")
      this.data.allGoods[_typeid].goods[_goodid].operation[_index].goodNum--;
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
        combMenuName: combMenuName
      };
      // var carArray1 = this.data.carArray.filter(item => item.mark != mark)
      // console.log(carArray1)
      // carArray1.push(obj)
      var arr = wx.getStorageSync('cart') || []
      var f = false;
      if (arr.length > 0) {

        for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
          if (arr[j].dishesItemId == dishesItemId && arr[j].operationid == operationid && arr[j].goodid == goodid) {
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


          else if (arr[j].cardordercode !=undefined && arr[j].cardordercode == cardOrderCode) {
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
          // console.log(arr[j].goodid)
          // console.log(e.currentTarget.dataset.goodsid)
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
      // wx.setStorageSync('allGoods', this.data.allGoods)
    } catch (e) {
      // console.log(e)
    }

    this.calTotalPrice();
  },
  //计算总价
  calTotalPrice: function () {
    var carArray = this.data.carArray;
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
  },
  //获取商品缓存信息
  syccart() {
    //缓存
    var cart = wx.getStorageSync("cart");
    var allGoods1 = wx.getStorageSync("allGoods");
    console.log(allGoods1)
    if (cart) {
      this.setData({
        carArray: cart,
        allGoods: allGoods1,
        // display:"block",
        // cartShow:"block"

      })
      console.log(this.data.carArray)
      console.log(this.data.allGoods)
      for (var i = 0; i < this.data.carArray.length; i++) {
        if (this.data.carArray[i].goodNum > 0) {
          console.log(1)
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
  },
  //获取商品缓存信息
  // syccart() {
  //   //缓存
  //   var cart = wx.getStorageSync("cart");
  //   var allGoods1 = wx.getStorageSync("allGoods");
  //   // console.log(cart)
  //   var allGoods = this.data.allGoods
  //   if (cart) {
  //     console.log("存在缓存并且不为空")
  //     this.setData({
  //       carArray: cart,
  //       // allGoods: allGoods1
  //     })
  //     console.log(this.data.carArray)
  //     console.log(this.data.allGoods)
  //     var h = this.data.carArray
  //     for (var i = 0; i < this.data.carArray.length; i++) {
  //       if (this.data.carArray[i].goodNum > 0) {

  //         this.setData({
  //           cartShow: 'block'
  //         })
  //         this.calTotalPrice()
  //       }
  //       console.log(h[i].goodid1)
  //       if (h[i].goodid1 != undefined) {
  //         console.log("我只行了方法")
  //         allGoods[h[i].typeid1].goods[h[i].goodid1].operation[h[i].index].goodNum = h[i].goodNum
  //       }
  //       this.setData({
  //         allGoods: allGoods
  //       })
  //     }
  //   } else {
  //     // console.log('缓存不存在')
  //     this.setData({
  //       cartShow: 'none',
  //       // display:"none"
  //     })
  //   }
  //   if (cart && cart.length == 0) {
  //     this.setData({
  //       cartShow: 'none',
  //       display: "none"
  //     })
  //   }
  //   // if (allGoods1) {
  //   //   console.log("我是存在的缓存")
  //   //   try {
  //   //     //wx.setStorageSync('cart', arr)
  //   //     wx.setStorageSync('allGoods', allGoods1)
  //   //   } catch (e) {
  //   //     console.log(e)
  //   //   }
  //   // } else {
  //   //   try {
  //   //     //wx.setStorageSync('cart', arr)
  //   //     wx.setStorageSync('allGoods', this.data.allGoods)
  //   //   } catch (e) {
  //   //     console.log(e)
  //   //   }
  //   // }
  // },
  //清空购物车
  clearcar(e) {
    console.log(e)
    var carArray = this.data.carArray;
    var allgoods = this.data.allGoods;
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
  // 显示购物车内容
  showview: function () {
    var that = this;
    var display = that.data.display === 'none' ? 'block' : 'none';
    that.setData({
      display: display
    })
  },
  hideview: function () {
    this.setData({
      display: "none"
    })
  },
  // 穿透
  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
  },
  //跳转到支付页面
  gotopay() {
    var totleprice = this.data.totalPrice
    var title = this.data.title;
    var address = this.data.address;
    getCurrentPages().pop();
    wx.navigateTo({
      url: '../shopcarpay/shopcarpay?totleprice=' + totleprice + '&title=' + title + '&address=' + address + ''
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