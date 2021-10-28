import { request } from "../../request/index.js";
// import regeneratorRuntime from "../../lib/runtime/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单数据
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],
    //被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容滚动条距离顶部的距离
    scrollTop: 0,
  },
  //接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    0 web中的本地存储与小程序中的本地存储的区别
      1 代码方式不同
        web:localStorage.setItem("key","value") localStorage.getItem("key")
        小程序:wx.setstorageSync("key","value") wx.getstorageSync("key")
      2 存的时候有没有做类型转换
        web:不管存入的是什么类型的数据，最终都会先调用一下toString()，把数据变成字符串再存入
        小程序:不存在类型转换这个操作，什么类型存进去读出来就是什么类型
    1 判断本地存储中有没有旧数据
      {time:Data.now(),data:[...]}
    2 没有旧数据 直接发送新请求
    3 又旧数据 同时旧数据也没有过期 就是用本地数据即可
    */

    // 1 获取本地存储中的数据 （小程序中也是存在本地存储技术的）
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    } else {
      // 有旧数据 定义过期时间 10s 改成 5min
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧数据
        this.Cates = Cates.data;
        //构造左侧大菜单数据
        let leftMenuList = this.Cates.map((v) => v.cat_name);
        //构造右侧商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent,
        });
      }
    }
  },
  //获取分类数据
  async getCates() {
    // request({
    //   url:"/categories"
    // })
    // .then(res => {
    //   this.Cates=res.data.message;

    //   // 把接口数据存入到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //   //构造左侧大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   //构造右侧商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1使用es7的async await发送请求
    const res = await request({ url: "/categories" });
    this.Cates = res;
    // 把接口数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //构造左侧大菜单数据
    let leftMenuList = this.Cates.map((v) => v.cat_name);
    //构造右侧商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent,
    });
  },
  //左侧菜单的点击事件
  handleItemTap(e) {
    /*  
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值
    3 根据不同索引来渲染右侧的商品内容
    */
    const { index } = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;

    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容的scroll-view标签距离顶部的距离
      scrollTop: 0,
    });
  },
});
