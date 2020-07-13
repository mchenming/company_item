<template>
    <div class="needport">
        <div style="min-height:50px;padding-left:15px;display:flex;align-items:center;">
            <div style="width:50%">
                <div class="item">
                    <span style="margin-right:40px;">项目</span>
                    <el-select v-model="listQuery.project_ids" placeholder="全部" multiple style="width:80%;" @change="changeitem" popper-class='onmouthFix'>
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
            </div>
            <div style="flex:1" v-show="!(checkList.length === 1 && checkList[0]==='2')">
              <div style="display:flex;align-items:center;width:95%" ref="parentTree">
                <span style="display:inline-block;width:100px;text-align:center;">需求受理部门</span>
                <el-select v-model="Checkvalue" placeholder="请选择" popper-class="oaaddsty" style="flex:1" multiple @remove-tag='removeCheck'>
                  <!-- <el-input></el-input> -->
                  <el-option value="">
                    <el-tree
                      :data="treedata"
                      show-checkbox
                      :default-expanded-keys='defaultArr'
                      node-key="org_id"
                      ref="tree"
                      @check="handleCheckChange"
                      :props="defaultProps">
                    </el-tree>
                  </el-option>
                </el-select>
              </div>
            </div>
        </div>

        <el-row>
            <el-col :span="9" style="margin-left:15px;height:50px;line-height:50px;margin-bottom:10px;">
                <div class="mouth" style="display:flex;width:100%">
                    <span style="margin-right:15px;">发起时间</span>
                    <el-date-picker
                      v-model="changeTime"
                      type="daterange"
                      align="right"
                      value-format="yyyy-MM-dd"
                      :clearable="false"
                      :unlink-panels="true"
                      :picker-options="pickerOptions"
                      @change="timeChangepro" ref="timeSelect" style="margin-top:5px;">
                    </el-date-picker>
                </div>
            </el-col>
            <el-col :span="8" style="line-height:50px;margin-left:15px;" class="quickchangeTime">
              <el-radio-group v-model="radio" @change="quickTime" style="background-color:#fff">
                <el-radio :label='1'>近一月</el-radio>
                <el-radio :label='3'>近三月</el-radio>
                <el-radio :label='6'>近半年</el-radio>
                <el-radio :label='0'>全部</el-radio>
              </el-radio-group>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24" style="over-flow:hidden;margin-bottom:15px;padding:0 15px;display:flex">
              <!-- 筛选条件oa   2 -->
              <el-col :span="2" style="margin-right:35px;" class="tipSty">
                <el-checkbox-group v-model="checkList" fill='red' @change="changeboxgroup">
                  <el-checkbox label="oa">业务需求<span style="display:inline-block;width:25px;font-size:12px;">({{reqnum.oa_num}})</span></el-checkbox>
                  <el-checkbox label="2">系统优化<span style="display:inline-block;width:25px;font-size:12px;">({{reqnum.need_num}})</span></el-checkbox>
                </el-checkbox-group>
              </el-col>
                <div class="titbox" style="background-color:#4b78cd;cursor:pointer;" @click="goisyqPage('')">
                    <div>
                        <span style="color:#fff;font-size:13px;">需求总数</span>
                        <el-tooltip class="item" effect="dark" content="需求数量统计" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center" v-if="checkList.length===1 && checkList[0]==='oa'">{{reqnum.oa_num}}</div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center" v-if="checkList.length===1 && checkList[0]==='2'">{{reqnum.need_num}}</div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center" v-else>{{reqnum.all_num}}</div>
                </div>
                
                <div class="titbox" style="background-color:#4b78cd;cursor:pointer;" @click="goisyqPage('OA流程结束')">
                    <div>
                        <span style="color:#fff;font-size:13px;">OA流程结束</span>
                        <el-tooltip class="item" effect="dark" content="已关闭业务需求数" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.realNum}}</div>
                </div>

                <div class="titbox" style="background-color:#c9f;cursor:pointer;" @click="goisyqPage('上线完成')">
                    <div>
                        <span style="color:#fff;font-size:13px;">上线完成</span>
                        <el-tooltip class="item" effect="dark" content="已上线的需求数量" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.closeNum}}</div>
                </div>

                <div class="titbox" style="background-color:rgba(255, 153, 0, 1);cursor:pointer;" @click="goisyqPage('', '', 'planTime')">
                    <div>
                        <span style="color:#fff;font-size:13px;">即将超时提醒</span>
                        <el-tooltip class="item" effect="dark" content="计划验收日期在一周内的需求梳理" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.expireDueDateSum}}</div>
                </div>

                <div class="titbox" style="background-color:#f56c6c;cursor:pointer" @click="goisyqPage('yq')">
                    <div>
                        <span style="color:#fff;font-size:13px;">延期需求</span>
                        <el-tooltip placement="bottom">
                          <div slot="content">超过预计上线日期<br>仍未上线的需求总数</div>
                          <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.yqNum}}</div>
                </div>

                <div class="titbox" style="background-color:rgba(100, 168, 232, 0.8);cursor:pointer;" @click="goisyqPage('cswwc', '')">
                    <div>
                        <span style="color:#fff;font-size:13px;">90天未关闭需求</span>
                        <el-tooltip class="item" effect="dark" content="创建超过90天仍未关闭的需求数量" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.cswwcNum}}</div>
                </div>

                <!-- <div class="titbox" style="background-color:rgba(139, 204, 240, 1);cursor:pointer;" @click="goisyqPage('stop')">
                    <div>
                        <span style="color:#fff;font-size:13px;">暂停需求</span>
                        <el-tooltip class="item" effect="dark" content="状态为“暂停”的需求数量" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.stopNum}}</div>
                </div> -->

                <div class="titbox" style="background-color:#5e5e5e;cursor:pointer;" @click="goisyqPage('')">
                    <div style="width:100%">
                        <span style="color:#fff;font-size:13px;">需求平均完成时间</span>
                        <el-tooltip placement="bottom">
                          <div slot="content">需求从创建到需求上线所消耗的时间</div>
                          <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.avgDays}}天</div>
                </div>

                <!-- <div class="titbox nedbox" style="background-color:#00bcd4;cursor:pointer;" @click="goachivement">
                    <div style="width:100%">
                        <span style="color:#fff;font-size:13px;">绩效回顾</span>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">222</div>
                </div> -->

            </el-col>
        </el-row>

            
        <div style="height:470px;margin-bottom:15px;" class="echartsbox">
            <div style="border:1px solid #eee;height:100%;margin:0 15px;" class="leftbox" v-loading='demandflag'>
                <div class="demand">
                    <p style="margin:0;padding:13px 0 0 8px;font-weight:700;font-size:15px;">需求-项目分布</p>
                    <div class="solvereq">
                      <div style="width:100%;display:flex;">
                        <div style="width:150px;height:30px;"></div>
                        <div style="display:flex;flex:1;padding-right:10px;">
                            <div style="flex:1;line-height:30px;text-align:center;color:#fff;background-color:#4b78cd;">总计</div>
                            <div style="flex:2;line-height:30px;text-align:center;color:#fff;background-color:#99f;">业务需求</div>
                            <div style="flex:5;line-height:30px;text-align:center;color:#fff;background-color:#8bccf0;">IT实施情况</div>
                            <div style="flex:1;line-height:30px;text-align:center;color:#fff;background-color:#00bcd4;">成效评价</div>
                            <div style="flex:1;line-height:30px;text-align:center;color:#fff;background-color:rgba(255,153,0);">即将超时</div>
                            <div style="flex:1;line-height:30px;text-align:center;color:#fff;background-color:rgb(255,102,102);">延期</div>
                        </div>
                      </div>
                      <div class="itemhead" style="width:100%;display:flex;">
                        <div class="left" style="width:150px;height:30px;"></div>
                        <div class="rightIe" style="display:flex;flex:1;padding-right:10px;">
                            <div class="titleslide">需求总数</div>
                            <div class="titleslide">OA流程结束</div>
                            <div class="titleslide">OA送审中</div>
                            <!-- <div class="titleslide">OA建设中</div> -->
                            <div class="titleslide">上线完成</div>
                            <div class="titleslide">需求中</div>
                            <div class="titleslide">开发中</div>
                            <div class="titleslide">测试中</div>
                            <div class="titleslide">待上线</div>
                            <div class="titleslide">成效评价</div>
                            <div class="titleslide">即将超时</div>
                            <div class="titleslide">延期</div>
                        </div>
                      </div>
                      <div id="demand" ref="demand" style="width:100%;height:370px;">
                        <div class="itemcontent" v-for="(item, index) in fbData" :key="index">
                          <div class="leftcontent" style="width:150px;height:35px;overflow:hidden">{{item.name}}</div>
                          <div class="rightcontent" style="padding-right:10px;">
                            <div class="showslidebox" style="background-color:#4b78cd;cursor:pointer;" @click="goisyqPage('', item.name)">{{item.all_num}}</div>
                            <!-- <div class="borbox" style="width:1;height:35px;border-left:1px dashed #ccc;"></div> -->
                            <div class="showslidebox" style="background-color:rgba(100, 103, 305, 1);cursor:pointer;" @click="goisyqPage('OA流程结束', item.name)">{{item.real_num}}</div>
                            <div class="showslidebox" style="background-color:#99f;cursor:pointer;" @click="goisyqPage('OA送审中', item.name)" v-if="item.oaps_num">{{item.oaps_num}}</div>
                            <div class="showslidebox" style="background-color:#99f;cursor:pointer;" @click="goisyqPage('OA送审中', item.name)" v-else>0</div>
                            <!-- <div class="showslidebox" style="background-color:#99f;cursor:pointer;" @click="goisyqPage('OA建设中', item.name)">{{item.oajs_num}}</div> -->
                            <!-- <div class="borbox" style="width:1;height:35px;border-left:1px dashed #ccc;"></div> -->

                            <div class="showslidebox" style="background-color:rgba(0, 86, 196, 0.6);cursor:pointer;" @click="goisyqPage('上线完成', item.name)">{{item.close_num}}</div>
                            <div class="showslidebox" style="background-color:rgba(0, 86, 196, 0.4);cursor:pointer;" @click="goisyqPage('需求中', item.name)">{{item.new_num}}</div>
                            <div class="showslidebox" style="background-color:rgba(70, 150, 227, 0.5);cursor:pointer;" @click="goisyqPage('开发中', item.name)">{{item.kf_num}}</div>
                            <div class="showslidebox" style="background-color:rgba(100, 167, 232, 0.8);cursor:pointer;" @click="goisyqPage('测试中', item.name)">{{item.cs_num}}</div>
                            <div class="showslidebox" style="background-color:rgba(139, 204, 240, 1);cursor:pointer;" @click="goisyqPage('待上线', item.name)">{{item.dsx_num}}</div>
                            <div class="showslidebox" style="background-color:#00bcd4;cursor:pointer;" @click="goachievement(item)">{{item.hg_num}}</div>
                            <!-- 即将超时 -->
                            <div class="showslidebox" style="background-color:rgba(255,153,0);cursor:pointer;" @click="goisyqPage('', item.name, 'planTime')">{{item.expire_due_date}}</div>

                            <!-- <div class="borbox" style="width:1;height:35px;border-left:1px dashed #ccc;"></div> -->

                            <div class="showslidebox" style="background-color:rgba(255, 102, 102,1);cursor:pointer;" @click="goisyqPage('yq', item.name)">{{item.yq_num}}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>

        
        <el-row v-if="ywflag">
          <el-col :span="24" style="padding:0 15px;">
            <div class="rightbox" v-loading='rightechartsflag' ref="rightbox">
                <div class="launch" style="border:1px solid #eee;height:192px;overflow:hidden;z-index:1000">
                    <p style="margin:0;padding:13px 0 0 8px;font-weight:700;font-size:15px;">需求-发起部门分布TOP10</p>
                    <div id="launch" ref="launch" style="width:100%;height:160px;"></div>
                </div>
                <div class="acceptance" style="border:1px solid #eee;height:192px;overflow:hidden;z-index:1000">
                    <p style="margin:0;padding:13px 0 0 8px;font-weight:700;font-size:15px;">需求-受理部门分布TOP10</p>
                    <div id="acceptance" ref="acceptance" style="width:100%;height:160px;"></div>
                </div>
            </div>
          </el-col>
        </el-row>


        <div class="body" style="padding:0 40px;">
            <div class="orderbox" style="display:flex;margin-bottom:15px;">
              <span style="line-height:30px;display:inline-block;width:60px;margin-top:15px;">快速排序</span>
              <div class="btnflexbox">
                <button class="c-btn" v-for="(item,index) in orderarr" :key="index" @click="orderdata(item,index)"><i class="fa fa-sort-asc" style="font-size:21px;margin-right:5px;padding-top:8px;" v-if="item.type==='asc'"></i><i class="fa fa-sort-desc" style="font-size:21px;margin-right:5px;" v-if="item.type==='desc'"></i>{{item.name}}</button>
              </div>
            </div>
            <div style="margin:15px 0;display:flex;align-items:center;" v-if="activeName==='first'" class="selectThing">
              <p style="width:60px;margin-right:15px;">筛选条件</p>
              <el-checkbox v-model="listQuery.checked" @change="getListDataRed('1')" style="margin-top:0;margin-right:20px">未关联Redmine</el-checkbox>
              <el-checkbox v-model="listQuery.checkedno" @change="getListDataRed('0')" style="margin-top:0;">已关联Redmine</el-checkbox>
            </div>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="业务需求" name="first" v-if="checkList.includes('oa') || checkList.length===0"></el-tab-pane>
              <el-tab-pane label="系统优化" name="second" v-if="checkList.includes('2') || checkList.length===0"></el-tab-pane>
            </el-tabs>
            
            <el-collapse v-loading='collloading' style="min-height:100px;" v-model="activeNameCollapse" @change="collChange()" accordion>
              <el-collapse-item style="padding:0 15px;border-left:1px solid #eee;border-right:1px solid #eee;" v-for="(value, index) in tableData" :key="index" :name="activeName==='first' ? value.oa_id : value.id">
                <template slot="title">
                  <div style="width:100%">
                  <!-- <span style="color:#409EFF;display:inline-block;margin-left:20px;margin-right:20px;"></span> -->
                  <div style="display:inline-block;width:30px;text-align:center;line-height:30px;">
                    <div style="width:30px;height:30px;border-radius:50%;color:#FFF;background-color:#a5bce6" v-if="value.tracker_id==='2'">优</div>
                    <div style="width:30px;height:30px;border-radius:50%;color:#fff;background-color:#ffb380" v-else-if="value.tracker_id==='oa'">业</div>
                  </div>
                  <!-- <a href="javascript:;" style="text-decoration:underline;color:#409EFF"  @click="goRedmine(item.id)" v-if="item.tracker_id==='oa'">{{item.subject}}</a> -->
                  <span style="color:#2e2e2e" v-if="value.tracker_id==='oa'">{{value.subject}}</span>
                  <a href="javascript:;" style="text-decoration:underline;color:#409EFF" v-else @click="goRedmine(value.id)">#{{value.id}}&nbsp;&nbsp;{{value.subject}}</a>
                  <span style="color:#409EFF;border:1px solid #b3d8ff;background-color:#ecf5ff;padding:3px 10px;border-radius:5px;" v-if="value.needs_status">{{value.needs_status}}</span>
                  <span style="background-color: rgba(245,108,108,.1);border:1px solid rgba(245,108,108,.8);color: #f56c6c;padding:4px 10px;border-radius:5px;" v-if="value.isyq==='yq'">延期</span>
                  <a href="javascript:;" style="float:right;margin-right:15px;margin-top:3px;" v-if="activeName==='second'">详情</a>
                  <a href="javascript:;" style="float:right;margin-right:15px;margin-top:3px;" v-else-if="value.redmine_num > 0">详情</a>
                  <a href="javascript:;" style="float:right;margin-right:15px;margin-top:3px;" v-else></a>
                  </div>
                  <div class="collbox" style="display:flex;width:100%">
                    <div class="ssbox" style="width:20%">
                      <p style="width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"><span :style="[renderName==='涉及系统' ? clickStyle : noclick]">涉及系统:</span><span>{{value.project_name}}</span></p>
                      <p style="width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"><span :style="[renderName==='指派给' ? clickStyle : noclick]">创建人:</span>
                        <span v-if="activeName==='first'">{{value.handle_author}}</span>
                        <span v-if="activeName==='second'">{{value.author_id}}</span>
                      </p>
                    </div>
                    <div class="ssbox" style="width:15%">
                      <p><span :style="[renderName==='发起日期' ? clickStyle : noclick]">发起日期:</span><span v-if="value.created_on">{{value.created_on.split(' ')[0]}}</span></p>
                      <p><span :style="[renderName==='累计耗时' ? clickStyle : noclick]">累计耗时:</span><span style="color:red" v-if="Number(value.avgDay)>90">{{value.avgDay}}天</span><span v-else-if="!value.avgDay"></span><span v-else>{{value.avgDay}}天</span></p>
                    </div>

                    <div class="ssbox" style="width:25%" v-if="activeName==='first'">
                      <p v-show-tips style="width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"><span :style="[renderName==='发起部门' ? clickStyle : noclick]">发起部门:</span><span>{{value.handle_branch}}</span></p>
                      <p v-show-tips style="width:100%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"><span :style="[renderName==='受理部门' ? clickStyle : noclick]">受理部门:</span><span>{{value.accepting_group}}</span></p>
                    </div>

                    <div class="ssbox" style="width:15%">
                      <p><span :style="[renderName==='计划验收时间' ? clickStyle : noclick]">计划验收时间:</span><span v-if="value.due_date">{{value.due_date.substr(0,10)}}</span></p>
                      <p v-if="value.tracker_id==='2'"><span :style="[renderName==='优先级' ? clickStyle : noclick]" >优先级:</span>
                        <span v-if="value.priority_id === '3'" style="text-align: center;">高</span>
                        <span v-else-if="value.priority_id === '4'" style="text-align: center;">紧急</span>
                        <span v-else-if="value.priority_id === '5'" style="text-align: center;">立刻</span>
                        <span v-else-if="value.priority_id === '2'" style="text-align: center;">普通</span>
                        <span v-else style="text-align: center;">低</span>
                      </p>
                      <p v-if="value.tracker_id==='oa'"><span :style="[renderName==='优先级' ? clickStyle : noclick]" >优先级:</span>
                        <span style="text-align: center;" v-if="Number(value.priority_id)===2">一般</span>
                        <span style="text-align: center;" v-else-if="Number(value.priority_id)===4">紧急</span>
                      </p>
                      <!-- <p v-if="this.activeName==='first'">累计耗时:<span style="color:red" v-if="Number(item.avgDay)>60">{{item.avgDay}}天</span><span v-else>{{item.avgDay}}天</span></p> -->
                    </div>

                    <div class="ssbox" style="width:25%">
                      <p>
                        <span :style="[renderName==='实际验收时间' ? clickStyle : noclick]">实际验收时间:</span>
                        <span v-if="value.real_time">{{value.real_time.substr(0,10)}}</span>
                        <!-- <span v-else-if="value.REAL_END_DATE">{{value.REAL_END_DATE.substr(0,10)}}</span> -->
                      </p>
                      <p v-show-tips v-if="activeName==='first'" style="width:100%;">
                        <span :style="[renderName==='IT部门需求预沟通联络人' ? clickStyle : noclick]">IT部门需求预沟通联络人:</span>
                        <span>{{value.it_branch_liaison}}</span>
                      </p>
                      <p v-if="activeName==='second'"><span>ITSM单号:{{value.chg_no}}</span></p>
                    </div>
                  </div>
                </template>
                <div v-if="activeName==='first' && value.redmine_num > 0" style="min-height:173px" v-loading="reqinfoLoading" element-loading-text="正在加载中。。。">
                  <div v-for="(item, index) in reqlists" :key="index" style="position:relative;margin-bottom:15px;">
                    <div style="margin:0 50px;border-bottom:1px dashed #aaa;margin-bottom:10px;">
                      <a href="javascript:;" @click="goRedmine(item.id)" style="text-decoration:underline;color:#409EFF">#{{item.id}}&nbsp;&nbsp;{{item.subject}}</a>
                      <span style="color:#409EFF;border:1px solid #b3d8ff;background-color:#ecf5ff;padding:3px 10px;border-radius:5px;">{{item.redmine_status}}</span>

                      <div style="display:flex;">
                        <p style="margin:5px 0;flex:1">项目:{{item.name}}</p>
                        <p style="margin:5px 0;flex:1">ITSM单号:{{item.chg_no}}</p>
                      </div>
                    </div>
                    <!-- <hr> -->
                    <!-- 头部 -->
                    <div class="stepstatus" style="width:100%;height:30px;display:flex;">
                      <div style="color:#000;text-align:center;line-height:30px;flex:1;">OA送审中</div>
                      <div style="color:#000;text-align:center;line-height:30px;flex:1;">OA审批完成</div>
                      <div v-for="(stepstatus, stuindex) in item.msglist" :key="stuindex" style="flex:1;display:flex;align-items:center">
                        <div style="color:#000;text-align:center;line-height:30px;width:100%">{{stepstatus.status === '提交验收' ? 'OA提交验收' : stepstatus.status}}</div>
                      </div>
                      <!-- <div v-if="item.hasOwnProperty('msglist')"> -->
                        <div style="color:#000;text-align:center;line-height:30px;flex:1;" v-if="item.msglist.length==0">需求中</div>
                        <div style="color:#000;text-align:center;line-height:30px;flex:1;" v-if="item.msglist.length==0">开发中</div>
                        <div style="color:#000;text-align:center;line-height:30px;flex:1;" v-if="item.msglist.length==0">测试中</div>
                        <div style="color:#000;text-align:center;line-height:30px;flex:1;" v-if="item.msglist.length==0">提交验收</div>
                      <!-- </div> -->

                      <div style="color:#000;text-align:center;line-height:30px;flex:1;">上线申请</div>
                      <div style="color:#000;text-align:center;line-height:30px;flex:1;">上线完成</div>
                      <div style="color:#000;text-align:center;line-height:30px;flex:1;">OA流程结束</div>
                    </div>

                    <!-- 中间步骤 -->
                    <div class="steps" style="width:100%;height:40px;display:flex;position:absolute;left:-55px;top:95px;" :class="[{'oazeno': item.msglist.length===0},{'oathree': item.msglist.length===3},{'oafour': item.msglist.length===4},{'oafive': item.msglist.length===5},{'len6': item.msglist.length===6},{'len7': item.msglist.length===7}]">
                      <div style="flex:1;color:#fff;line-height:40px;display:flex;justify-content: flex-end">
                        <el-tooltip placement="bottom">
                          <div slot="content">
                            <div>
                              <span v-if="value.created_on && value.created_on.length>19">{{value.created_on.substr(0,19)}}</span>
                              <span v-else>{{value.created_on}}</span>
                              {{value.handle_author}}创建项目<br/>
                              <!-- <div v-if="item.oaps_date && item.oaps_date.length>19">{{item.oaps_date.substr(0,19)}}&nbsp;&nbsp;OA送审中</div>
                              <div v-else>{{item.oaps_date}}&nbsp;&nbsp;OA送审中</div> -->
                            </div>
                            </div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">1</div>
                        </el-tooltip>
                        <!-- <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;text-align:center">1</div> -->
                      </div>

                      <div style="flex:1;color:#fff;line-height:40px;display:flex;align-items:center">
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-if="item.oaps_date"></div>
                        <div style="flex:1;height:2px;background-color:#ccc" v-else-if="!item.oaps_date"></div>
                        <el-tooltip placement="bottom" v-if="item.oaps_date">
                          <div slot="content">
                            <div>
                              <div v-if="item.oaps_date && item.oaps_date.length>19">{{item.oaps_date.substr(0,19)}}&nbsp;&nbsp;OA审批完成</div>
                              <div v-else>{{item.oaps_date}}&nbsp;&nbsp;OA审批完成</div>
                            </div>
                            </div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">2</div>
                        </el-tooltip>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;text-align:center" v-else>2</div>
                      </div>
                      
                      <div v-for="(stbox, sindex) in item.msglist" :key="sindex" style="flex:1;display:flex;align-items:center">
                        <!-- <div style="flex:1;" v-if="sindex===0"></div> -->
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-if="sindex===0"></div>
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-else-if="stbox.time!==''"></div>
                        <div style="flex:1;height:2px;background-color:#ccc" v-else-if="stbox.time===''"></div>
                        <el-tooltip placement="bottom" v-if="stbox.time!==''">
                          <div slot="content" v-html="stbox.msg"></div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">{{sindex+3}}</div>
                        </el-tooltip>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else-if="sindex===0">{{sindex+3}}</div>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-else-if="stbox.time===''">{{sindex+3}}</div>
                      </div>
                      <!-- 上线申请 -->
                      <div style="flex:1;display:flex;align-items:center">
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-if="item.sxsq_date"></div>
                        <div style="flex:1;height:2px;background-color:#ccc" v-else></div>
                        <div v-if="item.sxsq_date">
                          <el-tooltip placement="bottom"  v-if="item.sxsq_desc">
                            <div slot="content">{{item.sxsq_desc}}</div>
                            <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-if="item.msglist.length===0">7</div>
                            <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else>7</div>
                          </el-tooltip>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else>7</div>
                            <!-- <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else>{{item.msglist.length+2}}</div> -->
                        </div>
                        <div v-else>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-if="item.msglist.length===0">7</div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-else>7</div>
                        </div>
                      </div>
                      <!-- 上线完成 -->
                      <div style="flex:1;display:flex;align-items:center">
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-if="item.sxwc_date"></div>
                        <div style="flex:1;height:2px;background-color:#ccc" v-else></div>
                        <div v-if="item.sxwc_date">
                          <el-tooltip placement="bottom" v-if="item.sxwc_desc">
                            <div slot="content">{{item.sxwc_desc}}</div>
                            <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-if="item.msglist.length===0">8</div>
                            <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else>8</div>
                          </el-tooltip>
                          <!-- <el-tooltip placement="bottom" v-else-if="item.REAL_END_DATE">
                            <div slot="content" v-if="item.REAL_END_DATE && item.REAL_END_DATE.length>19">{{item.REAL_END_DATE.substr(0,19)}}上线完成</div>
                            <div slot="content" v-else-if="item.REAL_END_DATE">{{item.REAL_END_DATE}}上线完成</div>
                            <div slot="content" v-else>上线完成</div>
                            <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-if="item.msglist.length===0">7</div>
                            <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else>{{item.msglist.length+3}}</div>
                          </el-tooltip> -->
                            <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else>8</div>
                        </div>
                        <div v-else>
                            <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-if="item.msglist.length===0">8</div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-else>8</div>
                        </div>
                      </div>
                      <!-- 固定添加的最后一项业务验收 -->
                      <div style="flex:1;display:flex;align-items:center">
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-if="value.FINISHEDFLAG==='1'"></div>
                        <div style="flex:1;height:2px;background-color:#ccc" v-else></div>
                        <!-- <el-tooltip placement="bottom" v-if="value.FINISHEDFLAG==='1'">
                          <div slot="content" v-if="value.FINISHEDFLAG==='1'">OA流程结束</div>
                          <div slot="content" v-else>OA流程结束</div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-if="item.msglist.length===0">8</div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else>{{item.msglist.length+4}}</div>
                        </el-tooltip> -->
                        <div v-if="value.FINISHEDFLAG==='1'">
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">9</div>
                        </div>
                        <div v-else>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-if="item.msglist.length===0">9</div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-else>9</div>
                        </div>
                      </div>

                    </div>
                    <div class="dtime" style="width:100%;height:20px;display:flex;margin-top:40px;">
                      <div style="width:100%;text-align:center;flex:1;" v-if="value.created_on">{{value.created_on.substr(0,10)}}</div>
                      <div style="width:100%;text-align:center;flex:1;" v-if="item.oaps_date">{{item.oaps_date.substr(0,10)}}</div>
                      <div v-else style="flex:1;"></div>
                      <div v-for="(dbox,dindex) in item.msglist" :key="dindex" style="flex:1;">
                        <!-- <el-tooltip placement="bottom" v-if="dbox.time!==''">
                          <div slot="content" v-html="dbox.msg"></div> -->
                          <!-- <div style="width:100%;text-align:center" v-if="dbox.time==='' && dindex===0">{{item.created_on.substr(0,10)}}</div> -->
                          <div style="width:100%;text-align:center" v-if="dbox.time!==''">{{dbox.time.split(' ')[0]}}</div>
                        <!-- </el-tooltip> -->
                          <div v-else style="width:100%;"></div>
                      </div>

                      <div style="flex:1;" v-if="item.msglist.length===0">
                        <div style="width:100%;height:20px;"></div>
                      </div>
                      <div style="flex:1;" v-if="item.msglist.length===0">
                        <div style="width:100%;height:20px;"></div>
                      </div>
                      <div style="flex:1;" v-if="item.msglist.length===0">
                        <div style="width:100%;height:20px;"></div>
                      </div>
                      <div style="flex:1;" v-if="item.msglist.length===0">
                        <div style="width:100%;height:20px;"></div>
                      </div>

                      <!-- 上线申请 -->
                        <div style="flex:1;height:20px;text-align:center" v-if="item.sxsq_date">
                            <div style="width:100%;text-align:center">{{item.sxsq_date.substr(0,10)}}</div>
                        </div>
                        <!-- <div style="flex:1;height:20px;text-align:center" v-else-if="item.redmine_status==='待上线' && item.hasOwnProperty('chg_create_date')">
                            <div style="width:100%;text-align:center">{{item.chg_create_date.substr(0,10)}}</div>
                        </div> -->
                        <div style="flex:1;height:20px;text-align:center" v-else>
                        </div>
                      <!--上线完成  -->
                      <div style="flex:1;height:20px;text-align:center" v-if="item.sxwc_date">
                          <!-- <el-tooltip placement="bottom">
                            <div slot="content">{{item.REAL_END_DATE}}上线完成</div> -->
                            <div style="width:100%;text-align:center">{{item.sxwc_date.substr(0,10)}}</div>
                          <!-- </el-tooltip> -->
                        </div>
                        <!-- <div style="flex:1;height:20px;text-align:center" v-else-if="item.hasOwnProperty('REAL_END_DATE')">
                            <div style="width:100%;text-align:center">{{item.REAL_END_DATE.substr(0,10)}}</div>
                        </div> -->
                        <div style="flex:1;height:20px;text-align:center" v-else>
                        </div>
                        <!-- OA流程结束 -->
                        <!-- <div style="flex:1;height:20px;text-align:center" v-if="item.real_time">
                            <div style="width:100%;text-align:center">{{item.real_time.substr(0,10)}}</div>
                        </div> -->
                        <div style="flex:1;height:20px;text-align:center">
                        </div>
                      </div>
                    <div style="padding:0 15px;margin:15px 0 ;width:100%;height:1px;background-color:#eee;" v-if="reqlists.length>0"></div>
                  </div>
                  <!-- <hr style="margin-top:15px;padding:0 15px;color:#eee"> -->
                </div>

                <div v-else-if="activeName==='second'" style="margin-top:15px;position:relative;left:0px;margin-bottom:15px;">
                    <div class="stepstatus" style="width:100%;height:30px;display:flex;">
                      <div style="flex:1;text-align:center;color:#000;line-height:30px;">
                        需求创建
                      </div>
                      <div v-for="(stepstatus, stuindex) in value.msglist" :key="stuindex" style="flex:1;display:flex;align-items:center">
                        <div style="color:#000;text-align:center;line-height:30px;width:100%">{{stepstatus.status}}</div>
                      </div>
                      <!-- 待上线 -->
                      <div style="flex:1;text-align:center;color:#000;" v-if="value.msglist.length===0">
                        需求中
                      </div>
                      <div style="flex:1;text-align:center;color:#000;" v-if="value.msglist.length===0">
                        开发中
                      </div>
                      <div style="flex:1;text-align:center;color:#000;" v-if="value.msglist.length===0">
                        测试中
                      </div>
                      <div style="flex:1;text-align:center;color:#000;" v-if="value.msglist.length===0">
                        提交验收
                      </div>
                      <div style="flex:1;text-align:center;color:#000;">
                        <!-- 待上线 -->
                        上线申请
                      </div>
                      <!-- 上线完成 -->
                      <div style="flex:1;text-align:center;color:#000;">
                        上线完成
                      </div>
                      <div style="flex:1;text-align:center;color:#000;visibility:hidden">
                        <!-- OA流程结束 -->
                        OA流程结束
                      </div>
                    </div>

                    <div class="steps" :class="[{'len0': (value.msglist.length===0)},{'len1': (value.msglist.length===1)},{'len2': (value.msglist.length===2)},{'len3': (value.msglist.length===3)},{'len4': (value.msglist.length===4)},{'len5': (value.msglist.length===5)},{'len6': (value.msglist.length===6)},{'len7': (value.msglist.length===7)}]" style="width:100%;height:40px;display:flex;position:absolute;left:-75px;top:30px;">
                      <div style="flex:1;align-items:center;display:flex;justify-content: flex-end;">
                        <el-tooltip placement="bottom" v-if="value.created_on">
                          <div slot="content">
                            <span v-if="value.created_on && value.created_on.length>19">{{value.created_on.substr(0,19)}}</span>
                            <span v-else-if="value.created_on">{{value.created_on}}</span>
                            {{value.author_id}}创建需求</div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">1</div>
                        </el-tooltip>
                        <div v-else style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">1</div>
                      </div>

                      <div v-for="(stbox, sindex) in value.msglist" :key="sindex" style="flex:1;display:flex;align-items:center">
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-if="sindex===0"></div>
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-else-if="stbox.time!==''"></div>
                        <div style="flex:1;height:2px;background-color:#ccc" v-else-if="stbox.time===''"></div>
                        <el-tooltip placement="bottom" v-if="stbox.time!==''">
                          <div slot="content" v-html="stbox.msg"></div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">{{sindex+2}}</div>
                        </el-tooltip>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else-if="sindex===0">{{sindex+2}}</div>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-else-if="stbox.time===''">{{sindex+2}}</div>
                      </div>

                      <div v-if="value.msglist.length===0" style="flex:1;display:flex;align-items:center">
                        <div style="flex:1;height:2px;background-color:#4b78cd"></div>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">2</div>
                      </div>

                      <div v-if="value.msglist.length===0" style="flex:1;display:flex;align-items:center">
                        <div style="flex:1;height:2px;background-color:#4b78cd"></div>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">3</div>
                      </div>

                      <div v-if="value.msglist.length===0" style="flex:1;display:flex;align-items:center">
                        <div style="flex:1;height:2px;background-color:#4b78cd"></div>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">4</div>
                      </div>

                      <div v-if="value.msglist.length===0" style="flex:1;display:flex;align-items:center">
                        <div style="flex:1;height:2px;background-color:#4b78cd"></div>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">5</div>
                      </div>

                      <!-- 上线申请 -->
                      <div style="flex:1;align-items:center;display:flex;justify-content: flex-end;">
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-if="value.sxsq_date"></div>
                        <div style="flex:1;height:2px;background-color:#ccc" v-else></div>
                        <el-tooltip placement="bottom" v-if="value.sxsq_desc">
                          <div slot="content">
                            <span>{{value.sxsq_desc}}</span>
                          </div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">6</div>
                        </el-tooltip>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-else>6</div>
                      </div>
                      <!-- 上线完成 -->
                      <div style="flex:1;align-items:center;display:flex;justify-content: flex-end;">
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-if="value.sxwc_date"></div>
                        <div style="flex:1;height:2px;background-color:#ccc" v-else></div>
                        <el-tooltip placement="bottom" v-if="value.sxwc_desc">
                          <div slot="content">
                            {{value.sxwc_desc}}
                          </div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;">7</div>
                        </el-tooltip>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-else>7</div>
                      </div>
                      <!-- OA流程结束 -->
                      <div style="flex:1;align-items:center;display:flex;justify-content: flex-end;visibility:hidden">
                        <div style="flex:1;height:2px;background-color:#4b78cd" v-if="value.status_id==='5'"></div>
                        <div style="flex:1;height:2px;background-color:#ccc" v-else></div>
                        <el-tooltip placement="bottom" v-if="value.status_id==='5'">
                          <div slot="content">
                            <!-- OA流程结束 -->
                            OA流程结束
                          </div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-if="value.msglist.length===0">8</div>
                          <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else>{{value.msglist.length+4}}</div>
                        </el-tooltip>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#4b78cd;color:#fff;text-align:center;line-height:40px;" v-else-if="value.msglist.length===0">8</div>
                        <div style="width:40px;height:40px;border-radius:50%;background-color:#ccc;color:#fff;text-align:center;line-height:40px;" v-else>{{value.msglist.length+4}}</div>
                      </div>
                    </div>

                    <div class="dtime" style="width:100%;height:20px;display:flex;margin-top:40px;">
                      <!-- 需求创建 -->
                      <div style="flex:1;height:20px;">
                          <div style="width:100%;text-align:center" v-if="value.created_on">{{value.created_on.substr(0,10)}}</div>
                        <div v-else></div>
                      </div>
                      <div v-for="(dbox,dindex) in value.msglist" :key="dindex" style="flex:1;">
                          <div style="width:100%;text-align:center" v-if="dbox.time!==''">{{dbox.time.substr(0,10)}}</div>
                        <div v-else style="width:100%;"></div>
                      </div>

                      <div style="flex:1;height:20px;" v-if="value.msglist.length===0"></div>
                      <div style="flex:1;height:20px;" v-if="value.msglist.length===0"></div>
                      <div style="flex:1;height:20px;" v-if="value.msglist.length===0"></div>
                      <div style="flex:1;height:20px;" v-if="value.msglist.length===0"></div>

                      <!-- 上线申请 -->
                      <div style="flex:1;height:20px;">
                        <div v-if="value.sxsq_date">
                          <div style="width:100%;text-align:center">{{value.sxsq_date.substr(0,10)}}</div>
                        </div>
                        <div v-else></div>
                      </div>
                      <!-- 上线完成 -->
                      <div style="flex:1;height:20px;">
                        <div v-if="value.sxwc_date">
                          <div style="width:100%;text-align:center">{{value.sxwc_date.substr(0,10)}}</div>
                        </div>
                        <div v-else></div>
                      </div>
                      <!-- OA流程结束 -->
                      <div style="flex:1;height:20px;">
                        <!-- <div v-if="value.needs_status=='上线完成'">
                          <div style="width:100%;text-align:center" v-if="value.REAL_END_DATE">{{value.REAL_END_DATE.substr(0,10)}}</div>
                        </div>
                        <div v-else></div> -->
                        <div></div>
                      </div>
                      <!-- OA流程结束 -->
                    </div>
                  </div>
                <!-- </div> -->
              </el-collapse-item>
            </el-collapse>
            <div class="pagebox" style="width:100%;height:50px;line-height:50px;over-flow:hidden;padding-bottom:10px;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="listQuery.page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total" style="margin-top:12px;float:right;"
                popper-class='mouthFix'>
              </el-pagination>
            </div>
            
            <el-dialog
              title=""
              :visible.sync="achievementInfo"
              :close-on-click-modal = 'false'
              :show-close = 'false'
              top="3vh"
              width="70%" class="diao">
              <div class="preview">
        <p style="color:#000;font-size:20px;font-weight:700;padding:10px 0;" class="bform">需求信息</p>
        <el-form label-width="130px" :model="formLabelAlign" class="bform">
          <el-form-item label="项目名称">
            <el-input v-model="formLabelAlign.subject" style="width:96%;" disabled></el-input>
          </el-form-item>
          <div style="display:flex;">
              <el-form-item label="需求类别" style="flex:1;">
                <el-input v-model="formLabelAlign.trackerId" style="width:90%;" disabled></el-input>
              </el-form-item>
              <el-form-item label="涉及系统" style="flex:1;">
                <el-input v-model="formLabelAlign.projectName" style="width:90%;" disabled></el-input>
              </el-form-item>
          </div>
          <div style="display:flex;">
              <el-form-item label="发起部门" style="flex:1;">
                <el-input v-model="formLabelAlign.handleBranch" style="width:90%;" disabled></el-input>
              </el-form-item>
              <el-form-item label="发起人" style="flex:1;">
                <el-input v-model="formLabelAlign.handleAuthor" style="width:90%;" disabled></el-input>
              </el-form-item>
          </div>
          <div style="display:flex;">
              <el-form-item label="需求部门联络人" style="flex:1;">
                <el-input v-model="formLabelAlign.itBranchLiaison" style="width:90%;" disabled></el-input>
              </el-form-item>
              <el-form-item label="需求受理组" style="flex:1;">
                <el-input v-model="formLabelAlign.acceptingGroup" style="width:90%;" disabled></el-input>
              </el-form-item>
          </div>
          <div style="display:flex;">
              <el-form-item label="计划完成时间" style="flex:1;">
                <el-input v-model="formLabelAlign.dueDate" style="width:90%;" disabled></el-input>
              </el-form-item>
              <el-form-item label="实际完成时间" style="flex:1;">
                <el-input v-model="formLabelAlign.realTime" style="width:90%;" disabled></el-input>
              </el-form-item>
          </div>
          <div style="display:flex;">
              <el-form-item label="需求发起时间" style="flex:1;">
                <el-input v-model="formLabelAlign.createdOn" style="width:90%;" disabled></el-input>
              </el-form-item>
              <el-form-item label="需求实施情况" style="flex:1;">
                <el-input v-model="formLabelAlign.needsStatus" style="width:90%;" disabled></el-input>
              </el-form-item>
          </div>
            <el-form-item label="应用成效评价标准">
              <el-input type="textarea" v-model="formLabelAlign.statuss" style="width:96%;" disabled></el-input>
            </el-form-item>
        </el-form>

        <p style="color:#000;font-size:20px;font-weight:700;padding:15px 0;" class="bform">成效评价</p>
        <el-form label-width="130px" :model="sendInfo" class="bform">
            <div style="display:flex;">
                <el-form-item label="填报时间" style="flex:1;">
                  <el-input v-model="sendInfo.createTime" style="width:90%;" disabled></el-input>
                </el-form-item>
                <!-- 1. 需求【实际完成时间】小于等于【计划完成时间】。此处显示“”如期完成提交验收 -->
                <!-- 2. 需求【实际完成时间】大于【计划完成时间】。此处显示“”延期提交验收 -->
                <el-form-item label="需求响应及时性" style="flex:1;">
                  <el-input v-if="timeliness==='1'" placeholder="如期完成提交验收" style="width:90%;" disabled></el-input>
                  <el-input v-if="timeliness==='2'" placeholder="延期提交验收" style="width:90%;" disabled></el-input>
                </el-form-item>
            </div>

            <el-form-item label="需求实现目的" prop="type">
              <el-checkbox-group v-model="need_purpose" disabled>
                <el-checkbox label="1" name="type">提升内部使用体验</el-checkbox>
                <el-checkbox label="2" name="type">提高效率</el-checkbox>
                <el-checkbox label="3" name="type">内部控制</el-checkbox>
                <el-checkbox label="4" name="type">满足合规要求</el-checkbox>
                <el-checkbox label="5" name="type">节约成本</el-checkbox>
                <el-checkbox label="6" name="type">其他</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="应用绩效回顾等级">
              <el-radio-group v-model="sendInfo.reviewLevel" disabled>
                <el-radio label="0">A 超出目标，效用显著</el-radio>
                <el-radio label="1">B 符合目标，完成预期</el-radio>
                <el-radio label="2">C 低于目标，待优化</el-radio>
                <el-radio label="3">D 成效暂不明确，建议继续跟踪</el-radio>
                <el-radio label="4">E 未达成目标，已弃用或拟弃用</el-radio>
                <el-radio label="5">F 其他</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="功能推广或使用情况说明" class="tetare">
              <el-input type="textarea" v-model="sendInfo.messageDetail" style="width:96%;" disabled></el-input>
            </el-form-item>
        </el-form>
    </div>
              <div style="display:flex;justify-content:center">
                <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="achievementInfo=false">退出</el-button>
              </div>
            </el-dialog>

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
                <div class="errbox">
                    <div class="fa fa-lock" style="font-size:100px;margin-top:100px;"></div>
                    <h2>请联系管理员添加Redmine项目权限</h2>
                </div>
              </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import echarts from 'echarts'
