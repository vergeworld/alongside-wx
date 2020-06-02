const db = wx.cloud.database();
var util = require("../../../../utils/util.js");
var up = require('../../../../js/compressed.js')
var sy = require('../../../../js/system.js')
Page({
  data: {
    sendMoreMsgFlag: false,
    deleteIndex: -1,
    currentAudio: '',
    commentList: [],
    ons: []
  },
  //事件处理函数
  onLoad: function (e) {
    sy.system(446,this)
    var name = wx.getStorageSync('name');
    var url = wx.getStorageSync('img')
    var postId = e.id
    this.setData({
      name,
      url,
      postId
    })
  },

  //显示 选择照片、拍照等按钮
  sendMoreMsg: function () {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },

  // 选择并上传图片
  chooseImage(event) {
    var num = 3;
    var route = 'shop/comment/';
    var ons = this.data.ons;
    up.chooseImage(event, ons, num, route, this)
  },

  //删除已经选择的图片
  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx,
      that = this;
    that.setData({
      deleteIndex: index
    });
    that.data.chooseFiles.splice(index, 1);
    that.data.ons.splice(index, 1);
    setTimeout(function () {
      that.setData({
        deleteIndex: -1,
        chooseFiles: that.data.chooseFiles,
        ons: that.data.ons
      });
    }, 500)
  },

  formSubmit(e) {
    var ons = this.data.ons
    var postId = this.data.postId
    console.log(postId)
    var text = e.detail.value.textarea;
    var comment = {
      name: wx.getStorageSync('name'),
      url: wx.getStorageSync('img'),
      time: util.formatTime(new Date()),
      txt: text,
      imgs: ons,
    }
    console.log(comment)
    if (!text && !ons[0]) {
      wx.showModal({
        title: '提示',
        content: '内容不得为空！',
      })
    } else {
      const _ = db.command
      db.collection('shop').doc(postId).update({
        data: {
          comment: _.inc(1),
          commentList: _.push(comment)
        },
        success: res => {
          wx.showModal({
            cancelColor: 'cancelColor',
            title: '提示',
            content: '提交成功！',
            success(res) {
              console.log(res)
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              } else {
                console.log("提交失败")
              }
            }
          })
        },
        fail(err) {
          console.log('提交失败')
        }
      })
    }
  },
})