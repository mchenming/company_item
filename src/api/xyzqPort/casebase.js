import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

export function getProjectByUser (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxProjectReport/getProjectByUser'),
    method: 'post',
    params: dataModel
  })
}

// 模块列表
export function listByMap (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseModule/listByMap'),
    method: 'post',
    params: dataModel
  })
}
// 模块增删改
export function editorQxBaseModule (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseModule/editorQxBaseModule'),
    method: 'post',
    data: requestParam(dataModel)
  })
}
// 确认是否删除
export function isDirectDel (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseModule/isDirectDel'),
    method: 'post',
    params: dataModel
  })
}

// 新增案例
export function addQxBaseCase (dataModel) {
  // dataModel = JSON.stringify(dataModel)
  return request({
    url: requestUrl('/sysmanage/qxBaseCase/addQxBaseCase'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

// 修改用例详情
export function updateQxBaseCase (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseCase/updateQxBaseCase'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

// 查询用例详情
export function getQxBaseCase (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseCase/getQxBaseCase'),
    method: 'post',
    params: dataModel
  })
}

// 用例列表
export function CaselistByParam (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseCase/listByParam'),
    method: 'post',
    params: dataModel
  })
}

// 用例列表
export function batchUpdateCase (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseCase/batchUpdateCase'),
    method: 'post',
    params: dataModel
  })
}

// 历史记录查询
export function History (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxOperationHistory/listByMap'),
    method: 'post',
    params: dataModel
  })
}

// 用户名查询
export function queryAllUser (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseUser/queryUserListByMap'),
    method: 'post',
    params: dataModel
  })
}

export function getModuleByProject (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseModule/getModuleByProject'),
    method: 'post',
    params: dataModel
  })
}

export function listDictionaryByCodeArray (type) {
  return request({
    url: requestUrl('/sysmanage/qxDictionaryValue/selectAllDictionarys?remarks=' + type),
    method: 'post'
  })
}

// 根据项目导出到redmine的用户
export function redmineRootDist (type) {
  return request({
    url: requestUrl('/sysmanage/qxEhomeReport/getuserdict?projectId=' + type),
    method: 'post'
  })
}

// 导入到redmine接口
export function exportToRedmine (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseCase/exportToRedmine'),
    method: 'post',
    data: requestParam(dataModel)
  })
}

// 导出模块数据
export function exportModule (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseModule/exportModule'),
    method: 'post',
    params: dataModel
  })
}

// 导出在本地
export function exportToCsv (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseCase/exportToCsv'),
    method: 'post',
    params: dataModel
  })
}

// 检验测试id是否存在
export function isTaskExist (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseCase/isTaskExist?taskId=' + dataModel),
    method: 'post'
  })
}

// 导出接口
export function addExportParams (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxBaseCase/addExportParams'),
    method: 'post',
    data: requestParam(dataModel)
  })
}