import API from '@/api'
import {getProjectByUser, getuserdict} from '@/api/xyzqPort/erneed'
// import {listByMap} from '@/api/xyzqPort/yewuneed'  // 获取所有的状态码
import {getProjectReqEcharts, getReqKbList, getEchartsByBranch, getDataByTrackerId, getOaProjects, getReqByOaId, getBranchList} from '@/api/xyzqPort/OaPort'
import {systemlogStatis} from '@/api/modules/all'

import {yuluan, getQxNeedmeritsReview} from '@/api/EmailPost/preview.js'
export default {
  data () {
    return {
      treedata: [],
      defaultProps: {
        id: 'org_id',
        children: 'children',
        label: 'org_name'
      },
      Checkvalue: [],
      CheckvalueArr: [],
      defaultArr: [],
      activeNameCollapse: '',
      need_purpose: [],
      timeliness: '',
      sendInfo: {
        // 需求id
        needId: '',
        createTime: '',
        // 需求响应及时性
        timeliness: '',
        // 需求实现目的
        needPurpose: '',
        // 应用绩效回顾等级
        reviewLevel: '',
        // 功能推广或使用情况说明
        messageDetail: '',
        // 创建人
        createAuthor: ''
      },
      formLabelAlign: {
        assignedToId: '',
        needId: '',
        subject: '',
        dueDate: '',
        stype: [],
        authorId: '0',
        createdOn: '',
        statuss: '',
        handleBranch: '',
        handleAuthor: '',
        acceptingGroup: '',
        trackerId: '',
        itBranchLiaison: '',
        projectName: '',
        needsStatus: '',
        avgDay: '',
        oaId: ''
      },
      projectOptions: [],  // 所有的项目和对应的id
      projectOptionsAll: [],
      changeTime: ['2019-11-11', '2019-11-11'],      // 默认的选中时间
      listQuery: {
        project_ids: [],
        statusIds: [],
        page: 1,
        pageSize: 10,
        orderType: 'asc',
        orderFiled: 'isyq',
        checked: false,
        checkedno: false
      },
      achievementInfo: false,
      titlog: {
        avgDays: 0,
        oaNum: 0,
        reqNum: 0,
        yqNum: 0,
        stopNum: 0,
        cswwcNum: 0,
        closeNum: 0,
        realNum: 0,
        expireDueDateSum: ''
      },
      tableData: [],
      total: 0,
      searchText: '',
      activeName: 'first',
      checkList: ['oa'],
      allstatus: [],  // 所有的状态
      ywflag: false,
      myChartdemand: null,
      myChartsaccept: null,
      resizeTimer: null,
      aboutarr: [],
      collloading: true,
      userOptions: [],
      radio: 6,
      orderarr: [{
        id: 'handle_branch',
        name: '发起部门',
        type: 'desc'
      }, {
        id: 'accepting_group',
        name: '受理部门',
        type: 'desc'
      }, {
        id: 'created_on',
        name: '发起日期',
        type: 'desc'
      }, {
        id: 'due_date',
        name: '计划验收时间',
        type: 'desc'
      }, {
        id: 'real_time',
        name: '实际验收时间',
        type: 'desc'
      }, {
        id: 'avgDay',
        name: '累计耗时',
        type: 'desc'
      }, {
        id: 'priority_id',
        name: '优先级',
        type: 'desc'
      }, {
        id: 'project_id',
        name: '涉及系统',
        type: 'desc'
      }, {
        id: 'status_id',
        name: '状态',
        type: 'desc'
      }, {
        id: 'isyq',
        name: '是否延期',
        type: 'desc'
      }, {
        id: 'it_branch_liaison',
        name: 'IT部门需求预沟通联络人',
        type: 'desc'
      }],
      gbarr: [],
      clstatusarr: [],
      demandflag: true,
      rightechartsflag: true,
      renderName: '',
      clickStyle: {
        color: 'orange'
      },
      noclick: {
        color: '#000'
      },
      // formLabelAlign: {
      //   name: '',
      //   region: '',
      //   type: ''
      // },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 182)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      fbData: [],
      noproFlag: false,
      reqnum: {
        oa_num: 0,
        need_num: 0,
        all_num: 0
      },
      oaProname: [],
      forSecharName: [],
      defaultTime: [],
      reqlists: [],
      reqinfoLoading: false
    }
  },
  created () {
    this.getnowtime(182)

    // this.$refs.timeSelect.click()
    var url = window.location.href
    if (url.indexOf('?token=') !== -1) {
      localStorage.setItem('tabIndex', 468)
      this.loginEiac()
    }
    if (typeof (this.$route.query.stime) !== 'undefined' && this.$route.query.stime !== '') {
      this.changeTime[0] = this.$route.query.stime
      this.changeTime[1] = this.$route.query.etime
    }

    if (typeof (this.$route.query.tracker_ids) !== 'undefined' && this.$route.query.tracker_ids !== '') {
      this.checkList = this.$route.query.tracker_ids.split(',')
      // console.log(this.checkList)
    } else {
      this.checkList = ['oa']
    }

    if (this.$route.query.avtiveName) {
      this.activeName = this.$route.query.avtiveName
    }
    if (typeof (this.$route.query.proid) !== 'undefined' && this.$route.query.proid !== '') {
      this.listQuery.project_ids = this.$route.query.proid
    } else {
      this.listQuery.project_ids = ''
    }
    if (typeof (this.$route.query.radio) !== 'undefined' && this.$route.query.radio !== '') {
      this.radio = Number(this.$route.query.radio)
      if (this.radio === 0 && !this.$route.query.stime) {
        this.getnowtime('all')
      }
    } else {
      // this.getnowtime(182)
    }
  },
  mounted () {
    // 获取树状结构数据
    this.getBranchData()
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
    activeName: function (val) {
      // console.log(val)
      if (val === 'first') {
        // this.listQuery.tracker_ids = 'oa'
        this.orderarr = [{
          id: 'handle_branch',
          name: '发起部门',
          type: 'desc'
        }, {
          id: 'accepting_group',
          name: '受理部门',
          type: 'desc'
        }, {
          id: 'created_on',
          name: '发起日期',
          type: 'desc'
        }, {
          id: 'due_date',
          name: '计划验收时间',
          type: 'desc'
        }, {
          id: 'real_time',
          name: '实际验收时间',
          type: 'desc'
        }, {
          id: 'avgDay',
          name: '累计耗时',
          type: 'desc'
        }, {
          id: 'priority_id',
          name: '优先级',
          type: 'desc'
        }, {
          id: 'project_id',
          name: '涉及系统',
          type: 'desc'
        }, {
          id: 'status_id',
          name: '状态',
          type: 'desc'
        }, {
          id: 'isyq',
          name: '是否延期',
          type: 'desc'
        }, {
          id: 'it_branch_liaison',
          name: 'IT部门需求预沟通联络人',
          type: 'desc'
        }]
      } else if (val === 'second') {
        // this.listQuery.tracker_ids = '2'
        this.orderarr = [{
          id: 'created_on',
          name: '发起日期',
          type: 'desc'
        }, {
          id: 'due_date',
          name: '计划验收时间',
          type: 'desc'
        }, {
          id: 'REAL_END_DATE',
          name: '实际验收时间',
          type: 'desc'
        }, {
          id: 'avgDay',
          name: '累计耗时',
          type: 'desc'
        }, {
          id: 'priority_id',
          name: '优先级',
          type: 'desc'
        }, {
          id: 'project_id',
          name: '涉及系统',
          type: 'desc'
        }, {
          id: 'status_id',
          name: '状态',
          type: 'desc'
        }, {
          id: 'isyq',
          name: '是否延期',
          type: 'desc'
        }, {
          id: 'id',
          name: '需求编号',
          type: 'desc'
        }]
      }
    }
  },
  methods: {
    getBranchData () {
      getBranchList().then(res => {
        let arr = []
        arr.push(res.data.data)
        // console.log([...res.data.data])
        this.defaultArr = []
        res.data.data.children.forEach(item => {
          this.defaultArr.push(item.org_id)
        })
        this.treedata = arr
        this.$nextTick(() => {
          if (typeof (this.$route.query.branchArr) !== 'undefined' && this.$route.query.branchArr !== '') {
            this.$route.query.branchArr.split(',').forEach(item => {
              this.$refs.tree.setChecked(item, true)
            })
            this.$refs.tree.getCheckedNodes().forEach(item => {
              if (!item.children || item.children.length === 0) {
                this.Checkvalue.push(item.org_name)
              }
            })
          }
          this.getproject()
          // this.getallstatus()  // 获取所有的状态码
          this.getUserOptions()
        })
      })
    },
    // 移除选中的标签
    removeCheck (val) {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      let id = ''
      this.CheckvalueArr.forEach(item => {
        if (item.org_name === val) {
          id = item.org_id
        }
      })
      this.CheckvalueArr = this.CheckvalueArr.filter(item => {
        return item.org_name !== val
      })
      this.$refs.tree.setChecked(id, false)
      // this.$nextTick(() => {
      //   if (this.$refs.tree.getCheckedKeys(true) && this.$refs.tree.getCheckedKeys(true).length >= 25) {
      //     this.$refs.parentTree.style.width = '72%'
      //   } else {
      //     this.$refs.parentTree.style.width = '42%'
      //   }
      // })
      // this.gettableData()
      // this.getListData()
      this.timeChangepro()
    },
    // 获取选中的需求受理组
    handleCheckChange (data, checked, indeterminate) {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.Checkvalue = []
      this.CheckvalueArr = []
      let arr = checked.checkedNodes
      arr.forEach(item => {
        if (!item.hasOwnProperty('children') || item.children.length === 0) {
          this.Checkvalue.push(item.org_name)
          this.CheckvalueArr.push(item)
        }
      })
      // this.$nextTick(() => {
      //   if (this.$refs.tree.getCheckedKeys(true) && this.$refs.tree.getCheckedKeys(true).length >= 25) {
      //     this.$refs.parentTree.style.width = '72%'
      //   } else {
      //     this.$refs.parentTree.style.width = '42%'
      //   }
      // })
      // this.gettableData()
      // this.getListData()
      this.timeChangepro()
    },

    // 需求手里部门结束
    collChange () {
      // getReqByOaId().then(res => {
      //   console.log(res)
      // })
      this.reqlists = []
      if (this.activeNameCollapse && this.activeName === 'first') {
        let senrows = {}
        let i = ''
        this.tableData.forEach((item, index) => {
          if (item.oa_id === this.activeNameCollapse) {
            senrows = item
            i = index
          }
        })
        if (senrows.redmine_num > 0) {
          this.reqinfoLoading = true
          getReqByOaId(senrows).then(res => {
            // console.log(res)
            this.reqinfoLoading = false
            this.reqlists = res.data.data
            this.reqlists.forEach(value => {
              let time = ''
              let name = ''
              if (value.tjys_date) {
                time = value.tjys_date.substr(0, 19)
                name = value.MEMBER_NAME
              }
              if (value.hasOwnProperty('msglist')) {
                value.msglist[3].time = time
                value.msglist[3].msg = time + ' ' + name + '提交验收'
              }
            })
          })
        }
      } else {
        this.reqlists = []
      }
    },
    goachievement (data) {
      // console.log(data)
      let branchArr = []
      this.$refs.tree.getCheckedNodes().forEach(item => {
        if (item.org_id) {
          branchArr.push(item.org_id)
        }
      })
      const row = {
        proname: data.name,
        isradio: this.radio
      }
      if (this.changeTime.length !== 0) {
        row.stime = this.changeTime[0]
        row.etime = this.changeTime[1]
      }
      row.branchArr = branchArr.join(',')
      this.$router.push({path: '/achievement', query: row})
    },
    eseeachievement (id) {
      // console.log(id)
      let row = {
        reqId: id,
        token: this.$cookie.get('token')
      }
      yuluan(row).then(response => {
        // console.log(response)
        this.formLabelAlign = response.data.data
        getQxNeedmeritsReview(row).then(res => {
          // console.log(res)
          if (this.formLabelAlign.realTime) {
            if (this.formLabelAlign.realTime < this.formLabelAlign.dueDate) {
              // 如期完成提交验收
              this.timeliness = '1'
            } else {
              // 延期提交验收
              this.timeliness = '2'
            }
          } else {
            const date = new Date()
            const YY = date.getFullYear()
            const MM = (date.getMonth() + 1).toString().padStart(2, 0)
            const DD = (date.getDate()).toString().padStart(2, 0)
            const HH = (date.getHours()).toString().padStart(2, 0)
            const mm = (date.getMinutes()).toString().padStart(2, 0)
            const ss = (date.getSeconds()).toString().padStart(2, 0)
            const time = `${YY}-${MM}-${DD} ${HH}:${mm}:${ss}`
            // this.formLabelAlign.realTime = time
            if (time < this.formLabelAlign.dueDate) {
              // 如期完成提交验收
              this.timeliness = '1'
            } else {
              // 延期提交验收
              this.timeliness = '2'
            }
          }
          if (res.data.data !== null) {
            this.sendInfo = res.data.data
            if (res.data.data.needPurpose) {
              this.need_purpose = this.sendInfo.needPurpose.split(',')
            }
          }
          const date = new Date()
          const YY = date.getFullYear()
          const MM = (date.getMonth() + 1).toString().padStart(2, 0)
          const DD = (date.getDate()).toString().padStart(2, 0)
          const HH = (date.getHours()).toString().padStart(2, 0)
          const mm = (date.getMinutes()).toString().padStart(2, 0)
          const ss = (date.getSeconds()).toString().padStart(2, 0)
          const time = `${YY}-${MM}-${DD} ${HH}:${mm}:${ss}`
          this.sendInfo.createTime = time
        })
      })
      this.achievementInfo = true
    },
    changeitem () {
      this.searchText = ''
      this.oaProname = this.forSecharName
      this.listQuery.checked = false
      this.listQuery.checkedno = false
      // 切换项目时触发
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      for (let i = 0; i < this.listQuery.project_ids.length; i++) {
        if (this.listQuery.project_ids[i] === '全部') {
          this.listQuery.project_ids = []
        }
      }
      var btnquarr = document.querySelectorAll('.c-btn')
      this.orderarr.forEach((val, i) => {
        this.listQuery.orderType = 'desc'
        btnquarr[i].querySelectorAll('i')[0].style.color = '#fff'
      })
      // this.listQuery.statusIds = []
      this.listQuery.orderFiled = 'isyq'
      this.listQuery.orderType = 'asc'
      this.collloading = true
      this.getallData()
    },
    timeChangepro () {
      this.collloading = true
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      // alert(1)
      this.getallData()
    },
    quickTime () {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      // console.log(this.radio)
      if (this.radio === 1) {
        this.getnowtime(30)
      } else if (this.radio === 3) {
        this.getnowtime(90)
      } else if (this.radio === 6) {
        this.getnowtime(182)
      } else if (this.radio === 0) {
        this.getnowtime('all')
        // this.getnowtime(1095)
      }
      this.timeChangepro()
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
        // this.$router.push({ name: 'NeedPort' })
        this.$router.push('/OaPort')
      }
    },
    changeboxgroup () {
      // console.log(this.checkList)
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      if (this.checkList.length === 2) {
        this.activeName = 'first'
        this.listQuery.tracker_ids = 'oa'
        this.ywflag = true
      } else if (this.checkList[0] === 'oa' && this.checkList.length === 1) {
        this.listQuery.tracker_ids = 'oa'
        this.ywflag = true
        this.activeName = 'first'
      } else if (this.checkList[0] === '2' && this.checkList.length === 1) {
        this.listQuery.tracker_ids = '2'
        this.ywflag = false
        this.activeName = 'second'
      } else if (this.checkList.length === 0) {
        this.listQuery.tracker_ids = 'oa'
        this.ywflag = true
        this.activeName = 'first'
      }
      // this.getordColor()
      var btnquarr = document.querySelectorAll('.c-btn')
      this.orderarr.forEach((val, i) => {
        this.listQuery.orderType = 'desc'
        btnquarr[i].querySelectorAll('i')[0].style.color = '#fff'
      })
      this.listQuery.orderType = 'asc'
      this.listQuery.orderFiled = 'isyq'
      this.collloading = true
      this.getListData()
      this.getechartsData()
    },
    orderdata (item, index) {
      if (item.type === 'desc') {
        item.type = 'asc'
      } else if (item.type === 'asc') {
        item.type = 'desc'
      }
      var btnquarr = document.querySelectorAll('.c-btn')
      var checkKey = document.querySelectorAll('.c-btn')[index]
      this.orderarr.forEach((val, i) => {
        if (index !== i) {
          this.listQuery.orderType = 'desc'
          btnquarr[i].querySelectorAll('i')[0].style.color = '#fff'
        }
      })
      // console.log(item)
      if (this.activeName === 'first' && item.id === 'project_id') {
        item.id = 'project_name'
      }
      if (item.id === 'status_id') {
        this.listQuery.orderFiled = 'need_id'
      } else {
        this.listQuery.orderFiled = item.id
      }
      // console.log(item)
      this.listQuery.orderType = item.type
      // var checkKey = document.querySelectorAll('.c-btn')[index]
      // console.log(checkKey.querySelectorAll('i')[0])
      checkKey.querySelectorAll('i')[0].style.color = '#4b78cd'
      this.renderName = item.name
      // console.log(checkKey)
      // console.log(item)
      // this.collloading = true
      // debugger
      this.getListData()
    },
    getechartsData () {
      let branchArr = []
      this.$refs.tree.getCheckedNodes().forEach(item => {
        if (item.org_fn) {
          branchArr.push(item.org_fn)
        }
      })
      const row = {
        project_ids: this.listQuery.project_ids.join(','),
        start_date: this.changeTime[0],
        end_date: this.changeTime[1],
        page: this.listQuery.page,
        tracker_ids: this.checkList.join(','),
        pageSize: this.listQuery.pageSize,
        token: this.$cookie.get('token'),
        acceptingGroups: branchArr.join(',')
      }
      // for (var i in this.titlog) {
      //   this.titlog[i] = 0
      // }
      // const trackrow = {
      //   project_ids: this.listQuery.project_ids.join(','),
      //   start_date: this.changeTime[0],
      //   end_date: this.changeTime[1],
      //   page: this.listQuery.page,
      //   pageSize: this.listQuery.pageSize,
      //   token: this.$cookie.get('token')
      // }
      this.fbData = []
      this.titlog.yqNum = 0
      this.titlog.reqNum = 0
      this.titlog.oaNum = 0
      this.titlog.avgDays = 0
      this.titlog.closeNum = 0
      this.titlog.stopNum = 0
      this.titlog.cswwcNum = 0
      this.titlog.realNum = 0
      this.titlog.expireDueDateSum = 0

      this.reqnum.oa_num = 0
      this.reqnum.need_num = 0
      this.reqnum.all_num = 0
      const tarckRow = {
        project_ids: this.listQuery.project_ids.join(','),
        start_date: this.changeTime[0],
        end_date: this.changeTime[1],
        token: this.$cookie.get('token'),
        acceptingGroups: branchArr.join(',')
      }
      getDataByTrackerId(tarckRow).then(res => {
        // console.log(res)
        this.reqnum.oa_num = res.data.oa_num
        this.reqnum.need_num = res.data.need_num
        this.reqnum.all_num = res.data.all_num
      })
      getProjectReqEcharts(row).then(res => {
        this.demandflag = false
        // console.log(res)
        let obj = {
          closelist: [],
          name: []
        }
        var arr = []
        if (this.listQuery.project_ids.length > 0) {
          for (let j = 0; j < this.listQuery.project_ids.length; j++) {
            for (let i = 0; i < this.oaProname.length; i++) {
              if (this.oaProname[i] === this.listQuery.project_ids[j]) {
                var obj1 = {
                  id: this.oaProname[i],
                  name: this.oaProname[i]
                }
                arr.push(obj1)
                // console.log('222')
                // console.log(this.listQuery.project_ids)
                // console.log(this.oaProname)
              }
            }
          }
        } else {
          for (let i = 0; i < this.oaProname.length; i++) {
            var obj2 = {
              id: this.oaProname[i],
              name: this.oaProname[i]
            }
            arr.push(obj2)
          }
          // console.log('111')
        }
        // console.log(arr)
        // console.log(this.oaProname)
        if (res.data.result === 'success') {
          this.titlog.yqNum = res.data.yqNum
          this.titlog.reqNum = res.data.reqNum
          this.titlog.oaNum = res.data.oaNum
          this.titlog.avgDays = res.data.avgDays
          this.titlog.cswwcNum = res.data.cswwcNum
          this.titlog.stopNum = res.data.stopNum
          this.titlog.closeNum = res.data.closeNum
          this.titlog.realNum = res.data.realNum
          this.titlog.expireDueDateSum = res.data.expireDueDateSum
          this.fbData = res.data.data
          // console.log(this.fbData)
          // this.totlog
          res.data.data.forEach(item => {
            obj.closelist.push(item.close_num)
            obj.name.push(item.name)
          })
          arr.forEach((item, index) => {
            item.boo = false
            this.fbData.forEach((value, i) => {
              if (item.name === value.name) {
                item.boo = true
              }
            })
          })
          arr.forEach(item => {
            if (item.boo !== true && item.name !== '全部') {
              this.fbData.push({ name: item.name, all_num: 0, close_num: 0, kf_num: 0, new_num: 0, cs_num: 0, dsx_num: 0, yq_num: 0, real_num: 0, oajs_num: 0, hg_num: 0, expire_due_date: 0 })
              obj.closelist.push(0)
              obj.name.push(item.name)
            }
          })
        } else {
          // console.log(arr)
          arr.forEach(item => {
            if (item.name !== '全部') {
              this.fbData.push({ name: item.name, all_num: 0, close_num: 0, kf_num: 0, new_num: 0, cs_num: 0, dsx_num: 0, yq_num: 0, real_num: 0, oajs_num: 0, hg_num: 0, expire_due_date: 0 })
            }
          })
        }
        // console.log(this.fbData)
        // if (obj.name.length > 15) {
        //   obj.closelist = obj.closelist.slice(0, 15)
        //   obj.name = obj.name.slice(0, 15)
        // }
      })
      getEchartsByBranch(row).then(res => {
        // console.log(res)
        // setTimeout(() => {
        this.rightechartsflag = false
        // }, 1000)
        var fqobj = {
          name: [],
          number: []
        }
        var slobj = {
          name: [],
          number: []
        }
        if (res.data.result === 'success') {
          fqobj.name = res.data.jbnamelist
          fqobj.close = res.data.jbclosenumlist
          fqobj.unclose = res.data.jbunclosenumlist
          slobj.name = res.data.slnamelist
          slobj.close = res.data.slclosenumlist
          slobj.unclose = res.data.slunclosenumlist
        }
        this.echartsacceptanceItem('acceptance', slobj)
        this.echartsacceptanceItem('launch', fqobj)
      })
    },
    getallData () {
      this.changeboxgroup()
    },
    getListDataRed (val) {
      if (val === '1') {
        this.listQuery.checkedno = false
      }
      if (val === '0') {
        this.listQuery.checked = false
      }
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.getListData()
    },
    getListData () {
      var traId = ''
      let wglRedmine = ''
      let branchArr = []
      if (this.activeName === 'first') {
        traId = 'oa'
        this.$refs.tree.getCheckedNodes().forEach(item => {
          if (item.org_fn) {
            branchArr.push(item.org_fn)
          }
        })
        if (this.listQuery.checked === true) {
          wglRedmine = 'yes'
        } else if (this.listQuery.checkedno === true) {
          wglRedmine = 'no'
        }
      } else {
        traId = '2'
      }
      var row = {}
      row = {
        project_ids: this.listQuery.project_ids.join(','),
        start_date: this.changeTime[0],
        end_date: this.changeTime[1],
        tracker_ids: traId,
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        token: this.$cookie.get('token'),
        orderType: this.listQuery.orderType,
        orderFiled: this.listQuery.orderFiled,
        isnotredmine: wglRedmine,
        acceptingGroups: branchArr.join(',')
      }
      this.collloading = true
      getReqKbList(row).then(res => {
        this.collloading = false
        this.total = res.data.total
        this.tableData = res.data.rows
        if (this.tableData.length > 0) {
          this.tableData.forEach(item => {
            if (item.hasOwnProperty('reqlists')) {
              item.reqlists.forEach(value => {
                let time = ''
                let name = ''
                if (value.tjys_date) {
                  time = value.tjys_date.substr(0, 19)
                  name = value.MEMBER_NAME
                }
                if (value.hasOwnProperty('msglist')) {
                  value.msglist[3].time = time
                  value.msglist[3].msg = time + ' ' + name + '提交验收'
                }
              })
            }
          })
        }
      })
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      this.collloading = true
      this.getListData()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.collloading = true
      this.getListData()
    },
    handleClick (val) {
      // debugger
      this.listQuery.checked = false
      this.listQuery.checkedno = false
      var btnquarr = document.querySelectorAll('.c-btn')
      this.orderarr.forEach((val, i) => {
        btnquarr[i].querySelectorAll('i')[0].style.color = '#fff'
        this.orderarr[i].type = 'desc'
      })
      this.listQuery.orderFiled = 'isyq'
      this.listQuery.orderType = 'desc'
      this.listQuery.pageSize = 10
      this.listQuery.page = 1
      this.collloading = true
      this.getListData()
      // console.log(val)
      // this.getallData()
    },
    goRedmine (row) {
      window.open('http://192.25.97.80/redmine/issues/' + row)
    },
    // 获取所有的项目对应的名称
    getproject () {
      this.listLoading = true
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId
          }
        //   this.userId = data.user.userId
          getProjectByUser(row).then(res => {
            // console.log(res)
            if (res.data.result === 'success') {
              this.projectOptions = res.data.list
              this.projectOptions.unshift({
                id: '',
                name: '全部'
              })
              this.projectOptionsAll = [...res.data.list]
              this.getallData()
            } else {
              // this.demandflag = true
              // this.collloading = true
              // this.$message({ title: '失败', message: res.data.result, type: 'error', duration: 5000, center: true })
              // this.$router.push('/concateErr')
              this.noproFlag = true
            }
          })
        }
      })
      const grow = {
        token: this.$cookie.get('token')
      }
      getOaProjects(grow).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          // res.data.data = res.data.data.unshift('全部')
          // console.log(res)
          res.data.data.unshift('全部')
          this.oaProname = res.data.data
          this.forSecharName = [...res.data.data]
        }
      })
    },
    useridgetname (id) {
      var name = ''
      this.projectOptionsAll.forEach(item => {
        if (Number(id) === Number(item.id)) {
          name = item.name
        }
      })
      return name
    },
    usenamegetId (name) {
      var id = ''
      this.projectOptionsAll.forEach(item => {
        if (Number(name) === Number(item.name)) {
          id = item.id
        }
      })
      return id
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
    },
    goisyqPage (status, itenname, planTime) {
      let branchArr = []
      this.$refs.tree.getCheckedNodes().forEach(item => {
        if (item.org_id) {
          branchArr.push(item.org_id)
        }
      })
      // sessionStorage.setItem('pro', this.listQuery.project_ids.join(','))
      var id = ''
      if (itenname) {
        // this.projectOptionsAll.forEach(item => {
        //   if (itenname === item.name) {
        //     id = item.id
        //     // console.log(111)
        //   }
        // })
        id = itenname
      } else {
        id = this.listQuery.project_ids.join(',')
      }
      var statusName = ''
      var isyq = ''
      var row = {}
      if (status === 'stop') {
        row = {
          stime: this.changeTime[0],
          etime: this.changeTime[1],
          avtiveName: this.activeName,
          proid: id,
          stop: 23,
          radio: this.radio,
          project_id: this.listQuery.project_ids,
          listName: '暂停需求列表',
          tracker_ids: this.checkList.join(',')
        }
      } else if (status === 'cswwc') {
        statusName = status
        row = {
          stime: this.changeTime[0],
          etime: this.changeTime[1],
          avtiveName: this.activeName,
          proid: id,
          radio: this.radio,
          cswwc: 'cswwc',
          project_id: this.listQuery.project_ids,
          listName: '90天未关闭需求列表',
          tracker_ids: this.checkList.join(',')
        }
      } else if (status === 'yq') {
        isyq = 'yq'
        row = {
          stime: this.changeTime[0],
          etime: this.changeTime[1],
          avtiveName: this.activeName,
          proid: id,
          isyq: isyq,
          radio: this.radio,
          project_id: this.listQuery.project_ids,
          listName: '延期需求列表',
          tracker_ids: this.checkList.join(',')
        }
      } else {
        statusName = status
        row = {
          stime: this.changeTime[0],
          etime: this.changeTime[1],
          avtiveName: this.activeName,
          proid: id,
          radio: this.radio,
          Prostauts: statusName,
          project_id: this.listQuery.project_ids,
          listName: '需求列表',
          tracker_ids: this.checkList.join(',')
        }
      }
      if (planTime === 'planTime') {
        row.planTime = 'yes'
      }
      row.isradio = this.radio
      row.branchArr = branchArr.join(',')
      this.$router.push({path: '/OaisyqPort', query: row})
    },
    // getallstatus () {
    //   listByMap().then(res => {
    //     this.allstatus = res.data.rows
    //     // console.log(this.allstatus)
    //     this.allstatus.forEach(item => {
    //       if (item.needsStatus !== '已关闭') {
    //         this.clstatusarr.push(item.needsStatus)
    //       } else {
    //         this.gbarr.push(item.needsStatus)
    //       }
    //     })
    //     console.log(this.gbarr)
    //     // console.log(this.allstatus)
    //     this.listQuery.statusIds = this.clstatusarr
    //     if (this.$route.query.avtiveName === 'second') {
    //       this.listQuery.statusIds = this.gbarr
    //     }
    //     this.getallData()
    //   })
    // },
    echartsdemandItem (id, obj) {
      // console.log(obj)
      document.getElementById(id).style.width = window.innerWidth * 0.7 + 'px'
      if (window.innerWidth < 1500) {
        document.getElementById(id).style.width = 1120 + 'px'
      }
      this.myChartdemand = echarts.init(document.getElementById(id))
      this.myChartdemand.resize()
      this.myChartdemand.setOption({
        // legend: {
        //   x: 'center',
        //   data: ['已完成需求数'],
        //   selected: {
        //     '业务需求': false
        //   }
        // },
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
          }
        },
        xAxis: [
          {
            type: 'category',
            data: obj.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                if (value === 'SmartTrader / SmartUI') {
                  return value.split('/')[0] + '\n' + value.split('/')[1]
                }
                if (value.length > 4) {
                  return value.substring(0, 4) + '\n' + value.substring(4, 8) + '\n' + value.substring(8) + '\n'
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
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: '已完成需求数',
            type: 'bar',
            barGap: 0,
            itemStyle: {
              normal: {
                color: '#4b78cd',
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            barMaxWidth: 25,
            cursor: 'pointer',
            data: obj.closelist
          }
        ]
      }, true)
    },
    echartsacceptanceItem (id, data) {
      this.myChartsaccept = echarts.init(document.getElementById(id))
      this.myChartsaccept.resize()
      this.myChartsaccept.setOption({
        grid: {
          top: '15%',
          left: '2%',
          right: '2%',
          bottom: '5%',
          containLabel: true
        },
        legend: {
          x: 'center',
          data: ['OA流程结束数', '未关闭需求数']
        },
        tooltip: {
          trigger: 'axis',
          cursor: 'pointer',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              // color: 'red'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: data.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                if (value.length > 5) {
                  let len = value.length
                  var nn = parseInt(len / 5)
                  var str = ''
                  for (let i = 0; i < nn; i++) {
                    str = str + value.substring(i * 5, i * 5 + 5) + '\n'
                  }
                  str = str + value.substring(nn * 5)
                  return str
                } else {
                  return value
                }
              },
              fontSize: 10,
              align: 'center'
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
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            },
            minInterval: 1
          }
        ],
        series: [
          {
            name: 'OA流程结束数',
            type: 'bar',
            barGap: 0,
            stack: '需求情况',
            itemStyle: {
              normal: {
                color: '#4b78cd',
                label: {
                  formatter: function (params) {
                    if (params.value > 0) {
                      return params.value
                    } else {
                      return ' '
                    }
                  },
                  show: true,
                  position: 'inside'
                }
              }
            },
            // areaStyle: {
            //   normal: {color: qucolor} // 改变区域颜色
            // },
            barMaxWidth: 25,
            cursor: 'pointer',
            data: data.close
          }, {
            name: '未关闭需求数',
            type: 'bar',
            stack: '需求情况',
            barGap: 0,
            itemStyle: {
              normal: {
                color: 'rgba(100,167,231, 0.8)',
                label: {
                  formatter: function (params) {
                    // console.log(params)
                    if (params.value > 0) {
                      return params.value
                    } else {
                      return ' '
                    }
                  },
                  show: true,
                  position: 'inside'
                }
              }
            },
            // areaStyle: {
            //   normal: {color: qucolor} // 改变区域颜色
            // },
            barMaxWidth: 25,
            cursor: 'pointer',
            data: data.unclose
          }
        ]
      }, true)
    },
    getnowtime (days) {
      const end = new Date()
      const start = new Date()
      if (days === 'all') {
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        var sall = this.getTimeByDate(start)
        var eall = this.getTimeByDate(end)
        this.defaultTime = [sall, eall]
        // console.log(this.defaultTime)
        // this.defaultTime = [new Date(sall), new Date(eall)]
        // this.$set(this.changeTime, 0, '')
        // this.$set(this.changeTime, 1, '')
        this.changeTime = []
      } else {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
        var s = this.getTimeByDate(start)
        var e = this.getTimeByDate(end)
        this.defaultTime = [s, e]
        // console.log(this.defaultTime)
        this.$set(this.changeTime, 0, s)
        this.$set(this.changeTime, 1, e)
      }
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      // const HH = (date.getHours()).toString().padStart(2, 0)
      // const time = `${YY}-${MM}-${DD} ${HH}:00:00`
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    getUserOptions () {
      const row = {
        project_id: ''
      }
      getuserdict(row).then(res => {
        this.userOptions = res.data.data
        // console.log(this.userOptions) // 对应的人员id 和对应的人员text名字
      })
    },
    getusername (id) {
      var username = ''
      this.userOptions.forEach(item => {
        if (Number(item.id) === Number(id)) {
          username = item.text
        }
      })
      return username
    }
  }
  // watch: {
  //   changeTime: function (val) {
  //     console.log(val)
  //     this.changeTime[0] = val[0]
  //     this.changeTime[1] = val[1]
  //     this.$set(this.changeTime, 0, val[0])
  //     this.$set(this.changeTime, 1, val[1])
  //   }
  // }
}
</script>

