import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取OA名称列表
export function oalistByParam (data) {
  return request({
    url: requestUrl('/sysmanage/qxPortOaNeed/listByParamGroupBy'),
    method: 'post',
    params: data
  })
}

// 获取redmine名称列表
export function getRedmineProjectList (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectRule/getRedmineProjectList'),
    method: 'post',
    params: data
  })
}

// 获取itsm名称列表
export function itsmlistByParam (data) {
  return request({
    url: requestUrl('/sysmanage/qxPortItsmNeed/listByParamGroupBy'),
    method: 'post',
    params: data
  })
}

// 新建接口
export function addQxBaseProjectRule (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectRule/addQxBaseProjectRule'),
    method: 'post',
    params: data
  })
}

// 关系所有List接口
export function listByParamRedMineOaItsm (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectRule/listByParam'),
    method: 'post',
    params: data
  })
}

// 删除关联接口
export function delQxBaseProjectRule (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectRule/delQxBaseProjectRule'),
    method: 'post',
    params: data
  })
}

// 获取需要编辑修改的原始信息 (meiyongdao)
export function getQxBaseProjectRuleOaItsm (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectRule/getQxBaseProjectRuleOaItsm'),
    method: 'post',
    params: data
  })
}

// 修改信息接口
export function updateQxBaseProjectRule (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectRule/updateQxBaseProjectRule'),
    method: 'post',
    params: data
  })
}

// ===>redmine子集的接口
// /qxBaseProjectsSubset/listByParam?serNo=?&page=1&pageSize=10&parentId=0?&childProjectNames=?
export function redmineChildlistByParam (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectsSubset/listByParam'),
    method: 'post',
    params: data
  })
}

// 编辑进去获取编辑的数据接口
export function getQxBaseProjectsSubset (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectsSubset/getQxBaseProjectsSubset'),
    method: 'post',
    params: data
  })
}

// 删除接口
export function delQxBaseProjectsSubset (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectsSubset/delQxBaseProjectsSubset'),
    method: 'post',
    params: data
  })
}
// 获取所有的项目
export function getProjects (data) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectsSubset/getProjects'),
    method: 'post',
    params: data
  })
}
// 新增
export function addQxBaseProjectsSubset (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectsSubset/addQxBaseProjectsSubset'),
    method: 'post',
    data: requestParam(dataModel)
  })
}
// 修改
export function updateQxBaseProjectsSubset (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseProjectsSubset/updateQxBaseProjectsSubset'),
    method: 'post',
    data: requestParam(dataModel)
  })
}
