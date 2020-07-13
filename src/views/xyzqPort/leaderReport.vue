<template>
    <div class="leader" v-loading="projectlistLoading" element-loading-text="加载中。。。">
        <div class="leaderheader">
            <div class="leadertable">
              <el-table class="el-table_header" ref="multipleTable" :data="projectListData" v-loading="projectlistLoading" element-loading-text="加载中。。。"
                tooltip-effect="dark" style="width: 100%;margin-left:0px;height:285px;font-size: 12px;text-align:center;z-index:0"
                :row-style="{height:'40px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background: '#4B78CD', color: '#fff'}" @cell-click="handle" @cell-mouse-enter='handlemouse'>
                <el-table-column align="center" min-width=55 label="指标" height=33>
                  <template slot-scope='scope'>
                    <div style="font-size:11px;">{{scope.row.indtype}}</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width=25 label="总计" height=33>
                  <template slot-scope='scope'>
                    <div >{{scope.row.totalNum}}</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width=30 label="未完成" height=33>
                  <template slot-scope='scope'>
                    <div>{{scope.row.unfinishedNum}}
                      <!-- <img v-if="scope.row.type === 'up' && scope.row.indtype === '缺陷'" style="width: 15px; height: 15px" src="~@/assets/img/up1.png">
                      <img v-if="scope.row.type === 'down' && scope.row.indtype === '缺陷'" style="width: 15px; height: 15px" src="~@/assets/img/down2.png"> -->
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width=40 label="今日完成" height=33>
                  <template slot-scope="scope">
                    <div>{{scope.row.todayFinish}}
                      <!-- {{scope.row.indtype}} -->
                      <!-- {{scope.row.type}} -->
                      <!-- <img v-if="scope.row.type === 'up' && scope.row.indtype === '缺陷'" style="width: 15px; height: 15px" src="~@/assets/img/up1.png"> -->
                      <img v-if="Number(scope.row.todayFinish) < 0 && scope.row.indtype === 'Redmine不规范'" style="width: 15px; height: 15px" src="~@/assets/img/up1.png">
                      <img v-if="Number(scope.row.todayFinish) > 0 && scope.row.indtype === 'Redmine不规范'" style="width: 15px; height: 15px" src="~@/assets/img/down2.png">
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="leaderline" v-loading="projectlistLoading" id="canx">
                <p>产线问题</p>
                <div id="leaderline" style="width:100%;height:240px"></div>
            </div>
            <div class="leaderdemand" v-loading="projectlistLoading" style="position:relative;overflow:hidden">
                <p>进行中需求</p>
                <div class="titlebox" style="position:absolute;top:0;right:0;width:27%;min-width:25%;height:50px;background-color:transparent;z-index:1">
                  <el-tooltip content="创建时间超过三个月未关闭需求数量" placement="top" effect="light" popper-class="test">
                    <el-button style="height:19px;margin-top:31px;border:none;margin-left:40px;padding:5px 5px 5px;z-index:1" class="leadbun">
                      <span class="fa fa-question-circle-o"></span>
                    </el-button>
                  </el-tooltip>
                </div>
                <div id="leaderdemand" style="width:100%;height:240px"></div>
            </div>
            <div class="leaderstandard" v-loading="redmineLoading">
                <p>Redmine不规范</p>
                <div id="leaderstand" style="width:100%;height:240px">
                  <div v-if="righthide===true" style="width:100%;height:220px;text-align:center;">
                    <div class="giftbox" style="width:80%;height:200px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                      <i class="fa fa-gift fa-5x" style="margin-top:50px;color:#D6D6D6;"></i>
                      <span style="display:block;height:20px;color:#D6D6D6;">所有事项均不符合Redmine规范</span>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div class="leaderfooter" v-loading="projectlistLoading">
            <div class="leaderregst" style="position:relative;">
              <!-- <p>项目进度<span style="font-size:14px;font-weight:500">(无迭代管理项目:<span style="color:red" v-if="Noiteration>0">{{Noiteration}}</span><span v-else>0</span>)</span></p> -->
              <p>项目进度<span style="color:red" v-if="Noiteration>0">(项目信息异常:{{Noiteration}})</span></p>
              <div class="ballbox" style="display:flex;width:100%;padding-right:30px;margin-top:15px;">
                <div class="bleftbox" style="width:147px;">
                  <div style="color:red;text-align:center;line-height:40px;"></div>
                </div>
                <div class="askitem">
                  <div class="titleitemname">
                    <span>总进度</span><br>
                    <el-tooltip placement="bottom">
                      <div slot="content">
                        <span style="font-weight:700">自研项目</span><br/>
                        <span>总进度 = 开发进度 * 50% + 测试进度 * 50%</span><br/>
                        <span>开发进度 = 已关闭开发任务数 / 总的开发任务数</span><br/>
                        <span>测试进度 = (已关闭用例数 + 已关闭缺陷 + 延期缺陷) / (总用例数+总缺陷数)</span><br/><br/>
                        <span style="font-weight:700">外购项目</span><br/>
                        <span>总进度 = 已关闭任务数 / 总任务数</span><br/>
                        <span>任务包括：需研事务，需求，测试任务，测试用例，缺陷，生产反馈</span>
                      </div>
                      <span style="font-size:12px;display:inline-block;width:100%;">公式说明</span>
                    </el-tooltip>
                  </div>
                  <div class="titleitemname">
                    <span>需求进度</span><br>
                    <span style="font-size:12px">(已完成/任务总数)</span>                  
                  </div>
                  <div class="titleitemname">
                    <span>开发进度</span><br>
                    <span style="font-size:12px">(已完成/任务总数)</span>                  
                  </div>
                  <div class="titleitemname">
                    <span>测试进度</span><br>
                    <el-tooltip placement="bottom">
                      <div slot="content">
                        <span>测试进度 = (已关闭用例数 + 已关闭缺陷 + 延期缺陷) / (总用例数+总缺陷数)</span>
                      </div>
                      <span style="font-size:12px;display:inline-block;width:100%;">公式说明</span>
                    </el-tooltip>                 
                  </div>
                  <div class="titleitemname">
                    <span>Bug修复率</span><br>
                    <span style="font-size:12px">(已修复/缺陷总数)</span>                                  
                  </div>
                </div>
              </div>
              <div id="leaderregst" style="width:100%;margin-top:0px;overflow-y:auto" v-if="jzrate === true" ref="slidebox">
                <div class="item" style="margin-right:30px;" v-for="(item, index) in proinfo" :key="item.id">
                  <div class="infobox" style="width:100%;height:20px;display:flex;">
                    <div class="leftbox" style="width:147px;height:1px;"></div>
                    <div class="rightbox" style="width:80%;display:flex">
                      <div class="allinfo">{{item.zjdinfo}}</div>
                      <div class="allinfo">{{item.xqinfo}}</div>
                      <div class="allinfo">{{item.kfinfo}}</div>
                      <div class="allinfo">{{item.csinfo}}</div>
                      <div class="allinfo">{{item.buginfo}}</div>
                    </div>
                  </div>
                  <div class="forbox">
                    <div class="iteminfo">
                      <div @click="goQualityPort(item)" class="itemname" v-if="item.color === 'red'" style="color:red"><div style="width:80%;cursor:pointer">{{item.name}}</div></div>
                      <div @click="goQualityPort(item)" class="itemname" v-else><div style="width:80%;cursor:pointer">{{item.name}}</div></div>
                      <div class="itemversion">
                        <!-- 需要传递盒子遍历出来的项目名字和版本信息再根据版本传递版本id -->
                        <el-select v-model="item.versionid" placeholder="请选择" @change="changeitem(item.id, item.versionid, index)" class="leadselect">  
                          <el-option v-for="ver in item.version" :key="ver.id" :label="ver.text" :value="ver.id">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div @click="goQualityPort(item)" style="display: flex;justify-content: flex-end;width:80%;height:100%;align-items: flex-start;cursor:pointer">
                      <div class="box" v-if="item.ztype === 'wu'" style="width:170px;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                      <el-progress v-else :percentage='item.zjdname' :stroke-width="30" :text-inside='true' class="first"></el-progress>

                      <div class="box" v-if="item.xqtype === 'wu'" style="width:170px;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                      <el-progress v-else :percentage='item.xqjdname' :stroke-width="30" :text-inside='true' class="second"></el-progress>

                      <div class="box" v-if="item.kftype === 'wu'" style="width:170px;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                      <el-progress v-else :percentage='item.kfjdname' :stroke-width="30" :text-inside='true' class="second"></el-progress>

                      <div class="box" v-if="item.cstype === 'wu'" style="width:170px;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                      <el-progress v-else :percentage='item.csjdname' :stroke-width="30" :text-inside='true' class="first"></el-progress>

                      <div class="box" v-if="item.bugtype === 'wu'" style="width:170px;height:30px;color:#fff;background:#606061;border-radius:30px;">无任务</div>
                      <el-progress v-else :percentage='item.bugjd' :stroke-width="30" :text-inside='true' class="second"></el-progress>
                    </div>
                  </div>
                </div>
              </div> 
            </div>
            <div class="leaderdefect">
                <div class="leadersubmit" v-loading="projectlistLoading">
                    <!-- <div class="raibox"> -->
                    <p style="margin-bottom:5px;margin-right:10px;" class="quexian">提交缺陷分布</p>
                    <el-radio-group style="width:100%;display:flex;justify-content: center;" v-model="tcbugTimeType" @change="getBugByAuthor('tj')">
                      <el-radio :label="0">默认</el-radio>
                      <el-radio :label="1">近一周</el-radio>
                      <el-radio :label="2">近一月</el-radio>
                      <el-radio :label="3">近三月</el-radio>
                    </el-radio-group>
                    <!-- </div> -->
                    <div id="leadersubmit" style="width:100%;height:270px"></div>
                </div>
                <div class="leaderRepair" v-loading="projectlistLoading">
                    <!-- <div class="raibox"> -->
                    <p style="margin-bottom:5px;margin-right:10px;">修复缺陷分布</p>
                    <el-radio-group style="width:100%;display:flex;justify-content: center;" v-model="xfbugTimeType" @change="getBugByAuthor('xf')">
                      <el-radio :label="0">默认</el-radio>
                      <el-radio :label="1">近一周</el-radio>
                      <el-radio :label="2">近一月</el-radio>
                      <el-radio :label="3">近三月</el-radio>
                    </el-radio-group>
                    <!-- </div> -->
                    <div id="leaderRepair" style="width:100%;height:270px"></div>
                </div>
            </div>
        </div>

        <div class="itemport" v-loading="projectlistLoading">
          <p style="float: left">缺陷及生产反馈</p>
          <el-radio-group style="margin-top:15px;margin-left:30%;" v-model="bugTimeType" @change="getBugByTImeVal">
            <el-radio :label="0">默认</el-radio>
            <el-radio :label="1">近一周</el-radio>
            <el-radio :label="2">近一月</el-radio>
            <el-radio :label="3">近三月</el-radio>
          </el-radio-group>
          <div id="itemport" style="width:100%;height:230px;"></div>
        </div>

        <div class="addviews">
          <div class="redminper" v-loading="redmineLoading">
            <p>Redmine不规范--流程</p>
            <div id="redminper" style="width:100%;height:220px;">
              <div v-if="hideecshow===true" style="width:100%;height:220px;text-align:center;">
                <div class="giftbox" style="width:70%;height:170px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:50px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">所有事项均不符合Redmine规范</span>
                </div>
              </div>
            </div>
          </div>
          <div class="redminitem" v-loading="redmineLoading">
            <p>Redmine不规范--项目</p>
            <div id="redminitem" style="width:100%;height:220px;">
              <div v-if="itemhideecshow===true" style="width:100%;height:220px;text-align:center;">
                <div class="giftbox" style="width:70%;height:170px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:50px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">所有事项均不符合Redmine规范</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="ranking">
          <div class="rleft" style="margin-right:20px;">
            <div class="tabletitle" style="height:36px;line-height:36px;width:100%;display:flex;justify-content: center;color:#fff;background:#4b78cd;font-size:18px;">活跃排行榜TOP10(近七天)</div>
            <el-row>
              <el-col :span="8">
                
                <el-table :data="prodesctableData" style="width: 100%;" v-loading="projectlistLoading" :row-class-name="tableRowClassName" border 
                  :header-cell-style="{background:'rgb(134,164,218)',color:'#fff'}"  class="ltab"
                  :default-sort="{prop: '', order: ''}" tooltip-effect="dark" 
                  @sort-change="prodescchangeOrder">
                    <!-- <el-table-column type="index" label="排名" align="center" width='50'></el-table-column> -->
                    <el-table-column  label="项目" align="center"  show-overflow-tooltip height='36'>
                      <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" :content="scope.row.prodescname" placement="top"> -->
                          <span>{{maxText(scope.row.prodescname)}}</span>
                        <!-- </el-tooltip> -->
                      </template>
                    </el-table-column>
                    <el-table-column prop="prodescnum" label="issue数" sortable="custom" align="center" width='100'></el-table-column>
                  </el-table>
              </el-col>
              <el-col :span="8">
                <el-table :data="authordesctableData" style="width: 97%;margin-left: 3%;" v-loading="projectlistLoading" :row-class-name="tableRowClassName" border 
                  :header-cell-style="{background:'rgb(134,164,218)',color:'#fff'}"  class="ltab"
                  :default-sort="{prop: '', order: ''}"
                  @sort-change="autdescchangeOrder">
                    <el-table-column prop="authordescname" label="人员" align="center" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>{{maxText(scope.row.authordescname)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="authordescnum" label="issue数" sortable="custom" align="center" width='100'></el-table-column>
                  </el-table>
              </el-col>
              <el-col :span="8">
                <el-table :data="lcdesctableData" style="width: 97%;margin-left: 3%;" v-loading="projectlistLoading" :row-class-name="tableRowClassName" border 
                  :header-cell-style="{background:'rgb(134,164,218)',color:'#fff'}"  class="ltab"
                  :default-sort="{prop: '', order: ''}" tooltip-effect="dark"
                  @sort-change="lcdescchangeOrder">
                    <el-table-column prop="lcdescname" label="流程" align="center" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>{{maxText(scope.row.lcdescname)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="lcdescnum" label="issue数" sortable="custom" align="center" width='100'></el-table-column>
                  </el-table>
              </el-col>
            </el-row>
          </div>
          <div class="rright">
            <div class="tabletitle" style="height:36px;line-height:36px;width:100%;display:flex;justify-content: center;color:#fff;background:rgba(245, 108, 108, 1);font-size:18px;">不活跃排行榜TOP10(近七天)</div>
            <el-row>
              <el-col :span="8">
                <el-table :data="proasctableData" v-loading="projectlistLoading" style="width: 100%;" :row-class-name="tableRow" border :header-cell-style="{background:'rgb(244,134,134)',color:'#fff'}"
                  :default-sort="{prop: '', order: ''}" tooltip-effect="dark"
                  @sort-change="proascchangeOrder">
                    <el-table-column prop="proascname" label="项目" align="center" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>{{maxText(scope.row.proascname)}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="proascnum" label="不活跃天数数" sortable="custom" align="center" width='130'></el-table-column>
                  </el-table>
              </el-col>
              <el-col :span="8">
                <el-table :data="autasctableData" v-loading="projectlistLoading" style="width: 97%;margin-left: 3%;" :row-class-name="tableRow" border :header-cell-style="{background:'rgb(244,134,134)',color:'#fff'}"
                  :default-sort="{prop: '', order: ''}"
                  @sort-change="autascchangeOrder">
                    <el-table-column prop="authorascname" label="人员" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <span>{{maxText(scope.row.authorascname)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="authorascnum" label="不活跃天数数" sortable="custom" align="center" width='130'></el-table-column>
                  </el-table>
              </el-col>
              <el-col :span="8">
                <el-table :data="lcasctableData" v-loading="projectlistLoading" style="width: 97%;margin-left: 3%;" :row-class-name="tableRow" border :header-cell-style="{background:'rgb(244,134,134)',color:'#fff'}"
                  :default-sort="{prop: '', order: ''}" tooltip-effect="dark"
                  @sort-change="lcascchangeOrder">
                    <el-table-column prop="lcascname" label="流程" align="center" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>{{maxText(scope.row.lcascname)}}</span>                        
                      </template>
                    </el-table-column>
                    <el-table-column prop="lcascnum" label="不活跃天数数" sortable="custom" align="center" width='130'></el-table-column>
                  </el-table>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-dialog
          title=""
          :visible.sync="noproFlag"
          width="50%"
          top="20vh"
          :close-on-click-modal='false'
          :show-close='false'
          style="">
          <div style="position:relative;width:100%;">
            <div style="width:100%;height:50px;position:absolute;top:-32vh;"></div>
          </div>
          <!-- <span>这是一段信息</span> -->
          <div style="width:100%;height:400px;">
            <div class="errbox" style="width:100%;height:300px;text-align:center">
                <div class="fa fa-lock" style="font-size:100px;margin-top:100px;"></div>
                <h2>请联系管理员添加Redmine项目权限</h2>
            </div>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import Vue from 'vue'
import {systemlogStatis} from '@/api/modules/all'
// import API from '@/api'
import {getProjectRateByUser, getBugByAuthor, getActiveData, getBugByTIme,
getProductData} from '@/api/xyzqPort/leaderReport'
import {getStandardForProject} from '@/api/xyzqPort/template.js'
import echarts from 'echarts'
import { getUUID } from '@/utils'
import {gettrackerdict, getuserdict, getEchartsByTime} from '@/api/xyzqPort/erstantard'
export default {
  data () {
    return {
      bugTimeType: 0,
      tcbugTimeType: 0,
      xfbugTimeType: 0,
      userId: '',
      jzrate: false,
      projectlistLoading: false,
      redmineLoading: true,
      taskListDatass: [],
      taskIds: [],
      xqIds: '',
      listQuery: {
        project_id: '',
        version_id: ''
      },
      customColor: '#000000',
      projectOptions: [],
      projectListData: [],
      options: [],
      prooptions: [],
      value: '',
      version: [],
      proobj: {
        project_id: 27,
        version_id: 980
      },
      proinfo: [],
      val: [],
      list: [],
      list2: [],
      nowmouth: [],
      lastmouth: [],
      nowsolve: [],
      lastsolve: [],
      bugIds: '',
      byxz: 0,
      syxz: 0,
      bylj: 0,
      sylj: 0,
      xfbuglist: [],
      prodesctableData: [],
      authordesctableData: [],
      lcdesctableData: [],
      proasctableData: [],
      autasctableData: [],
      lcasctableData: [],
      authorsarr: [],
      allitems: [],
      // 无项目迭代的itemnum
      Noiteration: 0,
      hideecshow: false,
      itemhideecshow: false,
      righthide: false,
      noproFlag: false
    }
  },
  created () {
    // this.getchecklist()
    if (this.$route.query.type === 'tcbugTimeType') {
      this.tcbugTimeType = Number(this.$route.query.tval)
    } else if (this.$route.query.type === 'bugTimeType') {
      this.bugTimeType = Number(this.$route.query.tval)
    }
    var url = window.location.href
    if (url.indexOf('?token=') !== -1) {
      localStorage.setItem('tabIndex', 460)
      this.loginEiac()
    }
    this.getUserProject()
    this.getActiveData()
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '项目驾驶舱',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  methods: {
    loginEiac () {
      var url = window.location.href
      if (url.indexOf('?msg=') !== -1) {
        var msg = url.split('?msg=')[1]
        this.$message({ title: '失败', message: decodeURI(msg), type: 'error', duration: 4000, center: true })
      }
      if (url.indexOf('?username=') !== -1) {
        var userName = url.split('?username=')[1]
        this.$message({ title: '失败', message: decodeURI(userName), type: 'error', duration: 4000, center: true })
      }
      if (url.indexOf('?token=') !== -1) {
        var params = url.split('?')[1].split('&')
        var token = params[0].split('=')[1]
        var userId = params[1].split('=')[1]
        localStorage.setItem('userId', userId)
        this.$cookie.set('token', token)
        Vue.cookie.set('user_token', 'cWNfNWQ1NjVjNjExMzhiNw==')
        this.$router.push({ name: 'leaderReport' })
      }
    },
    handlemouse (row, column, event, cell) {
      if (row.indtype === '开发任务' || row.indtype === '测试任务' || row.indtype === '需求任务' || row.indtype === '缺陷') {
        event.style.cursor = 'pointer'
      }
    },
    handle (row, column, event, cell) {
      // console.log(row)
      // console.log(column)
      // console.log(event)
      // console.log(cell)
      let data = {
        type: row.indtype
      }
      if (row.indtype === '开发任务' || row.indtype === '测试任务') {
        this.$router.push({path: '/ertask', query: data})
      } else if (row.indtype === '需求任务') {
        const row = {
          project_id: '',
          type: '1',
          status: 0
        }
        this.$router.push({path: '/erneed', query: row})
      } else if (row.indtype === '缺陷') {
        this.$router.push({path: '/esubmission'})
      }
    },
    goesubmission () {
      this.$router.push('/esubmission')
    },
    goQualityPort (row) {
      localStorage.setItem('tabIndex', '454')
      var cs = ''
      if (typeof (row.versionid) !== 'undefined' && row.versionid !== null) {
        cs = '&versionId=' + row.versionid
      }
      // this.allitems.forEach(item => {
      //   if (item.proname === row.name) {
      //     row.id = item.project_id
      //   }
      // })
      // console.log(row)
      var urlHost = 'http://' + window.location.host + '/port/#/qualityPortNew?projectId=' + row.id + cs
      window.open(urlHost)
      // this.$router.push({path: '/qualityPort', query: data})
      // this.$router.push('/qualityPort?project_id=' + row.id + '&version_id=' + row.versionid)
    },
    erstandard () {
      this.$router.push('/erstantard')
    },
    // erneed () {
    //   this.$router.push('/erneed')
    // },
    // erprob () {
    //   console.log(1231)
    //   this.$router.push('/erprob')
    // },
    maxText (descText) {
      if (descText != null && descText !== '' && descText.length > 10) {
        return descText.substr(0, 10) + '...'
      } else {
        return descText
      }
    },
    resText (descText) {
      if (descText != null && descText !== '' && descText.length > 8) {
        return descText.substr(0, 8) + '\n' + descText.substr(9)
      } else {
        return descText
      }
    },
    prodescchangeOrder (column, prop, order) {
      var key = column.prop
      this.prodesctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    autdescchangeOrder (column, prop, order) {
      var key = column.prop
      this.authordesctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    lcdescchangeOrder (column, prop, order) {
      var key = column.prop
      this.lcdesctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    proascchangeOrder (column, prop, order) {
      var key = column.prop
      this.proasctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    autascchangeOrder (column, prop, order) {
      var key = column.prop
      this.autasctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    lcascchangeOrder (column, prop, order) {
      var key = column.prop
      this.lcasctableData.sort(function (obj1, obj2) {
        let val1 = obj1[key]
        let val2 = obj2[key]
        if (column.order === 'ascending') {
          return val1 - val2
        } else {
          return val2 - val1
        }
      })
    },
    getActiveData () {
      getActiveData().then(response => {
        this.prodesctableData = response.data.prodesc
        this.authordesctableData = response.data.authordesc
        this.lcdesctableData = response.data.lcdesc
        this.proasctableData = response.data.proasc
        this.autasctableData = response.data.authorasc
        this.lcasctableData = response.data.lcasc
      })
    },
    tableRow ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'pink-row'
      } else if (rowIndex % 2 === 0) {
        return 'success-row'
      }
      return ''
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else if (rowIndex % 2 === 0) {
        return 'success-row'
      }
      return ''
    },
    changeitem (proid, vsid, index) {
      // var obj1 = {
      //   project_id: proid,
      //   version_id: vsid,
      //   complete_flag: 1
      // }
      // var obj2 = {
      //   project_id: proid,
      //   version_id: vsid,
      //   complete_flag: 0
      // }
      var row = {
        project_id: proid,
        version_id: vsid,
        userId: this.userId
      }
      this.getRateByVersion(row, index)
      // this.getproname(obj1, obj2, index)
      this.$forceUpdate()
    },
    getRateByVersion (row, index) {
      getProjectRateByUser(row).then(response => {
        var data = response.data.result
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            const ele = data[i]
            // console.log(ele)
            if (i < data.length - 2) {
              const item = {}
              var xqtype = ''
              var xqclose = Number(typeof (ele.reqclose) === 'undefined' || ele.reqclose === null ? 0 : ele.reqclose)
              var xqtotal = Number(typeof (ele.reqTotal) === 'undefined' || ele.reqTotal === null ? 0 : ele.reqTotal)
              var xqjd = xqclose / xqtotal
              if (xqtotal === 0) {
                xqtype = 'wu'
              }
              if (Number.isNaN(xqjd)) {
                xqjd = 0
              } else if (xqjd !== 100 && xqjd !== 0) {
                xqjd = Number(xqjd * 100).toFixed(2)
              }
              var kftype = ''
              var kfclose = Number(typeof (ele.kf_close) === 'undefined' || ele.kf_close === null ? 0 : ele.kf_close)
              var kftotal = Number(typeof (ele.kf_total) === 'undefined' || ele.kf_total === null ? 0 : ele.kf_total)
              var kfjd = kfclose / kftotal
              if (kftotal === 0) {
                kftype = 'wu'
              }
              if (Number.isNaN(kfjd)) {
                kfjd = 0
              } else if (kfjd !== 100 && kfjd !== 0) {
                kfjd = Number(kfjd * 100).toFixed(2)
              }
              var csclose = Number(typeof (ele.cs_close) === 'undefined' || ele.cs_close === null ? 0 : ele.cs_close)
              var cstotal = Number(typeof (ele.cs_total) === 'undefined' || ele.cs_total === null ? 0 : ele.cs_total)
              var csjd = csclose / cstotal
              var cstype = ''
              if (cstotal === 0) {
                cstype = 'wu'
              }
              if (Number.isNaN(csjd)) {
                csjd = 0
              } else if (csjd !== 100 && csjd !== 0) {
                csjd = Number(csjd * 100).toFixed(2)
              }
              // 之前的
              // var zjd = (kfclose + csclose + xqclose) / (kftotal + cstotal + xqtotal)
              var zjd = ele.hasOwnProperty('jindu') ? ele.jindu : null

              var ztype = ''
              if (zjd === null) {
                ztype = 'wu'
                // item.zjdname = 0
              }
              if (Number.isNaN(zjd)) {
                zjd = 0
              } else if (zjd !== 100 && zjd !== 0 && zjd !== null) {
                zjd = Number(zjd).toFixed(2) - 0
              }
              var bugjd = Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose) / Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal)
              var bugtype = ''
              if (Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal) === 0) {
                bugtype = 'wu'
              }
              if (Number.isNaN(bugjd)) {
                bugjd = 0
              } else if (bugjd !== 100 && bugjd !== 0) {
                bugjd = Number(bugjd * 100).toFixed(2)
              }
              item.xqjdname = xqjd - 0
              item.xqtype = xqtype
              item.xqinfo = xqclose + '/' + xqtotal
              item.kfinfo = kfclose + '/' + kftotal
              // item.zjdinfo = (kfclose + csclose + xqclose) + '/' + (kftotal + cstotal + xqtotal)
              item.zjdinfo = ''
              item.csinfo = csclose + '/' + cstotal
              item.buginfo = Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose) + '/' + Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal)
              item.bugjd = bugjd - 0
              item.kfjdname = kfjd - 0
              item.csjdname = csjd - 0
              item.zjdname = zjd
              item.taskTotal = kftotal + cstotal
              item.kftype = kftype
              item.cstype = cstype
              item.ztype = ztype
              item.bugtype = bugtype
              item.versionid = row.version_id
              item.name = ele.project_name
              item.version = ele.version
              item.id = ele.project_id
              this.proinfo[index] = item
              this.$forceUpdate()
            }
          }
        } else {
          this.proinfo[index].xqjdname = 0
          this.proinfo[index].xqtype = 'wu'
          this.proinfo[index].xqinfo = '0/0'
          this.proinfo[index].kfinfo = '0/0'
          this.proinfo[index].zjdinfo = '0/0'
          this.proinfo[index].csinfo = '0/0'
          this.proinfo[index].buginfo = '0/0'
          this.proinfo[index].bugjd = 0
          this.proinfo[index].kfjdname = 0
          this.proinfo[index].csjdname = 0
          this.proinfo[index].zjdname = 0
          this.proinfo[index].taskTotal = 0
          this.proinfo[index].kftype = 'wu'
          this.proinfo[index].cstype = 'wu'
          this.proinfo[index].ztype = 'wu'
          this.proinfo[index].bugtype = 'wu'
        }
      })
    },
    getUserProject () {
      this.projectlistLoading = true
      this.redmineLoading = true
      this.userId = ''
      // API.user.info().then(({data}) => {
      //   if (data && data.code === 0) {
      //   }
      // })
      const row = {
        userId: localStorage.getItem('userId'),
        serNo: getUUID()
      }
      this.userId = localStorage.getItem('userId')
      this.getProjectRate(row)
      this.getBugByAuthor('all')
      this.getBugByTImeVal()
      this.getProductData(row)
    },
    getProductData (row) {
      getProductData(row).then(response => {
        if (response.data.result === 'success') {
          var resdata = {
            arr1: response.data.by,
            arr2: response.data.sy
          }
          this.echartsproline('leaderline', resdata)
        }
      })
    },
    getBugByAuthor (type) {
      this.authorsarr = []
      const end = new Date()
      const start = new Date()
      var tcEnd = this.getTimeByDate(end)
      var tcStart = ''
      if (this.tcbugTimeType === 1) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        tcStart = this.getTimeByDate(start)
      } else if (this.tcbugTimeType === 2) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        tcStart = this.getTimeByDate(start)
      } else if (this.tcbugTimeType === 3) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        tcStart = this.getTimeByDate(start)
      } else {
        tcStart = ''
        tcEnd = ''
      }
      const xfend = new Date()
      const xfstart = new Date()
      var xfEnd = ''
      var xfStart = ''
      xfEnd = this.getTimeByDate(xfend)
      if (this.xfbugTimeType === 1) {
        xfstart.setTime(xfstart.getTime() - 3600 * 1000 * 24 * 6)
        xfStart = this.getTimeByDate(xfstart)
      } else if (this.xfbugTimeType === 2) {
        xfstart.setTime(xfstart.getTime() - 3600 * 1000 * 24 * 30)
        xfStart = this.getTimeByDate(xfstart)
      } else if (this.xfbugTimeType === 3) {
        xfstart.setTime(xfstart.getTime() - 3600 * 1000 * 24 * 90)
        xfStart = this.getTimeByDate(xfstart)
      } else {
        xfEnd = ''
        xfStart = ''
      }
      const row = {
        userId: this.userId,
        tcstart: tcStart,
        tcend: tcEnd,
        xfstart: xfStart,
        xfend: xfEnd,
        serNo: getUUID(),
        type: type
      }
      getBugByAuthor(row).then(response => {
        if (response.data.result === 'success') {
          this.authorsarr = response.data.tc
          if (type === 'tj' || type === 'all') {
            var newarr2 = []
            var name2 = []
            var obj2 = {
              name: name2,
              count: newarr2
            }
            // 提交缺陷数排在前十的数组对象
            if (response.data.tc.length > 0) {
              response.data.tc.forEach(item => {
                if (newarr2.length < 10) {
                  newarr2.push(item.totalnum)
                  name2.push(item.firstname)
                }
              })
              obj2.name = name2
              obj2.count = newarr2
            }
            // console.log(obj2)
            this.echartssubmitline('leadersubmit', obj2)
          }
          if (type === 'xf' || type === 'all') {
            var newarr = []
            var name = []
            var obj = {
              name: name,
              count: newarr
            }
            // 修复缺陷数排在前十的数组对象
            if (response.data.xf.length > 0) {
              response.data.xf.forEach(item => {
                if (newarr.length < 10) {
                  newarr.push(item.totalnum)
                  name.push(item.firstname)
                }
              })
              obj.name = name
              obj.count = newarr
            }
            this.echartsrepaireline('leaderRepair', obj)
          }
        } else {
          // this.$message.error(response.data.result)
        }
      })
    },
    getProjectRate (row) {
      this.projectListData = [
        {indtype: '需求任务', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '开发任务', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '测试任务', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '缺陷', totalNum: 0, unfinishedNum: 0, todayFinish: 0, type: 'up'},
        {indtype: '任务总数', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: 'Redmine不规范', totalNum: 0, unfinishedNum: 0, todayFinish: 0, type: ''}
      ]
      this.jzrate = false
      getProjectRateByUser(row).then(response => {
        var data = response.data.result
        // console.log(response)
        if (data.length > 0) {
          this.proinfo = []
          var proIds = []
          // var pbrow = []
          this.Noiteration = 0
          for (let i = 0; i < data.length; i++) {
            const ele = data[i]
            // console.log(ele)
            if (i < data.length - 2) {
              // 表格总计未完成已完成
              this.projectListData[0].totalNum += Number(typeof (ele.reqTotal) === 'undefined' || ele.reqTotal === null ? 0 : ele.reqTotal)
              this.projectListData[0].unfinishedNum += Number(typeof (ele.reqTotal) === 'undefined' || ele.reqTotal === null ? 0 : ele.reqTotal) - Number(typeof (ele.reqclose) === 'undefined' || ele.reqclose === null ? 0 : ele.reqclose)
              this.projectListData[0].todayFinish += Number(typeof (ele.reqtodayfinish) === 'undefined' || ele.reqtodayfinish === null ? 0 : ele.reqtodayfinish)
              this.projectListData[1].totalNum += Number(typeof (ele.kfTotal) === 'undefined' || ele.kfTotal === null ? 0 : ele.kfTotal)
              this.projectListData[1].unfinishedNum += Number(typeof (ele.kfTotal) === 'undefined' || ele.kfTotal === null ? 0 : ele.kfTotal) - Number(typeof (ele.kfclose) === 'undefined' || ele.kfclose === null ? 0 : ele.kfclose)
              this.projectListData[1].todayFinish += Number(typeof (ele.kftodayfinish) === 'undefined' || ele.kftodayfinish === null ? 0 : ele.kftodayfinish)
              this.projectListData[2].totalNum += Number(typeof (ele.csTotal) === 'undefined' || ele.csTotal === null ? 0 : ele.csTotal)
              this.projectListData[2].unfinishedNum += Number(typeof (ele.csTotal) === 'undefined' || ele.csTotal === null ? 0 : ele.csTotal) - Number(typeof (ele.csclose) === 'undefined' || ele.csclose === null ? 0 : ele.csclose)
              this.projectListData[2].todayFinish += Number(typeof (ele.cstodayfinish) === 'undefined' || ele.cstodayfinish === null ? 0 : ele.cstodayfinish)
              this.projectListData[3].totalNum += Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal)
              this.projectListData[3].unfinishedNum += Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal) - Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose)
              this.projectListData[3].todayFinish += Number(typeof (ele.bugtodayfinish) === 'undefined' || ele.bugtodayfinish === null ? 0 : ele.bugtodayfinish)
              // const pb = {
              //   proname: ele.project_name,
              //   probug: Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal),
              //   scfknum: Number(typeof (ele.scfknum) === 'undefined' || ele.scfknum === null ? 0 : ele.scfknum)
              // }
              // pbrow.push(pb)
              const item = {}
              var xqtype = ''
              var xqclose = Number(typeof (ele.reqclose) === 'undefined' || ele.reqclose === null ? 0 : ele.reqclose)
              var xqtotal = Number(typeof (ele.reqTotal) === 'undefined' || ele.reqTotal === null ? 0 : ele.reqTotal)
              var xqjd = xqclose / xqtotal
              if (xqtotal === 0) {
                xqtype = 'wu'
              }
              if (Number.isNaN(xqjd)) {
                xqjd = 0
              } else if (xqjd !== 100 && xqjd !== 0) {
                xqjd = Number(xqjd * 100).toFixed(2)
              }
              var kftype = ''
              var kfclose = Number(typeof (ele.kf_close) === 'undefined' || ele.kf_close === null ? 0 : ele.kf_close)
              var kftotal = Number(typeof (ele.kf_total) === 'undefined' || ele.kf_total === null ? 0 : ele.kf_total)
              var kfjd = kfclose / kftotal
              if (kftotal === 0) {
                kftype = 'wu'
              }
              if (Number.isNaN(kfjd)) {
                kfjd = 0
              } else if (kfjd !== 100 && kfjd !== 0) {
                kfjd = Number(kfjd * 100).toFixed(2)
              }
              var csclose = Number(typeof (ele.cs_close) === 'undefined' || ele.cs_close === null ? 0 : ele.cs_close)
              var cstotal = Number(typeof (ele.cs_total) === 'undefined' || ele.cs_total === null ? 0 : ele.cs_total)
              var csjd = csclose / cstotal
              var cstype = ''
              if (cstotal === 0) {
                cstype = 'wu'
              }
              if (Number.isNaN(csjd)) {
                csjd = 0
              } else if (csjd !== 100 && csjd !== 0) {
                csjd = Number(csjd * 100).toFixed(2)
              }
              // 之前的
              // var zjd = (kfclose + csclose + xqclose) / (kftotal + cstotal + xqtotal)
              var zjd = ele.hasOwnProperty('jindu') ? ele.jindu : null
              var ztype = ''
              if (zjd === null) {
                ztype = 'wu'
                // item.zjdname = 0
              }
              // console.log(zjd)
              if (Number.isNaN(zjd)) {
                zjd = 0
              } else if (zjd !== 100 && zjd !== 0 && zjd !== null) {
                zjd = Number(zjd).toFixed(2) - 0
              }
              var bugjd = Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose) / Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal)
              var bugtype = ''
              if (Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal) === 0) {
                bugtype = 'wu'
              }
              if (Number.isNaN(bugjd)) {
                bugjd = 0
              } else if (bugjd !== 100 && bugjd !== 0) {
                bugjd = Number(bugjd * 100).toFixed(2)
              }
              item.xqjdname = xqjd - 0
              item.xqtype = xqtype
              item.xqinfo = xqclose + '/' + xqtotal
              item.kfinfo = kfclose + '/' + kftotal
              // item.zjdinfo = (kfclose + csclose + xqclose) + '/' + (kftotal + cstotal + xqtotal)
              item.zjdinfo = ''
              item.csinfo = csclose + '/' + cstotal
              item.buginfo = Number(typeof (ele.bugclose) === 'undefined' || ele.bugclose === null ? 0 : ele.bugclose) + '/' + Number(typeof (ele.bugTotal) === 'undefined' || ele.bugTotal === null ? 0 : ele.bugTotal)
              item.bugjd = bugjd - 0
              item.kfjdname = kfjd - 0
              item.csjdname = csjd - 0
              item.zjdname = zjd
              item.taskTotal = kftotal + cstotal
              item.kftype = kftype
              item.cstype = cstype
              item.ztype = ztype
              item.bugtype = bugtype
              if (typeof (ele.version_id) !== 'undefined' && ele.version_id !== null) {
                item.versionid = ele.version_id
              }
              item.all_total = ele.all_total
              item.name = ele.project_name
              item.version = ele.version
              item.id = ele.project_id
              if (!item.versionid) {
                item.color = 'red'
                this.Noiteration++
              }
              proIds.push(ele.project_id)
              this.proinfo.push(item)
              // console.log(this.proinfo)
              // console.log(this.Noiteration)
              // 查询redmine总计数据
              const startdate = new Date()
              const enddate = new Date()
              startdate.setTime(startdate.getTime() - 3600 * 1000 * 24 * 1)
              var end = this.getTimeByDate(enddate)
              var start = this.getTimeByDate(startdate)
              const numrow = {
                project_id: ele.project_id,
                start_date: start,
                end_date: end
              }
              // getillegalnumlist(numrow).then(response => {
              //   if (response.data.data !== null) {
              //     for (let val in response.data.data) {
              //       for (let value in response.data.data[val]) {
              //         this.projectListData[5].totalNum += response.data.data[val][value]
              //       }
              //     }
              //   }
              // })
            } else if (i === data.length - 2) {
              this.projectListData[5].totalNum = ele.all_num
              this.projectListData[5].closeNum = ele.close_num
              // this.projectListData[5].indtype = ele.indtype
              this.projectListData[5].indtype = 'Redmine不规范'
              this.projectListData[5].todayFinish = ele.today_num
              this.projectListData[5].unfinishedNum = ele.unclose_num
            } else if (i === data.length - 1) {
              var req = ele.unreq
              if (req.length > 0) {
                req.sort(this.compare('count', false))
                var newarr = []
                var name = []
                var out = []
                var obj = {}
                req.forEach(item => {
                  if (newarr.length < 5 && item.name !== '') {
                    newarr.push(item.count)
                    name.push(item.name)
                    out.push(item.outCont)
                  }
                })
                obj.name = name
                obj.count = newarr
                obj.out = out
                this.echartsdemandline('leaderdemand', obj)
              }
            }
          }
          if (this.proinfo.length > 0) {
            this.proinfo.sort(function (obj1, obj2) {
              let val1 = 0
              let val2 = 0
              if (obj1.color) {
                obj1.all_total = -1
              }
              if (obj2.color) {
                obj2.all_total = -1
              }
              // console.log(obj1, obj2)
              val1 = obj1.all_total
              val2 = obj2.all_total
              return val2 - val1
            })
            // console.log(this.proinfo)
          }
          // pbrow.sort(this.compare('probug', false))
          // var proname = []
          // var probug = []
          // var scfknum = []
          // pbrow.forEach(item => {
          //   if (proname.length < 11 && item.proname !== '') {
          //     probug.push(item.probug)
          //     proname.push(item.proname)
          //     scfknum.push(item.scfknum)
          //   }
          // })
          // const row = {
          //   proname: proname,
          //   probug: probug,
          //   scfknum: scfknum
          // }
          // this.echartsitemport('itemport', row)
          // console.log(this.proinfo)
          if (proIds.length > 0) {
            // 查询redmine总计数据
            // const startdate = new Date()
            // const enddate = new Date()
            // startdate.setTime(startdate.getTime() - 3600 * 1000 * 24 * 1)
            // var end1 = this.getTimeByDate(enddate)
            // var start1 = this.getTimeByDate(startdate)
            var redminarr = {
              project_id: proIds.join(',')
            }
            // const numrow = {
            //   project_id: proIds.join(','),
            //   start_date: start1,
            //   end_date: end1
            // }
            // getillegalnumlist(redminarr).then(response => {
            //   if (response.data.data !== null) {
            //     for (let val in response.data.data) {
            //       for (let value in response.data.data[val]) {
            //         this.projectListData[5].totalNum += response.data.data[val][value]
            //       }
            //     }
            //   }
            // })
            this.getchecklist(redminarr)
          }
          this.jzrate = true
          this.$forceUpdate()
          this.projectlistLoading = false
          this.projectListData[4].totalNum = this.projectListData[0].totalNum + this.projectListData[1].totalNum + this.projectListData[2].totalNum
          this.projectListData[4].unfinishedNum += this.projectListData[0].unfinishedNum + this.projectListData[1].unfinishedNum + this.projectListData[2].unfinishedNum
          this.projectListData[4].todayFinish += this.projectListData[0].todayFinish + this.projectListData[1].todayFinish + this.projectListData[2].todayFinish
        } else {
          // this.jzrate = true
          // this.projectlistLoading = false
          // this.redmineLoading = false
          // this.$message.error({ title: '失败', message: '暂无项目权限，请联系管理员！', type: 'error', duration: 3000 })
          // this.$router.push('/concateErr')
          this.noproFlag = true
        }
      })
    },
    getBugByTImeVal () {
      const end = new Date()
      const start = new Date()
      var End = this.getTimeByDate(end)
      var Start = ''
      if (this.bugTimeType === 1) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        Start = this.getTimeByDate(start)
      } else if (this.bugTimeType === 2) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        Start = this.getTimeByDate(start)
      } else if (this.bugTimeType === 3) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        Start = this.getTimeByDate(start)
      } else {
        Start = ''
        End = ''
      }
      const row = {
        userId: this.userId,
        start: Start,
        end: End
      }
      getBugByTIme(row).then(response => {
        if (response.data.result === 'success') {
          var pbrow = response.data.list
          this.allitems = pbrow
          if (pbrow.length > 0) {
            pbrow.sort(this.compare('probug', false))
          }
          var proname = []
          var probug = []
          var scfknum = []
          pbrow.forEach(item => {
            if (proname.length < 11 && item.proname !== '') {
              probug.push(item.probug)
              proname.push(item.proname)
              scfknum.push(item.scfknum)
            }
          })
          const row = {
            proname: proname,
            probug: probug,
            scfknum: scfknum
          }
          this.echartsitemport('itemport', row)
        } else {
          // this.$message.error(response.data.result)
        }
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
    // 根据获取的权限获取的所有的项目权限
    // getversion (id) {
    //   // 当我点击不同的项目的时候因该获取的所有版本信息id
    //   var obj = {
    //     project_id: id
    //   }
    // },
    // 获取所有的项目数据信息
    // 向后端掉数据redmine规范这一块的数据
    // 像后端掉数据redmine规范这一块的数据
    getchecklist (obj1) {
      // 新接口
      const startdate = new Date()
      const enddate = new Date()
      startdate.setTime(startdate.getTime() - 3600 * 1000 * 24 * 1)
      var end = this.getTimeByDate(enddate)
      var start = this.getTimeByDate(startdate)
      // console.log(end)
      // console.log(start)
      const sendata = {
        project_ids: '',
        start_date: start,
        end_date: end,
        token: this.$cookie.get('token')
      }
      var obj = {}
      var rows = {}
      getEchartsByTime(sendata).then(res => {
        // console.log(res)
        this.redmineLoading = false
        if (res.data.result === 'success') {
          obj.name = res.data.lcname
          obj.num = res.data.lcnum
          rows.name = res.data.autname
          rows.num = res.data.autnum
          // console.log(obj)
          // console.log(rows)
          if (rows.name.length > 0) {
            // this.echartsstandline('leaderstand', obj1)
            this.echartsstandline('leaderstand', rows)
          } else {
            this.righthide = true
          }
          if (obj.name.length > 0) {
            this.echartsredminper('redminper', obj)
          } else {
            this.hideecshow = true
          }
          // this.echartsredminper('redminper', obj)
        }
      })
      const rowsdata = {
        // start_date: '2019-11-01',
        end_date: end,
        project_ids: '',
        token: this.$cookie.get('token')
      }
      getStandardForProject(rowsdata).then(res => {
        // console.log(res)
        var obj = {
          name: [],
          count: []
        }
        if (res.data.result === 'success') {
          obj.name = res.data.projectName
          obj.num = res.data.wgs
        }
        if (obj.name.length > 0) {
          this.echartsredminitem('redminitem', obj)
        } else {
          this.itemhideecshow = true
        }
      })
    },
    arrayCnt (arr, type) {
      var newArr = []
      // 使用set进行数组去重
      newArr = [...new Set(arr)]
      if (type === 'name') {
        return newArr
      } else {
        var newarr2 = new Array(newArr.length)
        for (var t = 0; t < newarr2.length; t++) {
          newarr2[t] = 0
        }
        for (var p = 0; p < newArr.length; p++) {
          for (var j = 0; j < arr.length; j++) {
            if (newArr[p] === arr[j]) {
              newarr2[p]++
            }
          }
        }
        var rowlist = []
        for (var m = 0; m < newArr.length; m++) {
          const row = {
            name: newArr[m],
            num: newarr2[m]
          }
          rowlist.push(row)
        }
        return rowlist
      }
    },
    // getredmindata () {
    //   // 新接口
    //   const startdate = new Date()
    //   const enddate = new Date()
    //   startdate.setTime(startdate.getTime() - 3600 * 1000 * 24 * 1)
    //   var end = this.getTimeByDate(enddate)
    //   var start = this.getTimeByDate(startdate)
    //   const sendata = {
    //     project_ids: '',
    //     end_date: end
    //   }
    //   var obj = {}
    //   var rows = {}
    //   getEchartsByTime(sendata).then(res => {
    //     console.log(res)
    //     this.redmineLoading = false
    //     if (res.data.result === 'success') {
    //       obj.name = res.data.lcname
    //       obj.num = res.data.lcnum
    //       rows.name = res.data.autname
    //       rows.num = res.data.autnum
    //       this.echartsredminper('redminper', obj)
    //       this.echartsstandline('leaderstand', rows)
    //     }
    //   })
    //   const rowsdata = {
    //     start_date: '2019-11-01',
    //     end_date: '2019-11-30',
    //     project_ids: '',
    //     token: this.$cookie.get('token')
    //   }
    //   getStandardForProject(rowsdata).then(res => {
    //     console.log(res)
    //     var obj = {
    //       name: [],
    //       count: []
    //     }
    //     if (res.data.result === 'success') {
    //       obj.name = res.data.projectName
    //       obj.num = res.data.wgs
    //     }
    //     this.echartsredminitem('redminitem', obj)
    //   })
    // },
    getqualitydatav2 () {
      // this.list.sort(this.compare('count', false))
      // var newarr = []
      // var name = []
      // var obj = {}
      // this.list.forEach(item => {
      //   if (newarr.length < 5 && item.proname !== '') {
      //     newarr.push(item.count)
      //     name.push(item.proname)
      //   }
      // })
      // obj.name = name
      // obj.count = newarr
      // this.echartsdemandline('leaderdemand', obj)
      // 提交缺陷分布 bug数发现
      this.quChong(this.list2)
      this.list2.sort(this.compare('count', false))
      var newarr2 = []
      var name2 = []
      var obj2 = {}
      // 缺陷数排在前十的数组对象
      this.list2.forEach(item => {
        if (newarr2.length < 10) {
          newarr2.push(item.count)
          name2.push(item.name)
        }
      })
      obj2.name = name2
      obj2.count = newarr2
      this.echartssubmitline('leadersubmit', obj2)
    },
    getdevjobstaticList () {
      this.xfbuglist.sort(this.compare('count', false))
      var newarr = []
      var name = []
      var obj = {}
      // 缺陷数排在前十的数组对象
      this.xfbuglist.forEach(item => {
        if (newarr.length < 10) {
          newarr.push(item.count)
          name.push(item.name)
        }
      })
      obj.name = name
      obj.count = newarr
      this.echartsrepaireline('leaderRepair', obj)
    },
    getTimeByDate02 () {
      const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    getTimeByDate01 () {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 90)
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const time = `${YY}-${MM}-01`
      return time
    },
    // 获取数组中重复的name数组
    quChong (arr) {
      var newArr = []
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i].name
        var count = 0
        for (let j = 0; j < arr.length; j++) {
          if (arr[j].name === temp) {
            count++
          }
          if (j !== arr.length - 1) {
            newArr.push({name: temp, count: count})
          }
        }
      }
      return newArr
    },
    arrCheck (arr) {
      var newArr = []
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i][7]
        var count = 0
        for (var j = 0; j < arr.length; j++) {
          if (arr[j][7] === temp) {
            count++
            arr[j][7] = -1
          }
        }
        if (temp !== -1) {
          newArr.push({name: temp, count: count})
        }
      }
      return newArr
    },
    demandarrCheck (arr, index) {
      var newArr = []
      for (var i = 0; i < arr.length; i++) {
        var temp = arr[i][index]
        var count = 0
        for (var j = 0; j < arr.length; j++) {
          if (arr[j][index] === temp) {
            count++
            arr[j][index] = -1
          }
        }
        if (temp !== -1) {
          newArr.push({name: temp, count: count})
        }
      }
      return newArr
    },
    // 排序
    compare (property, desc) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        if (desc === true) {
            // 升序排列
          return value1 - value2
        } else {
            // 降序排列
          return value2 - value1
        }
      }
    },
    //   产线问题的echarts
    echartsproline (id, data) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        legend: {
          x: 'center',
          data: ['上月', '本月']
        },
        grid: {
          top: '20%',
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          cursor: 'pointer',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              // color: 'red'
            }
            // crossStyle: {
            //   color: '#f48182'
            //   // color: 'red'
            // }
          },
          formatter: function (params) {
            return params[0].name + '<br/>' + params[0].seriesName + ' : ' + params[0].value + '<br/>' + params[1].seriesName + ':' + params[1].value
          }
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            data: ['新增(月)', '累积待解决(月)'],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '上月',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgb(94,189,124)',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 25,
            cursor: 'pointer',
            data: data.arr2
            // data: [8, 5, 4]
          },
          {
            name: '本月',
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
            cursor: 'pointer',
            data: data.arr1
            // data: [2, 1, 3]
          }

        ]
      }, true)
      // myChart.on('click', (params) => {
      //   console.log(params)
      //   var name = params.name.replace('(月)', '')
      //   const row = {
      //     mouthValue: params.seriesName,
      //     type: name // xz查询新增数据，djj查询累计待解决数据
      //   }
      //   // for (let i = 0; i < this.proinfo.length; i++) {
      //   //   const element = this.proinfo[i]
      //   //   if (element.name === params.name) {
      //   //     row.project_id = element.id
      //   //   }
      //   // }
      //   this.$router.push({path: '/erprob', query: row})
      // })
      myChart.getZr().on('click', (params) => {
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          // console.log(params.offsetX % 88)
          // console.log(pointInPixel)
          var bs = window.innerWidth / 1920
          if (bs < 0.9) {
            bs = 0.82
          }
          // console.log(window.innerWidth / 1920)
          var checkname = op.xAxis[0].data[xIndex]
           // 一半(300-46) / 4
          var name = checkname.replace('(月)', '')
          var a = 46 + (333 * bs - 46) / 4 + xIndex * ((333 * bs - 46) / 2)
          // console.log(a)
          const row = {
            mouthValue: '',
            type: name // xz查询新增数据，djj查询累计待解决数据
          }
          if (params.offsetX > a) {
            // 传本月
            row.mouthValue = '本月'
          } else {
            // 传上月
            row.mouthValue = '上月'
          }
          this.$router.push({path: '/erprob', query: row})
          // console.log(params)
          // console.log(params.offsetX)
        }
      })
    },
    // 未关闭需求的echarts
    echartsdemandline (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        grid: {
          top: '10%',
          left: '5%',
          right: '15%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        legend: {
          // x: '70%',
          y: '0px',
          data: ['进行中需求', '90天未关闭需求']
          // selectedMode: true
        },
        yAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
           // data: ['兴证E家移动版', '兴证E家PC版', '大投行项目', '综合服务中台', '优理宝APP'],
            data: obj.name.reverse(),
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                if (value.length > 4) {
                  return value.substring(0, 4) + '\n' + value.substring(4)
                } else {
                  return value
                }
              }
              // rotate: 15
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#333'  // 设置刻度地下字体颜色
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#333'
              }
            }
          }
        ],
        xAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLine: {
              show: false
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: '进行中需求',
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
            barMaxWidth: 20,
            // data: youdata.success_num_list
            // data: [2, 5, 7, 10, 12]
            data: obj.count.reverse()
          },
          {
            name: '90天未关闭需求',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#F56C6C',
                label: {
                  show: true,
                  position: 'right'
                }
              }
            },
            barMaxWidth: 20,
            // data: youdata.success_num_list
            // data: [2, 5, 7, 10, 12]
            data: obj.out.reverse()
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
          var letIndex = op.yAxis[0].data.length - xIndex - 1
          var ober = params.offsetY - 24
          // console.log(ober)
          // console.log(letIndex)
          var avgdays = 0
          if (ober - letIndex * 34 < 16) {
            // console.log('进行中需求')
            avgdays = 0
          } else {
            // console.log('90天未关闭需求')
            avgdays = 90
          }
          const row = {
            project_id: '',
            type: '1',
            avgdays
          }
          for (let i = 0; i < this.proinfo.length; i++) {
            const element = this.proinfo[i]
            if (element.name === checkname) {
              row.project_id = element.id
            }
          }
          this.$router.push({path: '/erneed', query: row})
        }
      })
    },
    // redmine规范人员的echarts
    echartsstandline (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        grid: {
          left: '5%', // 组件离容器左侧的距离
          right: '4%',
          top: '10%',
          bottom: '1%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
            data: obj.name,
            // minInterval: 1,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              rotate: 45
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
                // width: 20
              }
            },
            axisLine: {
              show: false
            },
            // max: 25,
            // splitNumber: 5
            minInterval: 1
          }
        ],
        series: [
          {
            name: '次数',
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
            areaStyle: {
              normal: {color: '#4b78cd'} // 改变区域颜色
            },
            barMaxWidth: 25,
            data: obj.num
            // data: [23, 20, 18, 15, 12, 10, 9, 7, 5, 2]
          }
        ]
      }, true)
      myChart.getZr().on('click', (params) => {
        // console.log(params)
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          var month = op.xAxis[0].data[xIndex]
          var itemnamearr = op.xAxis[0].data
          var nameid = ''
          getuserdict().then(res => {
            // console.log(res.data)
            // console.log(month)
          //  this.allnamearr = res.data
            res.data.data.forEach(item => {
              // if (month === item.text.substr(2)) {
              //   nameid = item.id
              // }
              if (item.text.includes(month)) {
                nameid = item.id
              }
            })
            // console.log(nameid)
            localStorage.setItem('name', nameid)
            localStorage.setItem('namearr', JSON.stringify(itemnamearr))
            localStorage.removeItem('trackerId')
            localStorage.removeItem('itemname')
            this.$router.push('/erstantard')
          })
        }
      })
    },
    // 提交缺陷的分布
    echartssubmitline (id, obj) {
      // console.log(obj)
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        grid: {
          left: '3%', // 组件离容器左侧的距离
          right: '4%',
          top: '10%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              rotate: 30
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
                // width: 20
              }
            },
            axisLine: {
              show: false
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: '数量',
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
            // data: youdata.error_num_list
            // data: [2, 3, 4, 5, 6, 7, 8, 9, 11, 10]
            data: obj.count
          }
        ]
      }, true)
      myChart.getZr().on('click', (params) => {
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          // console.log(xIndex)
          // console.log(pointInGrid)
          var checkname = op.xAxis[0].data[xIndex]
          // console.log(params)
          const userdata = {
            name: checkname,
            tcbugTimeType: this.tcbugTimeType
          }
          // console.log(params)
          // 根据姓名遍历出作者id
          this.authorsarr.forEach(item => {
            if (item.firstname === checkname) {
              userdata.id = item.author_id
              // console.log(userdata)
              this.$router.push({path: '/esubmission', query: userdata})
            }
          })
        }
      })
    },
    // 修复缺陷
    echartsrepaireline (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        grid: {
          left: '3%', // 组件离容器左侧的距离
          right: '4%',
          top: '10%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              rotate: 30
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
                // width: 20
              }
            },
            axisLine: {
              show: false
            },
            // max: 25,
            // splitNumber: 5
            minInterval: 1
          }
        ],
        series: [
          {
            name: '数量',
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
            // areaStyle: {
            //   normal: {color: '#'} // 改变区域颜色
            // },
            barMaxWidth: 25,
            data: obj.count
            // data: [23, 20, 18, 15, 12, 10, 9, 7, 5, 2]
          }
        ]
      }, true)
    },
    // redmin规范--流程
    echartsredminper (id, obj) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        grid: {
          left: '3%', // 组件离容器左侧的距离
          right: '4%',
          top: '10%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF', '人\n员\nG', '人\n员\nH', '人\n员\nI', '人\n员\nJ'],
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0
              // rotate: 30
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
                // width: 20
              }
            },
            axisLine: {
              show: false
            },
            // max: 25,
            // splitNumber: 5
            minInterval: 1
          }
        ],
        series: [
          {
            name: '次数',
            type: 'line',
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
            areaStyle: {
              normal: {color: '#4b78cd'} // 改变区域颜色
            },
            barMaxWidth: 25,
            data: obj.num
            // data: [23, 20, 18, 15, 12, 10, 9, 7, 5, 2]
          }
        ]
      }, true)
      myChart.getZr().on('click', (params) => {
        // console.log(params)
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          var trackerId = op.xAxis[0].data[xIndex]
          // console.log(itemname)
          var tracker = 0
          gettrackerdict().then(res => {
            // this.trackerdict = res.data
            // var trackername = localStorage.getItem('trackerId')
            // console.log(trackerId)
            // console.log(res)
            res.data.rows.forEach(item => {
              if (item.name === trackerId) {
                tracker = item.id
              }
            })
            localStorage.setItem('trackerId', tracker)
            localStorage.removeItem('itemname')
            localStorage.removeItem('name')
            this.$router.push('/erstantard')
          })
        }
      })
    },
    // redmin规范--项目
    echartsredminitem (id, obj) {
      // console.log(obj)
      if (obj.name.length > 10) {
        var newnum = []
        var newname = []
        for (let i = 0; i < 10; i++) {
          newname.push(obj.name[i])
          newnum.push(obj.num[i])
        }
        obj.name = newname
        obj.num = newnum
      }
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#f48182'
            }
          }
        },
        grid: {
          left: '3%', // 组件离容器左侧的距离
          right: '0%',
          top: '10%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF'],
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              // rotate: 15,
              formatter: function (value) {
                // if (value.length > 8) {
                //   return value.split('/')[0] + '\n' + value.split('/')[1]
                // } else if (value.length > 6) {
                //   return value.substring(0, value.length / 2) + '\n' + value.substring(value.length / 2)
                // } else {
                //   return value
                // }
                if (value.length > 4) {
                  return value.substring(0, 4) + '\n' + '...'
                } else {
                  return value
                }
              }
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
                // width: 20
              }
            },
            axisLine: {
              show: false
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: '数量',
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
            barMaxWidth: 30,
            // data: youdata.error_num_list
            // data: [2, 3, 4, 5, 6, 7]
            data: obj.num
          }
        ]
      }, true)
      myChart.getZr().on('click', (params) => {
        // console.log(params)
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          var itemname = op.xAxis[0].data[xIndex]
          console.log(itemname)
          var itemid = ''
          console.log(this.proinfo)
          this.proinfo.forEach(item => {
            if (item.name === itemname) {
              itemid = item.id
            }
          })
          localStorage.setItem('itemname', itemid)
          localStorage.removeItem('trackerId')
          localStorage.removeItem('name')
          this.$router.push('/erstantard')
        }
      })
    },
    echartsitemport (id, obj) {
      // obj.probug.length <= 5
      if (obj.probug.length > 10) {
        obj.probug = obj.probug.slice(0, 10)
        obj.proname = obj.proname.slice(0, 10)
        obj.scfknum = obj.scfknum.slice(0, 10)
      }
      // console.log(obj)
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
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
          // x: '70%',
          y: '10px',
          data: ['缺陷', '生产反馈累积待解决']
          // selectedMode: true
        },
        grid: {
          left: '3%', // 组件离容器左侧的距离
          right: '4%',
          top: '20%',
          bottom: '5%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            // data: youdata.legend_list,
            // data: ['人\n员\nA', '人\n员\nB', '人\n员\nC', '人\n员\nD', '人\n员\nE', '人\n员\nF'],
            data: obj.proname,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                if (value.length > 7) {
                  return value.substring(0, 7) + '\n' + value.substring(7)
                } else {
                  return value
                }
              }
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
                // width: 20
              }
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '缺陷',
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
            data: obj.probug
            // data: [2, 3, 4, 5, 6, 7]
            // data: obj.count
          },
          {
            name: '生产反馈累积待解决',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgb(94,189,124)',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 50,
            data: obj.scfknum
            // data: [2, 3, 4, 5, 6, 7]
            // data: obj.count
          }
        ]
      }, true)
      myChart.getZr().on('click', (params) => {
        var pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
          var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
          var xIndex = pointInGrid[0]
          var op = myChart.getOption()
          // console.log(params.offsetX % 88)
          // console.log(pointInPixel)
          var bs = window.innerWidth / 1920
          if (bs < 0.9) {
            bs = 0.82
          }
          // console.log(window.innerWidth / 1920)
          var checkname = op.xAxis[0].data[xIndex]
           // 一半(300-46) / 4
          // var name = checkname.replace('(月)', '')
          // var a = 73 + (1396 * bs - 73) / 20 + xIndex * ((1396 * bs - 73) / 10)
          // console.log(a)

          var b = (xIndex + 1) * (window.innerWidth * 0.78 / 6 / 2 * 1.5) + 30 * xIndex
          let userdata = {
            proid: '',
            bugTimeType: this.bugTimeType
          }
          let typedata = {
            proid: '',
            type: '累积待解决',
            bugTimeType: this.bugTimeType
          }
          this.allitems.forEach(item => {
            if (item.proname === checkname) {
              userdata.proid = item.project_id
              typedata.proid = item.project_id
            }
          })
          // console.log(b)
          // console.log(params.offsetX)
          // console.log(a)
          // console.log(xIndex)
          // console.log(op.xAxis[0].data.length)
          if (params.offsetX > b) {
            // 传生产反馈
            this.$router.push({path: '/erprob', query: typedata})
          } else {
            // 传缺陷
            this.$router.push({path: '/esubmission', query: userdata})
          }
          // this.$router.push({path: '/erprob', query: row})
          // console.log(params)
          // console.log(params.offsetX)
        }
      })
      // myChart.on('click', (params) => {
      //   console.log(params)
      //   console.log(this.allitems)
      //   let userdata = {
      //     proid: '',
      //     checktime: this.bugTimeType
      //   }
      //   let typedata = {
      //     proid: '',
      //     type: '累积待解决'
      //   }
      //   this.allitems.forEach(item => {
      //     if (item.proname === params.name) {
      //       userdata.proid = item.project_id
      //       typedata.proid = item.project_id
      //     }
      //   })
      //   if (params.seriesName === '缺陷') {
      //     this.$router.push({path: '/esubmission', query: userdata})
      //   } else if (params.seriesName === '生产反馈累积待解决') {
      //     this.$router.push({path: '/erprob', query: typedata})
      //   }
      // })
    }
  }
}
</script>