<style lang="scss" scoped>
    .needport{
      // margin-top: 44px;
        background-color: #fff;
        .rightIe{
          padding-right: 27px;
          // -ms-padding-right:40px;
        }
        .titbox{
            // display: inline-block;
            // width: 180px;
            flex: 1;
            height: 70px;
            border-radius: 5px;
            margin-right: 15px;
            float: left;
            padding: 6px 8px 0 8px;
          &:nth-last-of-type(1){
            margin: 0;
          }
        }
        .nedbox{
          margin-right: 0px;
        }
        .rightbox{
            display: flex;
            // flex-flow: column;
            // justify-content: space-between;
            // flex: 1;
            height: 200px;
            width: 100%;
            .launch{
              flex: 1;
              margin-right:15px;
            }
            .acceptance{
              flex: 1;
            }
        }
        .ssbox{
          height: 50px;
          p{
            margin: 0;
            padding: 0;
            height: 24px;
            line-height: 24px;
          }
        }
        .btnflexbox{
          // width: 1050px;
          flex: 1;
          // font-size: 14px;
          display: flex;
          flex-flow: wrap;
          .c-btn,.c-btnlast{
          display: flex;
          background-color: rgba(242, 242, 242, 1);
          border: none;
          // border: 1px solid #ccc;
          margin-left:15px;
          margin-top:15px;
          height: 30px;
          line-height: 30px;
          padding: 0 5px;
          border-radius: 2px;
          color: #333;
          min-width: 90px;
          justify-content: center;
          i{
            color: #fff;
          }
          }
        }
        .titleslide{
          flex: 1;
        //   margin-right:20px;
          // margin: 0 10px;
          line-height: 30px;
          text-align: center;
          // justify-content: center;
          // align-items: center;
          
        }
        #demand{
          overflow-y: auto;
        }
        .itemcontent{
          display: flex;
          align-items: center;
          height: 35px;
          margin-top: 10px;
          // padding: 10px 0;
          transition: all 0.5s ease;
          &:hover{
            background-color: rgba(233, 233, 233, 0.7);
            box-shadow: 13px 5px 10px rgb(192, 192, 192);
            height: 95px;
            transition: all 0.5s ease;
          }
          &:hover .rightcontent .showslidebox{
            height: 45px;
            transition: all 0.5s ease;
          }
          .leftcontent{
            // line-height: 35px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            // align-items: center;
          }
          .rightcontent{
            height: 35px;
            display: flex;
            flex:1;
            .showslidebox{
              border-radius: 3px;
              flex:1;
            //   margin-right:20px;
              margin:0 10px;
              text-align: center;
              line-height: 35px;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 35px;
              color: #FFF;
              transition: all 0.5s ease;
            }
          }
        }
    }
