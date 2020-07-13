<template>
    <div class="preview">
        <!-- <p style="color:#000;font-size:20px;font-weight:700;padding:20px 0;" class="boxform">需求信息</p>
        <el-form label-width="130px" :model="formLabelAlign" class="boxform">
          <el-form-item label="项目名称">
            <el-input v-model="formLabelAlign.subject" style="width:87%;" disabled></el-input>
          </el-form-item>
          <div style="display:flex;">
              <el-form-item label="需求类别" style="flex:1;">
                <el-input v-model="formLabelAlign.trackerId" style="width:70%;" disabled></el-input>
              </el-form-item>
              <el-form-item label="涉及系统" style="flex:1;">
                <el-input v-model="formLabelAlign.projectName" style="width:70%;" disabled></el-input>
              </el-form-item>
          </div>
          <div style="display:flex;">
              <el-form-item label="发起部门" style="flex:1;">
                <el-input v-model="formLabelAlign.handleBranch" style="width:70%;" disabled></el-input>
              </el-form-item>
              <el-form-item label="发起人" style="flex:1;">
                <el-input v-model="formLabelAlign.handleAuthor" style="width:70%;" disabled></el-input>
              </el-form-item>
          </div>
          <div style="display:flex;">
              <el-form-item label="需求部门联络人" style="flex:1;">
                <el-input v-model="formLabelAlign.itBranchLiaison" style="width:70%;" disabled></el-input>
              </el-form-item>
              <el-form-item label="需求受理组" style="flex:1;">
                <el-input v-model="formLabelAlign.acceptingGroup" style="width:70%;" disabled></el-input>
              </el-form-item>
          </div>
          <div style="display:flex;">
              <el-form-item label="计划完成时间" style="flex:1;">
                <el-input v-model="formLabelAlign.dueDate" style="width:70%;" disabled></el-input>
              </el-form-item>
              <el-form-item label="实际完成时间" style="flex:1;">
                <el-input v-model="formLabelAlign.realTime" style="width:70%;" disabled></el-input>
              </el-form-item>
          </div>
          <div style="display:flex;">
              <el-form-item label="需求发起时间" style="flex:1;">
                <el-input v-model="formLabelAlign.createdOn" style="width:70%;" disabled></el-input>
              </el-form-item>
              <el-form-item label="需求实施情况" style="flex:1;">
                <el-input v-model="formLabelAlign.needsStatus" style="width:70%;" disabled></el-input>
              </el-form-item>
          </div>
            <el-form-item label="应用成效评价标准">
              <el-input type="textarea" v-model="formLabelAlign.statuss" style="width:87%;" disabled></el-input>
            </el-form-item>
        </el-form> -->

        <!-- <p style="color:#000;font-size:20px;font-weight:700;padding:15px 0;" class="boxform">绩效回顾</p>
        <el-form label-width="130px" :model="sendInfo" class="boxform">
            <div style="display:flex;">
                <el-form-item label="填报时间" style="flex:1;">
                  <el-input v-model="sendInfo.createTime" style="width:70%;" disabled></el-input>
                </el-form-item>
                <el-form-item label="需求响应及时性" style="flex:1;">
                  <el-input v-if="timeliness==='1'" placeholder="如期完成提交验收" style="width:70%;" disabled></el-input>
                  <el-input v-if="timeliness==='2'" placeholder="延期提交验收" style="width:70%;" disabled></el-input>
                </el-form-item>
            </div>

            <el-form-item label="需求实现目的" prop="type">
              <el-checkbox-group v-model="need_purpose" :disabled="isShow">
                <el-checkbox label="1" name="type">提升内部使用体验</el-checkbox>
                <el-checkbox label="2" name="type">提高效率</el-checkbox>
                <el-checkbox label="3" name="type">内部控制</el-checkbox>
                <el-checkbox label="4" name="type">满足合规要求</el-checkbox>
                <el-checkbox label="5" name="type">节约成本</el-checkbox>
                <el-checkbox label="6" name="type">其他</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="应用绩效回顾等级">
              <el-radio-group v-model="sendInfo.reviewLevel" :disabled="isShow">
                <el-radio label="1">A 超出目标，效用显著</el-radio>
                <el-radio label="2">B 符合目标，完成预期</el-radio>
                <el-radio label="3">C 低于目标，待优化</el-radio>
                <el-radio label="4">D 成效暂不明确，建议继续跟踪</el-radio>
                <el-radio label="5">E 未达成目标，已弃用或拟弃用</el-radio>
                <el-radio label="6">F 其他</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="功能推广或使用情况说明" class="tetare">
              <el-input type="textarea" v-model="sendInfo.messageDetail" style="width:87%;" :disabled="isShow"></el-input>
            </el-form-item>
        </el-form> -->

        <!-- <div style="text-align:center">
            <el-button style="" @click="submit" v-if="Number(this.suborSure) === 0" :disabled="isShow" :class="{hasColor :!isShow}">提交</el-button>
            <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="confirmSure" v-if="Number(this.suborSure) === 1">确认</el-button>
        </div> -->

        <div class="marking" style="margin-top:0px;height:100vh;width:100%;margin:auto;overflow-y:auto;">
            <el-row>
            <el-col :span="19" style="background-color:#c8c8c8;height:100vh;overflow-y:auto;">
                <div style="background-color:#fff;width:70%;margin:auto;min-height:100vh">
                    <div style="border:1px solid #000;margin:0 70px;padding:0px 15px;height:100%">
                    <div class="m_header">
                        需求成效评价
                    </div>
                    <div class="m_content">
                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <span style="margin-right:20px;">需求名称：</span>
                          <div style="border:1px solid #ccc;padding:7px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa">{{formLabelAlign.subject}}-{{formLabelAlign.handleBranch}}-{{formLabelAlign.handleAuthor}}-
                            <span v-if="formLabelAlign.createdOn">{{formLabelAlign.createdOn.substr(0,10)}}</span>
                          </div>
                        </div>

                        

                        <el-form :rules="rules" :model="sendInfo" style="margin:0 0 15px 0" ref="formName">

                        <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                          <div style="flex:1;display:flex;align-items:center;margin-right:10px;">
                            <span style="margin-right:20px;">填报时间：</span>
                            <div v-if="formLabelAlign.tb_time" style="border:1px solid #ccc;padding:10px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa">{{formLabelAlign.tb_time}}</div>
                            <div v-else style="border:1px solid #ccc;padding:10px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa">{{sendInfo.createTime}}</div>
                          </div>
                          <div style="flex:1;display:flex;align-items:center;margin-left:10px;" class="needlevel">
                            <el-form-item label="需求实现满意度" prop="reviewLevel" style="width:100%;display:flex;margin-bottom:0;">
                              <el-select v-model="sendInfo.reviewLevel" style="flex:1;width:100%;" :disabled="isShow" placeholder="" >
                                <el-option
                                  v-for="item in options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                        </div>

                        	<el-form-item label="实现目的（可多选）" prop="need_purpose" >
                             <el-checkbox-group v-model="need_purpose" style="display:flex;flex-flow:wrap;" :disabled="isShow">
                                <el-checkbox label="1" style="width:33.3%">提升内部使用体验</el-checkbox>
                                <el-checkbox label="2" style="width:33.3%">提高效率</el-checkbox>
                                <el-checkbox label="3" style="width:33.3%">内部控制</el-checkbox>
                                <el-checkbox label="4" style="width:33.3%">满足合规要求</el-checkbox>
                                <el-checkbox label="5" style="width:33.3%">节约成本</el-checkbox>
                                <el-checkbox label="6" style="width:33.3%">其他</el-checkbox>
                              </el-checkbox-group>
                        	</el-form-item>

                          <div style="display:flex;margin-bottom:20px;align-items:center;">
                            <div style="flex:2;display:flex;align-items:center;">
                              <span style="margin-right:10px;">需求完成及时性：</span>
                              <div style="border:1px solid #ccc;padding:10px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa;">
                                <div v-if="sendInfo.timeliness==='1'">如期完成提交验收</div>
                                <div v-if="sendInfo.timeliness==='2'" style="display:flex;align-items:center;" class="showerea">
                                  延期提交验收
                                </div>
                              </div>
                            </div>
                            <div style="flex:3;margin-left:10px;" v-if="sendInfo.timeliness==='2'" class="showerea">
                                <el-form-item label="延期原因" prop="delayCause" style="flex:1;margin-bottom:0;">
                                  <el-input v-model="sendInfo.delayCause" :maxlength=50 :disabled="isShow"></el-input>
                                </el-form-item>
                            </div>
                          </div>

                          <el-form-item label="评价总结" prop="messageDetail" >
                              <el-input type="textarea" :maxlength=500 placeholder="【请结合“需求应用成效评价标准”总结需求上线后的应用效果，例如需求相关系统功能的使用情况等】"  v-model="sendInfo.messageDetail" style="width:100%;" :disabled="isShow"></el-input>
                          </el-form-item>

                          <!-- remaining_problems -->
                          <el-form-item label="遗留问题或待优化事项：" prop="remainingProblems">
                              <el-input type="textarea" 
                              v-model="sendInfo.remainingProblems" 
                              :maxlength=500
                              style="width:100%;" :disabled="isShow">
                              </el-input>
                          </el-form-item>
                        </el-form>

                    </div>
                    <div class="m_header">
                        需求送审详情
                    </div>
                    <div style="text-align:center;color:#4b78cd;">
                        <h2>{{formLabelAlign.subject}}</h2>
                    </div>
                    <div class="m_midfoot" style="margin-top:15px;">
                        <!-- <el-table
                          :data="itemData"
                          :span-method="arraySpanMethod"
                          :show-header="false"
                          border
                          style="width: 100%">
                          <el-table-column prop="one" width="180" align="center">
                          </el-table-column>
                          <el-table-column prop="two" align="center">
                            <template slot-scope="scope">
                              <div v-if="scope.row.one==='需求类别'">
                                {{formLabelAlign.FIELD0017_NAME}}
                              </div>
                              <div v-if="scope.row.one==='需求紧急度'">
                                {{formLabelAlign.FIELD0019_NAME}}
                              </div>
                              <div v-if="scope.row.one==='需求部门联络人'">
                                {{formLabelAlign.itBranchLiaison}}
                              </div>
                              <div v-if="scope.row.one==='需求受理组'">
                                {{formLabelAlign.acceptingGroup}}
                              </div>
                              <div v-if="scope.row.one==='计划提交验收时间'">
                                {{formLabelAlign.dueDate}}
                              </div>
                              <div v-if="scope.row.one==='是否涉及财务费用'">
                              </div>
                              <div v-if="scope.row.one==='需求实施情况'">
                                {{formLabelAlign.FIELD0027}}
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="three" align="center">
                          </el-table-column>
                          <el-table-column prop="four" align="center">
                            <template slot-scope="scope">
                              <div v-if="scope.row.three==='涉及系统类别'">
                                {{formLabelAlign.FIELD0026_NAME}}
                              </div>
                              <div v-if="scope.row.three==='涉及系统'">
                                {{formLabelAlign.projectName}}
                              </div>
                              <div v-if="scope.row.three==='IT部门预沟通联络人'">
                                {{formLabelAlign.field0033}}
                              </div>
                              <div v-if="scope.row.three==='实际提交验收时间'">
                                {{formLabelAlign.realTime}}
                              </div>
                              <div v-if="scope.row.three==='是否涉及合规审批'">
                              </div>
                            </template>
                          </el-table-column>
                        </el-table> -->
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
                          <!-- <pre>{{formLabelAlign.field0005}}</pre> -->
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
                          <div v-else-if="huiguKind==='回顾待确认'">请IT专员对该需求的成效评价意见进行复核，如有异议请直接修改左侧表单；点击“确认”按钮后，该需求成效评价完成。</div>
                          <div v-else-if="huiguKind==='回顾完成'">该需求已完成成效评价，如有其他意见请联系本单位对口IT业务经理反馈，谢谢！</div>
                          <div style="text-align:right;position:absolute;bottom:90px;right:30px;">
                            <el-button style="border:1px solid #aaa" @click="submit" v-if="Number(this.suborSure) === 0" :disabled="isShow" :class="{hasColor :!isShow}">提交</el-button>
                            <el-button style="color:#fff;background-color:#4b78cd;border:none;" @click="confirmSure" v-if="Number(this.suborSure) === 1">确认</el-button>
                          </div>
                        </div>
                        <!-- <el-button style="color:#fff;background-color:#4b78cd;border:none;float:right;margin-top:15px;">提交</el-button> -->
                        
                    </div>

                    <div style="height:52%;padding:0 0 0 10px;background-color:#fff;overflow-y:auto;">
                      <div style="padding:15px 10px;background-color:#fff;border:1px solid #ccc;min-height:100%;">
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
    </div>
