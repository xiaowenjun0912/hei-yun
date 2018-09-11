//app.js
App({
  onLaunch: function () {
  //  判断网络状态
  wx.getNetworkType({
    success: (res)=> {
      // console.log(res);
      if(res.networkType=='none'){
        wx.showToast({
          title: '小肖提示你没有网络',
          icon:'none',
          duration:3500,
          mask:false,
        });
      }else if(res.networkType!='wifi'){
        wx.showToast({
          title: '小肖提示你正在使用流量请注意Thanks♪(･ω･)ﾉ',
          icon: 'none',
          duration: 3500,
          mask: false,
        });
      }
    }
  });
  // 注册网络改变时间
  wx.onNetworkStatusChange((res)=>{
      console.log('res'+22);
      wx.showToast({
        title: '小肖提示你你当前的网络为:'+res.networkType,
        icon: 'none',
        duration: 3500,
        mask: false,
      });
  });
  },
  globalData: {
    userInfo: null,
  }
})