</style>

<style lang="scss">
.needport{
    .el-tabs__nav-wrap:after{
        background-color: #fff !important;
    }
    .el-tabs__item.is-active{
        border-bottom: none;
        background-color: #4B78CD;
    }
    .el-tabs__item:hover{
      color: #3e3e3e;
    }
    .el-checkbox{
        background-color:rgba(204, 204, 204, 1) !important;
        transition: all 0.3s ;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        padding: 0 15px 0 5px;
        .el-checkbox__inner{
            background-color: rgba(204, 204, 204, 1);
            border: none;
            transition: none;
        }
    }
    .el-tabs--top.el-tabs--card .el-tabs__item:nth-child(2){
      padding: 0px !important;
      margin:0 !important;
    }
    .el-tabs--top.el-tabs--card .el-tabs__item:last-child{
      padding: 0 !important;
    }
    .el-tabs__item.is-active{
      color: #FFF;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
        background-color: #4B78CD;
        border: transparent;
    }
    .is-checked {
        background-color: #4B78CD !important;
        // transition: all 0.3s;
        transition: none;
    }
    .quickchangeTime .is-checked {
        background-color: #fff !important;
    }
    .el-checkbox__label{
        color: #fff;
    }
    .el-checkbox__input.is-checked+.el-checkbox__label{
        color: #fff;
    }
    .el-collapse-item__header{
      height: 110px;
      line-height: 40px;
      flex-flow: wrap;
      position: relative;
    }
    .el-icon-arrow-right{
      position: absolute;
      top: 20px;
      right: -10px;
    }
    // .el-collapse-item,.is-active{
    //   height: 247px;
    // }
    // .el-step.is-center .el-step__head, .el-step.is-center .el-step__main{
    //   margin-top: 15px;
    // }
    // .is-finish{
    //   // background-color: red;
    //   // color: red;
    // }
    // .el-step__head.is-finish{
    //   color:#4B78cd;
    //   border-color: #4B78CD;
    // }
    .el-step__icon,.is-text{
      height: 40px;
      width: 40px;
    }
    .is-text{
      border-color: #4B78CD;
      background-color: #4B78CD;
    }
    .el-step__icon-inner{
      color: #fff;
    }
    .el-steps{
      z-index: 0 !important;
    //   height: 60px;
    //   overflow: hidden;
    }


$border-sizes: 3px;
$background_color: #C0C4CC;
$el-step-icon-height: 40px;
$el-step-icon-width: 40px;
$el-step-icon-font-size: 24px;
$el-step-icon-background: #FFF;
$el-step-icon-margin: 10px;
$is-finish-background: #4b78cd;
$el-step_title_is-process: #666666;
$el-step__description_is-finish: #999999;
/*---------步骤条样式---end------*/
  .text-color {
    color: white;
  }

  /*步骤条样式修改------------start----------*/
  /*is-finish 圆圈颜色*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__head.is-finish {
    color: $is-finish-background !important;
    border-color: $is-finish-background !important;
    -ms-color: $is-finish-background !important;
    -ms-border-color: $is-finish-background !important;
    // background-color: $is-finish-background !important;
  }

  // 第一步的连线样式
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center:nth-of-type(1)  .el-step__head {
    color: $background_color !important;
  }

  // .el-steps.el-steps--horizontal  .el-step.overitemsev.is-horizontal.is-center:nth-of-type(7)  .el-step__head.is-wait {
  //   color: $is-finish-background !important;
  // }
  .el-steps.el-steps--horizontal  .el-step.overitemsev.is-horizontal.is-center:nth-of-type(7)  .el-step__head.is-wait  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width;
    height: $el-step-icon-height;
    font-size: $el-step-icon-font-size;
    border: $border-sizes solid;
    background: $is-finish-background !important;
  }
  // .el-steps.el-steps--horizontal  .el-step.overitemsev.is-horizontal.is-center:nth-of-type(7)  .el-step__head.is-process {
  //   color: $is-finish-background !important;
  // }
  // .el-steps.el-steps--horizontal  .el-step.overitemsev.is-horizontal.is-center:nth-of-type(7)  .el-step__head.is-finish {
  //   color: $is-finish-background !important;
  // }
  .el-steps.el-steps--horizontal  .el-step.overitemsev.is-horizontal.is-center:nth-of-type(7)  .el-step__head.is-process .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width;
    height: $el-step-icon-height;
    // width: 46px !important;
    // width: 46px !important;
    font-size: $el-step-icon-font-size;
    border: $border-sizes solid;
    border-color: #4B78CD;
    background: $is-finish-background !important;
  }

  // .el-steps.el-steps--horizontal  .el-step.overitem.is-horizontal.is-center:nth-of-type(8)  .el-step__head.is-wait {
  //   color: $is-finish-background !important;
  // }
  .el-steps.el-steps--horizontal  .el-step.overitem.is-horizontal.is-center:nth-of-type(8)  .el-step__head.is-wait  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width;
    height: $el-step-icon-height;
    font-size: $el-step-icon-font-size;
    border: $border-sizes solid;
    background: $is-finish-background !important;
  }
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center:nth-of-type(6)  .el-step__head.is-finish {
    color: $background_color !important;
  }
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center:nth-of-type(6)  .el-step__head.is-finish  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width;
    height: $el-step-icon-height;
    font-size: $el-step-icon-font-size;
    border: $border-sizes solid;
    background: $background_color !important;
  }
  // .el-steps.el-steps--horizontal  .el-step.overitem.is-horizontal.is-center:nth-of-type(6)  .el-step__head.is-finish {
  //   color: $is-finish-background !important;
  // }
  .el-steps.el-steps--horizontal  .el-step.overitem.is-horizontal.is-center:nth-of-type(6)  .el-step__head.is-finish  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width;
    height: $el-step-icon-height;
    font-size: $el-step-icon-font-size;
    border: $border-sizes solid;
    background: $is-finish-background !important;
  }
  // .el-steps.el-steps--horizontal  .el-step.overitem.is-horizontal.is-center:nth-of-type(6)  .el-step__head.is-wait {
  //   color: $is-finish-background !important;
  // }
  .el-steps.el-steps--horizontal  .el-step.overitem.is-horizontal.is-center:nth-of-type(6)  .el-step__head.is-wait  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width;
    height: $el-step-icon-height;
    font-size: $el-step-icon-font-size;
    border: $border-sizes solid;
    background: $is-finish-background !important;
  }
  // .el-steps.el-steps--horizontal  .el-step.overitem.is-horizontal.is-center:nth-of-type(6)  .el-step__head.is-process {
  //   color: $is-finish-background !important;
  // }
  .el-steps.el-steps--horizontal  .el-step.overitem.is-horizontal.is-center:nth-of-type(6)  .el-step__head.is-process  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width;
    height: $el-step-icon-height;
    font-size: $el-step-icon-font-size;
    border: $border-sizes solid;
    background: $is-finish-background !important;
  }
  .el-steps.el-steps--horizontal  .el-step.oaitem.is-horizontal.is-center:nth-of-type(1)  .el-step__head.is-finish {
    color: $is-finish-background !important;
    border-color: $is-finish-background !important;
  }
  .el-steps.el-steps--horizontal  .el-step.oaitem.is-horizontal.is-center:nth-of-type(1)  .el-step__head.is-finish {
    color: $is-finish-background !important;
  }
  .el-steps.el-steps--horizontal  .el-step.oaitem.is-horizontal.is-center:nth-of-type(1)  .el-step__head.is-finish  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width;
    height: $el-step-icon-height;
    font-size: $el-step-icon-font-size;
    border: $border-sizes solid;
    background: $is-finish-background !important;
  }
  

  /*is-process 圆圈颜色*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__head.is-process {
    color: $background_color;
    border-color: $background_color;
    -ms-color: $background_color;
    -ms-border-color: $background_color;
  }

  /*is-wait 圆圈颜色*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__head.is-wait {
    color: $background_color;
    border-color: $background_color;
    -ms-color: $background_color;
    -ms-border-color: $background_color;
  }

  /*is-finish title 颜色*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__title.is-finish {
    color: $el-step_title_is-process !important;
    font-weight: 700;
    -ms-color: $el-step_title_is-process !important;
    -ms-font-weight: 700;
  }
   /*is-process  title 颜色*/
  .el-steps.el-steps--horizontal[data-v-9ebad220] .el-step.is-horizontal.is-center  .el-step__title.is-process {
    font-weight: 700;
    color:$el-step_title_is-process !important;
    -ms-font-weight: 700;
    -ms-color:$el-step_title_is-process !important;
  }
  /*description 颜色*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__description.is-finish {
    color: $el-step__description_is-finish !important;
    -ms-color: $el-step__description_is-finish !important;
  }
   /* is-finish line连线粗细*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__head.is-finish  .el-step__line {
    // position: absolute;
    // border-color: inherit;
    // background-color:red;
    margin-top: $el-step-icon-margin;
    -ms-margin-top: $el-step-icon-margin;
    // border: $border-sizes solid;
    // color: pink !important;
  }

  /* is-process line连线粗细*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__head.is-process  .el-step__line {
    // border-color: inherit;
    background-color: $background_color;
    margin-top: $el-step-icon-margin;
    -ms-background-color: $background_color;
    -ms-margin-top: $el-step-icon-margin;
    // border: $border-sizes solid;
  }

  /* is-wait line连线粗细*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__head.is-wait  .el-step__line {
    // border-color: inherit;
    // background-color: $background_color;
    margin-top: $el-step-icon-margin;
    -ms-margin-top: $el-step-icon-margin;
    // border: $border-sizes solid;
  }
  /* 已完成 圆圈大小修改*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__head.is-finish  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width !important;
    height: $el-step-icon-height !important;
    font-size: $el-step-icon-font-size;
    border: $border-sizes solid !important;
    background: $is-finish-background !important;
    // background: $is-finish-background !important;
    -ms-z-index: 0;
    -ms-width: $el-step-icon-width !important;
    -ms-height: $el-step-icon-height !important;
    -ms-font-size: $el-step-icon-font-size;
    -ms-border: $border-sizes solid !important;
    -ms-background: $is-finish-background !important;
  }

  // 第一步 圆圈的背景样式
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center:nth-of-type(1)  .el-step__head.is-finish  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width;
    height: $el-step-icon-height;
    font-size: $el-step-icon-font-size;
    border: $border-sizes solid;
    background: $background_color !important;
    -ms-z-index: 0;
    -ms-width: $el-step-icon-width;
    -ms-height: $el-step-icon-height;
    -ms-font-size: $el-step-icon-font-size;
    -ms-border: $border-sizes solid;
    -ms-background: $background_color !important;
  }

  /* 过度点 圆圈大小修改*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__head.is-process  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width;
    height: $el-step-icon-height;
    border: $border-sizes solid;
    font-size: $el-step-icon-font-size;
    background:$background_color;
    color: $is-finish-background !important;
    border-color: $background_color !important;
    -ms-z-index: 0;
    -ms-width: $el-step-icon-width;
    -ms-height: $el-step-icon-height;
    -ms-border: $border-sizes solid;
    -ms-font-size: $el-step-icon-font-size;
    -ms-background:$background_color;
    -ms-color: $is-finish-background !important;
    -ms-border-color: $background_color !important;
  }

  /* 未完成 圆圈大小修改*/
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center  .el-step__head.is-wait  .el-step__icon {
    z-index: 0;
    width: $el-step-icon-width !important;
    height: $el-step-icon-height !important;
    font-size: $el-step-icon-font-size !important;
    border: $border-sizes solid !important;
    background:$background_color !important;
    -ms-z-index: 0;
    -ms-width: $el-step-icon-width !important;
    -ms-height: $el-step-icon-height !important;
    -ms-font-size: $el-step-icon-font-size !important;
    -ms-border: $border-sizes solid !important;
    -ms-background:$background_color !important;
  }
  .el-tabs__item {
    width: 100px !important;
  }
  .el-checkbox+.el-checkbox{
    margin-left: 0px;
    margin-top: 10px;
  }
  #tab-second{
    // margin-left: 15px;
  }
  #demand::-webkit-scrollbar {
    display: block
  }
 .el-message,.el-message--error{
   z-index: 9999 !important;
   
  }

}


  .el-steps,.el-steps--horizontal{
    z-index: 0 !important;
  }
  .el-step,.is-horizontal,.is-center{
    z-index: 0 !important;
  }
  .el-message,.el-message--error,.is-center{
   z-index: 9999 !important;
  }
  .el-scrollbar__wrap{
    overflow: auto !important;
  }
  .el-scrollbar__thumb{
    background-color: transparent !important;
  }
  .el-tooltip__popper{
    z-index: 9999 !important;
  }
  .el-step,.overitemsev,.is-horizontal,.is-center .el-step__head .el-step__line{
    color:red;
  }
