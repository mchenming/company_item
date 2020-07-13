import request from '../request'
import requestScan from '../requestScan'
import requestParam from '../requestParam'
import isInteger from 'lodash/isInteger'

// 获取用户列表
export function list (params) {
  return request({
    url: requestScan('/sys/user/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取用户信息
export function info (id) {
  return request({
    url: requestScan('/sys/user/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 修改密码
export function updatePassword (params) {
  return request({
    url: requestScan('/sys/user/password'),
    method: 'post',
    data: requestParam(params)
  })
}

// 添加用户
export function add (params) {
  return request({
    url: requestScan('/sys/user/save'),
    method: 'post',
    data: requestParam(params)
  })
}

// 修改用户
export function update (params) {
  return request({
    url: requestScan('/sys/user/update'),
    method: 'post',
    data: requestParam(params)
  })
}

// 删除用户
export function del (params) {
  return request({
    url: requestScan('/sys/user/delete'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 注册用户
export function registered (params) {
  return request({
    url: requestScan('/sys/save'),
    method: 'post',
    data: requestParam(params)
  })
}

// 注册用户
export function reviewedPass (userIds, status) {
  const params = {
    userIds: userIds,
    status: status
  }
  return request({
    url: requestScan('/sys/user/reviewedPass'),
    method: 'post',
    data: requestParam(params)
  })
}

// 根据用户获取项目id
export function getProjectsByUser (params) {
  return request({
    url: requestScan('/redmineUserProject/getProjectIdsByMap'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取所有项目
export function getAllProject (params) {
  return request({
    url: requestScan('/redmineUserProject/getAllProject'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

export function updateProByUser (params) {
  return request({
    url: requestScan('/redmineUserProject/updateProByUser'),
    method: 'post',
    params: params
  })
}
