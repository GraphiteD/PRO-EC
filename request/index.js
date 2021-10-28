
// 同时发送异步代码的次数
let ajaxTimes=0;
export const request=(params)=>{
    // 判断Url中是否带有/my/ 请求的是私有的路径 带上header token
    let header={...params.header};
    if(params.url.includes("/my/")){
        // 拼接Header 带上token
        header["Authorization"]=wx.getStorageSync("token");
          
    }


    ajaxTimes++;
    return new Promise((resolve,reject)=>{

        // 显示加载中
        wx.showLoading({
            title: '加载中',
            mask: true
        });


          
        // 定义公共url
        // url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"
        const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
        wx.request({
            ...params,
            header:header,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result.data.message);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes===0){
                // 关闭正在等待的图标
                 wx.hideLoading();
                }

            }
        });        
    })
}