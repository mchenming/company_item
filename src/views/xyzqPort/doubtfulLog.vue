<template>
    <div class="doubtfulLog">
        <div class="smartFoot" v-loading='logLoading'>
          <div class="footRight">
            <div style="position:relative;height:40px;line-height:40px;text-align:center;color:#FFF;background-color:#4b78cd;font-size:16px;font-weight:700">
              <span>
                可疑日志
              </span>
              <div style="position:absolute;right:30px;top:0px;cursor:pointer;" @click="exit">
                  <span class="fa fa-close" style="font-size:25px;line-height:40px;"></span>
              </div>
            </div>
            <el-table :data="logData" style="width: 100%" :show-header=false border>
              <el-table-column prop="time" label="时间" width="180" align="center">
              </el-table-column>
              <el-table-column prop="id" label="log">
                <template slot-scope="scope">
                  <el-collapse v-model="activeNames" @change="selectColl">
                    <el-collapse-item :name="scope.row.id">
                      <template slot="title">
                        <div style="display:flex;justify-content: space-between;">
                          <div style="width:95%;display:flex;flex-flow:wrap">
                            <span style="margin-right:20px;">appname:{{scope.row.appName}}</span>
                            <span style="margin-right:20px;">hostname:{{scope.row.hostname}}</span>
                            <span style="margin-right:20px;">ip:{{scope.row.ip}}</span>
                            <span style="margin-right:20px;">tag:{{scope.row.tag}}</span>
                            <span style="margin-right:20px;">logtype:{{scope.row.logType}}</span>
                            <span style="margin-right:20px;">timestamp:{{scope.row.time}}</span>
                            <span style="margin-right:20px;">source:{{scope.row.source}}</span>
                          </div>
                          <a href="javascript:;" style="line-height:40px;display:bolck;" v-if="activeNames.includes(scope.row.id)">收起</a>
                          <a href="javascript:;" style="line-height:40px;display:bolck;" v-else>展开</a>
                        </div>
                      </template>
                      <pre>{{scope.row.rawMessage}}</pre>
                      <!-- <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                      <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div> -->
                    </el-collapse-item>
                  </el-collapse>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="display:flex;justify-content: flex-end;width:100%;padding:10px 0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="paramsData.page"
            :page-size="paramsData.pageSize"
            layout="total,sizes, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
    </div>
</template>

<script>
import {getJournal} from '@/api/xyzqPort/smartTrader'
export default {
  data () {
    return {
      paramsData: {
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10,
        type: '1'
      },
      logLoading: true,
      total: 0,
      logData: [],
      activeNames: []
    }
  },
  created () {
    this.paramsData.startTime = this.$route.query.stime
    this.paramsData.endTime = this.$route.query.etime
    this.getList()
  },
  methods: {
    selectColl () {

    },
    exit () {
      this.$router.go(-1)
    },
    handleSizeChange (val) {
      this.logLoading = true
      this.paramsData.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.logLoading = true
      this.paramsData.page = val
      // console.log(this.listQuery.page)
      this.getList()
    },
    getList () {
      getJournal(this.paramsData).then(response => {
        this.logLoading = false
        console.log(response)
        this.logData = []
        if (response.data.result === 'success') {
          this.logData = response.data.data
          this.total = response.data.total
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .doubtfulLog{
        background-color: #fff;
        margin-top: 15px;
    }
</style>

<style lang="scss">
  .el-table th.gutter{
    display: table-cell!important;
  }
  .errsmartbox{
    background-color: red !important;
  }
  pre {
    white-space: pre-wrap;       /* css-3 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
    margin: 0;
  }
  .smartFoot .el-collapse-item__content{
    padding-bottom: 0 !important;
  }
  .smartFoot .el-table td, .el-table th{
    padding: 5px 0 !important;
  }
  .smartFoot .el-table tbody tr:hover>td { 
    background-color:#ffffff!important
  }
  .smartFoot .el-collapse-item__header{
    border-bottom: 1px solid #fff;
  }
  .smartFoot .el-collapse{
    border: 1px solid #FFF;
  }
  .smartFoot .el-collapse-item__wrap{
    border-bottom: 1px solid #FFF;
  }
  .smartFoot .el-collapse-item__header{
    min-height: 40px;
    line-height: 20px;
    height: 40px;
  }
  .smartFoot .el-collapse-item__arrow{
    // line-height: 100px;
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>