<template>
    <div class="task">
      <div class="saltitle">
            <h2>任务列表</h2>
            <i class="el-icon-close" @click='exit'></i>
      </div>
      <div class="defectheader">
            <el-row>
                <el-col :span="24">
                  <span style="margin-right:60px;">项目</span>
                  <el-select v-model="listQuery.project_id" placeholder="请选择" @change="changeitem" multiple style="width:80%">
                    <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:80%" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                    <el-option
                      v-for="item in projectOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <span>选择时间</span>
                  <el-date-picker
                  v-model="changeTime"
                  type="daterange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['08:00:00', '08:00:00']"
                  value-format="yyyy-MM-dd"
                  @change="timechangeitem"
                  style="margin-left:15px"
                  :clearable="false">
                </el-date-picker>
                </el-col>
                <el-col :span="14">
                    <div class="info" style="width:100%">
                      <span  style="width: 30%;text-align: center;margin-right: 30px;margin-left: 20px;">状态</span>
                        <el-select
                          v-model="listQuery.statusIds"
                          multiple
                          filterable
                          allow-create
                          default-first-option
                          placeholder="请选择状态" 
                          style="width:80%;"
                          @change="timechangeitem">
                          <el-option
                            v-for="item in statusOptions"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                          </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="开发测试" name="first"></el-tab-pane>
        <el-tab-pane label="任务测试" name="second"></el-tab-pane>
      </el-tabs>
      <el-row>
        <el-col :span="24">
          <p style="margin:0;padding:10px 0 0 15px;font-size:16px;font-weight:700;">测试任务</p>
          <div id="proline" ref="proline" style="width:100%;height:220px;"></div>
        </el-col>
      </el-row>

      
        <div class="itemtable">
             <el-table :data="tableData" style="width: 100%"
             :default-sort="{}"  v-loading="listLoading" element-loading-text="加载中。。。"
            @sort-change="productchangeOrder">
              <el-table-column prop="id" label="任务ID" width="100" sortable="custom"  align="center">
                  <template slot-scope="scope">
                    <!-- <div v-html="scope.row.id"></div> -->
                      <el-button type="text" @click="goRedmine(scope.row)">{{scope.row.id}}</el-button>
                  </template>
              </el-table-column>
              <el-table-column prop="priority_id" label="优先级" width="100" sortable="custom" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.priority_id === '3'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;text-align: center;">
                    <span style="color: #67c23a;text-align: center;">高</span></div>
                  <div v-else-if="scope.row.priority_id === '4'" style="width: 50px;height: 30px;background-color: #fdf6ec;line-height: 30px;margin:auto;text-align: center;">
                    <span style="color: #e6a23c;text-align: center;">紧急</span></div>
                  <div v-else-if="scope.row.priority_id === '5'" style="width: 50px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;text-align: center;">
                    <span style="color: #f56c6c;text-align: center;">立刻</span></div>
                  <div v-else-if="scope.row.priority_id === '2'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;text-align: center;">
                    <span style="color: #409eff;text-align: center;">普通</span></div>
                    <div v-else style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;text-align: center;">
                    <span style="color: #409eff;text-align: center;">低</span></div>
                </template>
              </el-table-column>
              
              <el-table-column prop="projectId" label="项目" sortable="custom" align="center" width="150">
                  <template slot-scope="scope">
                    <div style="text-align:center">{{checkitem(scope.row.projectId)}}</div>
                  </template>
              </el-table-column>

              <el-table-column prop="subject" label="主题" sortable="custom" align="center">
                  <template slot-scope="scope">
                    <div style="text-align:left">{{scope.row.subject}}</div>
                  </template>
              </el-table-column>
              <el-table-column prop="statusId" label="状态" sortable="custom" align="center" width="120">
                  <template slot-scope="scope">
                    <el-tag>{{usestatusidgetname(scope.row.statusId)}}</el-tag>                    
                  </template>
              </el-table-column>
              <el-table-column prop="assignedToId" label="指派给" sortable="custom" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{usepersonidgetname(scope.row.assignedToId)}}</span>                    
                </template>
              </el-table-column>
              <el-table-column prop="assigned_to_id" label="计划完成时间" sortable="custom" align="center" width="150">
                <template slot-scope="scope">
                  <span>{{usepersonidgetname(scope.row.assigned_to_id)}}</span>                    
                </template>
              </el-table-column>
            </el-table>
            <div class="pagenumchoose">
              <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="listQuery.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="listQuery.pageSize"
                :total="total"
                layout="total, sizes, prev, pager, next"
                class="pagenum">
              </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import API from '@/api'
