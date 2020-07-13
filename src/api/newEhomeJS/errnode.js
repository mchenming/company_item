import request from '../request'
import requestUrl from '../requestUrl'

// 获取节点监控的数据   需要传递时间start_time: 2019-10-08 12:00:00  end_time: 2019-10-09 12:00:00
export function getonlinedata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getnodeaccesssummary'),
    method: 'post',
    params: dataModel
  })
}

export function getnodeaccessrequestnumdetail (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getnodeaccessrequestnumdetail'),
    method: 'post',
    params: dataModel
  })
}

export function getnodeaccesserrorratedetail (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getnodeaccesserrorratedetail'), // qxEhomeReport/getnodeaccesserrorratedetail
    method: 'post',
    params: dataModel
  })
}

export function getnodeaccessrequesttimedetail (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getnodeaccessrequesttimedetail'),
    method: 'post',
    params: dataModel
  })
}

export function getnodeaccesslowrequestnumdetail (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getnodeaccesslowrequestnumdetail'),
    methodod: 'post',
    params: dataModel
  })
}
