// 0 引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";

//Page Object
Page({
  data: {
    //轮播图数组
    swiperList:[],
    Hei:"340 rpx",
    // 导航数组
    catesList:[],
    // 楼层数据
    floorList:[]
  },
  imgH:function(e){
    var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度
    var imgh=e.detail.height;　　　　　　　　　　　　　　　　//图片高度
    var imgw=e.detail.width;
    var swiperH=winWid*imgh/imgw + "px"　　　　　　　　　　//等比设置swiper的高度。  即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度    ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
        Hei:swiperH　　　　　　　　//设置高度
    })
},
  //options(Object)
  // 页面开始加载就会触发
  onLoad: function(options) {
    // // 1 发送异步请求获取轮播图数据 优化的手段可以通过es6的promise来解决回调地狱问题
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   // data: {},
    //   // header: {'content-type':'application/json'},
    //   // method: 'GET',
    //   // dataType: 'json',
    //   // responseType: 'text',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message
    //     })
        
    //   }
    // });
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  // 获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"}) 
    .then(result=>{
          result.forEach((v, i) => {result[i].navigator_url = v.navigator_url.replace('main', 'index');});
          this.setData({
          swiperList:result
      })
    }) 
  },

  // 获取分类导航数据
  getCateList(){
    request({url:"/home/catitems"}) 
    .then(result=>{
          this.setData({
          catesList:result
      })
    }) 
  },

  // 获取楼层数据
  getFloorList(){
    request({url:"/home/floordata"}) 
    .then(result=>{
          result.forEach(v =>v.product_list.forEach(a =>a.navigator_url=a.navigator_url.replace('?', '/index?')))
          this.setData({
          floorList:result
      })
    }) 
  }
})
  