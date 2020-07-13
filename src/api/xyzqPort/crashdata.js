import request from '../request'
import requestUrl from '../requestUrl'

// 获取crash数的安卓数和ios数   需要传递对象为    start_time: 2019-07-15 08:00:00           end_time: 2019-08-15 08:00:00
export function getcrashnumsummary (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getcrashnumsummary'),
    method: 'post',
    params: dataModel
  })
}

// 获取安卓和ios的crash率    需要传递start_time: 2019-07-15 08:00:00  end_time: 2019-08-15 08:00:00
export function getcrashratesummary (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getcrashratesummary'),
    method: 'post',
    params: dataModel
  })
}

// 影响用户数start_time: 2019-07-15 08:00:00   end_time: 2019-08-15 08:00:00
export function getcrashuvsummary (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getcrashuvsummary'),
    method: 'post',
    params: dataModel
  })
}

// 崩溃类型数 start_time: 2019-07-15 08:00:00   end_time: 2019-08-15 08:00:00
export function getnewcrashnumsummary (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getnewcrashnumsummary'),
    method: 'post',
    params: dataModel
  })
}

// 获取安坐和ios的crash数的  echarts数据start_time: 2019-07-15 08:00:00   end_time: 2019-08-15 08:00:00   api_name: android   ios
export function getcrashnumdetail (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getcrashnumdetail'),
    method: 'post',
    params: dataModel
  })
}

// 获取安坐和ios的crash率的  echarts数据start_time: 2019-07-15 08:00:00   end_time: 2019-08-15 08:00:00   api_name: android   ios
export function getcrashratedetail (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getcrashratedetail'),
    method: 'post',
    params: dataModel
  })
}

// 获取安坐影响用户数 echarts数据start_time: 2019-07-15 08:00:00   end_time: 2019-08-15 08:00:00
export function getandroiduvitemdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getandroiduvitemdata'),
    method: 'post',
    params: dataModel
  })
}
// 获取ios影响用户数 echarts数据start_time: 2019-07-15 08:00:00   end_time: 2019-08-15 08:00:00
export function getiosuvitemdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getiosuvitemdata'),
    method: 'post',
    params: dataModel
  })
}

// 获取安坐和ios崩溃类型数 echarts数据start_time: 2019-07-15 08:00:00   end_time: 2019-08-15 08:00:00 device: android
export function getnewcrashdetail (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getnewcrashdetail'),
    method: 'post',
    params: dataModel
  })
}

// // 测试接口e家
export function gettestdata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getscenedatahx'),
    method: 'post',
    params: dataModel
  })
}

// export function getdauitemdata (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getdauitemdata'),
//     method: 'post',
//     params: dataModel
//   })
// }

// export function getcrashdatatest (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getcrashnumsummary'),
//     method: 'post',
//     params: dataModel
//   })
// }

// export function getindexallsummarydata (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getindexallsummarydata'),
//     method: 'post',
//     params: dataModel
//   })
// }
// export function getallsummarydata (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getallsummarydata'),
//     method: 'post',
//     params: dataModel
//   })
// }

// export function getdausummarydata (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getdausummarydata'),
//     method: 'post',
//     params: dataModel
//   })
// }

// export function getdomainallsummarydata (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getdomainallsummarydata'),
//     method: 'post',
//     params: dataModel
//   })
// }

// export function getnodeaccesssummary (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getnodeaccesssummary'),
//     method: 'post',
//     params: dataModel
//   })
// }

// export function getcrashuvsummarya (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getcrashuvsummary'),
//     method: 'post',
//     params: dataModel
//   })
// }

// export function getnewcrashnumsummarya (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getnewcrashnumsummary'),
//     method: 'post',
//     params: dataModel
//   })
// }

// export function getfeedbackdatalistv2 (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getfeedbackdatalistv2'),
//     method: 'post',
//     params: dataModel
//   })
// }

// export function getfeedbackstaticlistv2 (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxEhomeReport/getfeedbackstaticlistv2'),
//     method: 'post',
//     params: dataModel
//   })
// }
