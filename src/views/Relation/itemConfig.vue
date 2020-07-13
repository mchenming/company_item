<template>
    <div class="itemconfig">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="项目关系配置" name="first">
          <el-row type="flex">
            <el-col :span="3" style="width:140px">
                  <el-select v-model="listQuery.ItemType" placeholder="请选择" style="width:100%" @change="getTypeProject" popper-class="noFix">
                    <el-option
                      v-for="item in CheckItem"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
              </el-col>
              <el-col :span="10">
                <el-input v-model="listQuery.projectName" placeholder="请输入项目名称搜索" style="width:100%" clearable @keydown.enter.native="changeItem()"></el-input>
              </el-col>
              <div style="flex:1;overflow:hidden">
                  <el-button style="float:right;border:none;color:#fff;background-color:#4b78cd;" @click="goChild()">新建</el-button>
              </div>
          </el-row>
          <div style="margin-top:15px;">
              <el-table
                :data="tableData"
                v-loading= isLoading
                border
                style="width: 100%">
                <el-table-column label="序号" width="80" align="center">
                  <template slot-scope="scope">
                    {{((listQuery.page - 1) * listQuery.pageSize) + scope.$index + 1}}
                  </template>
                </el-table-column>
                <el-table-column prop="itoaProjectName" label="OA项目" align="center">
                </el-table-column>
                <el-table-column prop="redProjectName" label="Redmine项目" align="center">
                </el-table-column>
                <el-table-column prop="itsmProjectName" label="ITSM项目" align="center">
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <div style="display:flex;justify-content:space-around">
                            <div style="color:#4b78cd;text-decoration:underline;cursor:pointer;" @click="goChild(scope.row)">编辑</div>
                            <div style="color:#4b78cd;text-decoration:underline;cursor:pointer;" @click="removeOnline(scope.row, '0')">删除</div>
                        </div>
                    </template>
                </el-table-column>
              </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="CICD项目配置" name="second">
          <div style="display:flex;justify-content:space-between;">
              <el-input v-model="listQuery.projectName" placeholder="请输入Redmine项目名称搜索" style="width:40%;" clearable @keydown.enter.native="changeItem()"></el-input>
              <el-button style="border:none;color:#fff;background-color:#4b78cd;" @click="goRedmineChild()">新建</el-button>
          </div>
          <div style="margin-top:15px;">
            <el-table :data="tableDataChild" style="width: 100%" border v-loading='redmineLoading'>
              <el-table-column type="index" label="序号" width="80" align="center">
                <template slot-scope="scope">
                  {{((listQuery.page - 1) * listQuery.pageSize) + scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column prop="projectName" label="父项目" width="180" align="center">
              </el-table-column>
              <el-table-column prop="childProjectNames" label="子项目" align="center">
                <template slot-scope="scope">
                  <div>{{scope.row.childProjectNames.replace(/,/g,'、')}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="childProjectNames" label="排序" align="center">
                <template slot-scope="scope">
                  <div>{{scope.row.sort}}</div>
                </template>
              </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <div style="display:flex;justify-content:space-around">
                            <div style="color:#4b78cd;text-decoration:underline;cursor:pointer;" @click="goRedmineChild(scope.row)">编辑</div>
                            <div style="color:#4b78cd;text-decoration:underline;cursor:pointer;" @click="removeOnline(scope.row, '1')">删除</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
        <div style="margin-top:15px;display:flex;justify-content:flex-end">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="listQuery.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="listQuery.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { getUUID } from '@/utils'
import {systemlogStatis} from '@/api/modules/all'

import {listByParamRedMineOaItsm, delQxBaseProjectRule, redmineChildlistByParam, delQxBaseProjectsSubset} from '@/api/xyzqPort/itConfig'
export default {
  data () {
    return {
      CheckItem: ['OA项目', 'Redmine项目', 'ITSM项目'],
      // flag: true,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10,
        ItemType: '',
        projectName: ''
      },
      isLoading: false,
      tableData: [],
      sendObj: {
        page: 1,
        pageSize: 10000
      },
      activeName: 'first',
      tableDataChild: [],
      redmineLoading: false
    }
  },
  watch: {
    'listQuery.projectName': {
      handler (val) {
        // console.log(val)
        if (val === '') {
          if (this.activeName === 'first') {
            this.getList()
          } else if (this.activeName === 'second') {
            this.getRedminChildList()
          }
        }
      }
      // immediate: true
    }
  },
  created () {
    if (sessionStorage.getItem('projectName')) {
      this.listQuery.projectName = sessionStorage.getItem('projectName')
    } else if (typeof (this.$route.params.projectName) !== 'undefined' && this.$route.params.projectName !== '') {
      this.listQuery.projectName = this.$route.params.projectName
    }
    if (typeof (this.$route.params.ItemType) !== 'undefined' && this.$route.params.ItemType !== '') {
      this.listQuery.ItemType = this.$route.params.ItemType
    } else {
      this.listQuery.ItemType = 'OA项目'
    }
    if (typeof (this.$route.params.page) !== 'undefined' && this.$route.params.page !== '') {
      this.listQuery.page = this.$route.params.page - 0
    }
    if (typeof (this.$route.params.pageSize) !== 'undefined' && this.$route.params.pageSize !== '') {
      this.listQuery.pageSize = this.$route.params.pageSize - 0
    }
    if (typeof (this.$route.params.activeName) !== 'undefined' && this.$route.params.activeName !== '') {
      this.activeName = this.$route.params.activeName
    }
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '项目关系配置',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    // 第一次进来的时候
    // 子页面进父页面this.listQuery.projectName不为 ''
    this.getTypeProject('1')
    // this.handleClick()
  },
  methods: {
    handleClick (tab, event) {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.listQuery.ItemType = 'OA项目'
      this.listQuery.projectName = ''
      this.total = 0
      this.tableData = []
      if (this.activeName === 'first') {
        this.getList()
      } else if (this.activeName === 'second') {
        this.getRedminChildList()
      }
    },
    // 获取redmine子集的接口
    getRedminChildList () {
      let obj = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        parentId: 0,
        childProjectNames: this.listQuery.projectName,
        serNo: getUUID()
      }
      this.redmineLoading = true
      redmineChildlistByParam(obj).then(res => {
        this.redmineLoading = false
        this.total = res.data.total
        this.tableDataChild = res.data.data
      })
    },
    // 切换项目
    changeItem () {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      if (this.activeName === 'first') {
        this.getList()
      } else if (this.activeName === 'second') {
        this.getRedminChildList()
      }
    },
    // enter搜索事件
    getTypeProject (val) {
      if (val !== '1') {
        this.listQuery.page = 1
        this.listQuery.pageSize = 10
        // this.listQuery.projectName = ''
      }
      if (this.activeName === 'first') {
        this.getList()
      } else if (this.activeName === 'second') {
        this.getRedminChildList()
      }
    },
    // 获取关联列表
    getList () {
      this.isLoading = true
      // let obj = JSON.parse(JSON.stringify(this.listQuery))
      let obj = {
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize
      }
      if (this.listQuery.ItemType === 'ITSM项目') {
        obj.isItsm = '1'
        obj.itsmProjectName = this.listQuery.projectName
      }
      if (this.listQuery.ItemType === 'OA项目') {
        obj.isOa = '1'
        obj.itoaProjectName = this.listQuery.projectName
      }
      if (this.listQuery.ItemType === 'Redmine项目') {
        obj.isRedMine = '1'
        obj.redProjectName = this.listQuery.projectName
      }
      obj.type = 'oa'
      listByParamRedMineOaItsm(obj).then(res => {
        this.isLoading = false
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    // 切换当前页码
    handleSizeChange (val) {
      this.listQuery.page = 1
      this.listQuery.pageSize = val
      if (this.activeName === 'first') {
        this.getList()
      } else if (this.activeName === 'second') {
        this.getRedminChildList()
      }
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      if (this.activeName === 'first') {
        this.getList()
      } else if (this.activeName === 'second') {
        this.getRedminChildList()
      }
    },
    // 新建
    goChild (data) {
      let row = {
      }
      if (data) {
        row = data
        row.ItemType = this.listQuery.ItemType
        row.projectName = this.listQuery.projectName
        row.page = this.listQuery.page
        row.pageSize = this.listQuery.pageSize
        row.activeName = this.activeName
        row.type = 'edit'
      } else {
        row.ItemType = this.listQuery.ItemType
        row.projectName = this.listQuery.projectName
        row.page = this.listQuery.page
        row.pageSize = this.listQuery.pageSize
        row.activeName = this.activeName
      }
      this.$router.push({name: 'ItemConfigChild', query: row})
    },
    goRedmineChild (data) {
      let row = {
      }
      if (data) {
        row.id = data.id
        // row.ItemType = this.listQuery.ItemType
        row.projectName = this.listQuery.projectName
        row.page = this.listQuery.page
        row.pageSize = this.listQuery.pageSize
        row.activeName = this.activeName
        row.type = 'edit'
      } else {
        // row.ItemType = this.listQuery.ItemType
        row.projectName = this.listQuery.projectName
        row.page = this.listQuery.page
        row.pageSize = this.listQuery.pageSize
        row.activeName = this.activeName
      }
      this.$router.push({name: 'itemRedmineChild', query: row})
    },
    // 删除
    removeOnline (data, type) {
      let rows = {
        dataIds: data.id
      }
      if (type === '0') {
        if (this.tableData.length === 1 && this.listQuery.page !== 1) {
          this.listQuery.page--
        }
        delQxBaseProjectRule(rows).then(res => {
          this.getList()
        })
      } else if (type === '1') {
        rows.serNo = getUUID()
        if (this.tableDataChild.length === 1 && this.listQuery.page !== 1) {
          this.listQuery.page--
        }
        delQxBaseProjectsSubset(rows).then(res => {
          this.getRedminChildList()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .itemconfig{
        background-color: #fff;
        padding:15px;
    }
</style>

<style scoped>
  .conItem_left >>> .el-input--suffix .el-input__inner{
      border:none
  }
  .itemconfig >>> .el-tabs__nav-wrap::after{
    height: 0;
  }
</style>

<style>
  
  .caseFix .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
  .noFix .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
</style>