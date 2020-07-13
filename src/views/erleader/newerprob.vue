<template>
    <div class="erprob">
        <div class="saltitle">
            <h2>产线问题</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="slidebox">
            <div class="item">
                <span>项目</span>
                <el-select v-model="listQuery.project_id" placeholder="请选择项目" multiple style="width:700px;" @change="getalldata">
                  <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:80%" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                  <el-option
                    v-for="item in projectOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            <div class="mouth">
                <span>时间范围</span>
                <el-date-picker
                  v-model="changeTime"
                  type="daterange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['08:00:00', '08:00:00']"
                  value-format="yyyy-MM-dd"
                  style="margin-left:15px"
                  :clearable="false"
                  @change="getalldata">
                </el-date-picker>
            </div>
        </div>

        <div class="echartsbox" style="height:250px;width:100%;padding:0 15px;">
          <el-row style="">
            <el-col :span="24">
              <p style="margin:0;padding:10px 0 0 15px;font-size:16px;font-weight:700;">产线问题分布</p>
              <div id="proline" ref="proline" style="width:100%;height:220px;"></div>
            </el-col>
          </el-row>
        </div>

        <div class="tabconent" style="padding:0 15px;">
           <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="累积待解决" name="first"></el-tab-pane>
            <el-tab-pane label="新增" name="second"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="itemtable">
             <el-table :data="tableData" style="width: 100%"
             :default-sort="{}"  v-loading="listLoading" element-loading-text="加载中。。。"
            @sort-change="productchangeOrder">
              <el-table-column prop="id" label="缺陷ID" width="100" sortable="custom"  align="center">
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
              
              <el-table-column prop="project_id" label="项目" sortable="custom" align="center" width="150">
                  <template slot-scope="scope">
                    <div style="text-align:center">{{checkitem(scope.row.project_id)}}</div>
                  </template>
              </el-table-column>

              <el-table-column prop="subject" label="主题" sortable="custom" align="center">
                  <template slot-scope="scope">
                    <div style="text-align:left">{{scope.row.subject}}</div>
                  </template>
              </el-table-column>
              <el-table-column label="创建时间" sortable="custom" align="center" width="120">
                  <template slot-scope="scope">
                    {{scope.row.created_on.split(' ')[0]}}                 
                  </template>
              </el-table-column>
              <el-table-column prop="status_id" label="状态" sortable="custom" align="center" width="120">
                  <template slot-scope="scope">
                    <el-tag>{{usestatusidgetname(scope.row.status_id)}}</el-tag>                    
                  </template>
              </el-table-column>
              <el-table-column prop="fixed_version_id" label="目标版本" sortable="custom" align="center" width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.version_name}}</span>                    
                </template>
              </el-table-column>
              <el-table-column prop="assigned_to_id" label="指派给" sortable="custom" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{usepersonidgetname(scope.row.assigned_to_id)}}</span>                    
                </template>
              </el-table-column>
              <el-table-column label="反馈者" sortable="custom" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.author_id}}</span>                
                </template>
              </el-table-column>
              <el-table-column prop="author_id" label="作者" sortable="custom" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{usepersonidgetname(scope.row.author_id)}}</span>                    
                </template>
              </el-table-column>
            </el-table>
        </div>
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
        <div class="close"> <el-button @click="exit">关闭</el-button></div>
    </div>
</template>

<script>
import echarts from 'echarts'

