<template>
    <div class="cicdchart">
        <p class="title">{{this.Base64.decode(this.$route.params.projectName)}}得分分析</p>
        <div style="text-align:right;">
          <el-button style="color:#fff;background-color:#4b78cd;margin-right:30px;border:none;" @click="goback()">返回</el-button>
        </div>
        <div style="display:flex;margin-top:30px;">
            <div class="chartInfo">
                <p>配置管理得分</p>
                <div style="width:100%;height:200px;" id="peizhi" ref="peizhi"></div>
                <div>
                  <el-table :data="tableData_pz" border style="width: 100%">
                    <el-table-column prop="score_name" label="细项" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="score_desc" label="说明" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.score_desc" v-html="scope.row.score_desc.replace(/\n/g, '<br/>')" style="text-align:left">{{scope.row.score_desc.replace(/\n/g, '%%')}}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
            </div>
            <div class="chartInfo">
                <p>持续集成与部署管理得分</p>
                <div style="width:100%;height:200px;" id="jicheng" ref="jicheng"></div>
                <div>
                  <el-table :data="tableData_jc" border style="width: 100%">
                    <el-table-column prop="score_name" label="细项" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="score_desc" label="说明" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.score_desc" v-html="scope.row.score_desc.replace(/\n/g, '<br/>')" style="text-align:left">{{scope.row.score_desc.replace(/\n/g, '%%')}}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
            </div>
        </div>

        <div style="display:flex;margin-top:30px;">
            <div class="chartInfo">
                <p>测试管理得分</p>
                <div style="width:100%;height:200px;" id="cesi" ref="cesi"></div>
                <div>
                  <el-table :data="tableData_cs" border style="width: 100%">
                    <el-table-column prop="score_name" label="细项" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="score_desc" label="说明" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.score_desc" v-html="scope.row.score_desc.replace(/\n/g, '<br/>')" style="text-align:left">{{scope.row.score_desc.replace(/\n/g, '%%')}}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
            </div>
            <div class="chartInfo">
                <p>代码质量管理得分</p>
                <div style="width:100%;height:200px;" id="zhiliang" ref="zhiliang"></div>
                <div>
                  <el-table :data="tableData_zl" border style="width: 100%">
                    <el-table-column prop="score_name" label="细项" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="score_desc" label="说明" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.score_desc" v-html="scope.row.score_desc.replace(/\n/g, '<br/>')" style="text-align:left">{{scope.row.score_desc.replace(/\n/g, '%%')}}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
            </div>
        </div>
        
        <div style="display:flex;margin-top:30px;">
            <div class="chartInfo">
                <p>交付能力与响应得分</p>
                <div style="width:100%;height:200px;" id="xiangying" ref="xiangying"></div>
                <div>
                  <el-table :data="tableData_jf" border style="width: 100%">
                    <el-table-column prop="score_name" label="细项" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="score_desc" label="说明" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.score_desc" v-html="scope.row.score_desc.replace(/\n/g, '<br/>')" style="text-align:left">{{scope.row.score_desc.replace(/\n/g, '%%')}}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
            </div>
            <div class="chartInfo">
            </div>
        </div>
        <div style="text-align:center;">
          <el-button style="color:#fff;background-color:#4b78cd;border:none;margin:50px 0 20px 0;" @click="goback()">返回</el-button>
        </div>
    </div>
</template>

<script>
import {getScoringAnalysis} from '@/api/cicd/cicdIndex'
import {systemlogStatis} from '@/api/modules/all'
import echarts from 'echarts'
export default {
  data () {
    return {
      tableData_pz: [],
      tableData_jc: [],
      tableData_cs: [],
      tableData_zl: [],
      tableData_jf: [],
      Base64: require('js-base64').Base64,
      searchType: 'new',
      statisPeriod: ''
    }
  },
  mounted () {
    if (this.$route.params.statisPeriod && this.$route.params.statisPeriod !== '%') {
      this.searchType = 'history'
      this.statisPeriod = this.$route.params.statisPeriod
    }
    let allObj = {
      url: this.$route.path,
      moduleName: 'CICD',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    this.getList()
  },
  methods: {
    goback () {
      // let proname = this.Base64.encode(this.$route.params.proname)
      // let proid = this.Base64.encode(this.$route.params.proid)
      this.$router.push({
        name: 'cicdDetails',
        params: {
          projectId: this.$route.params.proid,
          projectName: this.$route.params.proname,
          statisPeriod: this.$route.params.statisPeriod
        }
      })
    },
    getList () {
      let obj = {
        searchType: this.searchType,
        projectId: this.Base64.decode(this.$route.params.projectId),
        statisPeriod: this.statisPeriod
      }
      getScoringAnalysis(obj).then(res => {
        res.data.data.forEach(item => {
          if (item.categoryName === '配置管理') {
            this.echartsproline('peizhi', item)
            this.tableData_pz = item.list
          }
          if (item.categoryName === '测试管理') {
            this.echartsproline('cesi', item)
            this.tableData_cs = item.list
          }
          if (item.categoryName === '交付能力与响应') {
            this.echartsproline('xiangying', item)
            this.tableData_jf = item.list
          }
          if (item.categoryName === '持续集成与部署管理') {
            this.echartsproline('jicheng', item)
            this.tableData_jc = item.list
          }
          if (item.categoryName === '代码质量管理') {
            this.echartsproline('zhiliang', item)
            this.tableData_zl = item.list
          }
        })
      })
    },
    echartsproline (id, data) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        legend: {
          x: 'center',
          data: ['平均分', '本项目得分']
        },
        grid: {
          top: '20%',
          left: '0%',
          right: '0%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          cursor: 'pointer',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            return params[0].name + '<br/>' + params[0].seriesName + ' : ' + params[0].value + '<br/>' + params[1].seriesName + ':' + params[1].value
          }
        },
        xAxis: [
          {
            type: 'category',
            data: data.namelist,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
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
            name: '得分',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                // type: 'dashed'
              }
            },
            axisLine: {
              show: true
            //   lineStyle: {
            //     color: '#ccc'
            //   }
            }
          }
        ],
        series: [
          {
            name: '平均分',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#4b78cd',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 25,
            cursor: 'pointer',
            // data: data.arr2
            data: data.avgvallist
          },
          {
            name: '本项目得分',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgb(94,189,124)',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 25,
            cursor: 'pointer',
            // data: data.arr1
            data: data.scorelist
          }

        ]
      }, true)
    }
  }
}
</script>

<style lang="scss" scoped>
    .cicdchart{
        background-color: #fff;
        padding: 15px;
        .title{
            margin: 0;
            font-size: 36px;
            font-weight: 700;
            text-align: center;
        }
        .chartInfo{
            flex:1;
            min-height: 300px;
            padding: 0 30px;
            p{
                font-size: 24px;
                font-weight: 700;
                margin: 0;
            }
        }
    }
</style>

<style scoped>
  .cicdchart >>> .el-table td, .el-table th{
    padding:5px 0;
  }
  .cicdchart >>> .el-table th{
    padding: 5px 0;
  }
</style>