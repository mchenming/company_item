import request from '../request'
import requestUrl from '../requestUrl'

// 核心用户的title数据和业务场景的数据
export function getallsummaryscenedata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getscenedata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getscenedata'),
    method: 'post',
    params: dataModel
  })
}

// 非核心用户的title数据和业务场景的数据
export function getallsummaryscenedatano (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getscenedatano (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getinterfacesladatano (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getinterfacesladata'),
    method: 'post',
    params: dataModel
  })
}

export function getallsummarydatano (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehome/getallsummarydata'),
    method: 'post',
    params: dataModel
  })
}
