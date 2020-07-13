<template>
    <div class="erprob">
        <div class="saltitle">
            <h2>产线问题</h2>
            <i class="el-icon-close" @click='exit'></i>
        </div>
        <div class="slidebox">
            <div class="item">
                <span>项目</span>
                <el-select v-model="projectId" placeholder="请选择项目" @change='changeForData' popper-class="onmouthFix">
                  <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                    <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:200px" v-model='searchText' @input="searchInfo" @focus='leaveinp' @blur="getss"></el-input>
                  </div>
                  <el-option
                    v-for="item in projectOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
            <div class="mouth">
                <span>月份</span>
                <el-select v-model="mouthValue" placeholder="请选择月份" @change='changeForData' popper-class="mouthFix">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.text"
                    :value="item.text">
                  </el-option>
                </el-select>
            </div>
            <div>
                <span style="margin-right:10px;">数据类型</span>
                <el-select v-model="listQuery.type" placeholder="请选择数据类型" @change='changeForData' popper-class="mouthFix">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                  </el-option>
                </el-select>
            </div>
        </div>
        <div class="itemtable">
             <el-table :data="tableData" style="width: 100%"
             :default-sort="{}"  v-loading="listLoading" element-loading-text="加载中。。。"
            @sort-change="productchangeOrder">
              <el-table-column prop="id" label="缺陷ID" width="100" sortable="custom"  align="center">
                  <template slot-scope="scope">
                    <div v-html="scope.row.id"></div>
                  </template>
              </el-table-column>
              <el-table-column prop="priority_id" label="优先级" width="100" sortable="custom" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.priority_id === '3'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;text-align: center;">
                    <span style="color: #67c23a;text-align: center;">高</span></div>
                  <div v-else-if="scope.row.priority_id === '4'" style="width: 50px;height: 30px;background-color: #fdf6ec;line-height: 30px;margin:auto;text-align: center;">
                    <span style="color: #e6a23c;text-align: center;">紧急</span></div>
                  <div v-else-if="scope.row.priority_id === '5'" style="width: 50px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;text-align: center;">
                    <span style="color: #f56c6c;text-align: center;">立刻</span></div>
                  <div v-else-if="scope.row.priority_id === '2'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;text-align: center;">
                    <span style="color: #409eff;text-align: center;">普通</span></div>
                    <div v-else style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;text-align: center;">
                    <span style="color: #409eff;text-align: center;">低</span></div>
                </template>
              </el-table-column>
              
              <el-table-column prop="project_id" label="项目" sortable="custom" align="center" width="150">
                  <template slot-scope="scope">
                    <div style="text-align:center">{{checkitem(scope.row.project_id)}}</div>
                  </template>
              </el-table-column>

              <el-table-column prop="subject" label="主题" sortable="custom" align="center">
                  <template slot-scope="scope">
                    <div style="text-align:left">{{scope.row.subject}}</div>
                  </template>
              </el-table-column>
              <el-table-column prop="status_id" label="状态" sortable="custom" align="center" width="120">
                  <template slot-scope="scope">
                    <el-tag>{{scope.row.status_name}}</el-tag>                    
                  </template>
              </el-table-column>
              <el-table-column prop="fixed_version_id" label="目标版本" sortable="custom" align="center" width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.version_name}}</span>                    
                </template>
              </el-table-column>
              <el-table-column prop="assigned_to_id" label="指派给" sortable="custom" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.assigned_name}}</span>                    
                </template>
              </el-table-column>
              <el-table-column prop="author_id" label="反馈者" sortable="custom" align="center" width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.author_name}}</span>                    
                </template>
              </el-table-column>
              <el-table-column prop="created_on" label="创建时间" sortable="custom" align="center" width="120">
                <template slot-scope="scope">
                  <span>{{scope.row.created_on.split(' ')[0]}}</span>                    
                </template>
              </el-table-column>
              <el-table-column prop="closed_on" label="关闭时间" sortable="custom" align="center" width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.closed_on!==null">{{scope.row.closed_on.split(' ')[0]}}</span>                    
                </template>
              </el-table-column>
            </el-table>
        </div>
        <div class="pagenumchoose">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="listQuery.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="listQuery.pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next"
            class="pagenum">
          </el-pagination>
        </div>
        <div class="close"> <el-button @click="exit">关闭</el-button></div>
    </div>
</template>

