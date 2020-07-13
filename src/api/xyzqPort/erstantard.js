import request from '../request'
import requestUrl from '../requestUrl'

// 获取所有时间的信息和id
export function getchecklist (dataModel) {
  return request({
    // sysmanage/qxBaseRedmineStandard/getlistByTime
    url: requestUrl('/sysmanage/qxBaseRedmineStandard/getlistByTime'),
    method: 'post',
    params: dataModel
  })
}

export function getuserdict (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getuserdict'), // /sysmanage/qxEhomeReport/getuserdict
    method: 'post',
    params: dataModel
  })
}

export function gettrackerdict (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseRedmineStandard/getTrackList'),
    method: 'post',
    params: dataModel
  })
}

export function getlistByTime (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseRedmineStandard/getlistByTime'),
    method: 'post',
    params: dataModel
  })
}

export function getEchartsByTime (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseRedmineStandard/getEchartsByTime'),
    method: 'post',
    params: dataModel
  })
}
