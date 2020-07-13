<template>
    <div class="topfive">
      <div class="saltitle">
          <h2>核心指标</h2>
          <i class="el-icon-close" @click='exit'></i>
      </div>
      <div class="esaltime">
        <span style="margin-left:20px;">时间范围:</span>
          <el-date-picker
            v-model="changeTime"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="defarr"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="getTimeCheck"
            style="margin-left:15px"
            :clearable="false">
          </el-date-picker>
          <!-- <div style="margin-left:30px">核心用户</div>
          <el-switch
            v-model="isKey"
            active-color="#4b78cd"
            inactive-color="#eacece"
            style="margin-left:15px;"
            @change="searchData()">
          </el-switch> -->
      </div>
      <h1 style="text-align:center" v-if="index_name==='all_index'">全部页面</h1>
      <h1 style="text-align:center" v-else>{{index_name}}页面</h1>
      <div class="topfivefoot" style="width:100%;height:600px;overflow-y:auto;" v-loading='isloading'>
          <div id="coretop" ref="coretop" style="width:100%;height:600px;"></div>
      </div>
      <div class="close">
          <el-button style="background-color:#4b78cd;color:#fff;border:none" @click="exit">关闭</el-button>
      </div>
    </div>
</template>

<script>
import echarts from 'echarts'
import {getindexItemdata, getcoreindexItemdata, getaboutdata} from '@/api/xyzqPort/etopfive'
export default {
  data () {
    return {
      msg: 'nishi',
      changeTime: [],
      isKey: false,
      defarr: [],
      index_name: '',
      isloading: true
    }
  },
  created () {
    this.changeTime[0] = this.$route.query.stime
    this.changeTime[1] = this.$route.query.etime
    this.defarr[0] = this.$route.query.stime.split(' ')[1]
    this.defarr[1] = this.$route.query.etime.split(' ')[1]
    this.isKey = this.$route.query.core
    this.index_name = this.$route.query.index_name
  },
  mounted () {
    // this.coretopecharts()
    if (this.isKey === true || this.isKey === 'true') {
      this.getcoredata()
    } else {
      this.getdata()
    }
  },
  methods: {
    exit () {
      const row = {
        stime: this.$route.query.stime,
        etime: this.$route.query.etime,
        isKey: this.$route.query.core
      }
      this.$router.push({path: '/newEhome', query: row})
    },
    getTimeCheck () {
      if (this.isKey === true) {
        this.getcoredata()
      } else {
        this.getdata()
      }
    },
    searchData () {
      // console.log(this.isKey)
      if (this.isKey === true) {
        this.getcoredata()
      } else {
        this.getdata()
      }
    },
    coretopecharts (obj) {
      if (obj.pageList.length > 20) {
        this.$refs.coretop.style.height = obj.pageList.length * 40 + 'px'
      }
      var myChart = echarts.init(this.$refs.coretop)
      myChart.resize()
      myChart.setOption({
        color: ['#4b78cd', '#4cca73'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          x: 'center',
          data: ['受访人数', '受访次数']
        },
        calculable: true,
        grid: {
          top: '5%',
          left: '3%',
          right: '5%',
          bottom: '1%',
          containLabel: true
        },
        yAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: obj.pageList,
            axisLabel: {
              interval: 0
            }
          }
        ],
        xAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '受访人数',
            type: 'bar',
            label: { normal: { show: true } },
            barMaxWidth: 80,
            // yAxisIndex: 0,
            itemStyle: {
              normal: {
                // color: 'rgb(94,189,124)',
                label: {
                  show: true,
                  position: 'right'
                }
              }
            },
            barGap: 0,
            data: obj.uvList
          },
          {
            name: '受访次数',
            type: 'bar',
            label: { normal: { show: true } },
            // yAxisIndex: 1,
            barMaxWidth: 80,
            itemStyle: {
              normal: {
                // color: 'rgb(94,189,124)',
                label: {
                  show: true,
                  position: 'right'
                }
              }
            },
            data: obj.pvList
          }
        ]
      }, true)
      // myChart.getZr().on('click', (params) => {
      //   if (obj.pageList.length === 54) {
      //     var pointInPixel = [params.offsetX, params.offsetY]
      //     if (myChart.containPixel('grid', pointInPixel)) {
      //       var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
      //       var xIndex = pointInGrid[1]
      //       var op = myChart.getOption()
      //       var checkname = op.yAxis[0].data[xIndex]
      //       // console.log(checkname)
      //       this.index_name = checkname
      //       // this.$router.push({path: '/etopfive', query: row})
      //       this.getdata()
      //     }
      //   }
      // })
      myChart.resize()
    },
    getdata () {
      this.$refs.coretop.style.height = 600 + 'px'
      var obj = {
        start_time: this.changeTime[0],
        end_time: this.changeTime[1],
        index_name: this.index_name
      }
      if (this.index_name === 'all_index') {
        getindexItemdata(obj).then(res => {
          const data = res.data.data
          this.isloading = false
          console.log(data)
          for (let i = 0; i < data.pageList.length; i++) {
            if (data.pageList[i] === 'None') {
              // console.log(i)
              data.pageList.splice(i, 1)
              data.pvList.splice(i, 1)
              data.uvList.splice(i, 1)
            }
          }
          for (let i = 0; i < data.pageList.length; i++) {
            if (data.pageList[i] === '后台日志') {
              // console.log(i)
              data.pageList.splice(i, 1)
              data.pvList.splice(i, 1)
              data.uvList.splice(i, 1)
            }
          }
          this.coretopecharts(data)
        })
      }
    },
    getcoredata () {
      var obj = {
        start_time: this.changeTime[0],
        end_time: this.changeTime[1],
        index_name: this.index_name
      }
      getcoreindexItemdata(obj).then(res => {
        const data = res.data.data
        for (let i = 0; i < data.pageList.length; i++) {
          if (data.pageList[i] === 'None') {
            // console.log(i)
            data.pageList.splice(i, 1)
            data.pvList.splice(i, 1)
            data.uvList.splice(i, 1)
          }
        }
        for (let i = 0; i < data.pageList.length; i++) {
          if (data.pageList[i] === '后台日志') {
            // console.log(i)
            data.pageList.splice(i, 1)
            data.pvList.splice(i, 1)
            data.uvList.splice(i, 1)
          }
        }
        this.isloading = false
        console.log(res)
        this.coretopecharts(data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.topfive{
    background-color: #fff;
    margin-top: 0px;;
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
  .esaltime{
    height: 50px;
    display: flex;
    align-items: center;
  }
  .close{
      margin-top: 30px;
      width: 100%;
      padding-bottom: 50px;
      display: flex;
      justify-content: center;
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
</style>