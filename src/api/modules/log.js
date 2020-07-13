import request from '../request'
import requestScan from '../requestScan'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
import isInteger from 'lodash/isInteger'

// 获取日志列表
export function list (params) {
  return request({
    url: requestScan('/sys/log/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取定时任务日志列表
export function scheduleList (params) {
  return request({
    url: requestUrl('/sys/scheduleLog/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取定时任务日志信息
export function scheduleInfo (id) {
  return request({
    url: requestUrl('/sys/scheduleLog/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

export function operationLogStatis (dataModel) {
  return request({
    url: requestUrl('/sysmanage/QxSysLog/operationLogStatis'),
    method: 'post',
    params: dataModel
  })
}

export function pvStatis (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxSysPageLog/pvStatis'),
    method: 'post',
    params: dataModel
  })
}
