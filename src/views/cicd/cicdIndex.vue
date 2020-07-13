<template>
    <div class='cicd'>
        <div class="cicd_pin" style="padding:25px 35px;">
            <div class="cicd_pin_child" style="background-color:rgba(103, 194, 58, 1)">
                <div class="cicd_pin_child_sty">
                    <span class="fa fa-bullseye fa-3x" style="color:#fff;"></span>
                </div>
                <div class="cicd_pin_child_sty">
                    <p>{{scoreVal}}</p>
                    <p>项目总平均分</p>
                    <p>总分{{totalVal}}</p>
                </div>
            </div>
            <div class="cicd_pin_child" style="background-color:rgba(75, 120, 205, 1)">
                <div class="cicd_pin_child_sty">
                    <span class="fa fa-dashboard fa-3x" style="color:#fff"></span>
                </div>
                <div class="cicd_pin_child_sty">
                    <p>{{dataList[0].scoreVal}}</p>
                    <p>配置管理平均分</p>
                    <p>总分{{dataList[0].totalVal}}</p>
                </div>
            </div>
            <div class="cicd_pin_child" style="background-color:#96f">
                <div class="cicd_pin_child_sty">
                    <span class="fa fa-cubes fa-3x" style="color:#fff"></span>
                </div>
                <div class="cicd_pin_child_sty">
                    <p>{{dataList[1].scoreVal}}</p>
                    <p>持续集成平均分</p>
                    <p>总分{{dataList[1].totalVal}}</p>
                </div>
            </div>
            <div class="cicd_pin_child" style="background-color:rgba(255, 153, 0, 1)">
                <div class="cicd_pin_child_sty">
                    <span class="fa fa-diamond fa-3x" style="color:#fff"></span>
                </div>
                <div class="cicd_pin_child_sty">
                    <p>{{dataList[2].scoreVal}}</p>
                    <p>测试管理平均分</p>
                    <p>总分{{dataList[2].totalVal}}</p>
                </div>
            </div>
            <div class="cicd_pin_child" style="background-color:rgba(255, 204, 0, 1)">
                <div class="cicd_pin_child_sty">
                    <span class="fa fa-id-card-o fa-3x" style="color:#fff"></span>
                </div>
                <div class="cicd_pin_child_sty">
                    <p>{{dataList[3].scoreVal}}</p>
                    <p>代码质量平均分</p>
                    <p>总分{{dataList[3].totalVal}}</p>
                </div>
            </div>
            <div class="cicd_pin_child" style="background-color:rgba(102, 102, 102, 1)">
                <div class="cicd_pin_child_sty">
                    <span class="fa fa-archive fa-3x" style="color:#fff"></span>
                </div>
                <div class="cicd_pin_child_sty">
                    <p>{{dataList[4].scoreVal}}</p>
                    <p>交付能力平均分</p>
                    <p>总分{{dataList[4].totalVal}}</p>
                </div>
            </div>
        </div>
        <div class="cicd_list" style="padding:0 15px">
            <div class="cicd_title" style="display:flex;justify-content:space-between;align-items:center;margin-top:20px">
                <p style="padding-left:20px;">项目基础评级列表</p>
                <p style="padding-right:20px;">评分时间：{{dataList[0].statisPeriod}}</p>
            </div>
            <div>
                 <el-table :data="tableData" style="width: 100%;margin-top:20px;" @sort-change="changeOrder">
                  <el-table-column prop="par_sort" label="项目" align="center" sortable="custom">
                    <template slot-scope="scope">
                      {{scope.row.par_name}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="totalscore" label="评分结果" align="center" sortable="custom">
                      <template slot-scope="scope">
                          <div v-if="Number(scope.row.totalscore) >= 90"><el-tag>优秀</el-tag></div>
                          <div v-else-if="Number(scope.row.totalscore) >= 60"><el-tag type="success">达标</el-tag></div>
                          <div v-else-if="Number(scope.row.totalscore) <60"><el-tag type="danger">不达标</el-tag></div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="totalscore" label="总得分" align="center" sortable="custom">
                    <template slot-scope="scope">
                      {{scope.row.totalscore}}
                    </template>
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
                  <!-- <el-table-column prop="statis_period" label="评分时间" align="center" sortable="custom" width="150">
                  </el-table-column> -->
                  <el-table-column label="操作" align="center">
                      <template slot-scope="scope">
                          <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="goDetails(scope.row.par_id, scope.row.par_name)">详情</el-button>
                      </template>
                  </el-table-column>
                </el-table>
                <div style="display:flex;justify-content:flex-end;align-items:center;padding:10px 0;">
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
        </div>
    </div>
</template>

<script>
import {listByParam, getTopStatisData} from '@/api/cicd/cicdIndex'
import {systemlogStatis} from '@/api/modules/all'

export default {
  data () {
    return {
      tableData: [],
      listQuery: {
        orderType: '',
        orderField: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      dataList: [
        {totalVal: 0, scoreVal: 0, categoryName: '配置管理'},
        {totalVal: 0, scoreVal: 0, categoryName: '持续集成与部署管理'},
        {totalVal: 0, scoreVal: 0, categoryName: '测试管理'},
        {totalVal: 0, scoreVal: 0, categoryName: '代码质量管理'},
        {totalVal: 0, scoreVal: 0, categoryName: '交付能力与响应'}
      ],
      totalVal: 0,
      scoreVal: 0
    }
  },
  mounted () {
    this.getList()
    this.getData()
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
    getList () {
      let obj = JSON.parse(JSON.stringify(this.listQuery))
      obj.searchType = 'new'
      listByParam(obj).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    getData () {
      let obj = {
        searchType: 'new'
      }
      getTopStatisData(obj).then(res => {
        this.dataList.forEach((item, index) => {
          res.data.data.forEach((value, i) => {
            if (item.categoryName === value.categoryName) {
              this.dataList[index] = res.data.data[i]
            }
          })
        })
        if (this.dataList && this.dataList.length > 0) {
          this.totalVal = this.dataList.reduce((p, e) => p + e.totalVal, 0)
          this.scoreVal = this.dataList.reduce((p, e) => p + e.scoreVal, 0)
          this.scoreVal = Number(this.scoreVal).toFixed(2)
        }
      })
    },
    // 切换当前页数
    handleSizeChange (val) {
      this.listQuery.page = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    // 切换当前页码
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    // 跳转
    goDetails (proid, proname) {
      let Base64 = require('js-base64').Base64
      proname = Base64.encode(proname)
      proid = Base64.encode(proid)
      let routeData = this.$router.resolve({
        name: 'cicdDetails',
        params: {
          projectId: proid,
          projectName: proname,
          statisPeriod: '%'
        }
      })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
    .cicd{
        background-color: #fff;
        // padding: 15px 15px;
        .cicd_pin{
            display: flex;
            .cicd_pin_child{
                flex:1;
                margin-right: 40px;
                display: flex;
                padding: 10px 5px;
                border-radius: 5px;
                &:nth-last-of-type(1) {
                  margin: 0;
                }
                .cicd_pin_child_sty{
                    flex:3;
                    &:nth-of-type(1) {
                        flex:2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
                p{
                    margin: 0;
                    color: #fff;
                    text-align: center;
                    font-size: 13px;
                    &:nth-of-type(1) {
                        font-size: 28px;
                        font-weight: 700;
                    }
                }
            }
        }
        .cicd_title{
            p{
                margin: 0;
                &:nth-of-type(1){
                    font-size: 20px;
                    font-weight: 700;
                }
                &:nth-of-type(2){
                    font-weight: 700;
                }
            }
        }
    }
</style>

<style scoped>
  @media screen and (max-width: 1280px) {
    .cicd_pin_child p{
      font-size: 12px !important;
    }
    .cicd_pin_child p:nth-of-type(1) {
        font-size: 28px !important;
        font-weight: 700 !important;
    }
  }
</style>