<template>
    <div class="eproblem">
        <div class="saltitle">
            <h2>生产问题</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="esaltime">
            <span>请选择月份</span>
            <el-select v-model="value" placeholder="请选择" @change='mouthdata'>
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.text"
                :value="item.text">
              </el-option>
            </el-select>
        </div>
        <div class="eprotable">
            <el-table :data="tableData.slice((pageIndex-1)*pageSize,pageIndex*pageSize)" style="width: 100%" :default-sort="{prop: '', order: ''}"
            @sort-change="descchangeOrder" v-loading='isloading'>
              <el-table-column label="缺陷ID" width="120" align="center" prop="1" sortable="custom">
                 <template slot-scope="scope">
                     <!-- <span v-html="scope.row[1]"></span> -->
                     <!-- {{scope.row.feedback_id}} -->
                      <el-button type="text" @click="goRedmine(scope.row)">{{scope.row.feedback_id}}</el-button>

                 </template>
              </el-table-column>
              <el-table-column label="优先级" width="120" align="center" prop="4" sortable="custom">
                  <template slot-scope="scope">
                    <!-- {{scope.row.priority_id}} -->
                      <span v-if="scope.row.priority_id === '3'" style="color: #67c23a;text-align: center;">高</span>
                      <span v-else-if="scope.row.priority_id === '4'" style="color: #e6a23c;text-align: center;">紧急</span>
                      <span v-else-if="scope.row.priority_id === '5'" style="color: #f56c6c;text-align: center;">立刻</span>
                      <span v-else-if="scope.row.priority_id === '2'" style="color: #409eff;text-align: center;">普通</span>
                      <span v-else style="color: #409eff;text-align: center;">低</span>
                 </template>
              </el-table-column>
              <el-table-column label="主题" align="center" prop="2">
                  <template slot-scope="scope">
                     <!-- <span v-html="scope.row[2]"></span> -->
                     <!-- {{scope.row.subject}} -->
                     <div style="text-align:left">{{scope.row.subject}}</div>
                     <!-- <p v-html="scope.row[2]" style="display: flex;justify-content: flex-start;flex-flow: wrap;"></p> -->
                 </template>
              </el-table-column>
              
              <el-table-column label="状态" min-width="30" align="center" prop='3' sortable="custom">
                  <template slot-scope="scope">
                    <el-tag>{{usestatusidgetname(scope.row.status_id)}}</el-tag>
                     <!-- <span v-html="scope.row[1]"></span> -->
                     <!-- <el-tag type="success" v-if="scope.row[3] === '已关闭'">{{scope.row[3]}}</el-tag>
                     <el-tag type="success" v-if="scope.row[3] === '修复中(进行中)'">{{scope.row[3].split("(")[0]}}</el-tag>
                     <el-tag v-if="scope.row[3] === '新建'">{{scope.row[3]}}</el-tag>
                     <el-tag v-if="scope.row[3] === '已提测'">{{scope.row[3]}}</el-tag>
                     <el-tag v-if="scope.row[3] === '已验证'">{{scope.row[3]}}</el-tag>
                     <el-tag v-if="scope.row[3] === '重新打开'">{{scope.row[3]}}</el-tag>
                     <el-tag type="danger" v-if="scope.row[3] === '拒绝修复'">{{scope.row[3]}}</el-tag>
                     <el-tag type="danger" v-if="scope.row[3] === '暂停'">{{scope.row[3]}}</el-tag> -->
                 </template>
              </el-table-column>
              
              <el-table-column prop="5" label="指派给" min-width="30" align="center" sortable="custom">
                <template slot-scope="scope">
                  {{usepersonidforname(scope.row.assigned_to_id)}}
                </template>
              </el-table-column>
              
              <el-table-column prop="6" label="反馈者" min-width="30" align="center" sortable="custom">
                <template slot-scope="scope">
                  {{(scope.row.feedback_name)}}
                </template>
              </el-table-column>
              
              <el-table-column  prop="7" label="作者" min-width="30" align="center" sortable="custom">
                <template slot-scope="scope">
                  {{usepersonidforname(scope.row.author_id)}}
                </template>
              </el-table-column>
            </el-table>
        </div>
        <div class="pagenumchoose">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="tableData.length"
            layout="total, sizes, prev, pager, next"
            class="pagenum">
          </el-pagination>
        </div>
        <div class="close"> <el-button @click="exit">关闭</el-button></div>
    </div>
</template>

<script>
import {getfeedbackmonthdict, getfeedbackdatalistv2, getAllStatusData} from '@/api/newEhomeJS/eproblem'
import {getuserdict} from '@/api/xyzqPort/erstantard'
import {systemlogStatis} from '@/api/modules/all'

