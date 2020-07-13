import request from '../request'
import requestUrl from '../requestUrl'
export function getallsummarydata (dataModel, boo) {
  var url = '/center_api/redmine/xzehome/getallsummarydata'
  if (boo) {
    url = '/center_api/redmine/xzehomeld/getallsummarydata'
  }
  return request({
    url: requestUrl(url),
    method: 'post',
    params: dataModel
  })
}

export function getallsummaryscenedata (dataModel, boo) {
  var url = '/center_api/redmine/xzehome/getallsummaryscenedata'
  if (boo) {
    url = '/center_api/redmine/xzehomeld/getallsummaryscenedata'
  }
  return request({
    url: requestUrl(url),
    method: 'post',
    params: dataModel
  })
}

export function getindexItemdata (dataModel, boo) {
  var url = '/center_api/redmine/xzehome/getindexItemdata'
  if (boo) {
    url = '/center_api/redmine/xzehomeld/getindexItemdata'
  }
  return request({
    url: requestUrl(url),
    method: 'post',
    params: dataModel
  })
}

export function getnodeaccesssummary (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getnodeaccesssummary'),
    method: 'post',
    params: dataModel
  })
}

export function getcrashnumsummary (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getcrashnumsummary'),
    method: 'post',
    params: dataModel
  })
}

export function getcrashuvsummary (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getcrashuvsummary'),
    method: 'post',
    params: dataModel
  })
}

export function getnewcrashnumsummary (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getnewcrashnumsummary'),
    method: 'post',
    params: dataModel
  })
}

export function getfeedbackdatalistv2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getfeedbackdatalistv2'),
    method: 'post',
    params: dataModel
  })
}

export function getfeedbackstaticlistv2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getfeedbackstaticlistv2'),
    method: 'post',
    params: dataModel
  })
}

export function getcrashratesummary (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getcrashratesummary'),
    method: 'post',
    params: dataModel
  })
}

export function getdauitemdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getdauitemdata'),
    method: 'post',
    params: dataModel
  })
}

export function getdomainallsummarydata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getdomainallsummarydata'),
    method: 'post',
    params: dataModel
  })
}

export function getdausummarydata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getdausummarydata'),
    method: 'post',
    params: dataModel
  })
}

export function getindexallsummarydata (dataModel, boo) {
  var url = '/center_api/redmine/xzehome/getindexallsummarydata'
  if (boo) {
    url = '/center_api/redmine/xzehomeld/getindexallsummarydata'
  }
  return request({
    url: requestUrl(url),
    method: 'post',
    params: dataModel
  })
}
