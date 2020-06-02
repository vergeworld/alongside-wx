const db = wx.cloud.database();
Page({
  data: {
    codeImg: ['/images/post/qq.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  tel: function () {
    wx.makePhoneCall({
      phoneNumber: '13237707669',
    })
  },
  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.codeImg // 需要预览的图片http链接列表
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})