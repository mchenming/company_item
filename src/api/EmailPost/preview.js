import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

export function yuluan (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEmailSend/yuluan'),
    method: 'post',
    params: dataModel
  })
}

export function addQxNeedmeritsReview (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxNeedmeritsReview/addQxNeedmeritsReview'),
    method: 'post',
    data: requestParam(dataModel)
    // params: dataModel
  })
}

export function getQxNeedmeritsReview (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxNeedmeritsReview/getQxNeedmeritsReview'),
    method: 'post',
    params: dataModel
  })
}

export function addHistory (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxNeedmeritsReview/addHistory'),
    method: 'post',
    data: requestParam(dataModel)
  })
}
