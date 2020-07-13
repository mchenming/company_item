<template>
  <div id='app'>
    <!-- <img src='./assets/logo.png' /> -->
    <div class='wl-gantt-demo' style='width:80%'>
      <wlGantt
        ref='wl-gantt-demo'
        start-date='2020-05-06'
        end-date='2020-07-02'
        :autoGanttDateType='false'
        date-type='yearAndWeek'
        :data='data'
        :contextMenuOptions='contextMenuOptions'
      ></wlGantt>
    </div>
  </div>
</template>

<script>
// import wlGantt from './components/gantt.vue';
import wlGantt from '&p/pages/wl-gantt/index.vue'

export default {
  // name: 'app',
  data () {
    return {
      data: [
        {
          id: '1',
          name: '旅行',
          startDate: '2020-06-08',
          // endDate: '2019-10-31',
          planDate: '2020-06-20'
        },
        {
          id: '2',
          name: 'dhasnkfkasd',
          startDate: '2020-06-20',
          endDate: ''
        },
        {
          id: '3',
          name: 'shanghai',
          startDate: '2020-06-20',
          endDate: '2020-07-01'
        }
      ], // 数据
      contextMenuOptions: [
        { label: '任务名称', prop: 'name' },
        { label: '开始时间', prop: 'startDate' },
        { label: '结束时间', prop: 'endDate' },
        { label: '计划时间', prop: 'planDate' }
      ]
    }
  },
  methods: {
    /**
     * 时间发生更改
     * row: Object 当前行数据c
     */
    timeChange (row) {
      console.log('时间修改:', row)
    },
    //
    /**
     * 前置任务发生更改
     * row: Object 当前行数据
     * oldval: [String, Array] 前置修改前的旧数据
     * handle: Boolean 是否用户编辑产生的改变
     */
    preChange (row, oldval, handle) {
      console.log('前置修改:', row, oldval, handle)
    },
    // 数表展开行
    expandChange (row, expanded) {
      console.log('展开行:', row, expanded)
    },
    // 多选选择
    selectionChange (val) {
      console.log('多选：', val)
    },
    // 删除任务
    taskRemove (item) {
      console.log('删除任务：', item)
    },
    // 添加任务
    taskAdd (item) {
      console.log('添加任务：', item)
      this.$refs['wl-gantt-demo'].loadTreeAdd(item.id, {
        pid: item.id,
        id: '###',
        name: '一轮新月',
        startDate: '2019-10-11',
        endDate: '2019-10-19'
      })
    },
    // 懒加载
    lazyLoad (tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: '1-1-1',
            pid: tree.id,
            name: '日落云巅',
            startDate: '2019-09-10',
            endDate: '2019-09-13'
          }
        ])
      }, 1000)
    }
  },
  components: {
    wlGantt
  }
}
</script>

<style lang='scss'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 20px 25px 0;
}

.wl-gantt-demo {
  margin: 40px auto;
  // width: 800px;
}
</style>
