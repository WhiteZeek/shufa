Page({
  data: {},
  onLoad: function (options) {},
  goToRegister: function () {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  wxLogin: function () {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 发送res.code到后台换取openId, sessionKey, unionId
          console.log('微信code:', res.code)
          // 此处后端API进行登录验证
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