</style>
<style lang="scss" scoped>
  .errbox{
    width: 100%;
    height:300px;
    text-align: center;
  }
</style>
<style>
  .el-tooltip__popper{
    z-index: 9999 !important;
  }
  .el-tabs--card>.el-tabs__header .el-tabs__item{
    transition: color 0s;
  }
  .onmouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
  .mouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
  .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .needport .el-collapse-item__content{
    padding-bottom: 0px !important;
  }
  .needport .el-checkbox{
    transition: all 0s !important;
  }
  .needport .el-collapse-item__header{
    cursor:auto
  }
  /* .needport .el-checkbox__input.is-checked + .el-checkbox__label{
    font-size:12px;
  } */
  .needport .el-pagination{
    padding: none !important;
  }
</style>

<style lang="scss" scoped>
.el-select .el-tag__close.el-icon-close{
  right: -3px;
}

  .len1{
    left: -150px !important;
  }
  .len2{
    left: -115px !important;
  }
  .len5{
    left: -55px !important;
  }
  .len4{
    left: -65px !important;
  }
  .len3{
    left: -90px !important;
  }
  .len6{
    left: -45px !important;
  }
  .len7{
    left: -40px !important;
  }
  // .oazeno{
  //   left: -145px !important;
  // }
  .oathree{
    left: -75px !important;
  }
  .oafour{
    left: -55px !important;
  }
  .oafive{
    left: -55px !important;
  }
  .bform{
    width: 80%;
    margin: auto;
  }
