<template>
    <div class="needport">
        <el-row style="height:50px;line-height:50px;padding-left:15px;">
            <el-col :span="24">
                <div class="item">
                    <span style="margin-right:40px;">项目</span>
                    <el-select v-model="listQuery.project_ids" placeholder="全部" multiple style="width:60%;" @change="changeitem" popper-class='onmouthFix'>
                    <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                      <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                    </div>
                      <el-option
                        v-for="item in projectOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="9" style="margin-left:15px;height:50px;line-height:50px;margin-bottom:10px;">
                <div class="mouth" style="display:flex;width:100%">
                    <span style="margin-right:15px;">发起时间</span>
                    <el-date-picker
                      v-model="changeTime"
                      type="daterange"
                      align="right"
                      :picker-options="pickerOptions"
                      :default-time="['08:00:00', '08:00:00']"
                      value-format="yyyy-MM-dd"
                      :clearable="false"
                      :unlink-panels="true"
                      @change="timeChangepro" ref="timeSelect">
                    </el-date-picker>
                </div>
            </el-col>
            <el-col :span="8" style="line-height:50px;margin-left:15px;" class="quickchangeTime">
              <el-radio-group v-model="radio" @change="quickTime" style="background-color:#fff">
                <el-radio :label=1>近一月</el-radio>
                <el-radio :label=3>近三月</el-radio>
                <el-radio :label=6>近半年</el-radio>
                <el-radio :label=0>全部</el-radio>
              </el-radio-group>
            </el-col>
        </el-row>
        <!-- <div style="display:flex">
          <div style="margin-left:15px;height:50px;line-height:50px;margin-bottom:10px;">
            <div class="mouth" style="display:flex;">
                <span>发起时间</span>
                <el-date-picker
                  v-model="changeTime"
                  type="daterange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  :default-time="['08:00:00', '08:00:00']"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :unlink-panels="true"
                  @change="timeChangepro">
                </el-date-picker>
            </div>
          </div>
          <div style="line-height:50px;display:flex;" class="quickchangeTime">
            <el-radio-group v-model="radio" @change="quickTime" style="background-color:#fff">
              <el-radio :label="1">近一月</el-radio>
              <el-radio :label="3">近三月</el-radio>
              <el-radio :label="6">近半年</el-radio>
              <el-radio :label="0">全部</el-radio>
            </el-radio-group>
          </div>
        </div> -->
        <!-- <el-row style="height:50px;line-height:50px;padding-left:15px;">
            <el-col :span="14">
                <div class="item">
                    <span>状态</span>
                    <el-select
                      v-model="listQuery.statusIds"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      placeholder="请选择状态" 
                      style="width:90%;" @change="getpagedata">
                      <el-option
                        v-for="item in allstatus"
                        :key="item.needsStatus"
                        :label="item.needsStatus"
                        :value="item.needsStatus">
                      </el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row> -->

        
        <el-row>
            <el-col :span="24" style="over-flow:hidden;margin-bottom:15px;margin-left:15px;display:flex">
              <!-- 筛选条件oa   2 -->
              <!-- <el-col :span="2" style="margin-right:20px;">
                <el-checkbox-group v-model="checkList" fill='red' @change="changeboxgroup" >
                  <el-checkbox label="oa">业务需求<span style="display:inline-block;width:25px;">({{titlog.oaNum}})</span></el-checkbox>
                  <el-checkbox label="2">系统优化<span style="display:inline-block;width:25px;">({{titlog.reqNum}})</span></el-checkbox>
                </el-checkbox-group>
              </el-col> -->
                <div class="titbox" style="background-color:rgba(75, 120, 205, 1);cursor:pointer;" @click="goisyqPage('')">
                    <div>
                        <span style="color:#fff">需求总数</span>
                        <el-tooltip class="item" effect="dark" content="需求数量统计" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.reqNum + titlog.oaNum}}</div>
                </div>
                
                <div class="titbox" style="background-color:rgba(153, 153, 255, 1);cursor:pointer;" @click="goisyqPage('上线完成')">
                    <div>
                        <span style="color:#fff">上线完成</span>
                        <el-tooltip class="item" effect="dark" content="已上线的需求数量" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.closeNum}}</div>
                </div>

                
                <div class="titbox" style="background-color:rgba(245, 108, 108, 1);cursor:pointer" @click="goisyqPage('yq')">
                    <div>
                        <span style="color:#fff">延期需求</span>
                        <el-tooltip placement="bottom">
                          <div slot="content">超过预计上线日期<br>仍未上线的需求总数</div>
                          <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.yqNum}}</div>
                </div>

                <div class="titbox" style="background-color:rgba(255, 153, 0, 1);cursor:pointer;" @click="goisyqPage('cswwc', '')">
                    <div>
                        <span style="color:#fff">90天未关闭需求</span>
                        <el-tooltip class="item" effect="dark" content="创建超过90天仍未关闭的需求数量" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.cswwcNum}}</div>
                </div>
                <div class="titbox" style="background-color:rgba(139, 204, 240, 1);cursor:pointer;" @click="goisyqPage('stop')">
                    <div>
                        <span style="color:#fff">暂停需求</span>
                        <el-tooltip class="item" effect="dark" content="状态为“暂停”的需求数量" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.stopNum}}</div>
                </div>
                <div class="titbox" style="background-color:rgba(64, 158, 255, 1);cursor:pointer;" @click="goisyqPage('')">
                    <div>
                        <span style="color:#fff">需求平均完成时间</span>
                        <!-- <span style="color:#fff" v-else-if="activeName==='second'">统计完成的需求平均时间</span> -->
                        <!-- <el-tooltip class="item" effect="dark" content="需求平均完成时间是指需求从创建到需求上线所消耗的时间,取均值" placement="bottom">
                            <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip> -->
                        <el-tooltip placement="bottom">
                          <!-- <div slot="content" v-if="activeName==='first'">需求从创建到今天为止已经消耗的时间</div> -->
                          <div slot="content">需求从创建到需求上线所消耗的时间</div>
                          <i class="fa fa-question-circle" style="color:#fff;float:right"></i>
                        </el-tooltip>
                    </div>
                    <div style="heigth:40px;line-height:40px;color:#fff;font-size:30px;text-align:center">{{titlog.avgDays}}天</div>
                </div>
            </el-col>
        </el-row>

            
        <div style="height:450px;margin-bottom:15px;" class="echartsbox">
            <div style="border:1px solid #eee;height:100%;margin:0 15px;" class="leftbox" v-loading='demandflag'>
                <div class="demand">
                    <p style="margin:0;padding:13px 0 0 8px;font-weight:700;font-size:15px;">需求-项目分布</p>
                    <div class="solvereq">
                      <div class="itemhead" style="width:100%;display:flex;">
                        <div class="left" style="width:150px;height:30px;"></div>
                        <div class="rightIe" style="display:flex;flex:1;">
                            <div class="titleslide">需求总数</div>
                            <div class="titleslide">上线完成</div>
                            <div class="titleslide">OA评审中</div>
                            <div class="titleslide">需求中</div>
                            <div class="titleslide">开发中</div>
                            <div class="titleslide">测试中</div>
                            <div class="titleslide">待上线</div>
                            <div class="titleslide">延期</div>
                        </div>
                      </div>
                      <div id="demand" ref="demand" style="width:100%;height:370px;">
                        <div class="itemcontent" v-for="(item, index) in fbData" :key="index">
                          <div class="leftcontent" style="width:150px;height:35px;overflow:hidden" v-if="item.name">{{item.name}}</div>
                          <div class="leftcontent" style="width:150px;height:35px;overflow:hidden" v-else-if="item.project_id">{{getproName(item.project_id)}}</div>
                          <div class="rightcontent" style="padding-right:10px;">
                            <div class="showslidebox" style="background-color:#99f;cursor:pointer;" @click="goisyqPage('', item.name)">{{item.all_num}}</div>
                            <div class="showslidebox" style="background-color:#4b78cd;cursor:pointer;" @click="goisyqPage('上线完成', item.name)">{{item.close_num}}</div>
                            <div class="showslidebox" style="background-color:rgba(0, 86, 196, 0.6);cursor:pointer;" @click="goisyqPage('OA评审中', item.name)">0</div>
                            <div class="showslidebox" style="background-color:rgba(0, 86, 196, 0.4);" @click="goisyqPage('需求中', item.name)">{{item.new_num}}</div>
                            <div class="showslidebox" style="background-color:rgba(70, 150, 227, 0.5);cursor:pointer;" @click="goisyqPage('开发中', item.name)">{{item.kf_num}}</div>
                            <div class="showslidebox" style="background-color:rgba(100, 167, 232, 0.8);cursor:pointer;" @click="goisyqPage('测试中', item.name)">{{item.cs_num}}</div>
                            <div class="showslidebox" style="background-color:rgba(139, 204, 240, 1);cursor:pointer;" @click="goisyqPage('待上线', item.name)">{{item.dsx_num}}</div>
                            <div class="showslidebox" style="background-color:rgba(255, 102, 102,1);cursor:pointer;" @click="goisyqPage('yq', item.name)">{{item.yq_num}}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>

        
        <!-- <el-row>
          <el-col :span="24">
            <div class="rightbox" v-loading='rightechartsflag' ref="rightbox">
                <div class="launch" style="border:1px solid #eee;height:192px;">
                    <p style="margin:0;padding:13px 0 0 8px;font-weight:700;font-size:15px;">需求-发起部门分布</p>
                    <div id="launch" ref="launch" style="width:100%;height:160px;"></div>
                </div>
                <div class="acceptance" style="border:1px solid #eee;height:192px;">
                    <p style="margin:0;padding:13px 0 0 8px;font-weight:700;font-size:15px;">需求-受理部门分布</p>
                    <div id="acceptance" ref="acceptance" style="width:100%;height:160px;"></div>
                </div>
            </div>
          </el-col>
        </el-row> -->


        <div class="body" style="padding:0 40px;">
            <div class="orderbox" style="display:flex;margin-bottom:15px;">
              <span style="line-height:30px;display:inline-block;width:60px;margin-top:15px;">快速排序</span>
              <div class="btnflexbox">
                <button class="c-btn" v-for="(item,index) in orderarr" :key="index" @click="orderdata(item,index)"><i class="fa fa-sort-asc" style="font-size:21px;margin-right:5px;padding-top:8px;" v-if="item.type==='asc'"></i><i class="fa fa-sort-desc" style="font-size:21px;margin-right:5px;" v-if="item.type==='desc'"></i>{{item.name}}</button>
              </div>
            </div>
            <el-collapse value="aboutarr" v-loading='collloading' style="min-height:100px;">
              <el-collapse-item style="padding:0 15px;border-left:1px solid #eee;border-right:1px solid #eee;" v-for="(item, index) in tableData" :key="index">
                <template slot="title">
                  <div style="width:100%">
                  <!-- <span style="color:#409EFF;display:inline-block;margin-left:20px;margin-right:20px;"></span> -->
                  <div style="display:inline-block;width:30px;text-align:center;line-height:30px;">
                    <div style="width:30px;height:30px;border-radius:50%;color:#FFF;background-color:#a5bce6" v-if="item.tracker_id==='2'">优</div>
                    <div style="width:30px;height:30px;border-radius:50%;color:#fff;background-color:#ffb380" v-else-if="item.tracker_id==='oa'">业</div>
                  </div>
                  <a href="javascript:;" style="text-decoration:underline;color:#409EFF"  @click="goRedmine(item.id)">#{{item.id}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.subject}}</a>
                  <span style="color:#409EFF;border:1px solid #b3d8ff;background-color:#ecf5ff;padding:3px 10px;border-radius:5px;" v-if="item.needs_status">{{item.needs_status}}</span>
                  <span style="background-color: rgba(245,108,108,.1);border:1px solid rgba(245,108,108,.8);color: #f56c6c;padding:4px 10px;border-radius:5px;" v-if="item.isyq==='yq'">延期</span>
                  <a href="javascript:;" style="float:right;margin-right:15px;margin-top:3px;">详情</a>
                  </div>
                  <div class="collbox" style="display:flex;width:100%;">
                    <div class="ssbox" style="width:20%">
                      <p><span :style="[renderName==='涉及系统' ? clickStyle : noclick]">涉及系统:</span><span>{{useridgetname(item.project_id)}}</span></p>
                      <p><span :style="[renderName==='指派给' ? clickStyle : noclick]">创建人:</span><span>{{item.author_id}}</span></p>
                    </div>
                    <div class="ssbox" style="width:20%">
                      <p><span :style="[renderName==='发起日期' ? clickStyle : noclick]">发起日期:</span><span v-if="item.created_on">{{item.created_on.split(' ')[0]}}</span></p>
                      <p><span :style="[renderName==='累计耗时' ? clickStyle : noclick]">累计耗时:</span><span style="color:red" v-if="Number(item.avgDay)>90">{{item.avgDay}}天</span><span v-else>{{item.avgDay}}天</span></p>
                    </div>

                    <div class="ssbox" style="width:20%">
                      <p><span :style="[renderName==='预计上线日期' ? clickStyle : noclick]">预计上线日期:</span><span>{{item.due_date}}</span></p>
                      <p><span :style="[renderName==='优先级' ? clickStyle : noclick]" >优先级:</span>
                        <span v-if="item.priority_id === '3'" style="text-align: center;">高</span>
                        <span v-else-if="item.priority_id === '4'" style="text-align: center;">紧急</span>
                        <span v-else-if="item.priority_id === '5'" style="text-align: center;">立刻</span>
                        <span v-else-if="item.priority_id === '2'" style="text-align: center;">普通</span>
                        <span v-else style="text-align: center;">低</span>
                      </p>
                      <!-- <p v-if="this.activeName==='first'">累计耗时:<span style="color:red" v-if="Number(item.avgDay)>60">{{item.avgDay}}天</span><span v-else>{{item.avgDay}}天</span></p> -->
                    </div>

                    <div class="ssbox" style="width:20%">
                      <p><span :style="[renderName==='实际上线日期' ? clickStyle : noclick]">实际上线日期:</span><span v-if="item.REAL_END_DATE">{{item.REAL_END_DATE.split(' ')[0]}}</span></p>
                      <p><span :style="[renderName==='ITSM单号' ? clickStyle : noclick]">ITSM单号:</span><span>{{item.chg_no}}</span></p>
                    </div>
                  </div>
                </template>
              <div class="hidebox" style="z-index:1">
                <div class="titlebox" style="display:flex;margin-top:30px;">
                  <div class="intitle" style="flex:1;text-align:center">OA评审中</div>
                  <div class="intitle" style="flex:1;text-align:center">需求中</div>
                  <div class="intitle" style="flex:1;text-align:center">开发中</div>
                  <div class="intitle" style="flex:1;text-align:center">测试中</div>
                  <div class="intitle" style="flex:1;text-align:center">提交验收</div>
                  <div class="intitle" style="flex:1;text-align:center">待上线</div>
                  <div class="intitle" style="flex:1;text-align:center">上线完成</div>
                  <!-- <div class="intitle" style="flex:1;text-align:center">ITSM审批中</div>
                  <div class="intitle" style="flex:1;text-align:center">ITSM已上线</div> -->
                  <div class="intitle" style="flex:1;text-align:center">业务验收完成</div>
                </div>
                <!-- <el-steps :active="item.msglist.length + 1" align-center v-if="item.msglist.length===0 ? item.msglist.length=item.msglist.length+1 : item.msglist.length">
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                </el-steps> -->
                <div  v-if="item.msglist.length===0" style="z-index:0;">
                  <el-steps :active="2" align-center style="z-index:0">
                    <el-step title="" description=""></el-step>
                    <el-step title="" description=""></el-step>
                    <el-step title="" description=""></el-step>
                    <el-step title="" description=""></el-step>
                    <el-step title="" description=""></el-step>
                    <el-step title="" description=""></el-step>
                    <el-step title="" description=""></el-step>
                    <el-step title="" description=""></el-step>
                  </el-steps>
                </div>
              <div  v-else-if="item.msglist.length>=5" style="z-index:0;">
                <el-steps :active="item.msglist.length + 2" align-center style="z-index:0">
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                </el-steps>
              </div>
              <div style="z-index:0" v-else>
                <el-steps :active="item.msglist.length + 1" align-center style="z-index:0">
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                  <el-step title="" description=""></el-step>
                </el-steps>
              </div>
                <div class="titlebox" style="display:flex;margin-top:10px;">
                  <div class="intitle" style="flex:1;text-align:center"></div>
                  <!-- 第一个 -->
                  <el-tooltip placement="bottom">
                    <div slot="content" style="text-align:center">
                      <!-- <div style="text-align:left" v-if="item.msglist[0].time !== ''">{{item.msglist[0].time}}{{getusername(item.author_id).substr(1)}}新建需求</div> -->
                      <div style="text-align:left">{{item.created_on.substr(0,19)}}{{getusername(item.author_id).substr(1)}}新建需求</div>
                      <div v-if="item.msglist.length>0">
                        <div v-if="item.msglist[0].msg.includes('%')">{{item.msglist[0].msg.split('%')[0]}}{{item.msglist[0].msg.split('%')[1]}}{{item.msglist[0].msg.split('%')[2]}}</div>
                        <div v-else>{{item.msglist[0].msg}}</div>
                      </div>
                    </div>
                    <div class="intitle" style="flex:1;text-align:center;position:relative" >
                      <div v-if="item.msglist[0].time !== ''">{{item.msglist[0].time}}</div>
                      <div v-else-if="item.created_on">{{item.created_on.split(' ')[0]}}</div>
                      <div v-else></div>
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip>
                  <!-- <div class="intitle" style="flex:1;text-align:center" v-else>{{item.time[0]}}</div> -->


                  <el-tooltip placement="bottom" v-if='item.msglist.length>1'>
                    <div slot="content" style="text-align:center">
                        <div v-html="item.msglist[1].msg" style="text-align:left"></div>
                    </div>
                    <div class="intitle ballfather" style="flex:1;text-align:center;position:relative">
                      {{item.msglist[1].time}}
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip>
                  <div class="intitle" style="flex:1;text-align:center" v-else></div>

                  <el-tooltip placement="bottom" v-if='item.msglist.length>2'>
                    <div slot="content" style="text-align:center">
                        <div v-html="item.msglist[2].msg" style="text-align:left"></div>
                    </div>
                    <div class="intitle" style="flex:1;text-align:center;position:relative">
                      {{item.msglist[2].time}}
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip>
                  <div class="intitle" style="flex:1;text-align:center" v-else></div>

                  <el-tooltip placement="bottom" v-if='item.msglist.length>3'>
                    <div slot="content" style="text-align:center">
                      <div v-html="item.msglist[3].msg" style="text-align:left"></div>
                    </div>
                    <div class="intitle" style="flex:1;text-align:center;position:relative">
                      {{item.msglist[3].time}}
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip>
                  <div class="intitle" style="flex:1;text-align:center" v-else></div>

                  <!-- 待上线无状态 -->
                  <!-- <el-tooltip placement="bottom" v-if='item.msglist.length>4'>
                    <div slot="content" style="text-align:center">
                      <div v-html="item.msglist[4].msg" style="text-align:left"></div>
                    </div>
                    <div class="intitle" style="flex:1;text-align:center;position:relative">
                      {{item.msglist[4].time}}
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip> -->
                  <div class="intitle" style="flex:1;text-align:center"></div>
                  <!-- 待上线无状态 -->


                  <el-tooltip placement="bottom" v-if='item.msglist.length>4'>
                    <div slot="content" style="text-align:center">
                      <div v-html="item.msglist[4].msg" style="text-align:left"></div>
                    </div>
                    <div class="intitle" style="flex:1;text-align:center;position:relative">
                      {{item.msglist[4].time}}
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip>
                  <div class="intitle" style="flex:1;text-align:center" v-else></div>

                  <el-tooltip placement="bottom" v-if='item.msglist.length>5'>
                    <div slot="content" style="text-align:center">
                      <div v-html="item.msglist[5].msg" style="text-align:left"></div>
                    </div>
                    <div class="intitle" style="flex:1;text-align:center;position:relative">
                      {{item.msglist[5].time}}
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip>
                  <div class="intitle" style="flex:1;text-align:center" v-else></div>

                  <!-- <el-tooltip placement="bottom" v-if='item.msglist.length>6'>
                    <div slot="content" style="text-align:center">
                      <div v-html="item.msglist[6].msg" style="text-align:left"></div>
                    </div>
                    <div class="intitle" style="flex:1;text-align:center;position:relative">
                      {{item.msglist[6].time}}
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip>
                  <div class="intitle" style="flex:1;text-align:center" v-else></div> -->

                  <!-- <el-tooltip placement="bottom" v-if='item.msglist.length>7'>
                    <div slot="content" style="text-align:center">
                      <div v-html="item.msglist[7].msg" style="text-align:left"></div>
                    </div>
                    <div class="intitle" style="flex:1;text-align:center;position:relative">
                      {{item.msglist[7].time}}
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip>
                  <div class="intitle" style="flex:1;text-align:center" v-else></div> -->

                  <!-- <el-tooltip placement="bottom" v-if='item.msglist.length>8'>
                    <div slot="content" style="text-align:center">
                      <div v-html="item.msglist[8].msg" style="text-align:left"></div>
                    </div>
                    <div class="intitle" style="flex:1;text-align:center;position:relative;">
                      {{item.msglist[8].time}}
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip>
                  <div class="intitle" style="flex:1;text-align:center" v-else></div> -->

                  <!-- <el-tooltip placement="bottom" v-if='item.msglist.length>9'>
                    <div slot="content" style="text-align:center">
                      <div v-html="item.msglist[9].msg" style="text-align:left"></div>
                    </div>
                    <div class="intitle" style="flex:1;text-align:center;position:relative">
                      {{item.msglist[9].time}}
                      <div class=".ball" style="color:red;position:absolute;width:50px;height:50px;border-radius:50%;background:transparent;top:-50px;left:50%;transform: translate(-50%);z-index:9999"></div>
                    </div>
                  </el-tooltip>
                  <div class="intitle" style="flex:1;text-align:center" v-else></div> -->
                  </div>
                </div>
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
                :total="total" style="margin-top:12px;float:right;">
              </el-pagination>
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
import {getProjectReqEcharts, getReqKbList, getEchartsByBranch} from '@/api/xyzqPort/NeedPort'
import {systemlogStatis} from '@/api/modules/all'

