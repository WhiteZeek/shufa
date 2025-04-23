// profile.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {
        avatarUrl: defaultAvatarUrl,
        nickName: '',
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    isLogin: getApp().globalData.isLogin,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName')
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
        isLogin: getApp().globalData.isLogin
      })
    }
    console.log(this.data.isLogin)
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goToLogin() {
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
                getApp().globalData.isLogin = true

                // wx.getStorage({
                //   key: 'userCode',
                //   success(res){
                //     console.log(res)
                //   }
                // })
              }
            },
            
          })
          var app = getApp()
          app.globalData.isLogin = true
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.setData({
              isLogin: true
            })
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
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  }
})
