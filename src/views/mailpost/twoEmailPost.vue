<template>
    <div class="achievementother">
      <p style="font-size:20px;font-weight:700;color:#000;margin:0;padding:10px 15px;">需求成效评价</p>
      <div class="dsk" style="position:relative" v-loading='LoadingFlag'>
        <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:0 15px;">
          <el-tab-pane label="已发送" name="first">
              <span slot="label"><i class="fa fa-tasks" style="color:fff"></i> 我的已发</span>
              <div style="width:100%;padding:0 30px;margin-bottom:20px;">

                <el-row style="display:flex;">
                  <el-col :span="7" style="display:flex;line-height:50px;">
                      <!-- <span style="margin-right:5px;display:inline-block;width:90px;">评价发起日期</span> -->
                      <el-date-picker
                        v-model="changeTime"
                        type="daterange"
                        align="right"
                        value-format="yyyy-MM-dd"
                        start-placeholder="发送时间"
                        end-placeholder="发送时间"
                        :clearable="true"
                        @change="changeitem"
                        :unlink-panels="true"
                        ref="timeSelect" style="margin-top:5px;">
                      </el-date-picker>
                  </el-col>
                  <el-col :span="6" style="line-height:50px;">
                    <el-select v-model="listQuery.need_status" placeholder="请选择评价状态" style="width:100%;" @change="changeitem" popper-class='mouthFix' clearable>
                        <el-option
                          v-for="item in huiguOption"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                  </el-col>
                  <el-col :span="9" style="line-height:50px;display:flex;margin-left:35px;">
                    <!-- <span style="margin-right:5px;display:inline-block;width:90px;text-align:center;">满意度</span> -->
                    <el-select v-model="performance" multiple placeholder="请选择满意度" style="flex:1" popper-class="mouthFix" @change="changeitem">
                      <el-option
                        v-for="item in optionsOther"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>

                <el-row>
                    <el-col :span="13">
                        <div style="line-height:50px;">
                            <!-- <span style="margin:0 29px;">项目</span> -->
                            <el-select v-model="projectIds" placeholder="请选择项目" multiple style="width:100%;" @change="changeitem" popper-class='onmouthFix'>
                            <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                              <el-input placeholder="请选择项目" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                            </div>
                              <el-option
                                v-for="item in oaProname"
                                :key="item.project_name"
                                :label="item.project_name"
                                :value="item.project_name">
                              </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    
                    <!-- <el-col :span="4" style="line-height:50px;">
                      <el-select v-model="listQuery.need_status" placeholder="请选择评价状态" style="width:85%;" @change="changeitem" popper-class='mouthFix' clearable>
                        <el-option
                          v-for="item in huiguOption"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-col> -->
                    <el-col :span="9" style="line-height:50px;margin-left:35px;display:flex;justify-content:space-around">
                        <!-- <span style="margin: 0 15px;">需求标题</span> -->
                        <el-input v-model="listQuery.need_name" placeholder="搜索成效评价相关" style="flex:1;" @keydown.enter.native="changeitem"></el-input>
                        
                        <div style="line-height:50px;margin-left:35px;">
                          <el-button style="color:#fff;border:none;background-color:#4b78cd;" @click="exportPage">导出</el-button>
                        </div>
                    </el-col>
                    
                </el-row>
                <!-- <div>
                  <el-row>
                  </el-row>
                </div> -->
              </div>
              <div style="padding:0 15px;">
                <el-table :data="SendtableData" style="width: 100%" @sort-change="changeOrder" border ref="firstTb">
                  <el-table-column prop="need_name" label="需求标题" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="project_name" label="涉及系统" align="center" sortable="custom" width="130">
                  </el-table-column>
                  <!-- <el-table-column prop="work_type" label="事务" align="center" sortable="custom" width="150">
                  </el-table-column> -->
                  <!-- <el-table-column prop="mail_type" label="邮件类型" align="center" sortable="custom">
                  </el-table-column> -->
                  <el-table-column prop="need_status" label="评价状态" align="center" sortable="custom" width="110">
                  </el-table-column>
                  <el-table-column prop="current_processor" label="当前处理人" align="center" sortable="custom" width="115">
                  </el-table-column>
                  <el-table-column prop="review_level" label="满意度" align="center" sortable="custom" min-width="120">
                    <template slot-scope="scope">
                      <div>{{getmanyistr(scope.row.review_level)}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="handle_branch" label="发起部门" align="center" width="120" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="status_id" label="发送状态" align="center" sortable="custom" width="100">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.status_id==='成功'" type="success">{{scope.row.status_id}}</el-tag>
                      <el-tag v-if="scope.row.status_id==='失败'" type="danger">{{scope.row.status_id}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="real_time" label="实际提交验收时间" align="center" sortable="custom" min-width="125">
                    <template slot-scope="scope">
                      <div v-if="scope.row.real_time">
                        {{scope.row.real_time.substr(0,10)}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="send_time" label="发送时间" align="center" sortable="custom" min-width="125">
                  </el-table-column>
                  <el-table-column prop="address" label="操作" align="center" width="130">
                    <template slot-scope="scope">
                      <!-- 123 -->
                      <div style="width:100%;padding:0 10px;display:flex;justify-content:space-around">
                        <!-- <a href="javascript:;" style="display:inline-block;text-decoration:underline;" @click="previewFlag(scope.row.need_id, scope.row.need_name, scope.row.need_status)">预览</a> -->
                        <a href="javascript:;" style="flex:1;display:inline-block;text-decoration:underline;" @click="see(scope.row.need_id, '1')">查看</a>
                        <a href="javascript:;" style="flex:1;display:inline-block;text-decoration:underline;" @click="sendEmail('2', scope.row.need_id, scope.row.need_name, scope.row.need_status)" v-if="scope.row.status_id !== '成功'">发送</a>
                        <a href="javascript:;" style="flex:1;display:inline-block;color:transparent" v-else></a>
                      </div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="remarks" label="备注" align="center" sortable="custom">
                  </el-table-column> -->
                </el-table>
              </div>
          </el-tab-pane>
          <el-tab-pane label="待发送" name="second">
            <span slot="label"><i class="fa fa-tasks" style="color:000"></i> 我的待发</span>
            <div style="padding: 0 30px;display:flex;margin-bottom:20px;align-items:center;">
              <el-button style="color:#fff;background-color:#4b78cd;border:none;height:40px;" @click="sendSomeEmail">批量发送</el-button>
              
              <div style="line-height:50px;flex:1;margin-left:25px;">
                  <el-select v-model="projectIds" placeholder="请选择项目" multiple style="width:100%;" @change="changeitem" popper-class='onmouthFix'>
                  <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                    <el-input placeholder="请选择项目" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                  </div>
                    <el-option
                      v-for="item in oaProname"
                      :key="item.project_name"
                      :label="item.project_name"
                      :value="item.project_name">
                    </el-option>
                  </el-select>
              </div>
              <div style="line-height:50px;flex:1;margin-left:25px;">
                  <el-input v-model="listQuery.need_name" placeholder="搜索成效评价相关" style="width:85%" @keydown.enter.native="changeitem"></el-input>
              </div>
            </div>
            <!-- 表格数据 -->
            <div style="padding:0 15px;">
              <el-table :data="tableData" style="width: 100%" @sort-change="changeOrder" border  @selection-change="handleSelectionChange" ref="multipleTable"
              :row-key="(row)=>{return row.need_name}"
              >
                <el-table-column
                  type="selection"
                  width="55" :reserve-selection="true">
                </el-table-column>
                <el-table-column prop="work_type" label="事务" align="center" sortable="custom" width="140">
                </el-table-column>
                <el-table-column prop="project_name" label="涉及系统" align="center" sortable="custom" width="150">
                </el-table-column>
                <el-table-column prop="need_name" label="需求标题" align="center" sortable="custom">
                </el-table-column>
                <el-table-column prop="handle_author" label="接收人" align="center" sortable="custom" width="160">
                </el-table-column>
                <el-table-column prop="real_time" label="实际提交验收时间" align="center" sortable="custom" width="160">
                  <template slot-scope="scope">
                    <div v-if="scope.row.real_time">
                      {{scope.row.real_time.substr(0,10)}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="close_days" label="验收完成天数" align="center" sortable="custom" width="130">
                </el-table-column>
                <el-table-column prop="address" label="操作" align="center" width="150">
                  <template slot-scope="scope">
                    <div style="width:100%;padding:0 20px;">
                      <a href="javascript:;" style="display:inline-block;float:left;text-decoration:underline;" @click="see(scope.row.need_id, '0')">预览</a>
                      <a href="javascript:;" style="display:inline-block;float:right;text-decoration:underline;" @click="sendEmail('2', scope.row.need_id, scope.row.need_name, '回顾填写')">发送</a>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 分页 -->
      <div style="display:flex;justify-content: flex-end;padding:0 15px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total" style="margin:5px 0;">
        </el-pagination>
      </div>
      <!-- <a href="http://192.25.102.87:8000/#/previewSecond?need_id=8203158353558155949&openType=1&toduType=0&token=f5930713d204dcd836e2ae4ffe03a1a9" target="_blank">go</a> -->
      <!-- end -->
    </div>
</template>

<script>
import {getreqName} from '@/api/EmailPost/emailPost'
import {newlist, newgetEmailres} from '@/api/EmailPost/newEmailpost.js'
import {systemlogStatis} from '@/api/modules/all'

export default {
  data () {
    return {
      aaa: '',
      achievementsee: false,
      need_purpose: [],
      timeliness: '',
      sendInfo: {
        delayCause: '',
        remainingProblems: '',
        // 需求id
        needId: '',
        createTime: '',
        // 需求响应及时性
        timeliness: '',
        // 需求实现目的
        needPurpose: '',
        // 应用绩效回顾等级
        reviewLevel: '',
        // 功能推广或使用情况说明
        messageDetail: '',
        // 创建人
        createAuthor: ''
      },
      formLabelAlign: {
        assignedToId: '',
        needId: '',
        subject: '',
        dueDate: '',
        stype: [],
        authorId: '0',
        createdOn: '',
        statuss: '',
        handleBranch: '',
        handleAuthor: '',
        acceptingGroup: '',
        trackerId: '',
        itBranchLiaison: '',
        projectName: '',
        needsStatus: '',
        avgDay: '',
        oaId: ''
      },
      searchText: '',
      oaProname: [],
      forSecharName: [],
      changeTime: [],
      projectIds: [],
      performance: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        orderType: 'desc',
        orderFiled: '',
        need_name: '',
        receiverEmail: '',
        project_name: '',
        statusId: '',
        need_status: ''
      },
      total: 0,
      huiguOption: ['已发送待评价', '已评价待确认', '已确认'],
      value1: [],
      tableData: [],
      SendtableData: [],
      activeName: 'first',
      multipleTable: [],
      multipleSelection: [],
      dialogVisible: false,
      yulan: '',
      LoadingFlag: true,
      achievementInfo: false,
      ylid: '',
      yltitle: '',
      yltype: '',
      // marking
      tableDataOther: [{
        id: '需求名称',
        name: ''
      }, {
        id: '填报时间',
        name: '2020-02-06',
        amount1: '需求响应及时性',
        amount2: '4.43'
      }, {
        id: '实现目的（可多选）*',
        type: 'some',
        name: '王小虎'
      }, {
        id: '应用绩效回顾等级*',
        type: 'select',
        name: '3'
      }, {
        id: '功能推广或使用情况说明*',
        name: '符合预期'
      }],
      itemData: [
        {one: '需求类别', two: '功能需求', three: '涉及系统类别', four: '基础平台类'},
        {one: '需求紧急度', two: '紧急', three: '涉及系统', four: '其他'},
        {one: '需求部门联络人', two: '', three: 'IT部门预沟通联络人', four: ''},
        {one: '需求受理组', two: '', three: '', four: ''},
        {one: '计划提交验收时间', two: '2020-06-30', three: '实际提交验收时间', four: '2020-01-16'},
        // {one: '是否涉及财务费用', two: '否', three: '是否涉及合规审批', four: '否'},
        {one: '需求实施情况', two: '已完成', three: '', four: ''}
      ],
      checkList: ['1', '3'],
      optionsOther: [{
        value: '1',
        label: 'A 实现结果超出需求预期'
      }, {
        value: '2',
        label: 'B 实现结果满足需求'
      }, {
        value: '3',
        label: 'C 实现结果基本满足需求，但有待优化'
      }, {
        value: '4',
        label: 'D 实现结果未能满足需求'
      }],
      huiguKind: '',
      isShow: true
    }
  },
  created () {
    this.getproname()
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '需求成效评价',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    this.changeitem()
  },
  methods: {
    exportPage () {
      // const row = {
      //   // projectName: '其他'
      //   projectName: ''
      // }
      // this.listQuery.orderFiled = ''
      let orderstr = ''
      if (this.listQuery.orderFiled === 'need_name') {
        // 需求标题
        orderstr = '项目名称'
      } else if (this.listQuery.orderFiled === 'project_name') {
        // 涉及系统
        orderstr = '涉及系统'
      } else if (this.listQuery.orderFiled === 'need_status') {
        // 评价状态
        orderstr = '应用绩效回顾状态'
      } else if (this.listQuery.orderFiled === 'current_processor') {
        // 当前处理人
        orderstr = ''
      } else if (this.listQuery.orderFiled === 'review_level') {
        // 满意度
        orderstr = '需求实现满意度'
      } else if (this.listQuery.orderFiled === 'status_id') {
        // 发送状态
        orderstr = ''
      } else if (this.listQuery.orderFiled === 'send_time') {
        // 发送时间
        orderstr = '评价发起日期'
      }
      let prostr = this.listQuery.project_name
      // let levstr = this.performance.join(',')
      // page: 1,
      //   pageSize: 10,
      //   orderType: 'desc',
      //   orderFiled: '',
      //   need_name: '',
      //   receiverEmail: '',
      //   project_name: '',
      //   statusId: '',
      //   need_status: ''
      this.listQuery.statusIds = '成功,失败'
      let obj = JSON.parse(JSON.stringify(this.listQuery))
      obj.orderFiled = orderstr
      // if (this.changeTime === [] || this.changeTime === null) {
      //   obj.startTime = ''
      //   obj.endTime = ''
      // } else {
      //   obj.startTime = this.changeTime[0]
      //   obj.endTime = this.changeTime[1]
      // }
      obj.startTime = this.changeTime ? this.changeTime[0] : ''
      obj.endTime = this.changeTime ? this.changeTime[1] : ''
      obj.projectName = prostr
      // obj.review_level = levstr
      obj.review_level = this.performance.join(',')
      var newrow = JSON.stringify(obj)
      // console.log(newrow)
      newrow = encodeURIComponent(newrow)
      window.open('/sysmanage/qxNeedmeritsReview/export?token=' + this.$cookie.get('token') + '&JosnStr=' + newrow)
    },
    see (id, typesuch) {
      let sendrow = {
        reqId: id,
        type: typesuch
      }
      let routeData = this.$router.resolve({
        name: 'newlookUp',
        query: sendrow
      })
      window.open(routeData.href, '_blank')
    },
    getmanyistr (id) {
      let str = ''
      this.optionsOther.forEach(item => {
        if (item.value === id) {
          str = item.label
        }
      })
      return str
    },
    // 批量发送
    sendSomeEmail () {
      // console.log(this.multipleSelection)
      var arr = []
      var needname = []
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(item => {
          arr.push(item.need_id)
          // console.log(item)
          needname.push(item.need_name)
        })
        var str = arr.join(',')
        var needStr = needname.join(',')
        // console.log(str)
        this.sendEmail('2', str, needStr, '回顾填写')
      }
    },
    // 发送邮件
    sendEmail (typein, id, title, huiguType) {
      var sendtype = 'fasong'
      var titlename = ''
      if (title) {
        titlename = title
      }
      var rows = {}
      if (huiguType) {
        rows = {
          reqId: id,
          userName: localStorage.getItem('userId'),
          type: sendtype,
          need_name: titlename,
          mailType: huiguType,
          token: this.$cookie.get('token')
        }
      } else {
        rows = {
          reqId: id,
          userName: localStorage.getItem('userId'),
          type: sendtype,
          need_name: titlename,
          token: this.$cookie.get('token')
        }
      }
      newgetEmailres(rows).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          this.$refs.multipleTable.clearSelection()
          this.multipleSelection = []
          if (res.data.data) {
            if (res.data.data.reslist) {
              var arr = res.data.data.reslist
              if (arr.length === 1) {
                for (let i = 0; i < arr.length; i++) {
                  setTimeout(() => {
                    if (arr[i].includes('成功')) {
                      this.$message({type: 'success', message: arr[i]})
                    } else {
                      this.$message({type: 'error', message: arr[i]})
                    }
                  }, 0)
                }
              } else if (arr.length > 1) {
                this.$message({type: 'success', message: `成功发送${arr.length}条数据`})
              }
            }
          }
        }
        // 发送后再次渲染页面
        this.listQuery.page = 1
        this.listQuery.pageSize = 10
        if (this.activeName === 'first') {
          this.getSentData()
        } else if (this.activeName === 'second') {
          this.getUnSentData()
        }
      })
    },
    // 已发送数据
    getSentData () {
      this.LoadingFlag = true
      this.listQuery.statusIds = '成功,失败'
      let obj = JSON.parse(JSON.stringify(this.listQuery))
      // console.log(this.changeTime)
      // if (this.changeTime === [] || this.changeTime === null) {
      //   obj.startTime = ''
      //   obj.endTime = ''
      // } else {
      //   obj.startTime = this.changeTime[0]
      //   obj.endTime = this.changeTime[1]
      // }
      obj.startTime = this.changeTime ? this.changeTime[0] : ''
      obj.endTime = this.changeTime ? this.changeTime[1] : ''
      obj.review_level = this.performance.join(',')
      newlist(obj).then(res => {
        // alert(1)
        this.LoadingFlag = false
        // console.log(res)
        this.total = res.data.total
        this.SendtableData = res.data.data
      })
    },
    // 待发送数据
    getUnSentData () {
      this.LoadingFlag = true
      // var senobj = this.listQuery
      // senobj.statusId = '待发送'
      this.listQuery.statusIds = '待发送'
      newlist(this.listQuery).then(res => {
        this.LoadingFlag = false
        this.total = res.data.total
        this.tableData = res.data.data
        // console.log(res)
        // alert(2)
      })
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
      // console.log(this.multipleSelection)
      // console.log(this.multipleTable)
    },
    // 切换已发送未发送tabs
    handleClick () {
      // console.log(this.activeName)
      this.$refs.multipleTable.clearSort()
      this.$refs.firstTb.clearSort()
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.listQuery.orderType = 'desc'
      this.listQuery.orderFiled = ''
      this.listQuery.need_name = ''
      this.projectIds = []
      this.listQuery.project_name = ''
      this.listQuery.need_status = ''
      this.listQuery.statusId = ''
      this.changeTime = []
      this.performance = []
      if (this.activeName === 'first') {
        this.listQuery.orderFiled = 'send_time'
        this.getSentData()
      } else if (this.activeName === 'second') {
        this.listQuery.orderFiled = 'close_days'
        this.getUnSentData()
      }
    },
      // 排序
    changeOrder (column, prop, order) {
      this.listQuery.orderFiled = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      if (this.activeName === 'first') {
        this.getSentData()
      } else if (this.activeName === 'second') {
        this.getUnSentData()
      }
    },
    // 获取当前时间最近的一天
    getOneDayTime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      var s = this.getTimeByDateOne(start)
      var e = this.getTimeByDateOne(end)
      this.changeTime = [s, e]
    },
    getTimeByDateOne (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      // const HH = (date.getHours()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      if (this.activeName === 'first') {
        this.getSentData()
      } else if (this.activeName === 'second') {
        this.getUnSentData()
      }
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      if (this.activeName === 'first') {
        this.getSentData()
      } else if (this.activeName === 'second') {
        this.getUnSentData()
      }
    },
    getproname () {
      // 获取所有的项目
      const grow = {
        token: this.$cookie.get('token')
      }
      getreqName(grow).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          res.data.data.reqNamelist.unshift({project_name: '全部', project_id: ''})
          this.oaProname = res.data.data.reqNamelist
          this.forSecharName = [...res.data.data.reqNamelist]
        }
      })
    },
    changeitem () {
      for (let i = 0; i < this.projectIds.length; i++) {
        if (this.projectIds[i] === '全部') {
          this.projectIds = []
          break
        }
      }
      if (this.changeTime === null) {
        this.changeTime = []
      }
      // console.log(this.changeTime)
      this.searchText = ''
      this.oaProname = this.forSecharName
      this.listQuery.project_name = this.projectIds.join(',')
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      if (this.activeName === 'first') {
        this.listQuery.orderFiled = 'send_time'
        this.getSentData()
      } else if (this.activeName === 'second') {
        this.listQuery.orderFiled = 'close_days'
        this.getUnSentData()
      }
    },
    // 模糊查询
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.forSecharName.forEach((item, index) => {
        if (item.project_name.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.oaProname = [{project_name: '暂无数据', project_id: '', disabled: true}]
      } else {
        this.oaProname = allList
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    .achievementother{
        background-color: #fff;
    }
    .moxbox{
      width: 80%;
      margin: auto;
    }
    @media screen and (max-width: 1280px) {
      .moxbox{
        width: 90%;
      }
    }
</style>

<style>
  .onmouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
  .mouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .achievementother .el-tabs__item.is-active{
      border-bottom: 2px solid #4b78cd;
      background-color: #4b78cd;
      color: #fff;
  }
  .achievementother .el-tabs__active-bar{
    height: 0px;
  }
  .achievementother .el-tabs__nav-wrap::after{
    background-color: transparent;
  }
  .achievementother .el-tabs__header{
    margin: 0 15px 15px;
  }
  .achievementother .el-dialog__body{
    padding:0px 0;
  }
  .achievementother .el-dialog__header{
    padding: 0
  }
  .achievementother .el-tabs__nav-scroll{
    padding: 15px 10px;
    background-color:#eee;
  }
  .achievementother .is-top{
    /* background-color: #fff; */
    margin-left:15px;
  }
  .achievementother .el-tabs__item{
    box-shadow: 5px 0px 10px #aaa;
  }
</style>

<style lang="scss">
    .tetare .el-form-item__label{
        line-height: 25px;
    }
    .diao .el-dialog__body{
      padding: 0 0 10px 0;
    }
    .diao .el-dialog__header{
      padding: 10px;
    }
    .el-dialog{
      margin: 0 auto 0;
    }
</style>

<style lang="scss" scoped>
    .marking{
      margin-top:50px;
        .m_header{
            background-color: #a5a5a5;
            height: 32px;
            line-height: 32px;
            border-top: 0px solid #000;
            color:#000;
            font-weight:700;
        }
    }
</style>

<style lang="scss">
    .marking{
        .el-checkbox+.el-checkbox{
          margin-left: 0px;
        }
        .el-checkbox{
          margin-right: 0px;
        }
    }
body .el-table th.gutter{
  display: table-cell!important;
}
body .el-table colgroup.gutter{
  display: table-cell!important;
}
.el-table__body-wrapper{
  border-top: 1px solid #ebeef5;
}
.showerea .el-textarea__inner{
  padding: 0;
}
.achievementother .el-table th>.cell{
  padding: 0 5px;
}
</style>