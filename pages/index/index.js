// index.js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

Page({
  data: {
    imageUrl: '',
    output:'',
    divstyle: 'height: 2rpx;width: 90%;background-color: grey;margin-bottom: 15rpx;display: none;',
    usercode: ''
  },
  onLoad: function () {
    try{
      var code = wx.getStorageSync('userCode')
      if(code)
      {
        this.setData({
          usercode : code
        })
      }}
    catch(e){}
  },
  chooseImage: function () {
    var that = this;
    try{
      var code = wx.getStorageSync('userCode')
      if(code)
        that.setData({
          usercode: code
        })
    }
    catch(e){
      console.log(e)}
    if(that.data.usercode == "")
    {
      wx.showToast({
        title: '请先登录',
        icon: 'error',

      })
      return
    }
    wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 30,
        camera: 'back',
        success(res) {
            wx.cropImage({
            cropScale: '1:1',
            src: res.tempFiles[0].tempFilePath,
            success(res){
            wx.getFileSystemManager().readFile({
              filePath: res.tempFilePath,
              encoding: "base64",
              success(res){
                that.setData({
                  divstyle: "height: 2rpx;width: 90%;background-color: grey;margin-bottom: 15rpx;",
                  output: "加载中..."
                })

                wx.request({
                  url: 'http://124.220.237.75:8888/api/app/recognition',
                  method: 'POST',
                  header:{
                    'Authorization': 'Bearer ' + that.data.usercode
                  },
                  data:{
                    'img': res.data
                    },
                  success(res){
                    // console.log(res)
                    const Outmd = md.render(res.data.data)
                    that.setData({
                        output: Outmd
                    })
                    },
                  fail(res){
                    console.log(res)
                  }
                })
                }
            })
            that.setData(
                {imageUrl: res.tempFilePath}
                )

            }
            })


        }
        })
  }
})
