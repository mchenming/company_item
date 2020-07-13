import request from '../request'
import requestUrl from '../requestUrl'

// 获取所有时间的信息和id
// export function getxqdatav2 (dataModel) {
//   return request({
//     url: requestUrl('/center_api/redmine/project/getxqdatav2'),
//     method: 'post',
//     params: dataModel
//   })
// }

export function getversiondict (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseVersions/versionListByProjectId'),
    method: 'post',
    params: dataModel
  })
}

// export function getprojectdict (dataModel) {
//   return request({
//     url: requestUrl('/center_api/redmine/project/getprojectdict'),
//     method: 'post',
//     params: dataModel
//   })
// }

// export function getprojectdatav2 (dataModel) {
//   return request({
//     url: requestUrl('/center_api/redmine/project/getprojectdatav2'),
//     method: 'post',
//     params: dataModel
//   })
// }

export function getProjectByUser (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getProjectByUser'),
    method: 'post',
    params: dataModel
  })
}

export function getReqListByParams (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getReqListByParams'),
    method: 'post',
    params: dataModel
  })
}

export function getAllStatusData (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getAllStatusData'),
    method: 'post',
    params: dataModel
  })
}

export function getuserdict (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getuserdict'),
    method: 'post',
    params: dataModel
  })
}

export function getNewVersionByProject (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getNewVersionByProject'),
    method: 'post',
    params: dataModel
  })
}
