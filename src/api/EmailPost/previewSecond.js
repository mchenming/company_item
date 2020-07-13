import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

export function addHistorySecond (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxNeedmeritsReview/addHistorySecond'),
    method: 'post',
    data: requestParam(dataModel)
  })
}
