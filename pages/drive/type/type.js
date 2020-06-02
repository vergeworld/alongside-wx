const db = wx.cloud.database();
Page({
  // 页面的初始数据
  data: {
    classList: [],
  },
  // 生命周期函数--监听页面加载
  onLoad: function (e) {
    var id = e.id
    var num = e.num
    var that = this;
    db.collection("drive").doc(id).get({
      success(res) {
        var classList = that.data.classList
        classList[0] = res.data.classList[num]
        var sign = res.data.sign
        that.setData({
          classList,
          sign,
          id,
        })
      },
      fail(err) {
        that.setData({
          loadImg: '/images/post/3.4.png',
          loadTxt: '网络似乎出了点问题~'
        })
      }
    })
  },
  sign(e) {
    var id = this.data.id;
    wx.navigateTo({
      url: '../../drive/signup/signup?id=' + id,
    })
  }
})