<style scoped>
.leader{
    width: 100%;
    margin:15px auto ;
    /* height: 1000px; */
    /* background-color: red; */
    overflow: hidden;
    /* margin-top: 59px; */
}
.leaderheader{
    width: 100%;
    display: flex;
}
.leadertable,
.leaderline,
.leaderdemand,
.leaderstandard{
    flex: 1;
    height: 285px;
    background-color: #fff;
}
.leadertable,
.leaderline,
.leaderdemand{
    margin-right:15px;
}
.leaderline p,
.leaderdemand p,
.leaderstandard p,
.leadersubmit p,
.leaderRepair p,
.leaderregst p{
    margin: 0;
    padding: 15px 0 0 15px;
    font-size: 16px;
    font-weight: 700;
    width: 100%;
}

.leaderfooter{
    width: 100%;
    margin-top: 15px;
    height: 660px;
    display: flex;
}
.leaderregst{
    /* flex: 5; */
    width: 65%;
    background-color: #fff;
    height: 100%;
    margin-right: 15px;
    height: 660px;
}
.leaderdefect{
    /* flex: 3; */
    width: 34%;
    height: 100%;
    display: flex;
    flex-flow: wrap;
}
.leadersubmit{
    width: 100%;
    margin-bottom: 15px;
    height: 320px;
    background-color: #fff;
    display: flex;
    flex-flow: wrap;
}
.leaderRepair{
    width: 100%;
    height: 320px;
    background-color: #fff;
    /* display: flex; */
    /* justify-content: center; */
}
#leaderregst{
  height: 570px;
  /* background-color: red; */
}
.slidebox{
  display: flex;
  flex-flow: wrap;
  width:150px;
  height:360px;
  /* background:pink; */
  position:absolute;
  top:150px;
  left:44px;
}
.slide{
  width: 100%;
  padding-right: 15px;
  height: 46px;
  line-height: 45px;
  /* background-color: yellow; */
  text-align: right;
}
</style>
<style scoped>
  .el-select {
    border: none;
  }
  .el-input--suffix{
    height: 20px;
  }
  .el-input__inner{
    height: 20px;
    text-align: right;
    border: none;
    font-size: 12px;
    padding-left:0;
  }
  .el-select-dropdown__item{
    font-size: 12px;
    padding: 0;
    width: 165px;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  .el-select-dropdown__list{
    padding: 0;
    width: 100px;
  }
  .el-select-dropdown__wrap .el-scrollbar__wrap{
    margin-bottom: 0px !important;
  }
  .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    width: 100px;
  }
  .el-select-dropdown__wrap{
    margin-bottom: 0px !important;    
    width: 100px;
  }
  .el-scrollbar{
    width: 100px;
  }
  .el-popper{
    min-width: 100px !important;
    left: 308px !important;
  }
  .item {
    display: flex;
    align-items: center;
    flex-flow: wrap;
    height: 72px;
  }
  .forbox{
    width: 100%;
    height:52px;
    display: flex;
    align-items: center;
  }
  .el-progress,.box{
    flex: 1;
    margin-left: 20px;
  }
  .box{
    font-size: 14px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .iteminfo{
    width: 147px;
    height: 52px;
    text-align: right;
    margin-bottom: 19px;
  }
  .el-progress-bar__outer{
    height: 35px !important;
  }
  .el-progress-bar{
    height: 35px !important;
  }
  .addviews{
    width: 100%;
    height: 250px;
    /* background-color: #fff; */
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
  }
  .redminper{
    flex: 1;
    margin-right: 15px;
    background-color: #fff;
  }
  .redminper p,
  .redminitem p,
  .itemport p{
    margin: 0;
    padding: 15px 0 0 15px;
    font-size: 16px;
    font-weight: 700;
  }
  .redminitem{
    flex: 1;
    background-color: #fff;
  }
  .itemport{
    margin-top: 15px;
    width: 100%;
    background-color: #fff;
    height:262px;
    position: relative;
  }
  .rleft{
    /* width: 49%; */
    flex: 1;
    margin-right: 15px;
  }
  .rright{
    /* width: 49%; */
    flex: 1;
  }
  .boxradios{
    /* margin: auto; */
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: 15px;
  /* margin-left: 200px; */
  }
  .ranking{
    width:100%;
    margin-top:15px;
    display:flex;
    padding-bottom:50px;
  }
  .allinfo{
    flex: 1;
    margin-left: 20px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
</style>

<style>
  .el-message,.el-message--success{
    z-index: 19999 !important;
  }
  .el-message,.el-message--error{
    z-index: 19999 !important;
  }
  #leaderline>div>canvas:hover{
    cursor: pointer;
  }
  #leaderdemand>div>canvas:hover{
    cursor: pointer;
  }
  #leaderstand>div>canvas:hover{
    cursor: pointer;
  }
  #leadersubmit>div>canvas:hover{
    cursor: pointer;
  }
  #leaderRepair>div>canvas:hover{
    cursor: default;
  }
  #itemport>div>canvas:hover{
    cursor: pointer;
  }
  #redminper>div>canvas:hover{
    cursor: pointer;
  }
  #redminitem>div>canvas:hover{
    cursor: pointer;
  }
  .itemversion .el-select {
    border: none;
  }
  .itemversion .el-input--suffix{
    height: 20px;
  }
  .itemversion .el-input__inner{
    height: 20px;
    text-align: right;
    border: none;
    font-size: 12px;
    padding-left: 0;
  }
  .itemversion .el-select-dropdown__item{
    font-size: 12px;
    padding: 0;
    width: 140px;
    text-align: center;
    height: 30px;
    line-height: 30px;
  }
  .itemversion .el-select-dropdown__list{
    padding: 0;
    width: 150px;
  }
  /* .el-select-dropdown__wrap .el-scrollbar__wrap{
    margin-bottom: 0px !important;
  } */
  .itemversion .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    width: 100px;
  }
  .itemversion .el-select-dropdown__wrap{
    margin-bottom: 0px !important;    
    width: 100px;
  }
  
  .itemversion >>> .el-scrollbar{
    width: 100px;
  }
  .iteminfo >>> .el-popper{
    min-width: 100px !important;
  }
  .el-select-dropdown__wrap,.el-scrollbar__wrap{
    margin-bottom: 0 !important;
  }
  .itemversion >>> .el-select-dropdown,.el-popper{
    min-width: 130px !important;
    left: 280px !important;
  }
  .el-select-dropdown .popper__arrow{
    left: 70px !important;
  }
  /* .leadselect .el-select-dropdown,.el-popper{
    min-width: 160px !important;
  } */
  .askitem{
    display: flex;
    width: 80%;
    /* margin-left: 18%; */
    height: 40px;
    /* padding-right: 30px; */
    /* justify-content: space-between; */
  }
  .titleitemname{
    /* flex: 1; */
    width: 170px;
    text-align: center;
    margin-left: 20px;
    /* line-height: 40px; */
  }
  .itemname{
    display: flex;
    justify-content: center;
    align-items: flex-start;
    /* height: 32px; */
    flex: 1;
    font-size: 14px;
    /* line-height: 40px; */
    text-align: center;
  }
  .itemname div{
    font-size: 14px;
  }
  .first .el-progress-bar__inner{
    background-color: #4b78cd;
  }
  .second .el-progress-bar__inner{
    background-color: rgb(94,189,124);
  }
  .el-progress-bar__inner{
    text-align: center;
  }
  /* .content{
    height: 2000px !important;
  } */
  .el-table .warning-row {
    background: rgba(204, 225, 245, 1);
  }
  .el-table .success-row {
    background: #ffffff;
  }
  .el-table .pink-row{
    background-color: rgba(243, 216, 216, 1);
  }
  /* .ltab >>>.el-table__header tr,
  .el-table__header th {
    padding: 0;
    height: 30px;
}
.ltab >>>.el-table__body tr,
  .el-table__body td {
    padding: 0;
    height: 30px;
} */
.el-table .sort-caret.ascending{
  border-bottom-color:#ccc;
}
.el-table .sort-caret.descending{
  border-top-color:#ccc;
}
/* .el-progress-bar__innerText{
  color: rgb(73, 73, 73);
} */
.el-progress-bar__outer{
  background-color: #606061;
}
#leaderregst::-webkit-scrollbar {
  display: block
}
.raibox{
  display: flex;
  width: 100%;
  height: 36px;
}
.el-radio+.el-radio{
  margin-left: 10px;
}
/* .leadbtn,.el-button:focus, .el-button:hover{
  color: #000;
  border-color: transparent;
  background-color: #fff;
} */
/* .leadbtn,.el-button:hover{
  color: #000;
  background-color: #fff;
} */
.el-tooltip__popper.is-light{
  border: 1px solid #aaa;
  margin-bottom:4px;
}
.el-input--suffix .el-input__inner{
  padding-right: 24px;
}
.el-table{
  z-index: 0 !important;
}
.el-scrollbar__wrap{
  overflow: auto !important;
}

  .el-scrollbar__thumb{
    background-color: transparent !important;
  }
  .el-table--scrollable-x,.el-table__body-wrapper{
    overflow-x:hidden !important;
  }
</style>

<style lang="scss" scoped>
.leadbun:hover{
  background-color: #fff;
  color: #000;
}

// .titlebox,.el-tooltip__popper{
//   height: 8px;
//   line-height: 5px;
// }
</style>

<style>
  .leader .el-dialog__wrapper{
    z-index: 20001 !important;
  }
</style>
