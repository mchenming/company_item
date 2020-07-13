import request from '../request'
import requestUrl from '../requestUrl'

// 获取crash数的安卓数和ios数   需要传递对象为    start_time: 2019-07-15 08:00:00           end_time: 2019-08-15 08:00:00
export function getReqsByParams (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getReqsByParams'),
    method: 'post',
    params: dataModel
  })
}
