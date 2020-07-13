import request from '../request'
import requestUrl from '../requestUrl'

// 登录接口成功率start_time: 2019-09-01 09:00:00   end_time: 2019-09-02 09:00:00     api_name: auth
export function getinterfacesladata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getinterfacesladata'),
    method: 'post',
    params: dataModel
  })
}

// 登录接口平均相应时间start_time: 2019-09-01 09:00:00   end_time: 2019-09-02 09:00:00     api_name: auth
export function getinterfacetimedata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getinterfacetimedata'),
    method: 'post',
    params: dataModel
  })
}

export function getallsummarydata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummarydata'),
    method: 'post',
    params: dataModel
  })
}

// 上面都是核心的用户

// 不核心用户的标题数据
export function getallsummarydatano (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getallsummarydata'),
    method: 'post',
    params: dataModel
  })
}

// 不核心用户的接口成功率
export function getinterfacesladatano (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getinterfacesladata'),
    method: 'post',
    params: dataModel
  })
}

// 不核心用户的响应时间
export function getinterfacetimedatano (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getinterfacetimedata'),
    method: 'post',
    params: dataModel
  })
}
