<template>
    <div class="cicdHistory">
        <div class="cicdhi_title" style="display:flex;justify-content:space-between">
            <p>项目基础评级列表</p>
            <div>
              <!-- <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="goback()">返回</el-button> -->
            </div>
        </div>
        <div>
              <el-table :data="tableData" style="width: 100%" @sort-change="changeOrder" :default-sort="{prop:'statis_period',order: 'descending'}">
                  <el-table-column prop="par_name" label="项目" align="center">
                  </el-table-column>
                  <el-table-column prop="name" label="评分结果" align="center" sortable="custom">
                      <template slot-scope="scope">
                          <div v-if="Number(scope.row.totalscore) >= 90"><el-tag>优秀</el-tag></div>
                          <div v-else-if="Number(scope.row.totalscore) >= 60"><el-tag type="success">达标</el-tag></div>
                          <div v-else-if="Number(scope.row.totalscore) <60"><el-tag type="danger">不达标</el-tag></div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="totalscore" label="总得分" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="deploy" label="配置管理" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="arrangement" label="持续集成" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="testmanage" label="测试管理" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="qualitymanage" label="代码质量" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="delivery" label="交付能力" align="center" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="statis_period" label="评分时间" align="center" sortable="custom" width="160">
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                      <template slot-scope="scope">
                          <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="goDetails(scope.row.par_id, scope.row.par_name,scope.row.statis_period)">详情</el-button>
                      </template>
                  </el-table-column>
                </el-table>
            <div style="display:flex;justify-content:flex-end;align-items:center;margin-top:15px;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="listQuery.page"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="listQuery.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import {listByParam} from '@/api/cicd/cicdIndex'
import {systemlogStatis} from '@/api/modules/all'

export default {
  data () {
    return {
      tableData: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        orderField: 'statis_period',
        orderType: 'desc'
      },
      total: 0,
      Base64: require('js-base64').Base64
    }
  },
  mounted () {
    this.getList()
    let allObj = {
      url: this.$route.path,
      moduleName: 'CICD',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  methods: {
    getList () {
      let obj = JSON.parse(JSON.stringify(this.listQuery))
      obj.searchType = 'history'
      obj.projectId = this.Base64.decode(this.$route.params.projectId)
      listByParam(obj).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    goback () {
      this.$router.push({
        name: 'cicdDetails',
        params: {
          projectId: this.$route.params.projectId,
          projectName: this.$route.params.proname,
          statisPeriod: '%'
        }
      })
    },
    handleSizeChange (val) {
      this.listQuery.page = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
      // 排序
    changeOrder (column, prop, order) {
      this.listQuery.orderField = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.getList()
    },
    // 跳转
    goDetails (proid, proname, time) {
      let Base64 = require('js-base64').Base64
      proname = Base64.encode(proname)
      proid = Base64.encode(proid)
      let routeData = this.$router.resolve({
        name: 'cicdDetails',
        params: {
          projectId: proid,
          projectName: proname,
          statisPeriod: time
        }
      })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
    .cicdHistory{
        background-color: #fff;
        padding: 15px;
        .cicdhi_title{
            p{
                margin: 0;
                font-size: 20px;
                font-weight: 700;
            }
        }
    }
</style>