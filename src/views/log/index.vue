<template>
  <div class="mod-log" v-if="NOTJ">
    <el-form :inline="true" :model="dataForm" class="esearch">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="用户名" clearable @keyup.enter.native="changeCondition()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="operationList" placeholder="用户操作" clearable @change="changeCondition()" style="width:200px" popper-class="noFix">
          <el-option
            v-for="value in options"
            :key="value"
            :label="value"
            :value="value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="changeCondition()">查询</el-button>
        <el-button style="background-color:#4b78cd;color:#fff;border:none" @click="goTj">统计</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :default-sort="{prop: 'userId', order: 'descending'}" tooltip-effect="dark" @sort-change="changeOrder"
      style="width: 100%">
      <el-table-column
        prop="id"
        sortable="custom"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="username"
        sortable="custom"
        header-align="center"
        align="center"
        width="100"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="chinesename"
        header-align="center"
        align="center"
        width="100"
        label="中文名">
      </el-table-column>
      <el-table-column
        prop="operation"
        sortable="custom"
        header-align="center"
        align="center"
        width="110"
        label="用户操作">
      </el-table-column>
      <el-table-column
        prop="method"
        sortable="custom"
        header-align="center"
        align="center"
        min-width="170"
        :show-overflow-tooltip="true"
        label="请求方法">
      </el-table-column>
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        min-width="180"
        :show-overflow-tooltip="true"
        label="请求参数">
      </el-table-column>
      <el-table-column
        prop="time"
        sortable="custom"
        header-align="center"
        align="center"
        width="150"
        label="执行时长(毫秒)">
      </el-table-column>
      <el-table-column
        prop="ip"
        sortable="custom"
        header-align="center"
        align="center"
        width="130"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="createDate"
        sortable="custom"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
        :formatter="dateFormat">
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" class="pagerow">
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import API from '@/api'
  import util from '@/utils/util'
  import {systemlogStatis} from '@/api/modules/all'
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          operation: ''
        },
        NOTJ: true,
        options: ['登录', '退出', '单点登录'],
        operationList: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        orderkey: '',
        orderType: '',
        selectionDataList: []
      }
    },
    created () {
      this.changeCondition()
      this.getUserList()
    },
    mounted () {
      let allObj = {
        url: this.$route.path,
        moduleName: '系统日志',
        token: this.$cookie.get('token')
      }
      systemlogStatis(allObj).then(res => {
        // console.log(res)
      })
    },
    methods: {
      goTj () {
        this.$router.push('/pvuv')
      },
      changeCondition () {
        this.pageIndex = 1
        this.pageSize = 10
        this.getDataList()
      },
      // 排序
      changeOrder (column, prop, order) {
        this.orderkey = column.prop
        this.orderType = ''
        if (column.order === 'ascending') {
          this.orderType = 'asc'
        } else {
          this.orderType = 'desc'
        }
        this.pageIndex = 1
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          operationList: this.operationList,
          orderType: this.orderType,
          orderkey: this.orderkey
        }
        API.log.list(params).then(({data}) => {
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
      getUserList () {},
      dateFormat (row, column) {
        var date = row[column.property]
        return util.formatDate.format(new Date(date), 'yyyy-MM-dd hh:mm:ss')
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
      }
    }
  }
</script>

<style lang="scss" scoped>
.mod-log{
  background-color: #fff;
  // margin-top: 44px;
  .esearch{
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
  }
  .pagerow{
    display: flex;
    justify-content: flex-end;
    padding: 10px 15px;
  }
}
</style>

<style lang="scss">
  .el-form-item__content{
    margin-top: 5px;
  }
  // .el-tooltip__popper.is-light{
  //   z-index: 5001;
  // }
  .el-tooltip__popper,.is-dark{
    z-index: 5001 !important;
  }
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .noFix .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
</style>