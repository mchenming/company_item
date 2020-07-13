<template>
  <div class="planEcharts">
    <div style="display:flex;align-items:center;background: white;height:50px;">
      <div style="margin-left:30px">项目</div>
      <el-select filterable v-model="listQuery.projectId" style="margin-left:10px;position:relative" @change="getversiondict('1', 0)" class="fixedSearch" popper-class='onmouthFix'>
        <div class="ddBox" style="width:100%">
          <el-input placeholder="请输入搜索内容" style="padding:0 15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp' class="fixedBox"></el-input>
        </div>
        <el-option
          v-for="projectItem in projectOptions"
          :key="projectItem.id"
          :label='projectItem.name'
          :value='projectItem.id'
          >
        </el-option>
      </el-select>
      <el-select filterable v-model="listQuery.versionId" style="margin-left:30px" @change="getprojectdatav2" popper-class='onmouthFix'>
        <div class="ddBox">
          <el-input placeholder="请输入搜索内容" style="padding:0 15px;" v-model='versearchText' @input="versearchInfo" @focus='leaveinps'></el-input>
        </div>
        <el-option
          v-for="versionItem in versionOptions"
          :key="versionItem.id"
          :label='versionItem.name'
          :value='versionItem.id'>
        </el-option>
      </el-select>
      <el-select filterable v-model="reqId" style="margin-left:30px;width:50%;" multiple @change="reqChange" value-key="id" popper-class='onmouthFix'>
        <div class="ddBox" style="width:100%">
          <el-input placeholder="请输入搜索内容" style="padding:0 15px;" v-model='reqsearchText' @input="reqsearchInfo"></el-input>
        </div>
        <el-option
          v-for="reqItem in reqOptions"
          :key="reqItem.id"
          :label='reqItem.text'
          :value='reqItem.id'>
        </el-option>
      </el-select>
    </div>
    <div style="margin-top:10px;">
      <el-row style="margin-top:10px;">
        <el-col :span="7"  id="thchange" v-loading='topLoading'>
          <el-table class="el-table_header" ref="multipleTable" :data="projectListData" v-loading="projectlistLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 98%;margin-left:0px;height:300px;font-size: 13px;text-align:center;"
            :row-style="{height:'42px'}" :header-cell-style="{background: '#a7d2f9', color: '#fff'}">
            <el-table-column align="center" min-width=40 label="指标" height=33>
              <template slot-scope='scope'>
                <div >{{scope.row.indtype}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=25 label="总计" height=33>
              <template slot-scope='scope'>
                <div >{{scope.row.all_num}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=25 label="未完成" height=33>
              <template slot-scope='scope'>
                <div>{{scope.row.unclose_num}}
                  <!-- <img v-if="scope.row.type === 'up' && scope.row.indtype === '缺陷'" style="width: 15px; height: 15px" src="~@/assets/img/up1.png">
                  <img v-if="scope.row.type === 'down' && scope.row.indtype === '缺陷'" style="width: 15px; height: 15px" src="~@/assets/img/down2.png"> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=40 label="今日完成" height=33>
              <template slot-scope="scope">
                <div>{{scope.row.today_num}}
                  <img v-if="Number(scope.row.today_num) < 0 && scope.row.indtype === 'Redmine不规范'" style="width: 15px; height: 15px" src="~@/assets/img/up1.png">
                  <img v-if="Number(scope.row.today_num) > 0 && scope.row.indtype === 'Redmine不规范'" style="width: 15px; height: 15px" src="~@/assets/img/down2.png">
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="13">
          <div style="height: 30px;background-color: white;width: 99%;">
              <div style="height: 13px;background-color: white;width: 99%;"></div>
              <b style="margin-left: 15px;margin-top: 10px;font-size: 16px;">Bug趋势</b>
          </div>
          <div style="background-color: white;width:99%;height:270px;">
            <div id='bugTrend' ref="bugTrend" style="margin:auto"></div>
          </div>
          <!-- <el-carousel trigger="click" height="300px" style="width:99%;" :interval="5000">
            <el-carousel-item>
              <div style="height: 30px;background-color: white;width: 100%;">
                  <div style="height: 13px;background-color: white;width: 100%;"></div>
                  <b style="margin-left: 15px;margin-top: 10px;font-size: 16px;">Bug趋势</b>
              </div>
              <div style="background-color: white;width:100%;height:270px;">
                <div id='bugTrend' ref="bugTrend" style="margin:auto"></div>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div style="height: 30px;background-color: white;width: 100%;">
                  <div style="height: 13px;background-color: white;width: 100%;"></div>
                  <b style="margin-left: 15px;margin-top: 10px;font-size: 16px;">偏离趋势</b>
              </div>
              <div style="background-color:#fff;width:100%;height:270px">
                <div id='bugTrendpianli' ref="bugTrendpianli" style="margin:auto;height:270px;"></div>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div style="height: 30px;background-color: white;width: 100%;">
                  <div style="height: 13px;background-color: white;width: 100%;"></div>
                  <b style="margin-left: 15px;margin-top: 10px;font-size: 16px;">Bug趋势</b>
              </div>
              <div style="background-color: white;width:100%;height:270px;">
                <div id='bugTrend2' ref="bugTrend2" style="margin:auto;height:270px;"></div>
              </div>
            </el-carousel-item>
            <el-carousel-item>
              <div style="height: 30px;background-color: white;width: 100%;">
                  <div style="height: 13px;background-color: white;width: 100%;"></div>
                  <b style="margin-left: 15px;margin-top: 10px;font-size: 16px;">偏离趋势</b>
              </div>
              <div style="background-color:#fff;width:100%;height:270px;">
                <div id='bugTrendpianli2' ref="bugTrendpianli2" style="margin:auto;height:270px;"></div>
              </div>
            </el-carousel-item>
          </el-carousel> -->
        </el-col>
        <el-col :span="4">
          <div style="height: 80px;background-color: white;width: 100%;">
            <div style="height: 13px;background-color: white;width: 100%;"></div>
            <div style="position: relative;">
              <b style="margin-left: 15px;font-size: 16px;position: absolute;line-height:25px;">计划完成日期</b>
              <div v-if="planmess !== ''" 
                style="width: 30%;height: 25px;background-color: #fef1f1;position: absolute;margin-left: 65%;text-align: center;line-height: 25px;">
                <span style="color: #f56c6c;">{{planmess}}</span>
              </div>
            </div><br/>
            <div style="height: 15px;background-color: white;width: 100%;"></div>
            <b style="margin-left: 20%;font-size: 23px;">{{finishDate}}</b>
          </div>
          <div style="background-color: white;width:100%;height:80px;margin-top: 10px;">
            <div style="height: 13px;background-color: white;width: 100%;"></div>
            <b style="margin-left: 15px;font-size: 16px;">项目进度</b>
            <div class="projectProcess" v-loading='topLoading'>{{projectProcess}}</div>
          </div>
          <div style="width:100%;margin-top:10px;height:120px;background-color:#fff;padding-top:13px;">
            <div style="margin-left: 15px;font-weight:700;font-size:16px;margin-bottom:10px;">完成需求数</div>
            <div style="width:100%;display:flex;">
                <el-radio-group v-model="radio" style="padding-left:10px;margin:0 0 10px 15px;flex:1" @change="changereqnum" class="reqradios">
                  <el-radio :label="3">近一月</el-radio>
                  <el-radio :label="6">近三月</el-radio>
                  <el-radio :label="9">近六月</el-radio>
                </el-radio-group>
              <div style="width:100%;text-align:center;font-size:30px;flex:2;line-height:50px;margin-right:30px;">{{mouthreqnum}}</div>
              <!-- <div style="width:100%;text-align:center;font-size:30px;flex:2;line-height:50px;">12</div> -->
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top:10px;">
      <el-tabs type="border-card" v-model="tabActiveName" @tab-click='tabClick()' style="background-color: #f2f2f2;">
        <el-tab-pane label="需求" name="one">
          <el-row style="margin-top:10px;display:none;">
            <el-col id="building-top">
              <el-table border ref="multipleTable" :data="reqTaskListData1" v-loading="listLoading" element-loading-text="加载中。。。"
                tooltip-effect="dark" style="width: 100%;min-height:200px;font-size: 13px;" :header-cell-style="{background: '#5ca4e5', color: '#fff'}">
                <el-table-column align="center" width=400 label="需求" type="index" height=33>
                  <template slot-scope='scope'>
                    <div style="text-align:left">{{maxText(scope.row.reqname)}}</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width=120 label="需求设计>计划完成日期>完成/总计" height=33 :render-header="renderHeader">
                  <template slot-scope='scope'>
                    <!-- <div v-if='scope.row.reqTime=== "--" || scope.row.reqTime=== ""'><span style="display:inline-block;width:205px;text-align:left;float:left;padding-left:100px;">--</span><span style="float:left">{{scope.row.reqRate}}</span></div> -->
                    <!-- <div v-else><span style="display:inline-block;width:205px;text-align:left;float:left;padding-left:65px;">{{scope.row.reqTime}}</span><span style="float:left">{{scope.row.reqRate}}</span></div> -->
                    <!-- <div><div style="display:inline-block;width:50%;float:left;height:30px;">{{scope.row.reqTime}}</div><span>{{scope.row.reqRate}}</span></div> -->
                    <div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-if="scope.row.reqTime===null">--</div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-else>{{scope.row.reqTime}}</div>
                      <span>{{scope.row.reqRate}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width=100 label="开发>完成日期>完成/总计" height=33 :render-header="renderHeader">
                  <template slot-scope='scope'>
                    <!-- <div v-if='scope.row.kfTime=== "--" || scope.row.kfTime=== ""'><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:75px;">{{scope.row.kfTime}}</span><span style="float:left">{{scope.row.reqRate}}</span></div>
                    <div v-else><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:10px;">{{scope.row.kfTime}}</span><span style="float:left">{{scope.row.kfRate}}</span></div> -->
                    
                    <div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-if="scope.row.kfTime===null">--</div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-else>{{scope.row.kfTime}}</div>
                      <span>{{scope.row.kfRate}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width=100 label="测试>完成日期>完成/总计" height=33 :render-header="renderHeader">
                  <template slot-scope='scope'>
                    <!-- <div v-if="scope.row.testTime==='--' || scope.row.testTime===''"><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:75px;">{{scope.row.testTime}}</span><span style="float:left">{{scope.row.testRate}}</span></div>
                    <div v-else><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:15px;">{{scope.row.testTime}}</span><span style="float:left">{{scope.row.testRate}}</span></div> -->
                    <!-- {{scope.row}} -->
                    <div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-if="scope.row.testTime===null">--</div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-else>{{scope.row.testTime}}</div>
                      <span>{{scope.row.testRate}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width=100 label="上线>完成日期>完成/总计" height=33 :render-header="renderHeader">
                  <template slot-scope="scope">
                    <!-- <div v-if="scope.row.sxTime==='--' || scope.row.sxTime===''"><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:75px;">--</span><span style="float:left">{{scope.row.sxRate}}</span></div>
                    <div v-else><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:15px;">{{scope.row.sxTime}}</span><span style="float:left">{{scope.row.sxRate}}</span></div> -->
                    
                    <div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-if="scope.row.sxTime===null">--</div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-else>{{scope.row.sxTime}}</div>
                      <span>{{scope.row.sxRate}}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>

          <div v-if="gantShow">
            <wlGantt
              ref="wl-gantt-demo"
              :start-date='GantTime[0]'
              :end-date="GantTime[1]"
              :autoGanttDateType='false'
              date-type="yearAndWeek"
              :data="componentsdata"
              :header-cell-style="{background: '#4b78cd', color:'#fff'}"
              :contextMenuOptions="contextMenuOptions"
              @cell-mouse-enter='setCom'
            ></wlGantt>
          </div>

          <el-table border ref="multipleTable" :data="rateData1" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;" 
            :default-sort="{prop: '', order: ''}"
            @sort-change="changeOrder1">
            <el-table-column align="center" width=100 label="需求ID" sortable="custom" prop="id" height=33>
              <template slot-scope='scope'>
                <div v-html="scope.row.id"></div>
                
              </template>
            </el-table-column>
            <el-table-column align="center" width=90 label="优先级" sortable="custom" prop="priority_id" height=33>
              <template slot-scope='scope'>
                <div v-if="scope.row.priority_id === '1'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto">
                  <span style="color: #409eff">低</span></div>
                <div v-if="scope.row.priority_id === '2'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto">
                  <span style="color: #409eff">普通</span></div>
                <div v-if="scope.row.priority_id === '3'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto">
                  <span style="color: #67c23a">高</span></div>
                <div v-if="scope.row.priority_id === '4'" style="width: 50px;height: 30px;background-color: #fdf6ec;line-height: 30px;margin:auto">
                  <span style="color: #e6a23c">紧急</span></div>
                <div v-if="scope.row.priority_id === '5'" style="width: 50px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto">
                  <span style="color: #f56c6c">立刻</span></div> 
                 
              </template>
            </el-table-column>
            <el-table-column align="center"  label="主题" sortable="custom" prop="subject" height=33>
              <template slot-scope='scope'>
                <div  style="text-align:left">{{maxText(scope.row.subject)}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=90 label="状态"  sortable="custom" prop="name" height=33>
              <template slot-scope="scope">
                <!-- <div v-if="scope.row.status_id === '已关闭'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;">
                  <span style="color: #67c23a">{{scope.row.status_id}}</span>
                </div>
                <div v-else-if="scope.row.status_id === '暂停'" style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;">
                  <span style="color: #f56c6c">{{scope.row.status_id}}</span>
                </div>
                <div v-else style="width: 70px;height: 30px;background-color: #ecf5ff;line-height: 30px;">
                  <span style="color: #409eff">{{scope.row.status_id}}</span>
                </div> -->
                  <span>{{scope.row.status_id}}</span>
              </template>
            </el-table-column>
            <el-table-column sortable="custom" prop="bugnum" align="center" width=100 label="bug数" height=33>
              <template slot-scope='scope'>
                <div>{{scope.row.bugnum}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=140 label="未关闭bug数" height=33 sortable="custom" prop="bugunnum">
              <template slot-scope='scope'>
                <div>{{scope.row.bugunnum}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=100 label="用例数" height=33 sortable="custom" prop="ccase">
              <template slot-scope='scope'>
                <div>{{scope.row.ccase}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="指派给"  sortable="custom" prop="assigned" height=33>
              <template slot-scope='scope'>
                <div>{{scope.row.assigned}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="需求提出人"  sortable="custom" prop="author" height=33>
              <template slot-scope='scope'>
                <div>{{scope.row.author}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=150 label="创建时间" height=33 sortable="custom" prop="created_on">
              <template slot-scope='scope'>
                <div>{{scope.row.created_on}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="产线" name="six">
          <el-row style="margin-top:10px;">
            <el-col>
              <div style="height: 30px;background-color: white;width: 100%;padding:15px 30px;">
                <b style="margin-left: 15px;font-size: 16px;">产线问题分布</b>
              </div>
              <div style="background-color: white;width:100%;height:240px;">                
                <div id='productSpread' ref="productSpread" style="align-content: center; margin:auto;">
                </div>
              </div>
            </el-col>
          </el-row>
          <el-tabs v-model="proactiveName" class="nowpro" style="padding:15px 30px 0 30px;margin-top:20px;background-color:#fff;" id="nowpro" @tab-click="handlePro">
            <el-tab-pane label="当前版本解决的产线问题" name="first"></el-tab-pane>
            <el-tab-pane label="全部产线问题" name="second"></el-tab-pane>
          </el-tabs>
          <div class="dateCss" style="display:flex;justify-content:space-between" v-if="proactiveName==='second'">
            <div style="display:flex;align-items:center;">
              <div style="margin-left:30px;margin-right: 10px;">统计月份</div>
              <el-date-picker
                v-model="queryMonth"
                type="month"
                @change="getprojectdatav9"
                value-format="yyyy-MM" class="setdate">
              </el-date-picker>
            </div>
            <!-- <div style="margin-right:30px;">
              <span style="color:#4b78cd;cursor:pointer;">查看全部</span>
            </div> -->
          </div>
          <el-table ref="multipleTable" :data="rateData1" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;min-height:200px;font-size: 13px;"
            :default-sort="{prop: '', order: ''}"
            @sort-change="changeOrder1">
            <el-table-column align="center" width=120 label="缺陷ID" height=33 sortable="custom" prop="id">
              <template slot-scope='scope'>
                <div  v-html="scope.row.id" v-if="proactiveName==='second'"></div>
                <div v-else-if="proactiveName==='first'" style="text-decoration:underline;color:#4b78cd;cursor:pointer" @click="goredmine(scope.row.id)">#{{scope.row.id}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="优先级" height=33 sortable="custom" prop="priority_id">
              <template slot-scope='scope'>
                <div v-if="scope.row.priority_id === '1'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #409eff">低</span></div>
                <div v-if="scope.row.priority_id === '2'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #409eff">普通</span></div>
                <div v-if="scope.row.priority_id === '3'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #67c23a">高</span></div>
                <div v-if="scope.row.priority_id === '4'" style="width: 50px;height: 30px;background-color: #fdf6ec;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #e6a23c">紧急</span></div>
                <div v-if="scope.row.priority_id === '5'" style="width: 50px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #f56c6c">立刻</span></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="主题" height=33 sortable="custom" prop="subject">
              <template slot-scope='scope'>
                <div  style="text-align:left">{{scope.row.subject}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="创建时间" height=33 sortable="custom" prop="created_on">
              <template slot-scope='scope'>
                <div  style="text-align:left" v-if="scope.row.created_on">{{scope.row.created_on.substr(0,10)}}</div>
                <div  style="text-align:left" v-else>{{scope.row.created_on}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="更新时间" height=33 sortable="custom" prop="updated_on">
              <template slot-scope='scope'>
                <div  style="text-align:left" v-if="scope.row.updated_on">{{scope.row.updated_on.substr(0,10)}}</div>
                <div  style="text-align:left" v-else>{{scope.row.updated_on}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="状态" height=33 sortable="custom" prop="status_id">
              <template slot-scope='scope'>
                <!-- <div v-if="scope.row.status_id === '已关闭'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #67c23a">{{scope.row.status_id}}</span>
                </div>
                <div v-else-if="scope.row.status_id === '拒绝修复'" style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #f56c6c">{{scope.row.status_id}}</span>
                </div>
                <div v-else style="height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #409eff;">{{scope.row.status_id}}</span>
                </div> -->
                {{scope.row.status_id}}
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="指派给" height=33 sortable="custom" prop="assigned_to">
              <template slot-scope="scope">
                <div >{{scope.row.assigned_to}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="反馈者" height=33 sortable="custom" prop="zhanzhe">
              <template slot-scope='scope'>
                <div >{{scope.row.zhanzhe}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="作者" height=33 sortable="custom" prop="author">
              <template slot-scope='scope'>
                <div >{{scope.row.author}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="任务" name="four">
          <el-row style="margin-top:10px;">
            <el-col :span="14" >
              <div style="height: 35px;background-color: white;width: 99%;padding:15px 30px;">
                <b style="margin-left: 15px;font-size: 16px;">任务分布</b>
              </div>
              <div style="background-color: white;width:99%;height:240px; overflow-y:auto" class="renwu" ref='taskscroll'> 
                <!-- <div class="scrollecs"> -->
                  <div id='taskSpread' ref="taskSpread" style="margin:0 auto;position:relative;z-index:1000"></div>
                <!-- </div> -->
              </div>
            </el-col>
            <el-col :span="10">
              <div style="height: 35px;background-color: white;width: 100%;padding:15px 30px;">
                <b style="margin-left: 15px;font-size: 16px;">任务统计</b>
              </div>
              <div style="background-color: white;width:100%;height:240px;">
                <div id='taskTotal' ref="taskTotal" style="margin:0 auto"></div>
              </div>
            </el-col>
          </el-row>
          <el-table ref="multipleTable" :data="rateData1" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;"
            :default-sort="{prop: '', order: ''}"
            @sort-change="changeOrder1">
            <el-table-column align="center" width=110 label="任务ID" height=33 sortable="custom" prop="id">
              <template slot-scope='scope'>
                <div v-html="scope.row.id"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="优先级" height=33 sortable="custom" prop="priority_id">
			        <template slot-scope='scope'>
                <div v-if="scope.row.priority_id === '1'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">低</span></div>
                <div v-if="scope.row.priority_id === '2'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">普通</span></div>
                <div v-if="scope.row.priority_id === '3'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">高</span></div>
                <div v-if="scope.row.priority_id === '4'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">紧急</span></div>
                <div v-if="scope.row.priority_id === '5'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">立刻</span></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="主题" height=33 sortable="custom" prop="subject">
              <template slot-scope='scope'>
                <div  style="text-align:left">{{scope.row.subject}}</div>
              </template>
            </el-table-column>
            
            <el-table-column align="center" width=120 label="创建时间" height=33 sortable="custom" prop="created_on">
              <template slot-scope='scope'>
                <div  style="text-align:left" v-if="scope.row.created_on">{{scope.row.created_on.substr(0,10)}}</div>
                <div  style="text-align:left" v-else>{{scope.row.created_on}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="更新时间" height=33 sortable="custom" prop="updated_on">
              <template slot-scope='scope'>
                <div  style="text-align:left" v-if="scope.row.updated_on">{{scope.row.updated_on.substr(0,10)}}</div>
                <div  style="text-align:left" v-else>{{scope.row.updated_on}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=110 label="任务类型" height=33 sortable="custom" prop="tracker">
              <template slot-scope='scope'>
                <div v-if="scope.row.tracker === '5'">开发</div>
                <div v-if="scope.row.tracker === '7'">测试</div>
                <div v-if="scope.row.tracker === '11'">其他任务</div>

              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="状态" height=33 sortable="custom" prop="status_id">
              <template slot-scope="scope">
                {{scope.row.status_name}}
                <!-- <div v-if="scope.row.status_name === '编码完成'" style="width: 70px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row.status_name}}</span>
                </div>
                <div v-else-if="scope.row.status_name === '已关闭'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row.status_name}}</span>
                </div>
                <div v-else style="height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row.status_name}}</span>
                </div> -->
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="指派给" height=33 sortable="custom" prop="assigned">
              <template slot-scope='scope'>
                <div >{{scope.row.assigned}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=130 label="计划完成时间" height=33 sortable="custom" prop="due_date">
              <template slot-scope='scope'>
                <div >{{scope.row.due_date}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="不规范" name="five">
          <el-row style="margin-top:10px;">
            <el-col class="changenormdraw">
              <div style="height: 30px;background-color: white;width: 100%;padding:15px 30px;">
                <b style="margin-left: 15px;font-size: 16px;">不规范趋势</b>
              </div>
              <!-- <div style="background-color: white;width:100%;height:240px;"> -->
                <div id='normdraw' ref="normdraw" style="width:100%;background:white;margin:auto"></div>
              <!-- </div> -->
            </el-col>
          </el-row>
          <el-table ref="multipleTable" :data="rateData12" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;"
            :default-sort="{prop: '', order: ''}"
            @sort-change="normchangeOrder2">
            <el-table-column align="center" width=130 label="不规范问题ID" height=33 sortable="custom" prop="id">
              <template slot-scope='scope'>
                <div  v-html="scope.row.id"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="流程" height=33 sortable="custom" prop="tracker_id">
              <template slot-scope='scope'>
                <div v-if="scope.row.tracker_id === '需求'" style="width: 80px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row.tracker_id}}</span></div>
                <div v-else-if="scope.row.tracker_id === '生产反馈'" style="width: 80px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row.tracker_id}}</span></div>
                <div v-else style="width: 80px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row.tracker_id}}</span></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="标题" height=33 sortable="custom" prop="subject">
              <template slot-scope='scope'>
                <div  style="text-align:left">{{scope.row.subject}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="错误原因" height=33 sortable="custom" prop="reason">
              <template slot-scope='scope'>
                <div >{{scope.row.reason}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="状态" height=33 sortable="custom" prop="status_id">
              <template slot-scope="scope">
                <div v-if="scope.row.status_id === '已关闭'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row.status_id}}</span>
                </div>
                <div v-else-if="scope.row.status_id === '拒绝修复' || scope.row.status_id === '延期'" style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row.status_id}}</span>
                </div>
                <div v-else style="width: 70px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row.status_id}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="分配给" height=33 sortable="custom" prop="assigned">
              <template slot-scope='scope'>
                <div >{{scope.row.assigned}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="创建日期" height=33 sortable="custom" prop="created">
              <template slot-scope='scope'>
                <div >{{scope.row.created}}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagenumchoose" style="background-color:#fff;height:50px;">
          <el-pagination
           @size-change="sizeChangeHandle"
           @current-change="currentChangeHandle"
           :current-page="listQuery.page"
           :page-sizes="[10, 20, 50, 100]"
           :page-size="listQuery.pageSize"
           :total="totalFive"
           popper-class="mouFix"
           layout="total, sizes, prev, pager, next"
          class="pagenum">
          </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用例" name="two">
          <el-row style="margin-top:10px;" class="useexam">
            <el-col :span="4"  class="progresscss useprocss">
              <div class="progresspart">
                <div class="passTextCss">
                  <span>用例执行进度</span>
                  <span>{{caseExecution}}%</span>
                </div>
                <el-progress type="circle" class="caseExecutionCss" :stroke-width=strokeWidth :width=progressWidth :stroke='"pink"' :percentage="caseExecution" :show-text='false'></el-progress>
              </div>
            </el-col>
            <el-col :span="4"  class="progresscss useprocss" style="margin-right:10px">
                <div class="progresspart">
                  <div class="passTextCss">
                    <span>执行通过率</span> <br/>
                    <span>{{caseRate}}%</span>
                  </div>
                  <el-progress type="circle" class="caseRateCss" :stroke-width=strokeWidth :width=progressWidth :percentage="caseRate" :show-text='false'>成功率</el-progress>
                </div>
            </el-col>
            <el-col :span="16" class="lineprogress">
              <div style="height: 0px;background-color: white;width: 100%;padding:10px 30px;">
                <b style="margin-left: 15px;font-size: 16px;">用例分布</b>
              </div>
              <div style="background-color: white;width:100%;height:220px;">
                <div id='caseSpread' ref="caseSpread" style="margin:0 auto; "></div>
              </div>
            </el-col>
          </el-row>
          <el-table ref="multipleTable" :data="rateData1" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;"
            :default-sort="{prop: '', order: ''}"
            @sort-change="changeOrder1">
            <el-table-column align="center" width=100 label="用例ID" height=33 sortable="custom" prop="id">
              <template slot-scope='scope'>
                <div  v-html="scope.row.id"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=85 label="优先级" height=33 sortable="custom" prop="priority_id">
			              <template slot-scope='scope'>
                <div v-if="scope.row.priority_id === '1'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">低</span></div>
                <div v-if="scope.row.priority_id === '2'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">普通</span></div>
                <div v-if="scope.row.priority_id === '3'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">高</span></div>
                <div v-if="scope.row.priority_id === '4'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">紧急</span></div>
                <div v-if="scope.row.priority_id === '5'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">立刻</span></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="主题" height=33 sortable="custom" prop="subject">
              <template slot-scope='scope'>
                <div  style="text-align:left">{{scope.row.subject}}</div>
              </template>
            </el-table-column>
            
            <el-table-column align="center" width=120 label="创建时间" height=33 sortable="custom" prop="created_on">
              <template slot-scope='scope'>
                <div  style="text-align:left" v-if="scope.row.created_on">{{scope.row.created_on.substr(0,10)}}</div>
                <div  style="text-align:left" v-else>{{scope.row.created_on}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="更新时间" height=33 sortable="custom" prop="updated_on">
              <template slot-scope='scope'>
                <div  style="text-align:left" v-if="scope.row.updated_on">{{scope.row.updated_on.substr(0,10)}}</div>
                <div  style="text-align:left" v-else>{{scope.row.updated_on}}</div>
              </template>
            </el-table-column>

            <el-table-column align="center" width=85 label="状态" height=33 sortable="custom" prop="status_id">
              <template slot-scope="scope">
                <div >{{scope.row.status_id}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=100 label="执行结果" height=33 sortable="custom" prop="jieguo">
              <template slot-scope="scope">
                <div v-if="scope.row.jieguo === '通过'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row.jieguo}}</span>
                </div>
                <div v-else-if="scope.row.jieguo === '不通过'" style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row.jieguo}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=100 label="测试类别" height=33 sortable="custom" prop="liexing">
              <template slot-scope="scope">
                <div >{{scope.row.liexing}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=85 label="指派给" height=33 sortable="custom" prop="assigned">
              <template slot-scope='scope'>
                <div >{{scope.row.assigned}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=85 label="作者" height=33 sortable="custom" prop="author">
              <template slot-scope='scope'>
                <div >{{scope.row.author}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="Bug" name="three">
          <el-row style="margin-top:10px;">
            <el-col :span="12" >
              <div style="height: 30px;background-color: white;width: 95%;padding:15px 30px;">
                <b style="margin-left: 15px;font-size: 16px;">测试问题分布</b>
              </div>
              <div style="background-color: white;width:95%;height:240px;">
                <div id='testBug' ref="testBug" style="margin:0 auto;"></div>
              </div>
            </el-col>
            <el-col :span="12">
              <div style="height: 30px;background-color: white;width: 100%;padding:15px 30px;">
                <b style="margin-left: 15px;font-size: 16px;">解决问题分布</b>
              </div>
              <div style="background-color: white;width:100%;height:240px;">
                <div id='finishBug' ref="finishBug" style="margin:0 auto;"></div>
              </div>
            </el-col>
          </el-row>
          <el-table ref="multipleTable" :data="rateData1" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;"
            :default-sort="{prop: '', order: ''}"
            @sort-change="changeOrder1">
            <el-table-column align="center" width=110 label="缺陷ID" height=33 sortable="custom" prop="id">
              <template slot-scope='scope'>
                <div  v-html="scope.row.id"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=100 label="优先级" height=33 sortable="custom" prop="priority_id">
              <template slot-scope='scope'>
                <div v-if="scope.row.priority_id === '1'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">低</span></div>
                <div v-if="scope.row.priority_id === '2'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">普通</span></div>
                <div v-if="scope.row.priority_id === '3'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">高</span></div>
                <div v-if="scope.row.priority_id === '4'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">紧急</span></div>
                <div v-if="scope.row.priority_id === '5'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">立刻</span></div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="主题" height=33 sortable="custom" prop="subject">
              <template slot-scope='scope'>
                <div  style="text-align:left">{{scope.row.subject}}</div>
              </template>
            </el-table-column>
            
            <el-table-column align="center" width=120 label="创建时间" height=33 sortable="custom" prop="created_on">
              <template slot-scope='scope'>
                <div  style="text-align:left" v-if="scope.row.created_on">{{scope.row.created_on.substr(0,10)}}</div>
                <div  style="text-align:left" v-else>{{scope.row.created_on}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="更新时间" height=33 sortable="custom" prop="updated_on">
              <template slot-scope='scope'>
                <div  style="text-align:left" v-if="scope.row.updated_on">{{scope.row.updated_on.substr(0,10)}}</div>
                <div  style="text-align:left" v-else>{{scope.row.updated_on}}</div>
              </template>
            </el-table-column>

            <el-table-column align="center" width=120 label="状态" height=33 sortable="custom" prop="status_id">
              <template slot-scope="scope">
                <span >{{scope.row.status_id}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="严重级别" height=33 sortable="custom" prop="severity_level">
              <template slot-scope='scope'>
                <div v-if="scope.row.severity_level === '3-一般'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row.severity_level}}</span>
                </div>
                <div v-else-if="scope.row.severity_level === '1-优化'" style="width: 70px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row.severity_level}}</span>
                </div>
                <div v-else-if="scope.row.severity_level === '2-轻微'" style="width: 70px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row.severity_level}}</span>
                </div>
                <div v-else-if="scope.row.severity_level === '4-严重'" style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row.severity_level}}</span>
                </div>
                <div v-else-if="scope.row.severity_level === '5-致命'" style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row.severity_level}}</span>
                </div>
                <div v-else>
                  <span>{{scope.row.severity_level}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=100 label="指派给" height=33 sortable="custom" prop="assigned_to">
              <template slot-scope='scope'>
                <div >{{scope.row.assigned_to}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=100 label="作者" height=33 sortable="custom" prop="author">
              <template slot-scope='scope'>
                <div >{{scope.row.author}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="里程碑" name="ten" v-if="affairList.length>0">
          <div style="background-color:#fff;padding:20px 0;margin:10px 0;">
            <div style="background-color:#fff;width:70%">
              <div style="display:flex;overflow:hidden;height:16px;">
                <div style="flex:1;text-align:right;position:relative"><div style="position:absolute;right:6px;top:0;">立项</div></div>
                <div style="flex:1;text-align:right;position:relative"><div style="position:absolute;right:-8px;top:0;">招标采购</div></div>
                <div style="flex:1;text-align:right;position:relative"><div style="position:absolute;right:6px;top:0;">实施</div></div>
                <div style="flex:1;text-align:right;position:relative"><div style="position:absolute;right:6px;top:0;">验收</div></div>
                <div style="flex:1;text-align:right;position:relative"><div style="position:absolute;right:6px;top:0;">上线</div></div>
              </div>
              <div style="display:flex;margin-top:10px;">
                <div style="flex:1;display:flex;justify-content:flex-end">
                  <el-tooltip class="item" effect="dark" content="超时" placement="top" v-if="getCadeColor('立项')==='进行中已超时' || getCadeColor('立项')==='已完成已超时'">
                      <div style="width:40px;height:40px;border-radius:50%;" :class="getCadeColor('立项')==='进行中已超时' ? 'jxzycs' : 'wccs'"></div>
                  </el-tooltip>
                  <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;" v-else-if="affStatusList.includes('立项')" :class="[{'wccs': (getCadeColor('立项')==='已完成已超时')}, {'zcjs': (getCadeColor('立项')==='正常结束')}, {'jxzycs': (getCadeColor('立项')==='进行中已超时')}, {'jxzwcs': (getCadeColor('立项')==='进行中未超时')}]"></div>
                  <div style="width:40px;height:40px;border-radius:50%;background-color:#dbe4f5;" v-else></div>
                </div>

                <div style="flex:1;display:flex;justify-content:flex-end;align-items:center;">
                  <div style="flex:1;height:2px;background-color:#4b78cd;" v-if="affStatusList.includes('招标')"></div>
                  <div style="flex:1;height:2px;background-color:#dbe4f5;" v-else></div>
                  
                  <el-tooltip class="item" effect="dark" content="超时" placement="top" v-if="getCadeColor('招标')==='进行中已超时' || getCadeColor('招标')==='已完成已超时'">
                      <div style="width:40px;height:40px;border-radius:50%;" :class="getCadeColor('招标')==='进行中已超时' ? 'jxzycs' : 'wccs'"></div>
                  </el-tooltip>
                  <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;" v-else-if="affStatusList.includes('招标')" :class="[{'wccs': (getCadeColor('招标')==='已完成已超时')}, {'zcjs': (getCadeColor('招标')==='正常结束')}, {'jxzycs': (getCadeColor('招标')==='进行中已超时')}, {'jxzwcs': (getCadeColor('招标')==='进行中未超时')}]"></div>
                  <div style="width:40px;height:40px;border-radius:50%;background-color:#dbe4f5;" v-else></div>
                </div>

                <div style="flex:1;display:flex;justify-content:flex-end;align-items:center;">
                  <div style="flex:1;height:2px;background-color:#4b78cd;" v-if="affStatusList.includes('实施')"></div>
                  <div style="flex:1;height:2px;background-color:#dbe4f5;" v-else></div>
                  
                  <el-tooltip class="item" effect="dark" content="超时" placement="top" v-if="getCadeColor('实施')==='进行中已超时' || getCadeColor('实施')==='已完成已超时'">
                      <div style="width:40px;height:40px;border-radius:50%;" :class="getCadeColor('实施')==='进行中已超时' ? 'jxzycs' : 'wccs'"></div>
                  </el-tooltip>
                  <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;" v-else-if="affStatusList.includes('实施')" :class="[{'wccs': (getCadeColor('实施')==='已完成已超时')}, {'zcjs': (getCadeColor('实施')==='正常结束')}, {'jxzycs': (getCadeColor('实施')==='进行中已超时')}, {'jxzwcs': (getCadeColor('实施')==='进行中未超时')}]"></div>
                  <div style="width:40px;height:40px;border-radius:50%;background-color:#dbe4f5;" v-else></div>
                </div>

                <div style="flex:1;display:flex;justify-content:flex-end;align-items:center;">
                  <div style="flex:1;height:2px;background-color:#4b78cd;" v-if="affStatusList.includes('验收')"></div>
                  <div style="flex:1;height:2px;background-color:#dbe4f5;" v-else></div>
                  
                  <el-tooltip class="item" effect="dark" content="超时" placement="top" v-if="getCadeColor('验收')==='进行中已超时' || getCadeColor('验收')==='已完成已超时'">
                      <div style="width:40px;height:40px;border-radius:50%;" :class="getCadeColor('验收')==='进行中已超时' ? 'jxzycs' : 'wccs'"></div>
                  </el-tooltip>
                  <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;" v-else-if="affStatusList.includes('验收')" :class="[{'wccs': (getCadeColor('验收')==='已完成已超时')}, {'zcjs': (getCadeColor('验收')==='正常结束')}, {'jxzycs': (getCadeColor('验收')==='进行中已超时')}, {'jxzwcs': (getCadeColor('验收')==='进行中未超时')}]"></div>
                  <div style="width:40px;height:40px;border-radius:50%;background-color:#dbe4f5;" v-else></div>
                </div>

                <div style="flex:1;display:flex;justify-content:flex-end;align-items:center;">
                  <div style="flex:1;height:2px;background-color:#4b78cd;" v-if="affStatusList.includes('上线')"></div>
                  <div style="flex:1;height:2px;background-color:#dbe4f5;" v-else></div>
                  
                  <el-tooltip class="item" effect="dark" content="超时" placement="top" v-if="getCadeColor('上线')==='进行中已超时' || getCadeColor('上线')==='已完成已超时'">
                      <div style="width:40px;height:40px;border-radius:50%;" :class="getCadeColor('上线')==='进行中已超时' ? 'jxzycs' : 'wccs'"></div>
                  </el-tooltip>
                  <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;" v-else-if="affStatusList.includes('上线')" :class="[{'wccs': (getCadeColor('上线')==='已完成已超时')}, {'zcjs': (getCadeColor('上线')==='正常结束')}, {'jxzycs': (getCadeColor('上线')==='进行中已超时')}, {'jxzwcs': (getCadeColor('上线')==='进行中未超时')}]"></div>
                  <div style="width:40px;height:40px;border-radius:50%;background-color:#dbe4f5;" v-else></div>
                </div>
              </div>

              <div style="display:flex;height:16px;margin-top:10px;">
                <div style="flex:1;position:relative;"><div style="width:110px;text-align:right">开始时间</div><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('立项').start_date}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('招标').start_date}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('实施').start_date}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('验收').start_date}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('上线').start_date}}</div></div>
              </div>

              <div style="display:flex;height:16px;margin-top:10px;">
                <div style="flex:1;position:relative;"><div style="width:110px;text-align:right">计划完成时间</div><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('立项').due_date}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('招标').due_date}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('实施').due_date}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('验收').due_date}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('上线').due_date}}</div></div>
              </div>

              <div style="display:flex;height:16px;margin-top:10px;">
                <div style="flex:1;position:relative;"><div style="width:110px;text-align:right">实际完成时间</div><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('立项').closed_on}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('招标').closed_on}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('实施').closed_on}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('验收').closed_on}}</div></div>
                <div style="flex:1;text-align:right;position:relative;"><div style="position:absolute;right:-18px;top:0;">{{usenamegetTime('上线').closed_on}}</div></div>
              </div>
            </div>
          </div>
            <el-table :data="affairList" style="width: 100%" @sort-change="changeOrderpro">
              <el-table-column prop="id" label="ID" width="100" align="center" sortable="custom">
                <template slot-scope="scope">
                  <div style="color:#4b78cd;text-decoration:underline;cursor:pointer;" v-if="scope.row.id" @click="goredmine(scope.row.id)">#{{scope.row.id}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="其他任务类型" width="130" align="center" sortable="custom">
              </el-table-column>
              <el-table-column prop="subject" label="主题" align="center">
              </el-table-column>
              <el-table-column prop="status_id" label="状态" align="center" width="150" sortable="custom">
                <template slot-scope="scope">
                  <div>{{useidgetStatus(scope.row.status_id)}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="assigned_to" label="指派给" align="center" width="120" sortable="custom">
              </el-table-column>
              <el-table-column prop="created_on" label="创建时间" align="center" width="120" sortable="custom">
                <template slot-scope="scope">
                  <div v-if="scope.row.created_on">{{scope.row.created_on.substr(0,10)}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="start_date" label="开始时间" align="center" width="120" sortable="custom">
              </el-table-column>
              <el-table-column prop="due_date" label="计划完成时间" align="center" width="150" sortable="custom">
              </el-table-column>
              <el-table-column prop="closed_on" label="关闭时间" align="center" width="120" sortable="custom">
                <template slot-scope="scope">
                  <div v-if="scope.row.closed_on">{{scope.row.closed_on.substr(0,10)}}</div>
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>

         <div class="pagenumchoose" style="background-color:#fff;height:50px;" v-if="tabActiveName !== 'five'">
        <el-pagination
         @size-change="sizeChangeHandle"
         @current-change="currentChangeHandle"
         :current-page="listQuery.page"
         :page-sizes="[10, 20, 50, 100]"
         :page-size="listQuery.pageSize"
         :total="total"
         popper-class="mouFix"
         layout="total, sizes, prev, pager, next"
        class="pagenum">
        </el-pagination>
        </div>
        <!-- <div v-if="total >= 1" class="pagination-container" style="background-color: white;overflow:hidden">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageRow.pageNo"
            :page-sizes="[10,20,30,50]" :page-size="pageRow.pageSize" layout="total, sizes, prev, pager, next" :total="total" style="float:right"> 
          </el-pagination>
        </div> -->
      </el-tabs>
    </div>

    <el-dialog
      title=""
      :visible.sync="noproFlag"
      width="50%"
      top="20vh"
      :close-on-click-modal='false'
      :show-close='false'
      style="">
      <!-- <span>这是一段信息</span> -->
      <div style="position:relative;width:100%;">
        <div style="width:100%;height:50px;position:absolute;top:-32vh;"></div>
      </div>
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
import {getprojectdict, getbugstaticdatav2, getversiondict, getReqNumByTime, getProjectTotal, getprojectdatav7, getprojectdatav5,
getprojectdatav6, yongli, getprojectdatav8, guifan, guifanqushi, yonglizhixing, getAllReqIds, getprojectdatav9, getDeviateTrend, getMilestoneList, getGanttChartList, getGanttChartIssueInfo} from '@/api/xyzqPort/qualityPortNew'
import {getAllStatusData} from '@/api/newEhomeJS/eproblem'
import echarts from 'echarts'
import {systemlogStatis} from '@/api/modules/all'
import Vue from 'vue'
import API from '@/api'
import wlGantt from '&p/pages/wl-gantt/index.vue'
export default {
  name: 'index',
  data () {
    return {
      myCharttask: '',
      proactiveName: 'first',
      noproFlag: false,
      searchText: '',
      versearchText: '',
      reqsearchText: '',
      projectlistLoading: false,
      proErroMess: 'bug未修复',
      projectMess: false,
      queryMonth: '0',
      listLoading: false,
      caseRate: 0,
      caseExecution: 0,
      strokeWidth: 12,
      progressWidth: 120,
      total: 0,
      tabActiveName: 'one',
      projectProcess: '0.00%',
      finishDate: '未知',
      pageRow: {
        pageNo: 1,
        pageSize: 50
      },
      reqId: [],
      listQuery: {
        projectId: '',
        versionId: '',
        tracker_id: '',
        page: 1,
        pageSize: 50,
        orderby: 'asc',
        prope: 'start_date',
        month: '',
        reqId: ''
      },
      versionOptions: [],
      versionOptionsAll: [],
      reqOptions: [],
      reqOptionsAll: [],
      RedmineListData: [],
      projectListData: [],
      reqListData: [],
      reqTaskListData: [],
      projectOptions: [],
      projectAllOptions: [],
      caseListData: [],
      bugListData: [],
      taskListData: [],
      taskListDatass: [],
      taskListDatas: [],
      normListData: [],
      productListData: [],
      normListDatas: [],
      productListDatas: [],
      xqIds: '',
      sxxqIds: '',
      fbIds: '',
      xqidss: [],
      rateData5: '',
      caseListDatas: [],
      reqListDatas: [],
      bugIds: '',
      bugListDatas: [],
      planmess: '',
      reqTime: '',
      taskIds: [],
      taskIds1: [],
      allOptions: [
        {id: 1, text: '新建'},
        {id: 2, text: '修复中(进行中)'},
        {id: 3, text: '已修复(已解决)'},
        {id: 4, text: '延期'},
        {id: 5, text: '已关闭'},
        {id: 6, text: '已拒绝'},
        {id: 7, text: '重新打开'},
        {id: 8, text: '已提测'},
        {id: 13, text: '评审完成'},
        {id: 14, text: '开发中'},
        {id: 15, text: '测试中'},
        {id: 16, text: '待验收'},
        {id: 17, text: '验收完成'},
        {id: 18, text: '测试退回'},
        {id: 19, text: '部分上线'},
        {id: 20, text: '编码完成'},
        {id: 21, text: '反馈'},
        {id: 22, text: '未解决'},
        {id: 23, text: '重打开'},
        {id: 24, text: '等待变更'},
        {id: 25, text: '变更完成'},
        {id: 26, text: '待重现'},
        {id: 27, text: '暂停'},
        {id: 28, text: '实施中'},
        {id: 29, text: '代码审查中'},
        {id: 30, text: '取消'},
        {id: 31, text: '验证中'},
        {id: 32, text: '待执行'},
        {id: 33, text: '待审批'},
        {id: 34, text: '已验证'},
        {id: 36, text: '已上线'},
        {id: 38, text: '方案待确认'},
        {id: 40, text: '部分完成'},
        {id: 42, text: '拒绝修复'}
      ],
      mouthreqnum: '',
      radio: 3,
      reqnumtime: {
        start: '',
        end: ''
      },
      rateData1: [],
      rateData12: [],
      reqTaskListData1: [],
      affairList: [],
      affStatusData: [],
      affStatusList: '',
      reqtotal: 0,
      totalFive: 0,
      topLoading: true,
      // 如果有结束时间就不给计划时间赋值了
      componentsdata: [
        // {
        //   id: '1',
        //   name: '旅行',
        //   startDate: '2020-06-07',
        //   // endDate: '2020-06-18',
        //   planDate: '2020-06-20'
        // },
        // {
        //   id: '2',
        //   name: 'dhasnkfkasd',
        //   startDate: '2020-06-20',
        //   endDate: '',
        //   planDate: '2020-07-05'
        // },
        // {
        //   id: '3',
        //   name: 'shanghai',
        //   startDate: '2020-06-20',
        //   planDate: '2020-07-13'
        // }
      ], // 数据
      contextMenuOptions: [
        { label: '需求名称：', prop: 'name', id: 'id' },
        { label: '状态：', prop: 'status_name' },
        { label: '累计耗时：', prop: 'useTime' },
        { label: '指派给：', prop: 'assigned_to_username' },
        { label: '验收计划完成时间：', prop: 'planDate' },
        { label: '创建时间：', prop: 'created_on' },
        { label: '开始时间：', prop: 'startDate' },
        { label: '评审完成时间：', prop: 'reviewCompleteTime' },
        { label: '开发时间：', prop: 'devTime' },
        { label: '测试时间：', prop: 'testTime' },
        { label: '待验收时间：', prop: 'acceptTime' },
        { label: '关闭时间：', prop: 'endDate' }
      ],
      GantTime: [],
      gantShow: false
    }
  },
  created () {
    var url = window.location.href
    if (url.indexOf('?token=') !== -1) {
      localStorage.setItem('tabIndex', 454)
      this.loginEiac()
    }
    // if (typeof (this.$route.query.project_id) !== 'undefined' && this.$route.query.project_id !== '') {
    //   this.listQuery.projectId = this.$route.query.project_id
    // }
    // if (typeof (this.$route.query.version_id) !== 'undefined' && this.$route.query.version_id !== '') {
    //   this.istQuery.versionId = this.$route.query.version_id
    // }
    this.getOptionsDatas()
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    this.reqnumtime.start = this.getTimeByDate(start)
    this.reqnumtime.end = this.getTimeByDate(end)

    this.getAllstatus() // 获取所有的状态
    // this.getreqData()
  },
  components: {
    wlGantt
  },
  mounted () {
    this.$nextTick(function () {
      // this.getOptionsDatas()
    })
    let allObj = {
      url: this.$route.path,
      moduleName: '项目看板',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    this.$refs.normdraw.width = '100%'
    // console.log(this.reqnumtime)
  },
  activated () {
    this.getOptionsDatas()
  },
  methods: {
    getDaysBetween (dateString1, dateString2) {
      var startDate = Date.parse(dateString1)
      var endDate = Date.parse(dateString2)
      var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
      // alert(days);
      return days
    },
    setCom (row, column, cell, event) {
      const datea = new Date()
      const YY = datea.getFullYear()
      const MM = (datea.getMonth() + 1).toString().padStart(2, 0)
      const DD = (datea.getDate()).toString().padStart(2, 0)
      const timenow = `${YY}-${MM}-${DD}`
      let obj = {
        reqId: row.id
      }
      let index = row.index
      getGanttChartIssueInfo(obj).then(res => {
        if (res.data.data && res.data.data.info) {
          let data = res.data.data.info
          let startTime = row.startDate.substr(0, 10)
          if (row.endDate) {
            // 计算关闭时间和psTime之间天数
            let time = this.getDaysBetween(startTime, row.endDate) + '天'
            this.$set(this.componentsdata[index], 'useTime', time)
          } else {
            // 当前时间和评审时间的天数
            let time = this.getDaysBetween(startTime, timenow) + '天'
            this.$set(this.componentsdata[index], 'useTime', time)
          }
          Object.keys(data).forEach(item => {
            let date = data[item]
            if (data[item] && data[item].length > 10) {
              date = date.substr(0, 10)
            }
            this.$set(this.componentsdata[index], item, date)
          })
        }
      })
      // console.log(this.componentsdata[index])
      // console.log(row, column, cell)
      // console.log(row.index)
    },
    /*
    获取甘特图的数据
    */
    getGantList () {
      let obj = {
        projectId: this.listQuery.projectId,
        versionId: this.listQuery.versionId,
        reqId: this.listQuery.reqId
      }
      this.componentsdata = []
      this.GantTime = []
      let now = this.formatTime(new Date().toLocaleDateString().replace(/\//g, '-'))
      this.GantTime[0] = this.getPreMonth(now)
      this.GantTime[1] = this.getNextMonth(now)
      getGanttChartList(obj).then(res => {
        if (res.data.data.list && res.data.data.list.length > 0) {
          this.GantTime = []
          let data = res.data.data.list
          // console.log()
          let now = this.formatTime(new Date().toLocaleDateString().replace(/\//g, '-'))
          let mouthcomple = data[0].plan_online_date ? data[0].plan_online_date : now
          if (new Date(now).getTime() <= new Date(mouthcomple).getTime()) {
            // 取当前月和上下月
            this.GantTime[0] = this.getPreMonth(now)
            this.GantTime[1] = this.getNextMonth(now)
          } else {
            this.GantTime[0] = this.getPreMonth(mouthcomple)
            this.GantTime[1] = this.getNextMonth(mouthcomple)
            // 取计划上线时间的上下月
          }
          let dataArr = []
          data.forEach((item, index) => {
            let obj = {}
            if (item.d_start_date) {
              obj.startDate = item.d_start_date
            }
            if (item.d_done_ratio) {
              obj.rate = item.d_done_ratio
            }
            if (item.d_closed_on) {
              obj.endDate = item.d_closed_on.substr(0, 10)
              // obj.endDate = ''
            }
            if (item.plan_complete_date) {
              obj.planDate = item.plan_complete_date
              // obj.planDate = ''
            }
            if (item.created_on) {
              obj.created_on = item.created_on.substr(0, 10)
            }
            if (item.status_name) {
              obj.status_name = item.status_name
            }
            if (item.assigned_to_username) {
              obj.assigned_to_username = item.assigned_to_username
            }
            obj.index = index
            obj.id = item.id
            obj.name = item.subject
            dataArr.push(obj)
          })
          this.gantShow = true
          this.componentsdata = dataArr
          // console.log(dataArr)
          console.log(this.componentsdata)
        }
      })
    },
    getPreMonth (date) { 
      var arr = date.split('-')
      var year = arr[0]
      var month = arr[1]
      var day = arr[2]
      var days = new Date(year, month, 0)
      days = days.getDate()
      var year2 = year
      var month2 = parseInt(month) - 1
      if (month2 === 0) { 
        year2 = parseInt(year2) - 1
        month2 = 12
      }
      var day2 = day
      var days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) { 
        month2 = '0' + month2
      }
      var t2 = year2 + '-' + month2 + '-' + day2
      return t2
    },
    getNextMonth (date) {
      var arr = date.split('-')
      var year = arr[0]
      var month = arr[1]
      var day = arr[2]
      var days = new Date(year, month, 0)
      days = days.getDate()
      var year2 = year
      var month2 = parseInt(month) + 1
      if (month2 === 13) { 
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      var day2 = day
      var days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) { 
        month2 = '0' + month2
      }
      var t2 = year2 + '-' + month2 + '-' + day2
      return t2
    },
    formatTime (times) {
      let date = new Date(times)
      let year = date.getFullYear()
      let month = (date.getMonth() - 0 + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() - 0 + 1)
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return `${year}-${month}-${day}`
    },
    goredmine (id) {
      window.open('http://192.25.97.80/redmine/issues/' + id)
    },
    getAllstatus () {
      const row = {
        tracker_id: ''
      }
      getAllStatusData(row).then(res => {
        // console.log(res)
        this.allOptions = res.data.list
      })
    },
    // 开始时间
    usenamegetTime (name) {
      let time = []
      time = this.affairList.filter(item => {
        if (item.closed_on) {
          item.closed_on = item.closed_on.substr(0, 10)
        }
        return item.value.includes(name)
      })
      let obj = {}
      if (time.length > 0) {
        obj = time[0]
      }
      // this.affairList.forEach(item => {
      //   // console.log(item)
      //   if (item.value.includes(name)) {
      //     if (item.closed_on) {
      //       item.closed_on = item.closed_on.substr(0, 10)
      //     }
      //     time = item
      //   }
      // })
      return obj
    },
    useidgetStatus (id) {
      var statusname = ''
      this.allOptions.forEach(item => {
        if (Number(item.id) === Number(id)) {
          statusname = item.text
        }
      })
      return statusname
    },
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
        this.$router.push({ name: 'qualityPortNew' })
      }
    },
    getreqData () {
      // this.listQuery.projectId = ''
      const obj = {
        projectId: this.listQuery.projectId,
        // projectId: '',
        versionId: this.listQuery.versionId,
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        prope: this.listQuery.prope,
        // prope: 'project_id',
        orderby: this.listQuery.orderby
      }
      getMilestoneList(obj).then(res => {
        this.affairList = res.data.list
        // console.log(this.getCadeColor('立项'))
        if (res.data.hasOwnProperty('vallist')) {
          this.affStatusData = res.data.vallist
          let arr = ''
          res.data.vallist.forEach(item => {
            // arr.push(item.value)
            arr = arr + item.value
          })
          this.affStatusList = arr
          // console.log(this.affStatusList)
          if (this.tabActiveName === 'ten') {
            this.total = res.data.total
          }
        }
        if (this.tabActiveName === 'ten' && this.affairList.length === 0) {
          this.tabActiveName = 'one'
          this.tabClick()
        }
        this.reqtotal = res.data.total
      })
    },
    getCadeColor (name) {
      let arr = []
      arr = this.affairList.filter(item => {
        return item.value.includes(name)
      })
      if (arr.length > 0) {
        // console.log(arr)
        let obj = arr[0]
        let str = ''
        if (obj.closed_on) {
          // 如果有结束时间
          // console.log(this.compareDate(obj.closed_on, obj.due_date))
          let planTime = new Date(obj.due_date).getTime()
          let end = new Date(obj.closed_on).getTime()
          end > planTime ? str = '已完成已超时' : str = '正常结束'
          // console.log('计划完成时间' + new Date(obj.due_date).getTime(), '结束时间' + new Date(obj.closed_on).getTime())
          // console.log(new Date().getTime())
          // 当结束时间大于计划完成时间（正常结束）
          // 当计划完成时间大于结束时间（已完成已超时）
        } else if (obj.due_date) {
          // console.log('当前时间' + new Date().getTime(), '计划完成时间' + new Date(obj.due_date).getTime())
          let now = new Date().getTime()
          let planeTime = new Date(obj.due_date).getTime()
          now > planeTime ? str = '进行中已超时' : str = '进行中未超时'
          // 当有计划完成时间
          // 当计划完成时间大于当前时间（进行中未超时）
          // 当计划完成时间小于当前时间（进行中已超时）
        } else if (!obj.closed_on && !obj.due_date) {
          str = '进行中未超时'
        }
        // console.log(str)
        return str
      }
    },
    compareDate (date1, date2) {
      var oDate1 = new Date(date1)
      var oDate2 = new Date(date2)
      if (oDate1.getTime() > oDate2.getTime()) {
        return true
      } else {
        return false
      }
    },
    handlePro (tab) {
      // console.log(this.proactiveName)
      this.rateData1 = []
      this.getprojectdatavproline()
    },
    getprojectdatavproline () {
      this.listQuery.month = this.queryMonth
      getprojectdatav9(this.listQuery).then(response => {
        if (this.proactiveName === 'first') {
          this.rateData1 = response.data.verList
          this.total = response.data.verTotal
        } else if (this.proactiveName === 'second') {
          this.rateData1 = response.data.list
          this.total = response.data.total
        }
      })
    },
    changereqnum () {
      // console.log(this.radio)
      const end = new Date()
      const start = new Date()
      if (this.radio === 3) {
        // 近一月的时间
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        this.reqnumtime.start = this.getTimeByDate(start)
        this.reqnumtime.end = this.getTimeByDate(end)
      } else if (this.radio === 6) {
        // 近三个月的
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        this.reqnumtime.start = this.getTimeByDate(start)
        this.reqnumtime.end = this.getTimeByDate(end)
      } else if (this.radio === 9) {
        // 近六个月
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
        this.reqnumtime.start = this.getTimeByDate(start)
        this.reqnumtime.end = this.getTimeByDate(end)
      }
      this.getreqnum()
    },
    // 获取完成需求数
    getreqnum () {
      const obj = {
        projectId: this.listQuery.projectId,
        start: this.reqnumtime.start,
        end: this.reqnumtime.end
      }
      // debugger
      getReqNumByTime(obj).then(res => {
        // console.log(res.data.count - 0)
        this.mouthreqnum = res.data.count - 0
      })
    },
    renderHeader (createElement, { column, _self }) {
      // console.log(createElement)      //  function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
      const label = column.label
      const labelArr = label.split('>')
      return createElement(
        'span',
        [
          createElement('p', {  // 创建第一个元素的标签可随意
            attrs: {type: 'text', style: 'font-size:12px;margin:0;padding:0;'}
          }, [labelArr[0]]),
          createElement('span', {
            attrs: { type: 'text', style: 'font-size:12px;margin-right:20px;padding:0;width:130px;' } // 给分割的某个元素单独加样式
          }, [labelArr[1] || '']),
          createElement('span', {
            attrs: { type: 'text', style: 'font-size:12px;margin:0;padding:0;' } // 给分割的某个元素单独加样式
          }, [labelArr[2] || ''])
        ]
       )
    },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    leaveinps () {
      this.versearchText = ''
      this.versearchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.projectAllOptions.forEach((item) => {
        if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.projectOptions = [{name: '暂无数据', id: '', disabled: true}]
      } else {
        this.projectOptions = allList
      }
    },
    versearchInfo () {
      var newVal = this.versearchText
      var allList = []
      this.versionOptionsAll.forEach((item) => {
        if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.versionOptions = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.versionOptions = allList
      }
    },
    reqsearchInfo () {
      var newVal = this.reqsearchText
      var allList = []
      this.reqOptionsAll.forEach((item) => {
        if (item.text.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.reqOptions = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.reqOptions = allList
      }
    },
    maxText (descText) {
      if (descText != null && descText !== '' && descText.length > 500) {
        return descText.substr(0, 500) + '...'
      } else {
        return descText
      }
    },
    getOptionsDatas () {
      const row = {
        userId: localStorage.getItem('userId'),
        roleName: ''
      }
      getprojectdict(row).then(response => {
        // console.log(response)
        if (response.data.result.includes('无项目权限')) {
          this.noproFlag = true
        }
        this.projectOptions = response.data.list
        this.projectAllOptions = response.data.list
        if (this.projectOptions.length > 0) {
          this.listQuery.projectId = this.projectOptions[0].id
          if (typeof (this.$route.query.projectId) !== 'undefined' && this.$route.query.projectId !== '') {
            this.listQuery.projectId = this.$route.query.projectId
            this.getversiondict('1', 1)
          } else {
            if (typeof (Vue.cookie.get('projectId')) !== 'undefined' && Vue.cookie.get('projectId') !== null && Vue.cookie.get('projectId') !== 'null' && Vue.cookie.get('projectId') !== '') {
              this.listQuery.projectId = Vue.cookie.get('projectId')
              this.getversiondict('0', 0)
            } else {
              API.user.info().then(({data}) => {
                if (data && data.code === 0) {
                  if (typeof (data.user.userMark) !== 'undefined' && data.user.userMark !== null && data.user.userMark !== '') {
                    this.listQuery.projectId = data.user.userMark
                  }
                  this.getversiondict('0', 0)
                }
              })
            }
          }
        } else {
          this.noproFlag = true
        }
      })
    },
    updateUserProject () {
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          var params = {
            'userId': data.user.userId,
            'username': data.user.username,
            'chinesename': data.user.chinesename,
            'email': data.user.email,
            'mobile': data.user.mobile,
            'status': data.user.status,
            'roleIdList': data.user.roleIdList,
            'userMark': this.listQuery.projectId
          }
          // var tick = API.user.update(params)
          API.user.update(params).then(response => {})
        }
      })
    },
    getversiondict (type, index) {
      this.affairList = []
      // alert(132)
      this.xqidss = []
      this.mouthreqnum = ''
      this.radio = 3
      Vue.cookie.set('projectId', this.listQuery.projectId)
      if (type === '1') {
        this.updateUserProject()
      }
      this.reqListData = []
      this.reqTaskListData = []
      this.productListDatas = []
      this.reqListDatas = []
      const barData = {
        xAxisData: [],
        allData: [],
        notclosedData: [],
        closedData: []
      }
      this.drawBaseLine('bugTrend', barData)
      // this.drawBaseLine('bugTrend2', barData)
      this.finishDate = '未 知'
      // console.log(this.listQuery)
      // if (this.tabActiveName === 'ten') {
      // }
      getversiondict(this.listQuery.projectId).then(response => {
        // console.log(response)
        var nowversionId = -1
        response.data.rows.forEach(item => {
          if (item.time !== '') {
            nowversionId++
          }
        })
        if (nowversionId === -1) {
          // 没有最新版本
          // this.getprojectdatav2()
        }
        var zuixinbanben = response.data.rows[nowversionId]
        this.versionOptions = response.data.rows
        this.versionOptionsAll = response.data.rows
        if (typeof (this.$route.query.versionId) !== 'undefined' && this.$route.query.versionId !== '' && this.$route.query.versionId !== 'undefined' && index === 1) {
          this.listQuery.versionId = this.$route.query.versionId
        } else {
          if (typeof (Vue.cookie.get('versionId')) !== 'undefined' && Vue.cookie.get('versionId') !== null && type === '0') {
            this.listQuery.versionId = Vue.cookie.get('versionId')
          } else {
            this.listQuery.versionId = ''
            if (response.data.rows.length > 0) {
              // this.listQuery.versionId = response.data.rows[0].id
              // console.log(zuixinbanben)
              if (typeof (zuixinbanben) !== 'undefined' && zuixinbanben.time !== null && zuixinbanben.time !== '') {
                this.listQuery.versionId = zuixinbanben.id
              }
              if (typeof (zuixinbanben) !== 'undefined' && zuixinbanben.planDate !== null && zuixinbanben.planDate !== '') {
                this.finishDate = zuixinbanben.planDate
              }
            }
          }
        }
        this.getprojectdatav2()
      })
      // alert(132)
      // this.getreqnum()
      this.changereqnum()
      this.searchText = ''
      this.searchInfo()
    },
    getprojectdatav2 () {
      this.topLoading = true
      this.listQuery.page = 1
      this.listQuery.pageSize = 50
      this.getoption()
      this.listQuery.prope = 'start_date'
      this.getreqData()
      if (this.listQuery.versionId === 0) {
        this.listQuery.versionId = ''
      }
      this.getGantList()
      // this.listQuery.reqId = ''
      this.reqId = []
      Vue.cookie.set('versionId', this.listQuery.versionId)
      // this.planmess = ''
      this.projectListData = [
        {indtype: '需求任务', all_num: 0, unclose_num: 0, today_num: 0},
        {indtype: '开发任务', all_num: 0, unclose_num: 0, today_num: 0},
        {indtype: '测试任务', all_num: 0, unclose_num: 0, today_num: 0},
        {indtype: '缺陷', all_num: 0, unclose_num: 0, today_num: 0, type: 'up'},
        {indtype: '任务总数', all_num: 0, unclose_num: 0, today_num: 0},
        {indtype: 'Redmine不规范', all_num: 0, unclose_num: 0, today_num: 0, type: ''}
      ]
      this.projectProcess = '0.00%'
      this.versionOptionsAll.forEach((item) => {
        if (item.id === this.listQuery.versionId && item.planDate !== null && item.planDate.length > 0) {
          this.finishDate = item.planDate
        }
      })
      getProjectTotal(this.listQuery).then(response => {
      // 查询顶部指标数据和项目进度
        // console.log(response)
        if (response.data.result === 'success') {
          this.projectListData = response.data.data
          this.projectListData[5].indtype = 'Redmine不规范'
          if (response.data.jindu !== null && response.data.jindu.length > 0) {
            this.projectProcess = response.data.jindu
          }
          // var finish = response.data.data[0].close_num
          // var total = response.data.data[0].all_num
          let d = new Date()
          const YY = d.getFullYear()
          const MM = (d.getMonth() + 1).toString().padStart(2, 0)
          const DD = (d.getDate()).toString().padStart(2, 0)
          const time = `${YY}-${MM}-${DD}`
          // debuggers
          let date = new Date(time).getTime()
          let plan = new Date(this.finishDate).getTime()
          this.planmess = ''
          if (plan < date && response.data.jindu !== '100%') {
            this.planmess = '延期'
          }
        } else {
          this.$message.error(response.data.result)
        }
        this.topLoading = false
      })
      // getBugTrend(this.listQuery).then(response => { // 查询bug趋势
      //   if (response.data.result === 'success') {
      //     const ele = response.data.data
      //     this.drawBaseLine('bugTrend', ele)
      //   }
      // })
      this.getAllReqIds()
      this.listQuery.tracker_id = '2'
      getprojectdatav6(this.listQuery).then(response => {
          // debugger
        this.reqTaskListData1 = response.data
        this.reqOptions = []
        this.reqTaskListData1.forEach((item) => {
          this.reqOptions.push({id: item.id, text: item.reqname})
        })
        this.reqOptionsAll = [...this.reqOptions]
        this.tabClick()
      })
    },
    getoption () {
      this.listQuery.tracker_id = '2'
      this.reqId = []
      getprojectdatav6(this.listQuery).then(response => {
          // debugger
        // console.log(this.listQuery)
        this.reqTaskListData1 = response.data
        this.reqOptions = []
        this.reqTaskListData1.forEach((item) => {
          this.reqOptions.push({id: item.id, text: item.reqname})
        })
      })
    },
    currentChangeHandle (val) {
      this.listQuery.page = val
      if (this.tabActiveName === 'one' || this.tabActiveName === 'four' || this.tabActiveName === 'six') {
        this.getprojectdatav9()
      }
      if (this.tabActiveName === 'five') {
        this.guifan()
      }
      if (this.tabActiveName === 'two' || this.tabActiveName === 'three') {
        this.getprojectdatav9()
      }
      if (this.tabActiveName === 'ten') {
        this.getreqData()
      }
    },
    sizeChangeHandle (val) {
      this.listQuery.pageSize = val
      if (this.tabActiveName === 'one' || this.tabActiveName === 'four' || this.tabActiveName === 'six') {
        this.getprojectdatav9()
      }
      if (this.tabActiveName === 'five') {
        this.guifan()
      }
      if (this.tabActiveName === 'two' || this.tabActiveName === 'three') {
        this.getprojectdatav9()
      }
      if (this.tabActiveName === 'ten') {
        this.getreqData()
      }
    },
    reqChange () {
      this.listQuery.reqId = this.reqId.join(',')
      this.getAllReqIds()
      this.tabClick('changereq')
      this.getGantList()
      // console.log(this.reqOptions)
    },
    getAllReqIds () {
      this.xqidss = []
      getAllReqIds(this.listQuery).then(response => {
        response.data.forEach((item) => {
          this.xqidss.push(item)
        })
        // 获取bug趋势图的数据
        this.getBugTrendData()
      })
    },
    tabClick (isreq) {
      // debugger
      // this.listLoading = true
      this.listQuery.page = 1
      this.listQuery.pageSize = 50
      this.rateData1 = []
      if (!isreq) {
        this.listQuery.reqId = ''
      }
      if (this.tabActiveName === 'one') {
        this.listQuery.tracker_id = '2'
        this.getprojectdatav9()
        getprojectdatav6(this.listQuery).then(response => {
          // debugger
          this.reqTaskListData1 = response.data
          // this.reqOptions = []
          // this.reqTaskListData1.forEach((item) => {
          //   console.log(item)
          //   this.reqOptions.push({id: item.id, text: item.reqname})
          // })
          // console.log(this.reqOptions)
        })
      }
      if (this.tabActiveName === 'two') {
        this.listQuery.tracker_id = '4'
        this.getprojectdatav9()
        yonglizhixing(this.listQuery).then(response => {
          this.caseExecution = 0
          this.caseRate = 0
          if (response.data.hasOwnProperty('zhixing')) {
            this.caseExecution = Number(response.data.zhixing)
          }
          if (response.data.hasOwnProperty('tongguo')) {
            this.caseRate = Number(response.data.tongguo)
          }
        })
        yongli(this.listQuery).then(response => {
          this.rateData4 = response.data
          var seriesData = [
                {name: '创建', type: 'bar', barGap: 0, barMaxWidth: 20, label: { normal: { show: true } }, data: this.rateData4.createdNum},
                {name: '执行', type: 'bar', barGap: 0, barMaxWidth: 20, label: { normal: { show: true } }, data: this.rateData4.executedNum}
          ]
          const row = {
            xAxisData: this.rateData4.xAxisData,
            seriesData: seriesData
          }
          this.drawVBarTwoDuidie('caseSpread', row)
        })
      }
      if (this.tabActiveName === 'three') {
        var testseriesData = []
        this.listQuery.tracker_id = '1'
        // debugger
        this.getprojectdatav9()
        getprojectdatav5(this.listQuery).then(response => {
          // console.log(response)
          this.data1 = response.data
          testseriesData = [
            {name: '已关闭', type: 'bar', stack: '总量', barMaxWidth: 20, itemStyle: { normal: { color: '#31bd73' } }, label: { normal: { show: true } }, data: this.data1.closedNumd},
            {name: '未关闭', type: 'bar', stack: '总量', barMaxWidth: 20, itemStyle: { normal: { color: '#dcca22' } }, label: { normal: { show: true } }, data: this.data1.notclosedNumd},
            {name: '已拒绝', type: 'bar', stack: 'sum', barMaxWidth: 20, itemStyle: { normal: { color: '#4B78CD' } }, label: { normal: { show: true } }, data: this.data1.jujuedNumd}
          ]
          const row = {
            xAxisData: this.data1.xAxisDataNumd,
            seriesData: testseriesData
          }
          this.drawVBarTwoDuidie('testBug', row)
          var finishseriesData = [
            { name: '已解决', type: 'bar', stack: 'sum', barMaxWidth: 20, itemStyle: { normal: { color: '#31bd73' } }, label: { normal: { show: true } }, data: this.data1.fixedNumd },
            { name: '未解决', type: 'bar', stack: 'sum', barMaxWidth: 20, itemStyle: { normal: { color: '#4B78CD' } }, label: { normal: { show: true } }, data: this.data1.notfixedNumd },
            { name: '延期', type: 'bar', stack: '总量', barMaxWidth: 20, itemStyle: { normal: { color: '#dcca22' } }, label: { normal: { show: true } }, data: this.data1.delayNumd }
          ]
          // { name:'料费', type: 'bar', stack: 'sum', itemStyle: { normal:{ label: { show: true }, color:'#F89733' } }, data:data1 }
          const finishrow = {
            xAxisData: this.data1.yAxisDataNumd1,
            legendData: ['notfixed', 'fixed', 'reopen'],
            seriesData: finishseriesData
          }
          this.drawVBarTwoDuidie('finishBug', finishrow)
        })
      }
      if (this.tabActiveName === 'four') {
        this.listQuery.tracker_id = '5,7'
        this.getprojectdatav9(this.listQuery)
        this.getprojectdatav8(this.listQuery)
      }
      if (this.tabActiveName === 'five') {
        this.listLoading = true
        this.guifan()
        this.guifanqushi()
      }
      if (this.tabActiveName === 'six') {
        var t = new Date()
        var y = t.getFullYear()
        var m = t.getMonth() + 1
        if (m < 10) {
          m = '0' + m
        }
        this.queryMonth = y + '-' + m
        this.listQuery.month = y + '-' + m
        this.listQuery.tracker_id = '3'
        // this.getprojectdatav9()
        this.getprojectdatavproline()
        getprojectdatav7(this.listQuery).then(response => {
          this.reqTaskListData2 = response.data
          this.listLoading = false
          const row = {
            xAxisData: this.reqTaskListData2.xAxisData,
            newBug: this.reqTaskListData2.newBug,
            repairRate: this.reqTaskListData2.repairRate,
            finishBug: this.reqTaskListData2.finishBug,
            waitsolv: this.reqTaskListData2.waitsolv,
            xiufu: this.reqTaskListData2.xiufu
          }
          this.drawLineBar('productSpread', row)
        })
      }
      if (this.tabActiveName === 'ten') {
        this.total = this.reqtotal
      }
      this.listQuery.prope = ''
    },
    changeOrder1 (column, prop, order) {
      if (column.prop !== '') {
        this.listQuery.prope = column.prop
      }
      if (column.order === 'ascending') {
        this.listQuery.orderby = 'asc'
      } else {
        this.listQuery.orderby = 'desc'
      }
      this.getprojectdatav9()
    },
    changeOrderpro (column, prop, order) {
      if (column.prop !== '') {
        this.listQuery.prope = column.prop
      }
      if (column.order === 'ascending') {
        this.listQuery.orderby = 'asc'
      } else {
        this.listQuery.orderby = 'desc'
      }
      this.getreqData()
    },
    getprojectdatav8 () {
      if (this.listQuery.versionId === 0) {
        this.listQuery.versionId = ''
      }
      if (this.listQuery.tracker_id === '') {
        this.listQuery.tracker_id = '2'
      }

      getprojectdatav8(this.listQuery).then(response => {
        // console.log(response)
        this.taskSpread = response.data
        let taskSpread = {}
        if (this.taskSpread.hasOwnProperty('seriesData') && this.taskSpread.seriesData.length > 0) {
          taskSpread = {
            xAxisData: this.taskSpread.xAxisData,
            yAxisData: this.taskSpread.yAxisData,
            seriesData: this.taskSpread.seriesData,
            nameAxisData: this.taskSpread.nameAxisData
          }
        } else {
          taskSpread = {
            xAxisData: [],
            yAxisData: [],
            seriesData: [{name: '', value: Array(3), datenum: 9}],
            nameAxisData: []
          }
        }
        // const taskSpread = {
        //   xAxisData: this.taskSpread.xAxisData,
        //   yAxisData: this.taskSpread.yAxisData,
        //   seriesData: this.taskSpread.seriesData,
        //   nameAxisData: this.taskSpread.nameAxisData
        // }
        var testseriesData = [
        {name: '任务总数', type: 'bar', barMaxWidth: 20, barGap: 0, itemStyle: { normal: { color: '#4B78CD' } }, label: { normal: { show: true } }, data: this.taskSpread.taskNum},
        {name: '已完成', type: 'bar', barMaxWidth: 20, barGap: 0, itemStyle: { normal: { color: '#4ecb73' } }, label: { normal: { show: true } }, data: this.taskSpread.doneNum}
        ]
        const row = {
          xAxisData: this.taskSpread.zAxisData,
          seriesData: testseriesData
        }
        this.drawVBarTwo('taskTotal', row)
        this.drawByStation('taskSpread', taskSpread)
      })
    },
    // getprojectdatav3 () {
    //   if (this.listQuery.versionId === 0) {
    //     this.listQuery.versionId = ''
    //   }
    //   if (this.listQuery.tracker_id === '') {
    //     this.listQuery.tracker_id = '2'
    //   }
    //   this.listQuery.month = this.queryMonth
    //   getprojectdatav3(this.listQuery).then(response => {
    //     // console.log(this.listQuery)
    //     // console.log(response)
    //     this.rateData1 = response.data.rows
    //     this.total = response.data.total
    //     // console.log(this.total)
    //   })
    // },
    getprojectdatav9 () {
      this.listQuery.month = this.queryMonth
      getprojectdatav9(this.listQuery).then(response => {
        this.rateData1 = response.data.list
        this.total = response.data.total
        if (this.tabActiveName === 'six') {
          if (this.proactiveName === 'first') {
            this.rateData1 = response.data.verList
            this.total = response.data.verTotal
          } else if (this.proactiveName === 'second') {
            this.rateData1 = response.data.list
            this.total = response.data.total
          }
        }
      })
    },
    normchangeOrder2 (column, prop, order) {
      if (column.prop !== '') {
        this.listQuery.prope = column.prop
      }
      if (column.order === 'ascending') {
        this.listQuery.orderby = 'asc'
      } else {
        this.listQuery.orderby = 'desc'
      }
      guifan(this.listQuery).then(response => {
        this.rateData12 = response.data.list
        this.totalFive = response.data.total
      })
    },
    guifan () {
      this.rateData12 = []
      guifan(this.listQuery).then(response => {
        this.listLoading = false
        this.rateData12 = response.data.list
        this.totalFive = response.data.total
      })
    },
    guifanqushi () {
      // debugger
      guifanqushi(this.listQuery).then(response => {
        this.rateData3 = response.data
        const row = {
          xAxisData: this.rateData3.xAxisData,
          seriesData: this.rateData3.count
        }
        this.drawStacked('normdraw', row)
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
    getBugTrendData () {
      const row = {
        xq_ids: this.xqidss.join(','),
        fb_ids: this.fbIds
      }
      var xAxisData = []
      var allData = []
      var notclosedData = []
      var closedData = []
      getbugstaticdatav2(row).then(response => { // 获取bug趋势图数据
        const ele = response.data.data
        allData = ele.bug_list
        notclosedData = ele.unclose_bug_list
        xAxisData = ele.time_list
        closedData = ele.close_bug_list
        const barData = {
          xAxisData: xAxisData,
          allData: allData,
          notclosedData: notclosedData,
          closedData: closedData
        }
        this.drawBaseLine('bugTrend', barData)
        // this.drawBaseLine('bugTrend2', barData)
      })
      // 获取偏离趋势图
      // getDeviateTrend(this.listQuery).then(res => {
      //   const senddata = {
      //     xAxisData: res.data.data.xAxisData,
      //     duelist: res.data.data.duelist,
      //     reallist: res.data.data.reallist
      //   }
      //   this.drawBaseLinepianli('bugTrendpianli', senddata)
      //   this.drawBaseLinepianli('bugTrendpianli2', senddata)
      // })
    },
    drawByStation (id, graphData) {
      var yAxisData = graphData.yAxisData
      var seriesData = graphData.seriesData
      if (graphData.seriesData.length < 8) {
        document.getElementById(id).style.height = 240 + 'px'
      } else if (graphData.seriesData.length < 20) {
        document.getElementById(id).style.height = (seriesData.length * 25) + 'px'
      } else {
        document.getElementById(id).style.height = (seriesData.length * 20) + 'px'
      }
      // document.getElementById(id).style.width = this.$refs.taskscroll.clientHeight + 'px'
      this.myCharttask = echarts.init(document.getElementById(id))
      this.myCharttask.setOption({
        tooltip: { // 提示框
          formatter: function (params) {
            return params.name + '<br/>' + params.marker + '时间' + '：' + params.value[1] + '至' + params.value[2]
          }, // 数据的值
          // 修改提示框显示的位置
          confine: true
        //   position: function (point, params, dom, rect, size) {
        // // 其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
        //     var x = point[0]//
        //     var y = point[1]
        //     // var viewWidth = size.viewSize[0]
        //     // var viewHeight = size.viewSize[1]
        //     var boxWidth = size.contentSize[0]
        //     var boxHeight = size.contentSize[1]
        //     var posX = 0 // x坐标位置
        //     var posY = 0 // y坐标位置
        //     if (x < boxWidth) { // 左边放不开
        //       posX = 5
        //     } else { // 左边放的下
        //       posX = x - boxWidth
        //     }
        //     if (y < boxHeight) { // 上边放不开
        //       posY = 5
        //     } else { // 上边放得下
        //       posY = y - boxHeight
        //     }
        //     return [posX, posY]
        //   }
        },
        // legend: { // 图例
        //   data: '时间',
        //   bottom: '1%',
        //   selectedMode: false, // 图例设为不可点击
        //   textStyle: {
        //     color: '#000'
        //   }
        // },
        grid: { // 绘图网格
          left: '3%',
          right: '3%',
          top: '1%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          position: 'top',
          type: 'time'
        },
        yAxis: {
          data: yAxisData,
          // min: min,
          // max: max,
          splitNumber: 8
        },
        series: [
          // 用空bar来显示四个图例
          {name: '时间', type: 'bar', data: [], barGap: 0},
          {
            type: 'custom',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function (params) {
                    // console.log(params)
                    return params.data.datenum
                  }
                }
              }
            },
            renderItem: function (params, api) { // 开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
              var categoryIndex = api.value(0) // 这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
              var start = api.coord([api.value(1), categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
              var end = api.coord([api.value(2), categoryIndex])
              var height = 14 // 柱体宽度
              return {
                type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                shape: echarts.graphic.clipRectByRect({ // 矩形的位置和大小。
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                }, { // 当前坐标系的包围盒。
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                }),
                style: api.style()
                // barMinWidth: 50
              }
            },
            encode: {
              x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
              y: 0 // data 中『维度0』对应到 Y 轴
            },
            data: seriesData
          }
        ]
      }, true)
      this.myCharttask.resize()
    },
    // 折线区域折叠图
    drawStacked (id, graphData) {
      document.getElementById(id).style.width = window.innerWidth * 0.7 + 'px'
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#Ccc'
            }
          }
        },
        legend: {
          x: 'center',
          y: '-4px',
          data: ['总计']
        },
        grid: {
          top: '15%',
          left: '6%',
          right: '4%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: graphData.xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '总计',
            type: 'line',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#4B78CD', // 改变折线点的颜色
                lineStyle: {
                  color: '#4B78CD' // 改变折线颜色
                },
                label: {show: true}
              }
            },
            areaStyle: {
              normal: {color: '#4B78CD'} // 改变区域颜色
            },
            data: graphData.seriesData
          }
        ]
      }, true)
      myChart.resize()
    },
    // 柱状线型图（产线问题分布）
    drawLineBar (id, graphData) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#FF9900'
            }
          }
        },
        grid: {
          top: '15%',
          left: '6%',
          right: '4%',
          bottom: '12%',
          containLabel: true
        },
        legend: {
          // x: 'right',
          data: ['本月新增', '已解决', '待解决', '本月修复', '修复率']
        },
        xAxis: [
          {
            type: 'category',
            data: graphData.xAxisData,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              rotate: 18
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '本月问题',
            // min: 0,
            // max: 50,
            // interval: 50,
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: false
            },
            minInterval: 1
          },
          {
            type: 'value',
            name: '',
            // min: 0,
            // max: 50,
            // interval: 50,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '修复率',
            // min: 0,
            // max: 25,
            // interval: 5,
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '本月新增',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#4B78CD'
              }
            },
            barMaxWidth: 20,
            data: graphData.newBug
          },
          {
            name: '已解决',
            // barCategoryGap:0.5,
            type: 'bar',
            stack: '堆叠',
            itemStyle: {
              normal: {
                color: '#00CC66'
              }
            },
            barMaxWidth: 20,
            data: graphData.finishBug
          },
          {
            name: '待解决',
            type: 'bar',
            stack: '堆叠',
            itemStyle: {
              normal: {
                color: '#FF9900'
              }
            },
            barMaxWidth: 20,
            data: graphData.waitsolv
          },
          {
            name: '本月修复',
            type: 'line',
            itemStyle: {
              normal: {
                color: '#A5BCE6'
              }
            },
            data: graphData.finishBug
          },
          {
            name: '修复率',
            type: 'line',
            yAxisIndex: 2,
            itemStyle: {
              normal: {
                color: '#B3E19D'
              }
            },
            data: graphData.repairRate
          }
        ]
      }, true)
    },
     // 条形图
    drawHBar (id, graphData) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          // data: graphData.legendData,
          x: 'right',
          data: ['未解决', '已解决', '延期']
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '10%',
          bottom: '12%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: graphData.yAxisData
        },
        series: graphData.seriesData
      }, true)
    },
    // 堆叠双柱状图
    drawVBarTwoDuidie (id, graphData) {
      var bussScenario = document.getElementById(id)
      var myChart = echarts.init(bussScenario)
      myChart.setOption({
        color: ['#4B78CD', '#4cca73'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '15%',
          containLabel: true
        },
        legend: {
          data: ['已解决', '未解决', '延期', '已关闭', '未关闭', '已拒绝']
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: graphData.xAxisData
            // rotate: 30
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: graphData.seriesData
      }, true)
    },
    // 双柱状图
    drawVBarTwo (id, graphData) {
      var bussScenario = document.getElementById(id)
      var myChart = echarts.init(bussScenario)
      myChart.setOption({
        color: ['#4B78CD', '#4cca73'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '15%',
          containLabel: true
        },
        legend: {
          y: '-5px',
          x: 'center',
          data: ['创建', '执行', '未关闭', '已关闭', '任务总数', '已完成']
        },
        toolbox: {
          show: false,
          orient: 'vertical',
          left: 'right',
          top: '8%',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisTick: {show: false},
            data: graphData.xAxisData,
            axisLabel: {
              interval: 0,
              rotate: 30
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: graphData.seriesData
      }, true)
    },
    // 基础线图
    drawBaseLine (id, graphData) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['缺陷总数', '未关闭缺陷数', '关闭缺陷数']
        },
        grid: {
          top: '13%',
          left: '3%',
          right: '4%',
          bottom: '11%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: graphData.xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '缺陷总数',
            type: 'line',
            data: graphData.allData,
            itemStyle: {normal: {label: {show: true}}}
          },
          {
            name: '未关闭缺陷数',
            type: 'line',
            data: graphData.notclosedData,
            itemStyle: {normal: {label: {show: true}}}
          },
          {
            name: '关闭缺陷数',
            type: 'line',
            data: graphData.closedData,
            itemStyle: {normal: {label: {show: true, position: 'bottom'}}}
          }
        ]
      }, true)
    },
    drawBaseLinepianli (id, graphData) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          confine: true
          // position: function (point, params, dom, rect, size){
          //   if (dom.contentSize.width + 20 > point[0]) { // tooltip宽度 + 20 大于鼠标横向位置时，强制避免提示超出左侧画布
          //     return {left: 10, top: point[1]}
          //   }
          // }
        },
        legend: {
          data: ['预计完成天数', '实际完成天数']
        },
        grid: {
          top: '13%',
          left: '3%',
          right: '4%',
          bottom: '11%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: graphData.xAxisData,
          axisLabel: {
            interval: 'auto',
            // rotate: 10
            formatter: function (value) {
              if (value.length > 10) {
                let len = value.length
                var nn = parseInt(len / 10)
                var str = ''
                for (let i = 0; i < nn; i++) {
                  str = str + value.substring(i * 10, i * 10 + 10) + '\n'
                }
                str = str + value.substring(nn * 10)
                return str
              } else {
                return value
              }
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '预计完成天数',
            type: 'line',
            showAllSymbol: true,
            data: graphData.duelist,
            itemStyle: {normal: {label: {show: true}}}
          },
          {
            name: '实际完成天数',
            type: 'line',
            showAllSymbol: true,
            data: graphData.reallist,
            itemStyle: {normal: {label: {show: true}}}
          }
        ]
      }, true)
    }
  }
}
</script>

