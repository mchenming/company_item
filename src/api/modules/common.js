import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取验证码
export function captcha (uuid) {
  return requestUrl(`/captcha.jpg?uuid=${uuid}`)
}

// 登录
export function login (params) {
  return request({
    url: requestUrl('/sysmanage/sys/login'),
    method: 'post',
    data: requestParam(params)
  })
}

// 退出
export function logout () {
  return request({
    url: requestUrl('/sysmanage/sys/logout'),
    method: 'post',
    data: requestParam()
  })
}

export function getLoginSession () {
  return request({
    url: requestUrl('/center_api/redmine/login/loginsession'),
    method: 'post',
    data: requestParam()
  })
}

export function loginNew (params) {
  return request({
    url: requestUrl('/center_api/redmine/login/loginnew'),
    method: 'post',
    data: requestParam(params)
  })
}

export function userInfonew (params) {
  return request({
    url: requestUrl('/center_api/redmine/login/userInfonew'),
    method: 'post',
    data: requestParam(params)
  })
}

export function adduser (params) {
  return request({
    url: requestUrl('/sysmanage/sys/user/adduser'),
    method: 'post',
    data: requestParam(params)
  })
}

export function encode (input) {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  var output = ''
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4
  var i = 0
  input = this.utf8Encode(input)
  while (i < input.length) {
    chr1 = input.charCodeAt(i++)
    chr2 = input.charCodeAt(i++)
    chr3 = input.charCodeAt(i++)
    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63
    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
      enc4 = 64
    }
    output = output +
    keyStr.charAt(enc1) + keyStr.charAt(enc2) +
    keyStr.charAt(enc3) + keyStr.charAt(enc4)
  }
  return output
}

export function utf8Encode (string) {
  string = string.replace(/\r\n/g, '\n')
  var utftext = ''
  for (var n = 0; n < string.length; n++) {
    var c = string.charCodeAt(n)
    if (c < 128) {
      utftext += String.fromCharCode(c)
    } else if ((c > 127) && (c < 2048)) {
      utftext += String.fromCharCode((c >> 6) | 192)
      utftext += String.fromCharCode((c & 63) | 128)
    } else {
      utftext += String.fromCharCode((c >> 12) | 224)
      utftext += String.fromCharCode(((c >> 6) & 63) | 128)
      utftext += String.fromCharCode((c & 63) | 128)
    }
  }
  return utftext
}
