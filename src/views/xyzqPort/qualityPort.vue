<template>
  <div class="planEcharts" id="qualit">
    <div style="display:flex;align-items:center;background: white;height:50px;">
      <div style="margin-left:30px">项目</div>
      <el-select filterable v-model="listQuery.project_id" style="margin-left:10px;position:relative" @change="getversiondict('1', 0)">
        <el-input placeholder="请输入搜索内容" style="padding:0 15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
        <el-option
          v-for="projectItem in projectOptions"
          :key="projectItem.id"
          :label='projectItem.name'
          :value='projectItem.id'
          >
        </el-option>
      </el-select>
      <el-select filterable v-model="listQuery.version_id" style="margin-left:30px" @change="getprojectdatav2">
        <el-input placeholder="请输入搜索内容" style="padding:0 15px;" v-model='versearchText' @input="versearchInfo" @focus='leaveinps'></el-input>
        <el-option
          v-for="versionItem in versionOptions"
          :key="versionItem.id"
          :label='versionItem.text'
          :value='versionItem.id'>
        </el-option>
      </el-select>
      <el-select filterable v-model="xqidss" style="margin-left:30px;width:50%;" multiple @change="reqChange" value-key="id">
        <el-input placeholder="请输入搜索内容" style="padding:0 15px;" v-model='reqsearchText' @input="reqsearchInfo"></el-input>
        <el-option
          v-for="reqItem in reqOptions"
          :key="reqItem.id"
          :label='reqItem.text'
          :value='reqItem'>
        </el-option>
      </el-select>
    </div>
    <div style="margin-top:10px;">
      <el-row style="margin-top:10px;">
        <el-col :span="7"  id="thchange">
          <el-table class="el-table_header" ref="multipleTable" :data="projectListData" v-loading="projectlistLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 98%;margin-left:0px;height:300px;font-size: 13px;text-align:center;z-index:0;"
            :row-style="{height:'42px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background: '#a7d2f9', color: '#fff'}">
            <el-table-column align="center" min-width=40 label="指标" height=33>
              <template slot-scope='scope'>
                <div >{{scope.row.indtype}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=25 label="总计" height=33>
              <template slot-scope='scope'>
                <div >{{scope.row.totalNum}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=25 label="未完成" height=33>
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
                  <img v-if="scope.row.type === 'up' && scope.row.indtype === 'Redmine不规范'" style="width: 15px; height: 15px" src="~@/assets/img/up1.png">
                  <img v-if="scope.row.type === 'down' && scope.row.indtype === 'Redmine不规范'" style="width: 15px; height: 15px" src="~@/assets/img/down2.png">
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
        </el-col>
        <el-col :span="4">
          <div style="height: 80px;background-color: white;width: 100%;">
            <div style="height: 13px;background-color: white;width: 100%;"></div>
            <div style="position: relative;">
              <b style="margin-left: 15px;font-size: 16px;position: absolute;line-height: 25px;">计划完成日期</b>
              <div v-if="planmess !== ''" 
                style="width: 30%;height: 25px;background-color: #fef1f1;position: absolute;margin-left: 65%;text-align: center;line-height: 25px;">
                <span style="color: #f56c6c;line-height: 25px;">{{planmess}}</span>
              </div>
            </div><br/>
            <div style="height: 15px;background-color: white;width: 100%;"></div>
            <b style="margin-left: 20%;font-size: 23px;">{{finishDate}}</b>
          </div>
          <div style="background-color: white;width:100%;height:80px;margin-top: 10px;">
            <div style="height: 13px;background-color: white;width: 100%;"></div>
            <b style="margin-left: 15px;font-size: 16px;">项目进度</b>
            <!-- <div class="projectMess" v-show="projectMess"><span style="color: #fff;">{{proErroMess}}</span></div> -->
            <div class="projectProcess" v-on:mouseover="projectMess = true"  v-on:mouseout="projectMess = false">{{projectProcess}}</div>
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
    <div style="margin-top:10px;" class="proline">
      <el-tabs type="border-card" v-model="tabActiveName" @tab-click='tabClick(1)' style="background-color: #f2f2f2;">
        <el-tab-pane label="需求" name="one">
          <el-row style="margin-top:10px;">
            <el-col id="building-top">
              <el-table border ref="multipleTable" :data="reqTaskListData" v-loading="listLoading" element-loading-text="加载中。。。"
                tooltip-effect="dark" style="width: 100%;min-height:200px;font-size: 13px;hieght:72px;" :header-cell-style="{background: '#5ca4e5', color: '#fff'}">
                <el-table-column align="center" width=400 label="需求" type="index" height=72>
                  <template slot-scope='scope'>
                    <div>{{maxText(scope.row.reqname)}}</div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width=120 label="需求设计>计划完成日期>完成/总计" height=72 :render-header="renderHeader">
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
                <el-table-column align="center" min-width=100 label="开发>完成日期>完成/总计" height=72 :render-header="renderHeader">
                  <template slot-scope='scope'>
                    <!-- <div v-if='scope.row.kfTime=== "--" || scope.row.kfTime=== ""'><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:75px;">{{scope.row.kfTime}}</span><span style="float:left">{{scope.row.reqRate}}</span></div>
                    <div v-else><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:10px;">{{scope.row.kfTime}}</span><span style="float:left">{{scope.row.kfRate}}</span></div> -->
                    
                    <div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-if="scope.row.kfTime===null">--</div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-else>{{scope.row.kfTime.split(' ')[0]}}</div>
                      <span>{{scope.row.kfRate}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width=100 label="测试>完成日期>完成/总计" height=72 :render-header="renderHeader">
                  <template slot-scope='scope'>
                    <!-- <div v-if="scope.row.testTime==='--' || scope.row.testTime===''"><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:75px;">{{scope.row.testTime}}</span><span style="float:left">{{scope.row.testRate}}</span></div>
                    <div v-else><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:15px;">{{scope.row.testTime}}</span><span style="float:left">{{scope.row.testRate}}</span></div> -->

                    <div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-if="scope.row.testTime===null">--</div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-else>{{scope.row.testTime.split(' ')[0]}}</div>
                      <span>{{scope.row.testRate}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" min-width=100 label="上线>完成日期>完成/总计" height=72 :render-header="renderHeader">
                  <template slot-scope="scope">
                    <!-- <div v-if="scope.row.sxTime==='--' || scope.row.sxTime===''"><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:75px;">--</span><span style="float:left">{{scope.row.sxRate}}</span></div>
                    <div v-else><span style="display:inline-block;width:180px;text-align:left;float:left;padding-left:15px;">{{scope.row.sxTime}}</span><span style="float:left">{{scope.row.sxRate}}</span></div> -->
                    
                    <div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-if="scope.row.sxTime===null">--</div>
                      <div style="display:inline-block;width:50%;float:left;height:30px;" v-else>{{scope.row.sxTime.split(' ')[0]}}</div>
                      <span>{{scope.row.sxRate}}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-table border ref="multipleTable" :data="reqListData" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;" 
            :default-sort="{prop: '', order: ''}"
            @sort-change="changeOrder">
            <el-table-column align="center" width=100 label="需求ID" sortable="custom" prop=1 height=33>
              <template slot-scope='scope'>
                <div v-html="scope.row[1]"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=90 label="优先级" sortable="custom" prop=2 height=33>
              <template slot-scope='scope'>
                <div v-if="scope.row[2] === '普通'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto">
                  <span style="color: #409eff">{{scope.row[2]}}</span></div>
                <div v-if="scope.row[2] === '高'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto">
                  <span style="color: #67c23a">{{scope.row[2]}}</span></div>
                <div v-if="scope.row[2] === '紧急'" style="width: 50px;height: 30px;background-color: #fdf6ec;line-height: 30px;margin:auto">
                  <span style="color: #e6a23c">{{scope.row[2]}}</span></div>
                <div v-if="scope.row[2] === '立刻'" style="width: 50px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto">
                  <span style="color: #f56c6c">{{scope.row[2]}}</span></div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=110 label="主题" sortable="custom" prop=3 height=33>
              <template slot-scope='scope'>
                <div  style="text-align:left">{{maxText(scope.row[3])}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=90 label="状态"  sortable="custom" prop=4 height=33>
              <template slot-scope="scope">
                <div v-if="scope.row[4] === '已关闭'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;">
                  <span style="color: #67c23a">{{scope.row[4]}}</span>
                </div>
                <div v-else-if="scope.row[4] === '暂停'" style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;">
                  <span style="color: #f56c6c">{{scope.row[4]}}</span>
                </div>
                <div v-else style="width: 70px;height: 30px;background-color: #ecf5ff;line-height: 30px;">
                  <span style="color: #409eff">{{scope.row[4]}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column sortable="custom" prop=15 align="center" width=100 label="bug数" height=33>
              <template slot-scope='scope'>
                <div>{{scope.row[15]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=60 label="未关闭bug数" height=33 sortable="custom" prop=16>
              <template slot-scope='scope'>
                <div>{{scope.row[16]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=100 label="用例数" height=33 sortable="custom" prop=17>
              <template slot-scope='scope'>
                <div>{{scope.row[17]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=40 label="指派给"  sortable="custom" prop=5 height=33>
              <template slot-scope='scope'>
                <div>{{scope.row[5]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=60 label="需求提出人"  sortable="custom" prop=6 height=33>
              <template slot-scope='scope'>
                <div>{{scope.row[6]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=150 label="创建时间" height=33 sortable="custom" prop=7>
              <template slot-scope='scope'>
                <div>{{scope.row[7]}}</div>
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
          <div class="dateCss">
            <div style="margin-left:30px;margin-right: 10px;">统计月份</div>
            <el-date-picker
              v-model="queryMonth"
              type="month"
              placeholder="选择月"
              @change="getfeedbackdatalistv2"
              value-format="yyyy-MM-dd" class="setdate">
            </el-date-picker>
          </div>
          <el-table ref="multipleTable" :data="productListData" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;min-height:200px;font-size: 13px;"
            :default-sort="{prop: '', order: ''}"
            @sort-change="productchangeOrder">
            <el-table-column align="center" width=120 label="缺陷ID" height=33 sortable="custom" prop=1>
              <template slot-scope='scope'>
                <div  v-html="scope.row[1]"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="优先级" height=33 sortable="custom" prop=4>
              <template slot-scope='scope'>
                <div v-if="scope.row[4] === '普通'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #409eff">{{scope.row[4]}}</span></div>
                <div v-if="scope.row[4] === '高'" style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #67c23a">{{scope.row[4]}}</span></div>
                <div v-if="scope.row[4] === '紧急'" style="width: 50px;height: 30px;background-color: #fdf6ec;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #e6a23c">{{scope.row[4]}}</span></div>
                <div v-if="scope.row[4] === '立刻'" style="width: 50px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #f56c6c">{{scope.row[4]}}</span></div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=150 label="主题" height=33 sortable="custom" prop=2>
              <template slot-scope='scope'>
                <div  style="text-align:left">{{scope.row[2]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=150 label="状态" height=33 sortable="custom" prop=3>
              <template slot-scope='scope'>
                <span v-if="scope.row[3] === '已关闭'" style="padding:8px 10px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #67c23a">{{scope.row[3]}}</span>
                </span>
                <span v-else-if="scope.row[3] === '拒绝修复'" style="padding:8px 10px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #f56c6c">{{scope.row[3]}}</span>
                </span>
                <span v-else style="padding:8px 10px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px">
                  <span style="color: #409eff">{{scope.row[3]}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="指派给" height=33 sortable="custom" prop=5>
              <template slot-scope="scope">
                <div >{{scope.row[5]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="反馈者" height=33 sortable="custom" prop=6>
              <template slot-scope='scope'>
                <div >{{scope.row[6]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=120 label="作者" height=33 sortable="custom" prop=7>
              <template slot-scope='scope'>
                <div >{{scope.row[7]}}</div>
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
              <div style="height: 30px;background-color: white;width: 100%;padding:15px 30px;">
                <b style="margin-left: 15px;font-size: 16px;">任务统计</b>
              </div>
              <div style="background-color: white;width:100%;height:240px;">
                <div id='taskTotal' ref="taskTotal" style="margin:0 auto"></div>
              </div>
            </el-col>
          </el-row>
          <el-table ref="multipleTable" :data="taskListData" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;"
            :default-sort="{prop: '', order: ''}"
            @sort-change="taskchangeOrder">
            <el-table-column align="center" width=110 label="任务ID" height=33 sortable="custom" prop=1>
              <template slot-scope='scope'>
                <div v-html="scope.row[1]"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=30 label="优先级" height=33 sortable="custom" prop=2>
              <template slot-scope='scope'>
                <div v-if="scope.row[2] === '普通'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row[2]}}</span></div>
                <div v-else style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row[2]}}</span></div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=150 label="主题" height=33 sortable="custom" prop=3>
              <template slot-scope='scope'>
                <div  style="text-align:left">{{scope.row[3]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=110 label="任务类型" height=33 sortable="custom" prop=13>
              <template slot-scope='scope'>
                <div v-if="scope.row[13] === 'kf'">开发</div>
                <div v-if="scope.row[13] === 'cs'">测试</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=40 label="状态" height=33 sortable="custom" prop=4>
              <template slot-scope="scope">
                <div v-if="scope.row[4] === '编码完成'" style="width: 70px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row[4]}}</span>
                </div>
                <div v-else-if="scope.row[4] === '已关闭'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row[4]}}</span>
                </div>
                <div v-else style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row[4]}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=30 label="指派给" height=33 sortable="custom" prop=5>
              <template slot-scope='scope'>
                <div >{{scope.row[5]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=40 label="计划完成时间" height=33 sortable="custom" prop=6>
              <template slot-scope='scope'>
                <div >{{scope.row[6]}}</div>
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
          <el-table ref="multipleTable" :data="normListData" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;"
            :default-sort="{prop: '', order: ''}"
            @sort-change="normchangeOrder">
            <el-table-column align="center" min-width=70 label="规范问题ID" height=33 sortable="custom" prop=4>
              <template slot-scope='scope'>
                <div  v-html="scope.row[4]"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=100 label="流程" height=33 sortable="custom" prop=2>
              <template slot-scope='scope'>
                <div v-if="scope.row[2] === '需求'" style="width: 80px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row[2]}}</span></div>
                <div v-else-if="scope.row[2] === '生产反馈'" style="width: 80px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row[2]}}</span></div>
                <div v-else style="width: 80px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row[2]}}</span></div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=160 label="标题" height=33 sortable="custom" prop=5>
              <template slot-scope='scope'>
                <div  style="text-align:left">{{scope.row[5]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=130 label="错误原因" height=33 sortable="custom" prop=8>
              <template slot-scope='scope'>
                <div >{{scope.row[8]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=90 label="状态" height=33 sortable="custom" prop=3>
              <template slot-scope="scope">
                <div v-if="scope.row[3] === '已关闭'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row[3]}}</span>
                </div>
                <div v-else-if="scope.row[3] === '拒绝修复' || scope.row[3] === '延期'" style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row[3]}}</span>
                </div>
                <div v-else style="width: 70px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row[3]}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=80 label="分配给" height=33 sortable="custom" prop=7>
              <template slot-scope='scope'>
                <div >{{scope.row[7]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=110 label="创建日期" height=33 sortable="custom" prop=6>
              <template slot-scope='scope'>
                <div >{{scope.row[6]}}</div>
              </template>
            </el-table-column>
          </el-table>
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
          <el-table ref="multipleTable" :data="caseListData" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;"
            :default-sort="{prop: '', order: ''}"
            @sort-change="casechangeOrder">
            <el-table-column align="center" width=100 label="用例ID" height=33 sortable="custom" prop=1>
              <template slot-scope='scope'>
                <div  v-html="scope.row[1]"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=85 label="优先级" height=33 sortable="custom" prop=5>
              <template slot-scope='scope'>
                <div v-if="scope.row[5] === '普通'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row[5]}}</span>
                </div>
                <div v-else style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row[5]}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=150 label="主题" height=33 sortable="custom" prop=2>
              <template slot-scope='scope'>
                <div  style="text-align:left">{{scope.row[2]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=85 label="状态" height=33 sortable="custom" prop=3>
              <template slot-scope="scope">
                <div >{{scope.row[3]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=100 label="执行结果" height=33 sortable="custom" prop=4>
              <template slot-scope="scope">
                <div v-if="scope.row[4] === '通过'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row[4]}}</span>
                </div>
                <div v-else-if="scope.row[4] === '不通过'" style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row[4]}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=100 label="用例类型" height=33 sortable="custom" prop=6>
              <template slot-scope="scope">
                <div >{{scope.row[6]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=85 label="指派给" height=33 sortable="custom" prop=7>
              <template slot-scope='scope'>
                <div >{{scope.row[7]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=85 label="作者" height=33 sortable="custom" prop=8>
              <template slot-scope='scope'>
                <div >{{scope.row[8]}}</div>
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
          <el-table ref="multipleTable" :data="bugListData" v-loading="listLoading" element-loading-text="加载中。。。"
            tooltip-effect="dark" style="width: 100%;margin-top:10px;min-height:200px;font-size: 13px;"
            :default-sort="{prop: '', order: ''}"
            @sort-change="bugchangeOrder">
            <el-table-column align="center" width=110 label="缺陷ID" height=33 sortable="custom" prop=1>
              <template slot-scope='scope'>
                <div  v-html="scope.row[1]"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=30 label="优先级" height=33 sortable="custom" prop=4>
              <template slot-scope='scope'>
                <div v-if="scope.row[4] === '普通'" style="width: 50px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row[4]}}</span>
                </div>
                <div v-else style="width: 50px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row[4]}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=150 label="主题" height=33 sortable="custom" prop=2>
              <template slot-scope='scope'>
                <div  style="text-align:left">{{scope.row[2]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width=140 label="需求ID" height=33 sortable="custom" prop=8>
              <template slot-scope='scope'>
                <div  v-html="scope.row[8]"></div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=40 label="状态" height=33 sortable="custom" prop=3>
              <template slot-scope="scope">
                <div >{{scope.row[3]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=40 label="严重级别" height=33 sortable="custom" prop=5>
              <template slot-scope='scope'>
                <div v-if="scope.row[5] === '3-一般'" style="width: 70px;height: 30px;background-color: #f0f9ec;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #67c23a">{{scope.row[5]}}</span>
                </div>
                <div v-else-if="scope.row[5] === '4-优化'" style="width: 70px;height: 30px;background-color: #ecf5ff;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #409eff">{{scope.row[5]}}</span>
                </div>
                <div v-else style="width: 70px;height: 30px;background-color: #fef1f1;line-height: 30px;margin:auto;border-radius:5px;">
                  <span style="color: #f56c6c">{{scope.row[5]}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=30 label="指派给" height=33 sortable="custom" prop=6>
              <template slot-scope='scope'>
                <div >{{scope.row[6]}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" min-width=30 label="作者" height=33 sortable="custom" prop=7>
              <template slot-scope='scope'>
                <div >{{scope.row[7]}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <div v-if="total >= 1" class="pagination-container" style="background-color: white;overflow:hidden">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageRow.pageNo"
            :page-sizes="[10,20,30,50]" :page-size="pageRow.pageSize" layout="total, sizes, prev, pager, next" :total="total" style="float:right"> 
          </el-pagination>
        </div>
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
import {getprojectdict, getbugstaticdatav2, getprojectdatav2, getversiondict, getxqdatav2, getqualitydatav2, getcasedatav2, getfeedbackstaticlistv2,
getbugdatav2, getfeedbackdatalistv2, getchecklist, getkfdata, getcsdata, getplantime, getillegalnumlist, getReqNumByTime} from '@/api/xyzqPort/qualityPort'
import echarts from 'echarts'
import Vue from 'vue'
import API from '@/api'
export default {
  name: 'index',
  data () {
    return {
      searchText: '',
      versearchText: '',
      reqsearchText: '',
      projectlistLoading: false,
      proErroMess: 'bug未修复',
      projectMess: false,
      queryMonth: '0',
      listLoading: false,
      caseRate: 13,
      caseExecution: 98,
      strokeWidth: 12,
      progressWidth: 120,
      total: 0,
      tabActiveName: 'one',
      projectProcess: '未知',
      finishDate: '未知',
      pageRow: {
        pageNo: 1,
        pageSize: 50
      },
      listQuery: {
        project_id: '',
        version_id: ''
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
      caseListDatas: [],
      reqListDatas: [],
      bugIds: '',
      bugListDatas: [],
      planmess: '',
      taskIds: [],
      allOptions: [
        {id: 1, text: '新建'},
        {id: 2, text: '修复中'},
        {id: 3, text: '已修复'},
        {id: 4, text: '延期'},
        {id: 4, text: '已关闭'},
        {id: 5, text: '已拒绝'},
        {id: 6, text: '重新打开'},
        {id: 7, text: '已提测'},
        {id: 8, text: '评审完成'},
        {id: 9, text: '开发中'},
        {id: 10, text: '测试中'},
        {id: 11, text: '待验收'},
        {id: 12, text: '验收完成'},
        {id: 13, text: '测试退回'},
        {id: 14, text: '部分上线'},
        {id: 15, text: '编码完成'},
        {id: 16, text: '未解决'},
        {id: 17, text: '重打开'},
        {id: 18, text: '等待变更'},
        {id: 19, text: '变更完成'},
        {id: 20, text: '待重现'},
        {id: 21, text: '实施中'},
        {id: 22, text: '代码审查中'},
        {id: 23, text: '取消'},
        {id: 24, text: '验证中'},
        {id: 25, text: '待执行'},
        {id: 26, text: '待审批'},
        {id: 27, text: '已验证'},
        {id: 28, text: '已上线'},
        {id: 29, text: '方案待确认'},
        {id: 30, text: '部分完成'},
        {id: 31, text: '拒绝修复'},
        {id: 32, text: '低'},
        {id: 33, text: '普通'},
        {id: 34, text: '高'},
        {id: 35, text: '紧急'},
        {id: 36, text: '立刻'},
        {id: 37, text: '通过'},
        {id: 38, text: '不通过'}
      ],
      mouthreqnum: '',
      radio: 3,
      reqnumtime: {
        start: '',
        end: ''
      },
      noproFlag: false
    }
  },
  created () {
    var url = window.location.href
    if (url.indexOf('?token=') !== -1) {
      localStorage.setItem('tabIndex', 454)
      this.loginEiac()
    }
    this.getOptionsDatas()
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    this.reqnumtime.start = this.getTimeByDate(start)
    this.reqnumtime.end = this.getTimeByDate(end)
  },
  mounted () {
    this.$nextTick(function () {
      // this.getOptionsDatas()
    })
    this.$refs.normdraw.width = '100%'
    // console.log(this.reqnumtime)
  },
  activated () {
    this.getOptionsDatas()
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
        this.$router.push({ name: 'qualityPort' })
      }
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
        project_id: this.listQuery.project_id,
        start: this.reqnumtime.start,
        end: this.reqnumtime.end
      }
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
    changeOrder (column, prop, order) {
      var key = column.prop - 0
      // console.log(key)
      // console.log(column)
      // console.log(prop)
      if (key === 5 || key === 6) {
        this.reqListDatas.sort(function compareFunction (param1, param2) {
          var ord = 0
          if (column.order === 'ascending') {
            ord = param1[key].localeCompare(param2[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          } else {
            ord = param2[key].localeCompare(param1[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          }
          return ord
        })
      } else {
        var options = this.allOptions
        this.reqListDatas.sort(function (obj1, obj2) {
          let val1 = 0
          let val2 = 0
          if (obj1[key] !== null && obj2[key] !== null) {
            if (key === 1) {
              val1 = obj1[key].split(' ')[4].replace('#', '') - 0
              val2 = obj2[key].split(' ')[4].replace('#', '') - 0
            } else if (key === 3) {
              val1 = obj1[key].length
              val2 = obj2[key].length
            } else if (key === 2 || key === 4) {
              for (let i = 0; i < options.length; i++) {
                const ele = options[i]
                if (ele.text === obj1[key]) {
                  val1 = ele.id
                }
                if (ele.text === obj2[key]) {
                  val2 = ele.id
                }
              }
            } else {
              val1 = obj1[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
              val2 = obj2[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
            }
          }
          if (column.order === 'ascending') {
            return val1 - val2
          } else {
            return val2 - val1
          }
        })
      }
      this.handleSizeChange(50)
    },
    productchangeOrder (column, prop, order) {
      var key = column.prop - 0
      if (key === 5 || key === 6 || key === 7) {
        this.productListDatas.sort(function compareFunction (param1, param2) {
          var ord = 0
          if (column.order === 'ascending') {
            ord = param1[key].localeCompare(param2[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          } else {
            ord = param2[key].localeCompare(param1[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          }
          return ord
        })
      } else {
        var options = this.allOptions
        this.productListDatas.sort(function (obj1, obj2) {
          let val1 = 0
          let val2 = 0
          if (obj1[key] !== null && obj2[key] !== null) {
            if (key === 1) {
              val1 = obj1[key].split(' ')[4].replace('#', '') - 0
              val2 = obj2[key].split(' ')[4].replace('#', '') - 0
            } else if (key === 2) {
              val1 = obj1[key].length
              val2 = obj2[key].length
            } else if (key === 3 || key === 4) {
              for (let i = 0; i < options.length; i++) {
                const ele = options[i]
                if (ele.text === obj1[key]) {
                  val1 = ele.id
                }
                if (ele.text === obj2[key]) {
                  val2 = ele.id
                }
              }
            } else {
              val1 = obj1[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
              val2 = obj2[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
            }
          }
          if (column.order === 'ascending') {
            return val1 - val2
          } else {
            return val2 - val1
          }
        })
      }
      this.handleSizeChange(50)
    },
    taskchangeOrder (column, prop, order) {
      var key = column.prop - 0
      if (key === 13 || key === 5) {
        this.taskListDatas.sort(function compareFunction (param1, param2) {
          var ord = 0
          if (column.order === 'ascending') {
            ord = param1[key].localeCompare(param2[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          } else {
            ord = param2[key].localeCompare(param1[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          }
          return ord
        })
      } else {
        var options = this.allOptions
        this.taskListDatas.sort(function (obj1, obj2) {
          let val1 = 0
          let val2 = 0
          if (obj1[key] !== null && obj2[key] !== null) {
            if (key === 1) {
              val1 = obj1[key].split(' ')[4].replace('#', '') - 0
              val2 = obj2[key].split(' ')[4].replace('#', '') - 0
            } else if (key === 3) {
              val1 = obj1[key].length
              val2 = obj2[key].length
            } else if (key === 4 || key === 2) {
              for (let i = 0; i < options.length; i++) {
                const ele = options[i]
                if (ele.text === obj1[key]) {
                  val1 = ele.id
                }
                if (ele.text === obj2[key]) {
                  val2 = ele.id
                }
              }
            } else {
              val1 = obj1[key].replace(/-/g, '') - 0
              val2 = obj2[key].replace(/-/g, '') - 0
            }
          }
          if (column.order === 'ascending') {
            return val1 - val2
          } else {
            return val2 - val1
          }
        })
      }
      this.handleSizeChange(50)
    },
    normchangeOrder (column, prop, order) {
      var key = column.prop - 0
      // console.log(key)
      if (key === 7) {
        this.normListDatas.sort(function compareFunction (param1, param2) {
          var ord = 0
          if (column.order === 'ascending') {
            ord = param1[key].localeCompare(param2[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          } else {
            ord = param2[key].localeCompare(param1[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          }
          return ord
        })
      } else {
        var options = this.allOptions
        this.normListDatas.sort(function (obj1, obj2) {
          let val1 = 0
          let val2 = 0
          if (obj1[key] !== null && obj2[key] !== null) {
            if (key === 4) {
              val1 = obj1[key].split(' ')[4].replace('#', '') - 0
              val2 = obj2[key].split(' ')[4].replace('#', '') - 0
            } else if (key === 5 || key === 8) {
              val1 = obj1[key].length
              val2 = obj2[key].length
            } else if (key === 2 || key === 3) {
              for (let i = 0; i < options.length; i++) {
                const ele = options[i]
                if (ele.text === obj1[key]) {
                  val1 = ele.id
                }
                if (ele.text === obj2[key]) {
                  val2 = ele.id
                }
              }
            } else {
              val1 = obj1[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
              val2 = obj2[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
            }
          }
          if (column.order === 'ascending') {
            return val1 - val2
          } else {
            return val2 - val1
          }
        })
      }
      this.handleSizeChange(50)
    },
    casechangeOrder (column, prop, order) {
      var key = column.prop - 0
      if (key === 7 || key === 8) {
        this.caseListDatas.sort(function compareFunction (param1, param2) {
          var ord = 0
          if (column.order === 'ascending') {
            ord = param1[key].localeCompare(param2[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          } else {
            ord = param2[key].localeCompare(param1[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          }
          return ord
        })
      } else {
        var options = this.allOptions
        this.caseListDatas.sort(function (obj1, obj2) {
          let val1 = 0
          let val2 = 0
          if (obj1[key] !== null && obj2[key] !== null) {
            if (key === 1) {
              val1 = obj1[key].split(' ')[4].replace('#', '') - 0
              val2 = obj2[key].split(' ')[4].replace('#', '') - 0
            } else if (key === 2) {
              val1 = obj1[key].length
              val2 = obj2[key].length
            } else if (key === 3 || key === 4 || key === 5 || key === 6) {
              for (let i = 0; i < options.length; i++) {
                const ele = options[i]
                if (ele.text === obj1[key]) {
                  val1 = ele.id
                }
                if (ele.text === obj2[key]) {
                  val2 = ele.id
                }
              }
            } else {
              val1 = obj1[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
              val2 = obj2[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
            }
          }
          if (column.order === 'ascending') {
            return val1 - val2
          } else {
            return val2 - val1
          }
        })
      }
      this.handleSizeChange(50)
    },
    bugchangeOrder (column, prop, order) {
      var key = column.prop - 0
      if (key === 6 || key === 7) {
        this.bugListDatas.sort(function compareFunction (param1, param2) {
          var ord = 0
          if (column.order === 'ascending') {
            ord = param1[key].localeCompare(param2[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          } else {
            ord = param2[key].localeCompare(param1[key], 'zh-Hans-CN', {sensitivity: 'accent'})
          }
          return ord
        })
      } else {
        var options = this.allOptions
        this.bugListDatas.sort(function (obj1, obj2) {
          let val1 = 0
          let val2 = 0
          if (obj1[key] !== null && obj2[key] !== null) {
            if (key === 1 || key === 8) {
              val1 = obj1[key].split('#')[1].split(' ')[0] - 0
              val2 = obj2[key].split('#')[1].split(' ')[0] - 0
            } else if (key === 2) {
              val1 = obj1[key].length
              val2 = obj2[key].length
            } else if (key === 5) {
              val1 = obj1[key].split('-')[0]
              val2 = obj2[key].split('-')[0]
            } else if (key === 3 || key === 4) {
              for (let i = 0; i < options.length; i++) {
                const ele = options[i]
                if (ele.text === obj1[key]) {
                  val1 = ele.id
                }
                if (ele.text === obj2[key]) {
                  val2 = ele.id
                }
              }
            } else {
              val1 = obj1[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
              val2 = obj2[key].replace(/-/g, '').replace(/:/g, '').replace(' ', '') - 0
            }
          }
          if (column.order === 'ascending') {
            return val1 - val2
          } else {
            return val2 - val1
          }
        })
      }
      this.handleSizeChange(50)
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
        if (item.text.toLowerCase().includes(newVal.toLowerCase()) === true) {
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
        if (item.text.includes(newVal) === true) {
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
        if (response.data.result === 'success') {
          this.projectOptions = response.data.list
          this.projectAllOptions = response.data.list
          // console.log(this.projectOptions)
          if (this.projectOptions.length > 0) {
            this.listQuery.project_id = this.projectOptions[0].id
            if (typeof (this.$route.query.project_id) !== 'undefined' && this.$route.query.project_id !== '') {
              this.listQuery.project_id = this.$route.query.project_id
              this.getversiondict('1', 1)
            } else {
              if (typeof (Vue.cookie.get('projectId')) !== 'undefined' && Vue.cookie.get('projectId') !== null && Vue.cookie.get('projectId') !== 'null' && Vue.cookie.get('projectId') !== '') {
                this.listQuery.project_id = Vue.cookie.get('projectId')
                var boo = true
                this.projectOptions.forEach(ele => {
                  if (ele.id === this.listQuery.project_id) {
                    boo = false
                  }
                })
                if (boo) {
                  this.listQuery.project_id = this.projectOptions[0].id
                }
                this.getversiondict('0', 0)
              } else {
                if (typeof (Vue.cookie.get('projectId')) !== 'undefined' && Vue.cookie.get('projectId') !== null && Vue.cookie.get('projectId') !== 'null' && Vue.cookie.get('projectId') !== '') {
                  this.listQuery.project_id = Vue.cookie.get('projectId')
                  this.getversiondict('0', 0)
                } else {
                  API.user.info().then(({data}) => {
                    if (data && data.code === 0) {
                      if (typeof (data.user.userMark) !== 'undefined' && data.user.userMark !== null && data.user.userMark !== '') {
                        this.listQuery.project_id = data.user.userMark
                      }
                      this.getversiondict('0', 0)
                      var boo = true
                      this.projectOptions.forEach(ele => {
                        if (ele.id === this.listQuery.project_id) {
                          boo = false
                        }
                      })
                      if (boo) {
                        this.listQuery.project_id = this.projectOptions[0].id
                      }
                    }
                  })
                }
              }
            }
          } else {
            // this.$router.push('/concateErr')
            this.noproFlag = true
          }
        }
        // console.log(this.listQuery.project_id)
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
            'userMark': this.listQuery.project_id
          }
          // var tick = API.user.update(params)
          API.user.update(params).then(response => {})
        }
      })
    },
    getversiondict (type, index) {
      // alert(132)
      this.xqidss = []
      this.mouthreqnum = ''
      this.radio = 3
      Vue.cookie.set('projectId', this.listQuery.project_id)
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
      getversiondict(this.listQuery.project_id).then(response => {
        this.versionOptions = response.data
        this.versionOptionsAll = response.data
        // if (typeof (this.$route.query.version_id) !== 'undefined' && this.$route.query.version_id !== '' && this.$route.query.version_id !== 'undefined' && index === 1) {
        //   this.listQuery.version_id = Number(this.$route.query.version_id)
        //   this.getprojectdatav2()
        // } else {
        //   if (typeof (Vue.cookie.get('versionId')) !== 'undefined' && Vue.cookie.get('versionId') !== null && type === '0') {
        //     this.listQuery.version_id = Number(Vue.cookie.get('versionId'))
        //     this.getprojectdatav2()
        //   } else {
        //   }
        // }
        this.listQuery.version_id = ''
        getprojectdatav2(this.listQuery).then(response => {
          var rateData = response.data.data
          if (rateData.length > 0) {
            var arr = []
            var versionarr = []
            var date1 = new Date()
            date1 = this.getTimeByDate(date1)
            var boo = true
            for (let i = 0; i < rateData.length; i++) {
              var ele = rateData[i]
              versionarr.push(ele[2])
              var date = ele[3]
              if (date !== null && date !== '') {
                var cc = {
                  ver: ele[2],
                  date: date.replace(/-/g, '') - 0
                }
                arr.push(cc)
                if (date === date1) {
                  boo = false
                }
              }
            }
            if (boo) {
              var c = {
                ver: '',
                date: date1.replace(/-/g, '') - 0
              }
              arr.push(c)
            }
            arr.sort(function (a, b) {
              if (a.date < b.date) {
                return 1
              } else if (a.date > b.date) {
                return -1
              }
            })
            let ind = 0
            for (let j = 0; j < arr.length; j++) {
              var elee = arr[j]
              if ((date1.replace(/-/g, '') - 0) === elee.date) {
                if (boo) {
                  ind = arr.indexOf(elee) - 1
                } else {
                  ind = arr.indexOf(elee)
                }
              }
            }
            if (ind < 0) {
              ind = 0
              // if (arr.length > 1) {
              //   ind = 1
              // }
            }
            var vername = arr[ind].ver
            for (let k = 0; k < this.versionOptions.length; k++) {
              const ver = this.versionOptions[k]
              if (ver.text === vername) {
                this.listQuery.version_id = ver.id
              }
            }
            this.getprojectdatav2()
          } else {
            this.getprojectdatav2()
          }
        })
      })
      // alert(132)
      // this.getreqnum()
      this.changereqnum()
      this.searchText = ''
      this.searchInfo()
    },
    getprojectdatav2 () {
      this.listQuery.page = 1
      this.listQuery.pageSize = 50
      if (this.listQuery.version_id === 0) {
        this.listQuery.version_id = ''
      }
      Vue.cookie.set('versionId', this.listQuery.version_id)
      this.finishDate = '未知'
      this.xqIds = ''
      this.sxxqIds = ''
      this.xqidss = []
      this.planmess = ''
      this.projectListData = [
        {indtype: '需求任务', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '开发任务', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '测试任务', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: '缺陷', totalNum: 0, unfinishedNum: 0, todayFinish: 0, type: 'up'},
        {indtype: '任务总数', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        {indtype: 'Redmine不规范', totalNum: 0, unfinishedNum: 0, todayFinish: 0, type: ''}
      ]
      this.fbIds = []
      this.xqIds = []
      if (this.listQuery.version_id !== '') {
        getprojectdatav2(this.listQuery).then(response => {
          var rateData = response.data.data
          if (rateData.length > 0) {
            var total = rateData[0][5].split(' ')[4] - 0
            var finish = rateData[0][8].split(' ')[4] - 0
            var total1 = rateData[0][9].split(' ')[4]
            var unfinish = rateData[0][10].split(' ')[4]
            this.getprojectListData(total, finish, total1, unfinish)
            if (rateData[0][3] !== '' && rateData[0][3] !== null) {
              this.finishDate = '未知'
              if (this.listQuery.version_id !== '') {
                this.finishDate = rateData[0][3]
                let d = new Date()
                const YY = d.getFullYear()
                const MM = (d.getMonth() + 1).toString().padStart(2, 0)
                const DD = (d.getDate()).toString().padStart(2, 0)
                const time = `${YY}-${MM}-${DD}`
                let date = new Date(time).getTime()
                let plan = new Date(rateData[0][3]).getTime()
                if (plan < date && finish < total) {
                  this.planmess = '延期'
                }
              }
            }
            for (let i = 0; i < rateData.length; i++) {
              const ele = rateData[i]
              var ids = ele[5].substring(ele[5].lastIndexOf('(') + 1, ele[5].lastIndexOf(')'))
              this.xqIds += ids.split("','")[0].substring(1) + ','
              this.sxxqIds += ele[8].substring(ele[8].lastIndexOf('(') + 1, ele[8].lastIndexOf(')')) + ','
              this.fbIds += ids.split("','")[1].substring(0, ids.split("','")[1].lastIndexOf("'")) + ','
            }
          } else {
            this.getprojectListData(0, 0, 0, 0)
          }
          this.getBugTrendData()
          this.getreqOptions()
        })
      }
      this.versearchText = ''
      this.versearchInfo()
    },
    getprojectListData (reqTotal, reqFinish, total1, unfinish) {
      this.projectlistLoading = true
      this.listLoading = true
      this.projectListData = []
      let kfFinish = 0
      let kfUnFinish = 0
      let csFinish = 0
      let csUnFinish = 0
      if (this.listQuery.version_id === '') {
        this.projectlistLoading = false
        this.listLoading = false
        // for (let i = 0; i < this.versionOptions.length; i++) {
        //   const element = this.versionOptions[i]
        //   const row = {
        //     project_id: this.listQuery.project_id,
        //     version_id: element.id,
        //     complete_flag: '1' // 已完成开发任务
        //   }
        //   this.taskListDatass = []
        //   getkfdata(row).then(response => {
        //     if (response.data.data.length > 0) {
        //       kfFinish = response.data.data.length
        //       const kfFinishdata = {
        //         type: 'kf',
        //         data: response.data.data
        //       }
        //       this.taskListDatass = this.taskListDatass.concat(kfFinishdata)
        //     }
        //   })
        //   getcsdata(row).then(response => {
        //     if (response.data.data.length > 0) {
        //       csFinish = response.data.data.length
        //       const kfFinishdata = {
        //         type: 'cs',
        //         data: response.data.data
        //       }
        //       this.taskListDatass = this.taskListDatass.concat(kfFinishdata)
        //     }
        //   })
        //   const unrow = {
        //     project_id: this.listQuery.project_id,
        //     version_id: this.listQuery.version_id,
        //     complete_flag: '0' // 未完成开发任务
        //   }
        //   getkfdata(unrow).then(response => {
        //     if (response.data.data.length > 0) {
        //       kfUnFinish = response.data.data.length
        //       const csFinishdata = {
        //         type: 'kf',
        //         data: response.data.data
        //       }
        //       this.taskListDatass = this.taskListDatass.concat(csFinishdata)
        //     }
        //   })
        //   getcsdata(unrow).then(response => {
        //     if (response.data.data.length > 0) {
        //       csUnFinish = response.data.data.length
        //       const csFinishdata = {
        //         type: 'cs',
        //         data: response.data.data
        //       }
        //       this.taskListDatass = this.taskListDatass.concat(csFinishdata)
        //     }
        //     this.projectlistLoading = false
        //     this.listLoading = false
        //     this.getTaskDataList()
        //     let reqtotal = kfFinish + kfUnFinish + csFinish + csUnFinish
        //     if (reqtotal === 0) {
        //       this.projectProcess = '未知'
        //     } else {
        //       this.projectProcess = ((kfFinish + csFinish) * 100 / reqtotal).toFixed(2) + '%'
        //     }
        //     // let gzltotal = reqTotal + kfFinish + kfUnFinish + csFinish + csUnFinish
        //     // let gzlUn = reqTotal - reqFinish + kfUnFinish + csUnFinish
        //     this.projectListData = [
        //       {indtype: '需求', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        //       {indtype: '开发', totalNum: kfFinish + kfUnFinish, unfinishedNum: kfUnFinish, todayFinish: 0},
        //       {indtype: '测试', totalNum: csFinish + csUnFinish, unfinishedNum: csUnFinish, todayFinish: 0},
        //       {indtype: '缺陷', totalNum: total1, unfinishedNum: unfinish, todayFinish: 0, type: 'up'},
        //       {indtype: '工作量', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
        //       {indtype: 'Redmine规范', totalNum: 0, unfinishedNum: 0, todayFinish: 0, type: ''}
        //     ]
        //     this.tabClick(0)
        //   })
        // }
      } else {
        const row = {
          project_id: this.listQuery.project_id,
          version_id: this.listQuery.version_id,
          complete_flag: '1' // 已完成开发任务
        }
        this.taskListDatass = []
        getkfdata(row).then(response => {
          if (response.data.data.length > 0) {
            kfFinish = response.data.data.length
            const kfFinishdata = {
              type: 'kf',
              data: response.data.data
            }
            this.taskListDatass = this.taskListDatass.concat(kfFinishdata)
          }
        })
        getcsdata(row).then(response => {
          if (response.data.data.length > 0) {
            csFinish = response.data.data.length
            const kfFinishdata = {
              type: 'cs',
              data: response.data.data
            }
            this.taskListDatass = this.taskListDatass.concat(kfFinishdata)
          }
        })
        const unrow = {
          project_id: this.listQuery.project_id,
          version_id: this.listQuery.version_id,
          complete_flag: '0' // 未完成开发任务
        }
        getkfdata(unrow).then(response => {
          if (response.data.data.length > 0) {
            kfUnFinish = response.data.data.length
            const csFinishdata = {
              type: 'kf',
              data: response.data.data
            }
            this.taskListDatass = this.taskListDatass.concat(csFinishdata)
          }
        })
        getcsdata(unrow).then(response => {
          if (response.data.data.length > 0) {
            csUnFinish = response.data.data.length
            const csFinishdata = {
              type: 'cs',
              data: response.data.data
            }
            this.taskListDatass = this.taskListDatass.concat(csFinishdata)
          }
          this.projectlistLoading = false
          this.listLoading = false
          this.getTaskDataList()
          // let gzltotal = reqTotal + kfFinish + kfUnFinish + csFinish + csUnFinish
          // let gzlUn = reqTotal - reqFinish + kfUnFinish + csUnFinish
          this.projectListData = [
            {indtype: '需求任务', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
            {indtype: '开发任务', totalNum: kfFinish + kfUnFinish, unfinishedNum: kfUnFinish, todayFinish: 0},
            {indtype: '测试任务', totalNum: csFinish + csUnFinish, unfinishedNum: csUnFinish, todayFinish: 0},
            {indtype: '缺陷', totalNum: total1, unfinishedNum: unfinish, todayFinish: 0, type: 'up'},
            {indtype: '任务总数', totalNum: 0, unfinishedNum: 0, todayFinish: 0},
            {indtype: 'Redmine不规范', totalNum: 0, unfinishedNum: 0, todayFinish: 0, type: ''}
          ]
          this.tabClick(0)
        })
      }
      // setTimeout(function () {
      // }, 1000)
    },
    getreqTaskListData (type) {
      getplantime(this.taskIds).then(response => {
        var kfratetotal = 0
        var csratetotal = 0
        var kftotalNum = 0
        var kffinishedNum = 0
        var cstotalNum = 0
        var csfinishedNum = 0
        for (let i = 0; i < this.reqTaskListData.length; i++) {
          const ele = this.reqTaskListData[i]
          var kfrate = 0
          var csrate = 0
          var kfid = ''
          var csid = ''
          var kftotal = 0
          var cstotal = 0
          for (let j = 0; j < this.taskListDatass.length; j++) {
            const element = this.taskListDatass[j]
            for (let k = 0; k < element.data.length; k++) {
              const data = element.data[k]
              var id = data[1].split(' ')[4].replace('#', '')
              var reqid = response.data.data[id].parent_id + ''
              if (ele.reqid === reqid) {
                data[14] = reqid
                if (element.type === 'kf') {
                  kftotal += 1
                  kfid = id
                  if (data[4] === '已关闭') {
                    kfrate += 1
                  }
                }
                if (element.type === 'cs') {
                  cstotal += 1
                  csid = id
                  if (data[4] === '已关闭') {
                    csrate += 1
                  }
                }
              }
            }
          }
          var kftime = '--'
          var cstime = '--'
          for (let value in response.data.data) {
            if (kfid === value) {
              const ele = response.data.data[value]
              kftime = ele.end_date
            } else if (csid === value) {
              const ele = response.data.data[value]
              cstime = ele.end_date
            }
          }
          const date = new Date()
          var time = this.getTimeByDate(date)
          if (kftime === time) {
            kfratetotal += 1
          } else if (cstime === time) {
            csratetotal += 1
          }
          ele.kfTime = kftime
          ele.testTime = cstime
          ele.kfRate = kfrate + '/' + kftotal
          ele.testRate = csrate + '/' + cstotal
          kftotalNum += kftotal
          kffinishedNum += kfrate
          cstotalNum += cstotal
          csfinishedNum += csrate
        }
        this.projectListData[1].todayFinish = kfratetotal
        this.projectListData[2].todayFinish = csratetotal
        this.projectListData[1].totalNum = kftotalNum
        this.projectListData[2].totalNum = cstotalNum
        this.projectListData[1].unfinishedNum = kftotalNum - kffinishedNum
        this.projectListData[2].unfinishedNum = cstotalNum - csfinishedNum
        if (type === 0) {
          this.projectListData[4].totalNum += kftotalNum + cstotalNum
          this.projectListData[4].unfinishedNum += kftotalNum - kffinishedNum + cstotalNum - csfinishedNum
          this.projectListData[4].todayFinish += kfratetotal + csratetotal
        }
        if ((kftotalNum + cstotalNum) === 0) {
          this.projectProcess = '0.00%'
        } else {
          this.projectProcess = ((kffinishedNum + csfinishedNum) * 100 / (kftotalNum + cstotalNum)).toFixed(2) + '%'
        }
        if (this.tabActiveName === 'one') {
          this.total = this.reqListDatas.length
        }
      })
    },
    getReqDataList (type) {
      this.listLoading = true
      this.reqListData = []
      this.reqListDatas = []
      this.reqTaskListData = []
      this.taskIds = []
      let xqfinish = 0
      let reqTodayFinish = 0
      getplantime(this.xqIds).then(response => {
        if (response.data !== null) {
          for (let key in response.data.data) {
            var data = response.data.data[key]
            const dtt = new Date()
            var today = this.getTimeByDate(dtt)
            var date = ''
            if (typeof (data.design_time) !== 'undefined' && data.design_time !== null) {
              date = data.design_time.split(' ')[0]
            }
            if (date === today) {
              reqTodayFinish++
            }
          }
        }
        this.projectListData[0].todayFinish = reqTodayFinish
        if (type === 0) {
          this.projectListData[4].todayFinish += reqTodayFinish
        }
        if (this.tabActiveName === 'one') {
          this.total = this.reqListDatas.length
        }
      })
      getxqdatav2(this.xqIds).then(response => {
        if (response.data.data.length > 0) {
          var reqdatas = response.data.data
          getqualitydatav2(this.listQuery).then(res => {
            var finishreqids = []
            for (let i = 0; i < reqdatas.length; i++) {
              var ele = reqdatas[i]
              var bugnum = '--'
              var noclosednum = '--'
              var casenum = '--'
              if (res.data.data.length > 0) {
                for (let k = 0; k < res.data.data.length; k++) {
                  const element = res.data.data[k]
                  if (element[3] === ele[3]) {
                    bugnum = element[10].split(' ')[4]
                    noclosednum = element[12].split(' ')[4]
                    casenum = element[9].split(' ')[4]
                  }
                }
              }
              ele.push(bugnum)
              ele.push(noclosednum)
              ele.push(casenum)
              this.reqListDatas.push(ele)
              if (i < 50) {
                this.reqListData.push(ele)
              }
              var sxreq = '0'
              if (ele[4] !== '新建') {
                sxreq = '1'
                xqfinish += 1
              }
              var sxRate = '0'
              var reqid = ele[1].split(' ')[4].replace('#', '')
              if (ele[4] === '已关闭') {
                sxRate = '1'
                finishreqids.push(reqid)
              }
              const req = {
                reqname: ele[3],
                reqid: reqid,
                reqTime: ele[8],
                reqRate: sxreq + '/1',
                kfTime: '--',
                kfRate: '--',
                testTime: '--',
                testRate: '--',
                sxTime: '--',
                sxRate: sxRate + '/1'
              }
              this.reqTaskListData.push(req)
              // console.log(this.reqTaskListData)
            }
            getplantime(finishreqids).then(response => {
              if (response.data.data !== null) {
                for (let i = 0; i < this.reqTaskListData.length; i++) {
                  const ele = this.reqTaskListData[i]
                  for (let key in response.data.data) {
                    var data = response.data.data[key]
                    if (ele.reqid === key) {
                      var endd = '--'
                      if (typeof (data.end_date) !== 'undefined' && data.end_date !== null) {
                        endd = data.end_date
                      }
                      ele.sxTime = endd
                      break
                    }
                  }
                }
              }
            })
            this.projectListData[0].totalNum = response.data.data.length
            this.projectListData[0].unfinishedNum = response.data.data.length - xqfinish
            if (type === 0) {
              this.projectListData[4].totalNum += response.data.data.length
              this.projectListData[4].unfinishedNum += response.data.data.length - xqfinish
            }
            for (let j = 0; j < this.taskListDatass.length; j++) {
              const element = this.taskListDatass[j].data
              for (let i = 0; i < element.length; i++) {
                const ele = element[i]
                var t = ele[1]
                var tid = ''
                tid = t.split(' ')[4].replace('#', '')
                this.taskIds.push(tid)
              }
            }
            this.getreqTaskListData(type)
            this.listLoading = false
            if (this.tabActiveName === 'one') {
              this.total = this.reqListDatas.length
            }
          })
        } else {
          this.listLoading = false
          this.projectListData[0].totalNum = 0
          this.projectListData[0].unfinishedNum = 0
          if (this.tabActiveName === 'one') {
            this.total = this.reqListDatas.length
          }
          this.getreqTaskListData(type)
        }
      })
    },
    getreqOptions () {
      getxqdatav2(this.xqIds).then(response => {
        if (response.data.data.length > 0) {
          var xqidss = this.xqIds.split(',')
          this.reqOptions = []
          for (let i = 0; i < response.data.data.length; i++) {
            var ele = response.data.data[i]
            for (let j = 0; j < xqidss.length; j++) {
              var xqid = xqidss[j]
              if (ele[1].indexOf(xqid) > 0) {
                this.reqOptions.push({id: xqid, text: ele[3]})
                this.reqOptionsAll.push({id: xqid, text: ele[3]})
                break
              }
            }
          }
        }
      })
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
      this.total = 0
      this.listLoading = true
      if (this.tabActiveName === 'one') {
        this.reqListData = []
        for (let i = this.pageRow.start; i < this.pageRow.limit; i++) {
          if (i < this.reqListDatas.length) {
            const element = this.reqListDatas[i]
            this.reqListData.push(element)
          }
        }
        this.total = this.reqListDatas.length
      } else if (this.tabActiveName === 'two') {
        this.caseListData = []
        for (let i = this.pageRow.start; i < this.pageRow.limit; i++) {
          if (i < this.caseListDatas.length) {
            const element = this.caseListDatas[i]
            this.caseListData.push(element)
          }
        }
        this.total = this.caseListDatas.length
      } else if (this.tabActiveName === 'three') {
        this.bugListData = []
        for (let i = this.pageRow.start; i < this.pageRow.limit; i++) {
          if (i < this.bugListDatas.length) {
            const element = this.bugListDatas[i]
            this.bugListData.push(element)
          }
        }
        this.total = this.bugListDatas.length
      } else if (this.tabActiveName === 'four') {
        this.taskListData = []
        for (let i = this.pageRow.start; i < this.pageRow.limit; i++) {
          if (i < this.taskListDatas.length) {
            const element = this.taskListDatas[i]
            this.taskListData.push(element)
          }
        }
        this.total = this.taskListDatas.length
      } else if (this.tabActiveName === 'five') {
        this.normListData = []
        for (let i = this.pageRow.start; i < this.pageRow.limit; i++) {
          if (i < this.normListDatas.length) {
            const element = this.normListDatas[i]
            this.normListData.push(element)
          }
        }
        this.total = this.normListDatas.length
      } else if (this.tabActiveName === 'six') {
        this.productListData = []
        for (let i = this.pageRow.start; i < this.pageRow.limit; i++) {
          if (i < this.productListDatas.length) {
            const element = this.productListDatas[i]
            this.productListData.push(element)
          }
        }
        this.total = this.productListDatas.length
      }
      this.listLoading = false
    },
    tabClick (type) {
      this.total = 0
      if (this.tabActiveName === 'one' || type === 0) {
        this.getReqDataList(type)
        this.getCaseDataList(type)
        this.getNormDataList()
      }
      if (this.tabActiveName === 'two' && type === 1) {
        this.getCaseDataList(type)
      }
      if (this.tabActiveName === 'three' && type === 1) {
        this.getCaseDataList(type)
      }
      if (this.tabActiveName === 'four') {
        this.getTaskDataList()
      }
      if (this.tabActiveName === 'five' && type === 1) {
        this.getNormDataList()
      }
      if (this.tabActiveName === 'six') {
        this.getproductDataList()
      }
    },
    getproductDataList () { // 获取产线页数据
      this.listLoading = true
      this.productListData = []
      const query = {
        project_id: this.listQuery.project_id,
        static_month: ''
      }
      getfeedbackstaticlistv2(query).then(response => {
        // 获取产线问题分布图数据
        var newBug = [] // 新增问题
        var repairRate = [] // 修复率
        var finishBug = [] // 本月修复，取【已解决】字段
        var xAxisData = []
        var waitsolv = []
        if (response.data.data.length > 0) {
          for (let i = response.data.data.length - 1; i >= 0; i--) {
            if (i < 12) {
              const ele = response.data.data[i]
              xAxisData.push(ele[2])
              newBug.push(ele[3].split(' ')[4])  // 本月新增
              repairRate.push(ele[7].replace('%', ''))  // 修复率
              finishBug.push(ele[4].split(' ')[4])      // 本月修复(已解决)
              waitsolv.push(ele[6].split(' ')[4])       // 待解决
              if (i === 0) {
                this.queryMonth = ele[2].replace('年', '-').replace('月', '-') + '01'
                this.getfeedbackdatalistv2()
              }
            }
          }
        }
        this.listLoading = false
        const row = {
          xAxisData: xAxisData,
          newBug: newBug,
          repairRate: repairRate,
          finishBug: finishBug,
          waitsolv: waitsolv
        }
        this.drawLineBar('productSpread', row)
      })
    },
    getfeedbackdatalistv2 () {
      const proquery = {
        project_id: this.listQuery.project_id,
        static_month: this.queryMonth,
        feedback_type: '1'
      }
      this.productListDatas = []
      this.productListData = []
      getfeedbackdatalistv2(proquery).then(response => {
        this.productListDatas = response.data.data
        if (this.tabActiveName === 'six') {
          this.total = response.data.data.length
        }
        if (response.data.data.length > 0) {
          for (let i = 0; i < this.productListDatas.length; i++) {
            const ele = this.productListDatas[i]
            if (i < 50) {
              this.productListData.push(ele)
            }
          }
        }
      })
    },
    getNormDataList () { // 获取规范页数据
      this.normListData = []
      this.listLoading = true
      const proquery = {
        project_id: this.listQuery.project_id,
        tracker_id: '',
        status_id: '',
        user_id: ''
      }
      getchecklist(proquery).then(response => {
        if (this.tabActiveName === 'five') {
          this.total = response.data.data.length
        }
        this.normListDatas = response.data.data
        if (response.data.data.length > 0) {
          for (let i = 0; i < this.normListDatas.length; i++) {
            const ele = this.normListDatas[i]
            if (i < 50) {
              this.normListData.push(ele)
            }
          }
        }
        this.listLoading = false
        const startdate = new Date()
        const enddate = new Date()
        startdate.setTime(startdate.getTime() - 3600 * 1000 * 24 * 7)
        var end = this.getTimeByDate(enddate)
        var start = this.getTimeByDate(startdate)
        const row = {
          project_id: this.listQuery.project_id,
          start_date: start,
          end_date: end
        }
        var xAxisData = []
        var count = []
        getillegalnumlist(row).then(response => {
          if (response.data.data !== null) {
            for (let i = 6; i > 0; i--) {
              const startdate = new Date()
              startdate.setTime(startdate.getTime() - 3600 * 1000 * 24 * i)
              var date = this.getTimeByDate(startdate)
              let cont = 0
              xAxisData.push(date)
              for (let val in response.data.data) {
                for (let value in response.data.data[val]) {
                  if (date === value) {
                    cont = response.data.data[val][value]
                  }
                }
              }
              count.push(cont)
            }
          }
          xAxisData.push(end)
          let cont = 0
          if (this.normListDatas.length > 0) {
            cont = this.normListDatas.length
          }
          count.push(cont)
          const row = {
            xAxisData: xAxisData,
            seriesData: count
          }
          this.drawStacked('normdraw', row)
          let c1 = count[5] - 0
          let c2 = count[6] - 0
          let finish = c1 - c2
          this.projectListData[5].totalNum = c1
          this.projectListData[5].unfinishedNum = c2
          this.projectListData[5].todayFinish = finish
          var type = ''
          if (finish > 0) {
            type = 'down'
          } else if (finish < 0) {
            type = 'up'
          }
          this.projectListData[5].type = type
          if (this.tabActiveName === 'one') {
            this.total = this.reqListDatas.length
          }
        })
      })
    },
    getTaskDataList () { // 获取任务页数据
      var xqid = []
      if (this.xqidss.length > 0) {
        for (let i = 0; i < this.xqidss.length; i++) {
          xqid.push(this.xqidss[i])
        }
      }
      // 获取任务统计图表数据
      var task = []
      var done = []
      var taskNum = []
      var doneNum = []
      var xAxisData = []
      this.taskListDatas = []
      this.taskListData = []
      var taskIds = []
      var yAxisData = []
      var nameAxisData = []
      var sortData = []
      for (let i = 0; i < this.taskListDatass.length; i++) {
        const ele = this.taskListDatass[i]
        for (let j = 0; j < ele.data.length; j++) {
          var element = ele.data[j]
          sortData.push(element)
          if (ele.type === 'kf') {
            element[13] = 'kf'
          } else if (ele.type === 'cs') {
            element[13] = 'cs'
          }
        }
      }
      sortData.sort(function compareFunction (param1, param2) {
        var ord = param2[5].localeCompare(param1[5], 'zh-Hans-CN', {sensitivity: 'accent'})
        return ord
      })
      for (let i = 0; i < sortData.length; i++) {
        const element = sortData[i]
        if (this.xqidss.length > 0 && this.xqidss.length < this.reqOptions.length) {
          for (let k = 0; k < xqid.length; k++) {
            const req = xqid[k]
            if (req.id === element[14]) {
              var tid = element[1].split(' ')[4].replace('#', '')
              taskIds.push(tid)
              yAxisData.push(element[5])
              nameAxisData.push(element[3])
              this.taskListDatas.push(element)
              if (this.taskListData.length < 50) {
                this.taskListData.push(element)
              }
              task.push(element[5])
              if (element[4] === '已关闭') {
                done.push(element[5])
              }
            }
          }
        } else {
          var tid1 = element[1].split(' ')[4].replace('#', '')
          taskIds.push(tid1)
          yAxisData.push(element[5])
          nameAxisData.push(element[3])
          this.taskListDatas.push(element)
          if (this.taskListData.length < 50) {
            this.taskListData.push(element)
          }
          task.push(element[5])
          if (element[4] === '已关闭') {
            done.push(element[5])
          }
        }
      }
      if (this.tabActiveName === 'four') {
        this.total = this.taskListDatas.length
        this.taskListDatas.sort(function compareFunction (param1, param2) {
          var ord = param1[5].localeCompare(param2[5], 'zh-Hans-CN', {sensitivity: 'accent'})
          return ord
        })
        this.taskListData.sort(function compareFunction (param1, param2) {
          var ord = param1[5].localeCompare(param2[5], 'zh-Hans-CN', {sensitivity: 'accent'})
          return ord
        })
      }
      xAxisData = this.arrayCnt(task, 'name')
      done = this.arrayCnt(done, 'num')
      task = this.arrayCnt(task, 'num')
      for (let j = 0; j < xAxisData.length; j++) {
        var xle = xAxisData[j]
        let dNum = 0
        for (let i = 0; i < done.length; i++) {
          const ele = done[i]
          if (xle === ele.name) {
            dNum = ele.num - 0
          }
        }
        doneNum.push(dNum)
        let fnum = 0
        for (let k = 0; k < task.length; k++) {
          const ele = task[k]
          if (xle === ele.name) {
            fnum = ele.num - 0
          }
        }
        taskNum.push(fnum)
      }
      // 获取任务分布图数据
      var taskDate = []
      var taskseriesData = []
      getplantime(taskIds).then(response => {
        if (taskIds.length > 0) {
          for (let i = 0; i < taskIds.length; i++) {
            var id = taskIds[i]
            for (let value in response.data.data) {
              if (id === value) {
                const ele = response.data.data[value]
                taskDate.push(ele.start_date)
                var enddate = ele.end_date
                var startdate = ele.start_date
                var endtime = ''
                if (enddate !== null) {
                  enddate = ele.end_date.split(' ')[0]
                  endtime = ele.end_date.split(' ')[1]
                } else {
                  const dtt = new Date()
                  enddate = this.getTimeByDate(dtt)
                  endtime = '23:59:59'
                }
                if (enddate === startdate) {
                  enddate = enddate + ' ' + endtime
                  startdate = startdate + ' 00:00:00'
                }
                taskDate.push(enddate)
                // var diff = Math.abs(enddate - startdate)
                // var result = parseInt(diff / (1000 * 60 * 60 * 24))
                var strSeparator = '-'
                var oDate1
                var oDate2
                oDate1 = startdate.split(strSeparator)
                oDate2 = enddate.split(strSeparator)
                var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2])
                var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2])
                var iDays = parseInt(Math.abs(strDateE - strDateS) / 1000 / 60 / 60 / 24)
                if (isNaN(iDays)) {
                  iDays = 1
                }
                taskseriesData.push(
                  {name: yAxisData[i] + '-' + nameAxisData[i], value: [i, startdate, enddate], itemStyle: {normal: { color: '#4B78CD' }}, datenum: iDays}
                )
              }
            }
          }
          const taskSpread = {
            xAxisData: taskDate,
            yAxisData: yAxisData,
            seriesData: taskseriesData,
            nameAxisData: nameAxisData
          }
          this.drawByStation('taskSpread', taskSpread)
        } else {
          const taskSpread1 = {
            xAxisData: [''],
            yAxisData: [''],
            seriesData: [{name: '', value: [0, '', ''], itemStyle: { normal: { color: '#4B78CD' } }}],
            nameAxisData: ['']
          }
          this.drawByStation('taskSpread', taskSpread1)
        }
      })
      var testseriesData = [
        {name: '任务总数', type: 'bar', barMaxWidth: 40, itemStyle: { normal: { color: '#4B78CD' } }, label: { normal: { show: true } }, data: taskNum},
        {name: '已完成', type: 'bar', barMaxWidth: 40, itemStyle: { normal: { color: '#4ecb73' } }, label: { normal: { show: true } }, data: doneNum}
      ]
      const row = {
        xAxisData: xAxisData,
        seriesData: testseriesData
      }
      this.drawVBarTwo('taskTotal', row)
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    getBugDataList (kfnum, kfbugnum) {
      // 获取问题列表数据
      this.bugListData = []
      // 获取测试问题分布数据
      var jujued = []
      var closed = []
      var notclosed = []
      // 获取解决问题分布数据
      var notfixed = []
      var fixed = []
      var delayd = []
      this.listLoading = true
      this.bugListDatas = []
      var bugIds = []
      let bugTodayFinish = 0
      var yanqinum = []
      getbugdatav2(this.bugIds).then(response => {
        var closedNumd = []
        var notclosedNumd = []
        var jujuedNumd = []
        var xAxisDataNumd = []
        var testseriesData = []
        if (response.data.data.length > 0) {
          this.bugListDatas = response.data.data
          // 获取测试问题分布数据
          var jujueNum = []
          var closedNum = []
          var notclosedNum = []
          var xAxisDataNum = []
          let unfinbug = 0
          for (let i = 0; i < response.data.data.length; i++) {
            const ele = response.data.data[i]
            if (i < 50) {
              this.bugListData.push(ele)
            }
            xAxisDataNum.push(ele[7])
            if (ele[3] === '已关闭') {
              closedNum.push(ele[7])
              var id = ele[1].split(' ')[4].replace('#', '')
              bugIds.push(id)
            } else {
              unfinbug++
              if (ele[3] === '拒绝修复' || ele[3] === '已拒绝') {
                jujueNum.push(ele[7])
              } else {
                if (typeof (ele[3]) !== 'undefined' && ele[3] === '延期') {
                  yanqinum.push(ele[6])
                }
                notclosedNum.push(ele[7])
              }
            }
          }
          this.projectListData[3].totalNum = response.data.data.length
          this.projectListData[3].unfinishedNum = unfinbug
          getplantime(this.bugIds).then(response => {
            if (response.data !== null) {
              for (let key in response.data.data) {
                var data = response.data.data[key]
                const dtt = new Date()
                var today = this.getTimeByDate(dtt)
                var date = ''
                if (typeof (data.end_date) !== 'undefined' && data.end_date !== null) {
                  date = data.end_date.split(' ')[0]
                }
                if (date === today) {
                  bugTodayFinish++
                }
              }
            }
            this.projectListData[3].todayFinish = bugTodayFinish
            if (this.tabActiveName === 'one') {
              this.total = this.reqListDatas.length
            }
          })
          jujueNum = this.arrayCnt(jujueNum, 'num')
          closedNum = this.arrayCnt(closedNum, 'num')
          notclosedNum = this.arrayCnt(notclosedNum, 'num')
          xAxisDataNum = this.arrayCnt(xAxisDataNum, 'name')
          for (let j = 0; j < xAxisDataNum.length; j++) {
            var xle = xAxisDataNum[j]
            let exnum = 0
            for (let k = 0; k < closedNum.length; k++) {
              const ele = closedNum[k]
              if (xle === ele.name) {
                exnum = ele.num - 0
              }
            }
            closed.push(exnum)
            let noclose = 0
            for (let k = 0; k < notclosedNum.length; k++) {
              const ele = notclosedNum[k]
              if (xle === ele.name) {
                noclose = ele.num - 0
              }
            }
            notclosed.push(noclose)
            let jujuenum = 0
            for (let k = 0; k < jujueNum.length; k++) {
              const ele = jujueNum[k]
              if (xle === ele.name) {
                jujuenum = ele.num - 0
              }
            }
            jujued.push(jujuenum)
          }
          var data = []
          for (let i = 0; i < closed.length; i++) {
            const ele = closed[i] - 0
            const nele = notclosed[i] - 0
            const row = {
              name: xAxisDataNum[i],
              date: ele + nele,
              closed: ele,
              notclosed: nele,
              jujued: jujued[i]
            }
            data.push(row)
          }
          data.sort(function (a, b) {
            if (a.date < b.date) {
              return 1
            } else if (a.date > b.date) {
              return -1
            }
          })
          for (let i = 0; i < data.length; i++) {
            const ele = data[i]
            closedNumd.push(ele.closed)
            notclosedNumd.push(ele.notclosed)
            jujuedNumd.push(ele.jujued)
            xAxisDataNumd.push(ele.name)
          }
          testseriesData = [
            {name: '已关闭', type: 'bar', stack: '总量', barMaxWidth: 20, itemStyle: { normal: { color: '#31bd73' } }, label: { normal: { show: true } }, data: closedNumd},
            {name: '未关闭', type: 'bar', stack: '总量', barMaxWidth: 20, itemStyle: { normal: { color: '#dcca22' } }, label: { normal: { show: true } }, data: notclosedNumd},
            {name: '已拒绝', type: 'bar', stack: 'sum', barMaxWidth: 20, itemStyle: { normal: { color: '#4B78CD' } }, label: { normal: { show: true } }, data: jujuedNumd}
          ]
        } else {
          testseriesData = [
            {name: '已关闭', type: 'bar', stack: '总量', barMaxWidth: 20, itemStyle: { normal: { color: '#31bd73' } }, label: { normal: { show: true } }, data: ['']},
            {name: '未关闭', type: 'bar', stack: '总量', barMaxWidth: 20, itemStyle: { normal: { color: '#dcca22' } }, label: { normal: { show: true } }, data: ['']},
            {name: '已拒绝', type: 'bar', stack: 'sum', barMaxWidth: 20, itemStyle: { normal: { color: '#4B78CD' } }, label: { normal: { show: true } }, data: ['']}
          ]
        }
        const row = {
          xAxisData: xAxisDataNumd,
          seriesData: testseriesData
        }
        this.drawVBarTwoDuidie('testBug', row)
        if (this.tabActiveName === 'three') {
          this.total = this.bugListDatas.length
        }
        this.listLoading = false
        getbugdatav2(kfbugnum).then(response => {
          // 获取解决问题分布数据
          var notfixedNum = []
          var fixedNum = []
          var delayNum = yanqinum
          var yAxisDataNum = yanqinum
          for (let i = 0; i < response.data.data.length; i++) {
            const ele = response.data.data[i]
            yAxisDataNum.push(ele[6])
            if (ele[3] === '已关闭') {
              fixedNum.push(ele[6])
            } else {
              if (ele[3] !== '延期') {
                notfixedNum.push(ele[6])
              } else {
                delayNum.push(ele[6])
              }
            }
          }
          notfixedNum = this.arrayCnt(notfixedNum, 'num')
          fixedNum = this.arrayCnt(fixedNum, 'num')
          delayNum = this.arrayCnt(delayNum, 'num')
          yAxisDataNum = this.arrayCnt(yAxisDataNum, 'name')
          var kfn = kfnum.split(')')
          kfn.splice(kfn.length - 1, 1)
          for (let j = 0; j < yAxisDataNum.length; j++) {
            var yle = yAxisDataNum[j]
            let dNum = 0
            for (let i = 0; i < delayNum.length; i++) {
              const ele = delayNum[i]
              if (yle === ele.name) {
                dNum = ele.num - 0
              }
            }
            delayd.push(dNum)
            let fnum = 0
            for (let k = 0; k < fixedNum.length; k++) {
              const ele = fixedNum[k]
              if (yle === ele.name) {
                fnum = ele.num - 0
              }
            }
            for (let l = 0; l < kfn.length; l++) {
              var e = kfn[l].split('(')
              if (e[0] === yle) {
                fnum += (e[1] - 0)
                kfn.splice(l, 1)
                l = l - 1
              }
            }
            fixed.push(fnum)
            let nofclose = 0
            for (let k = 0; k < notfixedNum.length; k++) {
              const ele = notfixedNum[k]
              if (yle === ele.name) {
                nofclose = ele.num - 0
              }
            }
            notfixed.push(nofclose)
          }
          for (let i = 0; i < kfn.length; i++) {
            var ele = kfn[i].split('(')
            if (ele.length > 0 && ele[0] !== null) {
              let index = yAxisDataNum.indexOf(ele[0])
              if (index >= 0) {
                let ei = ele[1] - 0
                let fi = fixed[index] - 0
                fixed[index] = fi + ei
              } else {
                yAxisDataNum.push(ele[0])
                fixed.push(ele[1])
                notfixed.push(0)
                delayd.push(0)
              }
            }
          }
          var data = []
          for (let i = 0; i < fixed.length; i++) {
            const ele = fixed[i] - 0
            const nele = notfixed[i] - 0
            const row = {
              name: yAxisDataNum[i],
              date: ele + nele,
              fixed: ele,
              notfixed: nele,
              delayd: delayd[i]
            }
            data.push(row)
          }
          data.sort(function (a, b) {
            if (a.date < b.date) {
              return 1
            } else if (a.date > b.date) {
              return -1
            }
          })
          var notfixedNumd = []
          var fixedNumd = []
          var delayNumd = []
          var yAxisDataNumd = []
          for (let i = 0; i < data.length; i++) {
            const ele = data[i]
            notfixedNumd.push(ele.notfixed)
            yAxisDataNumd.push(ele.name)
            fixedNumd.push(ele.fixed)
            delayNumd.push(ele.delayd)
          }
          var finishseriesData = [
            { name: '已解决', type: 'bar', stack: 'sum', barMaxWidth: 20, itemStyle: { normal: { color: '#31bd73' } }, label: { normal: { show: true } }, data: fixedNumd },
            { name: '未解决', type: 'bar', stack: 'sum', barMaxWidth: 20, itemStyle: { normal: { color: '#4B78CD' } }, label: { normal: { show: true } }, data: notfixedNumd },
            { name: '延期', type: 'bar', stack: '总量', barMaxWidth: 20, itemStyle: { normal: { color: '#dcca22' } }, label: { normal: { show: true } }, data: delayNumd }
          ]
          // { name:'料费', type: 'bar', stack: 'sum', itemStyle: { normal:{ label: { show: true }, color:'#F89733' } }, data:data1 }
          const finishrow = {
            xAxisData: yAxisDataNumd,
            legendData: ['notfixed', 'fixed', 'reopen'],
            seriesData: finishseriesData
          }
          this.drawVBarTwoDuidie('finishBug', finishrow)
        })
      })
    },
    getCaseDataList (type) {
      this.caseListData = []
      var createdNum = []
      var executedNum = []
      var xAxisData = []
      this.caseExecution = 0
      this.caseRate = 0
      this.listLoading = true
      this.bugIds = ''
      getqualitydatav2(this.listQuery).then(response => {
        var caseData = response.data.data
        let caseTotal = 0
        var caseIds = ''
        var bugIds = ''
        var cids = ''
        var bids = ''
        var kfnum = ''
        var kfbugnum = ''
        var seriesData = []
        if (caseData.length > 0) {
          for (let i = 0; i < caseData.length; i++) {
            const element = caseData[i]
            if (this.xqidss.length > 0) {
              for (let j = 0; j < this.xqidss.length; j++) {
                var xqname = this.xqidss[j].text
                if (xqname === element[3]) {
                  caseTotal += element[9].split(' ')[4] - 0
                  cids = element[9].substring(element[9].lastIndexOf('(') + 1, element[9].lastIndexOf(')')).replace(/'/g, '')
                  caseIds += cids + ','
                  bids = element[10].substring(element[10].lastIndexOf('(') + 1, element[10].lastIndexOf(')')).replace(/'/g, '')
                  bugIds += bids + ','
                  kfbugnum += element[11].substring(element[11].lastIndexOf('(') + 1, element[11].lastIndexOf(')')).replace(/'/g, '') + ','
                  if (element[7] !== null) {
                    kfnum += element[7]
                  }
                }
              }
            } else {
              caseTotal += element[9].split(' ')[4] - 0
              cids = element[9].substring(element[9].lastIndexOf('(') + 1, element[9].lastIndexOf(')')).replace(/'/g, '')
              caseIds += cids + ','
              bids = element[10].substring(element[10].lastIndexOf('(') + 1, element[10].lastIndexOf(')')).replace(/'/g, '')
              bugIds += bids + ','
              kfbugnum += element[11].substring(element[11].lastIndexOf('(') + 1, element[11].lastIndexOf(')')).replace(/'/g, '') + ','
              if (element[7] !== null) {
                kfnum += element[7]
              }
            }
          }
          this.bugIds = bugIds.substring(0, bugIds.length - 1)
          caseIds = caseIds.substring(0, caseIds.length - 1)
          getcasedatav2(caseIds).then(response => {
            if (this.tabActiveName === 'two') {
              this.total = response.data.data.length
            }
            if (response.data.data.length > 0) {
              this.caseListDatas = response.data.data
              let execTotal = 0
              let passTotal = 0
              var cNum = []
              var eNum = []
              for (let i = 0; i < response.data.data.length; i++) {
                const element = response.data.data[i]
                cNum.push(element[8])
                eNum.push(element[7])
                xAxisData.push(element[7])
                xAxisData.push(element[8])
                if (i < 50 && this.tabActiveName === 'two') {
                  this.caseListData.push(element)
                }
                if (element[4] !== '' && element[4] !== null) {
                  execTotal++
                }
                if (element[4] === '通过') {
                  passTotal++
                }
              }
              xAxisData = this.arrayCnt(xAxisData, 'name')
              const cd = this.arrayCnt(cNum, 'num')
              const ed = this.arrayCnt(eNum, 'num')
              for (let j = 0; j < xAxisData.length; j++) {
                var xle = xAxisData[j]
                let cnum = 0
                for (let i = 0; i < cd.length; i++) {
                  const ele = cd[i]
                  if (xle === ele.name) {
                    cnum = ele.num - 0
                  }
                }
                createdNum.push(cnum)
                let exnum = 0
                for (let k = 0; k < ed.length; k++) {
                  const ele = ed[k]
                  if (xle === ele.name) {
                    exnum = ele.num - 0
                  }
                }
                executedNum.push(exnum)
              }
              this.caseExecution = (execTotal * 100 / caseTotal).toFixed(2) - 0
              this.caseRate = (passTotal * 100 / caseTotal).toFixed(2) - 0
              seriesData = [
                {name: '创建', type: 'bar', barGap: 0, barMaxWidth: 20, label: { normal: { show: true } }, data: createdNum},
                {name: '执行', type: 'bar', barGap: 0, barMaxWidth: 20, label: { normal: { show: true } }, data: executedNum}
              ]
            } else {
              seriesData = [
                {name: '创建', type: 'bar', barGap: 0, barMaxWidth: 20, label: { normal: { show: true } }, data: ['']},
                {name: '执行', type: 'bar', barGap: 0, barMaxWidth: 20, label: { normal: { show: true } }, data: ['']}
              ]
            }
            this.listLoading = false
            const row = {
              xAxisData: xAxisData,
              seriesData: seriesData
            }
            this.drawVBarTwo('caseSpread', row)
          })
        } else {
          this.listLoading = false
          seriesData = [
            {name: '创建', type: 'bar', barGap: 0, barMaxWidth: 20, label: { normal: { show: true } }, data: ['']},
            {name: '执行', type: 'bar', barGap: 0, barMaxWidth: 20, label: { normal: { show: true } }, data: ['']}
          ]
          const row = {
            xAxisData: xAxisData,
            seriesData: seriesData
          }
          this.drawVBarTwo('caseSpread', row)
        }
        if (this.tabActiveName === 'three' || this.tabActiveName === 'one' || type === 0) {
          this.getBugDataList(kfnum, kfbugnum)
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
    reqChange () {
      var xqid = []
      if (this.xqidss.length > 0) {
        for (let i = 0; i < this.xqidss.length; i++) {
          xqid.push(this.xqidss[i].id)
        }
      } else {
        for (let i = 0; i < this.reqOptions.length; i++) {
          xqid.push(this.reqOptions[i].id)
        }
      }
      this.xqIds = xqid.join(',')
      this.getBugTrendData()
      this.tabClick(0)
    },
    getBugTrendData () {
      const row = {
        xq_ids: this.xqIds,
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
      })
      // this.$nextTick(function () {
      // })
    },
    drawByStation (id, graphData) {
      console.log(graphData)
      var yAxisData = graphData.yAxisData
      var seriesData = graphData.seriesData
      // console.log(graphData)
      // console.log(seriesData)
      // document.getElementById(id).style.height = (seriesData.length * 25) + 'px'
      // debugger
      if (graphData.seriesData.length < 8) {
        document.getElementById(id).style.height = 240 + 'px'
      } else if (graphData.seriesData.length < 20) {
        document.getElementById(id).style.height = (seriesData.length * 25) + 'px'
      } else {
        document.getElementById(id).style.height = (seriesData.length * 20) + 'px'
      }
      // document.getElementById(id).style.width = this.$refs.taskscroll.clientHeight + 'px'
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: { // 提示框
          formatter: function (params) {
            return params.name + '<br/>' + params.marker + '时间' + '：' + params.value[1] + '至' + params.value[2]
          }, // 数据的值
          // 修改提示框显示的位置
          position: function (point, params, dom, rect, size) {
        // 其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
            var x = point[0]//
            var y = point[1]
            // var viewWidth = size.viewSize[0]
            // var viewHeight = size.viewSize[1]
            var boxWidth = size.contentSize[0]
            var boxHeight = size.contentSize[1]
            var posX = 0 // x坐标位置
            var posY = 0 // y坐标位置
            if (x < boxWidth) { // 左边放不开
              posX = 5
            } else { // 左边放的下
              posX = x - boxWidth
            }
            if (y < boxHeight) { // 上边放不开
              posY = 5
            } else { // 上边放得下
              posY = y - boxHeight
            }
            return [posX, posY]
          }
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
          // interval: 3600 * 24 * 1000 * 30
          // axisLabel: {
          //   formatter: function (value) {
          //     var date = new Date(value)
          //     return getzf(date.getHours()) + ':' + getzf(date.getMinutes()) + '\n' + date.getDate() + '/' + (date.getMonth() + 1) + ''
          //     function getzf (num) {
          //       if (parseInt(num) < 10) {
          //         num = '0' + num
          //       }
          //       return num
          //     }
          //   }
          // }
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
      myChart.resize()
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
            }
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
            data: graphData.xAxisData
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
  /* margin-top: 44px; */
}
.projectProcess{
  margin-left: 25%;
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
  margin-top: 10px;
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
  left: 0;
  top: 0;
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
.el-select-dropdown__wrap,.el-scrollbar__wrap{
  margin-bottom: 0px !important;
  margin-right: 0px !important;
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
</style>
<style>
.el-table{
  z-index: 0 !important;
}
#building-top .el-table__header-wrapper {
  height: 72px !important;
}
</style>

<style lang="scss">
  #building-top .el-table__header-wrapper {
    height: 72px !important;
  }
  .proline .el-tabs--top.el-tabs--border-card .el-tabs__item:nth-child(2){
    padding: 0 !important;
  }
  .proline .el-tabs--top.el-tabs--border-card .el-tabs__item:last-child{
    padding: 0 !important;
  }
  .planEcharts .el-dialog__wrapper{
    z-index: 20001 !important;
  }
</style>

