<template>
    <div class="newCase" v-loading='loading'>
        <div style="width:100%;padding:0 50px;display:flex;margin-bottom:30px;">
          <el-form :model="ruleForm" :rules="rules" ref="formNameSave" label-width="100px" class="demo-ruleForm" style="width:100%;">
            <div style="display:flex;width:100%;">
              <el-form-item label="项目" prop="projectId" style="flex:1;">
                <el-select v-model="ruleForm.projectId" placeholder="请选择" style="width:100%" popper-class="caseFix" @change="changeItem" @visible-change='rsetOption()'>
                  <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                    <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                  </div>
                  <el-option
                    v-for="item in projectOptionsAll"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="用例菜单" prop="moduleId" style="flex:1;">
                <el-select v-model="moduleIds" placeholder="请选择" style="width:100%;white-space: normal;word-break: break-all;" popper-class="caseFix" @visible-change='selchange'>
                  <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                    <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchmoduleName' @input="searchInfoModule" @focus='leaveinpModule'></el-input>
                  </div>
                  <el-option
                    v-for="item in data"
                    :key="item.id"
                    :label="item.moduleName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="display:flex;width:100%;">
              <el-form-item label="用例类型" prop="caseType" style="flex:1;">
                <el-select v-model="ruleForm.caseType" placeholder="请选择" style="width:100%" popper-class="nocaseFix">
                  <el-option
                    v-for="item in userTypeArr"
                    :key="item.dictionaryValueCode"
                    :label="item.dictionaryValueName"
                    :value="item.dictionaryValueCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否冒烟用例" prop="isSmokeTest" label-width="115px" style="flex:1;">
                <el-select v-model="ruleForm.isSmokeTest" placeholder="请选择" style="width:100%" popper-class="nocaseFix">
                  <el-option
                    v-for="item in ismouseArr"
                    :key="item.dictionaryValueCode-0"
                    :label="item.dictionaryValueName"
                    :value="item.dictionaryValueCode-0">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="测试类别" prop="testType" style="flex:1;">
                <el-select v-model="ruleForm.testType" placeholder="请选择" style="width:100%" popper-class="nocaseFix">
                  <el-option
                    v-for="item in stageArr"
                    :key="item.dictionaryValueCode"
                    :label="item.dictionaryValueName"
                    :value="item.dictionaryValueCode">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="优先级" prop="priorityId" style="flex:1;">
                <el-select v-model="ruleForm.priorityId" placeholder="请选择" style="width:100%" popper-class="nocaseFix">
                  <el-option
                    v-for="item in priorityArr"
                    :key="item.dictionaryValueCode-0"
                    :label="item.dictionaryValueName"
                    :value="item.dictionaryValueCode-0">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="display:flex;width:100%;">
              <el-form-item label="主题" prop="subject" style="flex:1;">
                <el-input v-model="ruleForm.subject" style="width:100%" maxlength="100" show-word-limit></el-input>
              </el-form-item>
            </div>
            <div style="display:flex;width:100%;">
              <el-form-item label="描述" prop="name" style="flex:1;">
                <el-input type="textarea"
                :autosize="{ minRows: 3}" 
                v-model="ruleForm.description" style="width:100%"></el-input>
              </el-form-item>
            </div>
            <div style="display:flex;width:100%;">
              <el-form-item label="前置条件" prop="name" style="flex:1;">
                <el-input type="textarea"
                :autosize="{ minRows: 3}" v-model="ruleForm.precondition" style="width:100%"></el-input>
              </el-form-item>
            </div>
            
            <div style="width:100%;display:flex;" class="filesets" ref="filesets">
              <el-form-item label="用例步骤" prop="name" style="flex:1;">
                <el-table :data="ruleForm.list" style="width: 100%" border row-key="id" class="steps" :cell-style="cellstyle">
                  <el-table-column type="index" label="编号" width="80" align="center">
                  </el-table-column>
                  <el-table-column label="操作步骤" align="center" prop="operationSteps">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.operationSteps" type="textarea" :autosize="{ minRows: 2}"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="用例预期结果" align="center" prop="expectedResult">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.expectedResult" type="textarea" :autosize="{ minRows: 2}"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120px;" align="center">
                    <template slot-scope="scope">
                      <!-- <span class="fa fa-arrows fa-x" style="color:#4b78cd;margin-right:20px"></span> -->
                      <span style="color:#4b78cd;margin-right:20px" class="fa fa-plus fa-x" @click="addremove(scope.$index, '1')"></span>
                      <span style="color:#4b78cd;" class="fa fa-remove fa-x" @click="addremove(scope.$index, '3')"></span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <el-row style="padding:30px 0;">
          <el-col :span="24" class="exitdiong" style="display:flex;justify-content:center;">
            <el-button @click="submitNesInfo" style="background-color:#4b78cd;color:#fff;">保存</el-button>
            <el-button @click="backreturn">返回</el-button>
          </el-col>
        </el-row>
    </div>
</template>

