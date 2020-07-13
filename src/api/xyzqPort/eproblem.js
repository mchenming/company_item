import request from '../request'
import requestUrl from '../requestUrl'

// 获取所有时间的信息和id
export function getfeedbackmonthdict () {
  return request({
    url: requestUrl('/center_api/redmine/project/getfeedbackmonthdict'),
    method: 'post'
  })
}

// 根据项目id和时间月份来获取数据累计待解决的数量  需要传递一个项目的id和时间project_id: 26    static_month: 20190801
export function getfeedbackstaticlistv2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getfeedbackstaticlistv2'),
    method: 'post',
    params: dataModel
  })
}

// 根据项目id和时间月份来获取数据累计待解决的数量  需要传递一个项目的id和时间project_id: 26   static_month: 2019-08-01    feedback_type: 6
export function getfeedbackdatalistv2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getfeedbackdatalistv2'),
    method: 'post',
    params: dataModel
  })
}
