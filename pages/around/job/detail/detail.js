const db = wx.cloud.database();
Page({
  data: {
  },
  onLoad: function (e) {
    var id = e.id
    var that = this
    db.collection('job').doc(id).get({
      success(res) {
        that.setData({
          postList: res.data
        })
      },
      fail(err) {
          that.setData({
            loadImg: '/images/post/3.4.png',
            loadTxt: '网络似乎出了点问题~'
          })
      }
    })
    db.collection("_swiper").get({
      success(res) {
        var jobImg = res.data[0].around.job.join_img
        that.setData({
          jobImg
        })
      }
    })
  },

  join(){
    wx.navigateTo({
      url: '../../job/join/join',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})