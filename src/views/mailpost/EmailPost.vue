<template>
    <div class="achievement">
        <p style="font-size:20px;font-weight:700;color:#000;margin:0;padding:10px 15px;">邮件发送日志</p>
        <div style="width:100%">
            <el-row>
                <el-col :span="15">
                    <div style="line-height:50px; display:flex;">
                        <span style="display:inline-block;width:80px;text-align:right;margin-right:5px;">项目</span>
                        <el-select v-model="projectIds" placeholder="全部" multiple style="flex:1;" @change="changeitem" popper-class='onmouthFix'>
                        <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                          <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                        </div>
                          <el-option
                            v-for="item in oaProname"
                            :key="item.project_name"
                            :label="item.project_name"
                            :value="item.project_name">
                          </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="mouth" style="display:flex;width:100%;line-height:50px;">
                        <span style="display:inline-block;width:80px;text-align:right;margin-right:5px;">发送时间</span>
                        <el-date-picker
                          v-model="changeTime"
                          type="daterange"
                          align="right"
                          value-format="yyyy-MM-dd"
                          :clearable="true"
                          :unlink-panels="true"
                          @change="changeitem" ref="timeSelect" style="margin-top:5px;">
                        </el-date-picker>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div style="width:100%">
            <el-row>
              
                <el-col :span="10" style="line-height:50px;display:flex;">
                    <span style="display:inline-block;width:80px;text-align:right;margin-right:5px;">需求标题</span>
                    <el-input v-model="listQuery.needName" placeholder="请输入内容" style="flex:1;" @change="changeitem"></el-input>
                </el-col>
                <el-col :span="5" style="line-height:50px;display:flex;">
                    <span style="display:inline-block;width:80px;text-align:right;margin-right:5px;">状态</span>
                      <el-select v-model="listQuery.statusId" placeholder="请选择" style="flex:1;" @change="changeitem" clearable >
                        <el-option
                          v-for="item in options"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                </el-col>
                <el-col :span="8" style="line-height:50px;">
                    <span style="display:inline-block;width:80px;text-align:right;margin-right:5px;">接收人</span>
                    <el-input v-model="listQuery.receiverEmail" placeholder="请输入内容" style="width:72%" @change="changeitem"></el-input>
                </el-col>
            </el-row>
        </div>
        
      <div class="dsk" style="position:relative" v-loading='LoadingFlag'>
        <div style="display:inline-block;position:absolute;right:30px;top:0;z-index:1" v-if="activeName==='second'">
          <el-button style="color:#fff;background-color:#4b78cd;border:none;z-index:1000" @click="sendSomeEmail">批量发送</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" style="padding:0 15px;">
          <el-tab-pane label="已发送" name="first">
            <div style="padding:0 15px;">
              <el-table :data="SendtableData" style="width: 100%" @sort-change="changeOrder" border>
                <el-table-column prop="send_time" label="发送时间" align="center" sortable="custom" width="155">
                </el-table-column>
                <el-table-column prop="work_type" label="事务" align="center" sortable="custom" width="150">
                </el-table-column>
                <el-table-column prop="project_name" label="涉及系统" align="center" sortable="custom" width="130">
                </el-table-column>
                <el-table-column prop="need_name" label="需求标题" align="center" sortable="custom">
                </el-table-column>
                <el-table-column prop="mail_type" label="邮件类型" align="center" sortable="custom">
                </el-table-column>
                <el-table-column prop="receiver_email" label="接收人" align="center" sortable="custom" width="170">
                </el-table-column>
                <el-table-column prop="status_id" label="状态" align="center" sortable="custom" width="120">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status_id==='成功'" type="success">{{scope.row.status_id}}</el-tag>
                    <el-tag v-if="scope.row.status_id==='失败'" type="danger">{{scope.row.status_id}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" align="center" width="150">
                  <template slot-scope="scope">
                    <!-- 123 -->
                    <div style="width:100%;padding:0 10px;display:flex;justify-content:space-between">
                      <a href="javascript:;" style="display:inline-block;text-decoration:underline;" @click="previewFlag(scope.row.send_id, scope.row.need_name, scope.row.mail_type)">预览</a>
                      <a href="javascript:;" style="display:inline-block;text-decoration:underline;" @click="see(scope.row.send_id, scope.row.need_name, scope.row.mail_type, scope.row.remarks)">查看</a>
                      <a href="javascript:;" style="display:inline-block;text-decoration:underline;" @click="sendEmail('2', scope.row.send_id, scope.row.need_name, scope.row.mail_type)" v-if="scope.row.flag !== true">发送</a>
                      <a href="javascript:;" style="display:inline-block;color:transparent" v-else>查看</a>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注" align="center" sortable="custom">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="待发送" name="second">
            <div style="padding:0 15px;">
              <el-table :data="tableData" style="width: 100%" @sort-change="changeOrder" border  @selection-change="handleSelectionChange" ref="multipleTable">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <!-- <el-table-column prop="send_time" label="预计发送时间" align="center" sortable="custom" width="155">
                  <template slot-scope="scope">
                    <div v-if="scope.row.sendTime">{{scope.row.sendTime.substr(0,19)}}</div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="work_type" label="事务" align="center" sortable="custom" width="150">
                </el-table-column>
                <el-table-column prop="project_name" label="涉及系统" align="center" sortable="custom" width="170">
                </el-table-column>
                <el-table-column prop="need_name" label="需求标题" align="center" sortable="custom">
                </el-table-column>
                <!-- <el-table-column prop="mail_type" label="邮件类型" align="center" sortable="custom">
                </el-table-column> -->
                <el-table-column prop="receiver_email" label="接收人" align="center" sortable="custom" width="160">
                </el-table-column>
                <el-table-column prop="close_days" label="验收完成天数" align="center" sortable="custom" width="130">
                </el-table-column>
                <el-table-column prop="address" label="操作" align="center" width="150">
                  <template slot-scope="scope">
                    <!-- 123 -->
                    <div style="width:100%;padding:0 20px;">
                      <a href="javascript:;" style="display:inline-block;float:left;text-decoration:underline;" @click="previewFlag(scope.row.need_id, scope.row.need_name, '回顾填写')">预览</a>
                      <a href="javascript:;" style="display:inline-block;float:right;text-decoration:underline;" @click="sendEmail('2', scope.row.need_id, scope.row.need_name, '回顾填写')">发送</a>
                    </div>
                  </template>
                  <!-- <slot>1221</slot> -->
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
        <div style="display:flex;justify-content: flex-end;padding:0 15px;">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="listQuery.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="listQuery.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="total" style="margin:5px 0;">
            </el-pagination>
        </div>

        <el-dialog
          title=""
          :visible.sync="dialogVisible"
          :close-on-click-modal = 'false'
          :show-close = 'false'
          top="7vh"
          width="60%">
          <!-- <span>这是一段信息</span> -->
          <div style="background-color:#4b78cd;color:#FFF;display:flex;align-items:center;align-items: center;justify-content: space-between;width:100%;padding:5px 25px;">
            <span style="font-size:15px;font-weight:700;">邮件预览</span>
            <span class="fa fa-close" style="font-size:25px;cursor:pointer;" @click="dialogVisible=false"></span>
            <!-- 邮件 -->
          </div>
          <div v-html="yulan" style="margin-top:20px;padding:0 25px 20px;min-height:70vh" @click="cb"></div>
          <div style="display:flex;justify-content:center;padding:20px 0;">
            <el-button style="color:#fff;background-color:#4b78cd;border:none;margin-right:20px;" @click="dialogVisible=false">退出预览</el-button>
            <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="ylsend">发送</el-button>
          </div>
              <el-dialog
              title=""
              :visible.sync="achievementInfo"
              :close-on-click-modal = 'false'
              :show-close = 'false'
              top="3vh"
              width="100%" class="diao"
              append-to-body
              >
              <div class="preview"></div>
          <div class="marking" style="margin-top:0px;height:100vh;width:100%;margin:auto;overflow-y:auto;">
            <el-row>
              <el-col :span="19" style="background-color:#c8c8c8;height:100vh;overflow-y:auto;">
                <div style="background-color:#fff;width:70%;margin:auto;min-height:100vh;">
                    <div style="border:1px solid #000;margin:0 70px;padding:0px 15px;height:100%;">
                    <div class="m_header">
                        需求成效评价
                    </div>
                    <div class="m_content">
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <span style="margin-right:20px;">需求名称：</span>
                          <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa;">{{formLabelAlign.subject}}-{{formLabelAlign.handleBranch}}-{{formLabelAlign.handleAuthor}}-
                            <span v-if="formLabelAlign.createdOn">{{formLabelAlign.createdOn.substr(0,10)}}</span>
                          </div>
                        </div>
                        <!-- start -->
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <div style="flex:1;display:flex;align-items:center;margin-right:10px;">
                            <span style="margin-right:20px;">填报时间：</span>
                            <div v-if="formLabelAlign.tb_time" style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa;">{{formLabelAlign.tb_time}}</div>
                            <div v-else style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa">{{sendInfo.createTime}}</div>
                          </div>
                          <div style="flex:1;display:flex;align-items:center;font-size:14px;margin-left:10px;">
                            <span style="margin-right:20px;">需求实现满意度<span style="color:red">*</span></span>
                            <div style="flex:1;">
                              <el-select v-model="sendInfo.reviewLevel" style="width:100%;" :disabled="isShow" placeholder="">
                                <el-option
                                  v-for="item in optionsOther"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </div>
                        </div>
                        <!-- end -->
                        <!-- start -->
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <span style="margin-right:20px;">实现目的（可多选）<span style="color:red">*</span></span>
                          <div style="flex:1;">
                            <el-checkbox-group v-model="need_purpose" style="display:flex;flex-flow:wrap;" :disabled="isShow">
                                <el-checkbox label="1" style="width:33.3%">提升内部使用体验</el-checkbox>
                                <el-checkbox label="2" style="width:33.3%">提高效率</el-checkbox>
                                <el-checkbox label="3" style="width:33.3%">内部控制</el-checkbox>
                                <el-checkbox label="4" style="width:33.3%">满足合规要求</el-checkbox>
                                <el-checkbox label="5" style="width:33.3%">节约成本</el-checkbox>
                                <el-checkbox label="6" style="width:33.3%">其他</el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </div>
                        <!-- end -->
                        <!-- start -->
                        <div style="display:flex;margin-bottom:20px;align-items:center;">
                          <div style="flex:2;display:flex;align-items:center;">
                            <span style="margin-right:10px;">需求完成及时性：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa;">
                              <div v-if="sendInfo.timeliness==='1'">如期完成提交验收</div>
                              <div v-if="sendInfo.timeliness==='2'" style="display:flex;align-items:center;" >
                                延期提交验收
                              </div>
                            </div>
                          </div>
                          <div style="flex:3;margin-left:10px;align-items:center;display:flex;" v-if="sendInfo.timeliness==='2'" class="showerea">
                            <span style="margin-right:10px;">延期原因<span style="color:red">*</span></span>
                            <el-input v-model="sendInfo.delayCause" disabled style="flex:1;"></el-input>
                          </div>
                        </div>
                        <!-- end -->
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <span style="margin-right:20px;">评价总结<span style="color:red">*</span></span>
                          <div style="flex:1;">
                              <el-input type="textarea" v-model="sendInfo.messageDetail" placeholder="【请结合“需求应用成效评价标准”总结需求上线后的应用效果，例如需求相关系统功能的使用情况等】" style="width:100%;" :disabled="isShow"></el-input>
                          </div>
                        </div>
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <span style="margin-right:20px;">遗留问题或待优化事项：</span>
                          <div style="flex:1;">
                              <el-input type="textarea" v-model="sendInfo.remainingProblems" style="width:100%;" :disabled="isShow"></el-input>
                          </div>
                        </div>
                        <!-- end -->
                    </div>
                    <div class="m_header">
                        需求送审详情
                    </div>
                    <div style="text-align:center;color:#4b78cd;">
                        <h2>{{formLabelAlign.subject}}</h2>
                    </div>
                    <div class="m_midfoot" style="margin-top:15px;">
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <div style="flex:1;display:flex;align-items:center;margin-right:10px">
                            <span style="margin-right:20px;">需求类别：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;flex:1;min-height:32px;color:#00f;">{{formLabelAlign.FIELD0017_NAME}}</div>
                          </div>
                          <div style="flex:1;display:flex;align-items:center;margin-left:10px">
                            <span style="margin-right:20px;">涉及系统类别：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;flex:1;min-height:32px;color:#00f;">{{formLabelAlign.FIELD0026_NAME}}</div>
                          </div>
                        </div>
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <div style="flex:1;display:flex;align-items:center;margin-right:10px">
                            <span style="margin-right:20px;">需求紧急度：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;flex:1;min-height:32px;color:#00f;">{{formLabelAlign.FIELD0019_NAME}}</div>
                          </div>
                          <div style="flex:1;display:flex;align-items:center;margin-left:10px">
                            <span style="margin-right:20px;">涉及系统：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;flex:1;min-height:32px;color:#00f;">{{formLabelAlign.projectName}}</div>
                          </div>
                        </div>
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <div style="flex:1;display:flex;align-items:center;margin-right:10px">
                            <span style="margin-right:20px;">需求部门联络人：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;flex:1;min-height:32px;color:#00f;">{{formLabelAlign.field0028}}</div>
                          </div>
                          <div style="flex:1;display:flex;align-items:center;margin-left:10px">
                            <span style="margin-right:20px;">IT部门预沟通联络人：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;flex:1;min-height:32px;color:#00f;">{{formLabelAlign.field0033}}</div>
                          </div>
                        </div>
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <div style="flex:1;display:flex;align-items:center;">
                            <span style="margin-right:20px;">需求受理组：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;flex:1;min-height:32px;color:#00f;">{{formLabelAlign.acceptingGroup}}</div>
                          </div>
                        </div>
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <div style="flex:1;display:flex;align-items:center;margin-right:10px">
                            <span style="margin-right:20px;">计划提交验收时间：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;flex:1;min-height:32px;color:#00f;">{{formLabelAlign.dueDate}}</div>
                          </div>
                          <div style="flex:1;display:flex;align-items:center;margin-left:10px">
                            <span style="margin-right:20px;">实际提交验收时间：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;flex:1;min-height:32px;color:#00f;">{{formLabelAlign.realTime}}</div>
                          </div>
                        </div>
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <div style="flex:1;display:flex;align-items:center">
                            <span style="margin-right:20px;">需求实施情况：</span>
                            <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;flex:1;min-height:32px;color:#00f;">
                              <div v-if="formLabelAlign.FIELD0032==='-8712346836245460400'">需求完成</div>
                              <div v-else-if="formLabelAlign.FIELD0032==='5875571938664270324'">需求部分完成</div>
                              <div v-else-if="formLabelAlign.FIELD0032==='-6536861750169808955'">需求中止</div>
                              <div v-else>其他</div>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div class="m_foot" style="margin-bottom:15px;">
                        <p style="color:#000;font-size:14px;margin-bottom:5px;">送审原因及说明：</p>
                        <div style="border:1px solid #aaa;background-color:#fff;min-height:50px;">
                          <p style="font-size:14px;word-wrap:break-word;word-break:break-all;overflow:hidden;" v-html="formLabelAlign.field0005"></p>
                        </div>
                        <p style="color:#000;font-size:14px;margin-bottom:5px;">需求应用成效评价标准（即该需求在实际应用中将产生的价值体现，功能需求必填并请尽量填写量化指标，如预期使用量、开户数、交易量等）：</p>
                        <div style="border:1px solid #aaa;background-color:#fff;min-height:50px;">
                            <p style="font-size:14px;word-wrap:break-word;word-break:break-all;overflow:hidden;">{{formLabelAlign.statuss}}</p>
                        </div>
                    </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="5" style="height:100vh;">
                <div style="height:100vh;display:flex;flex-flow:column;">
                    <div style="background-color:#fff;padding:0px 0px 0 10px;height:48%;">
                        <div style="border:1px solid #ccc;border-bottom:none;border-top:none;text-align:right;padding:15px 30px 15px 0;background-color:#eff3f5;color:#00f">温馨提示</div>
                        <div style="border:1px solid #ccc;padding:50px 30px;height:100%;position:relative;border-bottom:none;">
                          <div v-if="huiguKind==='待回顾'">请需求发起人对该需求的完成及时性、实现结果满意度等进行评价，填写左侧表单；点击“提交”按钮后，该评价意见流转至IT专员进行复核。</div>
                          <div v-else-if="huiguKind==='回顾待确认'">请IT专员对该需求的成效评价意见进行复核，如有异议请直接修改左侧表单；点击“确认”按钮后，该需求成效评价完成</div>
                          <div v-else-if="huiguKind==='回顾完成'">该需求已完成成效评价，如有其他意见请联系本单位对口IT业务经理反馈,谢谢</div>
                        </div>
                    </div>

                    <div style="height:52%;padding:0 0 0 10px;background-color:#fff;overflow-y:auto;">
                      <div style="padding:15px 10px;background-color:#fff;border:1px solid #ccc;height:100%;">
                          <p>变动历史</p>
                          <div>
                            <div style="margin:8px 0;font-size:14px;">{{formLabelAlign.send_time}}</div>
                            <div style="margin:8px 0;font-size:14px;">PMO发起了流程</div>
                          </div>
                          <div v-if="sendInfo.history">
                            <div v-for="(item,index) in sendInfo.history" :key="index">
                              <div style="margin:8px 0;font-size:14px;">{{item.create_time}}</div>
                              <div style="margin:8px 0;font-size:14px;">
                                <div v-if="item.create_author===formLabelAlign.handleAuthor">{{item.create_author}}提交了需求成效评价</div>
                                <div v-else>{{item.create_author}}确认了需求成效评价</div>
                              </div>
                            </div>
                          </div>
                      </div>
                    </div>
                </div>
            </el-col>
            </el-row>
          </div>
          <div style="display:flex;justify-content:center;margin-top:20px;">
            <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="achievementInfo=false">退出</el-button>
          </div>
          </el-dialog>
        </el-dialog>
    </div>
</template>


<script>
// import {getOaProjects} from '@/api/xyzqPort/OaPort'
import {getreqName, listByParam, getAlllog, getEmailres} from '@/api/EmailPost/emailPost'
import {systemlogStatis} from '@/api/modules/all'
import {yuluan, getQxNeedmeritsReview} from '@/api/EmailPost/preview.js'
export default {
  data () {
    return {
      achievementsee: false,
      need_purpose: [],
      timeliness: '',
      sendInfo: {
        delayCause: '',
        remainingProblems: '',
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
      searchText: '',
      oaProname: [],
      forSecharName: [],
      changeTime: [],
      projectIds: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        orderType: 'desc',
        orderFiled: '',
        needName: '',
        receiverEmail: '',
        startTime: '',
        endTime: '',
        projectName: '',
        statusId: ''
      },
      total: 0,
      options: [{
        id: '成功',
        name: '成功'
      }, {
        id: '失败',
        name: '失败'
      }],
      value1: [],
      tableData: [],
      SendtableData: [],
      activeName: 'first',
      multipleTable: [],
      multipleSelection: [],
      dialogVisible: false,
      yulan: '',
      LoadingFlag: true,
      achievementInfo: false,
      ylid: '',
      yltitle: '',
      yltype: '',
      // marking
      tableDataOther: [{
        id: '需求名称',
        name: ''
      }, {
        id: '填报时间',
        name: '2020-02-06',
        amount1: '需求响应及时性',
        amount2: '4.43'
      }, {
        id: '实现目的（可多选）*',
        type: 'some',
        name: '王小虎'
      }, {
        id: '应用绩效回顾等级*',
        type: 'select',
        name: '3'
      }, {
        id: '功能推广或使用情况说明*',
        name: '符合预期'
      }],
      itemData: [
        {one: '需求类别', two: '功能需求', three: '涉及系统类别', four: '基础平台类'},
        {one: '需求紧急度', two: '紧急', three: '涉及系统', four: '其他'},
        {one: '需求部门联络人', two: '', three: 'IT部门预沟通联络人', four: ''},
        {one: '需求受理组', two: '', three: '', four: ''},
        {one: '计划提交验收时间', two: '2020-06-30', three: '实际提交验收时间', four: '2020-01-16'},
        // {one: '是否涉及财务费用', two: '否', three: '是否涉及合规审批', four: '否'},
        {one: '需求实施情况', two: '已完成', three: '', four: ''}
      ],
      checkList: ['1', '3'],
      optionsOther: [{
        value: '1',
        label: 'A实现结果超出需求预期'
      }, {
        value: '2',
        label: 'B实现结果基本符合需求'
      }, {
        value: '3',
        label: 'C实现结果与需求有一定偏差，待优化'
      }, {
        value: '4',
        label: 'D实现结果未能满足需求'
      }],
      huiguKind: '',
      isShow: true
    }
  },
  created () {
    this.getproname()
    // this.getOneDayTime()
    // 测试
    // this.test()
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '邮件发送',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    this.changeitem()
  },
  methods: {
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex !== 1) {
        if (columnIndex !== 0) {
          return [1, 3]
        }
      }
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 3 || rowIndex === 6) {
        if (columnIndex !== 0) {
          return [1, 3]
        }
      }
    },
    sendEmailOther (typein, id, title, huiguType) {
      var sendtype = ''
      var titlename = ''
      if (typein === '1') {
        sendtype = 'yuluan'
      } else if (typein === '2') {
        sendtype = 'fasong'
      }
      if (title) {
        titlename = title
      }
      var rows = {}
      if (huiguType) {
        rows = {
          reqId: id,
          userName: localStorage.getItem('userId'),
          type: sendtype,
          need_name: titlename,
          mailType: huiguType
        }
      } else {
        rows = {
          reqId: id,
          userName: localStorage.getItem('userId'),
          type: sendtype,
          need_name: titlename
        }
      }
      getEmailres(rows).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          if (res.data.data) {
            if (res.data.data.reslist) {
              var arr = res.data.data.reslist
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].includes('成功')) {
                  this.$message({type: 'success', message: arr[i]})
                } else {
                  this.$message({type: 'error', message: arr[i]})
                }
              }
            }
            if (res.data.data.yuluan) {
              this.yulan = res.data.data.yuluan
              // console.log(this.yulan)
              let aa = this.yulan.split('@click')[1].split("'")[1]
              // console.log(aa)
              let sendachieveid = aa.split('(')[1].split(',')[0]
              let sendachievetype = aa.split('(')[1].split(',')[1].split(')')[0]
              // this.eseeachievement(sendachieveid, sendachievetype, 'no')
              const sendrow = {
                reqId: sendachieveid,
                type: sendachievetype
              }
              let routeData = this.$router.resolve({
                name: 'lookUp',
                query: sendrow
              })
              window.open(routeData.href, '_blank')
              // this.$router.push({path: 'lookUp', query: sendrow})
              // this.achievementsee = true
            }
          }
        }
        // 发送后再次渲染页面
        this.listQuery.page = 1
        this.listQuery.pageSize = 10
        if (this.activeName === 'first') {
          this.getSentData()
        } else if (this.activeName === 'second') {
          this.getUnSentData()
        }
      })
    },
    see (id, title, mailtype, beizhu) {
      this.yltype = ''
      this.dialogVisible = false
      if (beizhu.includes('请求异常')) {
        console.log(beizhu)
        const sendrow = {
          errmessage: beizhu
        }
        let routeData = this.$router.resolve({
          name: 'lookUp',
          query: sendrow
        })
        window.open(routeData.href, '_blank')
      } else {
        if (mailtype) {
          this.sendEmailOther('1', id, title, mailtype)
          this.yltype = mailtype
        } else {
          this.sendEmailOther('1', id, title)
        }
      }
      this.ylid = id
      this.yltitle = title
    },
    // 弹出框
    cb (e) {
      if (e.target.localName.toLowerCase() === 'a') {
        var id = e.target.outerHTML.split('(')[1].split(')')[0].split(',')[0]
        var type = e.target.outerHTML.split('(')[1].split(')')[0].split(',')[1]
        // console.log(id)
        // console.log(e.target.outerHTML.split('(')[1].split(')')[0])
        this.eseeachievement(id, type)
      }
    },
    eseeachievement (id, type, isno) {
      // console.log(id)
      let row = {
        reqId: id,
        token: this.$cookie.get('token')
      }
      yuluan(row).then(response => {
        // console.log(response)
        if (response.data.data !== null) {
          if (response.data.data.dueDate) {
            response.data.data.dueDate = response.data.data.dueDate.substr(0, 10)
          }
          if (response.data.data.realTime) {
            response.data.data.realTime = response.data.data.realTime.substr(0, 10)
          }
          if (response.data.data.field0005) {
            response.data.data.field0005 = response.data.data.field0005.replace(/ {4}/g, '<br/>&nbsp;&nbsp;')
          }
        }
        this.formLabelAlign = response.data.data
        if (this.formLabelAlign.realTime) {
          if (this.formLabelAlign.realTime <= this.formLabelAlign.dueDate) {
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
          if (time <= this.formLabelAlign.dueDate) {
            // 如期完成提交验收
            this.timeliness = '1'
          } else {
            // 延期提交验收
            this.timeliness = '2'
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
        // console.log(time)
        // if (Number(type) === 1) {
        getQxNeedmeritsReview(row).then(res => {
            // console.log(res)
          if (Number(type) === 0) {
            this.huiguKind = '待回顾'
            if (res.data.hasOwnProperty('data') && res.data.data !== null) {
              this.huiguKind = '回顾待确认'
            }
          }
          // if (res.data.data.hgStatus === '已确认') {
          //   this.huiguKind = '回顾完成'
          // }
          if (res.data.hasOwnProperty('data') && res.data.data !== null) {
            this.sendInfo = res.data.data
            this.sendInfo.createTime = time
            if (res.data.data.hasOwnProperty('hgStatus') && res.data.data.hgStatus === '已确认') {
              this.huiguKind = '回顾完成'
            }
            if (!this.sendInfo.timeliness) {
              this.sendInfo.timeliness = this.timeliness
            }
            if (res.data.data.needPurpose) {
              this.need_purpose = this.sendInfo.needPurpose.split(',')
            }
            if (Number(type) === 1) {
              this.huiguKind = '回顾待确认'
              if (res.data.data.hgStatus === '已确认') {
                this.huiguKind = '回顾完成'
              }
            }
          } else {
            this.sendInfo.timeliness = this.timeliness
          }
        })
        // }
      })
      if (!isno) {
        this.achievementInfo = true
      }
    },
    // 批量发送
    sendSomeEmail () {
      // console.log(this.multipleSelection)
      var arr = []
      var needname = []
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(item => {
          arr.push(item.need_id)
          // console.log(item)
          needname.push(item.need_name)
        })
        var str = arr.join(',')
        var needStr = needname.join(',')
        // console.log(str)
        this.sendEmail('2', str, needStr, '回顾填写')
      }
    },
    // 发送邮件
    sendEmail (typein, id, title, huiguType) {
      var sendtype = ''
      var titlename = ''
      if (typein === '1') {
        sendtype = 'yuluan'
      } else if (typein === '2') {
        sendtype = 'fasong'
      }
      if (title) {
        titlename = title
      }
      var rows = {}
      if (huiguType) {
        rows = {
          reqId: id,
          userName: localStorage.getItem('userId'),
          type: sendtype,
          need_name: titlename,
          mailType: huiguType
        }
      } else {
        rows = {
          reqId: id,
          userName: localStorage.getItem('userId'),
          type: sendtype,
          need_name: titlename
        }
      }
      getEmailres(rows).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          if (res.data.data) {
            if (res.data.data.reslist) {
              var arr = res.data.data.reslist
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].includes('成功')) {
                  this.$message({type: 'success', message: arr[i]})
                } else {
                  this.$message({type: 'error', message: arr[i]})
                }
              }
            }
            if (res.data.data.yuluan) {
              this.yulan = res.data.data.yuluan
            }
          }
        }
        // 发送后再次渲染页面
        this.listQuery.page = 1
        this.listQuery.pageSize = 10
        if (this.activeName === 'first') {
          this.getSentData()
        } else if (this.activeName === 'second') {
          this.getUnSentData()
        }
      })
    },
    // 预览发送显示按钮
    previewFlag (id, title, mailtype) {
      console.log(id)
      this.yltype = ''
      this.dialogVisible = true
      if (mailtype) {
        this.sendEmail('1', id, title, mailtype)
        this.yltype = mailtype
      } else {
        this.sendEmail('1', id, title)
      }
      this.ylid = id
      this.yltitle = title
    },
    ylsend () {
      this.sendEmail('2', this.ylid, this.yltitle, this.yltype)
      this.dialogVisible = false
    },
    // 已发送数据
    getSentData () {
      this.LoadingFlag = true
      getAlllog(this.listQuery).then(res => {
        // alert(1)
        this.LoadingFlag = false
        // console.log(res)
        this.total = res.data.total
        this.SendtableData = res.data.data
        this.SendtableData.forEach(item => {
          item.flag = false
          if (item.mail_type === '回顾填写') {
            if (item.need_status === '已回顾待确认' || item.need_status === '已确认') {
              item.flag = true
            }
          }
          if (item.mail_type === '回顾确认' && item.need_status === '已确认') {
            item.flag = true
          }
        })
        // console.log(this.SendtableData)
      })
    },
    // 待发送数据
    getUnSentData () {
      this.LoadingFlag = true
      var senobj = this.listQuery
      senobj.statusId = '待发送'
      listByParam(this.listQuery).then(res => {
        this.LoadingFlag = false
        this.total = res.data.total
        this.tableData = res.data.data
        // console.log(res)
        // alert(2)
      })
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
      // console.log(this.multipleSelection)
      // console.log(this.multipleTable)
    },
    // 切换已发送未发送tabs
    handleClick () {
      // console.log(this.activeName)
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.listQuery.orderType = 'desc'
      this.listQuery.orderFiled = ''
      this.listQuery.statusId = ''
      if (this.activeName === 'first') {
        this.listQuery.orderFiled = 'send_time'
        this.getSentData()
        // alert(3)
        this.options = [{
          id: '成功',
          name: '成功'
        }, {
          id: '失败',
          name: '失败'
        }]
      } else if (this.activeName === 'second') {
        this.listQuery.orderFiled = 'close_days'
        this.getUnSentData()
        // alert(4)
        this.options = [{
          id: '待发送',
          name: '待发送'
        }]
      }
    },
      // 排序
    changeOrder (column, prop, order) {
      this.listQuery.orderFiled = column.prop
      this.listQuery.orderType = ''
      if (column.order === 'ascending') {
        this.listQuery.orderType = 'asc'
      } else {
        this.listQuery.orderType = 'desc'
      }
      if (this.activeName === 'first') {
        this.getSentData()
      } else if (this.activeName === 'second') {
        this.getUnSentData()
      }
    },
    // 获取当前时间最近的一天
    getOneDayTime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      var s = this.getTimeByDateOne(start)
      var e = this.getTimeByDateOne(end)
      this.changeTime = [s, e]
    },
    getTimeByDateOne (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      // const HH = (date.getHours()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    exit () {
      this.$router.go(-1)
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val
      if (this.activeName === 'first') {
        this.getSentData()
      } else if (this.activeName === 'second') {
        this.getUnSentData()
      }
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      if (this.activeName === 'first') {
        this.getSentData()
      } else if (this.activeName === 'second') {
        this.getUnSentData()
      }
    },
    timeChangepro () {
    },
    getproname () {
      // 获取所有的项目
      const grow = {
        token: this.$cookie.get('token')
      }
      getreqName(grow).then(res => {
        // console.log(res)
        if (res.data.result === 'success') {
          res.data.data.reqNamelist.unshift({project_name: '全部', project_id: ''})
          this.oaProname = res.data.data.reqNamelist
          this.forSecharName = [...res.data.data.reqNamelist]
        }
      })
    },
    changeitem () {
      for (let i = 0; i < this.projectIds.length; i++) {
        if (this.projectIds[i] === '全部') {
          this.projectIds = []
          break
        }
      }
      // console.log(this.changeTime)
      if (this.changeTime === null) {
        this.changeTime = []
      }
      // console.log(this.changeTime)

      this.searchText = ''
      this.oaProname = this.forSecharName
      this.listQuery.projectName = this.projectIds.join(',')
      // this.listQuery.statusId = this.listQuery.statusIds.join(',')
      this.listQuery.startTime = this.changeTime[0]
      this.listQuery.endTime = this.changeTime[1]
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      if (this.activeName === 'first') {
        this.listQuery.orderFiled = 'send_time'
        this.getSentData()
      } else if (this.activeName === 'second') {
        this.listQuery.orderFiled = 'close_days'
        this.getUnSentData()
      }
    },
    // 模糊查询
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.forSecharName.forEach((item, index) => {
        if (item.project_name.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.oaProname = [{project_name: '暂无数据', project_id: '', disabled: true}]
      } else {
        this.oaProname = allList
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    .achievement{
        background-color: #fff;
    }
    .moxbox{
      width: 80%;
      margin: auto;
    }
    @media screen and (max-width: 1280px) {
      .moxbox{
        width: 90%;
      }
    }
</style>

<style>
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
  .achievement .el-tabs__item.is-active{
      border-bottom: 2px solid #409eff;
  }
  .achievement .el-tabs__nav-wrap::after{
    background-color: transparent;
  }
  .achievement .el-tabs__header{
    margin: 0 15px 15px;
  }
  .achievement .el-dialog__body{
    padding:0px 0;
  }
  .achievement .el-dialog__header{
    padding: 0
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
</style>

<style lang="scss" scoped>
    .marking{
      margin-top:50px;
        .m_header{
            background-color: #a5a5a5;
            height: 32px;
            line-height: 32px;
            border-top: 0px solid #000;
            color:#000;
            font-weight:700;
        }
    }
</style>

<style lang="scss">
    .marking{
        .el-checkbox+.el-checkbox{
          margin-left: 0px;
        }
        .el-checkbox{
          margin-right:0px
        }
    }
body .el-table th.gutter{
  display: table-cell!important;
}
body .el-table colgroup.gutter{
  display: table-cell!important;
}
.el-table__body-wrapper{
  border-top: 1px solid #ebeef5;
}

.showerea .el-textarea__inner{
  // border:none;
  // border-bottom:1px solid #000;
  // background-color:#f5f7fa;
  // border-radius:0;
  padding: 0;
  // padding-top: 6px;
  // line-height: 1;
}
</style>