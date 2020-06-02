const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  pay() {
    var body = '送水上门';
    var fee = '2';
    var timestamp = Math.round(new Date());
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        body: body,
        fee: fee,
        order: timestamp,
      },
      success(res) {
        var payData = res.result;
        wx.requestPayment({
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: 'MD5',
          paySign: payData.paySign,
          success(res) {},
          fail(res) {}
        })
      },
      fail(err) {
        wx.showToast({
          title: '支付失败',
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})