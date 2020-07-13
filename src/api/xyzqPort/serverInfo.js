import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
export function gettableDataList (keyId) {
  return request({
    url: requestUrl('/sysmanage/api/scanner/scantask/' + keyId + '/execution/list/?format=json'),
    method: 'get'
  })
}

export function getSensitiveOptions () {
  return request({
    url: requestUrl('/sysmanage/api/scanner/sensitive/list/?format=json'),
    method: 'GET'
  })
}

export function getLogDetail (keyId) {
  return request({
    url: requestUrl('/sysmanage/api/scanner/scan/execution/' + keyId + '/?format=json'),
    method: 'get'
  })
}

export function getLogDetailJson (keyId) {
  return request({
    url: requestUrl('/sysmanage/upload/' + keyId + '.json'),
    method: 'get'
  })
}

export function setHl (params, pathname) {
  return request({
    url: requestUrl('/sysmanage/api/scanner/scan/execution/' + pathname + '/exception/action/?format=json'),
    method: 'post',
    data: requestParam(params)
  })
}

export function addQxScanWords (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxScanWords/addQxScanWords'),
    method: 'post',
    params: dataModel
  })
}

export function getDetailList (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxScanWords/getDetailList?keyId=' + dataModel),
    method: 'post',
    params: dataModel
  })
}
