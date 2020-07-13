<template>
  <div class="planEcharts">
    <div style="display:flex;align-items:center;background: white;height:50px;">
      <div style="margin-left:30px">项目</div>
      <el-select filterable v-model="listQuery.name" style="margin-left:10px" @change="tabClick" class='serversel' popper-class='mouthFix'>
        <el-input placeholder="请输入搜索内容" style="padding:0 15px;" v-model='searchText' @input="searchInfo" @focus="resnow"></el-input>
        <el-option
          v-for="item in projectOptions"
          :key="item.id"
          :label='item.text'
          :value='item.id'>
        </el-option>
      </el-select>
      <div style="margin-left:30px">扫描种类</div>
      <el-select filterable v-model="listQuery.type" style="margin-left:10px" @change="tabClick">
        <el-option
          v-for="item in scantypeAllOptions"
          :key="item.id"
          :label='item.text'
          :value='item.id'>
        </el-option>
      </el-select>
      <!-- <div style="margin-left:30px" v-if="tabActiveName === 'one'">时间</div>
      <el-date-picker
        v-model="queryTime"
        type="daterange"
        align="right"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="getTimeCheck"
        style="margin-left:15px"
        :picker-options="pickerOptions"
        v-if="tabActiveName === 'one'">
      </el-date-picker> -->
    </div>
    <div style="background-color: white;height:90px;">
      <el-row>
        <el-col :span="5">
            <div class="todaytask">
                <span class="titlecss">任务数</span><br/>
                <span class="numcss">{{taskNum}}</span>
            </div>
        </el-col>
        <el-col :span="5">
            <div class="scanpass">
                <span class="titlecss">扫描通过</span><br/>
                <span class="numcss">{{taskadopt}}</span>
            </div>
        </el-col>
        <el-col :span="5">
            <div class="scannotpass">
                <span class="titlecss">扫描未通过</span><br/>
                <span class="numcss">{{taskNotpass}}</span>
            </div>
        </el-col>
        <el-col :span="5">
            <div class="endtask">
                <span class="titlecss">已终止任务</span><br/>
                <!-- <span class="numcss">{{topTotal.stopTotal}}</span> -->
                <span class="numcss">0</span>
            </div>
        </el-col>
        <el-col :span="4">
            <div class="todaytask">
                <span class="titlecss">定时任务</span><br/>
                <!-- <span class="numcss">{{topTotal.cronTotal}}</span> -->
                <span class="numcss">--</span>
            </div>
        </el-col>
      </el-row>
    </div>
    <div style="background-color: white;width: 100%" v-loading='boxLoading'>
        <el-tabs v-model="tabActiveName" @tab-click='tabClick()' style="width: 95%;margin-left: 2%;">
            <el-tab-pane label="扫描服务" name="one">
                <el-table border ref="multipleTable" :data="tableData.slice((pageRow.pageNo-1)*pageRow.pageSize,pageRow.pageNo*pageRow.pageSize)" v-loading="listLoading" element-loading-text="加载中。。。"
                tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;">
                <el-table-column align="center" min-width=100 label="项目" height=33 show-overflow-tooltip>
                    <template slot-scope='scope'>
                    <el-button type='text' @click="goDeatil(scope.row)" ref="itemname">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width=160 label="路径" height=33 show-overflow-tooltip>
                    <template slot-scope='scope'>
                        <span>{{scope.row.repertory}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width=80 label="扫描种类" height=33>
                    <template slot-scope='scope'>
                      <div v-for="item in scantypeOptions" :key="item.id">
                        <span v-if="item.id === scope.row.type[0]">{{item.text}}</span>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width=100 label="扫描规则" height=33 show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div v-for="item in sensitiveOptions" :key="item.id">
                        <span v-if="item.id === scope.row.sensitives[0]">{{maxText(item.name)}}</span>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width=110 label="最后执行时间" height=33>
                    <template slot-scope='scope'>
                    <div>{{scope.row.latest_scan_time}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width=60 label="执行状态" height=33>
                    <template slot-scope='scope'>
                      <div v-for="item in runCountOptions" :key="item.id">
                        <span v-if="item.id === scope.row.running_count">{{item.text}}</span>
                      </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width=60 label="执行结果" height=33>
                    <template slot-scope='scope'>
                      <!-- <div v-if="Number(scope.row.ccc)===0">通过</div>
                      <div v-else-if="Number(scope.row.ccc)!==0">未通过</div> -->
                      <!-- {{scope.row.result}} -->
                      <div v-if="Number(scope.row.result)===0">通过</div>
                      <div v-else-if="Number(scope.row.result)===1">未通过</div>
                      <div v-else-if="Number(scope.row.result)===2">待核查</div>
                      <div v-else-if="Number(scope.row.result)===-1">--</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width=160 label="操作" height=33>
                    <template slot-scope='scope'>
                      <div style="text-align: center">
                        <el-button v-if="scope.row.running_count !== 1" @click.stop="startScan(scope.row)" type="primary" size="mini" style="text-align: center">
                            扫描
                        </el-button>
                        <el-button v-if="scope.row.running_count !== 1" @click.stop="setScanTask(scope.row)" type="primary" size="mini">
                            配置
                        </el-button>
                        <el-button v-if="scope.row.running_count === 1" @click.stop="stopScan(scope.row)" type="primary" size="mini">
                            终止
                        </el-button>
                        <el-button v-if="scope.row.running_count !== 1" type="primary" size="mini" @click="goDeatil(scope.row)">报告</el-button>
                      </div>
                    </template>
                </el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- <el-tab-pane label="定时任务" name="two">
              <div>
                <el-button @click.stop="getCronJobList()" type="primary" size="mini">
                    刷新
                </el-button>
                <el-button @click.stop="addCronJob()" type="primary" size="mini">
                    新增任务
                </el-button>
              </div>
                <el-table border ref="multipleTable" :data="cronJobList" v-loading="listLoading" element-loading-text="加载中。。。"
                tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;">
                <el-table-column align="center" width=60 label="序号" type="index" height=33>
                    <template slot-scope='scope'>
                    <div  v-html="scope.row[0]"></div>
                    </template>
                </el-table-column>
                <el-table-column align="center" width=130 label="扫描任务时间" height=33>
                    <template slot-scope='scope'>
                      <div>{{scope.row[1]}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width=150 label="任务项目" height=33>
                    <template slot-scope='scope'>
                    <div  style="text-align:left">{{scope.row[3]}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" width=150 label="最后执行时间" height=33>
                    <template slot-scope="scope">
                    <div >{{scope.row[4]}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" width=110 label="执行状态" height=33>
                    <template slot-scope="scope">
                    <div >{{scope.row[2]}}</div>
                    </template>
                </el-table-column> -->

                <!-- 不要 -->
                <!-- <el-table-column align="center" width=100 label="执行结果" height=33>
                    <template slot-scope="scope">
                    <div v-if="scope.row[2] === '通过'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;">
                        <span style="color: #67c23a">{{scope.row[2]}}</span>
                    </div>
                    </template>
                </el-table-column> -->
                <!-- 不要 -->
                
                <!-- <el-table-column align="center" width=220 label="操作" height=33>
                    <template slot-scope='scope'>
                      <el-button @click.stop="setCronJob(scope.row)" type="primary" size="mini">
                          配置
                      </el-button>
                      <el-button @click.stop="setCronDeatil(scope.row)" type="primary" size="mini">
                          详情
                      </el-button>
                      <el-button @click.stop="deleteCron(scope.row)" type="primary" size="mini">
                          删除
                      </el-button>
                    </template>
                </el-table-column>
                </el-table>
            </el-tab-pane> -->
        </el-tabs>
        <!-- 分页 -->
        <div  class="pagination-container" style="background-color: white">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageRow.pageNo"
            :page-sizes="[10,20,30, 50]" :page-size="pageRow.pageSize" layout="total, sizes, prev, pager, next" :total="total">
            </el-pagination>
        </div>
        <!-- 扫描任务配置 -->
        <el-dialog title="配置" :visible.sync="dialogFormVisible">
          <el-form :model="editForm">
            <div style="margin-left: 2%"><b>敏感词扫描配置</b></div>
            <el-form-item label="扫描种类" label-width="20%">
              <el-select multiple style="width: 80%;" v-model="editForm.type" placeholder="请选择扫描种类">
                <el-option
                  v-for="item in scantypeOptions"
                  :key="item.id"
                  :label='item.text'
                  :value='item.id'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目名称" label-width="20%">
              <el-input disabled style="width: 80%;" v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="路径" label-width="20%">
              <el-input disabled style="width: 80%;" v-model="editForm.repertory" type="textarea" :rows="6"></el-input>
            </el-form-item>
            <div style="margin-left: 2%"><b>敏感词扫描配置</b></div>
            <el-form-item label="敏感词扫描规则" label-width="20%">
              <el-select multiple style="width: 80%;" v-model="editForm.sensitives" placeholder="请选择扫描种类">
                <el-option
                  v-for="item in sensitiveOptions"
                  :key="item.id"
                  :label='item.name'
                  :value='item.id'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="敏感词忽略目录" label-width="20%">
              <el-input style="width: 80%;" v-model="editForm.ignore_files"></el-input>
            </el-form-item>
            <el-form-item label="敏感词忽略关键字" label-width="20%">
              <el-input style="width: 80%;" v-model="editForm.ignore_keywords"></el-input>
            </el-form-item>
            <el-form-item label="是否忽略注释行" label-width="20%">
              <el-radio v-model="editForm.ignore_comment_lines" :label=true>忽略</el-radio>
              <el-radio v-model="editForm.ignore_comment_lines" :label=false>不忽略</el-radio>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button :disabled="saveButtonDis" type="primary" @click="submitSave">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 定时任务配置 -->
        <el-dialog title="定时任务" :visible.sync="CronJobVisible">
          <el-form :model="cronForm">
            <el-form-item label="时间" label-width="15%">
              <el-time-select
                style="width: 35%;"
                v-model="cronForm.job_time"
                :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '23:00'
                }"
                placeholder="选择时间">
              </el-time-select>
            </el-form-item>
            <el-form-item label="收件人" label-width="15%">
              <el-select filterable multiple style="width: 35%;" v-model="cronForm.user_mail_list" placeholder="请选择收件人">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label='item.text'
                  :value='item.id'></el-option>
              </el-select>
            </el-form-item>
            <el-button :disabled="saveButtonDis" type="primary" @click="glproject()">关联项目</el-button>
            <el-table border ref="multipleTable" :data="cronForm.config_list" v-loading="listLoading" element-loading-text="加载中。。。"
              tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;">
              <el-table-column align="center" min-width=80 label="项目" height=33>
                  <template slot-scope='scope'>
                  <div>{{maxText(scope.row[1])}}</div>
                  </template>
              </el-table-column>
              <el-table-column min-width="120" label="扫描方式">
                <template slot-scope='scope'>
                  <el-checkbox-group  v-model="scope.row[2]">
                    <el-checkbox  :label=1>敏感词扫描</el-checkbox>
                    <el-checkbox  :label=2>三方库扫描</el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="CronJobVisible = false">取 消</el-button>
            <el-button v-if="saveType === 'add'" :disabled="saveButtonDis" type="primary" @click="createCron">确 定</el-button>
            <el-button v-else-if="saveType === 'set'" :disabled="saveButtonDis" type="primary" @click="updateCron">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 项目选择 -->
        <el-dialog title="项目名称" :visible.sync="CronJobVisible1">
          <el-form :model="cronForm">
            <div>
              <el-checkbox-group v-model="configList">
                <!-- <ul class="additem">
                  <li > -->
                    <div class="box">
                    <el-checkbox v-for="pl in projectList" :label="pl" :key="pl.key">{{pl.name}}</el-checkbox>
                    </div>
                  <!-- </li>
                </ul> -->
              </el-checkbox-group>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer" style="display:flex;justify-content: center">
            <el-button @click="CronJobVisible1 = false">取 消</el-button>
            <el-button :disabled="saveButtonDis" type="primary" @click="addcronproject">确 定</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import {getScantask, getSensitiveOptions, getCronJobList, saveBaseModel, startScan, stopScan, getjobdetail, usermaillist, editjob, deljob,
newjob, listByParam} from '@/api/xyzqPort/serverPort'
import {gettableDataList, getLogDetail, getLogDetailJson} from '@/api/xyzqPort/serverInfo'
import {systemlogStatis} from '@/api/modules/all'

export default {
  name: 'index',
  data () {
    return {
      tableData: [],
      timer: '',
      boxLoading: true,
      versionLogs: '',
      leftDataList: {},
      totalLineCount: '',
      details: [],
      saveType: '',
      configList: [],
      CronJobVisible1: false,
      queryTime: [],
      stopShow: false,
      saveButtonDis: false, // 新增点击一次之后置灰
      dialogFormVisible: false,
      CronJobVisible: false,
      listLoading: false,
      tabActiveName: 'one',
      total: 0,
      pageRow: {
        pageSize: 10,
        pageNo: 1
      },
      cronJobList: [],
      cronJobLists: [],
      scanServiceList: [],
      scanServiceLists: [],
      listQuery: {
        name: '',
        type: '',
        created: '',
        updated: ''
      },
      projectOptions: [],
      projectOptionsAll: [],
      sensitiveOptions: [],
      scantypeOptions: [
        {id: 0, text: '敏感词扫描'},
        {id: 1, text: '三方库安全扫描'}
      ],
      scantypeAllOptions: [
        {id: '', text: '全部'},
        {id: 0, text: '敏感词扫描'},
        {id: 1, text: '三方库安全扫描'}
      ],
      runCountOptions: [
        {id: 0, text: '已关闭'},
        {id: 1, text: '扫描中'},
        {id: 2, text: '终止'}
        // {id: 3, text: '手动终止'}
      ],
      resultOptions: [
        {id: '', text: '--'},
        {id: 0, text: '通过'},
        {id: 1, text: '不通过'}
      ],
      editForm: {
        type: [],
        name: '',
        repertory: '',
        ignore_comment_lines: 'true',
        ignore_files: '',
        ignore_keywords: '',
        sensitives: []
      },
      cronForm: {
        job_id: '',
        job_time: '',
        user_mail_list: [],
        config_list: []
      },
      topTotal: {
        total: 0,
        passTotal: 0,
        unpassTotal: 0,
        stopTotal: 0,
        cronTotal: 0
      },
      projectList: [],
      userList: [],
      searchText: '',
      taskNum: 0,
      taskadopt: 0,
      taskNotpass: 0,
      pickerOptions: {
        shortcuts: [{
          text: '全部',
          onClick (picker) {
            picker.$emit('pick', [])
          }
        }, {
          text: '最近一月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 182)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本年度',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            const lastDay = new Date()
            lastDay.setMonth(0)
            lastDay.setDate(1)
            var days = (start - lastDay) / (3600 * 1000 * 24)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上年度',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            const lastDay = new Date()
            lastDay.setMonth(0)
            lastDay.setDate(1)
            var days = (start - lastDay) / (3600 * 1000 * 24) + 1
            end.setTime(end.getTime() - 3600 * 1000 * 24 * days)
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (days + 364))
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
    this.tabActiveName = 'one'
    if (typeof (this.$route.query.tabActiveName) !== 'undefined' && this.$route.query.tabActiveName === 'two') {
      this.tabActiveName = 'two'
    }
    this.getOptionsDatas()
    this.pageChange()
    // 定时任务
    // this.getCronJobList()
    // this.getUserList()
  },
  mounted () {
    this.$nextTick(function () {
    })
    let allObj = {
      url: this.$route.path,
      moduleName: '敏感词扫描',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  activated () {
    this.tabActiveName = 'one'
    if (typeof (this.$route.query.tabActiveName) !== 'undefined' && this.$route.query.tabActiveName === 'two') {
      this.tabActiveName = 'two'
    }
    this.getOptionsDatas()
    this.pageChange()
    // 定时任务
    // this.getCronJobList()
    // this.getUserList()
  },
  methods: {
    compare (property) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    sortKey (array, key) {
      return array.sort(function (a, b) {
        var x = a[key]
        var y = b[key]
        return x > y ? -1 : x < y ? 1 : 0
      })
    },
    timestamp (strtime) {

      var date = new Date(strtime)

      // 有三种方式获取，在后面会讲到三种方式的区别
      var time1 = date.getTime() // 精确到毫秒:1398250549123
      return time1
    },
    getTableData () {
      this.tableData = []
      this.boxLoading = true
      this.listLoading = true
      // console.log(123)
      listByParam(this.listQuery).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
        this.boxLoading = false
        this.listLoading = false
        this.taskNum = res.data.total
        this.taskadopt = res.data.pass
        this.taskNotpass = res.data.fail
        // console.log(this.tableData.sort(this.compare('latest_scan_time')))
        // console.log(this.sortKey(this.tableData, 'latest_scan_time'))
        this.sortKey(this.tableData, 'latest_scan_time')
        var itemArr = []
        this.tableData.forEach(item => {
          if (item.desc === '手动终止') {
            item.running_count = 2
            item.result = -1
          }
          if (item.name === this.listQuery.name) {
            itemArr.push(item)
            this.tableData = itemArr
            this.total = itemArr.length
          }
        })
      })
    },
    getTableDatasm () {
      this.tableData = []
      this.boxLoading = true
      this.listLoading = true
      // console.log(123)
      listByParam(this.listQuery).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
        this.boxLoading = false
        this.listLoading = false
        this.taskNum = res.data.total
        this.taskadopt = res.data.pass
        this.taskNotpass = res.data.fail
        // console.log(this.tableData.sort(this.compare('latest_scan_time')))
        // console.log(this.sortKey(this.tableData, 'latest_scan_time'))
        this.sortKey(this.tableData, 'latest_scan_time')
        var itemArr = []
        this.tableData.forEach(item => {
          if (item.desc === '手动终止') {
            item.running_count = 2
            item.result = -1
          }
          if (item.name === this.listQuery.name) {
            itemArr.push(item)
            this.tableData = itemArr
            this.total = itemArr.length
          }
        })
        this.tableData[0].result = -1
        if (Number(this.tableData[0].running_count) !== 1) {
          clearInterval(this.timer)
          this.tableData[0].result = 2
        }
      })
    },
    resnow () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.projectOptionsAll.forEach((item) => {
        if (item.text.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.projectOptions = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        // console.log(allList)
        this.projectOptions = allList
      }
    },
    addcronproject () {
      if (this.configList.length > 0) {
        this.cronForm.config_list = []
        for (let i = 0; i < this.configList.length; i++) {
          const ele = this.configList[i]
          var row = [i, ele.name, ele.ischeck, ele.key]
          this.cronForm.config_list.push(row)
        }
      }
      // console.log(this.cronForm.config_list)
      this.CronJobVisible1 = false
    },
    getUserList () {
      usermaillist().then(response => {
        this.userList = response.data
      })
    },
    glproject () {
      this.configList = []
      this.CronJobVisible1 = true
      getScantask().then(response => {
        this.projectList = response.data
        if (response.data.length > 0) {
          for (let i = 0; i < response.data.length; i++) {
            const pro = response.data[i]
            pro.ischeck = []
            for (let j = 0; j < this.cronForm.config_list.length; j++) {
              const ele = this.cronForm.config_list[j]
              if (ele[1] === pro.name) {
                pro.ischeck = ele[2]
                this.configList.push(pro)
                break
              }
            }
          }
        }
      })
    },
    getday (date) {
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (day >= 1 && day <= 9) {
        day = '0' + day
      }
      return year + '-' + month + '-' + day
    },
    getTimeCheck () {
      var self = this
      var now = new Date()
      var dt1 = new Date()
      var dt2 = new Date()
      var dt3 = new Date()
      dt1.setTime(dt1.getTime() - 3600 * 1000 * 24 * 30)
      dt2.setTime(dt2.getTime() - 3600 * 1000 * 24 * 90)
      dt3.setTime(dt3.getTime() - 3600 * 1000 * 24 * 182)
      var year = now.getFullYear()
      var thisY = year + '-01-01'
      var preYs = year - 1 + '-01-01'
      var preYe = year - 1 + '-12-31'
      if (this.queryTime === null || (this.queryTime[0] === '' && this.queryTime[1] === '')) {
        self.time = '不限'
      } else if (this.getday(dt1) === this.queryTime[0] && this.getday(now) === this.queryTime[1]) {
        self.time = '最近一月'
      } else if (this.getday(dt2) === this.queryTime[0] && this.getday(now) === this.queryTime[1]) {
        self.time = '最近三月'
      } else if (this.getday(dt3) === this.queryTime[0] && this.getday(now) === this.queryTime[1]) {
        self.time = '最近半年'
      } else if (thisY === this.queryTime[0] && this.getday(now) === this.queryTime[1]) {
        self.time = '本年度'
      } else if (preYs === this.queryTime[0] && preYe === this.queryTime[1]) {
        self.time = '上年度'
      } else {
        self.time = this.queryTime[0] + '至' + this.queryTime[1]
      }
      this.listQuery.created = ''
      this.listQuery.updated = ''
      if (this.queryTime != null && this.queryTime !== '') {
        this.listQuery.created = this.queryTime[0]
        this.listQuery.updated = this.queryTime[1]
      }
      // this.getScanServiceList()
      this.getTableData()
    },
    getOptionsDatas () {
      getScantask().then(response => {
        this.projectOptions = [{text: '全部', id: ''}]
        this.projectOptionsAll = [{text: '全部', id: ''}]
        if (response.data.length > 0) {
          for (let i = 0; i < response.data.length; i++) {
            const element = response.data[i]
            this.projectOptions.push({
              text: element.name,
              id: element.name
            })
            this.projectOptionsAll.push({
              text: element.name,
              id: element.name
            })
          }
        }
      })
      getSensitiveOptions().then(response => {
        this.sensitiveOptions = response.data
      })
    },
    maxText (descText) {
      if (descText != null && descText !== '' && descText.length > 500) {
        return descText.substr(0, 500) + '...'
      } else {
        return descText
      }
    },
    // 改变当前分页显示数
    handleSizeChange (val) {
      this.pageRow.pageSize = val
      this.pageChange()
      // console.log(this.pageRow.pageSize)
    },

    handleCurrentChange (val) {
      this.pageRow.pageNo = val
      // console.log(this.pageRow.pageNo)
      this.pageChange()
    },
    pageChange () {
      this.listLoading = true
      if (this.tabActiveName === 'one') {
        this.getTableData()
      } else if (this.tabActiveName === 'two') {
        this.cronJobList = []
        for (let i = this.pageRow.start; i < this.pageRow.limit; i++) {
          if (i < this.cronJobLists.length) {
            const element = this.cronJobLists[i]
            this.cronJobList.push(element)
          }
        }
        this.total = this.cronJobLists.length
      }
      this.listLoading = false
    },
    tabClick (tab, event) {
      this.total = 0
      if (this.tabActiveName === 'one') {
        // this.getScanServiceList()
        this.getTableData()
      } else if (this.tabActiveName === 'two') {
        this.getCronJobList()
      }
      this.searchText = ''
      this.searchInfo()
    },
    getScanServiceList () {
      this.topTotal.total = 0
      this.topTotal.passTotal = 0
      this.topTotal.unpassTotal = 0
      this.topTotal.stopTotal = 0
      this.scanServiceList = []
      this.scanServiceLists = []
      this.listLoading = true
      var para = {}
      const row = {
        name: this.listQuery.name,
        type: this.listQuery.type
      }
      if (this.listQuery.created !== '') {
        para = this.listQuery
      } else {
        para = row
      }
      getScantask(para).then(response => {
        // console.log(response)
        var aa = 0
        this.boxLoading = true
        if (response.data.length > 0) {
          this.topTotal.total = response.data.length
          let stop = 0
          this.topTotal.unpassTotal = 0
          for (let i = 0; i < response.data.length; i++) {
            let count = i
            const element = response.data[i]
            const date = new Date()
            date.setTime(element.latest_scan_time * 1000)
            var lasttime = this.getTimeByDate(date)
            element.latest_scan_time = lasttime
            gettableDataList(element.key).then(response => {
              // console.log(response)
              if (response.data.scan_executions.length > 0) {
                for (let k = 0; k < response.data.scan_executions.length; k++) {
                  const ele = response.data.scan_executions[k]
                  if (k === 0) {
                    // element.result = ele.safe_status
                    element.result = ele.sensitive_numbers

                    var keyId = ele.key
                    getLogDetail(keyId).then(response => {
                      var leftDataList = response.data
                      if (leftDataList.measures.totalLineCount !== 'undefined' && leftDataList.measures.totalLineCount !== '') {
                        var totalLineCount = leftDataList.measures.totalLineCount / 1000 + 'k'
                      }
                      if (totalLineCount === 'NaNk') {
                        totalLineCount = '0k'
                      }
                      var arr = []
                      var obj = leftDataList.exceptions.sensitive
                      for (let value in obj) {
                        let xq = {a: obj[value], lineshow: false, hlkey: value, key: leftDataList.key}
                        var mess = ''
                        xq.a.beforeLines.forEach(res => {
                          mess += res
                        })
                        mess += xq.a.lineStart + xq.a.lineRed + xq.a.line + xq.a.lineEnd
                        xq.a.afterLines.forEach(res => {
                          mess += res
                        })
                        mess = mess.replace(/\t/g, '&nbsp;').replace(/\n/g, '<br/>')
                        xq.a.mess = mess
                        arr.push(xq)
                      }
                      var details = arr
                      var versionLogs = ''
                      if (totalLineCount === '0k') {
                        versionLogs = ''
                        details = []
                      }
                      getLogDetailJson(keyId).then(responses => {
                        if (responses.data.versionLogs) {
                          var str = responses.data.versionLogs
                          var strarr = str.split('\n')
                          // for (var i = 0; i < strarr.length; i++) {
                          //   strarr[i] = decodeURI(strarr[i])
                          // }
                          versionLogs = strarr
                        }
                        if (responses.data.result.length > 0) {
                          for (let i = 0; i < responses.data.result.length; i++) {
                            const ele = responses.data.result[i]
                            ele.lineshow = false
                            var mess = ''
                            ele.beforeLines.forEach(res => {
                              mess += res + '<br/>'
                            })
                            mess += ele.line + '<br/>'
                            ele.afterLines.forEach(res => {
                              mess += res + '<br/>'
                            })
                            mess = mess.replace(/\t/g, '&nbsp;').replace(/\n/g, '<br/>')
                            var newArr = []
                            if (ele.keyword === 'localhost') {
                              newArr = ['localhost']
                            } else {
                              var reg = /(10|192|12|198|127)\.\d{1,3}\.\d{1,3}\.\d{1,3}/g
                              var arr1 = mess.match(reg)
                              // 使用set进行数组去重
                              newArr = [...new Set(arr1)]
                            }
                            var newmess = mess
                            // console.log(newArr)
                            if (newArr.length > 0) {
                              newmess = ''
                              newArr.forEach(ele => {
                                var ms = mess.split(ele)
                                for (let i = 0; i < ms.length; i++) {
                                  const element = ms[i]
                                  if (i < ms.length - 1) {
                                    newmess += element + '<span style="color: red;">' + ele + '</span>'
                                  } else {
                                    newmess += element
                                  }
                                }
                              })
                            }
                            ele.mess = newmess
                            // console.log(ele)
                            for (let j = 0; j < details.length; j++) {
                              const det = details[j]
                              if (ele.file === det.a.file && ele.keyword === det.a.keyword) {
                                responses.data.result.splice(i, 1)
                                i = i - 1
                                break
                              }
                            }
                          }
                        }
                        var wiguiResult = responses.data.result
                        if (totalLineCount === '0k') {
                          versionLogs = ''
                          details = []
                        }
                        element.ccc = wiguiResult.length
                        // this.listLoading = false
                        // setTimeout(() => {
                        this.scanServiceLists.push(element)
                        if (Number(element.ccc) !== 0) {
                          // 未通过
                          aa++
                        }
                        // console.log(aa)
                        this.scanServiceLists.forEach(item => {
                          item.repertory = decodeURI(item.repertory)
                        })
                        this.scanServiceLists.sort(function (obj1, obj2) {
                          let val1 = obj1.latest_scan_time.replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
                          let val2 = obj2.latest_scan_time.replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
                          return val2 - val1
                        })
                        this.handleSizeChange(10)
                        if (count === this.topTotal.total - 1) {
                          // this.listLoading = false
                          this.boxLoading = false
                          this.listLoading = false
                          // console.log(aa)
                          this.topTotal.stopTotal = aa
                          this.topTotal.passTotal = this.topTotal.total - aa
                        }
                          // this.boxLoading = false
                          // console.log(element)
                        // }, 4000)
                        // if (responses.data.result.length === 0) {
                        //   element.ccc = 111
                        // }
                        // console.log(element)
                        // console.log(responses)
                      }).catch((errRes) => {
                        element.ccc = -1
                        aa++
                        this.scanServiceLists.push(element)
                      })
                    })
                    break
                  }
                }
              }
              // this.topTotal.stopTotal = stop
              // this.topTotal.passTotal = this.topTotal.total - stop
              // setTimeout(() => {
              //   this.scanServiceLists.push(element)
              //   if (Number(element.ccc) !== 0) {
              //     // 未通过
              //     aa++
              //   }
              //   // console.log(aa)
              //   this.scanServiceLists.forEach(item => {
              //     item.repertory = decodeURI(item.repertory)
              //   })
              //   this.scanServiceLists.sort(function (obj1, obj2) {
              //     let val1 = obj1.latest_scan_time.replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
              //     let val2 = obj2.latest_scan_time.replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
              //     return val2 - val1
              //   })
              //   this.handleSizeChange(10)
              //   if (i === this.topTotal.total - 1) {
              //     // this.listLoading = false
              //     this.topTotal.stopTotal = aa
              //     this.topTotal.passTotal = this.topTotal.total - aa
              //   }
              //   // this.boxLoading = false
              //   // console.log(element)
              // }, 4000)
            })
          }
        } else {
          this.listLoading = false
        }
        this.total = response.data.length
      })
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const HH = (date.getHours()).toString().padStart(2, 0)
      const mm = (date.getMinutes()).toString().padStart(2, 0)
      const ss = (date.getSeconds()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD} ${HH}:${mm}:${ss}`
      return time
    },
    getCronJobList () {
      getCronJobList().then(response => {
        this.cronJobLists = response.data.data
        this.topTotal.cronTotal = response.data.data.length
        this.total = response.data.data.length
        this.handleCurrentChange(1)
      })
    },
    setScanTask (row) {
      this.dialogFormVisible = true
      this.resetTemp() // 清空表单信息
      this.saveButtonDis = false
      this.editForm = {
        ignore_comment_lines: row.ignore_comment_lines,
        ignore_files: row.ignore_files.join(','),
        ignore_keywords: row.ignore_keywords.join(','),
        name: row.name,
        repertory: row.repertory,
        sensitives: row.sensitives,
        type: row.type,
        key: row.key
      }
      // this.$refs['editForm'].resetFields() // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    },
    submitSave () {
      this.saveButtonDis = true
      const para = {
        ignore_comment_lines: this.editForm.ignore_comment_lines,
        ignore_files: this.editForm.ignore_files.split(','),
        ignore_keywords: this.editForm.ignore_keywords.split(','),
        name: this.editForm.name,
        repertory: this.editForm.repertory,
        sensitives: this.editForm.sensitives,
        type: this.editForm.type
      }
      saveBaseModel(para, this.editForm.key).then(response => {
        this.$message({ title: '成功', message: '配置成功', type: 'success', duration: 2000 })
        // this.getScanServiceList()
        this.getTableData()
        this.dialogFormVisible = false
        this.saveButtonDis = false
      })
    },
    updateCron () {
      var configlist = []
      for (let i = 0; i < this.cronForm.config_list.length; i++) {
        var ele = this.cronForm.config_list[i]
        const row = {
          project_key: ele[3],
          project_name: ele[1],
          scan_type: ele[2]
        }
        configlist.push(row)
      }
      this.cronForm.config_list = JSON.stringify(configlist)
      this.cronForm.user_mail_list = this.cronForm.user_mail_list.join(',')
      this.CronJobVisible = false
      editjob(this.cronForm).then(response => {
        this.getCronJobList()
        this.$message({ title: '成功', message: '配置任务成功', type: 'success', duration: 2000 })
        // if (response.data) {
        // } else {
        //   this.$message({ title: '失败', message: '配置任务失败：' + response.data, type: 'error', duration: 3000 })
        // }
      })
    },
    createCron () {
      var configlist = []
      for (let i = 0; i < this.cronForm.config_list.length; i++) {
        var ele = this.cronForm.config_list[i]
        const row = {
          project_key: ele[3],
          project_name: ele[1],
          scan_type: ele[2]
        }
        configlist.push(row)
      }
      this.cronForm.config_list = JSON.stringify(configlist)
      this.cronForm.user_mail_list = this.cronForm.user_mail_list.join(',')
      let cont = this.cronJobList.length
      newjob(this.cronForm).then(response => {
        this.CronJobVisible = false
        getCronJobList().then(response => {
          this.cronJobLists = response.data.data
          this.total = response.data.data.length
          this.handleCurrentChange(1)
          if (cont < this.total) {
            this.$message({ title: '成功', message: '新建任务成功', type: 'success', duration: 2000 })
          } else {
            this.$message({ title: '失败', message: '新建任务失败', type: 'error', duration: 3000 })
          }
        })
      })
    },
    addCronJob () {
      this.cronForm.config_list = []
      this.cronForm.job_time = ''
      this.cronForm.user_mail_list = []
      this.cronForm.job_id = ''
      this.CronJobVisible = true
      this.saveType = 'add'
    },
    setCronJob (row) {
      this.saveType = 'set'
      var det = row[5].split(' ')[2]
      var id = det.substring(det.lastIndexOf('(') + 2, det.lastIndexOf(')') - 1)
      getjobdetail(id).then(response => {
        this.cronForm.config_list = response.data.config_list.data
        this.cronForm.job_time = response.data.job_time
        this.cronForm.user_mail_list = response.data.mail_to.split(',')
        // this.cronForm.job_status = response.data.job_status
        this.cronForm.job_id = id
        this.CronJobVisible = true
      })
    },
    startScan (row) {
      // console.log(row)
      row.result = -1
      startScan(row.key).then(response => {
        row.running_count = 1
        row.stopShow = true
        // this.getScanServiceList()
        this.timer = setInterval(() => {
          this.getTableDatasm()
        },
        20000)
        this.getTableDatasm()
        // const date = new Date()
        // var time = this.getTimeByDate(date)
        // this.scanServiceLists.sort(function (obj1, obj2) {
        //   if (obj1.key === row.key) {
        //     obj1.latest_scan_time = time
        //   }
        //   if (obj2.key === row.key) {
        //     obj2.latest_scan_time = time
        //   }
        //   let val1 = obj1.latest_scan_time.replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
        //   let val2 = obj2.latest_scan_time.replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
        //   return val2 - val1
        // })
        // console.log(this.scanServiceLists)
        // this.handleSizeChange(10)
      })
    },
    stopScan (row) {
      stopScan(row.key).then(response => {
        row.stopShow = false
        row.running_count = 2
      })
    },
    goDeatil (row) {
      // this.$router.push({path: '/serverinfo?key=' + row.key + '&id=' + row.id})
      this.$router.push({path: '/serverinfo?key=' + row.key})
      // console.log(row)
    },
    setCronDeatil (row) {
      var det = row[5].split(' ')[7]
      var id = det.substring(det.lastIndexOf('(') + 2, det.lastIndexOf(')') - 1)
      this.$router.push({ path: '/servertable?jobId=' + id })
    },
    deleteCron (row) {
      var det = row[5].split(' ')[7]
      var id = det.substring(det.lastIndexOf('(') + 2, det.lastIndexOf(')') - 1)
      let cont = this.cronJobList.length
      this.$confirm('确认删除该定时任务？')
          .then(_ => {
            deljob(id).then(response => {
              getCronJobList().then(response => {
                this.cronJobLists = response.data.data
                this.total = response.data.data.length
                this.handleCurrentChange(1)
                if (cont > this.total) {
                  this.$message({ title: '成功', message: '删除成功', type: 'success', duration: 2000 })
                } else {
                  this.$message({ title: '失败', message: '删除失败：' + response.data, type: 'error', duration: 3000 })
                }
              })
            })
          })
          .catch(_ => {
            // console.log(444)
          })
    },
    resetTemp () {
      this.editForm = {
        type: '',
        name: '',
        repertory: '',
        ignore_comment_lines: '',
        ignore_files: '',
        ignore_keywords: '',
        sensitives: ''
      }
    }
  }
}
</script>

<style>
.el-progress--circle,.el-progress-circle{width: 110px;
    height: 110px;
}
.serversel .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
  }
/* .pagination-container .el-input__inner{
  height: 28px;
} */
.el-button--primary{
  background-color: #4b78cd;
  border: none;
}
</style>
<style scoped>
.planEcharts .el-date-editor .el-range-separator{
  width: 8%;
}
.planEcharts{
  width: auto;
  height: auto;
  position: relative;
  /* margin-top: 44px; */
}
.todaytask{
  width: 80%;
  background-color: #4b78cd;
  height: 70px;
  margin-left: 8%;
  margin-top: 10px;
  border-radius: 7px;
  padding: 15px;
}
.scanpass{
  width: 80%;
  background-color: #67c23a;
  height: 70px;
  margin-left: 8%;
  margin-top: 10px;
  border-radius: 7px;
  padding: 15px;
}
.scannotpass{
  width: 80%;
  background-color: #f56c6c;
  height: 70px;
  margin-left: 8%;
  margin-top: 10px;
  border-radius: 7px;
  padding: 15px;
}
.endtask{
  width: 80%;
  background-color: #ff9900;
  height: 70px;
  margin-left: 8%;
  margin-top: 10px;
  border-radius: 7px;
  padding: 15px;
}
.titlecss{
    color: white;
}
.numcss{
    color: white;
    margin-left: 45%;
    font-size: 25px;
}


.box{
   display: flex;
   flex-flow: wrap;
}
.el-checkbox+.el-checkbox {
    margin-left: 0px;
}
.el-checkbox{
 width: 50%;
 border-bottom: 1px solid #ccc;
 padding: 0 45px;
}
.el-checkbox:nth-of-type(2n){
  border-left: 1px solid #ccc;
}
.el-pagination{
  padding:  10px 5px;
  float: right !important;
}
.pagination-container{
  overflow: hidden;
}
</style>

<style lang="scss">
//  .planEcharts{
    .el-message,.el-message--success{
      z-index: 19999 !important;
    }  
//  } 
 .mouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
</style>