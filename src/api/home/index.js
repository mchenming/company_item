import request from '../request'
export function getTestTimes () {
  return request({
    url: '/sysmanage/qxManageReport/getTestTimes',
    method: 'post'
  })
}

export function getTestApps () {
  return request({
    url: '/sysmanage/qxManageReport/getTestApps',
    method: 'post'
  })
}

export function getDefectTotal () {
  return request({
    url: '/sysmanage/qxManageReport/getDefectTotal',
    method: 'post'
  })
}

export function getDefectBySeverity () {
  return request({
    url: '/sysmanage/qxManageReport/getDefectBySeverity',
    method: 'post'
  })
}

export function getTestSurvey () {
  return request({
    url: '/sysmanage/qxManageReport/getTestSurvey',
    method: 'post'
  })
}

export function getLatelyTest () {
  return request({
    url: '/sysmanage/qxManageReport/getLatelyTest',
    method: 'post'
  })
}

export function getDefectStat () {
  return request({
    url: '/sysmanage/qxManageReport/getDefectStat',
    method: 'post'
  })
}

export function getCaseBuild () {
  return request({
    url: '/sysmanage/qxTesttoolsReport/getCaseBuild',
    method: 'post'
  })
}
