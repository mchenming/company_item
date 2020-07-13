import request from '../request'
import requestUrl from '../requestUrl'

// 获取提交缺陷echarts数据的接口
export function getTjBugEcharts (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesLog/getTjBugEcharts'),
    method: 'post',
    params: data
  })
}

// 获取bug趋势的echarts
export function getBugQsEcharts (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesLog/getBugQsEcharts'),
    method: 'post',
    params: data
  })
}

// 获取bug趋势的echarts
export function getBugListByTime (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssuesLog/getBugListByTime'),
    method: 'post',
    params: data
  })
}
