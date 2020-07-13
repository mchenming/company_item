<template>
    <div class="isyq">
        <div class="saltitle">
            <h2>
              <span v-if="this.$route.query.Prostauts==='上线完成'">上线完成需求列表</span>
              <span v-else-if="this.$route.query.Prostauts!=='上线完成'">{{this.$route.query.listName}}</span>
            </h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
          <el-row style="height:50px;line-height:50px;padding-left:15px;">
            <el-col :span="14">
                <div class="item">
                    <span>项目</span>
                    <el-select v-model="listQuery.project_ids" placeholder="全部" multiple style="width:90%;" @change="changeitem">
                      <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:90%" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                      <el-option
                        v-for="item in projectOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </div>
            </el-col>
            <el-col :span="10">
                <div class="mouth">
                    <span>发起时间</span>
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
          </el-row>

          <el-row style="height:50px;line-height:50px;padding-left:15px;">
            <el-col :span="14">
                <div class="item">
                    <span>状态</span>
                    <el-select
                      v-model="listQuery.statusIds"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择状态" 
                      style="width:90%;"
                      @change="changeitem">
                      <el-option
                        v-for="item in allstatus"
                        :key="item.needsStatus"
                        :label="item.needsStatus"
                        :value="item.needsStatus">
                      </el-option>
                    </el-select>
                </div>
            </el-col>
          </el-row>

         <el-table :data="tableData" style="width: 100%" v-loading='tableloading' @sort-change="changeOrder" :row-class-name="tableRowClassName">
          <el-table-column prop="id" label="ID" width="100" align="center" sortable="custom">
              <template slot-scope="scope">
                  <a href="javascript:;" @click="goRedmine(scope.row.id)">{{scope.row.id}}</a>
              </template>
          </el-table-column>
          <el-table-column prop="subject" label="标题" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.subject}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="project_id" label="涉及系统" align="center" sortable="custom" width="165">
              <template slot-scope="scope">
                  {{useridgetname(scope.row.project_id)}}
              </template>
          </el-table-column>
          <el-table-column prop="created_on" label="发起日期" align="center" sortable="custom" width="130">
            <template slot-scope="scope">
                  {{scope.row.created_on.split(' ')[0]}}
              </template>
          </el-table-column>
          
          <el-table-column prop="due_date" label="计划验收日期" align="center" sortable="custom" width="130">
          </el-table-column>
          
          <el-table-column prop="assigned_to_id" label="创建人" align="center" sortable="custom" width="120">
              <template slot-scope="scope">
                  {{scope.row.author_id}}
              </template>
          </el-table-column>
          
          <el-table-column prop="avgDay" label="累计耗时" align="center" sortable="custom" width="120">
              <template slot-scope="scope">
                  <div><span v-if="Number(scope.row.avgDay)>60" style="color:red">{{scope.row.avgDay}}</span><span v-else>{{scope.row.avgDay}}</span>天</div>
              </template>
          </el-table-column>
          
          <el-table-column prop="priority_id" label="优先级" align="center" width="120" sortable="custom">
              <template slot-scope="scope">
                <span v-if="scope.row.priority_id === '3'" style="text-align: center;">高</span>
                <span v-else-if="scope.row.priority_id === '4'" style="text-align: center;">紧急</span>
                <span v-else-if="scope.row.priority_id === '5'" style="text-align: center;">立刻</span>
                <span v-else-if="scope.row.priority_id === '2'" style="text-align: center;">普通</span>
                <span v-else style="text-align: center;">低</span>
              </template>
          </el-table-column>

          <el-table-column prop="avgDay" label="状态" align="center" sortable="custom" width="120">
              <template slot-scope="scope">
                  <div><span>{{scope.row.needs_status}}</span></div>
              </template>
          </el-table-column>
        </el-table>
        <el-row>
            <el-col :span="24" style="display:flex;background-color:#fff;padding:10px 15px;justify-content: flex-end;">
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
import {getReqKbList} from '@/api/xyzqPort/NeedPort'
import {getProjectByUser, getuserdict} from '@/api/xyzqPort/erneed'
import {listByMap} from '@/api/xyzqPort/yewuneed'  // 获取所有的状态码
import {systemlogStatis} from '@/api/modules/all'

import API from '@/api'

export default {
  data () {
    return {
      tableData: [],
      tableloading: true,
      listQuery: {
        project_ids: [],
        page: 1,
        pageSize: 10,
        orderType: 'desc',
        orderFiled: 'created_on',
        statusIds: [],
        isyq: '',
        statusId: '',
        cswwc: ''
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
      allstatus: []
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
    if (this.$route.query.Prostauts) {
      this.$set(this.listQuery.statusIds, 0, this.$route.query.Prostauts)
      if (this.$route.query.Prostauts === '待上线') {
        this.listQuery.statusIds = ['待上线', '提交验收']
      }
    }
    if (this.$route.query.stop) {
      this.listQuery.statusId = 23
    }
    this.getproject()         // 获取所有的项目
    this.getUserOptions()     // 获取所有的人名对应的id
    this.getallstatus()       // 获取所有的状态
    this.gettableData()       // 获取表格数据
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '旧需求看板',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  methods: {
    getallstatus () {
      listByMap().then(res => {
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
    changeitem () {
      for (let i = 0; i < this.listQuery.project_ids.length; i++) {
        if (this.listQuery.project_ids[i] === '') {
          this.listQuery.project_ids = []
        }
      }
      this.tableloading = true
      this.gettableData()
    },
    gettableData () {
      const row = {
        project_ids: this.listQuery.project_ids.join(','),
        start_date: this.changeTime[0],
        end_date: this.changeTime[1],
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        token: this.$cookie.get('token'),
        isyq: this.listQuery.isyq,
        orderType: this.listQuery.orderType,
        orderFiled: this.listQuery.orderFiled,
        status_ids: this.listQuery.statusIds.join(','),
        status_id: this.listQuery.statusId,
        cswwc: this.listQuery.cswwc,
        tracker_ids: 2
      }
      getReqKbList(row).then(res => {
        // console.log(res)
        this.tableloading = false
        this.tableData = res.data.rows
        this.total = res.data.total
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
        avtiveName: this.$route.query.avtiveName,
        stime: this.$route.query.stime,
        etime: this.$route.query.etime,
        radio: this.$route.query.radio,
        proid: this.$route.query.project_id
      }
      this.$router.push({path: '/ReqPort', query: row})
    },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
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
.isyq{
  background-color: #fff;
  margin-top: 0px;
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
        padding: 0 0 0 30px;
    }
  }
}
</style>

<style>
.saltitle [class*=" el-icon-"], [class^=el-icon-]{
  font-size: 26px;
  color: #fff;
  font-weight: 700;
  margin-right: 20px;
  cursor: pointer;
}
.el-table .w-row {
    background: rgba(204, 224, 251, 0.3);
  }
  .el-table .s-row {
    background: #ffffff;
  }
</style>