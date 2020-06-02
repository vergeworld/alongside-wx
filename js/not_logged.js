function not_logged() {
  wx.showToast({
    title: '您还未登录,将跳转到登陆界面~',
    icon: 'none',
    duration: 2000
  })
  setTimeout(() => {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }, 3000)
};

//转化成小程序模板语言 这一步非常重要 不然无法正确调用
module.exports = {
  not_logged: not_logged
};