import API from '@/api'
// import {getCxBugByProject} from '@/api/xyzqPort/erprob'
import {getuserdict} from '@/api/xyzqPort/erstantard'
import {getProjectByUser} from '@/api/xyzqPort/erneed'
import {getCxBugListByTime, getCxBugEchartsByTime} from '@/api/xyzqPort/newerprob'
import {getAllStatusData} from '@/api/newEhomeJS/eproblem'
export default {
  data () {
    return {
      priorityOptions: [
        {id: '1', text: '低'},
        {id: '2', text: '普通'},
        {id: '3', text: '高'},
        {id: '4', text: '紧急'},
        {id: '5', text: '立刻'}
      ],
      listLoading: false,
      tableData: [],
      options: [],
      prooptions: [],
      projectOptionsAll: [],
      projectOptions: [],
      proinfo: [],
      valueitem: '全部',
      searchText: '',
      allitem: [],
      itemallname: [],
      userId: '',
      total: 0,
      listQuery: {
        project_id: [],
        pageIndex: 1,
        pageSize: 10,
        orderKey: 'id',
        orderType: 'desc'
      },
      allProjectIds: '',
      activeName: 'first',
      changeTime: [],
      allnamearr: [],
      allOptions: [
        {id: 1, text: '新建'},
        {id: 2, text: '修复中(进行中)'},
        {id: 3, text: '已修复(已解决)'},
        {id: 4, text: '延期'},
        {id: 5, text: '已关闭'},
        {id: 6, text: '已拒绝'},
        {id: 7, text: '重新打开'},
        {id: 8, text: '已提测'},
        {id: 13, text: '评审完成'},
        {id: 14, text: '开发中'},
        {id: 15, text: '测试中'},
        {id: 16, text: '待验收'},
        {id: 17, text: '验收完成'},
        {id: 18, text: '测试退回'},
        {id: 19, text: '部分上线'},
        {id: 20, text: '编码完成'},
        {id: 21, text: '反馈'},
        {id: 22, text: '未解决'},
        {id: 23, text: '重打开'},
        {id: 24, text: '等待变更'},
        {id: 25, text: '变更完成'},
        {id: 26, text: '待重现'},
        {id: 27, text: '暂停'},
        {id: 28, text: '实施中'},
        {id: 29, text: '代码审查中'},
        {id: 30, text: '取消'},
        {id: 31, text: '验证中'},
        {id: 32, text: '待执行'},
        {id: 33, text: '待审批'},
        {id: 34, text: '已验证'},
        {id: 36, text: '已上线'},
        {id: 38, text: '方案待确认'},
        {id: 40, text: '部分完成'},
        {id: 42, text: '拒绝修复'}
      ]
    }
  },
  created () {
    this.listQuery.project_id = [...this.$route.query.project_id]
    this.changeTime[0] = this.$route.query.stime
    this.changeTime[1] = this.$route.query.etime
    this.getproject()
    this.getnameid()  // 获取所有的人员信息id
    this.getalldata()
    this.getAllstatus() // 获取所有的状态
  },
  mounted () {
    // this.echartsproline()
  },
  methods: {
    getAllstatus () {
      const row = {
        tracker_id: ''
      }
      getAllStatusData(row).then(res => {
        console.log(res)
        this.allOptions = res.data.list
      })
    },
    exit () {
      const row = {
        activeName: this.$route.query.activeName,
        stime: this.changeTime[0],
        etime: this.changeTime[1],
        proid: this.listQuery.project_id
      }
      this.$router.push({path: '/newleaderReport', query: row})
    },
    goRedmine (row) {
      window.open('http://192.25.97.80/redmine/issues/' + row.id)
    },
    handleClick (tab, event) {
      // console.log(tab)
      // if (tab.index === '0') {
      //   this.listQuery.type = 'ljdjj'
      // } else if (tab.index === '1') {
      //   this.listQuery.type = 'xz'
      // }
      // this.listQuery.pageIndex = 1
      // this.listQuery.orderkey = 'id'
      // this.listQuery.orderType = 'desc'
      // this.searchData()
    },
    getnameid () {
      getuserdict().then(res => {
        this.allnamearr = res.data.data
      })
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
    usestatusidgetname (id) {
      var name = ''
      this.allOptions.forEach(item => {
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
    // 获取所有的项目
    getproject () {
      this.listLoading = true
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            roleName: '管理人员'
          }
          this.userId = data.user.userId
          getProjectByUser(row).then(res => {
            this.projectOptions = res.data.list
            this.projectOptionsAll = res.data.list
            this.projectOptions.unshift({
              id: '',
              name: '全部'
            })
          })
        }
      })
    },
    getalldata () {
      for (let i = 0; i < this.listQuery.project_id.length; i++) {
        if (this.listQuery.project_id[i] === '') {
          this.listQuery.project_id = []
        }
      }
      this.getechartsdata()
      this.getListData()
    },
    getListData () {
      this.listLoading = true
      var row = {
        page: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize,
        project_ids: this.listQuery.project_id.join(','),
        orderType: this.listQuery.orderType,
        orderKey: this.listQuery.orderKey,
        start_date: this.changeTime[0],
        end_date: this.changeTime[1]
      }
      getCxBugListByTime(row).then(response => {
        this.listLoading = false
        console.log(response)
        this.tableData = response.data.rows
        this.total = response.data.total
      })
    },
    getechartsdata () {
      var obj = {
        project_ids: this.listQuery.project_id.join(','),
        start_date: this.changeTime[0],
        end_date: this.changeTime[1]
      }
      var rows = {
        close: [],
        new: [],
        proname: [],
        unclose: []
      }
      getCxBugEchartsByTime(obj).then(res => {
        console.log(res)
        if (res.data.result === 'success') {
          rows.close = res.data.close
          rows.new = res.data.new
          rows.proname = res.data.proname
          rows.unclose = res.data.unclose
        }
        this.echartsproline(rows)
      })
    },
    // 分页
    sizeChangeHandle (val) {
      this.listQuery.pageSize = val
      this.getListData()
    },
    // // 当前页
    currentChangeHandle (val) {
      this.listQuery.pageIndex = val
      this.getListData()
    },
    // 排序
    productchangeOrder (column, prop, order) {
      this.listQuery.orderkey = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.getListData()
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
    echartsproline (obj) {
      // console.log(obj)
      var k = obj.proname.length
      if (obj.proname.length > 10) {
        k = 10
      }
      var name = []
      var newadd = []
      var unclose = []
      for (let i = 0; i < k; i++) {
        name.push(obj.proname[i])
        newadd.push(obj.new[i])
        unclose.push(obj.unclose[i])
      }
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
            barMaxWidth: 25,
            // data: youdata.error_num_list
            data: newadd
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
            barMaxWidth: 25,
            data: unclose
          }
        ]
      }, true)
    }
  }
}
</script>

<style lang="scss" scoped>
    .erprob{
        width: 100%;
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
        .slidebox{
          height: 50px;
          width: 100%;
          background-color: #fff;
          display: flex;
          align-items: center;
          padding: 0 20px;
          box-sizing: border-box;
          .item{
            margin-right: 50px;
            span{
                margin-right: 10px;
            }
          }
          .mouth{
            margin-right: 50px;
            span{
                margin-right: 10px;
            }
          }
        }
        .pagenumchoose{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
        background-color: #fff;
        }
        .close{
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 50px;
          padding-bottom: 40px;
          .el-button{
            background-color: #4B78CD;
            border-radius: 5px;
            color: #fff;
            border: none;
          }
        }
    }
</style>

<style lang="scss">
    .saltitle [class*=" el-icon-"], [class^=el-icon-]{
      font-size: 26px;
      color: #fff;
      font-weight: 700;
      margin-right: 20px;
      cursor: pointer;
    }
    .el-select-dropdown__wrap,.el-scrollbar__wrap{
      margin-bottom: -3px !important;
    }
    
    .el-tag{
      min-width: 60px;
      padding: 0 6px;
    }
</style>