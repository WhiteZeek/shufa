// index.js
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

Page({
  data: {
    imageUrl: '',
    output:''
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
                    output: "加载中..."
                })
                wx.request({
                  url: 'http://47.100.36.46:8888/recognition',
                  method: 'POST',
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
            console.log(res.tempFiles[0].tempFilePath)// 上传的图像url
            console.log(res.tempFiles[0].size)

            }
            })


        }
        })
  }
})
