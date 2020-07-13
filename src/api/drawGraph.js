import echarts from 'echarts'

// graphData: {
//   id: '',
//   graphType: 0,
//   xAxisData: [],
//   yAxisData: [],
//   seriesData: [],
//   legendData: [],
//   titleText: ''
// }

export function drawGraph (id, graphData) {
  var type = graphData.graphType
  if (id === 'Pecharts') {
    drawEngineer(id, graphData)
  } else {
    switch (type) {
      case 10: // 柱状图
        drawVBar(id, graphData)
        break
      case 20: // 条形图
        drawHBar(id, graphData)
        break
      case 30: // 饼图
        drawPie(id, graphData)
        break
      case 40: // 环形图
        drawCircle(id, graphData)
        break
      case 50: // 基础线图
        drawBaseLine(id, graphData)
        break
      case 60: // 时间线图
        drawTimeLine(id, graphData)
        break
      case 99: // 雷达图
        drawRadar(id, graphData)
        break
    }
  }
}

// 10:柱状图
export function drawEngineer (id, graphData) {
  var myChart = echarts.init(document.getElementById(id))
  myChart.setOption({
    color: ['rgb(80,152,213)', 'rgb(130,141,240)', 'rgb(229,118,111)', 'rgb(132,196,67)'],
    title: {
      text: graphData.titleText
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      // x: 'right',
      // y: '3px',
      // data: ['数据']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      data: graphData.xAxisData,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    }],
    yAxis: [{
      name: '单位：天',
      type: 'value'
    }],
    series: [{
      name: '数据',
      data: graphData.seriesData,
      label: {
        normal: {
          show: true,
          formatter: '{c}'
        }
      },
      type: 'bar'
    }]
  }, true)
}
// 10:柱状图
export function drawVBar (id, graphData) {
  var myChart = echarts.init(document.getElementById(id))
  myChart.setOption({
    color: ['rgb(80,152,213)', 'rgb(130,141,240)', 'rgb(229,118,111)', 'rgb(132,196,67)'],
    title: {
      text: graphData.titleText
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      // x: 'right',
      // y: '3px',
      // data: ['数据']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      data: graphData.xAxisData,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    }],
    yAxis: [{
      type: 'value'
    }],
    series: [{
      name: '数据',
      data: graphData.seriesData,
      label: {
        normal: {
          show: true,
          formatter: '{c}'
        }
      },
      type: 'bar'
    }]
  }, true)
}
// 20:条形图
export function drawHBar (id, graphData) {
  var myChart = echarts.init(document.getElementById(id))
  myChart.setOption({
    color: ['rgb(80,152,213)'],
    title: {
      text: graphData.titleText
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      // x: 'right',
      // data: ['总数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: graphData.yAxisData
    },
    series: [{
      data: graphData.seriesData,
      type: 'bar',
      label: {
        normal: {
          show: true,
          formatter: '{c}'
        }
      },
      name: '总数'
    }]
  }, true)
}
// 30:饼图
export function drawPie (id, graphData) {
  var myChart = echarts.init(document.getElementById(id))
  myChart.setOption({
    color: ['rgb(100,168,243)', 'rgb(130,141,240)', 'rgb(229,118,111)', 'rgb(132,196,67)', 'rgb(242,163,132)'],
    title: {
      text: graphData.titleText
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
    //   orient: 'vertical',
    //   right: 0,
    //   bottom: 100,
    //   data: graphData.legendData
    },
    series: [{
      type: 'pie',
      radius: '40%',
      center: ['50%', '60%'],
      label: {
        normal: {
          show: true,
          formatter: '{b} \n {c} ({d}%)'
        }
      },
      data: graphData.seriesData
      // label: {
      //   normal: {
      //     show: false
      //   }
      // },
      // labelLine: {
      //   normal: {
      //     show: false
      //   }
      // }
    }]
  }, true)
}
// 40:环形图
export function drawCircle (id, graphData) {
  var myChart = echarts.init(document.getElementById(id))
  myChart.setOption({
    color: ['rgb(100,168,243)', 'rgb(130,141,240)', 'rgb(229,118,111)', 'rgb(132,196,67)', 'rgb(242,163,132)'],
    title: {
      text: graphData.titleText
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
    //   orient: 'vertical',
    //   right: 0,
    //   top: 0,
    //   data: rows.legendData
    },
    series: [{
      type: 'pie',
      radius: ['25%', '40%'],
      center: ['50%', '60%'],
      label: {
        normal: {
          show: true,
          formatter: '{b} \n {c} ({d}%)'
        }
      },
      data: graphData.seriesData
    }]
  }, true)
}
// 50:基础线图
export function drawBaseLine (id, graphData) {
  graphData.seriesData[0]['itemStyle'] = {normal: {label: {show: true}}}
  var myChart = echarts.init(document.getElementById(id))
  myChart.setOption({
    color: ['rgb(136,188,246)', 'rgb(211,231,253)'],
    title: {
      text: graphData.titleText
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      // x: 'right',
      // data: graphData.legendData
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: graphData.xAxisData,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value'
    },
    series: graphData.seriesData
  }, true)
}
// 60:时间线图
export function drawTimeLine (id, graphData) {
  var myChart = echarts.init(document.getElementById(id))
  myChart.setOption({
    color: ['rgb(80,152,213)', 'rgb(130,141,240)', 'rgb(229,118,111)', 'rgb(132,196,67)'],
    title: {
      text: graphData.titleText
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      // x: 'right',
      // data: ['月总数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: graphData.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '月总数',
      data: graphData.seriesData,
      type: 'line'
    }]
  }, true)
}
  // 99:雷达图
export function drawRadar (id, data) {
  var maxValue = 1
  if (data.seriesData.length > 0) {
    for (let i = 0; i < data.seriesData.length; i++) {
      if (data.seriesData[i] > maxValue) {
        maxValue = data.seriesData[i]
      }
    }
  }
  const indValue = ['']
  if (data.yAxisData.length > 0) {
    indValue.splice(0, 1)
    for (let i = 0; i < data.yAxisData.length; i++) {
      const value = {text: data.yAxisData[i], max: maxValue}
      indValue.push(value)
    }
  }
  var myChart = echarts.init(document.getElementById(id))
  myChart.setOption({
    color: ['rgb(100,168,243)', 'rgb(130,141,240)', 'rgb(229,118,111)', 'rgb(132,196,67)'],
    title: {
      text: data.titleText
    },
    tooltip: {
      trigger: 'axis'
    },
    radar: [
      {
        indicator: indValue,
        radius: 80
      }
    ],
    series: [
      {
        type: 'radar',
        tooltip: {
          trigger: 'item'
        },
        itemStyle: {normal: {areaStyle: {type: 'default'}}},
        data: [
          {
            value: data.seriesData,
            name: data.titleText
          }
        ]
      }
    ]
  }, true)
}