<style>
.el-progress--circle,.el-progress-circle{
  width: 110px;
  height: 110px;
}
</style>
<style >
.planEcharts .el-date-editor .el-range-separator{
  width: 8%;
}
.planEcharts{
  width: auto;
  height: auto;
  position: relative;
}
.projectProcess{
  /* margin-left: 25%; */
  text-align: center;
  margin-top: 8px;
  font-size: 30px;
  color: rgb(228, 133, 133);
}
#bugTrend{
  width: 95%;
  height: 270px;
}
#caseSpread{
  width: 800px;
  height: 235px;
}
#testBug{
  width: 550px;
  height: 270px;
}
#finishBug{
  width: 550px;
  height: 270px;
}
#productSpread{
  /* width: 1100px; */
  width: 100%;
  height: 270px;
}

#reqLife{
  width: 1100px;
  height: 270px;
}
#taskTotal{
  width: 480px;
  height: 270px;
}
#taskSpread{
  width: 600px;
  height:300px;
}
.el-table_header tr,
  .el-table_header th {
    padding: 0;
    height: 33px;
    text-align: center;
}
.caseExecutionCss >>> path:last-child {
  stroke: #4B78CD !important;
}
.caseExecutionCss path:nth-of-type(2){
    stroke: #4B78CD;
}
.caseRateCss path:nth-of-type(2){
    stroke: #4cca73;
}
.caseRateCss >>> path:last-child {
  stroke: #4cca73;
}
/* .progresscss{
  background-color: white;
  height: 240px;
  width: 14.8%;
  margin-right: 20px;
  align-content: center;
  position: relative;
}
.passTextCss{
  text-align: center;
  width: 85px;
  z-index: 1;
  position: absolute;
  margin-top: 45%;
  margin-left: 18%;
}
.progresspart{
  margin-left: 14%;
  margin-top: 30%;
  position: absolute;
  z-index: 0;
} */
.dateCss{
  width: 320px;
  /* margin-top: 10px; */
  background-color: white;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.projectMess{
  text-align: center;
  position: absolute;
  width: 10%;
  height: 15%;
  margin-top: 5%;
  overflow: hidden;
  outline: 0;
  -webkit-overflow-scrolling: touch;
  background-color: rgba(0, 0, 0, 0.5);  
  filter: alpha(opacity=60);  
  background-color: rgba(0, 0, 0, 0.452); 
  z-index: 9999;
}
.changeColor{
  background-color: yellow !important;
}


#building-top th{
  background-color: #4B78CD !important;
}
/* #building-top th:nth-of-type(4){
  background-color: pink !important;
} */
#thchange .el-table th{
  background-color: #4B78CD !important;
}
/* 导航盒子 */
.headWarp{
  background-color: #4B78CD !important;
  height: 43px !important;
}
/* ul导航 */
.el-menu {
  background-color: #4B78CD !important;
  height:44px !important;
}

