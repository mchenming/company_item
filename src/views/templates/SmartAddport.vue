<template>
    <div style="padding:15px;margin:15px 0;" class="addtem">
        <!-- <h1>{{portadd}}</h1> -->
        <el-row :gutter="20">
            <el-col :span="15">
                <p style="margin:10px 0;font-size:18px;font-weight:700;">重要功能号延时</p>
                <div id="addPort" ref="addPort" style="width:100%;height:200px;border:1px solid #eee"></div>
            </el-col>
            <el-col :span="9" style="">
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%;"
                  max-height="240"
                  @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55" align="center">
                  </el-table-column>
                  <el-table-column width="55" align="center" label=".">
                      <template slot-scope="scope">
                          <div style="background-color:#4b78cd;color:#fff;">
                              {{scope.$index + 1}}
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="functionNumber" label="重要功能号延时排行榜" align="center">
                      <template slot-scope="scope">
                          <div style="background-color:#4b78cd;color:#fff;">
                              {{scope.row.functionNumber}}
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="avg" label="." width="120" align="center">
                      <template slot-scope="scope">
                          <div style="background-color:#4b78cd;color:#fff;">
                              <div v-if="scope.row.hasOwnProperty('avg')">
                                {{scope.row.avg}}ms
                              </div>
                          </div>
                      </template>
                  </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import echarts from 'echarts'
import {getImportantDelayEchar, getImportantDelay} from '@/api/xyzqPort/smartTrader'
export default {
  data () {
    return {
      obj: {},
      tableData: [],
      multipleSelection: [],
      functionNumbers: ''
    }
  },
  props: ['portadd', 'porttype'],
  watch: {
    portadd: {
      handle (val) {
        console.log(11)
        this.getData('second')
      },
      deep: true
    }
  },
  mounted () {
    console.log(this.portadd)
    console.log(this.porttype)
    this.getData(this.porttype)
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
      let arr = this.multipleSelection.map(item => {
        return item.functionNumber
      })
      this.functionNumbers = arr.join(',')
      this.getChartData()
    },
    getData (type) {
      let obj = {
        startTime: this.portadd[0],
        endTime: this.portadd[1]
      }
      getImportantDelay(obj).then(res => {
        this.tableData = res.data.data
        if (type === 'first') {
          this.$nextTick(() => {
            res.data.data.forEach((item, index) => {
              if (index < 3) {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              }
            })
          })
        } else {
          this.getChartData()
        }
      })
    },
    getChartData () {
      let objChart = {
        startTime: this.portadd[0],
        endTime: this.portadd[1],
        functionNumbers: this.functionNumbers
      }
      getImportantDelayEchar(objChart).then(res => {
        let arr = []
        Object.keys(res.data.data).forEach(item => {
          let obj = {
            name: item,
            type: 'line',
            barGap: 0,
            itemStyle: {
              normal: {
                // color: '#4b78cd',
                // label: {
                //   show: true,
                //   position: 'top'
                // }
              }
            },
            showAllSymbol: true,
            data: res.data.data[item]
          }
          arr.push(obj)
        })
        let sendData = {
          arr: arr,
          time: res.data.timeList
        }
        this.echartsproline('addPort', sendData)
      })
    },
    echartsproline (id, data) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        // legend: {
        //   x: 'center',
        //   data: ['平均分', '本项目得分']
        // },
        grid: {
          top: '20%',
          left: '3%',
          right: '5%',
          bottom: '2%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          cursor: 'pointer',
          axisPointer: {
            type: 'shadow'
          },
          // formatter: function (params) {
          //   return params[0].name + '<br/>' + params[0].seriesName + ' : ' + params[0].value + '<br/>' + params[1].seriesName + ':' + params[1].value
          // }
        },
        xAxis: [
          {
            type: 'category',
            data: data.time,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 'auto',
              formatter: function (value) {
                return value.substr(0, 10) + '\n' + value.substr(10)
              }
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
              show: true
            //   lineStyle: {
            //     color: '#aaa'
            //   }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                // color: '#ccc'
              }
            }
          }
        ],
        series: data.arr
      }, true)
    }
  }
}
</script>

<style scoped>
    .addtem /deep/ .el-table td, .el-table th.is-leaf{
        border: none;
    }
    .addtem /deep/ .el-table th.is-leaf{
        border: none;
    }
    .addtem /deep/.el-table tbody tr:hover>td { 
    background-color:transparent !important
    }
    .addtem /deep/.el-table thead{
        font-weight: 700;
        font-size: 17px;
    }
    .addtem /deep/.el-table .cell{
        padding: 0;
        background-color: #4b78cd;
        color: #fff;
        height: 33px;
        line-height: 33px;
        /* border-radius: 10px; */
    }
    .addtem /deep/.el-table td:nth-of-type(1) .cell{
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .addtem /deep/.el-table td:nth-last-of-type(1) .cell{
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .addtem /deep/.el-table th:nth-of-type(1) .cell{
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .addtem /deep/.el-table th:nth-of-type(4) .cell{
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .addtem /deep/.el-table th:nth-of-type(2) .cell{
        color: transparent;
    }
    .addtem /deep/.el-table th:nth-of-type(4) .cell{
        color: transparent;
    }
    .addtem /deep/ .el-table td, .el-table th{
        padding: 5px 0;
    }
    .addtem /deep/ .el-table td .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: #fff;
      border-color: #aaa;
    }
    .addtem /deep/ .el-table td .el-checkbox__inner::after{
      border-color: #000;
    }
    .addtem /deep/ .el-table th .el-checkbox__input.is-indeterminate .el-checkbox__inner{
      background-color: #fff;
      border-color: #aaa;
    }
    .addtem /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before{
      background-color: #000;
    }
    .addtem /deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
      border-color: #aaa;
      background-color: #fff;
    }
    .addtem /deep/ .el-checkbox__inner::after{
      border-color: #000;
    }
</style>
