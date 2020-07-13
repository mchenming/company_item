import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

export function getreqName (data) {
  return request({
    url: requestUrl('/sysmanage/qxEmailSend/getreqName'),
    method: 'post',
    params: data
  })
}

export function listByParam (data) {
  return request({
    url: requestUrl('/sysmanage/qxEmailSend/listByParam'),
    method: 'post',
    params: data
  })
}

export function getAlllog (data) {
  return request({
    url: requestUrl('/sysmanage/qxEmailLog/getAlllog'),
    method: 'post',
    params: data
  })
}

export function getEmailres (data) {
  return request({
    url: requestUrl('/sysmanage/qxEmailSend/getEmailres'),
    method: 'post',
    params: data
  })
}

export function test (data) {
  return request({
    url: requestUrl('/sysmanage/qxNeedmeritsReview/export'),
    method: 'post',
    // params: data
    data: requestParam(data)
  })
}
