import request from '../request'
import requestUrl from '../requestUrl'

// 获取所有时间的信息和id
export function getfeedbackmonthdict (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getfeedbackmonthdict'),
    method: 'post',
    params: dataModel
  })
}

export function getfeedbackdatalistv2 (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getfeedbackdatalistv2'),
    method: 'post',
    params: dataModel
  })
}

export function getCxBugByProject (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getCxBugByProject'),
    method: 'post',
    params: dataModel
  })
}