/* 导航li */
.el-menu-item{
  background-color: #4B78CD !important;
  height: 100% !important;
  line-height: 44px !important;
}
.el-tabs--border-card>.el-tabs__content {
  padding: 0;
}
.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
  color:#4B78CD;
}



.progresscss{
  background-color: white;
  margin-left: 12px;
  height: 240px;
  width: 13.9%;
  align-content: center;
  position: relative;
}
.passTextCss{
  text-align: center;
  width: 80px;
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-60%);
}
.progresspart{
  /* margin-left: 10%;
  margin-top: 28%; */
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
}
.el-progress--circle,.el-progress-circle{width: 110px;
    height: 110px;
}
.progresscss{
  flex: 1;
   display: flex;
  align-items: center;
  margin: 0;
  margin-right: 10px !important;

}
.progresspart{
  width: 100% !important;
  height: 100% !important;
  display: flex;
  justify-content: center;
  align-items: center;
    margin-bottom: 20%;

}
/* .passTextCss{
  margin: 0 !important;
} */
.el-progress-circle{
  width: 100% !important;
}
.el-progress--circle, .el-progress-circle {
    width: 70%;
    /* min-height: 52%; */
    margin-bottom: 15%;
}
.el-table {
  margin-top: 0px;
}
.pagination-container{
  overflow: hidden;
}
.el-pagination{
  padding:  10px 5px;
  float: right !important;
}
.changenormdraw{
  background-color: #fff;
}
.el-row{
  width: 100%;
}
#normdraw:nth-of-type(1){
  width: 99%;
}
#normdraw{
  width: 1000px;
  margin: auto;
  height: 270px;
  background-color: #fff;
}
.renwu::-webkit-scrollbar {
  display: block
}
.scrollecs{
  width: 100%;
  height: 300px;
}
.onmouthFix .el-select-dropdown__wrap,.el-scrollbar__wrap{
  margin-bottom: 0px !important;
  margin-right: 0px !important;
  margin-top: 50px !important;
}
/* .el-input__inner{
   height: 28px;
} */
/* .setdate,.el-input__prefix,.el-input__suffix{
  top: -5px;
} */
.setdate .el-input__icon{
  line-height: 31px;
}
.lineprogress,.el-col-16{
  width: 70.5%;
}
.reqradios .el-radio+.el-radio{
  margin-left: 0px;
  margin-top: 10px;
}

