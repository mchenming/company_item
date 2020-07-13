import request from '../request'
import requestUrl from '../requestUrl'

// 核心用户的title数据和业务场景的数据
export function getallsummaryscenedata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getallsummaryscenedatahx'),
    method: 'post',
    params: dataModel
  })
}

export function getscenedata (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getscenedatahx'),
    method: 'post',
    params: dataModel
  })
}

// 非核心用户的title数据和业务场景的数据
export function getallsummaryscenedatano (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getscenedatano (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getscenedata'),
    method: 'post',
    params: dataModel
  })
}

// 已替换
export function getinterfacesladatano (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getinterfacesladata'),
    method: 'post',
    params: dataModel
  })
}

//  已替换
export function getallsummarydatano (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getallsummarydata'),
    method: 'post',
    params: dataModel
  })
}
