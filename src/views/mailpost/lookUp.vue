<template>
  <div>
    <div v-if="isErr" style="margin:15px;"><h4>{{$route.query.errmessage}}</h4></div>
      <div class="marking" style="margin-top:0px;height:100vh;width:100%;margin:auto;overflow-y:auto;" v-else-if="!isErr">
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

                  <div style="display:flex;align-items:center;font-size:14px;margin:10px 0;">
                    <div style="flex:1;display:flex;align-items:center;margin-right:10px;">
                      <span style="margin-right:20px;">填报时间：</span>
                      <div v-if="formLabelAlign.tb_time" style="border:1px solid #ccc;padding:10px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa;">{{formLabelAlign.tb_time}}</div>
                      <div v-else style="border:1px solid #ccc;padding:10px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa">{{sendInfo.createTime}}</div>
                    </div>

                    <div style="flex:1;display:flex;align-items:center;margin-left:10px;">
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
                  
                  <div style="display:flex;margin-bottom:20px;align-items:center;">
                    <div style="flex:2;display:flex;align-items:center;">
                      <span style="margin-right:10px;">需求完成及时性：</span>
                      <div style="border:1px solid #ccc;padding:10px 5px;flex:1;font-size:14px;min-height:32px;color:#00f;background-color:#f5f7fa;">
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
                    <div v-else-if="huiguKind==='回顾待确认'">请IT专员对该需求的成效评价意见进行复核，如有异议请直接修改左侧表单；点击“确认”按钮后，该需求成效评价完成。</div>
                    <div v-else-if="huiguKind==='回顾完成'">该需求已完成成效评价，如有其他意见请联系本单位对口IT业务经理反馈，谢谢！</div>
                  </div>
              </div>

              <div style="height:52%;padding:0 0 0 10px;background-color:#fff;overflow-y:auto;">
                <div style="padding:15px 10px;background-color:#fff;border:1px solid #ccc;height:100%;border-bottom:none;">
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
import {yuluan, getQxNeedmeritsReview} from '@/api/EmailPost/preview.js'
import {systemlogStatis} from '@/api/modules/all'
export default {
  data () {
    return {
      need_purpose: [],
      timeliness: '',
      sendInfo: {
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
      isShow: true,
      isErr: true
    }
  },
  created () {
    if (this.$route.query.errmessage) {
      this.isErr = true
    } else {
      this.isErr = false
      let id = this.$route.query.reqId
      let type = this.$route.query.type
      this.eseeachievement(id, type)
    }
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
  },
  methods: {
    eseeachievement (id, type) {
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
          console.log(type)
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
            // console.log(this.huiguKind)
          } else {
            this.sendInfo.timeliness = this.timeliness
          }
        })
        // }
      })
    }
  }
}
</script>

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
          margin-right: 0px;
        }
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