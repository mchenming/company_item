<template>
  <div class="servertable">
    <div class="leftTable">
      <el-button class="resgo" type='text' @click="goBack()">返回</el-button>
      <el-table :data="endList" border style="width: 100%">
        <el-table-column prop="[0]" label="序号" width="60px" align="center"></el-table-column>
        <el-table-column prop="[1]" label="扫描完成时间" min-width="140px" align="center"></el-table-column>
        <el-table-column prop="[2]" label="项目" min-width="200px" align="center"></el-table-column>
        <el-table-column label="执行状态" min-width="90px" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row[3]=='已完成'">已完成</el-tag>
            <el-tag type="danger" v-else>已终止</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="执行结果" min-width="90px" align="center">
          <template slot-scope="scope">
            <el-tag type="success">通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="scope">
            <div class="box" style="display:flex;justify-content: space-around;text-align: center ">
              <el-button style="background-color: #4b78cd;color: #fff" size='mini' type="success" @click="searchLog(scope.row)">查看</el-button>
              <!-- <el-button style="background-color: #4b78cd;" size='mini' type="success">下载</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="background-color: white;margin-top: 10px;">
        <el-pagination @size-change="lefthandleSizeChange" @current-change="lefthandleCurrentChange" :current-page.sync="leftpageRow.pageNo"
          :page-sizes="[5,10,20, 50]" :page-size="leftpageRow.pageSize" layout="total, sizes, prev, pager, next" :total="lefttotal">
        </el-pagination>
      </div>
    </div>
    <div class="rightTable">
      <div class="seninfo">
        <span class="fa fa-clock-o" style="#000"></span>
        <span>历史记录</span>
      </div>
      <!-- <template> -->
      <el-table :data="tableData" style="width: 100%" @row-click="changeitem">
        <el-table-column prop="[0]" label="序号" align="center" min-width="50"></el-table-column>
        <el-table-column prop="[2]" label="描述时间" align="center" min-width="140"></el-table-column>
        <el-table-column label="状态" align="center" min-width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row[1]=='执行完毕'">{{scope.row[1]}}</el-tag>
            <el-tag type="danger" v-else>已终止</el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="90" label="结果" align="center">
          <template slot-scope="scope">
            <el-tag type="success">通过</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="background-color: white;margin-top: 10px;">
        <el-pagination @size-change="righthandleSizeChange" @current-change="righthandleCurrentChange" :current-page.sync="rightpageRow.pageNo"
          :page-sizes="[5,10,20,50]" :page-size="rightpageRow.pageSize" layout="total, sizes, prev, pager, next" :total="righttotal">
        </el-pagination>
      </div>
    </div>
    <!-- 查看详情 -->
    <el-dialog title="扫描报告" :visible.sync="detailLogVisible1" width="70%">
      <div v-html="detailLog"></div>
      <el-button style="margin-left: 40%;" width="50%" @click="detailLogVisible1 = false">关闭</el-button>
    </el-dialog>
  </div>
</template>
<script>
import {gettableDataList, getLogDetail} from '@/api/xyzqPort/serverTable'
import {systemlogStatis} from '@/api/modules/all'

