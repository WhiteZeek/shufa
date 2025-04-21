// index.js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

Page({
  data: {
    imageUrl: '',
    output:'',
    divstyle: 'height: 2rpx;width: 90%;background-color: grey;margin-bottom: 15rpx;display: none;'
  },
  onLoad: function () {

  },
  chooseImage: function () {
    var that = this;
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
                var code = ''
                wx.getStorage({
                  key: 'userCode',
                  success(res) {
                    code = res.data
                    
                  }
                })
                console.log(code)
                wx.request({
                  url: 'http://124.220.237.75:8888/api/app/recognition',
                  method: 'POST',
                  header:{
                    'Authorization': 'Bearer ' + code
                  },
                  data:{
                    'img': res.data
                    },
                  success(res){
                    console.log(res)
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