.el-radio .el-radio__label {
  padding-left: 5px !important;
  font-size: 10px !important;
}
  #building-top .el-table__header-wrapper {
    height: 72px !important;
  }
  .planEcharts .el-tabs--top.el-tabs--border-card .el-tabs__item:nth-child(2){
    padding: 0 !important;
  }
  .planEcharts .el-tabs--top.el-tabs--border-card .el-tabs__item:last-child{
    padding: 0 !important;
  }
</style>

<style lang="scss">
  // .fixedSearch .el-scrollbar{
  //   width: 200px;
  //   height: 315px;
  // }
  .mouFix .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
  
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .ddBox{
    position: absolute;
    left: 3px;
    top: 5px;
  }
  .planEcharts .el-dialog__wrapper{
    z-index: 20001 !important;
  }
</style>
<style scoped>
  .nowpro >>> .el-tabs__nav-wrap::after{
    height: 0;
  }
  .nowpro >>> .el-tabs__active-bar{
    height: 0;
  }
  #nowpro >>> .el-tabs__item{
    width: initial;
    padding: 0 15px !important;
    background-color: #f2f2f2;
    margin-right:30px;
    border-radius: 3px;
  }
  #nowpro >>> .el-tabs__item:hover{
    color: initial;
  }
  #nowpro >>> .el-tabs__item.is-active{
    background-color: #4b78cd;
    color:#fff;
  }
</style>
<style>
  .el-table::before{
    height: 0px !important;
  }
  .el-table__header{
    width: 100% !important;
  }
  .el-table__empty-block{
    width: 100% !important;
  }
  .el-table__body{
    width: 100% !important;
  }
  #thchange .el-table td{
    padding: 10px 0;
  }
</style>

<style scoped>
/* 完成超时  正常完成  进行中已超时 进行中未超时 */
  .wccs{
    background-color: red !important;
    /* background-image: url('~@/assets/img/q01.png'); */

  }
  .zcjs{
    background-color: #4b78cd !important;
  }
  .jxzycs{
    background-image: url('~@/assets/img/q02.png') !important;
  }
  .jxzwcs{
    background-image: url('~@/assets/img/q01.png') !important;
  }
  /* .planEcharts >>> .el-table th>.cell{
    padding-right: 40px;
  } */
</style>