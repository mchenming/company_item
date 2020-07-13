import request from '../request'
import requestUrl from '../requestUrl'

export function getindexItemdata (data) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getindexItemdata'),
    method: 'post',
    params: data
  })
}

export function getcoreindexItemdata (data) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getindexItemdatahx'),
    method: 'post',
    params: data
  })
}

export function getaboutdata (data) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getindexItemdata'),
    method: 'post',
    params: data
  })
}