<script>
import API from '@/api'
import {systemlogStatis} from '@/api/modules/all'
import { getUUID } from '@/utils'
import {getProjectByUser, addQxBaseCase, getQxBaseCase, getModuleByProject, listDictionaryByCodeArray} from '@/api/xyzqPort/casebase'
export default {
  data () {
    let submitItem = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请重新选择项目'))
      } else {
        callback()
      }
    }
    let submitSubject = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入主题'))
      } else {
        callback()
      }
    }
    let submitModuleId = (rule, value, callback) => {
      if (!this.moduleIds) {
        // console.log(value)
        if (!this.searchmoduleName && this.modNum === 0) {
          callback(new Error('请选择模块'))
        }
      } else {
        callback()
      }
    }
    let submitCaseType = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择用例类型'))
      } else {
        callback()
      }
    }
    let submitIsSmokeTest = (rule, value, callback) => {
      if (value.length === 0) {
        // console.log(value)
        callback(new Error('请选择是否冒烟用例'))
      } else {
        callback()
      }
    }
    let submitTestType = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择测试类别'))
      } else {
        callback()
      }
    }
    let submitpriorityId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择优先级'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        projectId: [{ validator: submitItem, trigger: 'change', required: true }],
        subject: [{validator: submitSubject, trigger: 'blur', required: true}],
        moduleId: [{validator: submitModuleId, trigger: 'change', required: true}],
        caseType: [{validator: submitCaseType, trigger: 'change', required: true}],
        isSmokeTest: [{validator: submitIsSmokeTest, trigger: 'change', required: true}],
        testType: [{validator: submitTestType, trigger: 'change', required: true}],
        priorityId: [{validator: submitpriorityId, trigger: 'change', required: true}]
      },
      loading: false,
      ismouseArr: [],
      stageArr: [],
      moduleIds: '',
      projectOptionsAll: [],
      projectOptions: [],
      userTypeArr: [],
      priorityArr: [],
      data: [],
      dataAll: [],
      searchText: '',
      searchmoduleName: '',
      ruleForm: {
        // 模块id
        moduleId: '',
        // 项目id
        projectId: '',
        // 用例类型
        caseType: '1',
        // 测试类别
        testType: '2',
        // 是否冒烟用例0是1否
        isSmokeTest: 0,
        // 标题
        subject: '',
        // 优先级
        priorityId: 2,
        // 描述
        description: '',
        // 前置条件
        precondition: '',
        list: [
          {
            operationSteps: '',
            expectedResult: '',
            sortOrder: 1
          }, {
            operationSteps: '',
            expectedResult: '',
            sortOrder: 2
          }, {
            operationSteps: '',
            expectedResult: '',
            sortOrder: 3
          }
        ]
      },
      stepsArr: [
        {
          operationSteps: '',
          expectedResult: '',
          sortOrder: 1
        }, {
          operationSteps: '',
          expectedResult: '',
          sortOrder: 2
        }, {
          operationSteps: '',
          expectedResult: '',
          sortOrder: 3
        }
      ],
      modNum: 0,
      PropsType: {
        children: 'children',
        value: 'id',
        label: 'moduleName'
      }
    }
  },
  created () {
    this.getAllproject()
    this.getDictionary()
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '用例库',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    if (this.$route.query.id) {
      this.getinfoData()
    } else if (this.$route.query.projectId) {
      this.ruleForm.projectId = this.$route.query.projectId
      this.changeItem()
    }
  },
  components: {
  },
  methods: {
    cellstyle ({row, column, rowIndex, columnIndex}) {
      // console.log(row)
      // console.log(column)
      // console.log(rowIndex)
      // console.log(columnIndex)
      // if (rowIndex % 2 === 0) {
      //   return 'background-color: pink;height:100% !important'
      // } else {
      //   return 'background-color:green;height:100% !important'
      // }
      return 'height:100%'
    },
    getDictionary () {
      var codeAarray = ['1003', '1004', '1005', '1006', '1007']
      let abc = codeAarray.join(',')
      listDictionaryByCodeArray(abc).then(response => {
        this.userTypeArr = response.data[1003]
        this.stageArr = response.data[1004]
        this.priorityArr = response.data[1005]
        this.ismouseArr = response.data[1006]
        // 用例状态 = response.data[1007]
        // console.log(response)
      })
    },
    selchange (aa) {
      // 打开
      if (aa === true) {
        this.modNum = 1
        this.searchmoduleName = ''
        this.data = this.dataAll
      } else {
        // 关闭
        this.searchmoduleName = ''
        this.data = this.dataAll
        this.modNum = 0
      }
      // console.log(aa)
    },
    leaveinpModule () {
      this.searchmoduleName = ''
      this.searchInfoModule()
    },
    searchInfoModule () {
      var newVal = this.searchmoduleName
      var allList = []
      this.dataAll.forEach((item) => {
        if (item.moduleName.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.data = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.data = allList
      }
    },
    backreturn () {
      const row = {
        projectId: this.$route.query.projectId,
        moduleIds: this.$route.query.moduleIds,
        priorityIds: this.$route.query.priorityIds,
        isSmokeTest: this.$route.query.isSmokeTest,
        caseType: this.$route.query.caseType,
        status: this.$route.query.status,
        authorId: this.$route.query.authorId,
        subject: this.$route.query.subject,
        page: this.$route.query.page,
        pageSize: this.$route.query.pageSize,
        exportModules: this.$route.query.exportModules,
        caseIds: this.$route.query.caseIds
      }
      this.$router.push({name: 'casebase', params: row})
    },
    getinfoData () {
      const row = {
        // 用例id
        id: this.$route.query.id,
        loginId: localStorage.getItem('userId'),
        serNo: getUUID()
      }
      getQxBaseCase(row).then(res => {
        // console.log(res)
        this.ruleForm = res.data.data
        this.ruleForm.id = null
        this.ruleForm.projectId = this.ruleForm.projectId + ''
        if (this.ruleForm.moduleId) {
          this.moduleIds = this.ruleForm.moduleId
        }
        // this.getModuleList(this.ruleForm.projectId)
        this.changeItem()
        if (res.data.data.hasOwnProperty('list') && res.data.data.list.length === 0) {
          res.data.data.list = this.stepsArr
        }
      })
    },
    addremove (index, type) {
    //   console.log(index)
      // type ==='1' 是增加， '3'是删除
      if (type === '1') {
        // 增加
        let obj = {
          operationSteps: '',
          expectedResult: '',
          sortOrder: index + 2
        }
        this.ruleForm.list.forEach((item, i) => {
          if (i > index) {
            item.sortOrder = item.sortOrder + 1
          }
        })
        this.ruleForm.list.splice(index + 1, 0, obj)
      } else if (type === '3') {
        // 删除
        if (this.ruleForm.list.length > 1) {
          this.ruleForm.list.splice(index, 1)
        }
      }
    },
    submitNesInfo (formName) {
      // console.log(this.ruleForm)
      this.$refs.formNameSave.validate((valid) => {
        let noRestArr = []
        noRestArr = this.ruleForm.list.filter(item => {
          return item.expectedResult !== ''
        })
        // console.log(noRestArr)
        if (noRestArr.length > 0) {
          if (valid) {
            this.ruleForm.list = this.ruleForm.list.filter(item => {
              return !(item.operationSteps === '' && item.expectedResult === '')
            })
            this.loading = true
            this.ruleForm.moduleId = this.moduleIds
            this.ruleForm.authorId = Number(localStorage.getItem('userId'))
            this.ruleForm.loginId = localStorage.getItem('userId')
            this.ruleForm.status = 0
            this.ruleForm.serNo = getUUID()
            addQxBaseCase(this.ruleForm).then(res => {
              this.loading = false
              if (res.data.result === 'success') {
                this.$message({message: '新建成功', type: 'success'})
                setTimeout(() => {
                  const row = {
                    projectId: this.$route.query.projectId,
                    moduleIds: this.$route.query.moduleIds,
                    priorityIds: this.$route.query.priorityIds,
                    isSmokeTest: this.$route.query.isSmokeTest,
                    caseType: this.$route.query.caseType,
                    status: this.$route.query.status,
                    authorId: this.$route.query.authorId,
                    subject: this.$route.query.subject,
                    page: this.$route.query.page,
                    pageSize: this.$route.query.pageSize,
                    exportModules: this.$route.query.exportModules,
                    caseIds: this.$route.query.caseIds
                  }
                  this.$router.push({name: 'casebase', params: row})
                }, 1000)
              } else {
                this.$message({ type: 'error', message: res.data.result })
              }
            })
          } else {
            return false
          }
        } else {
          this.$message({type: 'warning', message: '请填写至少一个用例预期结果'})
        }
      })
    },
    changeItem () {
    //   console.log(this.ruleForm.projectId)
      const row = {
        projectId: this.ruleForm.projectId,
        id: '',
        moduleName: '',
        isDelete: 0,
        loginId: localStorage.getItem('userId'),
        serNo: getUUID()
      }
      getModuleByProject(row).then(res => {
        this.data = res.data.data
        this.dataAll = [...this.data]
        // console.log(res.data.data)
      })
    },
    handleChange (val) {
    },
    getAllproject () {
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            roleName: ''
          }
          getProjectByUser(row).then(res => {
            if (res.data.result === 'success') {
              this.projectOptions = res.data.list
              this.projectOptionsAll = [...res.data.list]
            }
          })
        }
      })
    },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    rsetOption () {
      this.searchText = ''
      this.projectOptionsAll = this.projectOptions
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.projectOptions.forEach((item) => {
        if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.projectOptionsAll = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.projectOptionsAll = allList
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .newCase{
        background-color: #fff;
        padding-top: 30px;
    }
</style>

<style lang="scss">
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .caseFix .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
  .nocaseFix .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
  .steps td{
    padding: 0;
    height: 100%;
  }
  .steps .cell {
    padding: 0;
    height: 100%;
    // line-height: initial;
  }
  .steps .el-textarea__inner{
    border: none;
    // height: 100% !important;
  }
  .steps tbody tr:hover>td { 
    background-color:transparent!important
  }
  .steps th{
    // padding-top: 5px;
    // padding-bottom: 5px;
    padding: 0;
  }
  .steps td:first-child .cell{
    padding-left: 0;
  }
</style>