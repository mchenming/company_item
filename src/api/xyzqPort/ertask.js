import request from '../request'
import requestUrl from '../requestUrl'

// 登录接口成功率start_time: 2019-09-01 09:00:00   end_time: 2019-09-02 09:00:00     api_name: auth
export function getTaskListByParams (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getTaskListByParams'),
    method: 'post',
    params: dataModel
  })
}