import {getProjectByUser, getAllStatusData} from '@/api/xyzqPort/erneed'
import {getTaskListByTime} from '@/api/xyzqPort/task'
import {getuserdict} from '@/api/xyzqPort/erstantard'
import echarts from 'echarts'
export default {
  data () {
    return {
      projectOptions: [],
      listQuery: {
        project_id: [],
        statusIds: [],
        orderkey: 'id',
        orderType: 'desc',
        pageSize: 10,
        pageIndex: 1
      },
      total: 0,
      changeTime: [],
      itemallname: [],
      searchText: '',
      statusOptions: [],
      activeName: 'first',
      listLoading: true,
      tableData: [],
      tracker_id: '5',
      allnamearr: []
    }
  },
  created () {
    this.listQuery.project_id = [...this.$route.query.project_id]
    this.changeTime[0] = this.$route.query.stime
    this.changeTime[1] = this.$route.query.etime

    this.getproject()    // 获取所有的项目
    this.getStatusOptions() // 所有的状态码
    this.getnameid() // 获取所有的名称
    this.getlistdata()
  },
  methods: {
    exit () {
      const row = {
        activeName: this.$route.query.activeName,
        stime: this.changeTime[0],
        etime: this.changeTime[1],
        proid: this.listQuery.project_id
      }
      this.$router.push({path: '/newleaderReport', query: row})
    },
    usepersonidgetname (id) {
      var name = ''
      this.allnamearr.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.text
        }
      })
      return name
    },
    getnameid () {
      getuserdict().then(res => {
        this.allnamearr = res.data.data
      })
    },
    usestatusidgetname (id) {
      var name = ''
      this.statusOptions.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.text
        }
      })
      return name
    },
    checkitem (itemid) {
      // console.log(this.projectOptions)
      let proname = ''
      this.projectOptions.forEach(item => {
        if (item.id === itemid) {
          proname = item.name
        }
      })
      return proname
    },
    // 切换项目执行
    changeitem () {
      for (let i = 0; i < this.listQuery.project_id.length; i++) {
        if (this.listQuery.project_id[i] === '') {
          this.listQuery.project_id = []
        }
      }
      this.listLoading = true
      this.listQuery.statusIds = []
      this.getlistdata()
    },
    timechangeitem () {
      this.listLoading = true
      this.getlistdata()
    },
    productchangeOrder (column, prop, order) {
      this.listQuery.orderkey = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.getlistdata()
    },
    handleClick (tab, event) {
    //   console.log(tab)
      this.listLoading = true
      if (tab.name === 'first') {
        this.tracker_id = '5'
      } else if (tab.name === 'second') {
        this.tracker_id = '7'
      }
      this.getlistdata()
    },
    sizeChangeHandle (val) {
      this.listLoading = true
      this.listQuery.pageSize = val
      this.getlistdata()
    },
    currentChangeHandle (val) {
      this.listLoading = true
      this.listQuery.pageIndex = val
      this.getlistdata()
    },
    getproject () {
      // this.listLoading = true
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            roleName: '管理人员'
          }
          this.userId = row.userId
          // this.userId = data.user.userId
          getProjectByUser(row).then(res => {
            this.projectOptions = res.data.list
            // 搜索使用到
            // this.projectOptionsAll = res.data.list
            var arr = []
            res.data.list.forEach(item => {
              if (item.id !== '') {
                arr.push(item.id)
              }
            })
            this.Allproject_id = arr.join(',')
            this.projectOptions.unshift({
              id: '',
              name: '全部'
            })
            this.itemallname = this.projectOptions
          })
        }
      })
    },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      if (newVal.length > 0) {
        setTimeout(() => {
          this.itemallname.forEach((item) => {
            if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
              // console.log(123)
              allList.push(item)
            }
          })
          if (allList.length === 0) {
            this.projectOptions = [{name: '暂无数据', id: '', disabled: true}]
          } else {
            // console.log(allList)
            this.projectOptions = allList
          }
        }, 0)
      } else {
        this.projectOptions = this.itemallname
      }
    },
    getStatusOptions () {
      const row = {
        tracker_id: '1'
      }
      getAllStatusData(row).then(res => {
        this.statusOptions = res.data.list
        // console.log(this.statusOptions)
      })
    },
    getlistdata () {
      var obj = {
        page: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        project_ids: this.listQuery.project_id.join(','),
        orderType: this.listQuery.orderType,
        orderKey: this.listQuery.orderKey,
        start_date: this.changeTime[0],
        end_date: this.changeTime[1],
        tracker_id: this.tracker_id
      }
      getTaskListByTime(obj).then(res => {
        this.listLoading = false
        console.log(res)
        this.tableData = res.data.rows
        this.total = res.data.total
      })
    },
    echartsproline (obj) {
      // console.log(obj)
    //   var k = obj.proname.length
    //   if (obj.proname.length > 10) {
    //     k = 10
    //   }
    //   var name = []
    //   var newadd = []
    //   var unclose = []
    //   for (let i = 0; i < k; i++) {
    //     name.push(obj.proname[i])
    //     newadd.push(obj.new[i])
    //     unclose.push(obj.unclose[i])
    //   }
      var myChart = echarts.init(this.$refs.proline)
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        legend: {
          data: ['新增', '累积待解决']
        },
        grid: {
          left: '3%', // 组件离容器左侧的距离
          right: '4%',
          top: '18%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            data: name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
              // rotate: 30
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
                // width: 20
              }
            },
            axisLine: {
              show: false
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: '新增',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 25
            // data: youdata.error_num_list
            // data: newadd
            // data: obj.count
          }, {
            name: '累积待解决',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#42b165',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 25
            // data: unclose
          }
        ]
      }, true)
    }
  }
}
</script>
<style lang="scss" scoped>
    .task{
        background-color: #fff;
        // margin-top: 44px;
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
        .defectheader {
          width: 100%;
          height: 120px;
          line-height: 60px;
          background-color: #fff;
          span{
            margin: 0 15px;
          }
        }
        .pagenumchoose{
          width: 100%;
          display: flex;
          justify-content: flex-end;
          padding: 10px 0;
          background-color: #fff;
        }
    }
</style>