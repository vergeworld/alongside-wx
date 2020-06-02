const db = wx.cloud.database();
Page({
  data: {},
  onLoad: function () {
    var that = this;
    db.collection("job").orderBy('time', 'desc').get({
      success(res) {
        that.setData({
          postjob: res.data,
          page: 0
        })
      },fail(err){
        wx.showToast({
          title: '网络开小差啦~',
        })
      }
    })
    db.collection("_swiper").get({
      success(res) {
        var post = res.data[0].around.job
        that.setData({
          imgsPath: post.job_img,
          notice: post.notice
        })
      }
    })
  },

  job: function (e) {
    const _ = db.command
    var postId = e.currentTarget.dataset.id
    db.collection('job').doc(postId).update({
      data: {
        read: _.inc(1)
      }
    })
    wx.navigateTo({
      url: '../../around/job/detail/detail?id=' + postId,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var top = this.data.top
    if (top == '') {
      that.onLoad();
    }
  },

  // 触底刷新
  onReachBottom: function (res) {
    var that = this
    let page = that.data.page + 20;
    db.collection('recruit').orderBy('time', 'desc').skip(page).get().then(res => {
      let new_data = res.data
      let old_data = that.data.postjob
      var postjob = that.data.postjob
      postjob = old_data.concat(new_data)
      that.setData({
        postjob,
        page
      })
    })
  },

  onPageScroll(e) {
    this.setData({
      top: e.scrollTop
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})