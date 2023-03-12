const {
  WXMINIUser,
  WXMINIQR
} = require('wx-js-utils');
const appId = 'wx573eefd5e4b88def'; //小程序Id
const secret = '1f291d598aea26f49c165f1fab905614'; //小程序secret
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var path = event.path
  let wXMINIUser = new WXMINIUser({
    appId,
    secret
  });
  let access_token = await wXMINIUser.getAccessToken();
  let wXMINIQR = new WXMINIQR;
  let qrResult = await wXMINIQR.getQR({
    access_token,
    path: path
  })

  return await cloud.uploadFile({
    cloudPath: 'hom_rent/carCode/' + Math.round(new Date()) + filePath.match(/\.[^.]+?$/)[0],
    fileContent: qrResult
  })
}