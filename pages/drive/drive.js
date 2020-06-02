const db = wx.cloud.database();
Page({
  data: {
    postList: [],
    imgsPath: []
  },
  onLoad: function () {
    var that = this;
    db.collection("_swiper").get({
      success(res) {
        var imgsPath = res.data[0].drive.swiper
        db.collection("drive").orderBy('sign','desc').get({
          success(res) {
            that.setData({
              postList: res.data,
              imgsPath,
            })
          }
        })
      }
    })
  },

  // 页面监控
  onShow() {
    var imgsPath = this.data.imgsPath
    var postList = this.data.postList
    if (!imgsPath[0] && !postList[0]) {
      this.onLoad()
    }
  },

  // 详情页面
  detail: function (e) {
    var postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail/detail?id=' + postId
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})