<script>
// import API from '@/api'
import {getfeedbackmonthdict, getCxBugByProject} from '@/api/xyzqPort/erprob'
import {getProjectByUser} from '@/api/xyzqPort/erneed'
import {systemlogStatis} from '@/api/modules/all'
export default {
  data () {
    return {
      priorityOptions: [
        {id: '1', text: '低'},
        {id: '2', text: '普通'},
        {id: '3', text: '高'},
        {id: '4', text: '紧急'},
        {id: '5', text: '立刻'}
      ],
      typeOptions: [
        {id: 'xz', text: '新增'},
        {id: 'ljdjj', text: '累积待解决'}
      ],
      listLoading: false,
      tableData: [],
      options: [],
      prooptions: [],
      projectOptionsAll: [],
      projectOptions: [],
      proinfo: [],
      valueitem: '全部',
      projectId: '',
      mouthValue: '',
      searchText: '',
      allitem: [],
      itemallname: [],
      userId: '',
      total: 0,
      listQuery: {
        mouthValue: '',
        project_id: '',
        pageIndex: 1,
        pageSize: 10,
        orderkey: '',
        orderType: '',
        type: ''
      },
      allProjectIds: ''
    }
  },
  created () {
    if (typeof (this.$route.query.type) !== 'undefined' && this.$route.query.type === '新增') {
      this.listQuery.type = 'xz'
    } else if (typeof (this.$route.query.type) !== 'undefined' && this.$route.query.type === '累积待解决') {
      this.listQuery.type = 'ljdjj'
    }
    this.listQuery.project_id = this.$route.query.proid
    this.userId = localStorage.getItem('userId')
    // this.listQuery.orderType = 'asc'
    this.getproject()
    // this.searchData()
    // this.getfeedbackmonthdict()
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '项目驾驶舱',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  methods: {
    exit () {
      const row = {
        type: '',
        tval: ''
      }
      if (this.$route.query.bugTimeType) {
        row.type = 'bugTimeType'
        row.tval = Number(this.$route.query.bugTimeType)
      }
      this.$router.push({path: '/leaderReport', query: row})
      // this.$router.go(-1)
    },
    checkitem (itemid) {
      // console.log(this.projectOptions)
      let proname = ''
      this.projectOptions.forEach(item => {
        if (item.id === itemid) {
          proname = item.name
        }
      })
      return proname
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const time = `${YY}${MM}`
      return time
    },
    // 获取所有的项目
    getproject () {
      this.listLoading = true
      const row = {
        userId: localStorage.getItem('userId'),
        roleName: '管理人员'
      }
      getProjectByUser(row).then(res => {
        this.projectOptions = res.data.list
        this.projectOptions.unshift({
          id: '',
          name: '全部'
        })
        this.projectOptionsAll = res.data.list
        var arr = []
        res.data.list.forEach(item => {
          if (item.id !== '') {
            arr.push(item.id)
          }
        })
        if (this.$route.query.proid) {
          this.projectId = this.$route.query.proid
        } else {
          this.listQuery.project_id = arr.join(',')
        }
        this.allProjectIds = arr.join(',')
        // const dtt = new Date()
        // this.listQuery.mouthValue = this.getTimeByDate(dtt)
        this.listQuery.orderkey = 'id'
        this.listQuery.orderType = 'desc'
        this.getfeedbackmonthdict()
      })
      // API.user.info().then(({data}) => {
      //   if (data && data.code === 0) {
      //   }
      // })
    },
    getListData () {
      this.listLoading = true
      // console.log(this.listQuery)
      getCxBugByProject(this.listQuery).then(response => {
        this.tableData = response.data.list
        // console.log(this.tableData)
        // console.log(this.projectOptions)
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 获取所有的月份信息
    getfeedbackmonthdict () {
      var obj = {
        project_id: ''
      }
      getfeedbackmonthdict(obj).then(response => {
        this.options = response.data.data
        this.mouthValue = this.options[0].text
        if (typeof (this.$route.query.mouthValue) !== 'undefined' && this.$route.query.mouthValue === '上月') {
          this.mouthValue = this.options[1].text
        }
        this.searchData()
      })
    },
    // 分页
    sizeChangeHandle (val) {
      this.listQuery.pageSize = val
      this.searchData()
    },
    // // 当前页
    currentChangeHandle (val) {
      this.listQuery.pageIndex = val
      this.searchData()
    },
    // 排序
    productchangeOrder (column, prop, order) {
      console.log(column.prop)
      this.listQuery.orderkey = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.searchData()
    },
    getss () {
      this.searchText = ''
      // this.projectOptions = this.projectOptionsAll
    },
    leaveinp () {
      this.searchInfo()
      this.searchText = ''
      this.projectOptions = this.projectOptionsAll
    },
    changeForData () {
      this.projectOptions = this.projectOptionsAll
      this.listQuery.pageIndex = 1
      this.listQuery.pageSize = 10
      this.listQuery.orderkey = ''
      this.listQuery.orderType = ''
      this.searchData()
    },
    searchData () {
      if (this.mouthValue !== '') {
        this.listQuery.mouthValue = this.mouthValue.replace('年', '-').replace('月', '-') + '01'
      }
      if (this.projectId !== '') {
        this.listQuery.project_id = this.projectId
      } else {
        this.listQuery.project_id = this.allProjectIds
      }
      // console.log(this.projectId)
      // console.log(this.allProjectIds)
      this.getListData()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.projectOptionsAll.forEach((item) => {
        if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.projectOptions = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.projectOptions = allList
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .erprob{
        width: 100%;
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
        .slidebox{
          height: 50px;
          width: 100%;
          background-color: #fff;
          display: flex;
          align-items: center;
          padding: 0 20px;
          box-sizing: border-box;
          .item{
            margin-right: 50px;
            span{
                margin-right: 10px;
            }
          }
          .mouth{
            margin-right: 50px;
            span{
                margin-right: 10px;
            }
          }
        }
        .pagenumchoose{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding: 10px 0;
        background-color: #fff;
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
    .el-select-dropdown__wrap,.el-scrollbar__wrap{
      margin-bottom: -3px !important;
    }
    
    .el-tag{
        min-width: 60px;
        padding: 0 6px;
    }
</style>

<style>
  .mouthFix .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .dBox{
    position: absolute;
    left: 3px;
    top: 5px;
  }
  .onmouthFix .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-right: 0px !important;
    margin-top: 50px !important; 
  }
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .mouthFix .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-top: 0px !important;
  }
</style>