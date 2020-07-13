import request from '../request'
import requestUrl from '../requestUrl'

// 获取提交缺陷echarts数据的接口
export function getTaskListByTime (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getTaskListByTime'),
    method: 'post',
    params: data
  })
}
