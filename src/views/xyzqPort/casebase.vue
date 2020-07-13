<template>
    <div class="casebase" v-loading='moduleLoading' element-loading-text="正在加载中。。。">
        <el-row class="casetop">
            <el-col :span="4">
                <el-select v-model="listQuery.projectId" placeholder="请选择项目" popper-class="caseFix" @change="ChangeItem" style="width:90%" @visible-change='proslide'>
                  <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                    <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                  </div>
                  <el-option
                    v-for="item in projectOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-col>
            <el-col :span="20">
              <div style="display:flex;">
                <div style="width:65%;display:flex;">
                  <span style="display:inline-block;width:80px;text-align:center;">优先级</span>
                  <el-select v-model="priorityId" placeholder="请选择" multiple style="flex:1" popper-class="nocaseFix" @change='getnewList' clearable>
                    <el-option
                      v-for="item in priorityArr"
                      :key="item.dictionaryValueCode"
                      :label="item.dictionaryValueName"
                      :value="item.dictionaryValueCode">
                    </el-option>
                  </el-select>
                </div>
                <div style="width:18%;display:flex;" class="mouseSty">
                  <span style="display:inline-block;width:95px;text-align:center;">是否冒烟用例</span>
                  <el-select v-model="listQuery.isSmokeTest" placeholder="请选择" style="flex:1" popper-class="nocaseFix" @change='getnewList' clearable>
                    <el-option
                      v-for="item in ismouseArr"
                      :key="item.dictionaryValueCode"
                      :label="item.dictionaryValueName"
                      :value="item.dictionaryValueCode">
                    </el-option>
                  </el-select>
                </div>
                <div style="width:17%;display:flex;">
                  <span style="display:inline-block;width:70px;text-align:center;">用例类型</span>
                  <el-select v-model="listQuery.caseType" placeholder="请选择" style="flex:1" popper-class="nocaseFix" @change='getnewList' clearable>
                    <el-option
                      v-for="item in userTypeArr"
                      :key="item.dictionaryValueCode"
                      :label="item.dictionaryValueName"
                      :value="item.dictionaryValueCode">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="4">
                <el-button type="primary" plain size="small" style="width:90%;margin:10px 0 0 0;" class="modelbtn" @click="opendiong">维护模块</el-button>
                <el-input placeholder="输入关键字搜索" style="width:90%;margin:10px 0;" v-model="modName"></el-input>
                <div style="width:100%;overflow:auto;max-height:65vh">
                <el-tree
                  :data="data"
                  show-checkbox
                  node-key="id"
                  :default-expanded-keys='defaultShow'
                  :props="defaultProps"
                  ref="outTree"
                  :check-on-click-node="true"
                  :expand-on-click-node="false"
                  :default-checked-keys="moduleAllId"
                  @check="handleCheckChange"
                  :filter-node-method="filterNode">
                  <span class="custom-tree-node" slot-scope="{ node , data}">
                    <span>{{ data.moduleName }}({{data.caseNum}})</span>
                  </span>
                </el-tree>
                </div>
            </el-col>
            <el-col :span="20">
              <div style="display:flex;margin:10px 0;align-items:center;">
                <!-- <div> -->
                  <div style="width:18%;display:flex;align-items:center;">
                    <span style="display:inline-block;width:80px;text-align:center;">用例状态</span>
                    <el-select v-model="listQuery.status" placeholder="请选择" style="flex:1" popper-class="nocaseFix" @change='getnewList' clearable>
                      <el-option
                        v-for="item in exampleuseArr"
                        :key="item.dictionaryValueCode"
                        :label="item.dictionaryValueName"
                        :value="item.dictionaryValueCode">
                      </el-option>
                    </el-select>
                  </div>
                  <div style="width:18%;display:flex;align-items:center;">
                    <span style="display:inline-block;width:70px;text-align:center;">作者</span>
                    <el-select v-model="listQuery.authorId" placeholder="请选择" style="flex:1" popper-class="caseFix" @change='getnewList' clearable @visible-change='resetOptions()'>
                      <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                        <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:8px;" v-model='namesearchText' @input="searchInfoName" @focus='leaveinpName'></el-input>
                      </div>
                      <el-option
                        v-for="item in userDist"
                        :key="item.userId"
                        :label="item.chinesename"
                        :value="item.userId">
                      </el-option>
                    </el-select>
                  </div>
                  <div style="width:29%;padding-left:20px;">
                    <el-input v-model="listQuery.subject" placeholder="请输入用例主题搜索" style="" @keydown.enter.native="getnewList"></el-input>
                  </div>
                <!-- </div> -->
                  <div style="width:35%;display:flex;padding-left:30px;justify-content:space-between">
                    <el-button class="topbtn" @click="impCase">导入</el-button>
                    <el-button class="topbtn" @click="exportList">导出</el-button>
                    <el-button class="topbtn" @click="disCard">废弃</el-button>
                    <el-button class="topbtn" style="background-color:#4b78cd;color:#fff;" @click="openNewdiong()">新建</el-button>
                  </div>
                </div>
                <el-table
                  ref="multipleTable"
                  :data="tableDataList"
                  tooltip-effect="dark"
                  style="width: 100%;max-height:65vh;overflow-y:auto;"
                  v-loading='tableLoading'
                  border
                  :row-key="(row)=>{return row.id}"
                  @selection-change="handleSelectionChange"
                  class="ListStyle"
                  @sort-change="productchangeOrder">
                  <el-table-column type="selection" width="40" :reserve-selection="true">
                  </el-table-column>
                  <el-table-column label="用例ID" width="90" align="center" sortable="custom" prop="id">
                    <template slot-scope="scope">{{ scope.row.id }}</template>
                  </el-table-column>
                  <el-table-column prop="module_id" label="用例菜单" align="center" sortable="custom">
                    <template slot-scope="scope">
                      <div>
                        {{scope.row.moduleAllName}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="subject" label="主题" align="center">
                    <template slot-scope="scope">
                      <div style="color:#4b78cd;text-decoration:underline;cusor:pointer;" @click="showDiong(1, scope.row.id, scope.row.moduleAllName)">{{scope.row.subject}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="优先级" width="90" align="center" sortable="custom" prop="priority_id">
                      <template slot-scope="scope">
                        <div v-if="scope.row.priorityId === 1" style="width: 50px;height: 30px;background-color: rgba(103,195,58,0.1);line-height: 30px;margin:auto">
                          <span style="color: #67c23a">低</span></div>
                        <div v-else-if="scope.row.priorityId === 2" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto">
                          <span style="color: #0099ff">普通</span></div>
                        <div v-else-if="scope.row.priorityId === 3" style="width: 50px;height: 30px;background-color: rgba(255,153,0,0.1);line-height: 30px;margin:auto">
                          <span style="color: #ff9900">高</span></div>
                        <div v-else-if="scope.row.priorityId === 4" style="width: 50px;height: 30px;background-color: rgba(255,153,153,0.1);line-height: 30px;margin:auto">
                          <span style="color: #ff9999">紧急</span></div>
                        <div v-else-if="scope.row.priorityId === 5" style="width: 50px;height: 30px;background-color: rgba(245,108,108,0.1);line-height: 30px;margin:auto">
                          <span style="color: #f56c6c">立刻</span></div>
                      </template>
                  </el-table-column>
                  
                  <el-table-column prop="case_type" label="用例类型" width="105" align="center" sortable="custom">
                    <template slot-scope="scope">
                      {{usergetName(scope.row.caseType)}}
                    </template>
                  </el-table-column>
                  
                  <el-table-column prop="status" label="用例状态" width="90" min-width="60" align="center">
                    <template slot-scope="scope">
                      <div v-if="scope.row.status === ''"></div>
                      <div v-else-if="Number(scope.row.status) === 1">废弃</div>
                      <div v-else-if="scope.row.status === 0">正常</div>
                    </template>
                  </el-table-column>
                  
                  <el-table-column prop="is_smoke_test" label="是否冒烟用例" width="130" align="center" sortable="custom">
                    <template slot-scope="scope">
                      {{getMouseName(scope.row.isSmokeTest)}}
                    </template>
                  </el-table-column>
                  
                  <el-table-column prop="author_id" label="作者" width="90" align="center" sortable="custom">
                    <template slot-scope="scope">
                      {{getChineseName(scope.row.authorId)}}
                    </template>
                  </el-table-column>
                  
                  <el-table-column label="操作" align="center" width="150">
                      <template slot-scope="scope">
                          <a href="javascript:;" style="margin-left:10px;display:inline-block" @click="showDiong(1, scope.row.id, scope.row.moduleAllName)">查看</a>
                          <a href="javascript:;" style="margin-left:10px;display:inline-block" @click="showDiong(2, scope.row.id)">编辑</a>
                          <a href="javascript:;" style="margin-left:10px;display:inline-block" @click="openNewdiong(scope.row.id)">复制</a>
                      </template>
                  </el-table-column>
                </el-table>
                <div class="pagenumchoose">
                  <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="listQuery.page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="listQuery.pageSize"
                    :total="total"
                    layout="total, sizes, prev, pager, next"
                    class="pagenum">
                  </el-pagination>
                </div>
            </el-col>
        </el-row>
        <!-- 导入的对话框 -->
        <el-dialog
          title="导入"
          :close-on-click-modal='false'
          :visible.sync="dialogimport"
          @close='closeimport'
          v-loading= 'exportCaseLoading'
          element-loading-custom-class='loadingCase'
          element-loading-text="正在导入。。。"
          width="30%"
          class="daoru">
          <div>导入项目：{{useridGetProname(listQuery.projectId)}}</div>
          <el-row style="margin-top:15px;">
            <el-col :span='24' class="progessexport">
                <el-upload
                  action="/sysmanage/qxBaseCase/uploadCase"
                  :data="impData"
                  ref="upload"
                  :headers="myHeader"
                  :auto-upload="false"
                  :on-success='filesuccess'
                  :on-change="handleFilechange"
                  :on-error='fileerror'
                  :limit='1'
                  accept=".csv,.xlsx"
                  :file-list="fileList">
                <el-button slot="trigger" size="small" type="primary" style="background-color:#4b78cd;color:#fff;border:none;">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只支持csv格式文件</div>
                </el-upload>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-col :span="24" class="exitdiong">
              <el-button @click="submitUpload('mb')" style="background-color:#4b78cd;color:#fff;">下载模板</el-button>
              <el-button @click="submitUpload('data')" style="background-color:#4b78cd;color:#fff;">导 入</el-button>
            </el-col>
          </el-row>
        </el-dialog>
        <!-- 导出的对话框 -->
        <el-dialog
          title="导出"
          :close-on-click-modal='false'
          :append-to-body="true"
          v-loading='exportRedmined'
          element-loading-custom-class='loadingclass'
          element-loading-text="正在导出。。。"
          :visible.sync="dialogexport"
          width="50%">
          <!-- <el-row>
            <el-col :span="24">
              <el-radio-group v-model="radio" style="display:flex">
                <el-radio :label="3" style="width:150px">导出到Redmine</el-radio>
                <el-radio :label="6" style="width:150px">导出到本地</el-radio>
              </el-radio-group>
            </el-col>
          </el-row> -->
          <el-form :model="portData" :rules="rules" ref="formName" label-width="100px" @submit.native.prevent class="demo-ruleForm" v-if="radio === 3">
            <el-form-item label="测试任务ID" prop="id" style="margin-top:20px;">
              <el-input v-model="portData.id" style="width:25%"></el-input>
            </el-form-item>
          </el-form>

          <div style="margin-top:20px;" class="exportCase" v-if="radio===3">
            <el-table
              :data="exporttableData"
              style="width: 100%;margin-bottom: 20px;"
              v-loading='exportLoading'
              element-loading-text="正在加载中。。。"
              max-height="400"
              row-key="id"
              border
              default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
              <el-table-column
                prop="moduleName"
                label="节点">
                <template slot-scope="scope">
                  <div>{{scope.row.moduleName}}({{scope.row.caseNum}})</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="350"
                label="指派给">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.parentId" placeholder="输入名字搜索" popper-class="caseFix" style="width:100%" @change="changeAuthor(scope.row)" @visible-change='opensilid'>
                    <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                      <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchTextCaseName' @input="searchInfoCaseName" @focus='leaveinpCaseName'></el-input>
                    </div>
                    <el-option
                      v-for="item in redmineRootDist"
                      :key="item.id"
                      :label="item.text"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-row style="margin-top:20px;" :style="{'margin-top': radio===3? '20px' : '100px'}">
            <el-col :span="24" class="exitdiong">
              <el-button @click="exportCaseDiong" style="background-color:#4b78cd;color:#fff;">导 出</el-button>
            </el-col>
          </el-row>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
import API from '@/api'
import { getUUID } from '@/utils'
import {systemlogStatis} from '@/api/modules/all'
import {getProjectByUser, listByMap, queryAllUser, CaselistByParam, batchUpdateCase, redmineRootDist, listDictionaryByCodeArray, isTaskExist, addExportParams} from '@/api/xyzqPort/casebase'
import Sortable from 'sortablejs'

export default {
  data () {
    let idchecked = (rule, value, callback) => {
      // console.log(value)
      if (!value) {
        callback(new Error('请输入任务ID'))
      } else {
        isTaskExist(value).then(res => {
          // console.log(res)
          if (res.data.result === 'success') {
            callback()
          } else {
            callback(new Error(res.data.msg))
          }
        })
      }
    }
    return {
      searchTextCaseName: '',
      moduleLoading: false,
      exportLoading: false,
      tableLoading: false,
      exportCaseLoading: false, // 导入case的loading
      myHeader: {
        token: ''
      },
      impData: {
        projectId: '',
        createAuthor: '',
        serNo: ''
      },
      stageArr: [],
      childrenArr: [],
      projectName: '',
      modName: '',
      ismouse: '',
      id: 1000,
      // 是否冒烟
      ismouseArr: [],
      priorityId: [],
      userType: '',
      moduleAllId: [],
      listQuery: {
        // 项目ID
        projectId: '',
        // 标题
        subject: '',
        // 优先级
        priorityIds: '',
        // 模块ID
        moduleIds: '',
        // 作者
        authorId: '',
        // 用例类型
        caseType: '',
        // 是否冒烟 0是 1 否
        isSmokeTest: '',
        // 状态 0正常 1 废弃
        status: '0',
        page: 1,
        pageSize: 10,
        orderType: 'desc',
        orderField: 'id'
      },
      // 用例类型
      userTypeArr: [],
      exporttableData: [],
      exportModules: [],
      priorityArr: [],
      data: [],
      defaultShow: [0],
      defaultProps: {
        children: 'children',
        label: 'moduleName'
      },
      PropsType: {
        children: 'children',
        value: 'id',
        label: 'label'
      },
      options: [],
      // 用例状态
      exampleuseArr: [],
      value: '',
      input: '',
      tableData: [],
      tableDataList: [],
      multipleSelection: [],
      caseIds: '',
      total: 0,
      // 维护模块的对话框
      dialogVisible: false,
      // 导入的对话框
      dialogimport: false,
      // 导出的对话框
      dialogexport: false,
      // 查看编辑的对话框
      dialogdetails: false,
      radio: 3,
      fileList: [],
      // 所属类型的默认值数组类型
      modarr: [],
      titStr: '',
      projectOptions: [],
      projectOptionsAll: [],
      searchText: '',
      namesearchText: '',
      moduleIds: [],
      ruleForm: {
        // 模块id
        moduleId: '',
        // 项目id
        projectId: '',
        // 用例类型
        caseType: '',
        // 测试类别
        testType: '',
        // 是否冒烟0是1否
        isSmokeTest: '',
        // 标题
        subject: '',
        // 优先级
        priorityId: '',
        // 描述
        description: '',
        // 前置条件
        precondition: '',
        list: [
          {
            operationSteps: '',
            expectedResult: ''
          }, {
            operationSteps: '',
            expectedResult: ''
          }, {
            operationSteps: '',
            expectedResult: ''
          }
        ]
      },
      appendArr: [],
      moduleChildArr: [],
      parentId: '',
      fixedArr: [
        {
          label: ''
        }, {
          label: ''
        }, {
          label: ''
        }, {
          label: ''
        }
      ],
      userDist: [],
      userDistAll: [],
      portData: {
        id: ''
      },
      rules: {
        id: [{ validator: idchecked, trigger: 'blur', required: true }]
      },
      redmineRootDist: [],
      redmineRootDistAll: [],
      exportArr: [],
      exportRedmined: false
    }
  },
  components: {
    Sortable
  },
  destroyed () {
    sessionStorage.removeItem('projectId')
  },
  watch: {
    // $route: {
    //   handler (val, oldval) {
    //     console.log(1)
    //     console.log(val)
    //     console.log(oldval)
    //     if (val.name !== 'casebase') {
    //       console.log(11)
    //       sessionStorage.removeItem('projectId')
    //     }
    //   },
    //   deep: true
    // },
    // $route (to, from) {
    //   console.log(to)
    //   console.log(from)
    // },
    modName (val) {
      this.$refs.outTree.filter(val)
    },
    'listQuery.projectId': {
      handler (val) {
        // console.log(val)
        this.impData.projectId = val
        this.getUserdist()
      }
    },
    'fileList': {
      handler (val) {
        // console.log(val)
      },
      immediate: true
    }
  },
  created () {
    this.impData.createAuthor = localStorage.getItem('userId')
    this.impData.serNo = getUUID()
    this.myHeader.token = this.$cookie.get('token')
    // 获取所有的项目
    // this.getUserdist()
    this.getDictionary()
    this.getAllproject()
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
    // this.$refs.multipleTable.toggleRowSelection(this.tableDataList[6])
    // window.addEventListener('scroll', this.scrollBox, true)
    // this.$nextTick(() => {
    //   setTimeout(() => {
    //     document.querySelector('.ListStyle').scrollTop = 200
    //     this.$refs.multipleTable.bodyWrapper.scrollTop = this.$refs.multipleTable.bodyWrapper.scrollHeight
    //     console.log(document.querySelector('.ListStyle').scrollTop)
    //     console.log(this.$refs.multipleTable.bodyWrapper.scrollTop)
    //   }, 13)
    // })
    // console.log(document.querySelector('.ListStyle'))
  },
  methods: {
    // scrollBox () {
    //   console.log(document.querySelector('.ListStyle').scrollTop)
    // },
    // 项目下拉框的关闭打开回调
    proslide (show) {
      this.searchText = ''
      this.projectOptions = this.projectOptionsAll
    },
    getexportUserDist () {
      this.redmineRootDist = []
      redmineRootDist(this.listQuery.projectId).then(res => {
        this.redmineRootDist = res.data.data
        this.redmineRootDistAll = [...this.redmineRootDist]
      })
    },
    getRootName (id) {
      let str = ''
      this.redmineRootDistAll.forEach(item => {
        if (item.id === id) {
          str = item.text
        }
      })
      return str
    },
    getExportArr (data) {
      data.forEach(item => {
        let obj = {moduleId: item.id, userId: item.parentId, userName: this.getRootName(item.parentId)}
        this.exportArr.push(obj)
        if (item.children.length !== 0) {
          obj.isLast = 'no'
          this.getExportArr(item.children)
        } else {
          obj.isLast = 'yes'
          return false
        }
      })
    },
    exportCaseDiong: _.throttle(function () {
      let row = JSON.parse(JSON.stringify(this.listQuery))
      if (this.radio === 3) {
        this.$refs.formName.validate((valid) => {
          if (valid) {
            this.exportArr = []
            this.getExportArr(this.exporttableData)
            // console.log(this.exportModules)
            row.moduleIds = this.exportModules.join(',')
            row.taskId = this.portData.id
            row.list = this.exportArr
            row.ids = this.caseIds
            row.type = 'data'
            this.exportArr[0].moduleId = 0
            let senArr = []
            senArr = this.exportArr.filter(item => {
              return item.userId === '' && item.isLast === 'yes'
            })
            if (senArr.length > 0) {
              this.$message({type: 'error', message: '请选择指派用户'})
              return
            }
            this.exportRedmined = true
            // exportToRedmine(row).then(res => {
            //   if (res.data.result === 'success') {
            //     this.exportRedmined = false
            //     this.$message({type: 'success', message: res.data.msg})
            //     setTimeout(() => {
            //       this.dialogexport = false
            //     }, 500)
            //   } else {
            //     this.exportRedmined = false
            //     this.$message({type: 'error', message: res.data.msg, duration: 0, showClose: true, dangerouslyUseHTMLString: true})
            //   }
            // })
            addExportParams(row).then(res => {
              // console.log(res)
              this.exportRedmined = false
              if (res.data.result === 'success') {
                window.open('/sysmanage/qxBaseCase/exportToCsv?token=' + this.$cookie.get('token') + '&redisId=' + res.data.redisId + '&type=data')
                this.dialogexport = false
              } else {
                this.$message({type: 'error', message: res.data.result, duration: 0, showClose: true, dangerouslyUseHTMLString: true})
              }
            })
          } else {
            return false
          }
        })
      }
    }, 2000, {
      leading: true,
      trailing: false
    }),
    parentAll (data) {
      if (data && data.hasOwnProperty('children')) {
        data.children.forEach(item => {
          item.parentId = data.parentId
          if (item.children) {
            this.parentAll(item)
          }
        })
        // console.log(data.children)
        // this.parentAll(data.children[0])
      } else {
        return false
      }
    },
    opensilid (show) {
      this.searchTextCaseName = ''
      this.redmineRootDist = this.redmineRootDistAll
    },
    changeAuthor (data) {
      this.parentAll(data)
    },
    getMouseName (id) {
      let str = ''
      this.ismouseArr.forEach(item => {
        if (item.dictionaryValueCode - 0 === id - 0) {
          str = item.dictionaryValueName
        }
      })
      return str
    },
    getDictionary () {
      var codeAarray = ['1003', '1004', '1005', '1006', '1007']
      let abc = codeAarray.join(',')
      listDictionaryByCodeArray(abc).then(response => {
        this.userTypeArr = response.data[1003]
        this.stageArr = response.data[1004]
        this.priorityArr = response.data[1005]
        this.ismouseArr = response.data[1006]
        this.exampleuseArr = response.data[1007]
        // console.log(response)
      })
    },
    closeimport () {
      this.fileList = []
    },
    submitUpload (data) {
      if (data === 'mb') {
        // const row = {
        //   type: 'mb',
        //   list: []
        // }
        // var newrow = JSON.stringify(row)
        // newrow = encodeURIComponent(newrow)
        window.open('/sysmanage/qxBaseCase/exportToCsv?token=' + this.$cookie.get('token') + '&redisId=""&type=mb')
        this.dialogimport = false
      } else if (data === 'data') {
        if (this.fileList.length === 0) {
          this.$message({type: 'warning', message: '请上传导入文件'})
          return
        }
        this.$confirm(`所有测试用例将导入${this.useridGetProname(this.listQuery.projectId)}项目`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'conStyle'
        }).then(res => {
          this.exportCaseLoading = true
          this.$refs.upload.submit()
        })
      }
    },
    handleFilechange (file, fileList) {
      this.fileList = fileList
    },
    // 导入文件成功后的回调
    filesuccess (response, file, fileList) {
      this.fileList = []
      this.exportCaseLoading = false
      if (response.result === 'success') {
        this.$message({type: 'success', message: '导入成功'})
        this.dialogimport = false
        // 获取所有的模块
        // console.log(this.fileList)
        this.getModuleList()
        // 获取用例列表
        this.CaselistByParam()
      } else {
        this.$message({type: 'error', message: response.result, duration: 0, showClose: true, dangerouslyUseHTMLString: true})
      }
      this.$nextTick(() => {
        this.fileList = []
      })
    },
    fileerror (err, file, fileList) {
      this.exportCaseLoading = false
      this.$message({type: 'error', message: '导入失败'})
      this.$nextTick(() => {
        this.fileList = []
      })
    },
    getUserdist () {
      const row = {
        roleName: '',
        projectId: this.listQuery.projectId
      }
      queryAllUser(row).then(res => {
        let {data} = res.data
        this.userDist = data
        this.userDistAll = [...this.userDist]
      })
    },
    getChineseName (id) {
      let str = ''
      this.userDistAll.forEach(item => {
        if (Number(id) === Number(item.userId)) {
          str = item.chinesename
          return false
        }
      })
      return str
    },
    usergetName (id) {
      let name = ''
      this.userTypeArr.forEach(item => {
        if (Number(id) === Number(item.dictionaryValueCode)) {
          name = item.dictionaryValueName
          return false
        }
      })
      return name
    },
    // 勾选状态
    handleCheckChange (data, checked, indeterminate) {
      this.moduleAllId = checked.checkedKeys
      // console.log(checked)
      this.exportModules = [...checked.checkedKeys, ...checked.halfCheckedKeys]
      // console.log(this.exportModules)
      this.CaselistByParam()
    },
    // 获取用例列表详情
    CaselistByParam (first) {
      this.tableLoading = true
      this.listQuery.moduleIds = this.exportModules.join(',')
      this.listQuery.priorityIds = this.priorityId.join(',')
      this.listQuery.loginId = localStorage.getItem('userId')
      this.listQuery.serNo = getUUID()
      CaselistByParam(this.listQuery).then(res => {
        // console.log(res)
        this.tableLoading = false
        this.tableDataList = res.data.data
        this.total = res.data.total
        if (first) {
          let caseArr = []
          if (this.caseIds !== '') {
            caseArr = this.caseIds.split(',')
          }
          this.$nextTick(() => {
            if (typeof (this.$route.params.caseIds) !== 'undefined' && this.$route.params.caseIds !== '') {
              caseArr = this.$route.params.caseIds.split(',')
            }
            for (let i = 0; i < caseArr.length; i++) {
              let keyArr = this.tableDataList.filter(item => {
                return item.id == caseArr[i]
              })
              this.$refs.multipleTable.toggleRowSelection(keyArr[0], true)
            }
          })
        }
      })
    },
    // 废弃接口
    disCard () {
      if (this.multipleSelection.length === 0) {
        this.$message({message: '请选择用例', type: 'error', duration: 3000})
        return
      }
      let str = ''
      let strArr = []
      this.multipleSelection.forEach(item => {
        strArr.push(item.id)
      })
      str = strArr.join(',')
      const row = {
        ids: str,
        updateType: 'status',
        updateValue: '1',
        loginId: localStorage.getItem('userId'),
        serNo: getUUID()
      }
      batchUpdateCase(row).then(res => {
        if (res.data.result === 'success') {
          this.listQuery.page = 1
          this.CaselistByParam()
          this.caseIds = ''
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$message({type: 'error', message: res.data.result})
        }
      })
    },
    // 切换其他条件事件
    getnewList () {
      this.namesearchText = ''
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.CaselistByParam()
      this.getModuleList()
    },
    // 切换项目
    ChangeItem () {
      this.moduleAllId = []
      this.orderType = 'desc'
      this.orderField = 'id'
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      sessionStorage.setItem('projectId', this.listQuery.projectId)
      this.caseIds = ''
      this.listQuery.moduleIds = ''
      this.$refs.multipleTable.clearSelection()
      this.getModuleList()
      this.CaselistByParam()
      // }
    },
    // 获取所有模块的
    getModuleList () {
      // let ids = this.listQuery.projectId
      this.moduleLoading = true
      let row = JSON.parse(JSON.stringify(this.listQuery))
      row.id = ''
      row.isDelete = 0
      row.loginId = localStorage.getItem('userId')
      row.serNo = getUUID()
      row.getDataType = 'all'
      row.moduleIds = ''
      // console.log(row)
      listByMap(row).then(res => {
        let arr = []
        arr.push(res.data.data)
        this.data = arr
        this.moduleLoading = false
      })
    },
    getTimeByDate () {
      let date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const HH = (date.getHours()).toString().padStart(2, 0)
      const mm = (date.getMinutes()).toString().padStart(2, 0)
      const ss = (date.getSeconds()).toString().padStart(2, 0)
      // console.log(ss)
      const time = `${YY}-${MM}-${DD} ${HH}:${mm}:${ss}`
      return time
    },
    showDiong (type, caseId, moduleAllName) {
      // this.dialogdetails = true
      let row = {}
      if (Number(type) === 1) {
        row = {
          pageType: type,
          caseId: caseId,
          moduleAllName,
          projectId: this.listQuery.projectId,
          moduleIds: this.listQuery.moduleIds,
          priorityIds: this.listQuery.priorityIds,
          isSmokeTest: this.listQuery.isSmokeTest,
          caseType: this.listQuery.caseType,
          status: this.listQuery.status,
          authorId: this.listQuery.authorId,
          subject: this.listQuery.subject,
          page: this.listQuery.page,
          pageSize: this.listQuery.pageSize,
          exportModules: this.exportModules.join(','),
          caseIds: this.caseIds
        }
      } else {
        row = {
          pageType: type,
          caseId: caseId,
          projectId: this.listQuery.projectId,
          moduleIds: this.listQuery.moduleIds,
          priorityIds: this.listQuery.priorityIds,
          isSmokeTest: this.listQuery.isSmokeTest,
          caseType: this.listQuery.caseType,
          status: this.listQuery.status,
          authorId: this.listQuery.authorId,
          subject: this.listQuery.subject,
          page: this.listQuery.page,
          pageSize: this.listQuery.pageSize,
          exportModules: this.exportModules.join(','),
          caseIds: this.caseIds
        }
      }
      row.projectId = this.listQuery.projectId
      this.$router.push({query: row, name: 'detail'})
    },
    openNewdiong (caseId) {
      // console.log(caseId)
      if (caseId) {
        const row = {
          id: caseId,
          projectId: this.listQuery.projectId,
          moduleIds: this.listQuery.moduleIds,
          priorityIds: this.listQuery.priorityIds,
          isSmokeTest: this.listQuery.isSmokeTest,
          caseType: this.listQuery.caseType,
          status: this.listQuery.status,
          authorId: this.listQuery.authorId,
          subject: this.listQuery.subject,
          page: this.listQuery.page,
          pageSize: this.listQuery.pageSize,
          exportModules: this.exportModules.join(','),
          caseIds: this.caseIds
        }
        this.$router.push({name: 'newCase', query: row})
      } else {
        const row = {
          projectId: this.listQuery.projectId,
          moduleIds: this.listQuery.moduleIds,
          priorityIds: this.listQuery.priorityIds,
          isSmokeTest: this.listQuery.isSmokeTest,
          caseType: this.listQuery.caseType,
          status: this.listQuery.status,
          authorId: this.listQuery.authorId,
          subject: this.listQuery.subject,
          page: this.listQuery.page,
          pageSize: this.listQuery.pageSize,
          exportModules: this.exportModules.join(','),
          caseIds: this.caseIds
        }
        this.$router.push({name: 'newCase', query: row})
      }
    },
    impCase () {
      this.dialogimport = true
      // this.$message({message: '导入用例，只支持单项目导入，取页面上的项目名称，不取excel中的项目名称', type: 'warning', duration: 4500})
    },
    exportList () {
      this.dialogexport = true
      this.$nextTick(() => {
        this.exportLoading = true
        this.getexportUserDist()
        this.exporttableData = []
        this.portData.id = ''
        let row = JSON.parse(JSON.stringify(this.listQuery))
        row.id = ''
        row.ids = this.caseIds
        row.moduleIds = this.exportModules.join(',')
        row.isDelete = 0
        row.loginId = localStorage.getItem('userId')
        row.serNo = getUUID()
        row.getDataType = 'redmine'
        listByMap(row).then(res => {
          this.$nextTick(() => {
            this.exportLoading = false
          })
          res.data.data.id = -1
          let arr = []
          arr.push(res.data.data)
          // let arr = res.data.data.children
          this.exporttableData = JSON.parse(JSON.stringify(arr))
          this.addAuthorId(this.exporttableData)
        })
      })
    },
    addAuthorId (arr) {
      arr.forEach(item => {
        // item.parentId = ''
        this.$set(item, 'parentId', '')
        if (item.hasOwnProperty('children') && item.children.length > 0) {
          this.addAuthorId(item.children)
        } else {
          return false
        }
      })
    },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    useridGetProname (id) {
      let str = ''
      this.projectOptionsAll.forEach(item => {
        if (Number(id) === Number(item.id)) {
          str = item.name
        }
      })
      return str
    },
    leaveinpCaseName () {
      this.searchTextCaseName = ''
      this.searchInfoCaseName()
    },
    searchInfoCaseName () {
      var newVal = this.searchTextCaseName
      var allList = []
      this.redmineRootDistAll.forEach((item) => {
        if (item.text.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.redmineRootDist = [{name: '暂无数据', id: '', disabled: true}]
      } else {
        this.redmineRootDist = allList
      }
    },
    leaveinpName () {
      this.namesearchText = ''
      this.searchInfoName()
    },
    resetOptions () {
      this.namesearchText = ''
      this.userDist = this.userDistAll
    },
    searchInfoName () {
      var newVal = this.namesearchText
      var allList = []
      this.userDistAll.forEach((item) => {
        if (item.chinesename.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.userDist = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.userDist = allList
      }
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.projectOptionsAll.forEach((item) => {
        if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.projectOptions = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.projectOptions = allList
      }
    },
    // 获取所有的项目
    getAllproject () {
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            roleName: ''
          }
        //   this.userId = data.user.userId
          getProjectByUser(row).then(res => {
            // console.log(res)
            if (res.data.result === 'success') {
              this.projectOptions = res.data.list
              if (this.projectOptions.length > 0) {
                if (sessionStorage.getItem('projectId')) {
                  this.listQuery.projectId = sessionStorage.getItem('projectId')
                  // console.log(sessionStorage.getItem('projectId'))
                } else if (typeof (this.$route.params.projectId) !== 'undefined' && this.$route.params.projectId !== '') {
                  this.listQuery.projectId = this.$route.params.projectId
                } else {
                  this.listQuery.projectId = this.projectOptions[0].id
                }
              }
              // console.log(this.$route.params)
              if (typeof (this.$route.params.moduleIds) !== 'undefined' && this.$route.params.moduleIds !== '') {
                this.moduleAllId = this.$route.params.moduleIds.split(',')
                for (let i = 0; i < this.moduleAllId.length; i++) {
                  this.moduleAllId[i] = this.moduleAllId[i] - 0
                }
              }
              if (typeof (this.$route.params.priorityIds) !== 'undefined' && this.$route.params.priorityIds !== '') {
                this.priorityId = this.$route.params.priorityIds.split(',')
                for (let i = 0; i < this.priorityId.length; i++) {
                  this.priorityId[i] = this.priorityId[i] + ''
                }
              }
              if (typeof (this.$route.params.isSmokeTest) !== 'undefined' && this.$route.params.isSmokeTest !== '') {
                this.listQuery.isSmokeTest = this.$route.params.isSmokeTest + ''
              }
              if (typeof (this.$route.params.caseType) !== 'undefined' && this.$route.params.caseType !== '') {
                this.listQuery.caseType = this.$route.params.caseType + ''
              }
              if (typeof (this.$route.params.status) !== 'undefined' && this.$route.params.status !== '') {
                this.listQuery.status = this.$route.params.status + ''
              }
              if (typeof (this.$route.params.authorId) !== 'undefined' && this.$route.params.authorId !== '') {
                this.listQuery.authorId = this.$route.params.authorId - 0
              }
              if (typeof (this.$route.params.subject) !== 'undefined' && this.$route.params.subject !== '') {
                this.listQuery.subject = this.$route.params.subject
              }
              if (typeof (this.$route.params.page) !== 'undefined' && this.$route.params.page !== '') {
                this.listQuery.page = Number(this.$route.params.page)
              }
              if (typeof (this.$route.params.pageSize) !== 'undefined' && this.$route.params.pageSize !== '') {
                this.listQuery.pageSize = Number(this.$route.params.pageSize)
              }
              if (typeof (this.$route.params.exportModules) !== 'undefined' && this.$route.params.exportModules !== '') {
                this.exportModules = this.$route.params.exportModules.split(',')
              }
              // 获取所有的模块
              this.getModuleList()
              // 获取用例列表
              this.CaselistByParam('第一次')
              this.projectOptionsAll = [...res.data.list]
              // this.projectOptions.unshift({
              //   id: '',
              //   name: '全部'
              // })
            }
          })
        }
      })
    },
    // 过滤节点
    filterNode (value, data) {
      if (!value) return true
      return data.moduleName.indexOf(value) !== -1
    },
    opendiong () {
      // let pro = this.useridGetProname(this.listQuery.projectId)
      // if (!pro) {
      //   pro = '全部'
      // }
      // this.titStr = pro + '> 全部'
      // this.childrenArr = this.data[0].children
      // this.dialogVisible = true
      if (this.listQuery.projectId) {
        let sendrow = {
          reqId: this.listQuery.projectId,
          moduleIds: this.listQuery.moduleIds,
          priorityIds: this.listQuery.priorityIds,
          isSmokeTest: this.listQuery.isSmokeTest,
          caseType: this.listQuery.caseType,
          status: this.listQuery.status,
          authorId: this.listQuery.authorId,
          subject: this.listQuery.subject,
          page: this.listQuery.page,
          pageSize: this.listQuery.pageSize,
          exportModules: this.exportModules.join(','),
          caseIds: this.caseIds
        }
        this.$router.push({query: sendrow, name: 'defineModule'})
      } else {
        this.$message({message: '请选择项目', type: 'warning'})
      }
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
      let arr = []
      val.forEach(item => {
        arr.push(item.id)
      })
      // console.log(val)
      this.caseIds = arr.join(',')
    },
    // 排序
    productchangeOrder (column, prop, order) {
      // console.log(column.prop)
      this.listQuery.orderField = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.CaselistByParam()
    },
    sizeChangeHandle (val) {
      this.listQuery.pageSize = val
      this.CaselistByParam()
    },
    currentChangeHandle (val) {
      this.listQuery.page = val
      this.CaselistByParam()
    }
  }
}
</script>

<style lang="scss" scoped>
    .casebase{
        background-color: #fff;
        // margin-top: 44px;
        max-height: 95vh;
        overflow: hidden;
        padding: 10px 15px;
        .casetop{
            height: 50px;
            line-height: 50px;
        }
    }
    .topbtn{
      // padding:8px 10px;
      &:hover{
          background-color: #fff;
          color: #000;
          border-color: rgb(220, 223, 230);
      }
      &,.el-button:focus{
        background-color: #fff;
        border-color: rgb(220, 223, 230);
        color: #000;
      }
    }
    .el-button:focus{
      background-color: #fff;
      border-color: rgb(220, 223, 230);
      color: #000;
    }
    .modelbtn{
      border: none;
    }
    .modelbtn:hover,
    .modelbtn:focus{
      background-color: #ecf5ff;
      border-color: #b3d8ff;
      border: none;
      color: #409EFF;
    }
    // .exitdiong,.el-button:hover,
    .exitdiong,.el-button:focus{
      // background-color: #ecf5ff;
      border-color: #b3d8ff;
      color: #409EFF;
    }
  
    .pagenumchoose{
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding: 10px 0;
      background-color: #fff;
    }
    .exitdiong{
      display:flex;
      justify-content: center;
    }
    .diobox{
      display: flex;
      width: 100%;
      justify-content: center;
    }
    .inpbox{
      width: 100%;
    }
</style>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .topbtn,.el-button:focus{
    background-color: #fff;
    border-color: rgb(220, 223, 230);
    color: #000;
  }
  .casebase >>> .el-icon-arrow-down{
    margin: 0;
  }
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
  .casebase .el-icon-arrow-right{
    color: #aaa;
    font-size: 15px;
  }
</style>

<style>
.casebase .el-tree {
  width: 100%;
}

.casebase .el-tree>.el-tree-node {
  display: inline-block;
  min-width: 100%;
}
.el-tooltip__popper.is-dark {
  max-width: 80%;
}
.casebase .el-table::before{
  height: 0px;
}
.progessexport .el-upload-list__item .el-progress{
  top: 35px;
}
</style>
<style scoped>
  .exportCase .el-table--border{
    border-bottom: 1px solid #ebeef5;
  }
  .exportCase >>> tbody tr:hover>td { 
    background-color:transparent!important
  }
  .exportCase >>> .el-table .cell{
    /* padding: 0; */
  }
  .exportCase >>> .el-table td{
    padding: 0;
  }
  .exportCase >>> .el-select .el-input__inner{
    border: none;
  }
  .exportCase >>> th .cell {
    text-align: center;
  }
  .exportCase >>> .cell {
    display: flex;
  }
  .exportCase >>> .el-table__expand-icon {
    height: 23px;
    width: 23px;
    line-height: 23px;
  }
  .exportCase >>> .el-icon-arrow-right {
    color: #eee;
    font-size: 20px;
  }
  .daoru >>> .el-dialog__body {
    padding-top: 10px;
  }
  .exportCase >>> .el-loading-mask{
    z-index: 20000 !important;
  }
  .ListStyle >>> .el-table__body-wrapper{
    border-bottom: 1px solid #ebeef5;
  }
  .mouseSty >>> .el-input__inner{
    padding: 0 5px;
  }
</style>

<style>
  .loadingclass{
    width: 60%;
    height: 80vh;
    margin: 10vh auto 0;
    background-color: rgba(255,255,255,1);
  }
  .loadingCase{
    width:40%;
    margin: 10vh auto;
    height: 40vh;
    background-color: rgba(255,255,255,1);
  }
  .conStyle{
    color: #fff !important;
    background-color: #4b78cd !important;
    border: none !important;
  }
</style>