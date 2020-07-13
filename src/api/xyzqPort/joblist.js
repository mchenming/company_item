import request from '../request'
import requestUrl from '../requestUrl'

// 头部小方块的数据
export function getboxdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getkftaskdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getcstaskdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getcreatedata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getcreatetabledata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getsubmitDefectdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getsubmitDefecttabledata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getrepaireDefectdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

export function getrepaireDefecttabledata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}
