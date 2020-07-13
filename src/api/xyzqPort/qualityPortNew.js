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

export function getbugstaticdatav2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getbugstaticdatav2'),
    method: 'post',
    data: requestParam(dataModel)
  })
}
export function yonglizhixing (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/yonglizhixing'),
    method: 'post',
    params: dataModel
  })
}
export function yongli (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/yongli'),
    method: 'post',
    params: dataModel
  })
}
// export function getprojectdatav3 (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxProjectReport/getProjectByProjectIdAndVersionId'),
//     method: 'post',
//     params: dataModel
//   })
// }
export function guifan (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getGuifanByProjectId'),
    method: 'post',
    params: dataModel
  })
}
export function guifanqushi (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/guifanqushi'),
    method: 'post',
    params: dataModel
  })
}
export function getprojectdatav4 (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getversionByProjectId'),
    method: 'post',
    params: dataModel
  })
}
export function getAllReqIds (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseIssues/getAllReqIds'),
    method: 'post',
    params: dataModel
  })
}
export function getprojectdatav5 (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getProjectByProjectIdAndVersionId2'),
    method: 'post',
    params: dataModel
  })
}
export function getprojectdatav6 (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getxuqiu'),
    method: 'post',
    params: dataModel
  })
}

export function getprojectdatav7 (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getchanxian'),
    method: 'post',
    params: dataModel
  })
}

export function getprojectdatav8 (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/gettaskfenbu'),
    method: 'post',
    params: dataModel
  })
}
export function getprojectdatav9 (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getprojectdatav9'),
    method: 'post',
    params: dataModel
  })
}

export function getprojectdatav2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getprojectdatav2'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

export function getProjectTotal (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectKb/getProjectTotal'),
    method: 'post',
    params: dataModel
  })
}

// export function getprojectdatav9 (dataModel) {
//   return request({
//     url: requestUrl('/sysmanage/qxProjectReport/getprojectdatav9'),
//     method: 'post',
//     params: dataModel
//   })
// }

export function getBugTrend (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectKb/getBugTrend'),
    method: 'post',
    params: dataModel
  })
}

export function getversiondict (projectId) {
  return request({
    url: requestUrl('/sysmanage/qxBaseVersions/versionListByProjectId'),
    method: 'post',
    params: {
      projectId: projectId
    }
  })
}

export function getDeviateTrend (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectKb/getDeviateTrend'),
    method: 'post',
    params: dataModel
  })
}

export function getMilestoneList (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectKb/getMilestoneList'),
    method: 'post',
    params: dataModel
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

export function getGanttChartList (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectKb/getGanttChartList'),
    method: 'post',
    params: dataModel
  })
}

export function getGanttChartIssueInfo (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectKb/getGanttChartIssueInfo'),
    method: 'post',
    params: dataModel
  })
}
