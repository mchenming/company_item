import request from '../request'
import requestUrl from '../requestUrl'

// 头部小方块的数据
export function getallnumdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

// 需求趋势的echarts数据
export function getneedtrend (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}

// 项目需求的echarts
export function getitemneed (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}
// 产线问题分布的echarts
export function getproline (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}
// 项目产线问题的echarts
export function getitemline (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}
// 获取底部table版本的数据
export function getversionlist (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}
// 获取底部table需求的数据
export function getneedlist (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}
// 获取底部table产线的数据
export function getprolinelist (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}
// 获取底部table任务的数据
export function gettasklist (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}
// 获取底部table人员的数据
export function getpersonlist (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/xzehomeld/getallsummaryscenedata'),
    method: 'post',
    params: dataModel
  })
}
