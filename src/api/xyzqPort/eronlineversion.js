
import request from '../request'
import requestUrl from '../requestUrl'

// 根据传入的项目获取上线版本
export function getVersionListByTime (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getVersionListByTime'),
    method: 'post',
    params: dataModel
  })
}
