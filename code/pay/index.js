// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

//1.引入依赖
const tenpay = require('tenpay');
//2.配置参数
const config = {
  appid: 'wx573eefd5e4b88def', //小程序appID
  mchid: '1595127781', //商户号
  partnerKey: 'youboxiaoyuanshenghuofuwupingtai', //支付密钥
  notify_url: 'https://www.baidu.com/',
  spbill_create_ip: '127.0.0.1'
};

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const body = '灵山出行';
  const fee = event.fee;
  const order = event.outTradeNo;
  const api = tenpay.init(config);
  let result = await api.getPayParams({
    out_trade_no: order, //订单号,填一个时间戳
    body: body, //商品简单描述
    total_fee: fee, //单位(分)
    openid: wxContext.OPENID //当前用户ID
  });
  return result
}