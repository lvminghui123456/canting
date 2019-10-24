const app = getApp()
Page({
  data: {
    goodList: [],
    options:{},
    nowidx:0,
    nowgoodIdx:0,
  },
  onLoad: function(options) {
    console.log(options)
    if(options){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      var info = prevPage.data.goodList[options.idx]; //取上页data里的数据也可以修改
      console.log(info)
      this.setData({
        options: options,
        goodList: info,
        nowgoodIdx: options.goodIdx,
        nowidx: options.idx
      })
    }
  },
  radioChange: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var chooseGood = prevPage.data.chooseGood; //取上页data里的数据也可以修改
    chooseGood[this.data.nowidx] = e.detail.value;
    this.setData({
      nowgoodIdx: e.detail.value
    })
    console.log(e.detail.value)
    prevPage.setData({
      chooseGood: chooseGood
    })
  },
  onReady: function() {
    
  },
  onUnload() {
    
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