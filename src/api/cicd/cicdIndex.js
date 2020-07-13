import request from '../request'
import requestUrl from '../requestUrl'

// 获取列表信息
export function listByParam (data) {
  return request({
    url: requestUrl('/sysmanage/qxCicdStatisData/listByParam'),
    method: 'post',
    params: data
  })
}

// 数据雷达图信息
export function getTopStatisData (data) {
  return request({
    url: requestUrl('/sysmanage/qxCicdStatisData/getTopStatisData'),
    method: 'post',
    params: data
  })
}

// 数据详情信息
export function getListByProject (data) {
  return request({
    url: requestUrl('/sysmanage/qxCicdStatisData/getListByProject'),
    method: 'post',
    params: data
  })
}

// 得分分析
export function getScoringAnalysis (data) {
  return request({
    url: requestUrl('/sysmanage/qxCicdStatisData/getScoringAnalysis'),
    method: 'post',
    params: data
  })
}
