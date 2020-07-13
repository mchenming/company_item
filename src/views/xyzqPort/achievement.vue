<template>
    <div class="achievement">
        <div class="toptit" style="line-height:30px;height:30px;background-color:#4b78cd;margin-top:15px;padding:0 15px;color:#fff;">
            <span style="float:left;font-size:15px;font-weight:700;">成效评价</span>
            <span class="fa fa-close" style="float:right;font-size:25px;margin-top:3px;cursor:pointer;" @click="exit"></span>
        </div>
        <div style="width:100%">
            <el-row>
                <el-col :span="15">
                    <div style="line-height:50px;display:flex;">
                        <span style="margin:0 10px;display:inline-block;width:60px;text-align:center;">项目</span>
                        <el-select v-model="projectArr" placeholder="全部" multiple style="flex:1;margin-right:15px;" @change="changeitem" popper-class='onmouthFix'>
                        <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                          <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                        </div>
                          <el-option
                            v-for="(item,index) in oaProname"
                            :key="oaProname[index]"
                            :label="oaProname[index]"
                            :value="oaProname[index]">
                          </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="9">
                    <div class="mouth" style="display:flex;width:100%;line-height:50px;">
                        <span style="margin-right:5px;display:inline-block;width:90px;">需求发起日期</span>
                        <el-date-picker
                          v-model="changeTime"
                          type="daterange"
                          align="right"
                          value-format="yyyy-MM-dd"
                          :clearable="true"
                          :unlink-panels="true"
                          ref="timeSelect" style="margin-top:5px;">
                        </el-date-picker>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div style="width:100%">
            <el-row>
                <!-- <el-col :span="8" style="line-height:50px;">
                    <span style="margin:0 20px;">状态</span>
                      <el-select v-model="needStatuts" multiple placeholder="请选择" style="width:80%;" popper-class="nofix" @change="timeChangepro">
                        <el-option
                          v-for="item in allstatus"
                          :key="item.needsStatus"
                          :label="item.needsStatus"
                          :value="item.needsStatus">
                        </el-option>
                      </el-select>
                </el-col> -->
                <el-col :span="7" style="line-height:50px;display:flex;">
                    <span style="margin:0 10px;display:inline-block;width:60px;">评价状态</span>
                     <el-select v-model="fbStatusArr" multiple placeholder="请选择" style="flex:1;" popper-class="nofix" @change="timeChangepro">
                      <el-option
                        v-for="item in fbStatus"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6" style="line-height:50px;display:flex;">
                    <span style="margin-right:5px;display:inline-block;width:90px;text-align:center;">满意度</span>
                    <el-select v-model="performance" multiple placeholder="请选择" style="flex:1" popper-class="nofix" @change="timeChangepro">
                      <el-option
                        v-for="item in feedBack"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" style="line-height:50px;margin-left:40px;">
                    <el-button style="background-color:#4b78cd;color:#fff;border:none;" @click="exportPage">导出</el-button>
                </el-col>
            </el-row>
        </div>

        <div style="padding:0 15px;">
          <el-table :data="tableData" style="width: 100%" @sort-change="changeOrder" max-height="700px" class="mHei">
            <el-table-column prop="项目名称" label="标题" align="center" sortable="custom">
              <template slot-scope="scope">
                <div @click="golookup(scope.row)" style="text-decoration:underline;cursor:pointer;color:#4b78cd;">{{scope.row['项目名称']}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="涉及系统" label="涉及系统" align="center" sortable="custom" width="130">
            </el-table-column>
            <el-table-column prop="发起日期" label="需求发起日期" align="center" sortable="custom" width="130">
              <template slot-scope="scope">
                <div v-if="scope.row['发起日期']">{{scope.row['发起日期'].substr(0,10)}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="计划完成时间" label="计划验收日期" align="center" sortable="custom" width="130">
              <template slot-scope="scope">
                <div v-if="scope.row['计划完成时间']">{{scope.row['计划完成时间'].substr(0,10)}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="实际完成时间" label="实际验收日期" align="center" sortable="custom" width="130">
              <template slot-scope="scope">
                <div v-if="scope.row['实际完成时间']">{{scope.row['实际完成时间'].substr(0,10)}}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="需求实施情况" label="状态" align="center" sortable="custom" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row['需求实施情况']==='-8712346836245460400'">需求完成</div>
                <div v-else-if="scope.row['需求实施情况']==='5875571938664270324'">需求部分完成</div>
                <div v-else-if="scope.row['需求实施情况']==='-6536861750169808955'">需求中止</div>
                <div v-else>其他</div>
              </template>
            </el-table-column> -->
            <el-table-column prop="经办人" label="创建人" align="center" sortable="custom" width="90">
            </el-table-column>
            <el-table-column prop="评价发起日期" label="评价发起日期" align="center" sortable="custom" width="130">
              <template slot-scope="scope">
                <div v-if="scope.row['评价发起日期']">{{scope.row['评价发起日期'].substr(0,10)}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="应用绩效回顾状态" label="评价状态" align="center" sortable="custom" width="130">
            </el-table-column>
            <el-table-column prop="需求实现满意度" label="满意度" align="center" sortable="custom" width="180">
              <template slot-scope="scope">
                <!-- {{scope.row['应用绩效回顾等级']}} -->
                <div v-for="(item,index) in feedBack" :key="index">
                  <div v-if="item.id===scope.row['需求实现满意度']" style="text-align:left;">{{item.name}}</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="display:flex;justify-content: flex-end;padding:0 15px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="listQuery.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="listQuery.pageSize"
              layout="total, sizes, prev, pager, next"
              popper-class="nofix"
              :total="total" style="margin:5px 0;">
            </el-pagination>
        </div>
    </div>
</template>


<script>
import {getOaProjects} from '@/api/xyzqPort/OaPort'
import {getReviewByProject} from '@/api/xyzqPort/achievement'
import {listByMap} from '@/api/xyzqPort/yewuneed'  // 获取所有的状态码
import {systemlogStatis} from '@/api/modules/all'

export default {
  data () {
    return {
      searchText: '',
      oaProname: [],
      forSecharName: [],
      changeTime: [],
      projectArr: [],
      listQuery: {
        projectName: '',
        page: 1,
        pageSize: 10,
        orderType: 'desc',
        orderFiled: '',
        createStartTime: '',
        createEndTime: '',
        need_status: '', // 评价状态
        review_level: '', // 绩效等级
        needs_status: '', // 需求状态
        timeliness: '' // 状态
      },
      performance: [],
      fbStatus: [
        '已发送待评价', '已评价待确认', '已确认'
      ],
      needStatuts: [],
      fbStatusArr: [],
      total: 0,
      tableData: [],
      feedBack: [{
        id: '1',
        name: 'A 实现结果超出需求预期'
      }, {
        id: '2',
        name: 'B 实现结果满足需求'
      }, {
        id: '3',
        name: 'C 实现结果基本满足需求，但有待优化'
      }, {
        id: '4',
        name: 'D 实现结果未能满足需求'
      }],
      allstatus: []
    }
  },
  created () {
    if (typeof (this.$route.query.stime) !== 'undefined' && this.$route.query.stime !== '') {
      this.changeTime[0] = this.$route.query.stime
      this.changeTime[1] = this.$route.query.etime
    }
    // this.changeTime[0] = this.$route.query.stime
    // this.changeTime[1] = this.$route.query.etime
    if (typeof (this.$route.query.proname) !== 'undefined' && this.$route.query.proname !== '') {
      this.projectArr[0] = this.$route.query.proname
    }
    this.fbStatusArr = ['已确认']
    this.getproname() // 获取所有的项目名称
    this.getallstatus() // 获取所有的需求状态
    this.getDataList() // 获取data数据
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '需求看板',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  watch: {
    changeTime (val, oldval) {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      if (val === null) {
        this.changeTime = []
      }
      this.getDataList()
    }
  },
  methods: {
    golookup (data) {
      // console.log(data)
      // console.log(data['应用绩效回顾状态'])
      let statusStr = data['应用绩效回顾状态']
      let typein = ''
      if (statusStr === '已发送待回顾' || statusStr === '已发送待评价') {
        typein = 0
      } else {
        typein = 1
      }
      let sendrow = {
        reqId: data.oa_id,
        type: typein,
        addtype: 'lc'
      }
      let routeData = this.$router.resolve({
        name: 'newlookUp',
        query: sendrow
      })
      window.open(routeData.href, '_blank')
    },
    // 导出
    exportPage () {
      // const row = {
      //   // projectName: '其他'
      //   projectName: ''
      // }
      var newrow = JSON.stringify(this.listQuery)
      // console.log(newrow)
      newrow = encodeURIComponent(newrow)
      window.open('/sysmanage/qxNeedmeritsReview/export?token=' + this.$cookie.get('token') + '&JosnStr=' + newrow)
    },
    getallstatus () {
      listByMap().then(res => {
        this.allstatus = res.data.rows
      })
    },
    getDataList () {
      this.listQuery.need_status = ''
      this.listQuery.projectName = this.projectArr.join(',')
      this.listQuery.createStartTime = this.changeTime ? this.changeTime[0] : ''
      this.listQuery.createEndTime = this.changeTime ? this.changeTime[1] : ''
      this.listQuery.review_level = this.performance.join(',') // 绩效等级
      this.listQuery.need_status = this.fbStatusArr.join(',')  // 评价状态
      this.listQuery.needs_status = this.needStatuts.join(',') // 需求状态
      getReviewByProject(this.listQuery).then(res => {
        // console.log(res)
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    // 排序
    changeOrder (column, prop, order) {
      this.listQuery.pageSize = 10
      this.listQuery.page = 1
      this.listQuery.orderFiled = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      this.getDataList()
    },
    exit () {
      const row = {
        stime: this.$route.query.stime,
        etime: this.$route.query.etime,
        // proid: this.$route.query.project_id,
        radio: this.$route.query.isradio,
        branchArr: this.$route.query.branchArr
      }

      this.$router.push({path: '/OaPort', query: row})
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.getDataList()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getDataList()
      // console.log(`当前页: ${val}`)
    },
    timeChangepro () {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.getDataList()
    },
    getproname () {
      // 获取所有的项目
      const grow = {
        token: this.$cookie.get('token')
      }
      getOaProjects(grow).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          this.oaProname = res.data.data
          this.forSecharName = [...res.data.data]
        }
      })
    },
    changeitem () {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.getDataList()
    },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.forSecharName.forEach((item, index) => {
        if (this.forSecharName[index].toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(this.forSecharName[index])
        }
      })
      if (allList.length === 0) {
        this.oaProname = ['暂无数据']
      } else {
        this.oaProname = allList
      }
    }
  }
}
</script>
<style scoped>
    .achievement{
        background-color: #fff;
    }
    .achievement >>> .el-table td{
      padding: 8px 0;
    }
</style>

<style>
  .onmouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
  .nofix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
</style>
<style scoped>
  @media screen and (max-width: 1280px) {
    .mHei{
      max-height: 560px !important;
    }
    .mHei >>> .el-table__body-wrapper,.is-scrolling-none{
      max-height: 500px !important;
    }
  }
</style>