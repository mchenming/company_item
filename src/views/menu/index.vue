<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm" class="addform">
      <el-form-item>
        <!-- <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      style="width: 100%;">
      <el-table-column
        prop="menuId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <table-tree-column
        prop="name"
        header-align="center"
        treeKey="menuId"
        width="150"
        label="名称">
      </table-tree-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单">
      </el-table-column>
      <!-- <el-table-column
        prop="icon"
        header-align="center"
        align="center"
        label="图标">
        <template slot-scope="scope">
          <i :class="['fa-lg', scope.row.icon]"></i>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button v-if="isAuth('sys:user:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button> -->
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>
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
        layout="total, sizes, prev, pager, next"
        class="pagenum">
      </el-pagination>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './add-or-update'
  import API from '@/api'
  import { treeDataTranslate } from '@/utils'
  import {systemlogStatis} from '@/api/modules/all'
  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    created () {
      this.getDataList()
    },
    mounted () {
      let allObj = {
        url: this.$route.path,
        moduleName: '菜单管理',
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
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        API.menu.list().then(({data}) => {
          if (data) {
            this.dataList = treeDataTranslate(data, 'menuId')
            this.totalPage = this.dataList.length
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.menu.del(id).then(({data}) => {
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
  .mod-menu{
    background-color: #fff;
  }
  .addform{
    background-color: #fff;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .pagenum{
   display: flex;
   justify-content: flex-end;
   margin-right: 20px;
   padding: 10px 0;
 }
 .pagenumchoose{
   width: 100%;
   background-color: #fff;
   height: 50px;
   display: flex;
   justify-content: flex-end;
   align-items: center;
 }
</style>
<style>
  .mod-menu{
    background-color: #fff;
    /* margin-top: 44px; */
  }
  .addform .el-form-item{
    margin: 0;
    padding: 0 15px;
  }
  .addform .el-button--primary{
    background-color: #4b78cd;
    border: none;
  }
  .el-form--inline .el-form-item{
    margin: 0;
  }
  .el-select-dropdown__wrap,.el-scrollbar__wrap{
   margin-bottom: 0px !important;
  }
  /* .pagenum .el-input__inner{
   height: 28px;
  } */
  
.mod-menu>.saltitle [class*=" el-icon-"], [class^=el-icon-] {
    color: #aaa !important;
    font-size: 18px !important;
    margin: 0px !important;

}
.mod-menu>>> .el-submenu__icon-arrow, .el-icon-arrow-down{
  margin: 0px !important;
}
</style>
