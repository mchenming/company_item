<template>
  <div class="serveinfo" id="serveinfo">
    <div class="servercontainer">
      <!-- 左边的布局 -->
      <div class="serverleft">
        <!-- 左边头部布局 -->
        <div class="containerHeader">
          <b style="font-size: 20px;">
            <!-- <i class="el-icon-delete"></i> -->
            {{this.leftDataList.scan_task_name}}报告详情
          </b>
          <div >
            <el-button type="text" @click="$router.go(-1)">返回</el-button>
            <el-button type="text" @click="download">下载</el-button>
          </div>
        </div>
        <!-- 扫描结果和违规数量 -->
        <div class="scanning">
          <!-- 扫描结果和违规数量 -->
          <div class="scan">
            <span>扫描结果</span>
            <!-- <span v-if="!wiguiCont">未通过</span> -->
            <span v-if="Number(Allstatus)===2">待核查</span>
            <span v-else-if="Number(Allstatus)===0">通过</span>
            <span v-else-if="Number(Allstatus)===1">未通过</span>
          </div>
          <div class="Violation1">
              <span>违规数量</span>
              <span v-if="lastCount !== -1">{{wiguiResult.length}}</span>
              <span v-else>--</span>
              <!-- <span v-else>--</span> -->
          </div>
          <div class="Violation">
            <span>敏感词例外</span>
            <span>{{this.details.length}}</span>
          </div>
        </div>
        <!-- svn地址 -->
        <div class="svnAddress">
          <div class="address">
            <span>svn地址</span>
            <el-input v-model="this.leftDataList.repertory" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
          </div>
          <div class="version">
            <div class="vsid">
              <p>VersionID</p>
              <el-input v-model="this.leftDataList.revision"></el-input>
            </div>
            <div class="codenum">
              <p>代码行数</p>
              <el-input v-model="this.totalLineCount"></el-input>
            </div>
          </div>
          <div class="version">
            <div class="vsid">
              <p>代码提交时间</p>
              <el-input v-model="tjTime"></el-input>
            </div>
            <div class="codenum">
              <p>扫描时间</p>
              <el-input v-model="this.searchTime"></el-input>
            </div>
          </div>
          <div class="version">
            <div class="vsid">
              <p>核查人</p>
              <el-input v-if="checkAuthor!==''" v-model="checkAuthor"></el-input>
              <el-input v-else v-model="hcauthor"></el-input>
            </div>
            <div class="codenum">
              <p>耗时</p>
              <el-input v-model="downloadTime"></el-input>
            </div>
          </div>
        </div>
        <!-- log -->
        <div class="serverlog" >
          <!-- <i class="el-icon-edit"></i> -->
          <b style="font-size: 20px;">log</b>
         <div class="border">
          <div class="about" v-for="(value,index) in versionLogs" :key="index">
            <p >{{value}}</p>
            <p>{{str}}</p>
          </div >
        </div>
           </div>
            <div class="seninfo">
            <!-- <i class="el-icon-loading"></i> -->
            <b style="font-size: 20px;">扫描结果</b>
          </div>
          <el-radio-group v-model="Allstatus">
            <el-radio :label=0 :disabled='disFlagNum - 0===1'>扫描通过</el-radio>
            <el-radio :label=1 :disabled='disFlagNum - 0 ===0'>扫描未通过</el-radio>
          </el-radio-group>
          <el-button style="margin-left:20px;" @click="statuSubmit" :disabled="subisShow" :class="{hascolor : subisShow!==true}">提交</el-button>
          
        <div class="sensitive">
         <div class="seninfo">
            <!-- <i class="el-icon-loading"></i> -->
            <b style="font-size: 20px;">敏感词例外</b>
          </div>
          <el-table :data="details" border style="width: 100%" :show-header="false">
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="地址">
              <template scope="scope">
                文件:{{scope.row.a.file}}
                {{scope.row.a.endPos}}
                等级:{{scope.row.a.keywordLevel}}
                匹配规则:{{scope.row.a.keyword}}
                <el-button v-if="!scope.row.lineshow" @click="scope.row.lineshow = true" type="text" >详情</el-button>
                <el-button v-if="scope.row.lineshow" @click="scope.row.lineshow = false" type="text" >取消详情</el-button>
                <p style="padding:0;margin:0;" v-if="scope.row.a.desc">忽略原因：{{scope.row.a.desc}}</p>
                <p style="padding:0;margin:0;" v-else>忽略原因：{{addhlFrom.desc}}</p>

                <!-- {{scope.row.a.desc}} -->
                <div v-show="scope.row.lineshow">
                  <!-- <pre>{{scope.row.a.mess}}</pre> -->
                  <span v-html="scope.row.a.mess"></span>
                  <!-- <span v-html="scope.row.a.beforeLines"></span>
                  <span v-html="scope.row.a.lineStart"></span>
                  <span v-html="scope.row.a.lineRed"></span>
                  <span v-html="scope.row.a.line"></span>
                  <span v-html="scope.row.a.lineEnd"></span>
                  <span v-html="scope.row.a.afterLines"></span> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column label="姓名" width="100">
              <template scope="scope">
                <el-button type="text" @click="deleteHl(scope.row)">取消忽略</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="seninfo">
            <!-- <i class="el-icon-view"></i> -->
             <b style="font-size: 20px;">敏感词违规记录</b>
          </div>
          <el-table :data="wiguiResult" border style="width: 100%" :show-header="false">
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="地址">
              <template scope="scope">
                文件:{{scope.row.file}} {{scope.row.lineNumber}}行
                等级:{{scope.row.keywordLevel}}
                匹配规则:{{scope.row.keyword}}
                <el-button v-if="!scope.row.lineshow" @click="scope.row.lineshow = true" type="text" >详情</el-button>
                <el-button v-if="scope.row.lineshow" @click="scope.row.lineshow = false" type="text" >取消详情</el-button>
                <!-- <p style="padding:0;margin:0;">忽略原因：本地IP</p> -->
                <div v-show="scope.row.lineshow">
                  <!-- <span v-html="scope.row.mess"></span> -->
                  <!-- <span v-html="scope.row.mess" v-if="scope.row.mess.toLowerCase().includes(scope.row.keyword.toLowerCase()) === true"></span> -->
                  <span v-html="scope.row.mess"></span>
                  <!-- (scope.row.mess.toLowerCase().includes(scope.row.lineshow.toLowerCase()) === true) -->
                  <!-- <span v-html="scope.row.lineStart"></span>
                  <span v-html="scope.row.lineRed"></span>
                  <span v-html="scope.row.line"></span>
                  <span v-html="scope.row.lineEnd"></span>
                  <span v-html="scope.row.afterLines"></span> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column label="姓名" width="100">
              <template scope="scope">
                <el-button type="text" @click="addHl(scope.row)">忽略此项</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 左边的布局over -->

      <div class="serverright">
        <div class="seninfo">
          <span class="fa fa-clock-o" style="color:#000"></span>
          <span>历史记录</span>
        </div>
        <!-- <template> -->
          <el-table>
          <el-table-column width="55" prop="id" label="序号" align="center"></el-table-column>
          <el-table-column width="155" prop="id" label="扫描时间" align="center"></el-table-column>
          <el-table-column prop="id" label="结果" align="center"></el-table-column>

          </el-table>
        <el-table :data="tableData" style="width: 100%;margin-top:0;" :row-class-name="tableRowClassName" :row-style="selectedHighlight"  @row-click='ims' class='servertable' :show-header='false'>
          <el-table-column prop="id" label="序号" align="center" width="55">
            <template slot-scope="scope">
              {{scope.row.id}}
            </template>
          </el-table-column>
          <el-table-column prop="smtime" label="扫描时间" align="center" width="155">
            <template slot-scope="scope">
              {{scope.row.smtime}}
            </template>
          </el-table-column>
          <el-table-column label="结果" align="center">
            <template slot-scope="scope">
              <!-- {{scope.row.result}} -->
              <el-tag type="danger" v-if="Number(scope.row.result) === 2">待核查</el-tag>
              <el-tag type="success" v-else-if="Number(scope.row.result) === 0">通过</el-tag>
              <el-tag type="danger" v-else-if="Number(scope.row.result) === 1">未通过</el-tag>
              <!-- <span v-if="!isComplete(scope.row)">{{scope.row.desc}}</span>
              <span v-if="isComplete(scope.row)" style="font-size:12px;">扫描已完成，可查看报告</span> -->
              <!-- isComplete -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div  class="pagination-container;" style="background-color: white;" >
            <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageRow.pageNo"
            :pager-count="5" :page-sizes="[10,20,30, 50]" :page-size="pageRow.pageSize" layout="total, prev, pager, next" :total="total" small>
            </el-pagination>
        </div>
        <!-- </template> -->
      </div>
    </div>
    <el-dialog title="" :visible.sync="downloadJpg" fullscreen :show-close=false id="printpage" width="100%" ref="pagePrint" style="margin:0mm;height:100vh">
      <div id="scanDetail" style="width: 580px;margin: 0 auto;color:#000;font-size:14px">
        <div id="detail-base">
            <h3>{{leftDataList.scan_task_name}}扫描概况</h3>
            <table style="width: 100%;border-top: 1px solid #d1d9e0;border-left: 1px solid #d1d9e0;border-right: 1px solid #d1d9e0;border-bottom: 1px solid #d1d9e0;table-layout: fixed;" >
                <tr>
                    <td colspan="5" style="width: 20%;border-bottom: 1px solid #d1d9e0;padding: 20px;">
                        <div>svn地址</div>
                        <div style="word-break: break-all;">{{leftDataList.repertory}}</div>
                    </td>
                </tr>
                <tr>
                    <td style="width: 20%;border-right: 1px solid #d1d9e0;border-bottom: 1px solid #d1d9e0;padding: 20px;text-align:center">
                        <div>versionID</div>
                        <div>{{leftDataList.revision}}</div>
                    </td>
                    <td style="width: 20%;border-right: 1px solid #d1d9e0;border-bottom: 1px solid #d1d9e0;padding: 13px;text-align:center">
                        <div>代码提交时间</div>
                        <div>{{tjTime}}</div>
                    </td>
                    <td style="width: 20%;border-right: 1px solid #d1d9e0;border-bottom: 1px solid #d1d9e0;padding: 20px;text-align:center">
                        <div>代码行数</div>
                        <div>{{totalLineCount}}</div>
                    </td>
                    <td style="width: 20%;border-right: 1px solid #d1d9e0;border-bottom: 1px solid #d1d9e0;padding: 13px;text-align:center">
                        <div>发起扫描时间</div>
                        <div>{{searchTime}}</div>
                    </td>
                    <td style="width: 20%;border-bottom: 1px solid #d1d9e0;padding: 20px;text-align:center">
                        <div>耗时</div>
                        <div>{{downloadTime}}</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="5" style="width: 20%;">
                        <div>log</div>
                        <div class="about" v-for="(value,index) in versionLogs" :key="index" style="line-height: 15px;">
                          <p >{{value}}</p>
                          <p>{{str}}</p>
                        </div >
                    </td>
                </tr>
            </table>
            <h3>扫描结果</h3>
            <table style="width: 100%;border-top: 1px solid #d1d9e0;border-left: 1px solid #d1d9e0;border-right: 1px solid #d1d9e0;border-bottom: 1px solid #d1d9e0;margin-bottom: 30px;table-layout: fixed;">
                <tr>
                    <td style="width: 20%;border-right: 1px solid #d1d9e0;border-bottom: 1px solid #d1d9e0;padding: 20px;">
                        <div>敏感词</div>
                    </td >
                    <td style="width: 20%;border-bottom: 1px solid #d1d9e0;padding: 20px;">
                        <div>
                            <span>{{wiguiResult.length}}条</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="width: 20%;border-right: 1px solid #d1d9e0;border-bottom: 1px solid #d1d9e0;padding: 20px;">
                        <div>三方库安全</div>
                    </td>
                    <td style="width: 20%;border-bottom: 1px solid #d1d9e0;padding: 20px;">
                        <div ><span>0条</span></div>
                    </td>
                </tr>
                <tr>
                    <td style="width: 20%;border-right: 1px solid #d1d9e0;padding: 20px;">
                        <span>扫描结果：</span>
                        <el-radio-group v-model="Allstatus" id="printRadio" style="display:block">
                          <!-- <el-radio :label="2">待核查</el-radio> -->
                          <el-radio :label="0">通过</el-radio>
                          <el-radio :label="1">未通过</el-radio>
                        </el-radio-group>
                          <!-- <el-checkbox-group v-model="checkList">
                            <el-checkbox label="通过"></el-checkbox>
                            <el-checkbox label="未通过"></el-checkbox>
                          </el-checkbox-group> -->
                    </td>
                    <td style="width: 20%;border-right: 1px solid #d1d9e0;padding: 20px;">
                        <span>核查人：</span>
                        <span v-if="checkAuthor!==''">{{checkAuthor}}</span>
                        <span v-else>{{hcauthor}}</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    </el-dialog>
    <el-dialog title="忽略原因" :visible.sync="hlmessVisible1">
      <el-form :model="addhlFrom">
        <el-form-item label="忽略原因：" label-width="20%">
          <el-input style="width: 80%;" v-model="addhlFrom.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="display:flex;justify-content: center">
        <el-button @click="hlmessVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="subaddHl">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import {systemlogStatis} from '@/api/modules/all'
