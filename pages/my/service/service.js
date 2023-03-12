Page({
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      qrCode: wx.getStorageSync('source').my.service.QRcode
    })
  },


  // 点击查看图片
  preview() {
    var img = []
    img[0] = this.data.qrCode;
    wx.previewImage({
      urls: img,
    })
  },



})