export default {
  data () {
    return {
      lefttotal: 0,
      leftpageRow: {
        pageNo: 1,
        pageSize: 10
      },
      righttotal: 0,
      rightpageRow: {
        pageNo: 1,
        pageSize: 10
      },
      detailLogVisible1: false,
      tableData: [],
      tableDatas: [],
      jobId: '',
      endList: [],
      endLists: [],
      reportDict: {},
      detailLog: ''
    }
  },
  created () {
    this.jobId = this.$route.query.jobId
    this.gettableDataList()
  },
  mounted () {
    this.$nextTick(function () {
    })
    let allObj = {
      url: this.$route.path,
      moduleName: '敏感词扫描',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  activated () {
    this.jobId = this.$route.query.jobId
    this.gettableDataList()
  },
  methods: {
    goBack () {
      this.$router.push({ path: '/serverPort?tabActiveName=two' })
    },
    searchLog (row) {
      var id = row[4].substring(row[4].lastIndexOf('(') + 2, row[4].lastIndexOf(')') - 1)
      for (let value in this.reportDict) {
        if (value === id) {
          this.detailLog = this.reportDict[value]
          this.detailLogVisible1 = true
        }
      }
    },
    changeitem (row) {
      let id = row[4].substring(row[4].lastIndexOf('(') + 2, row[4].lastIndexOf(')') - 1)
      this.getLogDetail(id)
    },
    gettableDataList () {
      gettableDataList(this.jobId).then(response => {
        this.tableDatas = response.data.data
        this.righttotal = this.tableDatas.length
        if (response.data.data.length > 0) {
          this.righthandleCurrentChange(1)
          var det = response.data.data[0][4]
          var id = det.substring(det.lastIndexOf('(') + 2, det.lastIndexOf(')') - 1)
          this.getLogDetail(id)
        }
      })
    },
    // getOptionsDatas () {
    //   getSensitiveOptions().then(response => {
    //     this.sensitiveOptions = response.data
    //   })
    // },
    getLogDetail (jobId) {
      getLogDetail(jobId).then(response => {
        this.endLists = response.data.data
        this.lefttotal = this.endLists.length
        this.lefthandleCurrentChange(1)
        this.reportDict = response.data.report_dict
      })
    },
    // 改变当前分页显示数
    lefthandleSizeChange (val) {
      this.leftpageRow.pageSize = val
      this.leftpageRow.start = (this.leftpageRow.pageNo - 1) * this.leftpageRow.pageSize
      this.leftpageRow.limit = this.leftpageRow.pageNo * this.leftpageRow.pageSize
      this.leftpageChange()
    },

    lefthandleCurrentChange (val) {
      this.leftpageRow.pageNo = val
      this.leftpageRow.start = (val - 1) * this.leftpageRow.pageSize
      this.leftpageRow.limit = val * this.leftpageRow.pageSize
      this.leftpageChange()
    },
    leftpageChange () {
      this.endList = []
      for (let i = this.leftpageRow.start; i < this.leftpageRow.limit; i++) {
        if (i < this.endLists.length) {
          const element = this.endLists[i]
          this.endList.push(element)
        }
      }
    },
    // 改变当前分页显示数
    righthandleSizeChange (val) {
      this.rightpageRow.pageSize = val
      this.rightpageRow.start = (this.rightpageRow.pageNo - 1) * this.rightpageRow.pageSize
      this.rightpageRow.limit = this.rightpageRow.pageNo * this.rightpageRow.pageSize
      this.rightpageChange()
    },

    righthandleCurrentChange (val) {
      this.rightpageRow.pageNo = val
      this.rightpageRow.start = (val - 1) * this.rightpageRow.pageSize
      this.rightpageRow.limit = val * this.rightpageRow.pageSize
      this.rightpageChange()
    },
    rightpageChange () {
      this.tableData = []
      for (let i = this.rightpageRow.start; i < this.rightpageRow.limit; i++) {
        if (i < this.tableDatas.length) {
          const element = this.tableDatas[i]
          this.tableData.push(element)
        }
      }
    }
  }
}
</script>

<style>
.servertable {
  width: 100%;
  height: 100%;
  background-color: #fff;
  margin: auto;
  display: flex;
  /* margin-top: 44px; */
}
.leftTable {
  border-right: 1px solid #ccc;
  flex: 2;
  padding: 10px 15px 10px 30px;
  overflow: hidden;
}
.leftTable .resgo {
  float: right;
  color: #409EFF;
  border: none;
  overflow: hidden;
  margin-bottom: 30px;
}
.rightTable {
  flex: 1;
}
.el-table {
  margin-top: 30px;
}
.leftTable .btns {
  margin: none !important;
}
.leftTable .el-button {
  color: #409EFF;
  border: none;
  overflow: hidden;
}
.rightTable {
  padding: 10px 15px;
}
.box>.el-tag{
  background-color: #4b78cd;
  color: #fff;
  cursor: pointer;
  padding: 0 20px;
  text-align: center;
}
</style>