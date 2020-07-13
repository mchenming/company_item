<template>
    <div class="eronline">
      <div class="saltitle">
          <h2>已上线版本</h2>
          <i class="el-icon-close" @click='exit'></i>
      </div>
      <div class="onlineversion" style="background:#fff;height:50px;line-height:50px;padding:0 15px;">
          <span style="margin-right:15px;">项目</span>
          <el-select v-model="senddata.project_id" placeholder="请选择" multiple style="width:700px;" @change="gettabledata" popper-class="onmouthFix">
          <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
            <el-input placeholder="请输入搜索内容" style="padding:0 10px; width:90%" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
          </div>
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span style="margin-left:30px;">时间范围</span>
            <el-date-picker
            v-model="changeTime"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['08:00:00', '08:00:00']"
            value-format="yyyy-MM-dd"
            style="margin-left:15px"
            :clearable="false"
            @change="gettabledata">
          </el-date-picker>
      </div>
      <div class="eronlinefoot">
          <el-table :data="tableData" style="width: 100%" :default-sort="{}"
              @sort-change="changeOrder" v-loading='isloading'>
            <el-table-column prop="date" label="id" width="100" align="center" sortable="custom">
            </el-table-column>
            <el-table-column prop="project_id" label="项目" align="center" sortable="custom">
              <template slot-scope="scope">
                {{useidgetname(scope.row.project_id)}}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="版本名称" width="140" align="center" sortable="custom">
            </el-table-column>
            <el-table-column prop="" label="创建时间" width="120" align="center" sortable="custom">
            </el-table-column>
            <el-table-column prop="" label="计划完成时间" width="130" align="center" sortable="custom">
            </el-table-column>
            <el-table-column prop="tracker_id" label="状态" width="120" align="center" sortable="custom">
              
            </el-table-column>
            <el-table-column prop="all_num" label="需求数量" width="100" align="center" sortable="custom">
            </el-table-column>
            <el-table-column prop="" label="开发任务" width="100" align="center" sortable="custom">
            </el-table-column>
            
            <el-table-column prop="" label="测试任务" width="100" align="center" sortable="custom">
            </el-table-column>
            
            <el-table-column prop="" label="BUG数" width="100" align="center" sortable="custom">
            </el-table-column>
            
            <el-table-column prop="" label="未关闭BUG数" width="150" align="center" sortable="custom">
            </el-table-column>
          </el-table>
      </div>
      <div class="pagenumchoose">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="changePage"
          :current-page="senddata.pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="senddata.pageSize"
          :total="senddata.total"
          layout="total, sizes, prev, pager, next"
          class="pagenum">
        </el-pagination>
      </div>
    </div>
</template>

<script>
import API from '@/api'
import {getVersionListByTime} from '@/api/xyzqPort/eronlineversion'
import {getProjectByUser} from '@/api/xyzqPort/erneed'
export default {
  data () {
    return {
      projectOptions: [],
      changeTime: [],
      tableData: [],
      searchText: '',
      itemallname: [],
      senddata: {
        project_id: [],
        pageIndex: 1,
        pageSize: 10,
        orderKey: 'id',
        orderType: 'desc',
        total: 0
      },
      Allproject_id: '',
      isloading: true
    }
  },
  created () {
    this.getproject()
    this.senddata.project_id = [...this.$route.query.project_id]
    this.changeTime[0] = this.$route.query.stime
    this.changeTime[1] = this.$route.query.etime
  },
  mounted () {
    this.gettabledata()
  },
  methods: {
    exit () {
      const row = {
        activeName: this.$route.query.activeName,
        stime: this.changeTime[0],
        etime: this.changeTime[1],
        proid: this.senddata.project_id
      }
      this.$router.push({path: '/newleaderReport', query: row})
    },
    sizeChangeHandle (val) {
      // console.log(val)
      this.senddata.pageSize = val
      this.gettabledata()
    },
    changePage (page) {
      this.senddata.pageIndex = page
      console.log(page)
      console.log(this.senddata.pageIndex)
      this.gettabledata()
    },
    // 排序的方法
    changeOrder (column, prop, order) {
      console.log(column.prop)
      this.senddata.orderKey = column.prop
      this.senddata.orderType = ''
      if (column.order === 'ascending') {
        this.senddata.orderType = 'asc'
      } else {
        this.senddata.orderType = 'desc'
      }
      this.gettabledata()
    },
    // 获取所有的项目
    getproject () {
      // this.listLoading = true
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            roleName: '管理人员'
          }
          // this.userId = data.user.userId
          getProjectByUser(row).then(res => {
            this.projectOptions = res.data.list
            // console.log(this.options)
            // 搜索使用到
            // this.projectOptionsAll = res.data.list
            var arr = []
            res.data.list.forEach(item => {
              if (item.id !== '') {
                arr.push(item.id)
              }
            })
            // this.Allproject_id = arr.join(',')
            this.projectOptions.unshift({
              id: '',
              name: '全部'
            })
            this.itemallname = this.projectOptions
          })
        }
      })
    },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      if (newVal.length > 0) {
        setTimeout(() => {
          this.itemallname.forEach((item) => {
            if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
              // console.log(123)
              allList.push(item)
            }
          })
          if (allList.length === 0) {
            this.projectOptions = [{name: '暂无数据', id: '', disabled: true}]
          } else {
            // console.log(allList)
            this.projectOptions = allList
          }
        }, 0)
      } else {
        this.projectOptions = this.itemallname
      }
    },
    gettabledata () {
      this.isloading = true
      // this.senddata.total = 0
      // console.log(this.senddata.project_id)
      var row = {
        page: this.senddata.pageIndex,
        pageSize: this.senddata.pageSize,
        project_ids: this.senddata.project_id.join(','),
        orderType: this.senddata.orderType,
        orderKey: this.senddata.orderKey,
        start_date: this.changeTime[0],
        end_date: this.changeTime[1]
      }
      // console.log(row)
      getVersionListByTime(row).then(res => {
        this.isloading = false
        console.log(res)
        this.tableData = res.data.rows
        this.senddata.total = res.data.total
      })
    },
    useidgetname (id) {
      var name = ''
      this.itemallname.forEach(item => {
        if (Number(item.id) === Number(id)) {
          name = item.name
        }
      })
      return name
    }
  }
}
</script>

<style lang="scss" scoped>
.eronline{
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
    .pagenumchoose{
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding: 10px 0;
      background-color: #fff;
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
  .onmouthFix .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .onmouthFix .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-right: 0px !important;
    margin-top: 50px !important; 
  }
</style>