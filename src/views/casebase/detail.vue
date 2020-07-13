<template>
    <div class="detail" v-loading='isloading'>
        <p style="font-size:20px;font-weight:700;margin:0;margin-left:15px;">案例详情</p>
        <div v-if="dataInfo.pageType===1">
        <el-row>
            <el-col :span="18" style="padding:0 0 0 15px;">
              <div style="margin-top:10px;display:flex;align-items:center">
                <div style="padding:3px 10px;border:1px solid #CCC;border-radius:5px;margin-right:15px">{{ruleForm.id}}</div>
                <span style="display:block;">{{ruleForm.subject}}</span>
              </div>
                <div class="base_tit">
                    <p style="margin-bottom:0;">描述</p>
                    <div style="min-height:48px;white-space: pre-line;padding:0 0 0 15px;">
                      {{ruleForm.description}}
                    </div>
                    <p style="margin-bottom:0;">前置条件</p>
                    <div style="min-height:48px;white-space: pre-line;padding:0 0 0 15px;">
                      {{ruleForm.precondition}}
                    </div>

                    <p>用例步骤</p>

                    <el-table :data="ruleForm.list" border class="seests">
                        <el-table-column
                          type="index"
                          label="编号"
                          align="center"
                          width="50">
                        </el-table-column>
                        <el-table-column
                          prop="operationSteps"
                          align="center"
                          label="操作步骤">
                          <template slot-scope="scope">
                            <div style="text-align:left;white-space: pre-line;">{{scope.row.operationSteps}}</div>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="expectedResult"
                          align="center"
                          label="用例预期结果">
                          <template slot-scope="scope">
                            <div style="text-align:left;white-space: pre-line;">{{scope.row.expectedResult}}</div>
                          </template>
                        </el-table-column>
                    </el-table>

                    <div>
                        <p>历史记录</p>
                        <div v-for="(value,index) in history" :key="index">
                            {{index+1}}.&nbsp;&nbsp;{{value.operationTime}}&nbsp;&nbsp;&nbsp;&nbsp;{{value.operationAuthor}}{{value.operationMethod}}
                            <div v-if="value.qohfList && value.qohfList.length>0" style="margin-left:18px">
                              <div v-for="item in value.qohfList" :key="item.operationTime">
                                <div>修改{{item.fieldChinesename}}， 旧值{{item.fieldOldValue}}， 新值{{item.fieldNewValue}}</div>
                              </div>
                            </div>
                        </div>
                    </div>

                </div>
                
            </el-col>
            <el-col :span="6">
                <div style="margin-left:15px;margin-right:15px;border:1px solid #eee;border-radius:3px;min-height:470px;">
                    <p style="margin-left:20px;font-weight:700;font-size:18px;">基本信息</p>
                    <div style="display:flex;padding:0 5px;margin:30px 0;">
                        <div style="font-size:14px;width:70px;text-align:right;margin-right:15px;">
                          项目
                        </div>
                         <span style="font-size:14px;">{{userIdgetName(ruleForm.projectId)}}</span>
                    </div>
                    <div style="display:flex;padding:0 5px;margin:30px 0;">
                        <div style="font-size:14px;width:70px;text-align:right;margin-right:15px;">
                            用例菜单
                        </div>
                         <span style="font-size:14px;flex:1;">{{ruleForm.moduleAllName}}</span>
                    </div>

                    
                    <div style="display:flex;padding:0 5px;margin:30px 0;">
                        <div style="font-size:14px;width:70px;text-align:right;margin-right:15px;">
                            用例类型
                        </div>
                         <span style="font-size:14px;">{{usergetName(ruleForm.caseType)}}</span>
                    </div>

                    
                    <div style="display:flex;padding:0 5px;margin:30px 0;">
                        <div style="font-size:14px;width:70px;text-align:right;margin-right:15px;">
                            测试类别
                        </div>
                         <span style="font-size:14px;">{{userIdgetStatus(ruleForm.testType)}}</span>
                    </div>

                    <div style="display:flex;padding:0 5px;margin:30px 0;">
                        <div style="font-size:14px;width:70px;text-align:right;margin-right:15px;">
                            优先级
                        </div>
                         <span style="font-size:14px;">{{userpriorityIdget(ruleForm.priorityId)}}</span>
                    </div>
                    <div style="display:flex;padding:0 5px;margin:30px 0;">
                        <div style="font-size:14px;width:70px;text-align:right;margin-right:15px;padding:0 0 0 5px;">
                          是否冒烟用例
                        </div>
                         <span style="font-size:14px;">{{getMouseName(ruleForm.isSmokeTest)}}</span>
                    </div>
                    <div style="display:flex;padding:0 5px;margin:30px 0;">
                        <div style="font-size:14px;width:70px;text-align:right;margin-right:15px;">
                            作者
                        </div>
                         <span style="font-size:14px;">{{getChineseName(ruleForm.authorId)}}</span>
                    </div>

                    <!-- <div style="display:flex;padding:0 15px;margin:15px 0;">
                        <div style="font-size:14px;width:70px;text-align:right;margin-right:20px;">
                            附件
                        </div>
                         <span style="font-size:14px;">陈明</span>
                    </div> -->
                </div>
            </el-col>
        </el-row>

        <div style="display:flex;justify-content:center;margin-top:20px;">
            <el-button @click="rocase">返回</el-button>
            <el-button @click="dataInfo.pageType=2">编辑</el-button>
            <!-- <el-button>复制</el-button>
            <el-button>删除</el-button> -->
        </div>
        </div>

        <div v-if="dataInfo.pageType===2">
            <div v-if="dataInfo.pageType===2" style="display:flex;justify-content:space-between">
            <div style="padding:0 0 0 15px;width:66%">
              <div style="margin-top:10px;display:flex;align-items:center">
                <div style="padding:10px;border:1px solid #CCC;border-radius:5px;margin-right:15px">{{ruleForm.id}}</div>
                <el-form :model="ruleForm" :rules="rules" ref="formNameSave" label-width="0" class="demo-ruleForm" style="flex:1;">
                  <el-form-item label="" prop="subject" style="width:100%;margin-bottom:0;">
                    <el-input v-model="ruleForm.subject" placeholder="请输入主题" maxlength="100" show-word-limit></el-input>
                  </el-form-item>
                </el-form>
              </div>
                <div class="base_tit">
                    <p>描述</p>
                    <div>
                      <el-input type="textarea" :autosize="{ minRows: 3}" v-model="ruleForm.description"></el-input>
                    </div>
                    <p>前置条件</p>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 3}"
                      placeholder="请输入内容"
                      v-model="ruleForm.precondition">
                    </el-input>

                    <p>用例步骤</p>

                    <el-table :data="ruleForm.list" row-key="id" border class="steps" ref="steps" :cell-style="{height:'100%'}">
                        <el-table-column
                          type="index"
                          label="编号"
                          align="center"
                          width="50">
                        </el-table-column>
                        <el-table-column
                          prop="operationSteps"
                          align="center"
                          label="操作步骤">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.operationSteps" :autosize="{ minRows: 2}" type="textarea"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="expectedResult"
                          align="center"
                          label="用例预期结果">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.expectedResult" :autosize="{ minRows: 2}" type="textarea"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          align="center"
                          width="100"
                          label="操作">
                          <template slot-scope="scope">
                            <div style="display:flex;justify-content:space-around">
                              <span class="fa fa-plus fa-x" style="color:#4b78cd;" @click="addremove(scope.$index, '1')"></span>
                              <span class="fa fa-arrows fa-x" style="color:#4b78cd;"></span>
                              <span class="fa fa-trash-o fa-x" style="color:#4b78cd;" @click="addremove(scope.$index, '3')"></span>
                            </div>
                          </template>
                        </el-table-column>
                    </el-table>

                    <!-- <p>备注说明</p>
                    <p>1213231221</p> -->
                    
                    <!-- <div style="width:100%;margin-bottom:50px;">
                      <quill-editor :options='editorOption'  ref="editorOption"  v-model="textabout" style="height:150px;"></quill-editor>
                    </div> -->
                    <!-- <p>附件</p> -->


                    <div>
                        <p>历史记录</p>
                        <div v-for="(value,index) in history" :key="index">
                            {{index+1}}.&nbsp;&nbsp;{{value.operationTime}}&nbsp;&nbsp;&nbsp;&nbsp;{{value.operationAuthor}}{{value.operationMethod}}
                            <div v-if="value.qohfList && value.qohfList.length>0" style="margin-left:18px">
                              <div v-for="item in value.qohfList" :key="item.operationTime">
                                <div>修改{{item.fieldChinesename}}， 旧值{{item.fieldOldValue}}， 新值{{item.fieldNewValue}}</div>
                              </div>
                            </div>
                        </div>
                    </div>

                </div>
                
            </div>
                <div style="width:33%">
                    <div style="width:90%;float:right;margin-right:15px;border:1px solid #eee;border-radius:3px;">
                        <p style="margin-left:20px;font-weight:700;font-size:18px;">基本信息</p>
                        <el-form ref="form" :model="ruleForm" label-width="80px" style="margin-left:10px">
                            <el-form-item label="项目">
                                <el-select v-model="ruleForm.projectId" placeholder="请选择" style="width:90%;" popper-class="caseFix" @change="changeitem(ruleForm.projectId)" @visible-change='resetOptions()'>
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
                            </el-form-item>

                            
                            <el-form-item label="用例菜单" class="modulewhere">
                              <el-select v-model="ruleForm.moduleId" placeholder="请选择" style="width:90%;" popper-class="caseFix" @visible-change='selchange'>
                                <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                                    <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchmoduleName' @input="searchInfoModule" @focus='leaveinpModule'></el-input>
                                  </div>
                                  <el-option
                                    v-for="item in modeloptions"
                                    :key="item.id"
                                    :label="item.moduleName"
                                    :value="item.id">
                                  </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="用例类型">
                                <el-select v-model="ruleForm.caseType" placeholder="请选择" style="width:90%;">
                                  <el-option
                                    v-for="item in userTypeArr"
                                    :key="item.dictionaryValueCode"
                                    :label="item.dictionaryValueName"
                                    :value="item.dictionaryValueCode">
                                  </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="测试类别">
                                <el-select v-model="ruleForm.testType" placeholder="请选择" style="width:90%;">
                                  <el-option
                                    v-for="item in stageArr"
                                    :key="item.dictionaryValueCode"
                                    :label="item.dictionaryValueName"
                                    :value="item.dictionaryValueCode">
                                  </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="优先级">
                                <el-select v-model="ruleForm.priorityId" placeholder="请选择" style="width:90%;">
                                  <el-option
                                    v-for="item in priorityArr"
                                    :key="(item.dictionaryValueCode-0)"
                                    :label="item.dictionaryValueName"
                                    :value="(item.dictionaryValueCode-0)">
                                  </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="是否冒烟用例" class="ismousecase">
                              <el-select v-model="ruleForm.isSmokeTest" placeholder="请选择" style="width:90%;">
                                  <el-option
                                    v-for="item in ismouseArr"
                                    :key="(item.dictionaryValueCode-0)"
                                    :label="item.dictionaryValueName"
                                    :value="(item.dictionaryValueCode-0)">
                                  </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="作者">
                              <el-select v-model="ruleForm.authorId" style="width:90%;" :disabled="true">
                                <el-option
                                  v-for="item in userDist"
                                  :key="item.userId-0"
                                  :label="item.chinesename"
                                  :value="item.userId-0">
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="用例状态">
                              <el-select v-model="ruleForm.status" placeholder="请选择" style="width:90%;">
                                  <el-option
                                    v-for="item in exampleuseArr"
                                    :key="item.dictionaryValueCode-0"
                                    :label="item.dictionaryValueName"
                                    :value="item.dictionaryValueCode - 0">
                                  </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div style="display:flex;width:100%;justify-content:center;margin-top:50px">
                <el-button style="color:#fff;border:none;background-color:#4b78cd" @click="saveChange">保存</el-button>
                <el-button style="color:#000;background-color:#fff;" @click="rocase">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Sortable from 'sortablejs'
