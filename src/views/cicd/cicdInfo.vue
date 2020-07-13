<template>
    <div class='cicdInfo'>
        <div style="display:flex;border:1px solid #ccc;height:230px">
            <div style="width:60%;" class="cicdDs_tit">
                <div style="width:100%;display:flex;align-items:flex-end;padding: 15px;">
                    <p>兴证E家: 90分</p>
                    <span style="text-decoration:underline;color:#09f;cursor:pointer;margin-left:10px" @click="goHistory()">查看历史得分</span>
                </div>
                <div style="display:flex;height:173px;">
                    <div style="flex:5;padding:15px">
                        <div style="width:100%;display:flex;margin:20px 0;">
                            <div style="display:inline-block;width:50%">配置管理得分(总分10)：10分</div>
                            <div style="display:inline-block;width:50%">代码质量管理得分(总分20)：0</div>
                        </div>
                        <div style="width:100%;display:flex;margin:20px 0;">
                            <div style="width:50%">持续集成与部署得分(总分20)：10分</div>
                            <div style="width:50%">交付能力与响应得分(总分15)：0</div>
                        </div>
                        <div style="width:100%;display:flex;margin:20px 0;">
                            <div style="width:50%">测试管理得分(总分35)：10分</div>
                            <div style="width:50%"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="flex:1;">
                <div style="width:100%;height:230px;" ref="radar" id="radar"></div>
            </div>
        </div>
        <div style="margin-top:15px;border:1px solid #ccc;padding:15px;">
            <div style="display:flex;align-items:flex-end;">
                <p style="margin:0;font-size:24px;font-weight:700;">得分明细</p>
                <span style="text-decoration:underline;color:#09f;cursor:pointer;margin-left:10px">评分标准说明</span>
            </div>
            <div>
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column prop="date" label="分类" align="center">
                  </el-table-column>
                  <el-table-column prop="name" label="细项" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="评分说明" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="总分" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="得分" align="center">
                  </el-table-column>
                  <el-table-column prop="address" label="说明" align="center">
                  </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
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
  mounted () {
    let obj = {
      name: ['配置管理', '交付能力', '测试管理'],
      seriesData: [90, 98, 58]
    }
    this.drawVBar('radar', obj)
  },
  methods: {
    goHistory () {
      let routeData = this.$router.resolve({
        name: 'cicdHistory'
      })
      window.open(routeData.href, '_blank')
    },
    // 雷达图
    drawVBar (id, graphData) {
      var bussScenario = document.getElementById(id)
      var myChart = echarts.init(bussScenario)
      var dataArr = []
      if (graphData.seriesData.length === 3) {
        dataArr = [
            {name: graphData.name[0] + '\n' + graphData.seriesData[0] + '%', max: 100},
            {name: graphData.name[1] + '\n' + graphData.seriesData[1] + '%', max: 100},
            {name: graphData.name[2] + '\n' + graphData.seriesData[2] + '%', max: 100}
        ]
      } else {
        dataArr = [
            {name: graphData.name[0] + '\n' + graphData.seriesData[0] + '%', max: 100},
            {name: graphData.name[1] + '\n' + graphData.seriesData[1] + '%', max: 100},
            {name: graphData.name[2] + '\n' + graphData.seriesData[2] + '%', max: 100},
            {name: graphData.name[3] + '\n' + graphData.seriesData[3] + '%', max: 100},
            {name: graphData.name[4] + '\n' + graphData.seriesData[4] + '%', max: 100}
        ]
      }
      // var xAxisData = ['考勤完成', 'HR审批', '网报审批', '审批中心SSO', '协同SSO']
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
          center: ['40%', '55%'],
          indicator: dataArr,
          nameGap: 5
        },
        grid: {
          position: 'center'
        },
        series: [{
          type: 'radar',
          symbol: 'none',
          itemStyle: {
            normal: {
              color: 'rgba(0,0,0,0)', // 图表中各个图区域的边框线拐点颜色
              lineStyle: {
                color: '#ccc' // 图表中各个图区域的边框线颜色
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
    }
  }
}
</script>   

<style lang="scss" scoped>
    .cicdInfo{
        background-color: #fff;
        padding:15px;
        .cicdDs_tit{
            p{
                margin: 0;
                font-size: 24px;
                font-weight: 700;
            }
        }
    }
</style>