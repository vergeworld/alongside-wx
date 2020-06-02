// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let postId = event.postId
  return cloud.database().collection('shop_car').where({
    postId: postId
  }).get({
    success(res) {
      return res
    },
    fail(err) {
      return err
    }
  })
}