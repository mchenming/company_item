<template>
    <div class="cicdDs">
        <div style="display:flex;border:1px solid #ccc;">
            <div style="width:73%;" class="cicdDs_tit">
                <div style="width:100%;display:flex;align-items:flex-end;padding: 15px;">
                    <p>{{projectName}}: {{totalVal}}分</p>
                    <span style="text-decoration:underline;color:#09f;cursor:pointer;margin-left:10px" @click="goHistory()">查看历史得分</span>
                </div>
                <div style="display:flex;margin-bottom:20px;margin-top:10px;">
                  <div style="display:flex;padding:0 15px;">
                    <div style="width:70px;font-weight:700">评分时间：</div>
                    <div>{{time}}</div>
                  </div>
                  <div style="display:flex">
                    <div style="width:70px;font-weight:700">评分范围：</div>
                    <div style="flex:1;">{{planStr}}</div>
                  </div>
                </div>
                <div style="display:flex;height:130px;">
                    <div style="flex:5;border-top:1px solid #ccc;border-right:1px solid #ccc;display:flex;">
                        <!-- <div style="width:100%;display:flex;margin:20px 0;">
                            <div style="width:50%;padding:0 5px;">{{dataList[0].categoryName}}得分(总分{{dataList[0].totalVal}})：{{dataList[0].scoreVal}}分</div>
                            <div style="width:50%;padding:0 5px;">{{dataList[3].categoryName}}得分(总分{{dataList[3].totalVal}})：{{dataList[3].scoreVal}}分</div>
                        </div>
                        <div style="width:100%;display:flex;margin:20px 0;">
                            <div style="width:50%;padding:0 5px;">{{dataList[1].categoryName}}得分(总分{{dataList[1].totalVal}})：{{dataList[1].scoreVal}}分</div>
                            <div style="width:50%;padding:0 5px;">{{dataList[4].categoryName}}得分(总分{{dataList[4].totalVal}})：{{dataList[4].scoreVal}}分</div>
                        </div>
                        <div style="width:100%;display:flex;margin:20px 0;">
                            <div style="width:50%;padding:0 5px;">{{dataList[2].categoryName}}得分(总分{{dataList[2].totalVal}})：{{dataList[2].scoreVal}}分</div>
                            <div style="width:50%;padding:0 5px;"></div>
                        </div> -->
                        
                        
                        <div style="flex:1;border-right:1px solid #ccc;" v-for="(item,index) in dataList" :key="index">
                          <div style="height:30px;font-size:14px;font-weight:700;text-align:center;line-height:30px;">{{item.categoryName}}得分</div>
                          <div style="height:60px;padding:0px;display:flex;">
                            <span :class="iconSty[index]" style="color:#4b78cd;width:45%;text-align:center;"></span>
                            <span style="font-size:36px;font-weight:700;">{{item.scoreVal}}</span>
                          </div>
                          <div style="display:flex;">
                            <div style="width:47%;text-align:center;height:40px;font-size:12px;line-height:40px;border-top:1px solid #ccc;border-right:1px solid #ccc;">总分：{{item.totalVal}}分</div>
                            <div style="flex:1;text-align:center;height:40px;font-size:12px;line-height:40px;border-top:1px solid #ccc;">平均分：{{allAvg[index]}}分</div>
                          </div>
                        </div>

                    </div>
                </div>
            </div>
            <div style="flex:1;padding:0 10px;">
                <div style="width:100%;height:210px;" ref="radar" id="radar"></div>
            </div>
        </div>
        <div class="cicdDs_list" style="margin-top:15px;">
          <div style="display:flex;justify-content:space-between;">
            <div style="display:flex;align-items:flex-end;padding:0 15px;">
                <p style="margin:0;font-size:24px;font-weight:700;">得分明细</p>
                <span style="text-decoration:underline;color:#09f;cursor:pointer;margin-left:10px" @click="download()">评分标准说明</span>
            </div>
            <div style="overflow:hidden;">
                <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="goChartInfo()">得分分析</el-button>
                <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="$router.push({name: 'cicdIndex'})">返回</el-button>
            </div>
          </div>
            <div>
                <el-tabs v-model="activeName" @tab-click="handleClick" :class="TableList.length>1 ? '' : 'hideScrol'">
                  <el-tab-pane v-for="item in TableList" :key="item.project_id" :label="TableList.length>1 ? item.project_name+'('+`${item.totalval}`+'分)' : ''" :name="item.project_name">
                    <el-table
                      :data="item.list"
                      :span-method="objectSpanMethod"
                      style="width: 100%;">
                      <el-table-column prop="category_name" label="分类" width="180" align="center">
                      </el-table-column>
                      <el-table-column prop="score_name" label="细项" align="center">
                      </el-table-column>
                      <el-table-column prop="total_score" label="总分" align="center">
                      </el-table-column>
                      <el-table-column prop="score_val" label="得分" align="center">
                      </el-table-column>
                      <el-table-column prop="amount3" label="得分率" align="center">
                        <template slot-scope="scope">
                          <div v-if="(scope.row.total_score - 0) !== 0 && (scope.row.score_val - 0) !== 0" style="padding:12px 0;">{{(scope.row.score_val / scope.row.total_score * 100).toFixed(2)}}%</div>
                          <div v-else style="background-color:#fef1f1;padding:12px 0">0%</div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
