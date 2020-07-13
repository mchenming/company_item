import request from '../request'
import requestUrl from '../requestUrl'

// ok
export function getcrashnumsummary (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getcrashnumsummary'),
    method: 'post',
    params: dataModel
  })
}

// ok
export function getcrashratesummary (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getcrashratesummary'),
    method: 'post',
    params: dataModel
  })
}

// ok
export function getcrashuvsummary (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getcrashuvsummary'),
    method: 'post',
    params: dataModel
  })
}

// ok
export function getnewcrashnumsummary (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getnewcrashnumsummary'),
    method: 'post',
    params: dataModel
  })
}

// ok
export function getcrashnumdetail (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getcrashnumdetail'),
    method: 'post',
    params: dataModel
  })
}

//
export function getcrashratedetail (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getcrashratedetail'),
    method: 'post',
    params: dataModel
  })
}

// ok
export function getandroiduvitemdata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getandroiduvitemdata'),
    method: 'post',
    params: dataModel
  })
}
// ok
export function getiosuvitemdata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getiosuvitemdata'),
    method: 'post',
    params: dataModel
  })
}

// ok
export function getnewcrashdetail (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getnewcrashdetail'),
    method: 'post',
    params: dataModel
  })
}
