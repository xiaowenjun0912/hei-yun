function thenAjax(opt){
  return new Promise((resolve,reject)=>{
    // 在对象内部 进行异步操作 
    // 根据结果调用 resolve 和reject即可
    wx.request({
      url:  'https://autumnfish.cn'+opt.url,
      data:  opt.data|| '',
      header:  opt.header|| { 'content-type': 'application/json' },
      method:  opt.method|| 'GET',
      dataType:  opt.dataType|| 'json',
      responseType:  opt.responseType|| 'text',
      success: resolve,
      fail:reject,
      complete:()=>{}
    });
  })
}

module.exports = {
  thenAjax
}
