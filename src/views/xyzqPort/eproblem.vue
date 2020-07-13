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
            @sort-change="descchangeOrder">
              <el-table-column label="缺陷ID" width="120" align="center" prop="1" sortable="custom">
                 <template slot-scope="scope">
                     <span v-html="scope.row[1]"></span>
                 </template>
              </el-table-column>
              <el-table-column label="优先级" width="120" align="center" prop="4" sortable="custom">
                  <template slot-scope="scope">
                     <el-tag type="success" v-if="scope.row[4] === '高'">{{scope.row[4]}}</el-tag>
                     <el-tag v-if="scope.row[4] === '普通'">{{scope.row[4]}}</el-tag>
                     <el-tag type="danger" v-if="scope.row[4] === '紧急'">{{scope.row[4]}}</el-tag>
                 </template>
              </el-table-column>
              <el-table-column label="主题" align="center" prop="2" sortable="custom">
                  <template slot-scope="scope">
                     <!-- <span v-html="scope.row[2]"></span> -->
                     <div v-html="scope.row[2]" style="text-align:left"></div>
                     <!-- <p v-html="scope.row[2]" style="display: flex;justify-content: flex-start;flex-flow: wrap;"></p> -->
                 </template>
              </el-table-column>
              
              <el-table-column label="状态" min-width="30" align="center" prop='3' sortable="custom">
                  <template slot-scope="scope">
                     <!-- <span v-html="scope.row[1]"></span> -->
                     <el-tag type="success" v-if="scope.row[3] === '已关闭'">{{scope.row[3]}}</el-tag>
                     <el-tag type="success" v-if="scope.row[3] === '修复中(进行中)'">{{scope.row[3].split("(")[0]}}</el-tag>
                     <el-tag v-if="scope.row[3] === '新建'">{{scope.row[3]}}</el-tag>
                     <el-tag v-if="scope.row[3] === '已提测'">{{scope.row[3]}}</el-tag>
                     <el-tag v-if="scope.row[3] === '已验证'">{{scope.row[3]}}</el-tag>
                     <el-tag v-if="scope.row[3] === '重新打开'">{{scope.row[3]}}</el-tag>
                     <el-tag type="danger" v-if="scope.row[3] === '拒绝修复'">{{scope.row[3]}}</el-tag>
                     <el-tag type="danger" v-if="scope.row[3] === '暂停'">{{scope.row[3]}}</el-tag>
                 </template>
              </el-table-column>
              
              <el-table-column prop="5" label="指派给" min-width="30" align="center" sortable="custom">
              </el-table-column>
              
              <el-table-column prop="6" label="反馈者" min-width="30" align="center" sortable="custom">
              </el-table-column>
              
              <el-table-column prop="7" label="作者" min-width="30" align="center" sortable="custom">
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
        <div class="close"> <el-button @click="$router.go(-1)">关闭</el-button></div>
    </div>
</template>

<script>
import {getfeedbackmonthdict, getfeedbackdatalistv2} from '@/api/xyzqPort/eproblem'
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
      allOptions: [
        {id: 1, text: '新建'},
        {id: 2, text: '修复中(进行中)'},
        {id: 3, text: '已修复(已解决)'},
        {id: 4, text: '延期'},
        {id: 5, text: '已关闭'},
        {id: 6, text: '已拒绝'},
        {id: 7, text: '重新打开'},
        {id: 8, text: '已提测'},
        {id: 13, text: '评审完成'},
        {id: 14, text: '开发中'},
        {id: 15, text: '测试中'},
        {id: 16, text: '待验收'},
        {id: 17, text: '验收完成'},
        {id: 18, text: '测试退回'},
        {id: 19, text: '部分上线'},
        {id: 20, text: '编码完成'},
        {id: 21, text: '反馈'},
        {id: 22, text: '未解决'},
        {id: 23, text: '重打开'},
        {id: 24, text: '等待变更'},
        {id: 25, text: '变更完成'},
        {id: 26, text: '待重现'},
        {id: 27, text: '暂停'},
        {id: 28, text: '实施中'},
        {id: 29, text: '代码审查中'},
        {id: 30, text: '取消'},
        {id: 31, text: '验证中'},
        {id: 32, text: '待执行'},
        {id: 33, text: '待审批'},
        {id: 34, text: '已验证'},
        {id: 36, text: '已上线'},
        {id: 38, text: '方案待确认'},
        {id: 40, text: '部分完成'},
        {id: 42, text: '拒绝修复'}
      ]
    }
  },
  mounted () {
    this.getmouth()
    // console.log(this.tableData)
  },
  methods: {
    descchangeOrder (column, prop, order) {
      var key = column.prop - 0
      console.log(key)
      console.log(column)
      console.log(prop)
      if (key === 5 || key === 6 || key === 7) {
        this.tableData.sort(function compareFunction (param1, param2) {
          var ord = 0
          // console.log(param1)
          if (column.order === 'ascending') {
            ord = param1[key].localeCompare(param2[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          } else {
            ord = param2[key].localeCompare(param1[key], 'zh-Hans-CN', {sensitivity: 'accent'})
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
              val1 = obj1[key].split(' ')[4].replace('#', '') - 0
              val2 = obj2[key].split(' ')[4].replace('#', '') - 0
            } else if (key === 2) {
              val1 = obj1[key].length
              val2 = obj2[key].length
            } else if (key === 3 || key === 4) {
              for (let i = 0; i < options.length; i++) {
                const ele = options[i]
                if (ele.text === obj1[key]) {
                  val1 = ele.id
                }
                if (ele.text === obj2[key]) {
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
      this.$router.push({path: '/eHomePort'})
    },
    getmouth () {
      getfeedbackmonthdict().then(res => {
        var date = localStorage.getItem('business')
        var datemouth = date.split(',')[0].split(' ')[0].split('-').join('').substr(0, 6) + '01'
        // console.log(res)
        // console.log(datemouth)
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
      getfeedbackdatalistv2(obj).then(res => {
        getfeedbackdatalistv2(obj2).then(response => {
        //   console.log(res)
          var pcdata = res.data.data
          var mobdata = response.data.data
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
    .el-tag{
        width: 60px;
        padding: 0 6px;
    }
</style>