import API from '@/api'
import {systemlogStatis} from '@/api/modules/all'
import { getUUID } from '@/utils'
import {getProjectByUser, updateQxBaseCase, getQxBaseCase, getModuleByProject, History, queryAllUser, listDictionaryByCodeArray} from '@/api/xyzqPort/casebase'
export default {
  data () {
    let subjectCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入主题'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        subject: [{ validator: subjectCheck, trigger: 'blur', required: true }]
      },
      tableData: [],
      exampleuseArr: [],
      ismouseArr: [],
      defaultProps: {
        children: 'children',
        label: 'moduleName',
        value: 'id'
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
      isloading: false,
      ruleForm: {
        // 模块id
        moduleId: '',
        moduleAllId: '',
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
        status: '',
        // createTime: '',
          // 用例步骤对象集合
        list: []
          // 用例步骤
        // operationSteps: [],
        //   // 用例预期结果结果
        // expectedResult: [],
        //   // 步骤排序序号
        // sortOrder: ''
      },
      userTypeArr: [],
      stageArr: [],
      priorityArr: [],
      modeloptions: [],
      modeloptionsAll: [],
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['code-block'],
            [{'header': 1}, {'header': 2}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            // [{'size': ['small', false, 'large', 'huge']}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'color': []}, {'background': []}],
            // [{'font': []}],
            [{'align': []}]
            // ['image']
          ]
        }
      },
      projectOptionsAll: [],
      projectOptions: [],
      searchText: '',
      searchmoduleName: '',
      dataInfo: {
        pageType: '',
        caseId: ''
      },
      history: [],
      userDist: [],
      height: '100'
    }
  },
  watch: {
    height (val) {
      // console.log(val)
    },
    'ruleForm.list': {
      handler (val) {
        // console.log(val)
        // this.$forceUpdate()
      },
      deep: true
    },
    'dataInfo.pageType': {
      handler (val) {
        if (Number(val) === 2) {
          this.$nextTick(() => {
            this.rowDrop()
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  // props: ['dataInfo'],
  created () {
    this.dataInfo.pageType = Number(this.$route.query.pageType)
    this.dataInfo.caseId = this.$route.query.caseId
    // 获取所有的人员信息
    this.getUserdist()
    // 获取所有的项目
    this.getAllproject()
    // 字典
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
    // console.log(this.dataInfo)
    // 获取列表详情信息
    this.getinfoData()
    this.getHistory()
  },
  methods: {
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
    selchange () {
      this.searchmoduleName = ''
      this.modeloptions = this.modeloptionsAll
    },
    // 获取所有的人员id信息
    getUserdist () {
      const row = {
        roleName: '',
        projectId: ''
      }
      queryAllUser(row).then(res => {
        let {data} = res.data
        this.userDist = data
      })
    },
    getChineseName (id) {
      let str = ''
      this.userDist.forEach(item => {
        if (Number(id) === Number(item.userId)) {
          str = item.chinesename
          return false
        }
      })
      return str
    },
    // 历史查询接口
    getHistory () {
      const row = {
        operationDataId: this.dataInfo.caseId,
        operationModule: 'case'
      }
      History(row).then(res => {
        // console.log(res.data.rows)
        let {rows} = res.data
        this.history = rows
      })
    },
    changeitem (id) {
      this.ruleForm.moduleId = ''
      this.getModuleList(id)
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
    getMouseName (id) {
      let str = ''
      this.ismouseArr.forEach(item => {
        if (Number(id) === Number(item.dictionaryValueCode)) {
          str = item.dictionaryValueName
          return false
        }
      })
      return str
    },
    addremove (index, type) {
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
    getModuleList (proid) {
      const row = {
        projectId: proid,
        id: '',
        moduleName: '',
        isDelete: 0,
        loginId: localStorage.getItem('userId'),
        serNo: getUUID()
      }
      getModuleByProject(row).then(res => {
        this.modeloptions = res.data.data
        this.modeloptionsAll = [...this.modeloptions]
      })
    },
    rocase () {
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
    userIdgetName (id) {
      let proname = ''
      this.projectOptionsAll.forEach(item => {
        if (Number(item.id) === Number(id)) {
          proname = item.name
          return false
        }
      })
      return proname
    },
    userIdgetStatus (id) {
      let proname = ''
      this.stageArr.forEach(item => {
        if (Number(item.dictionaryValueCode) === Number(id)) {
          proname = item.dictionaryValueName
          return false
        }
      })
      return proname
    },
    userpriorityIdget (id) {
      let proname = ''
      this.priorityArr.forEach(item => {
        if (Number(item.dictionaryValueCode) === Number(id)) {
          proname = item.dictionaryValueName
          return false
        }
      })
      return proname
    },
    // 获取详情信息
    getinfoData () {
      const row = {
        // 用例id
        id: this.dataInfo.caseId,
        loginId: localStorage.getItem('userId'),
        serNo: getUUID()
      }
      getQxBaseCase(row).then(res => {
        // console.log(res)
        this.ruleForm = res.data.data
        if (this.$route.query.moduleAllName) {
          this.ruleForm.moduleAllName = this.$route.query.moduleAllName
        }
        this.ruleForm.authorId = this.ruleForm.authorId - 0
        this.ruleForm.projectId = this.ruleForm.projectId + ''
        this.getModuleList(this.ruleForm.projectId)
        if (res.data.data.hasOwnProperty('list') && res.data.data.list.length === 0) {
          res.data.data.list = this.stepsArr
        }
      })
    },
    // 保存编辑
    saveChange () {
      this.$refs.formNameSave.validate((valid) => {
        if (valid) {
          let resultArr = []
          resultArr = this.ruleForm.list.filter(item => {
            return item.expectedResult !== ''
          })
          if (resultArr.length > 0) {
            this.isloading = true
            this.ruleForm.loginId = localStorage.getItem('userId')
            this.ruleForm.serNo = getUUID()
            this.ruleForm.list = this.ruleForm.list.filter(item => {
              return !(item.expectedResult === '' && item.operationSteps === '')
            })
            updateQxBaseCase(this.ruleForm).then(res => {
              // console.log(res)
              this.isloading = false
              if (res.data.result === 'success') {
                this.$message({message: '修改成功', type: 'success'})
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
                this.$message({type: 'error', message: res.data.result})
              }
            })
          } else {
            this.$message({type: 'error', message: '请填写至少一个用例预期结果'})
          }
        } else {
          return false
        }
      })
    },
    handleChange () {
    },
    rowDrop () {
       // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector('.steps .el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        draggable: '.el-table__row',
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.ruleForm.list.splice(oldIndex, 1)[0]
          _this.ruleForm.list.splice(newIndex, 0, currRow)
          _this.ruleForm.list.forEach((item, index) => {
            item.sortOrder = index + 1
          })
        }
      })
    },
    getAllproject () {
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            roleName: ''
          }
        //   this.userId = data.user.userId
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
    useridGetProname (id) {
      let str = ''
      this.projectOptionsAll.forEach(item => {
        if (Number(id) === Number(item.id)) {
          str = item.name
        }
      })
      return str
    },
    leaveinpModule () {
      this.searchmoduleName = ''
      this.searchInfoModule()
    },
    searchInfoModule () {
      var newVal = this.searchmoduleName
      var allList = []
      this.modeloptionsAll.forEach((item) => {
        if (item.moduleName.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.modeloptions = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.modeloptions = allList
      }
    },
    resetOptions () {
      this.searchText = ''
      this.projectOptions = this.projectOptionsAll
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
    }
  }
}
</script>

<style lang="scss" scoped>
    .detail{
        background-color: #fff;
        // padding: 25px 0 25px 15px;
        // margin:10px auto;
        padding:30px 0;
    }
    .base_tit p{
      font-weight: 700;
      font-size: 15px;
    }
</style>
<style scoped>
  .ismousecase >>> .el-form-item__label {
    line-height: initial;
  }
</style>
<style>
.modulewhere .el-icon-arrow-down{
  margin: 0;
}
  .detail .el-input__suffix{
    width: 40x;
  }
  .caseFix .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
  .steps td{
    padding: 0;
    /* height: 100%; */
  }
  .steps .cell {
    height: 100%;
    padding: 0;
  }
  /* .steps .cell .el-textarea .el-textarea__inner{
    height: 100% !important;
  } */
  .steps .el-textarea__inner{
    border: none;
  }
  .steps tbody tr:hover>td { 
    background-color:transparent!important
  }
  .steps th{
    padding-top: 5px;
    padding-bottom: 5px;
  }
.seests td {
  padding: 5px 15px;
}
.seests .cell {
  padding: 0;
}
.seests tbody tr:hover>td { 
  background-color:transparent!important
}
.seests th{
  padding-top: 5px;
  padding-bottom: 5px;
}
.seests td:first-child .cell{
  padding-left: 0;
}
.steps td:first-child .cell{
  padding-left: 0;
}
</style>