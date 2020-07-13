<template>
    <div class="isyq">
        <div class="saltitle">
            <h2>
              <span v-if="$route.query.planTime && $route.query.planTime==='yes'">即将超时需求列表</span>
              <span v-else-if="this.$route.query.Prostauts==='上线完成'">上线完成需求列表</span>
              <span v-else-if="this.$route.query.Prostauts!=='上线完成'">{{this.$route.query.listName}}</span>
              <!-- <span>{{$route.query.planTime}}123</span> -->
            </h2>
            <i class="fa fa-close fa-2x" style="color:#fff;cursor:pointer;padding-right:15px" @click='exit'></i>
        </div>
          <el-row style="padding-left:15px;display：flex;min-height:50px;align-items:center;">
            <el-col :span="10">
                <div class="item" style="display:flex;align-items:center;">
                    <span style="display:inline-block;width:80px;text-align:center;">项目</span>
                    <el-select v-model="listQuery.project_ids" placeholder="全部" multiple style="flex:1" @change="changeitem" popper-class='onmouthFix'>
                    <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                      <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:90%" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                    </div>
                      <el-option
                        v-for="(item,index) in proAllname"
                        :key="proAllname[index]"
                        :label="proAllname[index]"
                        :value="proAllname[index]">
                      </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="mouth">
                    <span style="padding-left:20px;padding-right:18px;">发起时间</span>
                    <el-date-picker
                      v-model="changeTime"
                      type="daterange"
                      align="right"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions"
                      :default-time="['08:00:00', '08:00:00']"
                      value-format="yyyy-MM-dd"
                      :clearable="false"
                      :unlink-panels="true"
                      @change="changeitem">
                    </el-date-picker>
                </div>
            </el-col>
            <el-col :span="6" v-if="activeName==='first'">
              <div style="display:flex;align-items:center;padding-right:15px;">
                <span style="width:120px;">IT部门需求预沟通联络人</span>
                <el-input v-model="listQuery.itName" clearable @keydown.enter.native="changeitem()" @clear='changeitem()'></el-input>
              </div>
            </el-col>
          </el-row>
        <div>
          <el-row style="min-height:50px;display:flex;align-items:center;padding-left:15px;">
            <el-col :span="10" v-if="activeName==='first'">
                <div class="item" style="display:flex;align-items:center;">
                    <span style="display:inline-block;width:80px;text-align:center;">业务状态</span>
                    <el-select
                      v-model="listQuery.need_ids"
                      filterable
                      allow-create
                      default-first-option
                      clearable
                      popper-class="fix"
                      placeholder="请选择状态"
                      style="flex:1;margin-left:5px;"
                      @change="changeitem(3)">
                      <el-option
                        v-for="item in needstatus"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="10" :class="{fstybox: activeName==='first'}">
                <div class="item" style="display:flex;align-items:center;">
                    <span style="display:inline-block;width:80px;text-align:center;">IT实施状态</span>
                    <el-select
                      v-model="listQuery.statusIds"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择状态" 
                      style="flex:1;"
                      popper-class="fix"
                      @change="changeitem(3)">
                      <el-option
                        v-for="item in allstatus"
                        :key="item.needsStatus"
                        :label="item.needsStatus"
                        :value="item.needsStatus">
                      </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="8" v-if="activeName==='second'">
              <div class="mouth" style="display:flex;align-items:center;">
                  <span style="width:60px;margin:0 20px;">计划验收日期</span>
                  <el-date-picker
                    v-model="planTime"
                    type="daterange"
                    align="right"
                    :picker-options="pickerOptions"
                    :default-time="['08:00:00', '08:00:00']"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    :unlink-panels="true"
                    @change="changeitem">
                  </el-date-picker>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="addsty" style="margin-bottom:10px;min-height:50px;display:flex;align-items:center;" v-show="activeName==='first'">
          <div style="display:flex;align-items:center;width:42%" ref="parentTree">
            <span style="display:inline-block;width:100px;text-align:center;">需求受理部门</span>
            <el-select v-model="Checkvalue" placeholder="请选择" popper-class="addsty" style="flex:1" multiple @remove-tag='removeCheck'>
              <!-- <el-input></el-input> -->
              <el-option value="">
                <el-tree
                  :data="treedata"
                  show-checkbox
                  :default-expanded-keys='defaultArr'
                  node-key="org_id"
                  ref="tree"
                  @check="handleCheckChange"
                  :props="defaultProps">
                </el-tree>
              </el-option>
            </el-select>
          </div>
          <div class="mouth" style="width:33%;display:flex;align-items:center;">
              <span style="width:60px;margin:0 20px;">计划验收日期</span>
              <el-date-picker
                v-model="planTime"
                type="daterange"
                align="right"
                :picker-options="pickerOptions"
                :default-time="['08:00:00', '08:00:00']"
                value-format="yyyy-MM-dd"
                :clearable="false"
                :unlink-panels="true"
                @change="changeitem">
              </el-date-picker>
          </div>
          <div>
            <el-button style="color:#fff;background-color:#4b78cd;border:none;margin-left:15px;cursor:pointer;" @click="exportData()">导出</el-button>
          </div>
        </div>
        <div class="allHei" ref="allHei"></div>
        <el-row>
          <el-col :span="24">
            
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="业务需求" name="first">
                
                <el-table :data="tableData" style="width: 100%" v-loading='tableloading' @sort-change="changeOrder" :row-class-name="tableRowClassName" ref="tableOa" :max-height="tabHeight" class="mHei">
                  <el-table-column prop="subject" label="标题" align="center">
                    <template slot-scope="scope">
                      <div>{{scope.row.subject}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="project_name" label="涉及系统" align="center" sortable="custom" width="130">
                      <template slot-scope="scope">
                          {{scope.row.project_name}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="created_on" label="发起日期" align="center" sortable="custom" width="120">
                    <template slot-scope="scope">
                          <!-- {{scope.row.created_on.split(' ')[0]}} -->
                          {{scope.row.created_on.substr(0,10)}}
                      </template>
                  </el-table-column>

                  <el-table-column prop="due_date" label="计划验收日期" align="center" sortable="custom" min-width="60">
                    <template slot-scope="scope">
                      <div v-if="!('due_date' in scope.row)"></div>
                      <div v-else-if="scope.row.due_date.length>10">{{scope.row.due_date.substr(0, 10)}}</div>
                      <div v-else>{{scope.row.due_date}}</div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="real_time" label="实际验收日期" align="center" sortable="custom" min-width="60">
                    <template slot-scope="scope">
                      <div v-if="scope.row.real_time">{{scope.row.real_time.substr(0, 10)}}</div>
                      <div v-else></div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="handle_author" label="创建人" align="center" sortable="custom" width="90">
                      <template slot-scope="scope">
                          <!-- {{scope.row.author_id}} -->
                          <div>{{scope.row.handle_author}}</div>
                      </template>
                  </el-table-column>

                  <el-table-column prop="it_branch_liaison" label="IT部门需求预沟通联络人" align="center" sortable="custom" min-width="80">
                      <template slot-scope="scope">
                          <!-- {{scope.row.author_id}} -->
                          <div>{{scope.row.it_branch_liaison}}</div>
                      </template>
                  </el-table-column>

                  <el-table-column prop="avgDay" label="累计耗时" align="center" sortable="custom" width="100">
                      <template slot-scope="scope">
                          <div><span v-if="Number(scope.row.avgDay)>60" style="color:red">{{scope.row.avgDay}}</span><span v-else>{{scope.row.avgDay}}</span><span v-if="scope.row.avgDay">天</span></div>
                      </template>
                  </el-table-column>

                  <el-table-column prop="priority_id" label="优先级" align="center" width="90" sortable="custom">
                      <template slot-scope="scope">
                        <span v-if="scope.row.priority_id === '3'" style="text-align: center;">高</span>
                        <span v-else-if="scope.row.priority_id === '4'" style="text-align: center;">紧急</span>
                        <span v-else-if="scope.row.priority_id === '5'" style="text-align: center;">立刻</span>
                        <span v-else-if="scope.row.priority_id === '2'" style="text-align: center;">普通</span>
                        <span v-else style="text-align: center;">低</span>
                      </template>
                  </el-table-column>

                  <el-table-column prop="accepting_group" label="需求受理部门" align="center" sortable="custom" width="120">
                      <template slot-scope="scope">
                          <div>{{scope.row.accepting_group}}</div>
                      </template>
                  </el-table-column>

                  <el-table-column prop="needs_status" label="业务状态" align="center" sortable="custom" width="100">
                      <template slot-scope="scope">
                          <div><span>{{scope.row.needs_status}}</span></div>
                      </template>
                  </el-table-column>

                  <el-table-column prop="status_id" label="IT实施状态" align="center" sortable="custom" width="110">
                      <template slot-scope="scope">
                          <div>{{scope.row.status_name}}</div>
                      </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="系统优化" name="second">
                <el-table :data="tableData" style="width: 100%" v-loading='tableloading' @sort-change="changeOrder" :row-class-name="tableRowClassName" :max-height="tabHeightother" ref="tableRed" class="mHei">
                  <el-table-column prop="id" label="ID" width="80" align="center" sortable="custom">
                      <template slot-scope="scope">
                          <a href="javascript:;" @click="goRedmine(scope.row.id)">#{{scope.row.id}}</a>
                      </template>
                  </el-table-column>
                  <el-table-column prop="subject" label="标题" align="center">
                    <template slot-scope="scope">
                      <div>{{scope.row.subject}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="project_name" label="涉及系统" align="center" sortable="custom" width="120">
                      <template slot-scope="scope">
                          {{scope.row.project_name}}
                      </template>
                  </el-table-column>
                  <el-table-column prop="created_on" label="发起日期" align="center" sortable="custom" min-width="60">
                    <template slot-scope="scope">
                          {{scope.row.created_on.substr(0,10)}}
                      </template>
                  </el-table-column>

                  <el-table-column prop="due_date" label="计划验收日期" align="center" sortable="custom" min-width="60">
                    <template slot-scope="scope">
                      <div v-if="!('due_date' in scope.row)"></div>
                      <div v-else-if="scope.row.due_date.length>10">{{scope.row.due_date.substr(0, 10)}}</div>
                      <div v-else>{{scope.row.due_date}}</div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="REAL_END_DATE" label="实际验收日期" align="center" sortable="custom" min-width="60">
                    <template slot-scope="scope">
                      <div v-if="scope.row.REAL_END_DATE">{{scope.row.REAL_END_DATE.substr(0, 10)}}</div>
                      <div v-else></div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="author_id" label="创建人" align="center" sortable="custom" width="90">
                      <template slot-scope="scope">
                          <!-- {{scope.row.author_id}} -->
                          <div>{{scope.row.author_id}}</div>
                      </template>
                  </el-table-column>

                  <el-table-column prop="assigned_to_id" label="指派人" align="center" sortable="custom" width="90">
                      <template slot-scope="scope">
                          <!-- {{scope.row.author_id}} -->
                          <div>{{scope.row.assigned_to_id}}</div>
                      </template>
                  </el-table-column>

                  <el-table-column prop="avgDay" label="累计耗时" align="center" sortable="custom" width="100">
                      <template slot-scope="scope">
                          <div><span v-if="Number(scope.row.avgDay)>60" style="color:red">{{scope.row.avgDay}}</span><span v-else>{{scope.row.avgDay}}</span><span v-if="scope.row.avgDay">天</span></div>
                      </template>
                  </el-table-column>

                  <el-table-column prop="priority_id" label="优先级" align="center" width="90" sortable="custom">
                      <template slot-scope="scope">
                        <span v-if="scope.row.priority_id === '3'" style="text-align: center;">高</span>
                        <span v-else-if="scope.row.priority_id === '4'" style="text-align: center;">紧急</span>
                        <span v-else-if="scope.row.priority_id === '5'" style="text-align: center;">立刻</span>
                        <span v-else-if="scope.row.priority_id === '2'" style="text-align: center;">普通</span>
                        <span v-else style="text-align: center;">低</span>
                      </template>
                  </el-table-column>

                  <el-table-column prop="need_id" label="IT实施状态" align="center" sortable="custom" width="120">
                      <template slot-scope="scope">
                          <div>{{scope.row.needs_status}}</div>
                          <!-- <div><span>{{scope.row.status_name}}</span></div> -->
                      </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
         
        <el-row>
            <el-col :span="24" style="display:flex;background-color:#fff;padding:5px 15px;justify-content: flex-end;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="listQuery.page"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="listQuery.pageSize"
                  layout="total, sizes, prev, pager, next"
                  :total="total">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import {getReqKbList, getOaProjects, getBranchList} from '@/api/xyzqPort/OaPort'
import {getProjectByUser, getuserdict} from '@/api/xyzqPort/erneed'
import {listByMap} from '@/api/xyzqPort/yewuneed'  // 获取所有的状态码
import {systemlogStatis} from '@/api/modules/all'

import API from '@/api'
import qs from 'qs'
export default {
  data () {
    return {
      treedata: [],
      defaultProps: {
        id: 'org_id',
        children: 'children',
        label: 'org_name'
      },
      planTime: [],
      tableData: [],
      tableloading: true,
      needstatus: ['OA流程结束', 'OA送审中', 'OA建设中'],
      listQuery: {
        project_ids: [],
        page: 1,
        pageSize: 10,
        orderType: 'desc',
        orderFiled: 'created_on',
        statusIds: [],
        isyq: '',
        statusId: '',
        cswwc: '',
        tracker_ids: '',
        realClose: '',
        need_ids: '',
        itName: ''
      },
      changeTime: [],
      total: 0,
      userOptions: [],
      projectOptions: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 182)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchText: '',
      allstatus: [],
      proAllname: [],
      activeName: 'first',
      forSearchName: [],
      Checkvalue: [],
      CheckvalueArr: [],
      defaultArr: []
      // tabHeight: 0
    }
  },
  created () {
    if (this.$route.query.proid !== '') {
      this.listQuery.project_ids = this.$route.query.proid.split(',')
    } else {
      this.listQuery.project_ids = []
    }
    if (this.$route.query.stime || this.$route.query.etime) {
      this.changeTime[0] = this.$route.query.stime
      this.changeTime[1] = this.$route.query.etime
    }
    if (this.$route.query.isyq) {
      this.listQuery.isyq = this.$route.query.isyq
      this.listQuery.orderFiled = 'avgDay'
    }
    this.listQuery.cswwc = ''
    if (this.$route.query.cswwc) {
      this.listQuery.cswwc = this.$route.query.cswwc
      this.listQuery.orderFiled = 'avgDay'
    }
    if (typeof (this.$route.query.Prostauts) !== 'undefined' && this.$route.query.Prostauts !== '') {
      if (this.$route.query.Prostauts !== 'OA流程结束' && this.$route.query.Prostauts !== 'OA送审中' && this.$route.query.Prostauts !== 'OA建设中') {
        this.$set(this.listQuery.statusIds, 0, this.$route.query.Prostauts)
      }
      if (this.$route.query.Prostauts === '待上线') {
        // this.listQuery.statusIds = ['待上线', '提交验收']
        this.listQuery.statusIds = ['提交验收']
      }
      if (this.$route.query.Prostauts === 'OA送审中') {
        this.listQuery.need_ids = 'OA送审中'
      } else if (this.$route.query.Prostauts === 'OA流程结束') {
        this.listQuery.need_ids = 'OA流程结束'
      } else if (this.$route.query.Prostauts === 'OA建设中') {
        this.listQuery.need_ids = 'OA建设中'
      }
    }
    if (this.$route.query.stop) {
      this.listQuery.statusId = 23
    }
    if (this.$route.query.tracker_ids) {
      if (this.$route.query.tracker_ids.length > 2) {
        this.listQuery.tracker_ids = 'oa'
        this.activeName = 'first'
      } else if (this.$route.query.tracker_ids === '2') {
        this.listQuery.tracker_ids = this.$route.query.tracker_ids
        this.activeName = 'second'
      } else if (this.$route.query.tracker_ids === 'oa') {
        this.listQuery.tracker_ids = this.$route.query.tracker_ids
        this.activeName = 'first'
      }
    }
    if (typeof (this.$route.query.planTime) !== 'undefined' && this.$route.query.planTime !== '') {
      const end = new Date()
      const start = new Date()
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 6)
      var splan = this.getTimeByDate(start)
      var eplan = this.getTimeByDate(end)
      // this.$set[this.planTime, 0, splan]
      this.planTime = [splan, eplan]
    }
    // if (typeof (this.$route.query.branchArr) !== 'undefined' && this.$route.query.branchArr !== '') {
    //   this.Checkvalue = this.$route.query.branchArr.split(',')
    // }
    this.getproject()         // 获取所有的项目
    this.getUserOptions()     // 获取所有的人名对应的id
    this.getallstatus()       // 获取所有的状态
    // console.log(document.documentElement.clientHeight || document.body.clientHeight)
    // console.log(document.body.clientWidth)
  },
  mounted () {
    this.getBranchData()
    // this.$nextTick(() => {
    //   this.gettableData()       // 获取表格数据
    // })
    // console.log(this.$refs.tableOa.maxHeight)
    // this.$set(this, 'tabHeight', document.querySelector('.allHei').offsetHeight)
    this.tabHeight = document.querySelector('.allHei').offsetHeight
    this.tabHeightother = document.querySelector('.allHei').offsetHeight + 50
    let allObj = {
      url: this.$route.path,
      moduleName: '需求看板',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  methods: {
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      // const HH = (date.getHours()).toString().padStart(2, 0)
      // const time = `${YY}-${MM}-${DD} ${HH}:00:00`
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    exportData () {
      this.$nextTick(() => {
        let branchArr = []
        this.$refs.tree.getCheckedNodes().forEach(item => {
          if (item.org_fn) {
            branchArr.push(item.org_fn)
          }
        })
        let row = {
          // 项目ID 多个','拼接
          project_ids: this.listQuery.project_ids.join(','),
          // 开始时间
          start_date: this.changeTime[0] ? this.changeTime[0] : '',
          // 结束时间
          end_date: this.changeTime[1] ? this.changeTime[1] : '',
          // page第几页
          page: this.listQuery.page,
          // 每页数据条数
          pageSize: this.listQuery.pageSize,
          token: this.$cookie.get('token'),
          // 是否延期'yq'是 ''否
          isyq: this.listQuery.isyq,
          // 排序desc或asc
          orderType: this.listQuery.orderType,
          // 要排序的字段
          orderFiled: this.listQuery.orderFiled,
          // it实施状态
          status_ids: this.listQuery.statusIds.join(','),
          // 业务状态
          need_ids: this.listQuery.need_ids,
          // 是否为暂停需求23是 空字符串否
          status_id: this.listQuery.statusId,
          // 是否为超时未完成 'cswwc'是 空字符串为否
          cswwc: this.listQuery.cswwc,
          // oa
          tracker_ids: this.listQuery.tracker_ids,

          realClose: this.listQuery.realClose,
          // 需求受理部门 名称以，拼接
          acceptingGroups: branchArr.join(','),
          itBranchLiaison: this.listQuery.itName,
          due_date_start: this.planTime[0] ? this.planTime[0] : '',
          due_date_end: this.planTime[1] ? this.planTime[1] : ''
        }
        // window.open('/sysmanage/qxBaseIssuesNew/reqKbListExportToCsv?' + qs.stringify(row))
        this.openWindowWithPost('/sysmanage/qxBaseIssuesNew/reqKbListExportToXlsx', row)
      })
    },
    openWindowWithPost (url, data) {
      var form = document.createElement('form')
      form.target = '_blank'
      form.method = 'POST'
      form.action = url
      form.style.display = 'none'
      for (var key in data) {
        var input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = data[key]
        form.appendChild(input)
      }
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    },
    getBranchData () {
      getBranchList().then(res => {
        let arr = []
        arr.push(res.data.data)
        // console.log([...res.data.data])
        this.defaultArr = []
        res.data.data.children.forEach(item => {
          this.defaultArr.push(item.org_id)
        })
        this.treedata = arr
        this.$nextTick(() => {
          if (typeof (this.$route.query.branchArr) !== 'undefined' && this.$route.query.branchArr !== '') {
            this.$route.query.branchArr.split(',').forEach(item => {
              this.$refs.tree.setChecked(item, true)
            })
            this.$refs.tree.getCheckedNodes().forEach(item => {
              if (!item.children || item.children.length === 0) {
                this.Checkvalue.push(item.org_name)
              }
            })
          }
          this.gettableData()
        })
      })
    },
    // 移除选中的标签
    removeCheck (val) {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      let id = ''
      this.CheckvalueArr.forEach(item => {
        if (item.org_name === val) {
          id = item.org_id
        }
      })
      this.CheckvalueArr = this.CheckvalueArr.filter(item => {
        return item.org_name !== val
      })
      this.$refs.tree.setChecked(id, false)
      this.$nextTick(() => {
        if (this.$refs.tree.getCheckedKeys(true) && this.$refs.tree.getCheckedKeys(true).length >= 25) {
          this.$refs.parentTree.style.width = '72%'
        } else {
          this.$refs.parentTree.style.width = '42%'
        }
      })
      this.gettableData()
    },
    // 获取选中的需求受理组
    handleCheckChange (data, checked, indeterminate) {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.Checkvalue = []
      this.CheckvalueArr = []
      let arr = checked.checkedNodes
      arr.forEach(item => {
        if (!item.hasOwnProperty('children') || item.children.length === 0) {
          this.Checkvalue.push(item.org_name)
          this.CheckvalueArr.push(item)
        }
      })
      this.$nextTick(() => {
        if (this.$refs.tree.getCheckedKeys(true) && this.$refs.tree.getCheckedKeys(true).length >= 25) {
          this.$refs.parentTree.style.width = '72%'
        } else {
          this.$refs.parentTree.style.width = '42%'
        }
      })
      this.gettableData()
    },
    handleClick () {
      this.tableData = []
      if (this.activeName === 'first') {
        this.listQuery.tracker_ids = 'oa'
      } else if (this.activeName === 'second') {
        this.listQuery.tracker_ids = '2'
      }
      setTimeout(() => {
        this.$refs.tableRed.doLayout()
        this.$refs.tableOa.doLayout()
      }, 100)
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.tableloading = true
      this.gettableData()
    },
    getallstatus () {
      listByMap().then(res => {
        // console.log(res)
        res.data.rows.forEach((item, index) => {
          if (item.needsStatus === 'OA送审中' || item.needsStatus === 'OA流程结束') {
            res.data.rows.splice(index, 1)
          }
        })
        this.allstatus = res.data.rows
      })
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.gettableData()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.gettableData()
    },
    changeitem (realClose) {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      for (let i = 0; i < this.listQuery.project_ids.length; i++) {
        if (this.listQuery.project_ids[i] === '') {
          this.listQuery.project_ids = []
        }
      }
      if (realClose) {
        this.listQuery.realClose = ''
      }
      this.tableloading = true
      this.gettableData()
    },
    gettableData () {
      this.$nextTick(() => {
        let branchArr = []
        this.$refs.tree.getCheckedNodes().forEach(item => {
          if (item.org_fn) {
            branchArr.push(item.org_fn)
          }
        })
        var row = {}
        if (this.activeName === 'first') {
          row = {
            // 项目ID 多个','拼接
            project_ids: this.listQuery.project_ids.join(','),
            // 开始时间
            start_date: this.changeTime[0] ? this.changeTime[0] : '',
            // 结束时间
            end_date: this.changeTime[1] ? this.changeTime[1] : '',
            // page第几页
            page: this.listQuery.page,
            // 每页数据条数
            pageSize: this.listQuery.pageSize,
            token: this.$cookie.get('token'),
            // 是否延期'yq'是 ''否
            isyq: this.listQuery.isyq,
            // 排序desc或asc
            orderType: this.listQuery.orderType,
            // 要排序的字段
            orderFiled: this.listQuery.orderFiled,
            // it实施状态
            status_ids: this.listQuery.statusIds.join(','),
            // 业务状态
            need_ids: this.listQuery.need_ids,
            // 是否为暂停需求23是 空字符串否
            status_id: this.listQuery.statusId,
            // 是否为超时未完成 'cswwc'是 空字符串为否
            cswwc: this.listQuery.cswwc,
            // oa
            tracker_ids: this.listQuery.tracker_ids,

            realClose: this.listQuery.realClose,
            // 需求受理部门 名称以，拼接
            acceptingGroups: branchArr.join(','),
            itBranchLiaison: this.listQuery.itName,
            due_date_start: this.planTime[0] ? this.planTime[0] : '',
            due_date_end: this.planTime[1] ? this.planTime[1] : ''
          }
        } else if (this.activeName === 'second') {
          row = {
            project_ids: this.listQuery.project_ids.join(','),
            start_date: this.changeTime[0] ? this.changeTime[0] : '',
            end_date: this.changeTime[1] ? this.changeTime[1] : '',
            page: this.listQuery.page,
            pageSize: this.listQuery.pageSize,
            token: this.$cookie.get('token'),
            isyq: this.listQuery.isyq,
            orderType: this.listQuery.orderType,
            orderFiled: this.listQuery.orderFiled,
            status_ids: this.listQuery.statusIds.join(','),
            status_id: this.listQuery.statusId,
            cswwc: this.listQuery.cswwc,
            tracker_ids: this.listQuery.tracker_ids,
            realClose: this.listQuery.realClose,
            due_date_start: this.planTime[0] ? this.planTime[0] : '',
            due_date_end: this.planTime[1] ? this.planTime[1] : ''
          }
        }
        getReqKbList(row).then(res => {
          // console.log(res)
          this.tableloading = false
          this.tableData = res.data.rows
          this.total = res.data.total
          setTimeout(() => {
            this.$refs.tableRed.doLayout()
            this.$refs.tableOa.doLayout()
          }, 100)
        })
      })
    },
    goRedmine (row) {
      window.open('http://192.25.97.80/redmine/issues/' + row)
    },
    getUserOptions () {
      const row = {
        project_id: ''
      }
      getuserdict(row).then(res => {
        this.userOptions = res.data.data
        // console.log(this.userOptions)
      })
    },
    getusername (id) {
      var username = ''
      this.userOptions.forEach(item => {
        if (Number(item.id) === Number(id)) {
          username = item.text
        }
      })
      return username
    },
    getproject () {
      this.listLoading = true
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId
          }
        //   this.userId = data.user.userId
          getProjectByUser(row).then(res => {
            this.projectOptions = res.data.list
            // console.log(this.projectOptions)
            this.projectOptionsAll = res.data.list
            this.projectOptions.unshift({
              id: '',
              name: '全部'
            })
          })
        }
      })
      const prorow = {
        token: this.$cookie.get('token')
      }
      getOaProjects(prorow).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          this.proAllname = res.data.data
          this.forSearchName = [...res.data.data]
        }
      })
    },
    useridgetname (id) {
      var name = ''
      this.projectOptions.forEach(item => {
        if (Number(id) === Number(item.id)) {
          name = item.name
        }
      })
      return name
    },
    changeOrder (column, prop, order) {
      this.tableloading = true
      this.listQuery.orderFiled = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.gettableData()
    },
    exit () {
      const row = {
        // avtiveName: this.$route.query.avtiveName,
        stime: this.$route.query.stime,
        etime: this.$route.query.etime,
        // radio: this.$route.query.radio,
        proid: this.$route.query.project_id,
        tracker_ids: this.$route.query.tracker_ids,
        radio: this.$route.query.isradio,
        branchArr: this.$route.query.branchArr
      }
      this.$router.push({path: '/OaPort', query: row})
    },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.forSearchName.forEach((item, index) => {
        if (this.forSearchName[index].toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(this.forSearchName[index])
        }
      })
      if (allList.length === 0) {
        this.proAllname = ['暂无数据']
      } else {
        this.proAllname = allList
      }
    },
    // 隔行变色
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'w-row'
      } else if (rowIndex % 2 === 1) {
        return 's-row'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.fstybox{
  margin-left: 15px;
}
.isyq{
  background-color: #fff;
  margin-top: 0px;
  // max-height: 94vh;
  // max-height: calc(100vh - 45px);
  // overflow: hidden;
.saltitle{
      height: 34px;
      background-color: #4b78cd;
      margin: 10px 0;
      line-height: 34px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    h2{
        font-size: 15px;
        color: #fff;
        margin: 0;
        padding: 0;
        padding: 0 0 0 15px;
    }
  }
}
</style>

<style>
.el-table .w-row {
    background: rgba(204, 224, 251, 0.3);
  }
  .el-table .s-row {
    background: #ffffff;
  }
</style>

<style>
  
  .onmouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
  .fix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .isyq .el-tabs__item.is-active{
    background-color: #4b78cd;
    color: #fff;
  }
  .isyq .el-tabs--card>.el-tabs__header .el-tabs__item{
    transition: color 0s !important;
  }
  .isyq .el-tabs__item:hover{
    /* color: #000; */
  }
</style>

<style scoped>
  .isyq >>> .el-tabs__header{
    margin: 0;
  }
  .isyq >>> .el-table td{
    padding: 7px 0;
  }
  .isyq >>> .mHei{
  }
  .allHei{
    height: calc(100vh - 350px);
    /* height: 63vh; */
    width: 0;
    position: absolute;
  }
  .isyq >>> .el-table th>.cell{
    padding: 0 5px;
  }
  .isyq >>> .el-pagination{
    padding: 3px 0;
  }
</style>

<style>

  .addsty .el-select-dropdown__item{
    padding: 0 0;
    height: auto !important;
  }
  .addsty .el-scrollbar__wrap {
    padding: 0 10px;
  }
  /* @media screen and (max-width: 1280px) {
    .mHei{
      max-height: 525px !important;
    }
    .mHei >>> .el-table__body-wrapper,.is-scrolling-none{
      max-height: 443px !important;
    }
  } */
</style>