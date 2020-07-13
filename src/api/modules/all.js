import request from '../request'
import requestUrl from '../requestUrl'

export function systemlogStatis (dataModel) {
  return request({
    url: requestUrl('/sysmanage/qxSysPageLog/addQxSysPageLog'),
    method: 'post',
    params: dataModel
  })
}
