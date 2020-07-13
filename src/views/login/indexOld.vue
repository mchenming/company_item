<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper" id="mystyle" :style="{'background': bgImg,'backgroundSize':'cover'}">
      <div class="site-content">
        <div class="brand-info">
         </div>
        <div class="login-main">
          <!-- <img v-if="loginLogo !== ''&&loginLogo !== null" :src="require('../../assets/img/'+loginLogo)" alt="" class="loginlogo"> -->
          <p style="font-weight:bold;font-size:25px;color:#919191;text-align: center;">{{projectName}}</p>
          <div style="height:2px"></div>
          <h3 class="login-title">用户登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <!--<el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>-->
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
              <div style="height:10px"></div>
              <div  style="text-align:center;color:#999999">没有账号？
                <!-- <el-button class="login-btn-submit" type="primary" @click="registered()">注册</el-button> -->
                <a href="###" style="font-weight:bold" @click="registered()">注册</a>
                <!-- <a href="###" style="font-weight:bold" @click="dataVisitSubmit()">游客登录</a> -->
                <!-- <span v-if="ssoShow=='1'" style="text-align:center;color:#999999">&nbsp;或</span>
                <a v-if="ssoShow=='1'" href="###" style="font-weight:bold" @click="dataEiacSubmit()">OA登录</a> -->
              </div>
            </el-form-item>
            <el-form-item>
              <!--<el-button class="login-btn-submit" type="primary" @click="dataEiacSubmit()">单点登录</el-button>-->
            </el-form-item>
          </el-form>
        </div>

        <el-dialog title="注册" :close-on-click-modal="false" :visible.sync="visible">
          <el-form :model="zcdataForm" :rules="zcdataRule" ref="zcdataForm" @keyup.enter.native="registeredSave()" label-width="80px">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="zcdataForm.userName" placeholder="登录帐号"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="chineseName">
              <el-input v-model="zcdataForm.chineseName" placeholder="中文名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" :class="{ 'is-required': !zcdataForm.id }">
              <el-input v-model="zcdataForm.password" type="password" placeholder="密码" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !zcdataForm.id }">
              <el-input v-model="zcdataForm.comfirmPassword" type="password" placeholder="确认密码" show-password></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="zcdataForm.email" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="zcdataForm.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <!-- <el-form-item label="角色" size="mini" prop="roleIdList">
              <el-checkbox-group v-model="dataForm.roleIdList">
                <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="状态" size="mini" prop="status">
              <el-radio-group v-model="dataForm.status">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">正常</el-radio>
              </el-radio-group>
            </el-form-item> -->
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="registeredSave()">确定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import API from '@/api'
  import JSEncrypt from 'jsencrypt'
  import { getUUID } from '@/utils'
  import request from '@/api/request'
  import { mapMutations } from 'vuex'
  import { isEmail } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var zcvalidatePassword = (rule, value, callback) => {
        if (!this.zcdataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var zcvalidateComfirmPassword = (rule, value, callback) => {
        if (!this.zcdataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.zcdataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      // var validateMobile = (rule, value, callback) => {
      //   if (!isMobile(value)) {
      //     callback(new Error('手机号格式错误'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        visible: false,
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        zcdataForm: {
          id: '',
          userName: '',
          password: '',
          uuid: '',
          captcha: '',
          chineseName: '',
          email: '',
          mobile: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          chineseName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ]
        },
        zcdataRule: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          chineseName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          password: [
            { validator: zcvalidatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: zcvalidateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: validateEmail, trigger: 'blur' }
          ]
        },
        captchaPath: '',
        loginLogo: 'logo.png',
        projectName: '',
        bgImg: 'url(' + require('../../assets/img/home.png') + ')',
        ssoShow: '1' // 是否显示单点登录，显示1/不显示2
      }
    },
    beforeRouteEnter (to, from, next) {
      // console.log(localStorage.getItem('nextRoute'))
      next()
    },
    created () {
      if (localStorage.getItem('nextRoute') !== null) {
        this.dataForm.userName = JSON.parse(localStorage.getItem('nextRoute')).userName
      }
      this.loginEiac()
      this.listConfig()
    },
    methods: {
      // 表单提交
      registeredSave () {
        this.$refs['zcdataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'userId': this.zcdataForm.id || undefined,
              'username': this.zcdataForm.userName,
              'chinesename': this.zcdataForm.chineseName,
              'password': this.zcdataForm.password,
              'salt': '',
              'email': this.zcdataForm.email,
              'mobile': this.zcdataForm.mobile,
              'status': 2,
              'isWhitelist': 1,
              'roleIdList': [1]
            }
            var tick = API.user.add(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.$message({message: '注册成功，请联系管理员审核通过！', type: 'success', duration: 1500, center: true})
                this.visible = false
              } else {
                this.$message.error({message: data.result, center: true})
              }
            })
          }
        })
      },
      registered () {
        this.visible = true
      },
      // 提交表单
      dataFormSubmit () {
        // alert(JSON.parse(localStorage.getItem('nextRoute')))
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            API.common.getLoginSession().then(({data}) => {
              var encrypt = new JSEncrypt()
              // debugger
              encrypt.setPublicKey(data.data)
              var pwd = encrypt.encrypt(this.dataForm.password)
              console.log(pwd)
              var row = {
                username: this.dataForm.userName,
                password: pwd + ',' + this.dataForm.password,
                uuid: getUUID()
              }
              API.common.login(row).then(({data}) => {
                if (data && data.code === 0) {
                  localStorage.setItem('userId', data.userId)
                  if (data.menuList.length > 0) {
                    var menu = '/ReqPort'
                    var menuId = 0
                    var bo = true
                    for (let i = 0; i < data.menuList.length; i++) {
                      var list = data.menuList[i].list
                      if (list !== null) {
                        for (let j = 0; j < list.length; j++) {
                          const ele = list[j]
                          if (ele.url === menu) {
                            bo = false
                            menuId = data.menuList[i].menuId
                            break
                          }
                        }
                      }
                    }
                    if (bo) {
                      // console.log(data)
                      menu = data.menuList[0].url
                      if (menu === null) {
                        menu = data.menuList[0].list[0].url
                      }
                      menuId = data.menuList[0].menuId
                    }
                    console.log(123)
                    this.$router.push(menu)
                    localStorage.setItem('tabIndex', menuId)
                  } else {
                    this.$router.push('/successlogin')
                  }
                  this.$cookie.set('token', data.token)
                  // Vue.cookie.set('user_token', 'cWNfNWQ1NjVjNjExMzhiNw==')
                  Vue.cookie.set('user_token', data.user_token)
                  // this.$cookie.set('user_token', data.user_token)
                  sessionStorage.setItem('permissions', '[]')
                  // this.$router.push({ name: 'qualityPort' })
                  // localStorage.setItem('tabIndex', 0)
                  // localStorage.setItem('navId', 107)
                  this.UPDATE_USER_ID({ id: data.userId })
                  this.UPDATE_USER_NAME({ name: row.username })
                } else {
                  // this.getCaptcha()
                  // data.msg
                  this.$message.error({message: data.msg, center: true})
                }
              })
              // var params = {
              //   'user_name': this.dataForm.userName,
              //   'user_pwd': pwd,
              //   'uuid': this.dataForm.uuid
              //   // 'captcha': this.dataForm.captcha
              // }
              // // params.user_pwd = encrypt.encrypt(params.user_pwd)
              // API.common.loginNew(params).then(({data}) => {
              //   if (data.msg === '登录成功') {
              //     // this.$cookie.set('token', 'cWNfNWQ1NjVjNjExMzhiNw==')
              //     // this.$message({ title: '失败', message: data.msg, type: 'success', duration: 4000 })
              //     // this.$router.push({ name: 'eHomePort' })
              //     API.common.userInfonew(params).then(({data}) => {
              //       var row = {
              //         uuid: data.data.user_id,
              //         username: data.data.login_name,
              //         chinesename: data.data.user_name,
              //         email: data.data.user_email,
              //         password: params.user_pwd,
              //         loginType: '1'
              //       }
              //       // this.$cookie.set('user_token', 'cWNfNWQ1NjVjNjExMzhiNw==')
              //       API.common.login(row).then(({data}) => {
              //         if (data && data.code === 0) {
              //           this.$cookie.set('token', data.token)
              //           sessionStorage.setItem('permissions', '[]')
              //           this.$router.push({ name: 'qualityPort' })
              //           localStorage.setItem('tabIndex', 0)
              //           // localStorage.setItem('navId', 107)
              //           this.UPDATE_USER_ID({ id: data.userId })
              //           this.UPDATE_USER_NAME({ name: row.username })
              //         } else {
              //           // this.getCaptcha()
              //           this.$message.error(data.msg)
              //         }
              //       })
              //     })
              //   } else {
              //     var row = {
              //       username: this.dataForm.userName,
              //       password: this.dataForm.password,
              //       loginType: '2'
              //     }
              //     // this.$cookie.set('user_token', 'cWNfNWQ1NjVjNjExMzhiNw==')
              //     API.common.login(row).then(({data}) => {
              //       if (data && data.code === 0) {
              //         this.$cookie.set('token', data.token)
              //         this.$cookie.set('user_token', 'cWNfNWQ1NjVjNjExMzhiNw==')
              //         sessionStorage.setItem('permissions', '[]')
              //         this.$router.push({ name: 'qualityPort' })
              //         localStorage.setItem('tabIndex', 0)
              //         // localStorage.setItem('navId', 107)
              //         this.UPDATE_USER_ID({ id: data.userId })
              //         this.UPDATE_USER_NAME({ name: row.username })
              //       } else {
              //         // this.getCaptcha()
              //         this.$message.error(data.msg)
              //       }
              //     })
              //   }
              // })
            })
          }
        })
      },
      getUserInfo () {
        API.user.info().then(({data}) => {
          if (data && data.code === 0) {
            this.loading = false
            this.DELETE_CONTENT_TABS([])
            this.UPDATE_USER_ID({ id: data.user.userId })
            this.UPDATE_USER_NAME({ name: data.user.username })
          }
        })
      },
      // 游客登录
      dataVisitSubmit () {
        API.common.visitlogin().then(({data}) => {
          if (data && data.code === 0) {
            this.$cookie.set('token', data.token)
            this.$router.push({ name: 'qualityBoard' })
            let url = location.search
            if (url.indexOf('?url=') !== -1) {
              url = url.split('?url=')[1]
            }
          } else {
            // this.getCaptcha()
            this.$message.error({message: data.msg, center: true})
          }
        })
      },
      // 单点登录
      dataEiacSubmit () {
        // API.common.loginEiac().then(({data}) => {
        // })
        window.location.href = '/sysmanage/show/login'
      },

      // 单点登录
      dataEiacSubmit1 () {
        // API.common.loginEiac().then(({data}) => {
        // })
        request({
          url: '/sysmanage/show/loginMap',
          method: 'post',
          params: ''
        }).then(
            response => {
              var apiUrl = response.data.PostUrl
              var apiParam = response.data
              request({
                url: apiUrl,
                method: 'post',
                params: apiParam
              })
            }
          ).then(
          response => {
            var retParam = response.data
            alert(retParam)
          })
        // window.location.href = '/sysmanage/show/login'
      },

      loginEiac () {
        var url = location.search
        if (url.indexOf('?msg=') !== -1) {
          var msg = url.split('?msg=')[1]
          this.$message({ title: '失败', message: decodeURI(msg), type: 'error', duration: 4000, center: true })
        }
        if (url.indexOf('?username=') !== -1) {
          var userName = url.split('?username=')[1]
          this.$message({ title: '失败', message: decodeURI(userName), type: 'error', duration: 4000, center: true })
        }
        if (url.indexOf('?token=') !== -1) {
          var token = url.split('?token=')[1]
          var oldToken = this.$cookie.get('token')
          if (oldToken === null || oldToken === token) {
            this.$cookie.set('token', token)
            this.$router.push({ name: 'qualityBoard' })
          }
        }
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = API.common.captcha(this.dataForm.uuid)
      },
      // 获取配置信息
      listConfig () {
        // API.common.listConfig().then(({data}) => {
        //   var sysVerList = data.sysVerList
        //   for (var i = 0; i < sysVerList.length; i++) {
        //     // 用于控制显示项目名称（网页名称、系统名称、登陆后显示名称）
        //     if (sysVerList[i].sysconfName === 'project_name') {
        //       // 替换为表偏好设置系统
        //       this.projectName = sysVerList[i].sysconfValue
        //       // 导航title
        //       document.title = sysVerList[i].sysconfValue
        //       this.PROJECT_NAME({ projectName: sysVerList[i].sysconfValue })
        //     }
        //     // 用户搜索菜单时，缩写项目名
        //     if (sysVerList[i].sysconfName === 'project_short_name') {
        //       this.PROJECT_SHORT_NAME({ projectShortName: sysVerList[i].sysconfValue })
        //     }
        //     // 左侧导航颜色
        //     if (sysVerList[i].sysconfName === 'nav_color') {
        //       this.NAV_COLOR({ nav_color: sysVerList[i].sysconfValue })
        //     }
        //     // 1全屏/2非全屏
        //     if (sysVerList[i].sysconfName === 'portal_full_screen') {
        //       this.PORTAL_FULL_SCREEN({ portalFullScreen: sysVerList[i].sysconfValue })
        //     }
        //     // 登录logo（需要上传至代码目录中）
        //     if (sysVerList[i].sysconfName === 'login_logo') {
        //       // 替换为表偏好设置系统
        //       this.loginLogo = sysVerList[i].sysconfValue
        //       this.LOGIN_LOGO({ loginLogo: sysVerList[i].sysconfValue })
        //     }
        //     // 登录背景图片（需要上传至代码目录中）
        //     if (sysVerList[i].sysconfName === 'login_bg') {
        //       // this.bgImg = 'url(' + require('../../assets/img/' + sysVerList[i].sysconfValue) + ')'
        //       document.getElementById('mystyle').style.background = 'url(' + require('../../assets/img/' + sysVerList[i].sysconfValue) + ') 0% 0% / cover'
        //       this.LOGIN_BG({ loginBg: sysVerList[i].sysconfValue })
        //     }
        //     // 系统类别（页面显示名字）
        //     if (sysVerList[i].sysconfName === 'sys_category') {
        //       this.SYS_CATEGORY({ sysCategory: sysVerList[i].sysconfValue })
        //     }
        //     // 系统模块（页面显示名字）
        //     if (sysVerList[i].sysconfName === 'sys_model') {
        //       this.SYS_MODEL({ sysModel: sysVerList[i].sysconfValue })
        //     }
        //     // 业务类别（页面显示名字）
        //     if (sysVerList[i].sysconfName === 'busi_category') {
        //       this.BUSI_CATEGORY({ busiCategory: sysVerList[i].sysconfValue })
        //     }
        //     // 系统名称（页面显示名字）
        //     if (sysVerList[i].sysconfName === 'sys_name') {
        //       this.SYS_NAME({ sysName: sysVerList[i].sysconfValue })
        //     }
        //     // 单点登录链接是否显示
        //     if (sysVerList[i].sysconfName === 'sso_show') {
        //       this.ssoShow = sysVerList[i].sysconfValue
        //       this.SSO_SHOW({ ssoShow: sysVerList[i].sysconfValue })
        //     }
        //     // 菜单栏1竖版2横版
        //     if (sysVerList[i].sysconfName === 'relation_version') {
        //       this.RELATION_VERSION({ relationVersion: sysVerList[i].sysconfValue })
        //       localStorage.setItem('relationVersion', sysVerList[i].sysconfValue)
        //     }
        //   }
        // })
      },
      ...mapMutations(['PROJECT_NAME', 'UPDATE_USER_ID', 'UPDATE_USER_NAME', 'PROJECT_SHORT_NAME', 'RELATION_VERSION', 'NAV_COLOR', 'PORTAL_FULL_SCREEN', 'LOGIN_LOGO', 'LOGIN_BG', 'SYS_CATEGORY', 'SYS_MODEL', 'BUSI_CATEGORY', 'SYS_NAME', 'SSO_SHOW'])
    }
  }
</script>
<style>
.loginlogo{
        position: absolute;
    left: 50%;
    margin-left: -75px;
    top: 118px;
    width: 150px;
    height: 37.56px;
    z-index: 99;
}
</style>

<style lang="scss">
  .site-wrapper.site-page--login {
    // width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    // background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
    }
    .site-content__wrapper {
      // background-size: center ;
      background-position: 40% 50% !important;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 220px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0 0 22px 0;
      font-size: 48px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      left: 0;
      padding: 150px 60px 180px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
  .el-message,.el-message--error{
    min-width: 150px;
  }
</style>