</template>

<script>
// let Base64 = require('js-base64').Base64
import {systemlogStatis} from '@/api/modules/all'
import {yuluan, getQxNeedmeritsReview, addHistory} from '@/api/EmailPost/preview.js'
export default {
  data () {
    let aadd = (rule, value, callback) => {
      if (this.need_purpose.length === 0) {
        callback(new Error('请重新选择'))
      } else {
        callback()
      }
    }
    let level = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请重新选择'))
      } else {
        callback()
      }
    }
    let mess = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请重新输入'))
      } else if (value.length > 499) {
        callback(new Error('最多只能保存500字，超出部分无法保存'))
      } else {
        callback()
      }
    }
    let DC = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入延期原因'))
      } else if (value.length > 49) {
        callback(new Error('最多只能保存50字，超出部分无法保存'))
      } else {
        callback()
      }
    }
    let waitoptimize = (rule, value, callback) => {
      if (value.length > 499) {
        callback(new Error('最多只能保存500字，超出部分无法保存'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        need_purpose: [
          { validator: aadd, trigger: 'change', required: true }
        ],
        delayCause: [{validator: DC, trigger: 'blur', required: true}],
        reviewLevel: [{validator: level, trigger: 'change', required: true}],
        messageDetail: [{validator: mess, trigger: 'blur', required: true}],
        remainingProblems: [{validator: waitoptimize, trigger: 'blur'}]
      },
      formLabelAlign: {
        name: '',
        region: '',
        type: '',
        desc: '',
        resource: '0',
        time: '',
        createdOn: ''
      },
      timeliness: '',
      need_purpose: [],
      sendInfo: {
        pass: '',
        // 需求id
        delayCause: '',
        remainingProblems: '',
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
      suborSure: 0,
      isShow: false,
      btnFlag: true,
      // marking
      tableData: [{
        id: '需求名称',
        name: '关于环境部署管理系统项目联合送审-金融科技部-产品设计与研发管理处-质量保障组-高美玲-2020-02-06'
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
        {one: '需求实施情况', two: '已完成'}
      ],
      checkList: ['1', '3'],
      options: [{
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
      huiguKind: ''
    }
  },
  created () {
    if (typeof (this.$route.query.openType) !== 'undefined' && this.$route.query.project_id !== '') {
      this.suborSure = this.$route.query.openType
    }
    this.getdata()
    // console.log(this.$route.query.need_id)
  },
  mounted () {
    // this.getOneHoursTime()
    let allObj = {
      url: this.$route.path,
      moduleName: '邮件发送',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  methods: {
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      //   console.log(rowIndex)
      //   console.log(columnIndex)
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
    // 确认
    confirmSure () {
      this.$refs.formName.validate((vaild) => {
        if (vaild) {
          this.huiguKind = '回顾完成'
          this.sendInfo.needId = this.$route.query.need_id
          this.sendInfo.needPurpose = this.need_purpose.join(',')
          this.sendInfo.createAuthor = this.$route.query.createAuthor
          if (!this.sendInfo.createTime) {
            this.getOneHoursTime()
          }
          var sendobj = this.sendInfo
          sendobj.token = this.$cookie.get('token')
          sendobj.openType = this.$route.query.openType
          addHistory(sendobj).then(res => {
            if (res.data.result === 'success') {
              this.$message({type: 'success', message: '确认成功'})
              setTimeout(() => {
                window.opener = null
                window.open('', '_self')
                // window.location.href = 'about:blank'
                window.close()
                // javascript:window.opener=null;window.open('','_self');window.close();
              }, 1000)
            }
          })
        } else {
          return false
        }
      })
    },
    submit () {
      this.$refs.formName.validate((vaild) => {
        if (vaild) {
          this.sendInfo.needId = this.$route.query.need_id
          this.sendInfo.needPurpose = this.need_purpose.join(',')
          // Base64.decode(this.$route.query.createAuthor)
          this.sendInfo.createAuthor = this.$route.query.createAuthor
          // this.sendInfo.createAuthor = decodeURIComponent(encodeURIComponent(this.$route.query.createAuthor))
          if (!this.sendInfo.createTime) {
            this.getOneHoursTime()
          }
          this.sendInfo.department = this.formLabelAlign.handleBranch
          // addQxNeedmeritsReview
          var sendobj = this.sendInfo
          sendobj.openType = this.$route.query.openType
          sendobj.token = this.$cookie.get('token')
          // console.log(this.sendInfo)
          addHistory(sendobj).then(res => {
            if (res.data.result === 'success') {
              this.$message({type: 'success', message: '提交成功'})
              setTimeout(() => {
                window.opener = null
                window.open('', '_self')
                window.close()
              }, 1000)
            }
          })
        } else {
          return false
        }
      })
    },
    timestampToTime (timestamp) {
      var date = new Date(timestamp * 1000) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return Y + M + D + h + m + s
    },
    getdata () {
      let row = {
        reqId: this.$route.query.need_id,
        token: this.$cookie.get('token')
        // reqId: '4808618746438368114'
      }
      yuluan(row).then(response => {
        if (response.data.data.dueDate) {
          response.data.data.dueDate = response.data.data.dueDate.substr(0, 10)
        }
        if (response.data.data.realTime) {
          response.data.data.realTime = response.data.data.realTime.substr(0, 10)
        }
        if (response.data.data.field0005) {
          // console.log(response.data.data.field0005)
          // var strarr = response.data.data.field0005.split(' ')
          // let str = ''
          // let newarr = []
          // for (let i = strarr.length; i >= 0; i--) {
          //   if (strarr[i] === '' && strarr[i - 1] !== '') {
          //     strarr[i] = '<br/>'
          //   }
          //   newarr.unshift(strarr[i])
          // }
          // str = newarr.join(',').replace(/,/g, '&nbsp;')
          // response.data.data.field0005 = str
          response.data.data.field0005 = response.data.data.field0005.replace(/ {4}/g, '<br/>&nbsp;&nbsp;')
        }
        this.formLabelAlign = response.data.data

        // console.log(this.formLabelAlign.dueDate)
        // console.log(this.formLabelAlign.realTime)
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
        // console.log(this.sendInfo)
        getQxNeedmeritsReview(row).then(res => {
          if (res.data.hasOwnProperty('data') && res.data.data !== null) {
            this.sendInfo = res.data.data
            // this.sendInfo.createTime = res.data.data.send_time
            this.sendInfo.createTime = time
            if (!this.sendInfo.timeliness) {
              this.sendInfo.timeliness = this.timeliness
            }
            if (this.sendInfo.needPurpose) {
              this.need_purpose = this.sendInfo.needPurpose.split(',')
              // this.sendInfo.need_purpose = this.sendInfo.needPurpose.split(',')
            }
          } else {
            this.sendInfo.timeliness = this.timeliness
            // this.sendInfo.timeliness = '2'
          }
          // console.log(this.sendInfo.reviewLevel)
          if (Number(this.suborSure) === 0) {
            // if (res.data.data === null) {
            //   // 可以填一次底下不置灰
            //   this.isShow = false
            //   this.huiguKind = '待回顾'
            // } else if (res.data.data.hgStatus === '已确认' || Number(this.sendInfo.reviewLevel) !== 4) {
            //   // 全部置灰
            //   this.isShow = true
            //   this.huiguKind = '回顾待确认'
            //   // this.btnFlag = false
            // } else {
            //   this.huiguKind = '待回顾'
            //   this.isShow = false
            // }
            if (res.data.hasOwnProperty('data') && res.data.data === null) {
              // 可以填一次底下不置灰
              this.isShow = false
              this.huiguKind = '待回顾'
            } else if (res.data.data.hgStatus === '已确认') {
              this.huiguKind = '回顾完成'
              this.isShow = true
            } else {
              this.huiguKind = '回顾待确认'
              this.isShow = true
            }
          }
          if (Number(this.suborSure) === 1) {
            this.isShow = false
            this.huiguKind = '回顾待确认'
            if (res.data.data.hgStatus === '已确认') {
              this.huiguKind = '回顾完成'
            }
          }
        })
      })
    },
    getOneHoursTime () {
      const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const HH = (date.getHours()).toString().padStart(2, 0)
      const mm = (date.getMinutes()).toString().padStart(2, 0)
      const ss = (date.getSeconds()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD} ${HH}:${mm}:${ss}`
      // console.log(time)
      this.sendInfo.createTime = time
    }
  }
}
</script>

<style lang="scss" scoped>
    .preview{
        width: 100%;
        min-height: 100vh;
        // height: 100vh;
        // margin-tOP:20px;
        // background-color: #fff;
    }
    .boxform{
      width: 60%;
      margin: auto;
    }
    
  @media screen and (max-width: 1280px) {
    .boxform{
      width: 80%;
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
        margin-bottom: 25px;
    }
    .hasColor{
      color:#fff;
      background-color:#4b78cd;
      border:none;
    }
</style>

<style lang="scss" scoped>
    .marking{
      margin-top:50px;
        .m_header{
            background-color: #a5a5a5;
            // margin-top: 15px;
            // padding:12px 0;
            height: 32px;
            line-height: 32px;
            border-top: 1px solid #000;
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
          margin-right: 0px;
        }
        .el-form-item{
          display: flex;
          align-items: center;
          .el-form-item__label{
            // width:150px;
            text-align: left;
            line-height: 24px;
            position: relative;
            &::before{
              position:absolute;
              right:1px;
              top:3px;
            }
          }
          .el-form-item__content{
            flex:1;
            line-height: 25px;
          }
        }
    }
    .showerea .el-textarea__inner{
      // border:none;
      // border-bottom:1px solid #000;
      // background-color:#f5f7fa;
      // border-radius:0;
      padding: 0;
      // padding-top: 10px;
      // line-height: 1;
    }
</style>