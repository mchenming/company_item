import request from '../request'
import requestUrl from '../requestUrl'

// 头部小方块的数据
export function getProjectReqEcharts (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getProjectReqEcharts'),
    method: 'post',
    params: dataModel
  })
}

export function getReqKbList (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getReqKbList'),
    method: 'post',
    params: dataModel
  })
}

export function getEchartsByBranch (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getEchartsByBranch'),
    method: 'post',
    params: dataModel
  })
}

export function getDataByTrackerId (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getDataByTrackerId'),
    method: 'post',
    params: dataModel
  })
}
