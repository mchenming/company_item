import request from '../request'
import requestUrl from '../requestUrl'

// 获取顶部数据的接口
export function getTotalMessage (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesLog/getTotalMessage'),
    method: 'post',
    params: data
  })
}
// 获取项目进度的echarts数据
export function getProjectRate (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesLog/getProjectRate'),
    method: 'post',
    params: data
  })
}
// 获取未提测需求数据接口
export function getUnTcReq (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesLog/getUnTcReq'),
    method: 'post',
    params: data
  })
}

// 获取生产反馈的数据接口
export function getScfkEchartsDatas (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesLog/getScfkEchartsDatas'),
    method: 'post',
    params: data
  })
}

// 获取redmine规范项目数据接口
export function getStandardForProject (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseRedmineStandard/getStandardForProject'),
    method: 'post',
    params: data
  })
}
