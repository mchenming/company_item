<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" class="formclass">
      <el-form-item class="fitem">
        <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item class="fitem">
        <el-button @click="getDataList()">查询</el-button>
        <!-- <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
        :formatter="dateFormat">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button> -->
          <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button> -->
          <div style="display:flex;justify-content:space-around">
            <div style="color:#409eff;cursor:pointer;" @click="addOrUpdateHandle(scope.row.roleId)">修改</div>
            <div style="color:#409eff;cursor:pointer;" @click="deleteHandle(scope.row.roleId)">删除</div>
          </div>
          <!-- <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button> -->
          <!-- <el-button type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="pagenumchoose"> 
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        popper-class="fixab"
        layout="total, sizes, prev, pager, next"
        class="pagenum">
      </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './add-or-update'
  import API from '@/api'
  import util from '@/utils/util'
  import {systemlogStatis} from '@/api/modules/all'
  export default {
    data () {
      return {
        dataForm: {
          roleName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    created () {
      this.getDataList()
    },
    mounted () {
      let allObj = {
        url: this.$route.path,
        moduleName: '角色管理',
        token: this.$cookie.get('token')
      }
      systemlogStatis(allObj).then(res => {
        // console.log(res)
      })
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          roleName: this.dataForm.roleName
        }
        API.role.list(params).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      dateFormat (row, column) {
        var date = row[column.property]
        return util.formatDate.format(new Date(date), 'yyyy-MM-dd hh:mm:ss')
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.role.del(ids).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>

<style scoped>
  .mod-role{
    background-color: #fff;
  }
  .pagenum{
   display: flex;
   justify-content: flex-end;
   margin-right: 20px;
   /* padding: 10px 0; */
   height: 48px;
   align-items: center;
 }
 .formclass{
   display: flex;
   align-items: center;
   height: 63px;
 }
 .fitem{
   padding: 0 15px;
 }
 .pagenumchoose{
   width: 100%;
   background-color: #fff;
   height: 50px;
   display: flex;
   align-items: center;
   justify-content: flex-end;
 }
</style>

<style>
  .mod-role{
    background-color: #fff;
  }
  .el-button--primary{
    background-color: #4b78cd;
    border: none;
  }
  .el-form--inline .el-form-item{
    margin: 0;
  }
  .el-button--primary:focus, .el-button--primary:hover{
    background-color: #4b78cd;
  }
</style>
<style>
    
/* .pagenum .el-input__inner{
   height: 28px;
} */
.el-select-dropdown__wrap,.el-scrollbar__wrap{
   margin-bottom: 0px !important;
 }
 .fixab .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
</style>