// import API from '@/api'
export default {
  data () {
    return {
      changeTime: [],
      tableData: [],
      options: [],
      value: '',
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      allOptions: [],
      allnamearr: [],
      isloading: false
    }
  },
  created () {
    this.getAllstatus()
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '兴证E家',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    this.getmouth()
    this.getnameid()
    // console.log(this.tableData)
  },
  methods: {
    getAllstatus () {
      const row = {
        tracker_id: 3
      }
      getAllStatusData(row).then(res => {
        // console.log(res)
        this.allOptions = res.data.list
      })
    },
    goRedmine (row) {
      // console.log(row)
      window.open('http://192.25.97.80/redmine/issues/' + row.feedback_id)
    },
    // 根据用户的id获取用户的姓名
    usepersonidforname (id) {
      var name = ''
      this.allnamearr.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.text
        }
      })
      return name
    },
    usestatusidgetname (id) {
      var status = ''
      this.allOptions.forEach(item => {
        if (Number(item.id) === Number(id)) {
          status = item.text
        }
      })
      return status
    },
    // 获取所有用户的id和name
    getnameid () {
      getuserdict().then(res => {
        this.allnamearr = res.data.data
      })
    },
    descchangeOrder (column, prop, order) {
      var key = column.prop - 0
      console.log(key)
      // console.log(column)
      // console.log(prop)
      if (key === 5) {
        let namearr = this.allnamearr
        this.tableData.sort(function compareFunction (param1, param2) {
          var ord = 0
          var name = ''
          namearr.forEach(item => {
            if (Number(item.id) === Number(param1.assigned_to_id)) {
              name = item.text
            }
          })
          var name2 = ''
          namearr.forEach(item => {
            if (Number(item.id) === Number(param2.assigned_to_id)) {
              name2 = item.text
            }
          })
          if (column.order === 'ascending') {
            ord = name.localeCompare(name2, 'zh-Hans-CN', {sensitivity: 'accent'})
          } else {
            ord = name2.localeCompare(name, 'zh-Hans-CN', {sensitivity: 'accent'})
          }
          return ord
        })
      } else if (key === 6) {
        this.tableData.sort(function compareFunction (param1, param2) {
          var ord = 0
          // console.log(param1)
          if (column.order === 'ascending') {
            ord = param1.feedback_name.localeCompare(param2.feedback_name, 'zh-Hans-CN', {sensitivity: 'accent'})
          } else {
            ord = param2.feedback_name.localeCompare(param1.feedback_name, 'zh-Hans-CN', {sensitivity: 'accent'})
          }
          return ord
        })
      } else if (key === 7) {
        let namearr = this.allnamearr
        this.tableData.sort(function compareFunction (param1, param2) {
          var ord = 0
          var name = ''
          namearr.forEach(item => {
            if (Number(item.id) === Number(param1.author_id)) {
              name = item.text
            }
          })
          var name2 = ''
          namearr.forEach(item => {
            if (Number(item.id) === Number(param2.author_id)) {
              name2 = item.text
            }
          })
          if (column.order === 'ascending') {
            ord = name.localeCompare(name2, 'zh-Hans-CN', {sensitivity: 'accent'})
          } else {
            ord = name2.localeCompare(name, 'zh-Hans-CN', {sensitivity: 'accent'})
          }
          return ord
        })
      } else {
        var options = this.allOptions
        this.tableData.sort(function (obj1, obj2) {
          let val1 = 0
          let val2 = 0
          if (obj1[key] !== null && obj2[key] !== null) {
            if (key === 1) {
              val1 = obj1.feedback_id - 0
              val2 = obj2.feedback_id - 0
            } else if (key === 2) {
              val1 = obj1[key].length
              val2 = obj2[key].length
            } else if (key === 3) {
              for (let i = 0; i < options.length; i++) {
                const ele = options[i]
                if (Number(ele.id) === Number(obj1.status_id)) {
                  val1 = ele.id
                }
                if (Number(ele.id) === Number(obj2.status_id)) {
                  val2 = ele.id
                }
              }
            } else if (key === 4) {
              for (let i = 0; i < options.length; i++) {
                const ele = options[i]
                if (Number(ele.id) === Number(obj1.priority_id)) {
                  val1 = ele.id
                }
                if (Number(ele.id) === Number(obj2.priority_id)) {
                  val2 = ele.id
                }
              }
            }
          }
          if (column.order === 'ascending') {
            return val1 - val2
          } else {
            return val2 - val1
          }
        })
      }
    },
    mouthdata (val) {
      // console.log(val)
      this.options.forEach(item => {
        // console.log(item)
        if (item.text === val) {
          var obj = {
            mouth: item.id
          }
          this.getdata(obj)
        }
      })
    },
      // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
    },
    // // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
    },
    exit () {
      const row = {
        stime: this.$route.query.stime,
        etime: this.$route.query.etime,
        isKey: this.$route.query.iskey
      }
      this.$router.push({path: '/newEhome', query: row})
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const HH = (date.getHours()).toString().padStart(2, 0)
      const mm = (date.getMinutes()).toString().padStart(2, 0)
      // const ss = (date.getSeconds()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD} ${HH}:00:00`
      return time
    },
    getmouth () {
      getfeedbackmonthdict().then(res => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        var s = this.getTimeByDate(start)
        var e = this.getTimeByDate(end)
        var datemouth = e.split(',')[0].split(' ')[0].split('-').join('').substr(0, 6) + '01'
        this.options = res.data.data
        res.data.data.forEach(item => {
          if (item.id === datemouth) {
            this.value = item.text
            var obj = {
              mouth: item.id
            }
            this.getdata(obj)
          }
        })
      })
    },
    getdata (data) {
      var obj = {
        project_id: 26,
        static_month: data.mouth,
        feedback_type: 6
      }
      var obj2 = {
        project_id: 27,
        static_month: data.mouth,
        feedback_type: 6
      }
      this.isloading = true
      getfeedbackdatalistv2(obj).then(res => {
        getfeedbackdatalistv2(obj2).then(response => {
          // console.log(res)
          this.isloading = false
          var mobdata = []
          var pcdata = []
          if (res.data.data) {
            pcdata = res.data.data
          }
          if (response.data.data) {
            mobdata = response.data.data
          }
          var newarr = pcdata.concat(mobdata)
          // console.log(newarr)
          this.tableData = newarr
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .eproblem{
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
      .esaltime{
        span{
            margin-right: 20px;
        }
        padding: 0 50px;
        height: 50px;
        display: flex;
        align-items: center;
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
      .pagenumchoose{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        margin: 15px 0;
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
    .eproblem .el-tag{
        width: 105px;
        padding: 0 6px;
    }
</style>