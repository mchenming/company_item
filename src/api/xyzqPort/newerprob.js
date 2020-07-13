import request from '../request'
import requestUrl from '../requestUrl'

// 获取需求列表数据的接口
export function getCxBugEchartsByTime (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getCxBugEchartsByTime'),
    method: 'post',
    params: data
  })
}

export function getCxBugListByTime (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getCxBugListByTime'),
    method: 'post',
    params: data
  })
}
