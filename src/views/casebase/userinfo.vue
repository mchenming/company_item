<template>
    <div class="testcase">
        <div class="testHeader">
            <el-row>
                <el-col :span="6" class="selectProitem">
                    <el-select v-model="pojectName" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col :span="12">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                      <el-tab-pane label="全部" name="one"></el-tab-pane>
                      <el-tab-pane label="未开始" name="two"></el-tab-pane>
                      <el-tab-pane label="进行中" name="three"></el-tab-pane>
                      <el-tab-pane label="阻塞" name="four"></el-tab-pane>
                      <el-tab-pane label="已完成" name="five"></el-tab-pane>
                    </el-tabs>
                </el-col>
                <el-col :span="6" class="someBtn">
                    <el-button style="background-color:#fff;border-color:#ccc">报表</el-button>
                    <el-button style="background-color:#fff;border-color:#ccc">删除</el-button>
                    <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="openNew('new')">新建 </el-button>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table
              ref="multipleTable"
              border
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              :default-sort = "{}"
              @sort-change='orderChange'
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column prop='date' label="ID" width="120" align="center" sortable='custom'>
              </el-table-column>
              <el-table-column prop="name" label="项目" width="120" align="center" sortable='custom'>
              </el-table-column>
              <el-table-column prop="address" label="需求" show-overflow-tooltip align="center" sortable='custom'>
                <template slot-scope="scope">
                  <div style="color:#4b78cd;cursor:pointer;" @click="goDetail(scope.row)">{{scope.row.address}}</div>
                </template>
              </el-table-column>
              
              <el-table-column prop="address" label="版本" show-overflow-tooltip align="center" sortable='custom'>
              </el-table-column>
              
              <el-table-column prop="address" label="负责人" show-overflow-tooltip align="center" sortable='custom'>
              </el-table-column>
              
              <el-table-column prop="address" label="开始日期" show-overflow-tooltip align="center" sortable='custom'>
              </el-table-column>
              
              <el-table-column prop="address" label="结束日期" show-overflow-tooltip align="center" sortable='custom'>
              </el-table-column>
              
              <el-table-column prop="address" label="状态" show-overflow-tooltip align="center" sortable='custom'>
              </el-table-column>
              
              <el-table-column prop="address" label="操作" align="center">
                  <template slot-scope="scope">
                      <div style="display:flex;justify-content: space-around;">
                        <a href="javascript:;" style="color:#4b78cd;" @click="caseline(scope.row)">关联</a>
                        <a href="javascript:;" style="color:#4b78cd;" @click="openNew('edit')">编辑</a>
                      </div>
                  </template>
              </el-table-column>
            </el-table>
        </div>

        
        <div style="display:flex;justify-content:flex-end">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next"
            :total="1000">
          </el-pagination>
        </div>

        <el-dialog
          :visible.sync="dialoNew"
          :show-close = "false"
          top="8vh"
          :close-on-click-modal = "false"
          width="70%">
          <div>
              <p style="font-size:20px;font-weight:700;color:#000;margin:0;">新建测试单</p>
              <el-form ref="form" :model="form" label-width="100px" style="margin-top:20px;">
                <el-form-item label="项目">
                  <el-input v-model="form.name" disabled style="width:50%"></el-input>
                </el-form-item>
                <el-form-item label="版本">
                  <el-input v-model="form.name" style="width:50%"></el-input>
                </el-form-item>

                <el-form-item label="开始日期">
                    <el-date-picker
                      v-model="form.sTime"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                    <span style="margin:0 15px;">结束日期</span>
                    <el-date-picker
                      v-model="form.eTime"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="当前状态">
                  <el-select v-model="form.region" placeholder="请选择">
                    <el-option
                      v-for="item in options1"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="测试单名称">
                  <el-input v-model="form.name" style="width:100%"></el-input>
                </el-form-item>

                <el-form-item label="描述">
                  <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>
              </el-form>
          </div>
          <div style="display:flex;justify-content:center;">
              <el-button style="color:#fff;background-color:#4b78cd;">保存</el-button>
              <el-button style="color:#000;background-color:#fff;" @click="dialoNew=false">返回</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      pojectName: '选项2',
      activeName: 'one',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      options1: [{
        value: '1',
        label: '未开始'
      }, {
        value: '2',
        label: '进行中'
      }, {
        value: '3',
        label: '阻塞中'
      }, {
        value: '4',
        label: '已完成'
      }],
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: [],
      dialoNew: false,
      form: {
        name: '',
        region: '4',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        sTime: '',
        eTime: ''
      }
    }
  },
  methods: {
    caseline () {
      const row = {
        id: '111'
      }
      this.$router.push({path: '/caseline', query: row})
    },
    goDetail () {
      const row = {
        id: '2313'
      }
      this.$router.push({path: '/detail', query: row})
    },
    openNew (type) {
      if (type === 'new') {
          // 新建
      } else if (type === 'edit') {
          //  编辑
        this.form.region = '3'
      }
      // 新建一个测试单
      this.dialoNew = true
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    handleClick (tab, event) {
      console.log(this.activeName)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    // 排序
    orderChange (column) {
      console.log(column)
      if (column.order === 'ascending') {
        //  orderType = 'asc'
      } else if (column.order === 'descending') {
        // orderType = 'desc'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.testcase{
    // width: 1080px;
    padding: 10px 15px;
    margin:10px auto;
    background-color: #fff;
    .someBtn{
        display: flex;
        justify-content: flex-end;
    }
}
</style>

<style lang="scss">

 
.testcase{
  .selectProitem .el-input__inner{
    border: none;
  }
  .el-tabs__item.is-active{
    border-bottom: 2px solid #409EFF;
  }
  .selectProitem .el-select .el-input.is-focus .el-input__inner{
    border-color: transparent;
  }
  .el-tabs__nav-wrap::after{
    background-color: transparent;
  }
  .el-table th.gutter{
    display: table-cell!important;
  }
  .el-table__header{
      padding-bottom: 1px;
  }
  .el-dialog__body{
    padding:20px;
  }
  .el-dialog__header{
      padding: 0;
  }
}
</style>