</style>

<style lang="scss" scoped>
  @media screen and (max-width: 1280px) {
        // .oazeno{
        //   left: -115px !important;
        // }
        .bform{
          width: 90%;
        }
        .oathree{
          left: -60px !important;
        }
        .oafour{
          left: -40px !important;
        }
        .oafive{
          left: -40px !important;
        }
        .len1{
          left: -115px !important;
        }
        .len2{
          left: -90px !important;
        }
        .len3{
          left: -70px !important;
        }
        .len4{
          left: -50px !important;
        }
        .len5{
          left: -40px !important;
        }
        .len6{
          left: -35px !important;
        }
        .len7{
          left: -30px !important;
        }
      }
</style>

<style lang="scss">
.preview .el-radio{
    display: block;
    margin-top:15px;
}
    .preview .el-radio+.el-radio{
        margin-left:0 !important;
    }
    .tetare .el-form-item__label{
        line-height: 25px;
    }
    .preview .el-form-item{
        margin-bottom: 15px;
    }
    .preview .is-checked{
      background-color: transparent !important;
    }
    .preview{
      .el-checkbox{
        background-color: transparent !important;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label{
        color: #409eff;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner{
        background-color: #409eff;
      }
      .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
        color: #fff;
      }
      .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
        border-color: #fff;
      }
      .el-checkbox .el-checkbox__inner{
        background-color: transparent;
        border: 1px solid #ccc;
      }
    }
    .diao .el-dialog__body{
        padding: 0 0 10px 0;
      }
      .diao .el-dialog__header{
        padding: 10px;
      }
      .preview .el-form-item{
        margin-bottom: 10px;
      }
      .el-dialog{
        margin: 0 auto 0;
      }
      .needport .el-dialog__wrapper{
        z-index: 20001 !important;
      }
  
</style>
<style scoped>
  
    .selectThing >>> .is-checked .el-checkbox__label{
      color:#fff;
    }
    .selectThing >>> .el-checkbox__label{
      color:#000;
    }
    .selectThing >>> .el-checkbox .el-checkbox__inner {
      background-color: #f2f2f2;
    }
    .selectThing >>> .el-checkbox{
      background-color: #f2f2f2 !important;
    }
    .selectThing >>> .is-checked{
      background-color: #4b78cd !important;
    }
    .selectThing >>> .is-checked .is-checked .el-checkbox__inner{
      background-color: #4b78cd !important;
    }
    .tipSty >>> .el-checkbox__label{
      padding-left: 5px;
    }
</style>

<style>
  .el-table::before{
    height: 0px !important;
  }
  .oaaddsty .el-select-dropdown__item{
    padding: 0 0;
    height: auto !important;
  }
  .oaaddsty .el-scrollbar__wrap {
    padding: 0 10px;
  }
</style>