import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

export function getReviewByProject (data) {
  return request({
    url: requestUrl('/sysmanage/qxNeedmeritsReview/getReviewByProject'),
    method: 'post',
    params: data
  })
}

export function exportWord (data) {
  return request({
    url: requestUrl('/sysmanage/qxNeedmeritsReview/export'),
    method: 'get',
    // params: data,
    data: requestParam(data)
  })
}
