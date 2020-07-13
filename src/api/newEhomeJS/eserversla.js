import request from '../request'
import requestUrl from '../requestUrl'

// 登录接口成功率start_time: 2019-09-01 09:00:00   end_time: 2019-09-02 09:00:00     api_name: auth
export function getinterfacesladata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getinterfacesladatahx'),
    method: 'post',
    params: dataModel
  })
}

// 登录接口平均相应时间start_time: 2019-09-01 09:00:00   end_time: 2019-09-02 09:00:00     api_name: auth
export function getinterfacetimedata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getinterfacetimedatahx'),
    method: 'post',
    params: dataModel
  })
}

// 获取核心用户的数据 还没完成   ????   核心的还没有完成
export function getallsummarydata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getallsummarydatahx'),
    method: 'post',
    params: dataModel
  })
}

// 上面都是核心的用户

// 1111
// 不核心用户的标题数据
export function getallsummarydatano (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getallsummarydata'),
    method: 'post',
    params: dataModel
  })
}

// 111
// 不核心用户的接口成功率
export function getinterfacesladatano (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getinterfacesladata'),
    method: 'post',
    params: dataModel
  })
}

// 不核心用户的响应时间
export function getinterfacetimedatano (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getinterfacetimedata'),
    method: 'post',
    params: dataModel
  })
}
