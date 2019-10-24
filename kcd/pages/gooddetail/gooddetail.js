const app = getApp()
Page({
  data: {
    autoplay: false,
    interval: 5000,
    duration: 200,
    unitPrice: 0,
    goodsNum: 1,
    goodList: "",
    chooseGood: [],
    goodname: '',
    carArry1: [],
    allGoods: '',
    goodtype: '',
    gid: '',
    cid: '',
    idx:''
  },
  onLoad: function(options) {
    //this.custom()
    console.log(app.globalData.restaurantMenuId)
    console.log(options.goodsid)
    var that = this;
    var swiperid = '';
    var host = app.globalData.host;
    console.log(options)
    if (options.pri) {
      swiperid = options.swiperid;
      that.setData({
        goodname: options.title,
        goodtype: options.typ,
        gid: options.goodsid,
        cid: options.cid,
        goodsNum: options.pri,
        idx: options.idx
      })
      console.log(options.idx)
    } else {
      that.setData({
        goodname: options.title,
        goodtype: options.typ,
        gid: options.goodsid,
        cid: options.cid,
        idx:  options.idx
      })
      console.log("我是pri不存在")
    }

    var url = "/catering/Routine/SelectTheCustomizationMenu";
    wx.request({
      url: host + url,
      data: {
        dishesMenuId: options.goodsid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res)
        var list = res.data.res.result;
        var chooseGood = [];
        for (var i = 0; i < list.length; i++) {
          if (i == list.length-1){
            for (var x = 0; x < list[i].goods.length; x++){
              chooseGood[i] = 0;
              if (swiperid == list[i].goods[x].goodId){
                chooseGood[i] = x;
                break;
              }
            }
          }else{
            chooseGood[i] = 0;
          }
          
        }
        console.log(chooseGood)
        that.setData({
          goodList: list,
          chooseGood: chooseGood
        })
        console.log(that.data.chooseGood)
        that.countUnitPrice()
      }
    })

  },
  onReady: function() {
    this.countUnitPrice()
  },
  onShow: function() {
    console.log("显示")
    this.countUnitPrice()
  },
  swiperChange(e) {
    console.log(e)
    var listIdx = e.currentTarget.dataset.idx;
    var goodIdx = e.detail.currentItemId;
    var chooseGood = this.data.chooseGood;
    chooseGood[listIdx] = goodIdx;
    this.setData({
      chooseGood: chooseGood
    })
    this.countUnitPrice()
  },
  countUnitPrice() {
    var unitPrice = 0;
    var chooseGood = this.data.chooseGood;
    var goodList = this.data.goodList;
    for (var i = 0; i < chooseGood.length; i++) {
      unitPrice += Number(goodList[i].goods[chooseGood[i]].price);
    }
    this.setData({
      unitPrice: unitPrice
    })
  },
  addCount(e) {
    var goodsNum = parseInt(this.data.goodsNum);
    console.log(typeof goodsNum)
    
    goodsNum += 1;
    this.setData({
      goodsNum: goodsNum
    })
  },
  // 减少数量
  minusCount(e) {
    var goodsNum = this.data.goodsNum;
    if (goodsNum > 1) {
      goodsNum -= 1;
    }
    this.setData({
      goodsNum: goodsNum
    })
  },
  navBack() {
    //var cart = wx.getStorageSync("cart");
    var cart = wx.getStorageSync('cart') || []
    console.log(cart)
    console.log(this.data.chooseGood)
    console.log(this.data.chooseGood[2])
    console.log(this.data.goodList)
    var allgood = this.data.goodList
    var mainfood = allgood[0].goods[0].text
    var goodid = 'a' + allgood[0].goods[0].goodId + 'b' + allgood[1].goods[0].goodId + 'c' + allgood[2].goods[this.data.chooseGood[2]].goodId;
    var smallfood = allgood[1].goods[0].text;
    var drink = allgood[2].goods[this.data.chooseGood[2]].text;
    var unitPrice = this.data.unitPrice
    var subtitle = mainfood + "+" + smallfood + "+" + drink
    console.log(this.data.goodname)
    var goodname = this.data.goodname;
    var types = this.data.goodtype;
    var goodNum = this.data.goodsNum;
    var gid = this.data.gid;
    var drinkid = allgood[0].goods[0].goodId;
    var swiperid = allgood[2].goods[this.data.chooseGood[2]].goodId
    console.log(swiperid)
    var zhushiid = allgood[0].goods[0].goodId
     var xiaoshiid = allgood[1].goods[0].goodId
    // var yinliaoid = allgood[2].goods[this.data.chooseGood[2]].goodId
    var dishesItemId =""+zhushiid+","+xiaoshiid+","+swiperid+""
    console.log(dishesItemId)
    var xiaoji = unitPrice * goodNum

    xiaoji = parseFloat(xiaoji).toFixed(1)//计算单品的价值总和
    var menuNameList = [];
    menuNameList.push(mainfood, smallfood, drink)
    var shopid = app.globalData.restaurantMenuId
    var obj = {
      price: unitPrice,
      goodid12: goodid,
      name: goodname,
      combMenuName: subtitle,
      goodNum: goodNum,
      types: types,
      subtitle: subtitle,
      goodid: gid,
      drinkid: drinkid,//主食id
      swiperid: swiperid,//饮料id
      zhushiid: zhushiid,//主食id
      xiaoshiid: xiaoshiid,//小食id
      dishesItemId: dishesItemId,
      xiaoji:xiaoji,
      menuNameList:menuNameList,
      shopid: shopid
      // yinliaoid: yinliaoid,
      // index: 0,
      // typeid1: 0,
      // goodid1: 0,
    }


    // var carArray2 = this.data.carArray1.filter(item => item.goodid != goodid)
    // console.log(carArray1)
    // carArray2.push(obj)
    // this.setData({
    //   carArray1: carArray2
    // })
    // cart.push(this.data.carArray1)
    // wx.setStorageSync('cart', cart)
    var f = false;
    if (cart.length > 0) {
      console.log(111)
      for (var j in cart) { // 遍历购物车找到被点击的菜品，数量加1
        if (cart[j].goodid12 == goodid) {
          cart[j].goodNum += goodNum;
          cart[j].xiaoji = parseFloat(cart[j].goodNum * cart[j].price).toFixed(1)
          console.log(222)
          f = true;
          try {
            wx.setStorageSync('cart', cart)
          } catch (e) {
            console.log(e)
          }
        }
      }
      if (!f) {
        console.log(cart)
        cart.push(obj);
      }
    } else {
      
      cart.push(obj)
      console.log(cart)
    }
    try {
      wx.setStorageSync('cart', cart)
    } catch (e) {
      console.log(e)
    }

    wx.navigateBack({
      delta: 1
    })
  },
  navBackxg() {
    //var cart = wx.getStorageSync("cart");
    var cart = wx.getStorageSync('cart') || []
    console.log(cart)
    console.log(this.data.chooseGood)
    console.log(this.data.chooseGood[2])
    console.log(this.data.goodList)
    var allgood = this.data.goodList
    var mainfood = allgood[0].goods[0].text
    var goodid = 'a' + allgood[0].goods[0].goodId + 'b' + allgood[1].goods[0].goodId + 'c' + allgood[2].goods[this.data.chooseGood[2]].goodId;
    var smallfood = allgood[1].goods[0].text;
    var drink = allgood[2].goods[this.data.chooseGood[2]].text;
    var unitPrice = this.data.unitPrice
    var subtitle = mainfood + "+" + smallfood + "+" + drink
    console.log(this.data.goodname)
    var goodname = this.data.goodname;
    var types = this.data.goodtype;
    var goodNum = parseInt(this.data.goodsNum);
    var gid = this.data.gid;
    var drinkid = allgood[0].goods[0].goodId; 

    var swiperid = allgood[2].goods[this.data.chooseGood[2]].goodId
    var zhushiid = allgood[0].goods[0].goodId
    var xiaoshiid = allgood[1].goods[0].goodId
    // var yinliaoid = allgood[2].goods[this.data.chooseGood[2]].goodId
    console.log(unitPrice)
    var dishesItemId = "" + zhushiid + "," + xiaoshiid + "," + swiperid + ""
    console.log(dishesItemId)
    var xiaoji = unitPrice * goodNum
    xiaoji = parseFloat(xiaoji).toFixed(1)//计算单品的价值总和
    
      
      var menuNameList = [];
    menuNameList.push(mainfood, smallfood, drink)
      console.log(menuNameList)
    var shopid = app.globalData.restaurantMenuId
    var obj = {
      price: unitPrice,
      goodid12: goodid,
      name: goodname,
      combMenuName: subtitle,
      subtitle: subtitle,
      goodNum: goodNum,
      types: types,
      xiaoji:xiaoji,
      goodid: gid,
      drinkid: drinkid,
      swiperid: swiperid,
      zhushiid: zhushiid,
      xiaoshiid: xiaoshiid,
      dishesItemId: dishesItemId,
      menuNameList: menuNameList,
      shopid: shopid
      // yinliaoid: yinliaoid,
      // index: 0,
      // typeid1: 0,
      // goodid1: 0,
    }


    // var carArray2 = this.data.carArray1.filter(item => item.goodid != goodid)
    // console.log(carArray1)
    // carArray2.push(obj)
    // this.setData({
    //   carArray1: carArray2
    // })
    // cart.push(this.data.carArray1)
    // wx.setStorageSync('cart', cart) 
    console.log(obj)
    var f = false;
    if (cart.length > 0) {
      console.log(111)
      for (var j in cart) { // 遍历购物车找到被点击的菜品，数量加1
        // if (cart[this.data.idx].drinkid == drinkid && cart[j].xiaoshiid == xiaoshiid ) {
        cart[this.data.idx].combMenuName = subtitle;
        cart[this.data.idx].goodNum = goodNum;
        cart[this.data.idx].swiperid = swiperid;
        cart[this.data.idx].price = unitPrice;
        cart[this.data.idx].xiaoji = parseFloat(cart[this.data.idx].goodNum * cart[this.data.idx].price).toFixed(1)
          console.log("我是修改的时候饮料相同的")
          f = true;
          try {
            wx.setStorageSync('cart', cart)
          } catch (e) {
            console.log(e)
          }
        // }
        // if (cart[this.data.idx].drinkid == drinkid && cart[j].xiaoshiid == xiaoshiid && cart[j].xiaoshiid == xiaoshiid){

        // }
      }

      if (!f) {
        console.log("我是修改套餐按钮")
        cart.push(obj);
       
      }
    } else {
      cart.push(obj)
      console.log(cart)
    }
    try {
      wx.setStorageSync('cart', cart)
    } catch (e) {
      console.log(e)
    }

    wx.navigateBack({
      delta: 1
    })
  },
  //lv获取定制列表里面的内容
  custom() {

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