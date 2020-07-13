<template>
    <div class="marking" style="margin-top:20px;height:1200px;">
        <el-row>
            <el-col :span="17">
                <div style="margin-right:20px;background-color:#fff;border:1px solid #ccc;padding:5px 15px;height:1200px;">
                    <div class="m_header">
                        绩效回顾
                    </div>
                    <div class="m_content">
                        <el-table
                          :data="tableData"
                          :span-method="objectSpanMethod"
                          :show-header="false"
                          border
                          style="width: 100%; margin-top: 20px">
                          <el-table-column
                            prop="id"
                            label="ID"
                            width="180">
                          </el-table-column>
                          <el-table-column
                            prop="name"
                            label="姓名">
                            <template slot-scope="scope">
                                <div v-if="scope.row.type==='some'">
                                    <el-checkbox-group v-model="checkList" style="display:flex;flex-flow:wrap;">
                                        <el-checkbox label="1" style="width:33.3%">提升内部使用体验</el-checkbox>
                                        <el-checkbox label="2" style="width:33.3%">提高效率</el-checkbox>
                                        <el-checkbox label="3" style="width:33.3%">内部控制</el-checkbox>
                                        <el-checkbox label="4" style="width:33.3%">满足合规要求</el-checkbox>
                                        <el-checkbox label="5" style="width:33.3%">节约成本</el-checkbox>
                                        <el-checkbox label="6" style="width:33.3%">其他</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                                <div v-else-if="scope.row.type==='select'">
                                    <el-select v-model="scope.row.name" style="width:100%;">
                                      <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                      </el-option>
                                    </el-select>
                                </div>
                                <div v-else>
                                    {{scope.row.name}}
                                </div>
                            </template>
                          </el-table-column>
                          <el-table-column
                            prop="amount1"
                            label="数值 1（元）">
                          </el-table-column>
                          <el-table-column
                            prop="amount2"
                            label="数值 2（元）">
                          </el-table-column>
                        </el-table>
                    </div>
                    <div class="m_header">
                        需求送审详情
                    </div>
                    <div style="border-bottom:1px solid #ccc;text-align:center;color:#4b78cd;">
                        <h2>关于环境部署管理系统项目联合送审</h2>
                    </div>
                    <div class="m_midfoot" style="margin-top:15px;">
                        <el-table
                          :data="itemData"
                          :span-method="arraySpanMethod"
                          :show-header="false"
                          border
                          style="width: 100%">
                          <el-table-column prop="one" width="180">
                          </el-table-column>
                          <el-table-column prop="two">
                          </el-table-column>
                          <el-table-column prop="three">
                          </el-table-column>
                          <el-table-column prop="four">
                          </el-table-column>
                        </el-table>
                    </div>
                    <div class="m_foot">
                        <p>送审原因及说明：</p>
                        <div style="border:1px solid #ccc;border-top:3px solid #000;background-color:#eee">
                            <p>各位领导，各位同事</p>
                            <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
                        </div>

                        <p>需求应用成效评价标准（即该需求在实际应用中将产生的价值体现，功能需求必填并请尽量填写量化指标），如预期使用量、开户数、交易量等）</p>
                        <div style="border:1px solid #ccc;border-top:3px solid #000;background-color:#eee">
                            <p>符合使用预期</p>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="7">
                <div style="height:1200px;display:flex;flex-flow:column;">
                    <div style="background-color:#fff;overflow:hidden;padding:15px 10px;">
                        <div style="background-color:#eff3f5;text-align:center;padding:15px 0;">温馨提示</div>
                        <div style="border:1px solid #eee;padding:50px 30px;height:400px;">
                            请需求发起人对该需求的响应及时性、实现结果满意度等进行评价，填写左侧表单；点击“提交”按钮后，该评价意见流转至IT专员进行复核。
                        </div>
                        <el-button style="color:#fff;background-color:#4b78cd;border:none;float:right;margin-top:15px;">提交</el-button>
                    </div>

                    <div style="padding:15px 10px;background-color:#fff;margin-top:15px;flex:1;">
                        <p>变动历史</p>
                        <p>2020-05-28    10:43:45</p>
                        <p>PMO 发起绩效回顾流程</p>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  data () {
    return {
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
        {one: '需求部门联络人', two: '曾聪', three: 'IT部门预沟通联络人', four: '李旭、高美铃、曾聪、陈祥凯、林宗良'},
        {one: '需求受理组', two: '金融科技部-产品设计与研发管理处'},
        {one: '计划提交验收时间', two: '2020-06-30', three: '实际提交验收时间', four: '2020-01-16'},
        {one: '是否涉及财务费用', two: '否', three: '是否涉及合规审批', four: '否'},
        {one: '需求实施情况', two: '已完成'}
      ],
      checkList: ['1', '3'],
      options: [{
        value: '1',
        label: 'A超出目标,效用显著'
      }, {
        value: '2',
        label: 'B符合目标,完成预期'
      }, {
        value: '3',
        label: 'C低于目标,待优化'
      }, {
        value: '4',
        label: 'D成效暂不明确,建议继续跟踪'
      }, {
        value: '5',
        label: 'E未达成目标,已弃用或拟弃用'
      }, {
        value: '6',
        label: 'F其他'
      }]
    }
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
    }
  }
}
</script>

<style lang="scss" scoped>
    .marking{
        .m_header{
            background-color: #a5a5a5;
            margin-top: 15px;
            padding:12px 0;
            border-top: 3px solid #000;
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
    }
</style>