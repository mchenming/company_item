
<template>
  <div class="youlibao">
    <div class="youheader">
      <div class="youdate"><span style="padding:0 30px;">日期</span><el-date-picker v-model="listQuery.time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" @change="changedate"></el-date-picker></div>
      <div class="youchoose">
          <el-radio-group v-model="listQuery.type" @change="changelab" class="youradio">
            <el-radio :label="0">日报</el-radio>
            <el-radio :label="1">晨报</el-radio>
            <el-radio :label="2">午报</el-radio>
          </el-radio-group>
          <el-button style="color:#fff;background-color:#4B78CD;border:none;" @click="open()" size="small" class="restmail">发送邮件</el-button>
            <el-dialog title="" :visible.sync="outerVisible" :close-on-click-modal="false">
             <el-button type="primary" @click="sendmailsmtp" style="margin-left:30px;margin-bottom:20px;color:#fff;background-color:#4B78CD;border:none;">确认发送</el-button>
                  <!-- <el-dialog width="30%" title="192.25.108.72 显示" :visible.sync="innerVisible" append-to-body>
                    <p style="text-align:center">{{msg}}</p>
                    <span slot="footer" class="dialog-footer">
                     <el-button type="primary" @click="innerVisible = false">确 定</el-button>
                    </span>
                  </el-dialog> -->
             <el-form :model="form" label-width="100%">
            <el-form-item label="收件人" label-width="15%">
             <el-input type="textarea" v-model="form.to_address" auto-complete="off"></el-input>
             </el-form-item>
             <el-form-item label="抄送" label-width="15%">
             <el-input type="textarea" v-model="form.cc_address" auto-complete="off"></el-input>
             </el-form-item>
             <el-form-item label="主题" label-width="15%">
             <el-input v-model="form.mail_title" auto-complete="off"></el-input>
              <h3 style="text-align:center">以下为{{mess.title}}。详细数据请到平台查询：
              <el-button type="text" @click="openNew()" size="medium">{{mess.title}}(点击打开)</el-button>
              </h3>
              
              </el-form-item>
            <el-form-item label="" label-width="90">
              <img :src="imgUrl" width="100%">
            </el-form-item>
         </el-form>
         <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="outerVisible = false">取 消</el-button>
         </div>
         </el-dialog>

      </div>
    </div>
    <div ref="imageDom">
      <div class="youmess">
        <div class="youleft" style="overflow-y: auto;" >
          <el-button type="primary" v-if="listQuery.type !== 0" @click="opendialog" style="float:right;margin-right:10px;margin-top:10px;" size="small" class="sendmail"> 编 辑 </el-button>
          <el-dialog title="概 述" :visible.sync="dialogVisible"  width="40%" :close-on-click-modal="false">
            <!-- <el-input type="textarea"  autosize="{ minRows: 6, maxRows: 12}"  placeholder="请输入内容"  v-model="static_report" v-html="static_report"></el-input> -->
            <quill-editor :options='editorOption'  ref="editorOption"  v-model="static_reportup"></quill-editor>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editstaticdata">保 存</el-button>
            </span>
          </el-dialog>
          <h1>{{mess.title}}</h1>
          <div v-html="static_report" ></div>
        </div>
          <div class="youright">
              <div class="yourigheight">
                  <p>检查时间</p>
                  <h2>{{mess.inspectdate}}&nbsp;&nbsp;&nbsp;&nbsp;{{showcatchtime}}</h2>
              </div>
              <div class="yourigfooter">
                  <div class="boxa">
                      <span>基本操作</span>
                      <P v-if="mess.caozuonum == 0">0</P>
                      <p v-if="mess.caozuonum != 0">{{((mess.caozuonum - mess.errnum)/mess.caozuonum*100).toFixed(2)}}%</p>
                  </div>
                  <div class="boxb">
                      <span>数据一致性</span>
                      <p>{{mess.sjyzx}}%</p>
                  </div>
              </div>
          </div>
      </div>
      <div class="youjc">
          <div class='ask' style="padding:10px 15px;font-weight:700;font-size:16px;">基本操作</div>
          <div id="ecjc" ref="ecjc" style="width:100%;height:270px;"></div>
      </div>
      <div class="youinspect">
          <div class="inspectdata">
            <div v-if="!outerVisible">
              <el-button type="primary" v-if="listQuery.type === 0 && gmjjStatus !== '1'" style="float:right;margin-right:50px;margin-top:10px;" size="small" class="restmail" @click="GMJJDataGet">采集数据</el-button>
            <el-button type="primary" v-if="listQuery.type === 0 && gmjjStatus === '1'" style="float:right;margin-right:50px;margin-top:10px;" size="small" class="restmail">采集中</el-button>
            </div>
              <div class='ask' style="padding:10px 15px;font-weight:700;font-size:16px;">数据一致性</div>
              
              <div id="ecinpectdata" style="width:100%;height:300px;"></div>
          </div>
          <div class="inspecttime">
              <div id="ecinpecttime" style="width:100%;height:300px;margin-top:30px"></div>            
          </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="infoFlag"
      :close-on-click-modal="false"
      :show-close="false"
      width="60%">
      <h1 style="text-align:center;">基本功能用例列表</h1>
      <div class="posfoot">
        <el-table
          :data="tableData"
          v-loading='dataLoading'
          @sort-change='orderchange'
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60">
          </el-table-column>
          <el-table-column
            prop="case_class"
            label="模块"
            align="center"
            sortable="custom"
            width="180">
          </el-table-column>
          <el-table-column
            prop="case_title"
            align="center"
            label="用例详情">
          </el-table-column>
          
          <el-table-column
            prop="case_result"
            width="120"
            sortable="custom"
            align="center"
            label="执行结果">
          </el-table-column>
        </el-table>
        <div style="display:flex;justify-content:flex-end;padding:5px 0;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          popper-class="posbottom"
          :current-page="sendQuery.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="sendQuery.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
        </div>
      </div>
      <div style="display:flex;justify-content:center;margin-top:20px;">
        <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="infoFlag=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="jijingFlag"
      :close-on-click-modal="false"
      :show-close="false"
      top='8vh'
      width="70%">
      <h1 style="text-align:center;">数据不一致列表</h1>
      <div class="posfoot">
        <el-table
          :data="jijingData"
          v-loading='dataLoading'
          @sort-change='orderchange'
          style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="60">
          </el-table-column>
          <el-table-column prop="data_from" label="类型" align="center" sortable="custom" width="100">
          </el-table-column>
          <el-table-column prop="gmjj_type" label="子类型" align="center" sortable="custom" width="100">
          </el-table-column>
          <el-table-column prop="no_updated_code" label="产品代码" align="center" sortable="custom" width="120">
          </el-table-column>
          <el-table-column prop="no_updated_name" label="产品名称" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="ypc_update_time" label="优品城更新时间" align="center" sortable="custom" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.ypc_update_time">
                <div>
                  {{scope.row.ypc_update_time.substr(0,10)}}
                </div>
                <div>
                  {{scope.row.ypc_update_time.substr(10)}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="ypc_new_worth" label="优品城最近净值" align="center" sortable="custom" width="150">
          </el-table-column>
          <el-table-column prop="tt_update_time" label="天天更新时间" align="center" sortable="custom" width="140">
            <template slot-scope="scope">
              <div v-if="scope.row.tt_update_time">
                <div>
                  {{scope.row.tt_update_time.substr(0,10)}}
                </div>
                <div>
                  {{scope.row.tt_update_time.substr(10)}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="tt_new_worth" label="天天最近净值" align="center" sortable="custom" width="140">
          </el-table-column>
        </el-table>
        <div style="display:flex;justify-content:flex-end;padding:5px 0;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="sendQuery.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="sendQuery.pageSize"
          popper-class="posbottom"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
        </div>
      </div>
      <div style="display:flex;justify-content:center;margin-top:20px;">
        <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="jijingFlag=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="zixunFlag"
      :close-on-click-modal="false"
      :show-close="false"
      width="60%">
      <h1 style="text-align:center;">资讯更新及时性列表</h1>
      <div class="posfoot">
        <el-table
          :data="zxData"
          v-loading='dataLoading'
          @sort-change='orderchange'
          style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="60">
          </el-table-column>
          <el-table-column prop="news_type" label="资讯类别" align="center" sortable="custom" width="180">
          </el-table-column>
          
          <el-table-column prop="news_module" label="资讯频道" align="center" sortable="custom" width="180">
          </el-table-column>
          <el-table-column prop="test_time" label="验证时间" align="center" sortable="custom" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.test_time">{{scope.row.test_time.substr(0,19)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="result_time" label="资讯时间" align="center" sortable="custom">
          </el-table-column>
          <el-table-column prop="test_result" label="验证结果" align="center" sortable="custom" width="180">
          </el-table-column>
        </el-table>
        <div style="display:flex;justify-content:flex-end;padding:5px 0;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="sendQuery.page"
          popper-class="posbottom"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="sendQuery.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
        </div>
      </div>
      <div style="display:flex;justify-content:center;margin-top:20px;">
        <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="zixunFlag=false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- <el-button @click="zixunFlag=true">点击打开infoFlag</el-button> -->
  </div>
</template>

<script>
import {systemlogStatis} from '@/api/modules/all'
import {getjcdata, getinspectdata, getinspecttime, getstaticdata, getdefaultaddress, GMJJDataGet, sendmailsmtp, editstaticdata, isgmjjfinish, getbasicdatalist, getdatadetaildata, getzxdatadetaildata} from '@/api/xyzqPort/youlibao'
import echarts from 'echarts'
import html2canvas from 'html2canvas'
export default {
  data () {
    return {
      zixunFlag: false,
      infoFlag: false,
      jijingFlag: false,
      dataLoading: false,
      typename: '',
      casetype: '',
      zxname: '',
      total: 10,
      sendQuery: {
        page: 1,
        pageSize: 10,
        orderType: 'desc',
        orderFiled: ''
      },
      jijingData: [],
      zxData: [],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['code-block'],
            [{'header': 1}, {'header': 2}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            // [{'size': ['small', false, 'large', 'huge']}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'color': []}, {'background': []}],
            // [{'font': []}],
            [{'align': []}]
            // ['image']
          ]
        }
      },
      datanu: {},
      report: '',
      msg: '',
      static_report: '',
      static_reportup: '',
      dialogVisible: false,
      outerVisible: false,
      innerVisible: false,
      address_flag: 'ylb_report',
      form: {
        to_address: '',
        cc_address: '',
        mail_title: ''
      },
      mess: {
        title: '优理宝日报',
        caozuonum: 0,
        errnum: 0,
        aontrastnum1: 0,
        aontrastnum2: 0,
        atypismum1: 0,
        atypismum2: 0,
        inspectdate: '',
        sjyzx: 0,
        inspecttime: '0:00'
      },
      listQuery: {
        time: '',
        type: 0
      },
      imgUrl: '',
      gmjjStatus: '',
      urlHost: '',
      timearr: [],
      datearr: [],
      showcatchtime: ''
    }
  },
  created () {
    const date = new Date()
    this.listQuery.time = this.getTimeByDate(date)
    this.mess.inspectdate = this.getTimeByDate2(date)

    if (this.listQuery.type === 0) {
      this.getTimer()
    }
  },
  mounted () {
    this.getdata(0)
    let allObj = {
      url: this.$route.path,
      moduleName: '优理宝',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  activated () {
  },
  methods: {
    getjibenmodel () {
      var type = ''
      if (Number(this.listQuery.type) === 1) {
        type = 1
      }
      if (Number(this.listQuery.type) === 2) {
        type = 2
      }
      const row = {
        report_date: this.listQuery.time,
        report_flag: type,
        case_name: this.typename,
        page: this.sendQuery.page,
        pageSize: this.sendQuery.pageSize,
        orderFiled: this.sendQuery.orderFiled,
        orderType: this.sendQuery.orderType
      }
      this.tableData = []
      this.dataLoading = true
      getbasicdatalist(row).then(res => {
        // console.log(res)
        this.dataLoading = false
        this.total = res.data.total
        this.tableData = res.data.list
      })
    },
    getjijingmodel () {
      var type = ''
      if (Number(this.listQuery.type) === 1) {
        type = 1
      }
      if (Number(this.listQuery.type) === 2) {
        type = 2
      }
      const row = {
        report_date: this.listQuery.time,
        // report_flag: '1',
        case_sub_type: this.casetype,
        case_type: 'funds',
        page: this.sendQuery.page,
        pageSize: this.sendQuery.pageSize,
        orderFiled: this.sendQuery.orderFiled,
        orderType: this.sendQuery.orderType,
        report_flag: type
      }
      this.jijingData = []
      this.dataLoading = true
      getdatadetaildata(row).then(res => {
        // console.log(res)
        this.dataLoading = false

        this.total = res.data.total
        this.jijingData = res.data.list
      })
    },
    getzixunmodel () {
      var type = ''
      if (Number(this.listQuery.type) === 1) {
        type = 1
      }
      if (Number(this.listQuery.type) === 2) {
        type = 2
      }
      const row = {
        report_date: this.listQuery.time,
        case_type: this.zxname,
        page: this.sendQuery.page,
        pageSize: this.sendQuery.pageSize,
        orderFiled: this.sendQuery.orderFiled,
        orderType: this.sendQuery.orderType,
        report_flag: type
      }
      this.zxData = []
      this.dataLoading = true
      getzxdatadetaildata(row).then(res => {
        // console.log(res)
        this.dataLoading = false
        this.total = res.data.total
        this.zxData = res.data.list
      })
    },
    orderchange (column) {
      // console.log(column)
      this.sendQuery.page = 1
      this.sendQuery.pageSize = 10
      this.sendQuery.orderFiled = column.prop
      if (column.order === 'ascending') {
        this.sendQuery.orderType = 'asc'
      } else if (column.order === 'descending') {
        this.sendQuery.orderType = 'desc'
      }
      if (this.infoFlag === true) {
        this.getjibenmodel()
      }
      if (this.jijingFlag === true) {
        this.getjijingmodel()
      }
      if (this.zixunFlag === true) {
        this.getzixunmodel()
      }
    },
    handleSizeChange (val) {
      this.sendQuery.pageSize = val
      if (this.infoFlag === true) {
        this.getjibenmodel()
      }
      if (this.jijingFlag === true) {
        this.getjijingmodel()
      }
      if (this.zixunFlag === true) {
        this.getzixunmodel()
      }
    },
    handleCurrentChange (val) {
      this.sendQuery.page = val
      if (this.infoFlag === true) {
        this.getjibenmodel()
      }
      if (this.jijingFlag === true) {
        this.getjijingmodel()
      }
      if (this.zixunFlag === true) {
        this.getzixunmodel()
      }
    },
    getTimer () {
      let that = this
      var timer = setInterval(() => {
        if (that.gmjjStatus === '0' || that.gmjjStatus === '-1') {
          clearInterval(timer)
          // if (that.gmjjStatus === '0') {
          //   that.$message({ title: '成功', message: '采集成功', type: 'success', duration: 2000 })
          // } else {
          //   that.$message({ title: '失败', message: '采集失败', type: 'error', duration: 2000 })
          // }
        } else {
          that.getgmjjStatus()
        }
      }, 5000)
    },
    getgmjjStatus () {
      isgmjjfinish().then(response => {
        this.gmjjStatus = response.data.data
      })
    },
    editstaticdata () {
      this.static_report = this.static_reportup
      var list = this.static_report.split('rgb(0, 0, 0)')
      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          this.static_report = this.static_report.replace('style="color: rgb(0, 0, 0);"', 'style="color: #FFFFFF;"')
        }
      }
      this.dialogVisible = true
      var bean = {
        report_date: this.listQuery.time,
        static_report: this.static_report,
        report_flag: this.listQuery.type
      }
      editstaticdata(bean).then(response => {
        this.dialogVisible = false
        this.$message({ title: '成功', message: response.data.msg, type: 'success', duration: 2000 })
        this.static_report = this.static_report.replace('style="color: rgb(229, 51, 51);"', 'style="color: #FF9900;"')
      })
    },
    opendialog () {
      this.static_reportup = this.static_report
      this.static_reportup = this.static_reportup.replace(/#FFFFFF;/g, 'rgb(0, 0, 0);')
      // var list = this.static_reportup.split('#FFFFFF')
      // if (list.length > 0) {
      //   for (let i = 0; i < list.length; i++) {
      //     this.static_reportup = this.static_reportup.replace('style="color: #FFFFFF;"', 'style="color: rgb(0, 0, 0);"')
      //   }
      // }
      this.dialogVisible = true
    },
    openNew () {
      window.open(this.urlHost)
    },
    open () {
      this.form.mail_title = this.mess.title + '(' + this.mess.inspectdate + ')'
      this.outerVisible = true
      getdefaultaddress(this.address_flag).then(response => {
        this.urlHost = 'http://' + window.location.host + '/port/#/youlibao'
        html2canvas(this.$refs.imageDom).then(canvas => {
          // 转成图片，生成图片地址
          var url = canvas.toDataURL('image/png')
          this.imgUrl = url
        })
        var obj = {}
        obj = response.data.data
        // console.log(response.data.data)
        this.form.to_address = obj.to_address
        this.form.cc_address = obj.cc_address
      })
    },
    sendmailsmtp () {
      this.innerVisible = true
      // var str = '<h3> 以下为优理宝晨报。详细数据请到平台查询：<a href="http://192.25.97.251:8000/center_api/index/login/logintrans?user_name=xyzq&user_pwd=75f2f182d7a3100004160532498af3af&page=ylb_morning_report">优理宝晨报(点击打开)</a></h3><img  src="' + this.imgUrl + '" />'
      var str = this.imgUrl
      // str = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAA8CAYAAAAjW/WRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MGY0MmY5My1kMWIxLWRiNGEtOTBiNS00N2FiNmQ1MWE1OWEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTE4QjdEOEMzRUNEMTFFNzg2QUFEREM3NUZGNUZGQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTE4QjdEOEIzRUNEMTFFNzg2QUFEREM3NUZGNUZGQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjRiYTY4ZDAtYjg2ZS1kNjQzLTg2ZDYtMTNmM2I5NGI3ZjNhIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NTQ3YjVhNDktODFkMi0xMWU1LWIyZTEtZWFiMDg1NjU2NGQzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+v3l0vAAAFhFJREFUeNrsXQt4FFWWPtXdeYeEbpIQCAFsXsKigImIKKKA8PnhjKySOA6yg+IGUUZB9jNhdH3Mw4VZZWVWVxLXGXXVUWAYYdbBR1gFBR8kCogjDI/wJjySzrvT6dfe030q3FxudVd3uhG0zvedj3T1rapb957/nP+ce6tR/H4/GGKIIXIxGUNgiCEGQAwxxACIIYYYADHEEAMghhhyYYhFb8PBd6+9IDq8vz4fHhj3Jqz4yXKAJgBfhEU4RWFqBXhi7T3w5MZ7YVDWofj19fRAePZHv4UHb34LfKfjcotcpleDD2aZesBr4IR17+8d609JcLHn1D8wbjYmyf4+cNRxJ7j9XjArnu+10d8+e27sAWLIBSF9mF7JdALTa5heAX5IMiWzv5KgZM7rj/pf2XInpGae1A0Qhg1oabTAj0e3wcNXH4JjzX52SYNYXNQA8Qem9QchGCHGMR1PgEBwJIgGDjYYUL5+Rv0rW2bn5/fZ7TYp/toIBhM6fGaw92wCj8/LPho+80IFSCL3NxqBm2lHl4QJvaLPAk3tadBdjChwQS6QpjKdxPT6AHUCKAjEBi3xsefIhiUn9tsOL3rvIbD1OrQl2eL+jc+vlOu9YUuHAoN6euDKPCc0uozIcb4AgtfNYZrB1My0lelJpk6N9h8yHRH0Z50ykukZvpHLa4G0pGaYNmRr0D7kNp7NdAnT/kx3MP11l+v6glDskdTG/jbHd3RZf7NSG4Mm7pOWRJAcFRIYrqNokaW7wpIER9l1l967rgycrrS7+/eszff4zJdFko8hKMb3c0FeDy/UtpgNRMQRIEgBphMdGEqGyl+/juk+ptuYPskZfxZ5TF4OiuAIJJPeBMhIboapgz4H0AbHdqZ96fNtTAcyndvpcdPZvywH/ezISEhMao3r4CYwEH5yaBTM8rwLpkx2+wZyF8Hx+R3TMeRIIo+AvsDIzXztr1Nh/Y6b0wb1/Vu5Jwj4qXqv4WPXSDT7YXRuR2A8/QA/HPKq1wnF4Br/yJRZLHxCnnsiJZMi+HoxvYrpAvKnqoyRXPNPUv6R0A4nGvrAn3czPKUJVwnKPRw4VJkZ9ObsYTGeMUN9ctVcWL3rRuiXWRvXwe1vOwYrv7gVfvbcY8HB7hXsBxOEyrRowYGWrFhhxZmDGZ8vfG8xZPY8/rZJ6RzvIRSJwkYPR7sJ+vXwwMjsjsDfBjhiCxDMGf7MFOu/YyM4byXTeu7zKEmbr7UqLpmpDbBs8xzw1ipg6s0eICFANYKqwGlJZNkaAIctCKi7/utf4YmNCwLgMCv+uA/uJbbj8Oq2YrhhxfPgciYE+sz6cUrLCUikVszFFDN7zmRYWLZhAdQ19rk9N71uCss7+CaZ4SpXGD0QFBP6uyA71QvtXgMesQRIFvH7GRrfY4L9LdMtFF0OcN+9JbSdIDl/h4bjhN496mBfXT4Uvf4UNDmCybqnXQGfi33ZE142WeGNAGgYfE3p8DHTfzblBsExvfwZePmT2TAw6yDgWoHPH9+kFI3WbPLCkLxv4aN918K45S/BmdMZKkg2aqfe8AXTFRSNHxVzKCUHZlduKYSXqmZa8nNqXvT4ugTrt5m+FwoceLHDjRaYcokTZg5vhTqnkXtojpfe7e7cQiGy+J3oHCXNMHt+nulHTI8L39mZXs70HQKQKqcod1ClkQDo0aw+Mc9/tLE3DLcdhB4ZbeDtMEG7JxEm27fB7LEbYHivGqvfo7A2OY4Al0hh3G/tfHhz+wwY3OfvxLfPn8fEOyFQ9tQOBrutBj5dOBdy+jQM9dXCHnJRVURRPyFwHOFO34vDr3oIlsusb21KumXY02uYYWf+gSXmc7xniw1NRGWlY8ciLLgZwA46LDA2zwVPTmwIHK9nkcT8Awog8V4ofF8DHIuZLg9x3gEhkqh8OVs4toub4B5MRwNW+oO8/TNm2C6cy34Zp+Bgcx9ws8lWTP5ANKg+clnSK9undwzJPurw+RQ41piNxNqHVzvdbg2CAxeNQVHzUROBVQVsBoEYjayZCgrNUYwRjk8e9ZulwdDMEujTw3L3Ht1zcnDdtb97ET5cMH9vXtaZm30OFmlN54yLKn/oBAd22AQtjFrNWvLH++DYmYGThuV9O8fTtRI3SwscKB4Gjja3Aj8e1gYlVzQHAHPGqRscY4kOD6RxwgrHYabfMN2kcU4eMYThNM8YHQ+RI/g0zP2wspdEAc9Cc9FE382g/vSk4s9fJdfDKuhkKojgfb9i+vt4R5AipqskX89jWhGFIWECvVrjWk8zvYuMTJUTTB+UnINyuUnxV7Z2JEOzKxUDh8KSeiwfF+MTpic6MfrcxsCxEs4WbDBlziWgPMv0TqZWofL2KOVN4eQfmN5LVaShGm2cCWbPnt3HLn2hsP+XFduW3BUwZ1+TlOwWUGTppFamvjCjunrousIX3oR+tqNNyWZ3D272/o8MQlPOtJlhdO8OeGpSPTSzqFvXxsARnmU+wPQ+psM0vsdo1184hkWapwiwCRrnfcb0bqLiovSm3EsMxAiaV3mnwckTVB1FeZEKNqJghXMsiyDueOUgT0mObYwSHEDeuouTo8rORopINsnAI0BHSK51FeP82Sy3yM5Jd2Rnpzmy0hKdDUwD4AgyFGUs0bds+hdp4CDygj8XwKFW3l6A4BqFlqA3fYki34IQ4EBJcXstowfl7h1SdexyWPLW/MDSoClVWpF7m0++WC61mfnPdfe9Uwomi2t5qsXVQ3Bts8MNttePjsIHThZFGtvDguMKygVXhAAH0PdiVRND9ZwQ4ACqtH1F0QUkdJyXneQst2qAQwXI1RRN7tFog2zk8Xgl6WM1OndvN+jgGImX+BUEV5NDyUMaDy9KZZiBV2jQLw1zv0dCTPLfyBPqH3QF1g7odQSWbpoHcyt+EYx4yV2aPIMski/JMhgWP/6XufDF/nHDB/c6ssjbtcCwQJLzaeQgSkBNoWnVDUyrJQ6Mr5fwVUlVbqWqZrrQHulxjeQ6SUTZxSqBCMh+OukRzuVNYdr8JF4AkVWskALsiyFA1IFCnlrKdBFIFgw1PJoMIF9KaJB4Tg4VBtADLdQwtEEalOpT4tm87CaDvYb4d4NIs1ik255kcUNSSjP8Zc914OsI5BeqjOjiALBqlQULv95hP/nLTSWQm31wrVB9UwsjsZLhRNdEOcr0X2jOBtC/kykXUfstK10/RnkLOidcRD4pMX7RyYoMQWUS6ygPGiqZW17m0pzJnHePSAYjkiRdtl7RnT3w/SXGBQQ43C7RTp9bJRRO5JAJdI44oTx4rRr0p5GM/Rh9/poonkj9RNmgQTenCMfSJUUIJ6Z+LmcG/PqmpyGzXxsEthcGvfofu1CrFGYIbljx4AbGOP2mJzKTWi8VEvOfRjLoTg/LxEKnnW9qOEKkmU4h9+DlRcl5zxIjUOVTyunEttMFkA/X6APvpJ/TiCqTOYCXk9PjGUJERZdIIsgQybH93QDIaI3jUzlwyCZCTdZFryd6ho8lAJcV/G/mwAEaEfGU8BnzlXwJsEVw3CpxQl8Fsn8GjoE5B2DWqHcBWpjtK53U8XKe/7Es6PaXP7wJPtwzIX9Q9qHHBXAspWgrCjqDHxE1TFFpmtsLkJvmhWSLX5LyBOQ6Ca3CEsJE0N5Hp47/eInjWSRp+7nkWLakAiVKkfA5UdJmtST6ucLYTswiiGxbhDOG9Er1njWSSCPKXklCCTJDDHO/D6nkyMsAjRJ1Z6LN9N8kbW7R+YzbTIoP6htyoWTySkjLc4H/ZAAN+ZR7nKVW2fBUze7cffPf+QX0yqxdbeqay2MEW8IB4koycDTUQs5hfMR0SweLgZnJPpg40BlI1nGjpyQNkSW3+KxtYebyDsmxVzXaynYne4XS8EDhe1z4PKiDZv9SEr1Fx/73eAGkQ3LMFmOAvKBRTZGV68JFo+067ifj7hPDgA09c5rw/WZK1s+prEmOVbe6kyGrZy3cPWZ9YFT9QW/YpXRtSmKR0wuP3L/uYWhvT7t7QM8TV3HRw0l8/AGiHYUhuPVUBoQtjnYzFPZxwRCrB/BvRbsQo11N05ZCybEPNNrKaO6xMPNUroOBHCL6ygvS7tQweWnMKNZhnYl7tCXeBgkt0sp9duqYoJ1hwjYC/l3JeVdKjvFbX66RfP+OhvMRt9Eg//3mTKsVrh2wHYbkHwseUQJVo6v46MFIx4w1H18PG3ZN62XPqXlJoFYWqh6toIpTqMRzCqYcHcxHX5bTAWkJPvD6ND17rsSzH9cxl70lx2o02srWar4OQ6+2SqqPo3RQN1kusyteAKnWAIg9CnAgXbskjMdXJ22khEPylCdT4qn3CdWSNEll5GuuAhMKuF4BbHadxoCLZMnCsW8CwFRYDoAG7+lMzHfz4DBZYWXb8cQvF72/GNIzTr0h2VSZoHeg2eXHt7mVSzKTfDCSAQQXCFk+gg5lmgCIBMl1TRpcXw8TaddoWyw59loIgByRVL6GSdiLzPCvFj774gmQ1zWOYyjto2+uOmW8jpxBDZHpOqiTJcy1Rku4rwyQ/ST8F1d6+d3HGZLzUiXHlkmOBfhvotkDDa508Hd0zsAhommgJIKDPc38+9c+DEfr8m/Jyzg9Vdipq1cwb/iEQWv5qVazd9Il7TDY6klpcpkwam6j6InAvo2rFtZL5myxjnudlBy7VnLsfyTzuUYojIwOwwS0aPcOHX1AR1QXL4Bs1jAqOxnRE8RhrWSMmYR0rD7cL9zrBp0AGRNlbiFeS+/99CT7sqjzcyE6fqpBOwKJZoLigZaOFHB6EvlR2UyJ+az/3TIeXv78DmVgds1rXv1vPXpojpZSnjTArMCEo02WxeP6uQ7fM6YZo8cKlpxP485JpsIIFh78EiqDUgbBbT8YpbEcfj0EV6Nv49rIqCoWHCZR5bA35Zd3StrdJ4zdcB0A0ZNzWiUJ+s5IvUykmxXvAPnemUwatMfJgFrJq6Zzoe35MDxzpw66I/JVvW2u0MlF9VwLJ0JcrS2g/mPb6XD2fQwHdN2+EthfZDF7oRUB4k6CVFOHOkIHTZmwxX8GNuBLUMnpdb9PMHvSw2zJx8LAFtJKPtnFlfI6pwmyUr1wf2FTAIctbmWmZGNiApVZMcf8rQYFWiyJJLgxVV0Y/G+m/y44QaRAG6lPNgKhKLgX77TALEwSWgph8skaSY48As4t6++KFCCR7sXaTcYR6l3VNPIEfCh1c4mkSZJgNWpUgUbp8BSjdHj9yyTedkeUnklr4yLe46ccOO6VhPPA52SLC4415cDx5qwAfPBnexg4VrMRmrDo7YWwv3bwJNzGLgEHTjDu+/oZVYPQo5cwfUWoBAXWPHBBcH5BEwzI9MCJVjPu2pWl5w1wdmMg5pmP6bQFvjTbRI5BJnkScDQQEP+ko0CyU0L7xJxTtjO4QKcTjilA1HA6grijXkHK1ZerAvWSlPnE1XEbyF+m2i3kDCLFcgnGgiFb3ENWD+duAUkQaIMW2A5rtOPBh6XiNyT3DfjvJLMbWlyp8NznxdBSlwItrSnQ6k5p+s+1M/0rtv7TkP7ZNRt9PpPqPXEXwRwCBIIQ1ypwjWFvqAHHtwXxXfOr+7ngRItZ3dL+iEYxgS/h/4po8TchLo/t90jsAo1yU4jzcNyfI+ot25E9QTKW30qih01HPjlBh7OLOcXijaSIOjudjB5zkZ50TRcZ4FF6wE1cCPQS7/VyIJVt28CIs4qbPBN5AL8QrcQ2YrkPqzBvcQA0qQmxJPK9AWfX4kzUf9lesLWUAD5EXi+dyqGbiHrsJ/7LP6eiTja+rGXvdQTW7Z4Inz1zGb5CG/D2NfV9oa/t+MDkBPcjXp9pDUS4qNXFvbPEPsUSfKsR340hKSdgYd9bmK4H+c6BNaQTCJS9adzPUPsdIF+R/pJylEIal3wax9MU/bZC6K0eCykvUl9HaIRzt/mcoH7x4yqjTgj0/+Cu5Qb5rozQlSXjP9AxxJDYUixDDDEAYoghhhgAMcQQAyCGGGIAxBBD4iDGb91/z2XevHldPpeXlxuDcj4BUlhYGOs+4WISLo6VRXgevpJZGeI89Wd0ov2JogtSqqqqvtP7x2H+I35+1gc9O8odrK3jvFAs1qEpTOsvUpuy/kCdoT/MnNpxTplaJd+VMg2HxCI4dzcwL7iJUvYSVSn1Ta+WCn3DrTb7dejS85mDFFyEBoL7jHBFdZlBHKSeGN+xQQ9bEuNLqwaMNiPbCLmM5oVXNSzZJN/J5g/7PiiERs0YIgYIeRJEo5X97Re8hjoYKtpXSTx2aSiPoENK6Z5+okxieF3FXbtciBx+OPvyfxF95vu8XwC/nbyeer0PNO7Da0EU/Q43JlWcB/Zz/S7A+cB5YLqfaXcdVwVE9wKc1vNW0TgjMG4kAMaLFXwQQovOG0CYpykkno+cToGzG8dKyCBVj2DjOt6ZI1K7Qs5TlID8nWOtQS+lPEKhfwsEgFZy35Xo8IhFXH8c0PWnVfHc1fTdILqXarzFnFezkRdbBvI3L0P1W++YlJIBq160nLSY5uEAyH8WVo/TqydnhyAsIcCJdKmAjquqdS87OQIrB4zqOAdAB42JlkZ9/1hWsdQJrOA6XUZeZApNYAkZRzVHeyo44wkldprAMji7E7RaePhq7v7qdcN5xGWcZ6sgo7NTf8uEMF5JzyKGedWYyyLstz2CMankzle/X03UCOi7cswhIk1GWXubAJj9kmesJucYTg5A937MI9oIUhCPvNMUww7aJUitJuMr4B5A/DnQSh0PyOc9q8PkGaJnCQeQaqE9P6CqcVdx9Mwq4dhFIQAeqt+RjImsnxDmmN4IUkKgUCtC1jDjLKO0qzgaG05XwUUiF+M6iOM8eiW1dKx6+FUC4Kxc5Ky8QPodjSAYlmJ1knd0RLt4IKmfHVzUKeaoajkXPUop2t54nmyiOgz7+E4B4qDQapd4SCt1/gB3jP9Vkik6HpD3oFMi8G7drb5YCRwOjVCtlg7nRdnv6m6OSawqWA5m/NXUD7Gfhez7ag4kRTpzxmV0raUQ+ZpWNM6sNMz3B84nxXJQFatAqICUckmxlQankvSA6qk46lBA7ZeFSKD9nAGJ5xfFoSzJc2nVWHmPCMK9y7rR72jGJF5SSf0qYICI1UJqMT3PBxD79Sc1f7PrTNLtRCUjiiaWKD1OBXmSKuqcjUt2l3IepkLwrsUcpxerD3oHvJw7vxLktfVY0Y4Kji+vJrUL0WOVpI+R9Lu7YxJzp0AVrMpuXEfNyyqIYqkl7mV07EAM+logRA09ywWlHNvRJcYbhd9z4fZiBV49le3FIkDwFcEKMiStlfHOHITbaqJSLytXcauQUNIiLq8LZfxV5HgdYZw10Oo/XncK+1xM/bKS88J7VUSzzeRiTdINiU6UEEZmk4DGGmEOoib3ZSFypzKBknb9b+bOFS2AFtI9plBhQaXZq5FCUelbzX3xu1LKsRAoEeWvRgQxpFvyHW9WVCl+yChBoA4UXXSu5RgAMeR7ARBrtNTJAIghhsRAjDcKDTHEAIghhhgAMcQQAyCGGHI+5f8FGAB0DgwSgcFerwAAAABJRU5ErkJggg=="
      // str = ''
      var bean = {
        to_address: this.form.to_address,
        img_url: str,
        mail_title: this.form.mail_title,
        cc_address: this.form.cc_address
      }
      sendmailsmtp(bean).then(response => {
        // var flag = false
        // flag = response.data
        // if (flag === true) {
        //   this.msg = '发送成功'
        // } else {
        //   this.msg = '邮件发送失败，请重新发送或者联系管理员。'
        // }
        // console.log(response)
        if (response.data.result === 'success') {
          this.$message({message: '邮件发送成功', type: 'success'})
        } else {
          this.$message({message: '邮件发送失败，请重新发送或者联系管理员', type: 'error'})
        }
      })
    },
    GMJJDataGet () {
      GMJJDataGet().then(response => {
        this.GMJJData = response.data.result
        this.gmjjStatus = '1'
        this.getTimer()
      })
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    getTimeByDate2 (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const time = `${YY}年${MM}月${DD}日`
      return time
    },
    getTimeByDate3 (str) {
      var arr = str.split('-')
      const time = `${arr[0]}年${arr[1]}月${arr[2]}日`
      return time
    },
    changelab (val) {
      // console.log(val)
      this.getdata(val)
      if (this.listQuery.type === 0) {
        this.getTimer()
      }
    },
    changedate () {
      this.datearr = []
      this.showcatchtime = ''
      this.mess.errnum = 0
      this.mess.caozuonum = 0
      this.getdata()
    },
 // 调接口请求数据
    getdata () {
      this.mess = {
        title: '优理宝日报',
        caozuonum: 0,
        errnum: 0,
        aontrastnum1: 0,
        aontrastnum2: 0,
        atypismum1: 0,
        atypismum2: 0,
        inspectdate: this.getTimeByDate3(this.listQuery.time),
        sjyzx: 0,
        inspecttime: '0:00'
      }
      this.showcatchtime = ''
      this.timearr = []
      // console.log(YY, MM, DD, time)
      // 基本操作的数据
      if (this.listQuery.type === 0) {
        this.mess.title = '优理宝日报'
      } else if (this.listQuery.type === 1) {
        this.mess.title = '优理宝晨报'
      } else {
        this.mess.title = '优理宝午报'
      }
      var bean = {
        report_date: this.listQuery.time,
        report_flag: this.listQuery.type
      }
      var obj = {}
      // this.echartsinpectdata('ecinpectdata', obj)
      // this.echartsinpecttime('ecinpecttime', obj)
      // this.echartsjc('ecjc', obj)
      getjcdata(bean).then(response => {
        this.mess.caozuonum = response.data.data.total_num
        this.mess.errnum = response.data.data.error_num
        this.echartsjc('ecjc', response.data.data)
      })
      getinspectdata(bean).then(response => {
        // console.log(response)
        if (Number(response.data.code) === 0) {
          this.echartsinpectdata('ecinpectdata', response.data.data)
          this.mess.aontrastnum1 = response.data.data.total_num
          this.mess.atypismum1 = response.data.data.error_num
          this.mess.inspecttime = response.data.data.report_time
          this.timearr.push(response.data.data.report_time)
        } else if (Number(response.data.code) === 101) {
          this.showcatchtime = this.timearr[0]
        }
      })
      getinspecttime(bean).then(res => {
        if (Number(res.data.code) === 0) {
          this.echartsinpecttime('ecinpecttime', res.data.data)
          this.mess.aontrastnum2 = res.data.data.total_num
          this.mess.atypismum2 = res.data.data.error_num
          this.mess.inspecttime = res.data.data.report_time
          this.timearr.push(res.data.data.report_time)
        } else if (Number(res.data.code) === 101) {
          this.showcatchtime = this.timearr[0]
        }
        getstaticdata(bean).then(res => {
          // console.log(this.timearr)
          if (this.timearr.length === 2) {
            if (this.timearr[0] > this.timearr[1]) {
              this.static_report = '<p><span style="color: #FFFFFF;">优理宝' + this.mess.inspectdate + '早盘检查。（检查时间点：' + this.timearr[0] + '）</span><br/><span style="color: #FFFFFF;"> 基本功能操作：实机操作' + this.mess.caozuonum + '条，</span><strong style="color: #FF9900;">其中失败' + this.mess.errnum + '条。</strong><br/><span style="color: #FFFFFF;"> 数据一致性检查： 共对比数据' + (this.mess.aontrastnum1 + this.mess.aontrastnum2) + '条，</span><strong style="color: #FF9900;">其中不一致' + (this.mess.atypismum1 + this.mess.atypismum2) + '条。</strong><br/></p>'
              this.showcatchtime = this.timearr[0]
            } else {
              this.static_report = '<p><span style="color: #FFFFFF;">优理宝' + this.mess.inspectdate + '早盘检查。（检查时间点：' + this.timearr[1] + '）</span><br/><span style="color: #FFFFFF;"> 基本功能操作：实机操作' + this.mess.caozuonum + '条，</span><strong style="color: #FF9900;">其中失败' + this.mess.errnum + '条。</strong><br/><span style="color: #FFFFFF;"> 数据一致性检查： 共对比数据' + (this.mess.aontrastnum1 + this.mess.aontrastnum2) + '条，</span><strong style="color: #FF9900;">其中不一致' + (this.mess.atypismum1 + this.mess.atypismum2) + '条。</strong><br/></p>'
              this.showcatchtime = this.timearr[1]
            }
          } else if (this.timearr.length !== 2) {
            this.showcatchtime = this.timearr[0]
            this.static_report = '<p><span style="color: #FFFFFF;">优理宝' + this.mess.inspectdate + '早盘检查。（检查时间点：' + this.timearr[0] + '）</span><br/><span style="color: #FFFFFF;"> 基本功能操作：实机操作' + this.mess.caozuonum + '条，</span><strong style="color: #FF9900;">其中失败' + this.mess.errnum + '条。</strong><br/><span style="color: #FFFFFF;"> 数据一致性检查： 共对比数据' + (this.mess.aontrastnum1 + this.mess.aontrastnum2) + '条，</span><strong style="color: #FF9900;">其中不一致' + (this.mess.atypismum1 + this.mess.atypismum2) + '条。</strong><br/></p>'
          }
          var sj = ((this.mess.aontrastnum1 + this.mess.aontrastnum2) - (this.mess.atypismum1 + this.mess.atypismum2)) / (this.mess.aontrastnum1 + this.mess.aontrastnum2)
          if (Number.isNaN(sj)) {
            this.mess.sjyzx = 0
          } else {
            this.mess.sjyzx = (sj * 100).toFixed(2)
          }
          // debugger
          if (res.data.data !== null) {
            this.static_report = '<p>' + res.data.data.static_report + '</p>'
            this.static_report = this.static_report.replace(/font-size:18px;/g, 'font-size:18px;color: #FFFFFF;')
            this.static_report = this.static_report.replace(/#E53333;/g, '#FF9900;')
          }
          let index = this.static_report.lastIndexOf('。')
          if (index > 0) {
            var a1 = this.static_report.substring(0, index)
            var a2 = this.static_report.substring(index + 1)
            this.static_report = a1 + '<span style="color: #FFFFFF;">。</span>' + a2
          }
        })
      })
    },
    // 优理宝页面基本操作的echarts数据渲染
    echartsjc (id, youdata) {
      // console.log(youdata)
      if (youdata.legend_list === null) {
        youdata.legend_list = ['首页', '自选与行情', '公募基金', '理财（优品城）', '资讯', '交易', '登录与激活']
      }
      var myChart = echarts.init(document.getElementById(id))
      myChart.off('click')
      myChart.getZr().on('click', (params) => {
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          var checkname = op.xAxis[0].data[xIndex]
          this.typename = ''
          if (youdata.legend_list.length > 0) {
            this.typename = checkname
            this.getjibenmodel()
            this.infoFlag = true
            // console.log(checkname)
          }
        }
      })
      myChart.setOption({
        title: {
          text: youdata.report_time,
          x: 'center'
        },
        legend: {
          data: ['失败数', '通过数'],
          x: 'center',
          y: '25px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: youdata.legend_list,
            // data: ['首页', '自选与行情', '公募基金', '理财（优品城）', '资讯', '交易', '登录与激活'],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
            //   rotate: 18
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
            // max: 20,
            // splitNumber: 5
          }
        ],
        series: [
          {
            name: '失败数',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#f48182',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 50,
            data: youdata.error_num_list
            // data: [0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: '通过数',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 50,
            data: youdata.success_num_list
            // data: [8, 5, 4, 2, 2, 1, 1]
          }
        ]
      }, true)
    },
    // 优理宝页面数据一致 的echarts渲染
    echartsinpectdata (id, youdata) {
      var myChart = echarts.init(document.getElementById(id))
      if (youdata.legend_list.length === 0) {
        youdata.legend_list = ['股票型', '混合型', '债券型', '指数型', 'qdii', '货币型']
      }
      myChart.off('click')
      myChart.getZr().on('click', (params) => {
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          var checkname = op.xAxis[0].data[xIndex]
          this.casetype = ''
          if (youdata.legend_list.length > 0) {
            this.casetype = checkname
            this.getjijingmodel()
            this.jijingFlag = true
            // console.log(checkname)
          }
        }
      })
      myChart.setOption({
        title: {
          text: youdata.report_time,
          x: 'center'
        },
        legend: {
          data: ['失败数', '成功数'],
          x: 'center',
          y: '25px'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: youdata.legend_list,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
            //   rotate: 18
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '失败数',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#f48182',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 25,
            data: youdata.error_num_list
            // data: [0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: '成功数',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 25,
            data: youdata.success_num_list
            // data: ['121', '1408', '230', '296', '106', '170']
          }
        ]
      }, true)
    },
    // 优理宝页面的咨询echarts渲染
    echartsinpecttime (id, youdata) {
      // console.log(youdata)
      if (youdata.legend_list == null) {
        youdata.legend_list = ['资讯', '数据']
      }
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        title: {
          text: youdata.report_time,
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        legend: {
          x: 'center',
          y: '25px',
          data: ['失败数', '成功数']
        },
        yAxis: [
          {
            type: 'category',
            data: youdata.legend_list,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
            //   rotate: 18
            }
          }
        ],
        xAxis: [
          {
            type: 'value',
            max: 10,
            splitNumber: 10
          }
        ],
        series: [
          {
            name: '失败数',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#f48182',
                label: {
                  show: true,
                  position: 'right'
                }
              }
            },
            barMaxWidth: 25,
            data: youdata.error_num_list
          },
          {
            name: '成功数',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD',
                label: {
                  show: true,
                  position: 'right'
                }
              }
            },
            barMaxWidth: 25,
            data: youdata.success_num_list
          }
        ]
      }, true)
      myChart.getZr().on('click', (params) => {
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[1]
          var op = myChart.getOption()
          var checkname = op.yAxis[0].data[xIndex]
          this.zxname = ''
          if (youdata.legend_list.length > 0) {
            console.log(checkname)
            this.zxname = checkname
            this.getzixunmodel()
            this.zixunFlag = true
          }
        }
      })
    }
  }
}
</script>

