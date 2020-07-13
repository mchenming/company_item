import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 头部小方块的数据
export function getProjectReqEcharts (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesNew/getProjectReqEcharts'),
    method: 'post',
    params: dataModel
  })
}

export function getReqKbList (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesNew/getReqKbList'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getEchartsByBranch (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesNew/getEchartsByBranch'),
    method: 'post',
    params: dataModel
  })
}

export function getDataByTrackerId (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesNew/getDataByTrackerId'),
    method: 'post',
    params: dataModel
  })
}

export function getOaProjects (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesNew/getOaProjects'),
    method: 'post',
    params: dataModel
  })
}

export function getReqByOaId (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesNew/getReqByOaId'),
    method: 'post',
    params: dataModel
  })
}

export function getBranchList () {
  return request({
    url: requestUrl('/sysmanage/qxPortOaBranch/listByMap?orgFns=信息技术部,金融科技部'),
    method: 'post'
  })
}
