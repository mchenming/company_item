<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" class="searchform">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable @change="getDataList()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="reviewed()">审核</el-button>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle" :default-sort="{prop: 'userId', order: 'descending'}" tooltip-effect="dark" @sort-change="changeOrder"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="userId"
        sortable="custom"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="username"
        sortable="custom"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="chinesename"
        header-align="center"
        align="center"
        label="中文名">
      </el-table-column>
      <!-- <el-table-column width="160" align="left" label="头像">
        <template slot-scope="scope">
          <el-upload
            list-type="picture-card"
            action="/sysmanage/sys/user/uploadUserImage"
            :headers="myHeader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :data="{userId:scope.row.userId}"
            :beforeUpload="beforeAvatarUpload">
            <img v-if="scope.row.imagePath !== null&&scope.row.imagePath !== ''" style="height:100px" :src="'/uploadfile' + scope.row.imagePath" class="avatar">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="status"
        sortable="custom"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
          <el-tag v-else-if="scope.row.status === 2" size="small" type="danger">新注册</el-tag>
          <el-tag v-else size="small">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        sortable="custom"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="280"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button> -->
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.userId)">删除</el-button>
          <el-button type="text" size="small" @click="itemrootHandle(scope.row)">项目权限</el-button>
          <el-button type="text" size="small" @click="changePWD(scope.row)">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagenumchoose">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next"
        class="pagenum">
      </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 审核页面 -->
    <el-dialog
      title="审核"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <el-button type="primary" size="small" @click="reviewedPass()" class="smbtn">审核通过</el-button>
      <el-table
        ref="multipleTable"
        :data="revieweddataList"
        border
        v-loading="revieweddataListLoading"
        @selection-change="reviewedChangeHandle"
        :default-sort="{prop: 'userId', order: 'descending'}" tooltip-effect="dark" @sort-change="shchangeOrder"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="userId"
          sortable="custom"
          header-align="center"
          align="center"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="username"
          sortable="custom"
          header-align="center"
          align="center"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="chinesename"
          header-align="center"
          align="center"
          label="中文名">
        </el-table-column>
        <el-table-column
          prop="status"
          sortable="custom"
          header-align="center"
          align="center"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
            <el-tag v-else-if="scope.row.status === 2" size="small" type="danger">新注册</el-tag>
            <el-tag v-else size="small">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable="custom"
          header-align="center"
          align="center"
          width="180"
          label="创建时间"
          :formatter="dateFormat">
        </el-table-column>
      </el-table>
      <div class="pagenumchoose">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="reviewedpageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="reviewedpageSize"
          :total="reviewedtotalPage"
          popper-class="fixaa"
          layout="total, sizes, prev, pager, next"
          class="pagenum">
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 项目权限的遮罩层 -->
    <el-dialog
      title="修改权限"
      class="elroot"
      :visible.sync="itemroot"
      width="75%"
      top="7vh"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <!-- <span>修改权限</span> -->
      <div class="diobody">
        <div class="itile">
          <div class="username">用户名:{{itemrootobj.userName}}</div>
          <div class="name">姓名:{{itemrootobj.name}}</div>
        </div>
        
        <!-- <div style="text-align: center"> -->
        <!-- <el-transfer v-model="value" :data="data"></el-transfer> -->
          <el-transfer
          v-model="yesData"
          :props="{key: 'id',label:'name'}"
          :titles="['项目权限','已有权限']"
          @change="handleChange"
          filterable
          :data="noData" name='user'
          ref="mytransfer">
          </el-transfer>
        <!-- </div> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveProject()" type="primary" >保存</el-button>
        <el-button @click="handleClose">返回</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogPWD"
      width="30%"
      :close-on-click-modal='false'
      :before-close="ClosePWD">
      <div style="width:100%" v-loading='pwdLoading'>
        <div style="width:80%;">
          <el-form ref="formName" :model="newform" :rules="rules" label-width="100px">
            <el-form-item label="新密码" prop='pwd'>
              <el-input v-model="newform.pwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop='surePwd'>
              <el-input v-model="newform.surePwd" type="password"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div style="text-align:center">
          <el-button style="border:none;background-color:#4b78cd;color:#fff;" @click="saveNewPwn()">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import API from '@/api'
  import AddOrUpdate from './add-or-update'
  import util from '@/utils/util'
  import {systemlogStatis} from '@/api/modules/all'
  import Vue from 'vue'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/.test(value)) {
          callback(new Error('密码必须数字+字母+特殊字符组合方式，且长度为8位以上'))
        } else if (!this.newform.pwd && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
          // var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/;
        } else {
          callback()
        }
      }
      let validateComfirmPassword = (rule, value, callback) => {
        if (!this.newform.surePwd && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.newform.pwd !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      return {
        dialogPWD: false,
        pwdLoading: false,
        newform: {
          pwd: '',
          surePwd: '',
          userId: ''
        },
        rules: {
          pwd: [
            { required: true, validator: validatePassword, trigger: 'blur' }
          ],
          surePwd: [
            { required: true, validator: validateComfirmPassword, trigger: 'blur' }
          ]
        },
        // value: [1, 2],
        noData: [{id: 1, name: '测试1'}, {id: 2, name: '测试2'}, {id: 3, name: '测试3'}, {id: 4, name: '测试4'}, {id: 5, name: '测试5'}, {id: 6, name: '测试6'}, {id: 7, name: '测试7'}, {id: 8, name: '测试8'}, {id: 9, name: '测试9'}, {id: 10, name: '测试10'}, {id: 11, name: '测试11'}, {id: 12, name: '测试12'}, {id: 13, name: '测试13'}, {id: 14, name: '测试14'}, {id: 15, name: '测试15'}, {id: 16, name: '测试16'}, {id: 17, name: '测试217'}, {id: 18, name: '测试18'}],
        yesData: [1, 2, 3],
        multipleSelection: [],
        revieweddataListLoading: false,
        visible: false,
        dataForm: {
          userName: ''
        },
        revieweddataList: [],
        reviewedpageIndex: 1,
        reviewedpageSize: 10,
        reviewedtotalPage: 0,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        myHeader: { token: Vue.cookie.get('token') },
        status: '',
        orderkey: '',
        orderType: '',
        itemroot: false,
        itemrootobj: {
          userName: '',
          name: '',
          userEmail: '',
          projectIds: ''
        }
      }
    },
    components: {
      AddOrUpdate
    },
    created () {
      this.status = ''
      this.getDataList()
      this.getAllProject()
      document.onkeydown = function (ev) {
        var e = ev || event
        if (e.keyCode === 13) {
          e.preventDefault ? e.preventDefault() : (e.returnValue = false)
        }
      }
    },
    activated () {
      this.status = ''
      this.getDataList()
    },
    mounted () {
      let allObj = {
        url: this.$route.path,
        moduleName: '用户管理',
        token: this.$cookie.get('token')
      }
      systemlogStatis(allObj).then(res => {
        // console.log(res)
      })
      // this.$refs.mytransfer.$children["0"].$children["0"]._data.currentValue = ''
      // this.$refs.mytransfer.$children["3"].$children["0"]._data.currentValue = ''
    },
    methods: {
      // 弹出层方法
      handleChange (value, direction, movedKeys) {
        // console.log(value, direction, movedKeys)
        // console.log(this.yesData)
        if (direction) {
          // console.log(123)
          this.$refs.mytransfer.clearQuery('left')
          this.$refs.mytransfer.clearQuery('right')
        }
      },
      // 修改密码
      changePWD (data) {
        // console.log(data)
        this.dialogPWD = true
        this.newform.userId = data.userId
      },
      ClosePWD () {
        this.dialogPWD = false
        this.newform.pwd = ''
        this.newform.surePwd = ''
        this.newform.userId = ''
        this.pwdLoading = false
        this.$refs.formName.resetFields()
      },
      saveNewPwn () {
        // 保存新密码
        this.$refs.formName.validate((valid) => {
          if (valid) {
            this.$nextTick(() => {
              this.pwdLoading = true
            })
            const params = {
              newPassword: this.newform.pwd,
              userId: this.newform.userId,
              password: ''
            }
            API.user.updatePassword(params).then(({data}) => {
              if (data && data.msg === 'success') {
                this.$message({type: 'success', message: data.msg})
                this.ClosePWD()
              } else {
                this.pwdLoading = false
                this.$message({error: 'success', message: data.msg, duration: 5000})
              }
            })
          } else {
            return false
          }
        })
      },
      shchangeOrder (column, prop, order) {
        this.orderkey = column.prop
        this.orderType = ''
        if (column.order === 'ascending') {
          this.orderType = true
        } else {
          this.orderType = false
        }
        this.getreviewedData()
      },
      // 排序
      changeOrder (column, prop, order) {
        this.orderkey = column.prop
        this.orderType = ''
        if (column.order === 'ascending') {
          this.orderType = true
        } else {
          this.orderType = false
        }
        this.getDataList()
      },
      reviewedChangeHandle (val) {
        this.multipleSelection = val
      },
      reviewedPass () {
        var userIds = this.multipleSelection.map(item => {
          return item.userId
        })
        if (userIds.length > 0) {
          API.user.reviewedPass(userIds.join(','), '1').then(({data}) => {
            if (data.msg === 'success') {
              this.getreviewedData()
              this.getDataList()
              this.$message({message: '审核成功', type: 'success', duration: 2000})
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$message({type: 'info', message: '请选择需要审核的用户', duration: 2000})
        }
      },
      reviewed () {
        this.visible = true
        this.getreviewedData()
      },
      getreviewedData () {
        this.revieweddataListLoading = true
        var params = {
          page: this.reviewedpageIndex,
          limit: this.reviewedpageSize,
          status: '2',
          orderType: this.orderType,
          orderkey: this.orderkey
          // username: this.$store.state.user.name
        }
        API.user.list(params).then(({data}) => {
          if (data && data.code === 0) {
            this.revieweddataList = data.page.list
            this.reviewedtotalPage = data.page.totalCount
          } else {
            this.revieweddataList = []
            this.reviewedtotalPage = 0
          }
          this.revieweddataListLoading = false
        })
      },
      // 获取数据列表
      getDataList () {
        this.status = ''
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          username: this.dataForm.userName,
          status: this.status,
          orderType: this.orderType,
          orderkey: this.orderkey
          // username: this.$store.state.user.name
        }
        API.user.list(params).then(({data}) => {
          console.log(data)
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      dateFormat (row, column) {
        var date = row[column.property]
        return util.formatDate.format(new Date(date), 'yyyy-MM-dd hh:mm:ss')
      },
      // 每页数
      sizeChangeHandle (val) {
        // debugger
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 上传前校验
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpg,gif,png 格式!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      // 上传后校验
      handleAvatarSuccess (response, file, fileList) {
        if (response.msg === 'success') {
          this.$message({message: '上传成功', type: 'success', duration: 1500})
          this.getDataList()
        } else {
          this.$message.error('上传失败！' + response.msg)
        }
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.user.del(userIds).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      itemrootHandle (row) {
        this.yesData = []
        this.itemroot = true
        this.itemrootobj.userName = row.username
        this.itemrootobj.name = row.chinesename
        this.itemrootobj.userEmail = row.email
        const params = {
          userEmail: row.email,
          roleName: '管理人员'
        }
        API.user.getProjectsByUser(params).then(res => {
          this.yesData = res.data.rows
        })
      },
      getAllProject () {
        API.user.getAllProject().then(res => {
          this.noData = res.data.rows
        })
      },
      saveProject () {
        this.itemrootobj.projectIds = this.yesData.join(',')
        API.user.updateProByUser(this.itemrootobj).then(res => {
          if (res.data.result === 'success') {
            this.$message({message: '保存成功', type: 'success', duration: 1500})
            this.itemroot = false
          } else {
            this.$message.error('保存失败！' + res.data.result)
          }
        })
      },
      handleClose () {
        // this.$refs.mytransfer.$children['0'].$children['0']._data.currentValue = ''
        // this.$refs.mytransfer.$children['3'].$children['0']._data.currentValue = ''
        this.yesData = []
        this.$refs.mytransfer.clearQuery('left')
        this.$refs.mytransfer.clearQuery('right')
        this.itemroot = false
      }
    }
  }
</script>
<style>
.el-transfer-panel{
  width: 41%;
}
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
.smbtn{
  margin-bottom: 15px;
}
.el-button--primary{
  background-color: #4b78cd;
  border: none;
}
.el-button--primary:focus, .el-button--primary:hover{
  background-color: #4b78cd;
  border:none;
}
.mod-user{
   background-color: #fff;
} 

 .el-select-dropdown__wrap,.el-scrollbar__wrap{
   margin-bottom: 0px !important;
 }
 .pagenumchoose{
   width: 100%;
   background-color: #fff;
   height: 50px;
   display: flex;
   justify-content: flex-end;
   align-items: center;
 }
 .elroot .el-dialog__footer{
   width: 100%;
   display: flex;
   justify-content: center;
 }
 .el-transfer__button i, .el-transfer__button span{
   font-size: 20px;
 }
 /* .el-transfer-panel__list{
   overflow: visible ;
 } */
  .saltitle [class*=" el-icon-"], [class^=el-icon-] {
    color: #aaa !important;
  }
 .el-transfer-panel__body{
   height: 500px;
 }
 .el-transfer-panel__list.is-filterable{
   height: 450px;
 }
 .el-message,.el-message--success{
   z-index: 19999 !important;
  }
  .el-transfer__button{
    width: 45px;
  }
  .el-transfer__buttons{
    padding: 0 20px !important;
  }
</style>
<style scoped lang='scss'>
 .mod-user{
   background-color: #fff;
  //  margin-top: 44px;
 }
 .searchform{
   padding: 10px 15px;
   height: 60px;
   box-sizing: border-box;
 }
 .pagenum{
   display: flex;
   justify-content: flex-end;
   margin-right: 20px;
   padding: 10px 0;
   background-color: #fff;
   /* display: block; */
 }
 .diobody{
  //  height: 1000px;
    padding: 0 100px;

   .itile{
    display: flex;
    justify-content: space-between;
    margin-bottom: 50px;
    .username,
    .name{
      width: 45%;
    }
   }
 }
 .diofooter{
   width: 100%;
  //  margin: auto;
  margin-top: 30px;
  display: flex;
  justify-content: center;
 }

 .fixaa .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
</style>

<style>
  
  .diobody .el-button--primary.is-disabled{
    background-color: #fff !important;
    /* border-radius: 50% !important; */
    border-color: #ccc;
  }
  .diobody .el-button--primary{
    border-radius: 50% !important;
  }
  /* .mod-user >>> .el-transfer__button{
    border-radius: 50%;
  } */
</style>