import {gettableDataList, getSensitiveOptions, getLogDetail, getLogDetailJson, setHl, addQxScanWords, getDetailList} from '@/api/xyzqPort/serverInfo'
import { getUUID } from '@/utils'

import API from '@/api'
export default {
  data () {
    return {
      disFlagNum: -1,
      subisShow: false,
      hcauthor: '',
      hlmessVisible1: false,
      hlmess: '',
      str: '',
      versionLogs: [],
      downStatus: '通过',
      total: 0,
      pageRow: {
        pageSize: 10,
        pageNo: 1
      },
      downloadJpg: false,
      lineshow: false,
      totalLineCount: 0,
      searchTime: '',
      downloadTime: '',
      totalSize: '',
      keyId: '',
      scantypeOptions: [
        {id: 0, text: '敏感词扫描'},
        {id: 1, text: '三方库安全扫描'}
      ],
      input: '',
      leftDataList: {},
      tableData: [],
      tableDatas: [],
      details: [],
      passStatus: '通过',
      newStatus: '通过',
      tjTime: '',
      wiguiResult: [],
      wiguiCont: 0,
      addhlkey: '',
      addhlFrom: {},
      getIndex: 0,
      checkList: [],
      lastCount: 0,
      Allstatus: 2,
      projectId: '',
      detailKey: '', // 扫描详情keyID
      checkAuthor: ''
    }
  },
  created () {
    this.keyId = this.$route.query.key
    // this.projectId = this.$route.query.id
    this.gettableDataList('yes')
    this.getOptionsDatas()
    this.getUserInfo()

    // this.getDataList()
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
    this.keyId = this.$route.query.key
    this.gettableDataList('yes')
    this.getOptionsDatas()
    this.getUserInfo()
  },
  watch: {
    passStatus: function (newval, oldval) {
      this.$set(this.checkList, 0, newval)
    }
  },
  methods: {
    getDataList () {
      getDetailList(this.keyId).then(res => {
        // console.log(res)
        this.tableData.forEach((item, index) => {
          this.tableData[index].result = res.data.data[index].result
        })
      })
    },
    statuSubmit () {
      // 提交状态
      this.disFlagNum = this.Allstatus
      this.subisShow = true
      var isnew = 1
      if (this.tableDatas[0].key === this.detailKey) {
        isnew = 0
      }
      const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const HH = (date.getHours()).toString().padStart(2, 0)
      const mm = (date.getMinutes()).toString().padStart(2, 0)
      const ss = (date.getSeconds()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD} ${HH}:${mm}:${ss}`
      const row = {
        keyId: this.keyId,      // 项目ID
        detailId: this.detailKey,          // 扫描详情id
        checkStatus: this.Allstatus,  // 手工判断状态
        scanTime: this.searchTime,    // 扫描时间
        checkTime: time,      // 核查时间
        checkAuthor: this.hcauthor,     // 核查人
        isNew: isnew
      }
      addQxScanWords(row).then(res => {
        // console.log(res)
        this.getDataList()
        // this.gettableDataList()
      })
    },
    isSelectedSensitive (execution) {
      return _.find(execution.type, function (type) { return type === 0 }) === 0
    },

    isSelectedSafe (execution) {
      return _.find(execution.type, function (type) { return type === 1 })
    },
    isComplete (execution) {
      var SCAN_ENUM = {
        limitExecutionCount: 4,
        executionStatus: {
          stop: 0,
          wait: 4,  // 排队
          run: 5,
          complete: 10
        }
      }
      var result = true
      var isSelectedSensitive = this.isSelectedSensitive(execution)
      var isSelectedSafe = this.isSelectedSafe(execution)
      if (isSelectedSensitive && execution.sensitive_status !== SCAN_ENUM.executionStatus.complete) {
        result = false
      }
      if (isSelectedSafe && execution.safe_status !== SCAN_ENUM.executionStatus.complete) {
        result = false
      }
      return result
    },
    // 获取当前管理员信息
    getUserInfo () {
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          this.hcauthor = data.user.chinesename
          // this.UPDATE_IMAGE_PATH({ imagePath: data.user.imagePath })
        }
      })
      // this.DELETE_CONTENT_TABS([])
      // this.UPDATE_USER_ID({ id: this.$store.state.user.id })
      // this.UPDATE_USER_NAME({ name: this.$store.state.user.name })
    },
    addHl (row) {
      this.hlmessVisible1 = true
      this.addhlFrom = row
    },
    subaddHl () {
      // 首先命名一个对象
      var Handsome = {}
      var name = getUUID()
      // 将属性赋给对象
      Handsome[name] = this.addhlFrom // 利用方括号添加属性名和值
      const addhlrow = {
        add: Handsome,
        scan_type: 0
      }
      setHl(addhlrow, this.addhlkey).then(response => {
        this.hlmessVisible1 = false
        this.getLogDetail(this.addhlkey)
      })
    },
    deleteHl (row) {
      const query = {
        delete: row.hlkey,
        scan_type: 0
      }
      setHl(query, row.key).then(response => {
        this.getLogDetail(row.key)
      })
    },
    download () {
      this.downloadJpg = true
      var date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const time = `${YY}${MM}${DD}`
      document.title = this.leftDataList.scan_task_name + '_' + time
      var beforePrint = () => {
        this.downloadJpg = true
        // this.$router.push({ path: '/serverinfo?key=' + this.$route.query.key })
        // location.reload()
      }
      // console.log(this.$route)
      var afterPrint = () => {
        this.downloadJpg = false
        // this.$router.push({ path: '/serverinfo?key=' + this.$route.query.key })
        location.reload()
      }
      if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print')
        mediaQueryList.addListener(function (mql) {
          if (mql.matches) {
            beforePrint()
          } else {
            afterPrint()
          }
        })
      }
      window.onbeforeprint = beforePrint
      window.onafterprint = afterPrint
      this.downloadJpg = true
      setTimeout(() => {
        // window.print()
        // this.printPartial(document.querySelector('#printpage'))
        // this.$print(this.$refs.pagePrint)
        // printpage
        document.body.innerHTML = document.getElementById('printpage').innerHTML
        window.print()
        // var newstr = document.getElementById('scanDetail').innerHTML
        // var oldstr = document.getElementById('serveinfo').innerHTML
        // document.body.innerHTML = newstr
        // window.print()
        // document.body.innerHTML = oldstr
        // location.reload()
        this.downloadJpg = false
        // this.$router.push({ path: '/serverinfo?key=' + this.$route.query.key })
        location.reload()
      }, 500)
    },
    printPartial (dom, {title = document.title} = {}) {
      if (!dom) return
      let copyDom = document.createElement('span')
      const styleDom = document.querySelectorAll('style, link, meta')
      const titleDom = document.createElement('title')
      titleDom.innerText = title
      copyDom.appendChild(titleDom)
      Array.from(styleDom).forEach(item => {
        copyDom.appendChild(item.cloneNode(true))
      })
      copyDom.appendChild(dom.cloneNode(true))
      const htmlTemp = copyDom.innerHTML
      copyDom = null
      const iframeDom = document.createElement('iframe')
      const attrObj = {
        height: 0,
        width: 0,
        border: 0,
        wmode: 'Opaque'
      }
      const styleObj = {
        position: 'absolute',
        top: '-999px',
        left: '-999px'
      }
      Object.entries(attrObj).forEach(([key, value]) => iframeDom.setAttribute(key, value))
      Object.entries(styleObj).forEach(([key, value]) => iframeDom.style[key] = value)
      document.body.insertBefore(iframeDom, document.body.children[0])
      const iframeWin = iframeDom.contentWindow
      const iframeDocs = iframeWin.document
      iframeDocs.write(`<!doctype html>`)
      iframeDocs.write(htmlTemp)
      iframeWin.focus()
      iframeWin.print()
      document.body.removeChild(iframeDom)
    },
    selectedHighlight ({row, rowIndex}) {
      if ((this.getIndex) === rowIndex) {
        return {
          'background-color': '#4b78cd',
          'color': '#fff'
        }
      }
    },
    tableRowClassName ({row, rowIndex}) {
      row.index = rowIndex
    },
    ims (row, column, event) {
      this.checkAuthor = ''
      this.wiguiCont = 0
      this.wiguiResult = []
      this.getIndex = row.index
      this.Allstatus = row.result
      this.checkAuthor = row.checkAuthor
      // console.log(row)
      this.getLogDetail(row.key)
      if (Number(row.result) !== 2) {
        this.subisShow = true
      } else {
        this.subisShow = false
      }
    },
    gettableDataList (isFirst) {
      this.passStatus = '通过'
      getDetailList(this.keyId).then(response => {
        // console.log(response)
        if (isFirst) {
          this.Allstatus = response.data.data[0].result
          if (response.data.data[0].result - 0 !== 2) {
            this.subisShow = true
          } else {
            this.subisShow = false
          }
        }
        this.tableDatas = response.data.data
        this.total = response.data.total
        if (response.data.data.length > 0) {
          for (let i = 0; i < this.tableDatas.length; i++) {
            const t = this.tableDatas[i]
            if (i < 10) {
              this.tableData.push(t)
            }
            let dt = t.created
            const dtt = new Date()
            dtt.setTime(dt * 1000)
            t.smtime = this.getTimeByDate(dtt)
            let tlc = ''
            if (typeof (t.measures.totalLineCount) !== 'undefined' && t.measures.totalLineCount !== '') {
              tlc = t.measures.totalLineCount / 1000 + 'k'
            }
            if (tlc !== 'NaNk') {
              t.totalLineCount = tlc
            }
          }
          // response.data.data[0].result = this.Allstatus
          // this.checkAuthor = response.data.data[0].checkAuthor
          this.getLogDetail(response.data.data[0].key)
        }
      })
    },
    getOptionsDatas () {
      getSensitiveOptions().then(response => {
        this.sensitiveOptions = response.data
      })
    },
    getLogDetail (keyId) {
      getLogDetail(keyId).then(response => {
        // console.log(response)
        this.detailKey = response.data.key
        // console.log(response.data.sensitive_numbers)
        this.wiguiCont = response.data.sensitive_numbers
        this.leftDataList = response.data
        var svnpath = decodeURI(this.leftDataList.repertory)
        this.leftDataList.repertory = svnpath
        let dt = response.data.created
        const dtt = new Date()
        dtt.setTime(dt * 1000)
        this.searchTime = this.getTimeByDate(dtt)
        let ut = response.data.updated
        // this.downloadTime = (ut - dt) + 's'
        if (response.data && response.data.safe_scan_result && response.data.safe_scan_result.summary) {
          if (response.data.result_file) {
            if (Number(response.data.safe_scan_result.summary.total_time_cost) > Number((response.data.measures.searchTime + response.data.measures.downloadTime))) {
              this.downloadTime = Math.round(response.data.safe_scan_result.summary.total_time_cost / 1000) + 's'
            } else {
              this.downloadTime = Math.round((response.data.measures.searchTime - 0 + response.data.measures.downloadTime - 0) / 1000) + 's'
            }
          } else {
            this.downloadTime = Math.round((response.data.measures.searchTime - 0 + response.data.measures.downloadTime - 0) / 1000) + 's'
          }
        } else {
          this.downloadTime = Math.round((response.data.measures.searchTime - 0 + response.data.measures.downloadTime - 0) / 1000) + 's'
        }
        if (this.downloadTime === 'NaNs') {
          this.downloadTime = ''
        }
        if (this.leftDataList.measures.totalLineCount !== 'undefined' && this.leftDataList.measures.totalLineCount !== '') {
          this.totalLineCount = this.leftDataList.measures.totalLineCount / 1000 + 'k'
        }
        if (this.totalLineCount === 'NaNk') {
          this.totalLineCount = '0k'
        }
        var arr = []
        var obj = this.leftDataList.exceptions.sensitive
        for (let value in obj) {
          let xq = {a: obj[value], lineshow: false, hlkey: value, key: this.leftDataList.key}
          var mess = ''
          xq.a.beforeLines.forEach(res => {
            mess += res
          })
          mess += xq.a.lineStart + xq.a.lineRed + xq.a.line + xq.a.lineEnd
          xq.a.afterLines.forEach(res => {
            mess += res
          })
          mess = mess.replace(/\t/g, '&nbsp;').replace(/\n/g, '<br/>')
          xq.a.mess = mess
          arr.push(xq)
        }
        // console.log(arr)
        this.details = arr
        if (this.totalLineCount === '0k') {
          this.versionLogs = ''
          this.details = []
        }
        this.lastCount = 0
        getLogDetailJson(keyId).then(responses => {
          // console.log(responses)
          let dt = responses.data.lastChangeTime
          this.addhlkey = responses.data.key
          const dtt = new Date()
          dtt.setTime(dt)
          this.tjTime = this.getTimeByDate(dtt)
          if (responses.data.versionLogs) {
            // console.log()
            // debugger
            var str = responses.data.versionLogs
            var strarr = str.split('\n')
            // for (var i = 0; i < strarr.length; i++) {
            //   strarr[i] = decodeURI(strarr[i])
            // }
            this.versionLogs = strarr
          }
          this.wiguiResult = []
          if (responses.data.result.length > 0) {
            var testarr = []
            for (let i = 0; i < responses.data.result.length; i++) {
              const ele = responses.data.result[i]
              ele.lineshow = false
              var mess = ''
              ele.beforeLines.forEach(res => {
                mess += res + '<br/>'
              })
              mess += ele.line + '<br/>'
              ele.afterLines.forEach(res => {
                mess += res + '<br/>'
              })
              mess = mess.replace(/\t/g, '&nbsp;').replace(/\n/g, '<br/>')
              var newArr = []
              if (ele.keyword === 'localhost') {
                newArr = ['localhost']
              } else {
                var reg = /(10|192|12|198|127)\.\d{1,3}\.\d{1,3}\.\d{1,3}/g
                var arr1 = mess.match(reg)
                // 使用set进行数组去重
                newArr = [...new Set(arr1)]
              }
              var newmess = mess
              // console.log(newArr)
              if (newArr.length > 0) {
                newmess = ''
                newArr.forEach(ele => {
                  var ms = mess.split(ele)
                  for (let i = 0; i < ms.length; i++) {
                    const element = ms[i]
                    if (i < ms.length - 1) {
                      newmess += element + '<span style="color: red;">' + ele + '</span>'
                    } else {
                      newmess += element
                    }
                  }
                })
              }
              ele.mess = newmess
              // console.log(ele)
              for (let j = 0; j < this.details.length; j++) {
                const det = this.details[j]
                if (ele.file === det.a.file && ele.keyword === det.a.keyword && ele.line === det.a.line && ele.startPos === det.a.startPos && _.difference(ele.beforeLines, det.a.beforeLines).length === 0 && _.difference(ele.afterLines, det.a.afterLines).length == 0) {
                  responses.data.result.splice(i, 1)
                  i = i - 1
                  break
                }
              }
            }
            // console.log(this.details)
          }
          this.wiguiResult = responses.data.result
          if (this.wiguiResult.length !== 0) {
            this.newStatus = '未通过'
          } else {
            this.newStatus = '通过'
          }
          // console.log(this.wiguiResult)
          // <span v-html="scope.row.mess" v-if="scope.row.mess.toLowerCase().includes(scope.row.keyword.toLowerCase()) === true"></span>
          // console.log(this.wiguiResult[0].mess)
          // if (this.wiguiResult.mess.includes(this.wiguiResult.keyword.toLowerCase()) === true) {
          if (this.wiguiResult.length > 0) {
            this.wiguiResult[0].mess = this.wiguiResult[0].mess.replace('LocalHost', '<span style="color:red">LocalHost</span>')
          }
          // }
          // console.log(this.wiguiResult[0].mess)

          // console.log(this.wiguiResult)
          // this.wiguiCont = this.wiguiResult.length
          if (this.totalLineCount === '0k') {
            this.versionLogs = ''
            this.details = []
          }
        }).catch((err) => {
          console.log(111)
          this.tjTime = ''
          this.lastCount = -1
        })
      })
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const HH = (date.getHours()).toString().padStart(2, 0)
      const mm = (date.getMinutes()).toString().padStart(2, 0)
      const ss = (date.getSeconds()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD} ${HH}:${mm}:${ss}`
      return time
    },
    // 改变当前分页显示数
    handleSizeChange (val) {
      this.pageRow.pageSize = val
      this.pageRow.start = (this.pageRow.pageNo - 1) * this.pageRow.pageSize
      this.pageRow.limit = this.pageRow.pageNo * this.pageRow.pageSize
      this.pageChange()
    },

    handleCurrentChange (val) {
      this.pageRow.pageNo = val
      this.pageRow.start = (val - 1) * this.pageRow.pageSize
      this.pageRow.limit = val * this.pageRow.pageSize
      this.pageChange()
    },
    pageChange () {
      this.tableData = []
      for (let i = this.pageRow.start; i < this.pageRow.limit; i++) {
        if (i < this.tableDatas.length) {
          const element = this.tableDatas[i]
          this.tableData.push(element)
        }
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.serverinfo {
  width: 100%;
  /* height: 100%; */
}
.servercontainer {
  width: 100%;
  /* background-color: pink; */
  margin: auto;
  display: flex;
}
.serverleft{
  width: 71%;
}
.serverright {
  width: 29%;
}
.serverleft {
  border-right: 1px solid #ccc;
  background-color: #fff;
  padding: 10px 15px;
}
.containerHeader {
  display: flex;
  justify-content: space-between;
}
.containerHeader > p > i {
  margin-right: 15px;
}
.btns .el-button {
  /* display: flex; */
  /* align-items: center; */
  background-color: #4b78cd;
  margin-top: 3px;
  border: none;
}
.scanning {
  width: 100%;
  display: flex;
}
.scanning .scan,
.scanning .Violation {
  margin-right: 30px;
  width: 250px;
  height: 75px;
  border-radius: 5px;
  /* background-color: yellow; */
}
.scanning .Violation1 {
  margin-right: 30px;
  width: 250px;
  height: 75px;
  border-radius: 5px;
  /* background-color: yellow; */
}
.scanning .scan,
.scanning .Violation {
  background-color: yellowgreen;
  padding: 10px;
  display: flex;
  /* justify-content: space-around; */
  box-sizing: border-box;
}
.scanning .Violation1 {
  background-color: #ff9900;
  padding: 10px;
  display: flex;
  /* justify-content: space-around; */
  box-sizing: border-box;
}
.scanning .scan span {
  color: #fff;
}
.scanning .scan span:nth-of-type(1) {
  font-size: 15px;
}
.scanning .scan span:nth-of-type(2) {
  font-size: 30px;
  margin-left: 20px;
  margin-top: 15px;
}
.scanning .Violation span {
  color: #fff;
}
.scanning .Violation span:nth-of-type(1) {
  font-size: 15px;
}
.scanning .Violation span:nth-of-type(2) {
  font-size: 30px;
  margin-left: 20px;
  margin-top: 15px;
}
.scanning .Violation {
  background-color: #4b78cd;
}
.scanning .Violation1 span {
  color: #fff;
}
.scanning .Violation1 span:nth-of-type(1) {
  font-size: 15px;
}
.scanning .Violation1 span:nth-of-type(2) {
  font-size: 30px;
  margin-left: 20px;
  margin-top: 15px;
}
.svnAddress {
  width: 95%;
  margin-top: 20px;
  height: auto;
  /* background-color: pink; */
}
.address {
  display: flex;
}
.address span {
  display: flex;
  width: 70px;
  align-items: center;
  justify-content: center;
}
.version {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  text-align: right;
}
.version .vsid {
  display: flex;
  width: 59%;
  margin-right: 10px;
}
.version .codenum {
  display: flex;
  width: 50%;
  margin-right: 10px;
}
.version .verifier {
  display: flex;
  width: 30%;
}
.version .vsid p {
  margin: 0;
  padding: 0;
  font-size: 10px;
  display: flex;
  width: 40%;
  margin-right: 5px;
  text-align: right;
  align-items: center;
  /* justify-content: end; */
  /* margin:0 5px; */
  /* padding: 0 10px; */
}
.version .codenum p {
  margin: 0;
  padding: 0;
  font-size: 10px;
  display: flex;
  width: 40%;
  margin-right: 5px;
  text-align: right;
  align-items: center;
  /* justify-content: end; */
  /* margin:0 5px; */
  /* padding: 0 10px; */
}
.version .verifier p {
  margin: 0;
  padding: 0;
  font-size: 10px;
  display: flex;
  width: 30%;
  margin-right: 5px;
  text-align: left;
  align-items: center;
}
.border {
  border-style:solid ;
  border-width: 1px;
  border-color: #DCDFE6;
  margin-top:5px;
}
.serverlog {
  width: 95%;
  margin-top: 20px;
  height: auto;
  border: 1px;
  /* background-color: pink; */
}
.serverlog span {
  margin-left: 15px;
}
.serverlog p {
  margin: 10px 0px;
}
.serverlog .addtime {
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
}
.seninfo {
  margin: 15px 0;
}
.seninfo span {
  margin-left: 10px;
}
/* end左边的样式 */

/* 右边布局的代码 */
.serverright {
  padding: 0 10px;
  box-sizing: border-box;
  background-color: #fff;
}
.version .vsid p,
.version .codenum p{
  display: block;
  line-height: 40px;
}
</style>

<style>
  
.servertable .el-table__body tr:hover>td{
background-color: transparent !important;
}
.el-table__header-wrapper{
  height: 48px;
}
.el-table th.gutter{
    display: table-cell !important;
}
 
.el-table colgroup.gutter{
    display: table-cell !important;
}
.serveinfo .el-table__empty-block{
  display: none;
}
#printpage{
  z-index: 30001 !important;
}
#printRadio .el-radio__input.is-checked .el-radio__inner:after{
  /* transform: none !important; */
  /* display: none; */
  /* background-color: #000;
  width: 15px;
  height: 15px; */
}
#printRadio /deep/ .el-radio__input.is-checked .el-radio__inner{
  background-color: #000 ;
  border-color: #000;
}
#printRadio /deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
  background-color: #000;
}
#printRadio /deep/ .el-radio__input.is-checked+.el-radio__label{
  color: #000;
  font-size: 25px;
  font-weight: 700;
}
#printpage{
  /* font-weight: 700;
  color: #000;
  font-size: 18px; */
  
}
/* @page {
  size: 28cm 30cm;
  margin: 0
} */

@page {
    /* size: 32cm 36cm; */
    /* size: 12in 18in; */
    /* size: ; */
    /* margin: 0mm; */
  }
  .A4 {          
    page-break-before: auto;          
    page-break-after: always;  
  }  
  .el-dialog.is-fullscreen{
    min-height: 100vh;
  }

/* @media print {
  #printpage {
    width:1500px;
    overflow-y:hidden;
    overflow-x:hidden;
  }
} */
.hascolor{
  color: #fff;
  background-color: #4b78cd;
  border:none;
}
</style>
