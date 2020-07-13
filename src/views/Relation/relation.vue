<template>
    <div class="relation">
        <el-row class="selectItem">
            <el-col :span="6">
                <span style="margin:0 15px;">项目</span>
                <el-select v-model="value" placeholder="请选择" style="width:70%" popper-class='onmouthFix' @change="changePro">
                  <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                    <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                  </div>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
            <el-col :span="18">
              <el-select v-model="value" placeholder="请输入Redmine需求标题搜索" style="width:90%" popper-class='onmouthFix'>
                <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                  <!-- <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input> -->
                </div>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
        </el-row>

        <div class="listData">
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column type="index" label="序号" width="100" align="center">
              </el-table-column>
              <el-table-column prop="date" label="Redmine需求标题" align="center">
              </el-table-column>
              <el-table-column prop="name" label="项目" width="150" align="center">
              </el-table-column>
              <el-table-column prop="address" label="OA需求标题" align="center">
              </el-table-column>
              <el-table-column prop="address" label="ITSM单号" width="150" align="center">
              </el-table-column>
              <el-table-column prop="address" label="操作" width="150" align="center">
                  <template slot-scope="scope">
                      <div style="float:left;"><a href="javascript:;" style="text-decoration:underline;color:#409eff" @click="goDialog(scope.row)">关联OA</a></div>
                      <div style="float:right;"><a href="javascript:;" style="text-decoration:underline;color:#409eff" @click="goItsmDialog(scope.row)">关联ITSM</a></div>
                  </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage1"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="total">
            </el-pagination>
        </div>

        <el-dialog
          title=""
          :visible.sync="Oadialog"
          width="80%"
          :modal='false'
          :close-on-click-modal='false'
          :close-on-press-escape='false'
          :show-close='false'
          :fullscreen='true'>
          <div style="padding:0 50px;">
              <div style="display:flex;align-items:center;margin-top:15px;">
                  <span style="width:100px;padding:0 15px 0 0;">涉及系统</span>
                  <el-input
                    placeholder="请输入内容"
                    v-model="OaItemName"
                    :disabled="true"
                    style="width:70%">
                  </el-input>
              </div>
              <div style="display:flex;align-items:center;margin-top:15px;">
                  <span style="width:100px;padding:0 15px 0 0;">业务需求</span>
                  <el-input
                    placeholder="请输入内容"
                    v-model="reqTitle"
                    :disabled="true"
                    style="width:70%">
                  </el-input>
              </div>

              <p style="margin:50px 0 0 0;font-size:15px;font-weight:700">已关联需求</p>
              <el-table :data="tableData" style="width: 80%" border>
                <el-table-column prop="date" label="项目" width="180" align="center">
                </el-table-column>
                <el-table-column prop="address" label="业务需求标题" align="center">
                </el-table-column>
                <el-table-column prop="name" label="操作" width="180" align="center">
                </el-table-column>
              </el-table>

              <p style="margin:50px 0 0 0;font-size:15px;font-weight:700">业务需求列表</p>
              <el-table :data="OatableData" style="width: 80%" border>
                <el-table-column prop="date" label="项目" width="180" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="searchItem" placeholder="请输入内容" v-if="!scope.row.date" @input="selectItem" @focus='renderData'></el-input>
                        <div v-if="scope.row.date">{{scope.row.date}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="业务需求标题" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="searchTitle" placeholder="请输入内容" v-if="!scope.row.date" @input="selectTitle" @focus='renderData'></el-input>
                        <div v-if="scope.row.date">{{scope.row.address}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-tag style="background-color:#4b78cd;border:none;color:#fff;cursor:pointer" v-if="scope.row.date">关联</el-tag>
                    </template>
                </el-table-column>
              </el-table>
              <div style="height:40px;line-height:40px;text-align:center;width:80%" v-if="OatableData.length===1">暂无数据</div>
            
            <div style="width:100%;display:flex;justify-content:center;margin-top:50px;">
              <el-button style="color:#fff;background-color:#4b78cd;border:none" @click="Oadialog=false">保存关闭</el-button>
            </div>
          </div>
        </el-dialog>

        <el-dialog
          title=""
          :visible.sync="ITSMdialog"
          width="80%"
          :modal='false'
          :close-on-click-modal='false'
          :close-on-press-escape='false'
          :show-close='false'
          :fullscreen='true'>
          <div style="padding:0 50px;">
              <div style="display:flex;align-items:center;margin-top:15px;">
                  <span style="width:100px;padding:0 15px 0 0;">涉及系统</span>
                  <el-input
                    placeholder="请输入内容"
                    v-model="OaItemName"
                    :disabled="true"
                    style="width:70%">
                  </el-input>
              </div>
              <div style="display:flex;align-items:center;margin-top:15px;">
                  <span style="width:100px;padding:0 15px 0 0;">业务需求</span>
                  <el-input
                    placeholder="请输入内容"
                    v-model="reqTitle"
                    :disabled="true"
                    style="width:70%">
                  </el-input>
              </div>

              <p style="margin:50px 0 0 0;font-size:15px;font-weight:700">已关联ITSM单号</p>
              <el-table :data="tableData" style="width: 80%" border>
                <el-table-column prop="date" label="单号" width="180" align="center">
                </el-table-column>
                <el-table-column prop="address" label="标题" align="center">
                </el-table-column>
                <el-table-column prop="name" label="操作" width="180" align="center">
                </el-table-column>
              </el-table>

              <p style="margin:50px 0 0 0;font-size:15px;font-weight:700">业务需求列表</p>
              <el-table :data="OatableData" style="width: 80%" border>
                <el-table-column prop="date" label="单号" width="180" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="searchItem" placeholder="请输入内容" v-if="!scope.row.date" @input="selectItem" @focus='renderData'></el-input>
                        <div v-if="scope.row.date">{{scope.row.date}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="标题" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="searchTitle" placeholder="请输入内容" v-if="!scope.row.date" @input="selectTitle" @focus='renderData'></el-input>
                        <div v-if="scope.row.date">{{scope.row.address}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="创建人" align="center" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="searchTitle" placeholder="请输入内容" v-if="!scope.row.date" @input="selectTitle" @focus='renderData'></el-input>
                        <div v-if="scope.row.date">{{scope.row.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-tag style="background-color:#4b78cd;border:none;color:#fff;cursor:pointer" v-if="scope.row.date">关联</el-tag>
                    </template>
                </el-table-column>
              </el-table>
              <div style="height:40px;line-height:40px;text-align:center;width:80%" v-if="OatableData.length===1">暂无数据</div>
            
            <div style="width:100%;display:flex;justify-content:center;margin-top:50px;">
              <el-button style="color:#fff;background-color:#4b78cd;border:none" @click="ITSMdialog=false">保存关闭</el-button>
            </div>
          </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
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
      list: [{
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
      value: '',
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
      }],
      OatableData: [{
        date: '',
        address: '',
        name: ''
      }, {
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
      }],
      Oa2tableData: [{
        date: '',
        address: '',
        sa: ''
      }, {
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
      }],
      currentPage1: 1,
      pageSize: 10,
      total: 158,
      searchText: '',
      Oadialog: false,
      ITSMdialog: false,
      OaItemName: '',
      reqTitle: '',
      searchItem: '',
      searchTitle: ''
    }
  },
  methods: {
    handleCurrentChange (val) {
      console.log(val)
    },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.list.forEach((item) => {
        if (item.label.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.options = [{label: '暂无数据', id: '', disabled: true}]
      } else {
        this.options = allList
      }
    },
    // 切换项目
    changePro () {
      this.options = this.list
    },
    goDialog (value) {
      this.Oadialog = true
      console.log(value)
    },
    goItsmDialog (value) {
      this.ITSMdialog = true
    },
    // 搜索项目
    selectItem () {
      console.log(12)
      var list = [{date: '', name: '', address: ''}]
      var newVal = this.searchItem
      if (this.searchItem !== '') {
        this.Oa2tableData.forEach(item => {
          if (item.date.toLowerCase().includes(newVal.toLowerCase()) === true) {
            list.push(item)
          }
        //   return list
        })
        this.OatableData = list
      } else {
        this.OatableData = this.Oa2tableData
      }
    },
    // 搜索标题
    selectTitle () {
      var list = [{date: '', name: '', address: ''}]
      if (this.searchTitle !== '') {
        this.Oa2tableData.forEach(item => {
          if (item.address.toLowerCase().includes(this.searchTitle.toLowerCase()) === true) {
            list.push(item)
          }
        })
        this.OatableData = list
      } else {
        this.OatableData = this.Oa2tableData
      }
    },
    // 获取光标还原数据
    renderData () {
      this.searchTitle = ''
      this.searchItem = ''
      this.OatableData = this.Oa2tableData
    }
  }
}
</script>

<style lang="scss" scoped>
    .relation{
        background-color: #fff;
      .selectItem{
        width: 100%;
        height: 50px;
        line-height: 50px;
      }
      .listData{
          padding: 0 15px;
          margin-top: 15px;
      }
    }
</style>
<style>
    .relation .el-pagination{
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
    }
  .onmouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
  .mouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
  .onmouthFix .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
</style>