import {getTopStatisData, getListByProject} from '@/api/cicd/cicdIndex'
import {systemlogStatis} from '@/api/modules/all'

import echarts from 'echarts'
export default {
  data () {
    return {
      projectId: '',
      projectName: '',
      // 总分
      totalVal: 0,
      time: '',
      dataList: [
        {totalVal: 0, scoreVal: 0, categoryName: '配置管理'},
        {totalVal: 0, scoreVal: 0, categoryName: '持续集成与部署管理'},
        {totalVal: 0, scoreVal: 0, categoryName: '测试管理'},
        {totalVal: 0, scoreVal: 0, categoryName: '代码质量管理'},
        {totalVal: 0, scoreVal: 0, categoryName: '交付能力与响应'}
      ],
      TableList: [],
      activeName: '',
      planStr: '',
      Base64: null,
      arr1: [],
      iconSty: ['fa fa-dashboard fa-3x', 'fa fa-cubes fa-3x', 'fa fa-diamond fa-3x', 'fa fa-id-card-o fa-3x', 'fa fa-archive fa-3x'],
      allAvg: [],
      searchType: 'new',
      statisPeriod: ''
    }
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: 'CICD',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    // console.log(unescape(this.$route.params.projectName))
    this.Base64 = require('js-base64').Base64
    if (this.$route.params.projectId) {
      this.projectId = this.Base64.decode(this.$route.params.projectId)
      this.projectName = this.Base64.decode(this.$route.params.projectName)
    }
    // console.log(this.$route.params.statisPeriod)
    if (this.$route.params.statisPeriod && this.$route.params.statisPeriod !== '%') {
      this.searchType = 'history'
      // this.statisPeriod = this.Base64.decode(this.$route.params.statisPeriod)
      this.statisPeriod = this.$route.params.statisPeriod
      // console.log(this.searchType)
      // console.log(this.statisPeriod)
    }
    this.getData()
    this.getTableList()
    this.getAllavg()
  },
  methods: {
    download () {
      window.open('/sysmanage/qxCicdStatisData/exportExcel?token=' + this.$cookie.get('token'))
    },
    getAllavg () {
      let obj = {
        searchType: 'new'
      }
      getTopStatisData(obj).then(res => {
        let {data} = res.data
        // console.log(data)
        let arr = data.map(item => { return item.scoreVal })
        this.allAvg = arr
      })
    },
    getPlanTime () {
      const end = new Date(this.time)
      let lw = new Date(end - 1000 * 60 * 60 * 24 * 90)
      // console.log(lw)
      var lastY = lw.getFullYear()
      var lastM = lw.getMonth() + 1
      var lastD = lw.getDate()
      // var lastH = lw.getHours()
      // var lastMin = lw.getMinutes()
      // var lastSe = lw.getSeconds()
      // var startdate = lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD) + ' ' + (lastH < 10 ? '0' + lastH : lastH) + ':' + (lastMin < 10 ? '0' + lastMin : lastMin) + ':' + (lastSe < 10 ? '0' + lastSe : lastSe)
      var startdate = lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD)
      this.planStr = `版本计划上线时间在 ${startdate} 至 ${this.time.substr(0, 10)} 之间`
    },
    // 获取头部数据 包括雷达图
    getData () {
      let obj = {
        searchType: this.searchType,
        projectId: this.projectId,
        statisPeriod: this.statisPeriod
      }
      getTopStatisData(obj).then(res => {
        this.dataList.forEach((item, index) => {
          res.data.data.forEach((value, i) => {
            if (item.categoryName === value.categoryName) {
              this.dataList[index] = res.data.data[i]
              if (i === 0) {
                this.time = res.data.data[i].statisPeriod
              }
            }
          })
        })
        this.getPlanTime()
        if (this.dataList && this.dataList.length > 0) {
          this.totalVal = this.dataList.reduce((p, e) => p + e.scoreVal, 0)
        }
        let obj = {
          name: [],
          seriesData: []
        }
        this.dataList.forEach(item => {
          obj.name.push(item.categoryName)
          let num = 0
          if (item.totalVal - 0 === 0 || item.scoreVal - 0 === 0) {
            num = 0
          } else {
            num = (item.scoreVal / item.totalVal * 100).toFixed(2)
          }
          obj.seriesData.push(num)
        })
        this.drawVBar('radar', obj, this.dataList)
      })
    },
    // 获取得分明细数据
    getTableList () {
      let obj = {
        projectId: this.projectId,
        searchType: this.searchType,
        statisPeriod: this.statisPeriod
      }
      getListByProject(obj).then(res => {
        if (res.data.data && res.data.data.length > 0) {
          this.activeName = res.data.data[0].project_name
          this.TableList = res.data.data
          this.setdates(this.TableList[0].list)
        }
      })
    },
    setdates (arr) {
      var obj = {}
      var k
      for (var i = 0, len = arr.length; i < len; i++) {
        k = arr[i].category_name
        if (obj[k]) {
          obj[k]++
        } else {
          obj[k] = 1
        }
      }
      // console.log(obj)
      for (var o in obj) {
        for (let i = 0; i < obj[o]; i++) {
          if (i === 0) {
            this.arr1.push(obj[o])
          } else {
            this.arr1.push(0)
          }
        }
      }
    },
    handleClick () {
      console.log(this.activeName)
    },
    goChartInfo () {
      let sendata = this.TableList.filter(item => {
        return item.project_name === this.activeName
      })
      let routeData = this.$router.resolve({
        name: 'cicdChartInfo',
        params: {
          projectId: this.Base64.encode(sendata[0].project_id),
          projectName: this.Base64.encode(sendata[0].project_name),
          proid: this.Base64.encode(this.projectId),
          proname: this.Base64.encode(this.projectName),
          statisPeriod: this.$route.params.statisPeriod
        }
      })
      window.open(routeData.href, '_blank')
    },
    goHistory () {
      let routeData = this.$router.resolve({
        name: 'cicdHistory',
        params: {
          projectId: this.Base64.encode(this.projectId),
          proname: this.Base64.encode(this.projectName)
        }
      })
      window.open(routeData.href, '_blank')
    },
    // 雷达图
    drawVBar (id, graphData, allData) {
      // console.log(graphData)
      var bussScenario = document.getElementById(id)
      var myChart = echarts.init(bussScenario)
      var dataArr = []
      if (graphData.name) {
        for (let a = 0; a < graphData.name.length; a++) {
          let str = graphData.name[a].substr(0, 5) + '\n' + graphData.name[a].substr(5)
          graphData.name[a].length > 5 ? graphData.name[a] = str : graphData.name[a] = graphData.name[a]
          dataArr.push({name: graphData.name[a] + '\n' + graphData.seriesData[a] + '%', max: 100})
        }
      }
      // if (graphData.seriesData.length === 3) {
      //   dataArr = [
      //       {name: graphData.name[0] + '\n' + graphData.seriesData[0] + '%', max: 100},
      //       {name: graphData.name[1] + '\n' + graphData.seriesData[1] + '%', max: 100},
      //       {name: graphData.name[2] + '\n' + graphData.seriesData[2] + '%', max: 100}
      //   ]
      // } else {
      //   dataArr = [
      //       {name: graphData.name[0] + '\n' + graphData.seriesData[0] + '%', max: 100},
      //       {name: graphData.name[1] + '\n' + graphData.seriesData[1] + '%', max: 100},
      //       {name: graphData.name[2] + '\n' + graphData.seriesData[2] + '%', max: 100},
      //       {name: graphData.name[3] + '\n' + graphData.seriesData[3] + '%', max: 100},
      //       {name: graphData.name[4] + '\n' + graphData.seriesData[4] + '%', max: 100}
      //   ]
      // }
      myChart.setOption({
        radar: {
        // shape: 'circle',
          name: {
            textStyle: {
              color: 'black',
              fontSize: 11,
              // position: 'TOP',
              // backgroundColor: 'red',
              width: '80px'
              // padding: '0 12px'
            }
          },
          center: ['50%', '60%'],
          indicator: dataArr,
          nameGap: 5
        },
        grid: {
          position: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params, ticket, callback) {
            // let res = params[0].name
            let res = ''
            for (let i = 0, l = allData.length; i < l; i++) {
              res += allData[i].categoryName + ':&nbsp;' + allData[i].scoreVal + '分，' + '得分率：' + params.value[i] + '%' + '<br/>'
            }
            return res
          }
        },
        series: [{
          type: 'radar',
          symbol: 'none',
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0)', // 图表中各个图区域的边框线拐点颜色
              lineStyle: {
                color: '#4b78cd', // 图表中各个图区域的边框线颜色
                opacity: 0.6
              },
              areaStyle: {
                type: 'default'
              }
            }
          },
          data: [
            {
              value: graphData.seriesData,
              // name: '预算分配',
              itemStyle: {
                normal: {
                  areaStyle: {
                    type: 'default',
                    opacity: 0.6, // 图表中各个图区域的透明度
                    color: '#4b78cd' // 图表中各个图区域的颜色
                  }
                }
              },
              label: {
                normal: {
                  show: true,
                  formatter: function (params) {
                    return params.value
                  }
                }
              }
            }
          ]
        }]
      }, true)
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // if (rowIndex === 6) {
        //   return {
        //     rowspan: 5,
        //     colspan: 1
        //   }
        // } else if (rowIndex === 0 || rowIndex === 3 || rowIndex === 11 || rowIndex === 14) {
        //   return {
        //     rowspan: 3,
        //     colspan: 1
        //   }
        // } else {
        //   return {
        //     rowspan: 0,
        //     colspan: 0
        //   }
        // }
        let _row = this.arr1[rowIndex]
        let _col = this.arr1[rowIndex] > 0 ? 1 : 0
        return [_row, _col]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .cicdDs{
        background-color: #fff;
        padding: 15px;
        .cicdDs_tit{
            p{
                margin: 0;
                font-size: 24px;
                font-weight: 700;
            }
        }
    }
</style>

<style>
.cicdDs .el-table tbody tr:hover>td { 
  background-color: transparent !important
}
</style>
<style scoped>
.cicdDs >>> .el-tabs__nav-wrap::after{
  height: 0;
}
.cicdDs >>> .el-tabs__item{
  width: initial;
  padding: 0 10px;
}
.cicdDs >>> .el-table td{
  padding: 0;
}
.hideScrol >>> .el-tabs__nav-scroll{
  height: 0;
}
.cicdDs >>> .el-table th.is-leaf{
  border-color: #e4e4e4;
}
.cicdDs >>> .el-table .cell{
  padding-right: 0;
}
</style>