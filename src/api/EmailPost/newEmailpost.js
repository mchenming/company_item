import request from '../request'
import requestUrl from '../requestUrl'

export function newlist (data) {
  return request({
    url: requestUrl('/sysmanage/qxEmailSendSecond/listByParam'),
    method: 'post',
    params: data
  })
}

export function newgetEmailres (data) {
  return request({
    url: requestUrl('/sysmanage/qxEmailSendSecond/getEmailres'),
    method: 'post',
    params: data
  })
}
