import request from '../request'
import requestUrl from '../requestUrl'

// 获取需求列表数据的接口
export function getRedmineReqList (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getRedmineReqList'),
    method: 'post',
    params: data
  })
}

// 获取需求列表所有状态的接口
export function listByMap () {
  return request({
    url: requestUrl('/sysmanage/qxBaseProcessRule/getNeedStatuss'),
    method: 'post'
  })
}

// 获取需求列表所有需求参数的接口
export function getReqTotal (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getReqTotal'),
    method: 'post',
    params: data
  })
}

// 获取需求列表所有需求参数的接口
export function getAllReqList (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getAllReqList'),
    method: 'post',
    params: data
  })
}

// 获取需求列表所有状态的接口
export function liststatus () {
  return request({
    url: requestUrl('/sysmanage/qxBaseProcessRule/listByMap'),
    method: 'post'
  })
}
