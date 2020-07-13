<template>
  <div class="site-content site-content--home">
    <!-- <el-card :style="contentViewStyles">
      <h3>项目介绍</h3>
    </el-card> -->
    <!-- 第一排 -->
    <!-- <topbar></topbar> -->
    <!-- <header-bar></header-bar> -->
    <!-- <div @click="gpinfo">testCLikc</div> -->
    <el-row style="display:flex;space-between;margin-top:0px">
      <div class="headcolStyle" style="margin-right: 10px;">
        <div class="headimg" style="background:rgb(123,186,110);border:1px solid rgb(200,227,195)">
          <img style='width:18px;height: 18px;' src="~@/assets/img/home1.png" alt="">
        </div>
        <div class="headtitle">测试次数</div>
        <div class="headnum">{{testTimesData}}</div>
      </div>
      <div class="headcolStyle" style="margin-right: 10px;">
        <div class="headimg" style="background:rgb(114,180,240);border:1px solid rgb(177,215,249)">
          <img style='width:18px;height: 18px;' src="~@/assets/img/home2.png" alt="">
        </div>
        <div class="headtitle">被测系统</div>
        <div class="headnum">{{testAppsData}}</div>
      </div>
      <div class="headcolStyle" style="margin-right: 10px;">
        <div class="headimg" style="background:rgb(147,139,223);border:1px solid rgb(214,213,242)">
          <img style='width:18px;height: 18px;' src="~@/assets/img/home3.png" alt="">
        </div>
        <div class="headtitle">缺陷总数</div>
        <div class="headnum">{{defectTotalData}}</div>
      </div>
      <div class="headcolStyle">
        <div class="headimg" style="background:rgb(205,96,52);border:1px solid rgb(208,173,134)">
          <img style='width:18px;height: 18px;' src="~@/assets/img/home4.png" alt="">
        </div>
        <div class="headtitle">严重缺陷</div>
        <div class="headnum">{{defectBySeverityData}}</div>
      </div>
    </el-row>
    <!-- 第二排 -->
    <el-row style="margin-top:10px;display:flex;justify-content:space-between">
      <el-col id='generalSituation' :span='10' style=""></el-col>
      <el-col :span='14' class="recentTestWrap">
        <div class="recentTestHead">
            <div style="font-size:16px">近期测试</div>
            <div @click='goBatch' style="font-size:12px;color:rgb(111,180,246);cursor: pointer">更多></div>
        </div>
        <div style="position:relative"  v-for="item in latelyTestData" :key="item.batchNo">
          <div class="flexspace">
            <div style="font-size:13px;margin-left:10px">批次号:{{item.batchNo}}</div>
            <!-- <div style="font-size:8px;color:gray;">{{item.liableAuthor}}</div> -->
          </div>
          <div class="flexcenter" style="border-bottom: 1px solid #f5f5f5">
            <div class="jinimg">
              <img style='width:18px;height: 18px;' src="~@/assets/img/jin.png" alt="">
            </div>
            <div>
              <div style="font-size:13px;margin-bottom:10px">升级系统:{{item.upAppName}}</div>
              <div style="font-size:13px;margin-bottom:10px">开始日期:{{item.testBeginDate}}&nbsp;&nbsp;&nbsp;结束日期:{{item.testEndDate}}</div>
              <div style="font-size:13px;" class="morethree">测试描述:{{item.testDesc}}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
     <!-- 第三排 -->
    <el-row style="margin-top:10px;display:flex;justify-content:space-between;position:relative">
      <el-col :span='10' id='defects' style=""></el-col>
      <el-col :span='14' style="background:white">
        <div id='building' style="height:350px"></div>
      </el-col>
      <!-- <div class="buildingMore">更多></div> -->
    </el-row>
  </div>
</template>

