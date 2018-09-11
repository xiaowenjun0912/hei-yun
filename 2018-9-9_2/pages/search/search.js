// pages/search/search.js
// 导入工具函数
let tool = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 音乐地址
    musicUrl: '',
    // 歌名
    songName: "未知歌曲",
    // 歌手名
    singer: "未知歌手",
    //封面
    cover: "",
    // 歌曲的播放状态
    paused: true,
    // 搜索列表
    searchList: [],
    // 缓存数据
    history:[],
    // 搜索框的值
    key:'',

  },
  // 切换歌曲的播放状态
  togglePlay() {
    // 播放=>停
    let player = wx.getBackgroundAudioManager();
    if (player.paused == true) {
      player.play();
      this.setData({
        paused: false
      })
    } else {
      player.pause();
      this.setData({
        paused: true
      })
    }
  },
  // 搜索歌曲
  search(event) {
    console.log(event);
    let searchName = event.detail.value;
    // 调用接口获取数据
    tool.thenAjax({
      url: `/search?keywords=${searchName}`
    }).then(res => {
      console.log(res);
      this.setData({
        searchList: res.data.result.songs
      })
    })
    // 储存缓存数据使用小程序的缓存 保存数据
    // 增加到数组中
    // 保存这个数组(浏览器中的 缓存只能以字符串的格式)
    let history = this.data.history;
    history.push(searchName)
    wx.setStorage({
      key: 'history',
      data: history
    });
  },
  // 播放歌曲
  play(event) {
    // let id = event.target.dataset.id;
    let id= event.currentTarget.dataset.id;
    console.log(id);
    tool.thenAjax({
      url: `/music/url?id=${id}`
    }).then(res => {
      console.log(res);
      // 获取播放器
      let player = wx.getBackgroundAudioManager();
      // 设置url
      player.src = res.data.data[0].url;
      player.title = res.data.data[0].url;
      // 注册播放时间
      player.onPlay(()=>{
        this.setData({
          paused:player.paused
        })
      })
      // 获取歌曲的信息
      return tool.thenAjax({
        url: `/song/detail?ids=${id}`
      })
    }).then(backData => {
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
  // 删除历史记录
  deleteHistory(event){
    let index = event.target.dataset.index;
    // console.log(index);
    // 删除 data 中
    let history = this.data.history;
    history.splice(index,1);
    // console.log(history);
    this.setData({
      history
    })
    // 删除缓存中的 数据
    wx.setStorage({
      key: 'history',
      data: history
    });
  },
  // 点击选中历史记录
  selectHistory(event){
    let key =event.target.dataset.key;
    // console.log(key);
    // 设置到搜索框中
    this.setData({
      key
    })
    // 再调用一次ajax
     // 调用接口获取数据
     tool.thenAjax({
      url: `/search?keywords=${key}`
    }).then(res => {
      console.log(res);
      this.setData({
        searchList: res.data.result.songs
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    // 读取缓存数据
   let history =  wx.getStorageSync('history');
   if(history){
     this.setData({
       history
     })
   }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let app = getApp();
    // 保存数据 
    console.log(app);
    app.globalData.songName= this.data.songName;
    app.globalData.musicUrl= this.data.musicUrl;
    app.globalData.singer= this.data.singer;
    app.globalData.cover= this.data.cover;
    app.globalData.paused= this.data.paused;
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