<template>
    <div class="mailpost">
      <el-row class="mailhead" v-if="activeName==='first'">
        <el-col :span="6">
          <span>项目名称</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span>策略名称</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span>事务</span>
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="mailtabs">
        <el-tab-pane label="邮件配置" name="first">
          <el-row style="margin:15px 0">
            <el-col :span="24">
              <div class="mailbox" style="float:right">
                <el-button style="padding:10px 15px;background-color:#4b78cd;border:none;color:#fff;" @click="dialogVisible=true">邮件服务器</el-button>
                <el-button style="padding:10px 15px;background-color:#4b78cd;border:none;color:#fff;" @click="dialogconfig=true">新建策略</el-button>
              </div>
            </el-col>
          </el-row>
          <el-table :data="tableData" style="width: 100%" border @sort-change="productchangeOrder">
            <el-table-column type="index" label="序号" width="60" align="center">
            </el-table-column>
            <el-table-column prop="name" label="事务" width="180" align="center" sortable="custom">
            </el-table-column>
            <el-table-column prop="name" label="策略名称" align="center">
            </el-table-column>
            <el-table-column prop="name" label="项目名称" align="center" sortable="custom">
            </el-table-column>
            <el-table-column prop="name" label="收件人" align="center">
            </el-table-column>
            <el-table-column prop="name" label="状态" align="center" sortable="custom">
            </el-table-column>
            <el-table-column prop="name" label="操作" align="center">
              <template slot-scope="scope">
                <el-button style="padding:7px 15px;background-color:#4b78cd;border:none;color:#fff;" @click="dialogconfig=true">配置</el-button>
                <el-button style="padding:7px 15px;background-color:#7aca53;border:none;color:#fff;" @click="dialogconfig=true">发送</el-button>
                <el-button style="padding:7px 15px;background-color:#f56c6c;border:none;color:#fff;" @click="delect">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="发送历史" name="second">
          <el-row class="mailhead">
            <el-col :span="24">
              <span>事件范围</span>
              <el-date-picker
                v-model="mailtime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false">
              </el-date-picker>
            </el-col>
          </el-row>

          <el-row class="mailhead">
            <el-col :span="6">
              <span>项目名称</span>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span>策略名称</span>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span>事务</span>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <span>发送状态</span>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="margin:15px 0;">
            <el-col :span="4" style="margin-left:15px;">
              <div class="mailtit success">
                <p>发送成功</p>
                <span>8</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="mailtit fail">
                <p>发送失败</p>
                <span>0</span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table :data="tableData" style="width: 100%" border @sort-change="productchangeOrder">
                <el-table-column type="index" label="序号" width="60" align="center">
                </el-table-column>
                <el-table-column prop="name" label="事务" width="120" align="center" sortable="custom">
                </el-table-column>
                <el-table-column prop="name" label="服务" width="120" align="center" sortable="custom">
                </el-table-column>
                
                <el-table-column prop="name" label="ip" width="120" align="center" sortable="custom">
                </el-table-column>
                <el-table-column prop="name" label="策略" width="120" align="center" sortable="custom">
                </el-table-column>
                
                <el-table-column prop="name" label="发送时间" width="150" align="center" sortable="custom">
                </el-table-column>
                
                <el-table-column prop="name" label="项目" width="120" align="center" sortable="custom">
                </el-table-column>
                <el-table-column prop="address" label="收件人">
                </el-table-column>
                
                <el-table-column prop="name" label="发送详情" width="120" align="center">
                </el-table-column>
                
                <el-table-column prop="name" label="发送状态" width="120" align="center" sortable="custom">
                  <template slot-scope="scope">
                    <!-- <el-button type="success" plain>发送失败</el-button> -->
                    <el-button type="danger" plain>发送失败</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
        <el-row>
          <el-col :span="24" class="pagerow">
            <el-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              :total="totalPage"
              layout="total, sizes, prev, pager, next">
            </el-pagination>
          </el-col>
        </el-row>
        <!-- 邮件服务器 -->
        <el-dialog
          title="邮件服务器"
          :visible.sync="dialogVisible"
          width="40%"
          :modal='false'
          :close-on-click-modal='false'
          :before-close="handleClose">
          <div style="display:flex;">
            <div class="mailputs">
              <span style="width:30%">发送服务器<span style="color:red">*</span></span>
              <el-input v-model="inputs.server" style="width:50%"></el-input>
            </div>
            <div style="display:flex;width:30%;align-items:center;">
              <span style="width:30%">端口<span style="color:red">*</span></span>
              <el-input v-model="inputs.port" style="width:70%"></el-input>
            </div>
          </div>
          <div style="margin:20px 0;">
            <div class="mailputs">
              <span style="width:30%">账号<span style="color:red">*</span></span>
              <el-input v-model="inputs.user" style="width:50%"></el-input>
            </div>
          </div>
          <div>
            <div class="mailputs">
              <span style="width:30%">密码<span style="color:red">*</span></span>
              <el-input v-model="inputs.pwd" style="width:50%" type="password"></el-input>
            </div>
          </div>
          <!-- <span slot="footer" class="dialog-footer"> -->
            <el-row style="margin:25px 0">
              <el-col :span="24" class="diaofooter">
                <el-button @click="cancel">取 消</el-button>
                <el-button @click="dialogVisible = false" style="background-color:#4b78cd;color:#fff">确 定</el-button>
              </el-col>
            </el-row>
          <!-- </span> -->
        </el-dialog>
        <!-- 配置策略的model框 -->
        <el-dialog
          title="策略配置"
          :visible.sync="dialogconfig"
          width="70%"
          top='6vh'
          :modal='true'
          :close-on-click-modal='false'
          :before-close="handleClose">
          <!-- <span slot="footer" class="dialog-footer"> -->
            <div class="dioconfig">
              <span>策略名称<span style="color:red;width:20%">*</span></span>
              <el-input v-model="inputs.pwd" style="width:70%"></el-input>
            </div>
            <div class="dioconfig">
              <span>项目<span style="color:red;width:20%">*</span></span>
              <el-select v-model="value" placeholder="请选择" style="width:70%">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="dioconfig">
              <span>事务<span style="color:red;width:20%">*</span></span>
              <el-select v-model="value" placeholder="请选择" style="width:30%">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="dioconfig">
              <span>触发策略<span style="color:red;width:20%">*</span></span>
              <el-radio-group v-model="radio">
                <el-radio :label="3">手动</el-radio>
                <el-radio :label="6">自动发送</el-radio>
                <el-radio :label="9">定时</el-radio>
              </el-radio-group>
            </div>
            <div class="dioconfig">
              <span>收件人<span style="color:red;width:20%">*</span></span>
              <el-select v-model="value" placeholder="请选择" style="width:70%">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="dioconfig">
              <span>抄送</span>
              <el-select v-model="value" placeholder="请选择" style="width:30%">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="dioconfig">
              <span>邮件模板<span style="color:red;width:20%">*</span></span>
              <el-radio-group v-model="radio">
                <el-radio :label="3">手工</el-radio>
                <el-radio :label="6">sonar</el-radio>
                <el-radio :label="9">自动化</el-radio>
              </el-radio-group>
            </div>
            <div class="dioconfig">
              <span>发件人<span style="color:red;width:20%">*</span></span>
              <el-input v-model="inputs.pwd" style="width:70%"></el-input>
            </div>
            <div class="dioconfig">
              <span>标题<span style="color:red;width:20%">*</span></span>
              <el-input v-model="inputs.pwd" style="width:70%"></el-input>
            </div>
            <div class="dioconfig" style="height:300px;">
              <span>正文<span style="color:red;width:20%">*</span></span>
              <quill-editor :options='editorOption'  ref="editorOption"  v-model="textabout" style="height:250px;"></quill-editor>           
            </div>

            <el-row style="margin:25px 0">
              <el-col :span="24" class="diaofooter" style="margin-top:30px;">
                <el-button @click="dialogconfig = false">取 消</el-button>
                <el-button style="background-color:#4b78cd;color:#fff">预 览</el-button>
                <el-button style="background-color:#4b78cd;color:#fff" @click="dialogconfig = false">确 定</el-button>
              </el-col>
            </el-row>
          <!-- </span> -->
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'sda',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      activeName: 'first',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      pageIndex: 1,
      pageSize: 10,
      orderType: 'desc',
      orderKey: 'thing',
      totalPage: 4,
      mailtime: [],
      dialogVisible: false,
      dialogconfig: false,
      inputs: {
        server: '',
        port: '',
        user: '',
        pwd: ''
      },
      radio: 3,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['code-block'],
            [{'header': 1}, {'header': 2}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            // [{'size': ['small', false, 'large', 'huge']}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'color': []}, {'background': []}],
            // [{'font': []}],
            [{'align': []}]
            // ['image']
          ]
        }
      },
      textabout: ''
    }
  },
  created () {
    this.getmailtime()
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab)
      this.pageIndex = 1
      this.pageSize = 10
      this.orderType = 'desc'
      this.orderKey = 'thing'
    },
    sizeChangeHandle (val) {
      console.log(val)
    },
    currentChangeHandle (val) {
      console.log(val)
    },
    getmailtime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      var s = this.getTimeByDate(start)
      var e = this.getTimeByDate(end)
      this.mailtime = [s, e]
    },
    getTimeByDate (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD}`
      return time
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 退出遮罩层
    cancel () {
      this.inputs.server = ''
      this.inputs.port = ''
      this.inputs.user = ''
      this.inputs.pwd = ''
      this.dialogVisible = false
    },
    // 删除按钮是否删除
    delect () {
      this.$confirm('确认删除吗？')
        .then(_ => {
          // 操作数据删除数据
          console.log(123)
        })
        .catch(_ => {})
    },
    // 排序的方法
    productchangeOrder (column, prop, order) {
      // this.listQuery.orderkey = column.prop
      // this.listQuery.orderType = ''
      // if (column.order === 'ascending') {
      //   this.listQuery.orderType = 'asc'
      // } else {
      //   this.listQuery.orderType = 'desc'
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
    .mailpost{
      background-color: #fff;
      // margin-top: 44px;
      .mailhead{
        height: 50px;
        line-height: 50px;
        padding: 0 15px;
        span{
          margin-right:15px;
        }
      }
      .mailtabs{
        padding: 0 15px;
      }
      .pagerow{
        display: flex;
        justify-content: flex-end;
        padding: 10px 15px;
      }
      .mailtit{
        width: 190px;
        height: 70px;
        background-color: red;
        border-radius: 7px;
        p{
          margin: 0;
          padding: 10px 0 0 15px;
          color: #fff;
        }
        span{
          font-size: 30px;
          color: #fff;
          margin-left: 110px;
        }
      }
      .success{
        background-color: rgba(75, 120, 205, 1);
      }
      .fail{
        background-color: rgba(245, 108, 108, 1);
      }
      .mailputs{
        display: flex;
        width: 70%;
        align-items: center;
        span{
          text-align: right;
          padding-right: 20px;
        }
      }
      .diaofooter{
        display: flex;
        justify-content: center;
      }
      .dioconfig{
        margin: 15px 0;
        display: flex;
        align-items: center;
        >span{
          display:inline-block;
          width: 20%;
          text-align: right;
          padding-right: 50px;
          // span{
          //   width: 10px;
          // }
        }
      }
    }
</style>