<script>
  import Topbar from '../layout/topbar'
  import { getTestTimes, getTestApps, getDefectTotal, getDefectBySeverity, getTestSurvey,
    getLatelyTest, getDefectStat, getCaseBuild } from '@/api/home/index'
  import echarts from 'echarts'
  export default {
    data () {
      return {
        testTimesData: '',
        testAppsData: '',
        defectTotalData: '',
        defectBySeverityData: '',
        testSurveyData: '',
        latelyTestData: '',
        defectStatData: '',
        caseBuildData: ''
      }
    },
    components: {
      Topbar
    },
    created () {
      this.getTestTimes()
      this.getTestApps()
      this.getDefectTotal()
      this.getDefectBySeverity()
      this.getTestSurvey()
      this.getLatelyTest()
      this.getDefectStat()
      this.getCaseBuild()
    },
    mounted () {
      this.$nextTick(function () {
      })
    },
    methods: {
      gpinfo () {
        this.$router.push({ path: '/userInfo' })
        // this.$router.replace({ name: 'userInfo' })
      },
      goBatch () {
        this.$router.replace({ name: 'qxBaseBatch' })
      },
      getTestTimes () {
        this.testTimesData = ''
        getTestTimes().then(response => {
          this.testTimesData = response.data.result
        })
      },
      getTestApps () {
        this.testAppsData = ''
        getTestApps().then(response => {
          this.testAppsData = response.data.result
        })
      },
      getDefectTotal () {
        getDefectTotal().then(response => {
          this.defectTotalData = response.data.result
        })
      },
      getDefectBySeverity () {
        getDefectBySeverity().then(response => {
          this.defectBySeverityData = response.data.result
        })
      },
      getTestSurvey () {
        getTestSurvey().then(response => {
          this.testSurveyData = response.data.result
          this.drawPie('generalSituation')
        })
      },
      getLatelyTest () {
        getLatelyTest().then(response => {
          this.latelyTestData = response.data.result
        })
      },
      getDefectStat () {
        getDefectStat().then(response => {
          this.defectStatData = response.data.result
          this.drawPieD('defects')
        })
      },
      getCaseBuild () {
        getCaseBuild().then(response => {
          this.caseBuildData = response.data.result
          this.drawPieB('building')
        })
      },
      drawPie () {
        var myChart = echarts.init(document.getElementById('generalSituation'))
        var color = ['rgb(54,111,149)', 'rgb(65,143,202)', 'rgb(82,176,212)', 'rgb(165,209,219)', 'rgb(144,175,186)', 'rgb(60,139,191)', 'rgb(128,170,204)', 'rgb(182,213,220)']
        myChart.setOption({
          title: {
            text: '测试信息概况'
          },
          color: color,
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            trigger: 'item',
            y: 'bottom',
            width: '375px',
            data: this.testSurveyData.legend
          },
          series: [
            {
              name: '测试次数',
              type: 'pie',
              radius: ['30%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  formatter: '{abg|} {b|{b}: }{c} ',
                  // backgroundColor: '#eee',
                  // borderColor: '#aaa',
                  // borderWidth: 1,
                  // borderRadius: 4,
                  rich: {
                    a: {
                      fontSize: 16,
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    b: {
                      fontSize: 12,
                      lineHeight: 33
                    },
                    per: {
                      color: '#eee',
                      backgroundColor: '#334455',
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              data: this.testSurveyData.series
            }
          ]
        })
      },
      drawPieD () {
        var color = ['rgb(54,111,149)', 'rgb(65,143,202)', 'rgb(82,176,212)', 'rgb(165,209,219)', 'rgb(144,175,186)', 'rgb(60,139,191)', 'rgb(128,170,204)', 'rgb(182,213,220)']
        var myChart = echarts.init(document.getElementById('defects'))
        myChart.setOption({
          title: {
            text: '缺陷统计'
          },
          color: color,
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            bottom: '25%'
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              data: []
            }
          ],
          legend: {
            data: this.defectStatData.legend,
            y: 'bottom',
            width: '375px'
          },
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: this.defectStatData.series
        })
      },
      drawPieB () {
        var myChart = echarts.init(document.getElementById('building'))
        var color = ['rgb(169,221,223)', 'rgb(155,185,210)', 'rgb(125,182,111)', '#A6E39E']
        myChart.setOption({
          color: color,
          title: {
            text: '案例建设',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              splitLine: {show: false},
              data: this.caseBuildData.xAxis
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          calculable: true,
          series: this.caseBuildData.series
        })
      }
    },
    computed: {
      // contentViewStyles () {
      //   var height = this.$store.state.documentClientHeight
      //   height -= 50 // site-topbar
      //   height -= 15 // site-content padding-top
      //   height -= 15 // site-content padding-bottom
      //   height += 'px'
      //   return [
      //     { minHeight: height }
      //   ]
      // }
    }
  }
</script>

<style>
  @font-face {
    font-family: 'iconfont';  /* project id 642775 */
    src: url('//at.alicdn.com/t/font_642775_pzxuswyj76tj4i.eot');
    src: url('//at.alicdn.com/t/font_642775_pzxuswyj76tj4i.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_642775_pzxuswyj76tj4i.woff') format('woff'),
    url('//at.alicdn.com/t/font_642775_pzxuswyj76tj4i.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_642775_pzxuswyj76tj4i.svg#iconfont') format('svg');
  }
  .iconfont{
    font-family: 'iconfont';
    font-size:16px;
    font-style:normal
  }
  .headcolStyle{
    background: white;
    flex: 1;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center
  }
  .headimg{
    width:25px;
    height: 25px;
    border-radius: 50%;
    /* background: red; */
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .jinimg{
    width:25px;
    height: 25px;
    border-radius: 50%;
    background: rgb(244,237,230);
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .headnum{
    margin-left: 10px;
    font-size: 28px
  }
  .recentTestWrap{
    background:white;
    height:340px;
  }
  .recentTestHead{
    padding: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f5f5f5
  }
  .flexspace{
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .flexcenter{
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  #generalSituation{
    background:white!important;margin-right:20px;height:340px
  }
  #defects{
    background:white!important;margin-right:20px;height:400px
  }
  #building{
    background:white!important;height:400px;
  }
  .buildingMore{
    position: absolute;right: 5px;top: 5px;font-size:12px;color:rgb(111,180,246);cursor: pointer
  }
  .morethree{
    width:480px;
    display: -webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
    overflow: hidden;
  }
  .el-message-box__btns button{
    float: right;
    margin-left: 10px;
  }
</style>