<style >
.ql-editor{
  height:200px;
}
.youlibao {
  width: 80%;
  height: 1000px;
  margin: auto;
  /* margin-top: 44px; */
}
.el-input__inner {
    height: 36px !important;
}
.youheader{
    width: 100%;
    height: 38px;
    background-color: #fff;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}
.youchoose{
    flex: 1;
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    margin-left: 30px;
}
.el-radio-group{
  margin-top: 10px;
    /* line-height: 38px; */
}
.restmail{
  font-size: 14px;
  background-color: #4b78cd;
}
.restmail:hover{
  background-color: #4b78cd;
}
.sendmail{
    width: 81px;
    height: 32px;
    border: none;
    background-color: #4b78cd;
    color: #fff;
    border-radius: 5px;
    font-size: 14px;
    /* transition: 0.2s all; */
}
.sendmail:hover{
    /* background-color: rgba(0, 153, 255,.2); */
    /* color: #4b78cd; */
    background-color: #4b78cd;
    font-size: 18px;
    font-weight: 600;
}
.youmess{
    width: 100%;
    height: 237px;
    display: flex;
}
.youmess .youleft{
    width: 55%;
    margin-right: 15px;
    height: 100%;
    background-color: #4b78cd;
    border-radius: 5px;
}
.youmess .youright{
    flex: 1;
    height: 100%;
    border-radius: 5px;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
}
.youright .yourigheight{
    height:122px ;
    background-color: rgba(103, 194, 58, 1);;
    border-radius: 5px;
}
.youright .yourigfooter{
    height: 105px;
    display: flex;
    justify-content: space-between;
}
.boxa,
.boxb{
  width: 48.5%;
  height: 100%;
  border-radius: 5px;
}
.boxa{
    background-color: rgba(153, 102, 255, 1);
}
.boxb{
    background-color: rgba(0, 153, 255, 1);
}
.youleft h1{
    font-size: 36px;
    color: #fff;
    font-weight: 500;
    width: 100%;
    display: flex;
    justify-content: center;
}
.youleft p{
    margin: 5px 30px;
    padding: 0;
    font-size: 18px;
    color: #fff;
}
.youleft p span:nth-of-type(2){
    color: #f90;
}
.yourigheight{
    color: #fff;
    padding: 0 40px;
    box-sizing: border-box;
}
.yourigheight h2{
    font-size: 28px;
    font-weight: 400;
}
.yourigfooter span{
    display: block;
    margin:15px 20px;
    color: #fff;
    box-sizing: border-box;
}
.yourigfooter p{
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    font-size: 28px;
    color: #fff;
}
.youjc{
    margin-top: 15px;
    height: 304px;
    width: 100%;
    background-color: #fff;
}
#ecjc{
    /* width: 100%; */
    width: 1000px;
    height: 270px;
    /* background-color: red; */
}
.youinspect{
    margin-top: 15px;
    width: 100%;
    height: 365px;
    background-color: #fff;
    display: flex;
}
.inspecttime{
    flex: 1;
    /* background-color: red; */
}
.inspectdata{
    flex: 1;
    position: relative;
}
.obtain{
    width: 81px;
    height: 32px;
    border: none;
    background-color: #4b78cd;
    color: #fff;
    border-radius: 5px;
    position: absolute;
    right: 20px;
    z-index: 100;
}
.obtain:hover{
  background-color: rgba(0, 153, 255,.2);
  color: #4b78cd;
}
</style>

<style lang="scss">
.youlibao .el-dialog__header{
  padding: 0;
}
.el-dialog__body{
  padding: 20px 20px;
}
.posfoot .el-select{
  bottom: 2px;
}
.youlibao .el-table td{
  padding: 5px 0;
}
.youlibao .el-dialog{
  margin: 0 auto;
}
</style>
