import request from '../request'
import requestUrl from '../requestUrl'

export function getYanshiAndFangwenliang (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReportSynchro/getYanshiAndFangwenliang'),
    method: 'post',
    params: data
  })
}

export function getMaster (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReportSynchro/getMaster'),
    method: 'post',
    params: data
  })
}

export function getSyster (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReportSynchro/getSyster'),
    method: 'post',
    params: data
  })
}

export function getUseTime (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReportSynchro/getUseTime'),
    method: 'post',
    params: data
  })
}

export function getMoney (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmtUserAccess/listByParam'),
    method: 'post',
    params: data
  })
}

export function getJournal (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmtLog/listByParam'),
    method: 'post',
    params: data
  })
}

export function SmartlistByMap (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderFuncnum/listByMap'),
    method: 'post',
    params: data
  })
}
