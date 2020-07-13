import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

export function getjcdata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxYlbReport/getbasiccharts'),
    method: 'post',
    params: dataModel
  })
}

export function getinspectdata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxYlbReport/getdatauindata'),
    method: 'post',
    params: dataModel
  })
}

export function getinspecttime (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxYlbReport/getzxdatauindata'),
    method: 'post',
    params: dataModel
  })
}

export function getdefaultaddress (addressFlag) {
  return request({
    url: requestUrl('/sysmanage/qxYlbReport/getdefaultaddress?address_flag=' + addressFlag),
    method: 'post'
  })
}

export function getstaticdata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxYlbReport/getstaticdata'),
    method: 'post',
    params: dataModel
  })
}

export function sendmailsmtp (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxYlbReport/sendmailsmtp'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function GMJJDataGet () {
  return request({
    url: requestUrl('/sysmanage/openapi/ylb_gmjj_rerun'),
    method: 'get'
  })
}

export function isgmjjfinish () {
  return request({
    url: requestUrl('/sysmanage/openapi/is_gmjj_finish'),
    method: 'get'
  })
}

export function editstaticdata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxYlbReport/editstaticdata'),
    method: 'post',
    params: dataModel
  })
}

export function getbasicdatalist (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxYlbReport/getbasicdatalist'),
    method: 'post',
    params: dataModel
  })
}

export function getdatadetaildata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxYlbReport/getdatadetaildata'),
    method: 'post',
    params: dataModel
  })
}

export function getzxdatadetaildata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxYlbReport/getzxdatadetaildata'),
    method: 'post',
    params: dataModel
  })
}
