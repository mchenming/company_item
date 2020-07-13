import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
export function getprojectdict (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getProjectByUser'),
    method: 'post',
    params: dataModel
  })
}
// import {getxqdatav2, getchecklist, getkfdata, getcsdata, getplantime, getbugdatav2} from '@/api/xyzqPort/qualityPort'
export function getbugstaticdatav2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getbugstaticdatav2'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getprojectdatav2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getprojectdatav2'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getversiondict (projectId) {
  return request({
    url: requestUrl('/center_api/redmine/project/getversiondict'),
    method: 'post',
    data: requestParam({
      project_id: projectId
    })
  })
}

export function getxqdatav2 (xqIds) {
  return request({
    url: requestUrl('/center_api/redmine/project/getxqdatav2'),
    method: 'post',
    data: requestParam({
      xq_ids: xqIds
    })
  })
}

export function getqualitydatav2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getqualitydatav2'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getcasedatav2 (caseIds) {
  return request({
    url: requestUrl('/center_api/redmine/project/getcasedatav2'),
    method: 'post',
    data: requestParam({
      case_ids: caseIds
    })
  })
}

export function getbugdatav2 (bugIds) {
  return request({
    url: requestUrl('/center_api/redmine/project/getbugdatav2'),
    method: 'post',
    data: requestParam({
      bug_ids: bugIds
    })
  })
}

export function getfeedbackstaticlistv2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getfeedbackstaticlistv2'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getfeedbackdatalistv2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getfeedbackdatalistv2'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getchecklist (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getchecklist'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getkfdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getkfdata'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getcsdata (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getcsdata'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getplantime (ids) {
  return request({
    url: requestUrl('/center_api/redmine/report/getplantime?issue_ids=' + ids),
    method: 'post'
  })
}

export function getillegalnumlist (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getillegalnumlist'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getReqNumByTime (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getReqNumByTime'),
    method: 'post',
    params: dataModel
  })
}
