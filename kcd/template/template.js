
//初始化数据
function tabbarinit() {
 return [
    
      
      
       
   
          {
            "current": 0,
            "pagePath": "/pages/home/home",
            "text": "首页",
            "iconPath": "/resourse/image/bb.png",
            "selectedIconPath": "/resourse/image/cc.png"
          },
          {
            "current": 0,
            "pagePath": "/pages/index/index",
            "text": "点餐",
            "iconPath": "/resourse/image/bb1.png",
            "selectedIconPath": "/resourse/image/cc2.png"
          },
          {
            "current": 0,
            "pagePath": "/pages/card/card",
            "text": "卡券",
            "iconPath": "/resourse/image/bb3.png",
            "selectedIconPath": "/resourse/image/cc3.png"
          },
          {
            "current": 0,
            "pagePath": "/pages/member/member",
            "text": "会员",
            "iconPath": "/resourse/image/bb4.png",
            "selectedIconPath": "/resourse/image/cc4.png"
          }
        ]
  
    

}

/**
 * tabbar主入口
 * @param  {String} bindName 
 * @param  {[type]} id       [表示第几个tabbar，以0开始]
 * @param  {[type]} target   [当前对象]
 */
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}


module.exports = {
  tabbar: tabbarmain
}