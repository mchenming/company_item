import request from '../request'
import requestUrl from '../requestUrl'
export function gettableDataList (jobId) {
  return request({
    url: requestUrl('/center_api/index/service/recordlist?job_id=' + jobId),
    method: 'get'
  })
}

// export function getSensitiveOptions () {
//   return request({
//     url: requestUrl('/api/scanner/sensitive/list/'),
//     method: 'GET'
//   })
// }

export function getLogDetail (jobId) {
  return request({
    url: requestUrl('/center_api/index/service/recorddetaillist?record_id=' + jobId),
    method: 'POST'
  })
}

export function getLogDetailJson (jobId) {
  return request({
    url: requestUrl('/upload/' + jobId + '.json'),
    method: 'get'
  })
}
