<template>
    <div class="newtask">
      <div class="saltitle">
            <h2>任务</h2>
            <i class="el-icon-close" @click='exit'></i>
      </div>
      <div class="taskheader">
        <el-row>
          <el-col :span="24" style="margin-left:20px;">
            <span>项目</span>
            <el-select v-model="listQuery.project_id" placeholder="请选择" @change="changeitem" multiple style="width:100%">
              <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:80%" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
              <el-option
                v-for="item in projectOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <span>时间范围</span>
            <el-date-picker
              v-model="changeTime"
              type="daterange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['08:00:00', '08:00:00']"
              value-format="yyyy-MM-dd"
              @change="changeSelectitem"
              style="margin-left:15px"
              :clearable="false">
            </el-date-picker>
          </el-col>
          <el-col :span="12">
              <span>状态</span>
              <el-select v-model="listQuery.state" multiple placeholder="请选择" style="width:500px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div class="taskcont">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="开发任务" name="first"></el-tab-pane>
          <el-tab-pane label="测试任务" name="second"></el-tab-pane>
        </el-tabs>
        <el-row>
            <el-col :span="24" style="height:280px;border:1px solid #ccc;">
                <p style="margin:0;padding:10px 0 0 15px;font-weight:700;font-size:15px;">{{title}}</p>
                <div class="echartsbox" ref="taskecharts" style="width:100%;height:250px;"></div>
            </el-col>
        </el-row>
        <el-row style="margin-top:15px;">
            <el-col :span="24">
                <el-table :data="tableData" style="width: 100%" @sort-change="productchangeOrder">
                  <el-table-column prop="date" label="任务ID" width="120" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="优先级" width="120" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="address" label="项目" width="150" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="主题" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="状态" width="120" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="指派给" width="120" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="name" label="计划完成时间" width="130" align="center" sortable="custom">
                  </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="24">
                <div class="pagenumchoose">
                  <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="listQuery.pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="listQuery.pageSize"
                    :total="tableData.length"
                    layout="total, sizes, prev, pager, next"
                    class="pagenum">
                  </el-pagination>
                </div>
            </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import API from '@/api'
import {getversiondict, getProjectByUser, getNewVersionByProject} from '@/api/xyzqPort/erneed'
export default {
  data () {
    return {
      projectOptions: [],
      listQuery: {
        project_id: [],
        orderkey: 'id',
        orderType: 'desc',
        statr: '',
        pageIndex: 1,
        pageSize: 10
      },
      changeTime: [],
    //   total: this.tableData.length,
      // 所有的版本id和text
      versionOptions: [],
      itemallname: [],
      searchText: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      activeName: 'first',
      title: '开发任务',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created () {
    this.getproject()
  },
  mounted () {
    // this.echartstask()
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
    handleClick (tab, event) {
      // console.log(tab)
      this.listQuery.pageSize = 10
      this.listQuery.pageIndex = 1
      this.title = tab.label
    //   if(tab.label==='')
    // 点击切换分页的时候需要对开发任务和测试任务进行判断执行
    },
    productchangeOrder (column, prop, order) {
      this.listQuery.orderkey = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      // 执行获取表格数据的
    //   this.searchData()
    },
    sizeChangeHandle (val) {
      this.listQuery.pageSize = val
    //   this.searchData()
    },
    // // 当前页
    currentChangeHandle (val) {
      this.listQuery.pageIndex = val
    //   this.searchData()
    },
    // 当点击切换项目时显示的版本
    changeitem (val) {
      this.listQuery.project_id = val
      this.getversion()
    },
    // 获取所有的项目
    getproject () {
      // this.listLoading = true
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            roleName: '管理人员'
          }
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
    // 切换项目时显示当前项目最新的版本
    getversion () {
      // debugger
      var obj = {
        projectId: this.listQuery.project_id
      }
      getversiondict(obj).then(res => {
        // console.log(res.data)
        this.versionOptions = res.data
        this.versionOptions.unshift({
          id: '',
          text: '全部'
        })
        getNewVersionByProject(this.listQuery).then(res => {
          // console.log(res.data)
          this.listQuery.version_id = ''
          if (res.data.list.length === 1) {
            if (res.data.list[0].version_id !== null && res.data.list[0].version_id !== '') {
              this.listQuery.version_id = res.data.list[0].version_id
            }
          }
          // 获取所选项目的最新版本需求的信息
          // console.log(this.listQuery)
          // 切换项目时时间默认我最近一个月的
        //   this.getjobdata()
        })
      })
    },
    // 搜索框失去焦点时
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    // 根据搜索输入内容提示搜索文本
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      // console.log(newVal)
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
    echartstask () {
      var myChart = echarts.init(this.$refs.taskecharts)
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
          x: 'center',
          // y: -5,
          data: ['已完成', '未完成']
        },
        grid: {
          left: '3%', // 组件离容器左侧的距离
          right: '4%',
          top: '15%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE'],
            // data: obj.name,
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
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            },
            // max: 25,
            // splitNumber: 5
            minInterval: 1
          }
        ],
        series: [
          {
            name: '已完成',
            type: 'bar',
            // stack: '堆叠',
            barGap: 0,
            barMaxWidth: '30px',
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            // data: obj.wc
            data: [23, 20, 18, 15, 12]
          },
          {
            name: '未完成',
            type: 'bar',
            // stack: '堆叠',
            barMaxWidth: '30px',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(165, 188, 230, 1)',
                label: {
                  show: true
                //   position: 'top'
                }
              }
            },
            // data: obj.mwc
            data: [2, 20, 14, 25, 12]
          }
        ]
      }, true)
    }
  }
}
</script>

<style lang="scss" scoped>
    .taskheader{
        height: 50px;
        background-color: #fff;
        line-height: 50px;
        margin-top: 10px;
    }
    .taskcont{
        background-color: #fff;
        padding: 0 15px;
    }
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
    .pagenumchoose{
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding: 10px 0;
      background-color: #fff;
    }
</style>

<style lang="scss">
    .el-tabs__item:focus.is-active.is-focus:not(:active) {
        -webkit-box-shadow: none !important;
        box-shadow: none !important;
    }
</style>