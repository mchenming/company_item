import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
import isInteger from 'lodash/isInteger'

export function reqchecklist (obj) {
  return request({
    url: requestUrl('/center_api/redmine/project/getchecklist'),
    method: 'POST',
    data: requestParam(obj)
  })
}

export function getRoleByUser (userId) {
  return request({
    url: '/sysmanage/qxBaseUser/queryByUserId?userId=' + userId,
    method: 'post'
  })
}

export function getProjectOptions (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseRoleProject/listByMap'),
    method: 'post',
    params: dataModel
  })
}

// 获取用户信息
export function info (id) {
  return request({
    url: '/sysmanage/sys/user/info' + (isInteger(id) ? `/${id}` : ''),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

export function getqualitydatav2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getqualitydatav2'),
    method: 'POST',
    params: dataModel
  })
}

export function getdevjobstaticList (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getdevjobstaticList'),
    method: 'POST',
    params: dataModel
  })
}

export function mouthadd (datamouth) {
  return request({
    url: requestUrl('/center_api/redmine/project/getfeedbackstaticlistv2'),
    method: 'POST',
    // data: requestParam(datamouth)
    params: datamouth
  })
}

export function proname () {
  return request({
    url: requestUrl('/center_api/redmine/project/getprojectdict'),
    method: 'POST'
    // data: requestParam(datamouth)
  })
}

export function versioninfo (proid) {
  return request({
    url: requestUrl('/center_api/redmine/project/getversiondict'),
    method: 'POST',
    // data: requestParam(datamouth)
    params: proid
  })
}

export function getprojectdatav2 (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getprojectdatav2'),
    method: 'POST',
    // data: requestParam(datamouth)
    params: dataModel
  })
}

export function kaifadata (obj) {
  return request({
    url: requestUrl('/center_api/redmine/project/getkfdata'),
    method: 'POST',
    // data: requestParam(datamouth)
    params: obj
  })
}

export function csdata (obj) {
  return request({
    url: requestUrl('/center_api/redmine/project/getcsdata'),
    method: 'POST',
    // data: requestParam(datamouth)
    params: obj
  })
}

// export function guandata (obj) {
//   return request({
//     url: requestUrl('/center_api/redmine/project/getkfdata'),
//     method: 'POST',
//     // data: requestParam(datamouth)
//     params: obj
//   })
// }

export function getProjectRateByUser (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getProjectRateByUser'),
    method: 'post',
    params: dataModel
  })
}

export function getBugByAuthor (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getBugByAuthor'),
    method: 'post',
    params: dataModel
  })
}

export function getProductData (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getProductData'),
    method: 'post',
    params: dataModel
  })
}

export function getActiveData (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getActiveData'),
    method: 'post',
    params: dataModel
  })
}

export function getBugByTIme (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getBugByTIme'),
    method: 'post',
    params: dataModel
  })
}

export function getillegalnumlist (dataModel) {
  return request({
    url: requestUrl('/center_api/redmine/project/getillegalnumlist'),
    method: 'post',
    params: dataModel
  })
}
