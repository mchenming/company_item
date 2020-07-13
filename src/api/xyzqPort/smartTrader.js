import request from '../request'
import requestUrl from '../requestUrl'

export function getYanshiAndFangwenliang (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReport/getYanshiAndFangwenliang'),
    method: 'post',
    params: data
  })
}

export function getMaster (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReport/getMaster'),
    method: 'post',
    params: data
  })
}

export function getSyster (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReport/getSyster'),
    method: 'post',
    params: data
  })
}

export function getUseTime (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReport/getUseTime'),
    method: 'post',
    params: data
  })
}

export function getMoney (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReport/getMoney'),
    method: 'post',
    params: data
  })
}

// export function getJournal (data) {
//   return request({
//     url: requestUrl('/sysmanage/qxSmarttraderReport/getJournal'),
//     method: 'post',
//     params: data
//   })
// }

export function getJournal (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmtLog/getJournal'),
    method: 'post',
    params: data
  })
}

export function SmartlistByMap (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderFuncnum/listByMap'),
    method: 'post',
    params: data
  })
}

export function getYanshi (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReport/getYanshi'),
    method: 'post',
    params: data
  })
}

export function getYanshiLishi (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmarttraderReportSynchro/getYanshiLishi'),
    method: 'post',
    params: data
  })
}

export function getImportantDelayEchar (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmtFunctionCount/getImportantDelayEchar'),
    method: 'post',
    params: data
  })
}

export function getImportantDelay (data) {
  return request({
    url: requestUrl('/sysmanage/qxSmtFunctionCount/getImportantDelay'),
    method: 'post',
    params: data
  })
}
