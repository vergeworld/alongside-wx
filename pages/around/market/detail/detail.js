const db = wx.cloud.database();
var postId
Page({
  data: {
    postList: [],
    loadImg: '',
    loadTxt: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    postId = e.id
    db.collection('market').doc(postId).get({
      success(res) {
        var postList = that.data.postList
        postList[0] = res.data
        that.setData({
          postList,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})