import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 没找到
export function getprojectdict (projectId) {
  return request({
    url: requestUrl('/center_api/redmine/project/getprojectdict?project_id=' + projectId),
    method: 'post'
  })
}

export function getScantask (dataModel) {
  return request({
    url: requestUrl('/sysmanage/api/scanner/scantask/list/?format=json'),
    method: 'GET',
    params: dataModel
  })
}

export function getSensitiveOptions () {
  return request({
    url: requestUrl('/sysmanage/api/scanner/sensitive/list/?format=json'),
    method: 'GET'
  })
}

// 定时任务
export function getCronJobList () {
  return request({
    url: requestUrl('/center_api/index/service/jobList'),
    method: 'post'
  })
}

export function saveBaseModel (params, pathname) {
  return request({
    url: requestUrl('/sysmanage/api/scanner/scantask/' + pathname + '/?format=json'),
    method: 'post',
    data: requestParam(params)
  })
}

export function startScan (keyId) {
  return request({
    url: requestUrl('/sysmanage/api/scanner/scantask/' + keyId + '/start/?format=json'),
    method: 'post'
  })
}

export function stopScan (keyId) {
  return request({
    url: requestUrl('/sysmanage/api/scanner/scantask/' + keyId + '/stop/?format=json'),
    method: 'post'
  })
}

// 定时任务
export function getjobdetail (jobId) {
  return request({
    url: requestUrl('/center_api/index/service/jobdetail?job_id=' + jobId),
    method: 'post'
  })
}

// 定时任务
export function usermaillist () {
  return request({
    url: requestUrl('/center_api/index/service/usermaillist'),
    method: 'post'
  })
}

// 定时任务
export function editjob (dataModel) {
  return request({
    url: requestUrl('/center_api/index/service/editjob'),
    method: 'POST',
    params: dataModel
  })
}

// 定时任务
export function newjob (dataModel) {
  return request({
    url: requestUrl('/center_api/index/service/newjob'),
    method: 'POST',
    params: dataModel
  })
}

// 定时任务
export function deljob (jobId) {
  return request({
    url: requestUrl('/center_api/index/service/deljob?job_id=' + jobId),
    method: 'post'
  })
}

export function listByParam (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxScanWords/listByParam'),
    method: 'post',
    params: dataModel
  })
}
