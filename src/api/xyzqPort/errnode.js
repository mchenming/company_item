import request from '../request'
import requestUrl from '../requestUrl'

// 获取节点监控的数据   需要传递时间start_time: 2019-10-08 12:00:00  end_time: 2019-10-09 12:00:00
export function getonlinedata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getnodeaccesssummary'),
    method: 'post',
    params: dataModel
  })
}

// 获取请求数量的echartsdata 传递事件和start_time: 2019-10-08 13:00:00   end_time: 2019-10-09 13:00:00    api_name: 192.168.3.55
export function getnodeaccessrequestnumdetail (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getnodeaccessrequestnumdetail'),
    method: 'post',
    params: dataModel
  })
}

// 获取请求错误率的echartsdata 传递事件和start_time: 2019-10-08 13:00:00   end_time: 2019-10-09 13:00:00    api_name: 192.168.3.55
export function getnodeaccesserrorratedetail (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getnodeaccesserrorratedetail'),
    method: 'post',
    params: dataModel
  })
}

// 获取请求平均响应时间的echartsdata 传递事件和start_time: 2019-10-08 13:00:00   end_time: 2019-10-09 13:00:00    api_name: 192.168.3.55
export function getnodeaccessrequesttimedetail (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getnodeaccessrequesttimedetail'),
    method: 'post',
    params: dataModel
  })
}

// 获取请求超过1s的响应数的echartsdata 传递事件和start_time: 2019-10-08 13:00:00   end_time: 2019-10-09 13:00:00    api_name: 192.168.3.55
export function getnodeaccesslowrequestnumdetail (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getnodeaccesslowrequestnumdetail'),
    methodod: 'post',
    params: dataModel
  })
}
