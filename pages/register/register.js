// register.js
var app = getApp()
Page({
  data: {
    username: '',
    password: '',
    confirmPassword: ''
  },
  onLoad: function (options) {},
  inputUsername: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  inputPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  inputConfirmPassword: function (e) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },
  register: function () {
    if(this.data.username == '' || this.data.password == ""){
        wx.showToast({
          title: '邮箱或密码不能为空',
          icon: 'none',
          duration: 2000
        })
        return false
    }
    if(!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(this.data.username)){
        wx.showToast({
          title: '邮箱格式不正确',
          icon: 'none'
        })
        return false
    }
    wx.request({
      url: '',//
      method: 'POST',
      data:{
          user:this.data.username,
          pwd: this.data.password
      },
      header:{
        //
      },
      success: res => {
          console.log(res);
      },
      fail: err => {
          console.log(err); // 密码错误/...
      }
    })
    console.log('注册信息：', this.data)
    wx.showToast({
      title: '注册成功',
      icon: 'success',
      duration: 2000
    })
    // 注册成功后返回上一页
    setTimeout(() => {
      wx.navigateBack()
    }, 2000)
  },
  wxLogin: function () {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 发送res.code到后台换取openId, sessionKey, unionId
          console.log('微信code:', res.code)
          wx.request({
            url: 'http://124.220.237.75:8888/api/auth/login',
            method: 'POST',
            header:{},
            data:{
              'code': res.code
            },
            success: (res) => {    
              if (res.data.code == "200"){
                wx.setStorage({
                  key: "userCode",
                  data: res.data.data
                })
                // wx.getStorage({
                //   key: 'userCode',
                //   success(res){
                //     console.log(res)
                //   }
                // })
              }
            },
            
          })
          app.globalData.isLogin = true
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        } else {
          console.log(res.errMsg)
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'error',
            duration: 2000
          })
        }
      }
    })
  }
})