export default {
  data () {
    return {
      projectOptions: [],  // 所有的项目和对应的id
      projectOptionsAll: [],
      changeTime: ['2019-11-11', '2019-11-11'],      // 默认的选中时间
      listQuery: {
        project_ids: [],
        statusIds: [],
        page: 1,
        pageSize: 10,
        orderType: 'asc',
        orderFiled: 'isyq'
      },
      titlog: {
        avgDays: 0,
        oaNum: 0,
        reqNum: 0,
        yqNum: 0,
        stopNum: 0,
        cswwcNum: 0,
        closeNum: 0
      },
      tableData: [],
      total: 0,
      searchText: '',
      activeName: 'first',
      checkList: ['2'],
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
        id: 'created_on',
        name: '发起日期',
        type: 'desc'
      }, {
        id: 'due_date',
        name: '预计上线日期',
        type: 'desc'
      }, {
        id: 'REAL_END_DATE',
        name: '实际上线日期',
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
      noproFlag: false
    }
  },
  created () {
    this.getnowtime(182)

    // this.$refs.timeSelect.click()
    // this.changeTime[0] = ''
    // this.changeTime[1] = ''
    var url = window.location.href
    if (url.indexOf('?token=') !== -1) {
      localStorage.setItem('tabIndex', 468)
      this.loginEiac()
    }
    // console.log(this.changeTime)
    // if (this.$route.query.stime || this.$route.query.etime) {
    //   this.changeTime[0] = this.$route.query.stime
    //   this.changeTime[1] = this.$route.query.etime
    // } else {
    //   // this.getnowtime(182)
    //   console.log('hello world')
    //   console.log(this.$route.query.stime)
    // }
    if (typeof (this.$route.query.stime) !== 'undefined' && this.$route.query.stime !== '') {
      this.changeTime[0] = this.$route.query.stime
      this.changeTime[1] = this.$route.query.etime
      // console.log(123)
    } else if (this.$route.query.stime === '') {
      this.changeTime[0] = ''
      this.changeTime[1] = ''
      // console.log(123)
    }

    if (this.$route.query.avtiveName) {
      this.activeName = this.$route.query.avtiveName
    }
    if (typeof (this.$route.query.proid) !== 'undefined' && this.$route.query.proid !== '') {
      this.listQuery.project_ids = this.$route.query.proid
    } else {
      this.listQuery.project_ids = ''
    }
    this.radio = 6
    if (typeof (this.$route.query.radio) !== 'undefined' && this.$route.query.radio !== '') {
      this.radio = Number(this.$route.query.radio)
    }
    this.getproject()
    // this.getallstatus()  // 获取所有的状态码
    this.getUserOptions()
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '旧需求看板',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  methods: {
    changeitem () {
      this.listQuery.pageSize = 10
      this.listQuery.page = 1
      // 切换项目时触发
      for (let i = 0; i < this.listQuery.project_ids.length; i++) {
        if (this.listQuery.project_ids[i] === '') {
          this.listQuery.project_ids = []
        }
      }
      // this.listQuery.statusIds = []
      this.listQuery.orderFiled = 'isyq'
      this.listQuery.orderType = 'asc'
      this.collloading = true
      this.getallData()
    },
    timeChangepro () {
      this.collloading = true
      this.getallData()
    },
    quickTime () {
      console.log(this.radio)
      if (this.radio === 1) {
        this.getnowtime(30)
      } else if (this.radio === 3) {
        this.getnowtime(90)
      } else if (this.radio === 6) {
        this.getnowtime(182)
      } else if (this.radio === 0) {
        this.getnowtime('all')
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
        this.$router.push('/ReqPort')
      }
    },
    changeboxgroup () {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      // console.log(this.checkList)
      if (this.checkList.length === 2) {
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
          name: '预计上线日期',
          type: 'desc'
        }, {
          id: 'REAL_END_DATE',
          name: '实际上线日期',
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
        // this.ywflag = true
      } else if (this.checkList[0] === 'oa' && this.checkList.length === 1) {
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
          name: '预计上线日期',
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
        // this.ywflag = true
      } else if (this.checkList[0] === '2' && this.checkList.length === 1) {
        this.orderarr = [{
          id: 'created_on',
          name: '发起日期',
          type: 'desc'
        }, {
          id: 'due_date',
          name: '预计上线日期',
          type: 'desc'
        }, {
          id: 'REAL_END_DATE',
          name: '实际上线日期',
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
        // this.ywflag = false
      }
      // this.getordColor()
      // this.listQuery.orderType = 'asc'
      // this.listQuery.orderFiled = 'isyq'
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
      this.listQuery.orderFiled = item.id
      this.listQuery.orderType = item.type
      // var checkKey = document.querySelectorAll('.c-btn')[index]
      // console.log(checkKey.querySelectorAll('i')[0])
      checkKey.querySelectorAll('i')[0].style.color = '#4b78cd'
      this.renderName = item.name
      // console.log(checkKey)
      // console.log(item)
      this.collloading = true
      this.getListData()
    },
    getechartsData () {
      const row = {
        project_ids: this.listQuery.project_ids.join(','),
        start_date: this.changeTime[0],
        end_date: this.changeTime[1],
        page: this.listQuery.page,
        tracker_ids: this.checkList.join(','),
        pageSize: this.listQuery.pageSize,
        token: this.$cookie.get('token')
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
      // getDataByTrackerId(trackrow).then(res => {
      //   console.log(res)
      // })
      getProjectReqEcharts(row).then(res => {
        this.demandflag = false
        // console.log(res)
        let obj = {
          closelist: [],
          name: []
        }
        // debugger
        var arr = []
          // debugger
        if (this.listQuery.project_ids.length > 0) {
          for (let j = 0; j < this.listQuery.project_ids.length; j++) {
            this.projectOptionsAll.forEach(item => {
              if (this.listQuery.project_ids[j] === item.id) {
                var obj = {
                  id: item.id,
                  name: item.name
                }
                arr.push(obj)
              }
            })
          }
        } else {
          arr = this.projectOptionsAll
        }
        if (res.data.result === 'success') {
          this.titlog.yqNum = res.data.yqNum
          this.titlog.reqNum = res.data.reqNum
          this.titlog.oaNum = res.data.oaNum
          this.titlog.avgDays = res.data.avgDays
          this.titlog.cswwcNum = res.data.cswwcNum
          this.titlog.stopNum = res.data.stopNum
          this.titlog.closeNum = res.data.closeNum
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
          // console.log(arr)
          arr.forEach(item => {
            if (item.boo !== true && item.name !== '全部') {
              this.fbData.push({ name: item.name, all_num: 0, close_num: 0, kf_num: 0, new_num: 0, cs_num: 0, dsx_num: 0, yq_num: 0 })
              obj.closelist.push(0)
              obj.name.push(item.name)
            }
          })
        } else {
          arr.forEach(item => {
            // if (item.boo !== true && item.name !== '全部') {
            this.fbData.push({ name: item.name, all_num: 0, close_num: 0, kf_num: 0, new_num: 0, cs_num: 0, dsx_num: 0, yq_num: 0 })
            // }
          })
        }
        if (obj.name.length > 15) {
          obj.closelist = obj.closelist.slice(0, 15)
          obj.name = obj.name.slice(0, 15)
        }
        // console.log(obj)
        // this.echartsdemandItem('closereq', obj)
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
          fqobj.number = res.data.jbnumlist
          slobj.name = res.data.slnamelist
          slobj.number = res.data.slnumlist
        }
        this.echartsacceptanceItem('acceptance', slobj, 'green', 'green')
        this.echartsacceptanceItem('launch', fqobj)
      })
    },
    getallData () {
      this.changeboxgroup()
    },
    getListData () {
      var row = {}
      row = {
        project_ids: this.listQuery.project_ids.join(','),
        start_date: this.changeTime[0],
        end_date: this.changeTime[1],
        tracker_ids: this.checkList.join(','),
        page: this.listQuery.page,
        pageSize: this.listQuery.pageSize,
        token: this.$cookie.get('token'),
        orderType: this.listQuery.orderType,
        orderFiled: this.listQuery.orderFiled
      }
      getReqKbList(row).then(res => {
        // console.log(res)
        this.collloading = false
        this.total = res.data.total
        this.tableData = res.data.rows
        // console.log(this.tableData[1].msglist)
        // console.log(this.tableData[1].msglist.length)
        // console.log(this.tableData[0].msglist)
        // console.log(this.tableData[0].msglist.length)
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
    // handleClick (val) {
    //   if (val.label === '已完成') {
    //     this.listQuery.statusIds = this.gbarr
    //   } else if (val.label === '处理中') {
    //     this.listQuery.statusIds = this.clstatusarr
    //     // this.$forceUpdate()
    //   }
    //   console.log(this.listQuery.statusIds)
    //   console.log(this.gbarr)
    //   this.demandflag = true
    //   this.getallData()
    // },
    goRedmine (row) {
      window.open('http://192.25.97.80/redmine/issues/' + row)
    },
    getproName (id) {
      let str = ''
      this.projectOptionsAll.forEach(item => {
        if (Number(item.id) === Number(id)) {
          str = item.name
        }
      })
      return str
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
              this.projectOptionsAll = [...res.data.list]
              this.projectOptions.unshift({
                id: '',
                name: '全部'
              })
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
      this.projectOptionsAll.forEach((item) => {
        if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.projectOptions = [{text: '暂无数据', id: '', disabled: true}]
      } else {
        this.projectOptions = allList
      }
    },
    goisyqPage (status, itenname) {
      var id = ''
      if (itenname) {
        this.projectOptionsAll.forEach(item => {
          if (itenname === item.name) {
            id = item.id
            // console.log(111)
          }
        })
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
          listName: '暂停需求列表'
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
          listName: '90天未关闭需求列表'
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
          listName: '延期需求列表'
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
          listName: '需求列表'
        }
      }
      // const
      // console.log(row)
      // console.log(projectsid)
      this.$router.push({path: '/isyqPort', query: row})
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
    // chartssize (container, charts) {
    //   function getStyle (el, name) {
    //     if (window.getComputedStyle) {
    //       return window.getComputedStyle(el, null)
    //     } else {
    //       return el.currentStyle
    //     }
    //   }
    //   var wi = getStyle(container, 'width').width
    //   var hi = getStyle(container, 'height').height
    //   charts.style.width = wi
    //   charts.style.height = hi
    // },
    echartsacceptanceItem (id, data, colordata, yy) {
      // document.getElementById(id).removeAttribute('_echarts_instance_')
      if (window.innerWidth > 1500) {
        document.getElementById(id).style.width = 670 + 'px'
      } else {
        document.getElementById(id).style.width = 570 + 'px'
      }
      this.myChartsaccept = echarts.init(document.getElementById(id))
      var color = '#4B78CD'
      if (colordata) {
        color = '#67c23a'
      }
      var qucolor = 'transparent'
      if (yy) {
        qucolor = '#d1edc4'
      }
      // console.log(window.innerWidth)
      this.myChartsaccept.resize()
      this.myChartsaccept.setOption({
        grid: {
          top: '5%',
          left: '5%',
          right: '5%',
          bottom: '5%',
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
            data: data.name,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                if (value.length > 5) {
                  return value.substring(0, 5) + '\n' + '...'
                } else {
                  return value
                }
              }
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
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        series: [
          {
            name: '需求总数',
            type: 'line',
            barGap: 0,
            itemStyle: {
              normal: {
                color: color,
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            areaStyle: {
              normal: {color: qucolor} // 改变区域颜色
            },
            barMaxWidth: 25,
            cursor: 'pointer',
            data: data.number
          }
        ]
      }, true)
    },
    getnowtime (days) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
      var s = this.getTimeByDate(start)
      var e = this.getTimeByDate(end)
      if (days === 'all') {
        this.$set(this.changeTime, 0, '')
        this.$set(this.changeTime, 1, '')
      } else {
        this.$set(this.changeTime, 0, s)
        this.$set(this.changeTime, 1, e)
      }
      // console.log(this.changeTime[0])
      // console.log(this.changeTime[1])
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
            margin-right: 30px;
            float: left;
            padding: 13px 13px 0 13px;
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
          }
        }
        .btnflexbox{
          // width: 1050px;
          flex: 1;
          // font-size: 14px;
          display: flex;
          flex-flow: wrap;
          .c-btn{
          display: flex;
          background-color: rgba(242, 242, 242, 1);
          border: none;
          // border: 1px solid #ccc;
          margin-left:20px;
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
          margin-right:20px;
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
              margin-right:20px;
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
        border-bottom: 2px solid #409EFF;
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
        }
    }
    
    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
        background-color: #4B78CD;
        border: transparent;
    }
    .is-checked {
        background-color: #4B78CD !important;
        transition: all 0.3s;
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
    // .el-step.is-horizontal .el-step__line{
    //   // top: 20px;
    // }
    // .el-step__head,.is-finish .el-step__line .el-step__line-inner{
    //   // background-color: #fff;
    //   // border-color: #4B78CD;
    // }
    // .el-step__head,.is-process .el-step__icon,.is-text {
    //   // color: red !important;
    // }
    .is-text{
      border-color: #4B78CD;
    //   width: 50px;
    //   height: 50px;
    //   position: absolute;
    //   top: -14px;
    //   left: 40px;
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
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center:nth-of-type(1)  .el-step__head.is-finish {
    color: $background_color !important;
    // border-color: $is-finish-background !important;
    border-color: $background_color !important;
    -ms-color: $background_color !important;
    // border-color: $is-finish-background !important;
    -ms-border-color: $background_color !important;
  }
  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center:nth-of-type(6)  .el-step__head.is-finish {
    color: $background_color !important;
    -ms-color: $background_color !important;
    // border-color: $is-finish-background !important;
    // border-color: $background_color !important;
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

  .el-steps.el-steps--horizontal  .el-step.is-horizontal.is-center:nth-of-type(6)  .el-step__head.is-finish  .el-step__icon {
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
    margin-left: 15px;
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
  // .el-select-dropdown__item{
  //   padding: 0 0px !important;
  // }
  .el-scrollbar__wrap{
    overflow: auto !important;
  }
  .el-scrollbar__thumb{
    background-color: transparent !important;
  }
</style>
<style lang="scss" scoped>
  .errbox{
        width: 100%;
        height:300px;
        // margin-top:100px;
        text-align: center;
        // background-image: radial-gradient(center, farthest-corner, #fff 10%, #aaa 50%);
        // border: 1px solid #fff;
        // background-image: radial-gradient( #fff 10%, #f6f0f2 30%);
    }
</style>

<style>
  .onmouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
  .onmouthFix .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .needport .el-dialog__wrapper{
    z-index: 20001 !important;
  }
  .needport .el-collapse-item__header{
    flex-flow: wrap;
    position: relative;
  }
  .body .el-icon-arrow-right{
    position: absolute;
    top: 18px;
    right: -10px;
  }
  .ssbox p {
    line-height: 24px;
  }
</style>