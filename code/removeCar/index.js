// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID
  return await cloud.database().collection('shop_car').where({
    _openid: openId
  }).remove({
    success(res) {
      return res
    },
    fail(err) {
      return err
    }
  })
}