import request from '../request'
import requestUrl from '../requestUrl'
// 111
export function getallsummarydata (dataModel, boo) {
  var url = '/sysmanage/qxEhomeReport/getallsummarydata'
  // var url = '/center_api/redmine/xzehomeld/getallsummarydata'
  if (boo) {
    url = '/sysmanage/qxEhomeReport/getallsummarydatahx'
  }
  return request({
    url: requestUrl(url),
    method: 'post',
    params: dataModel
  })
}

export function getallsummaryscenedata (dataModel, boo) {
  var url = '/sysmanage/qxEhomeReport/getallsummaryscenedata'
  if (boo) {
    url = '/sysmanage/qxEhomeReport/getallsummaryscenedatahx'
  }
  return request({
    url: requestUrl(url),
    method: 'post',
    params: dataModel
  })
}

//  111
export function getindexItemdata (dataModel, boo) {
  var url = '/sysmanage/qxEhomeReport/getindexItemdata'
  if (boo) {
    url = '/sysmanage/qxEhomeReport/getindexItemdatahx'
  }
  return request({
    url: requestUrl(url),
    method: 'post',
    params: dataModel
  })
}

// 111
export function getnodeaccesssummary (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getnodeaccesssummary'),
    // url: requestUrl('/center_api/redmine/project/getnodeaccesssummary'),
    method: 'post',
    params: dataModel
  })
}

// 111
export function getcrashnumsummary (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getcrashnumsummary'),
    method: 'post',
    params: dataModel
  })
}

// 111
export function getcrashuvsummary (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getcrashuvsummary'),
    method: 'post',
    params: dataModel
  })
}

//  111
export function getnewcrashnumsummary (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getnewcrashnumsummary'),
    method: 'post',
    params: dataModel
  })
}

// 111
export function getfeedbackdatalistv2 (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getfeedbackdatalistv2'),
    method: 'post',
    params: dataModel
  })
}

// 111
export function getfeedbackstaticlistv2 (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getfeedbackstaticlistv2'),
    method: 'post',
    params: dataModel
  })
}

// export function getcrashratesummary (dataModel) {
//   return request({
//     url: requestUrl('/center_api/redmine/xzehome/getcrashratesummary'),
//     method: 'post',
//     params: dataModel
//   })
// }

// 111
export function getdauitemdata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getdauitemdata'),
    method: 'post',
    params: dataModel
  })
}

// 111
export function getdomainallsummarydata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getdomainallsummarydata'),
    method: 'post',
    params: dataModel
  })
}

// 111
export function getdausummarydata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getdausummarydata'),
    method: 'post',
    params: dataModel
  })
}

// 111
export function getindexallsummarydata (dataModel, boo) {
  var url = '/sysmanage/qxEhomeReport/getindexallsummarydata'
  if (boo) {
    url = '/sysmanage/qxEhomeReport/getindexallsummarydatahx'
  }
  return request({
    url: requestUrl(url),
    method: 'post',
    params: dataModel
  })
}
