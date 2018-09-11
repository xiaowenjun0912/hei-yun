// pages/index/index.js
let tool = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab栏切换
    index: 0,
    // 轮播图
    banners: [],
    // 歌单
    result: [],
    // 音乐地址
    musicUrl: '',
    // 歌名
    songName: "未知歌曲",
    // 歌手名
    singer: "未知歌手",
    //封面
    cover: "",
    // 歌曲的播放状态
    paused:true,
  },
  // 点击切换tab栏
  changeTab(event) {
    // 重新修改index的值
    this.setData({
      index: event.target.dataset.index
    })
  },
  // 切换歌曲的播放状态
  togglePlay(){
    // 播放=>停
    let player = wx.getBackgroundAudioManager();
    if(player.paused==true){
      player.play();
      this.setData({
        paused:false
      })
    }else{
      player.pause();
      this.setData({
        paused: true
      })
    }
  },
  // 点击获取歌曲的url
  getUrl(event) {
    console.log(event);
    let id = event.target.dataset.id;
    // 根据id 获取音乐的url进行播放
    tool.thenAjax({
      url: `/music/url?id=${id}`
    })
    .then(backData => {
      // console.log(backData);
      this.setData({
        musicUrl: backData.data.data[0].url
      })
      // 调用微信的播放背景音乐api
      let player = wx.getBackgroundAudioManager();
      player.src = backData.data.data[0].url;

      // 手动调用play方法
      player.onPlay(()=>{
        console.log(player.paused);
        this.setData({
          paused:player.paused
        })
      })

        //获取歌曲的详情
        return tool.thenAjax({
          url:`/song/detail?ids=${id}`
        })
    })
    .then(backData=>{
      // console.log(backData);
      // 保存数据
      // 歌名
      let songName = backData.data.songs[0].al.name;
      // 歌手名
      let singer = backData.data.songs[0].ar[0].name;
      // 封面
      let cover = backData.data.songs[0].al.picUrl;

      // 设置数据
      this.setData({
        songName,
        singer,
        cover,
      })
    })
  },
  toSearch(){
      // 代码跳转
      wx.navigateTo({
        url: '/pages/search/search',
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取轮播图数据
    tool.thenAjax({
      url: '/banner'
    }).then(backData => {
      // console.log(backData)
      this.setData({
        banners: backData.data.banners
      })
      // 轮播图数据获取到了之后再去获取推荐歌单
      return tool.thenAjax({
        url: '/personalized'
      })
    }).then(backData => {
      // 推荐歌单的数据 默认后面没有加万
      backData.data.result.forEach(v => {
        let num = parseInt(v.playCount / 10000);
        // console.log(num);
        v.playCountZh = num > 1 ? (num + '万') : v.playCount;
      })
      // console.log(backData)
      this.setData({
        result: backData.data.result
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let app = getApp();
    // 保存数据 
    console.log(app);
    this.setData({
      musicUrl: app.globalData.musicUrl,
      songName: app.globalData.songName,
      singer: app.globalData.singer,
      cover: app.globalData.cover,
      paused: app.globalData.paused
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('index-onHide');
    let app = getApp();

    // 保存数据 
    app.globalData.songName = this.data.songName;
    app.globalData.singer = this.data.singer;
    app.globalData.cover = this.data.cover;
    app.globalData.paused = this.data.paused;
    app.globalData.musicUrl = this.data.musicUrl;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})