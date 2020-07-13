<template>
    <div style="background-color:#fff;min-height:60vh;" class="savemod">
      <div style="display:flex;justify-content:center;">
        <p style="width:25%;font-size:16px;font-weight:700;margin:0;margin-top:20px;">模块维护</p>
        <div style="width:50%;margin-left:20px;">
        </div>
      </div>
      <div style="display:flex;justify-content:center;">
        <p style="width:25%;font-size:16px;font-weight:700;"></p>
        <div style="width:50%;margin-left:20px;overflow:hidden">
          <el-button style="float:right;margin-left:20px;" @click="exportData('mb')">下载模板</el-button>
          <el-button style="float:right;margin-left:20px;" @click="exportData('data')">导出</el-button>
          <el-button style="float:right;margin-left:20px;" @click="dialogimport=true">导入</el-button>
        </div>
      </div>
          <div class="diobox" style="display:flex;justify-content:center;padding-top:20px;" v-loading='moduleLoading' element-loading-text="正在加载中。。。">
            <div style="width:25%;border:1px solid #ccc;min-height:300px;max-height:700vh">
                <p style="margin:0;padding:15px;font-size:15px;font-weight:700;">{{proName}}</p>
                <el-tree :data="data" 
                :props="defaultProps" 
                @node-click="handleNodeClick" 
                ref="tree" 
                :default-expand-all='true'
                :expand-on-click-node="false"
                style="width:100%;overflow:auto;max-height:61vh"
                >
                <!-- draggable -->
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ data.moduleName }}({{data.caseNum}})</span>
                  <span>
                    <!-- <span>
                      <span class="fa fa-arrows"></span>
                    </span> -->
                     <!-- <el-button
                        type="text"
                        size="mini"
                        @click="() => append(data)">
                      </el-button> -->
                    <!-- <el-button
                      type="text"
                      size="mini"
                      @click.stop="() => remove(node, data)">
                      <span class="fa fa-trash-o" style="color:#000"></span>
                    </el-button> -->
                  </span>
                </span>
                </el-tree>
            </div>
            <div style="width:50%;border:1px solid #ccc;min-height:300px;max-height:70vh;margin-left:20px;display:flex">
              <el-row style="width:100%">
                <el-col :span="10" style="display:flex;align-items:center;height:100%;">
                  <div style="width:100%;text-align:center;">
                      <p style="word-wrap:break-word;word-break:break-all;overflow:hidden">
                      {{titStr}}
                      </p>
                  </div>
                </el-col>
                <el-col :span="14" style="overflow:auto;max-height:70vh;display:flex;align-items:center;height:100%;flex-flow:wrap;padding:0 15px;">
                    <div style="width:100%">
                      
                    <draggable v-model="childrenArr" @change="datadragEnd" style="width:100%;">
                        <div v-for="item in childrenArr" :key="item.id" style="display:flex;align-items:center;margin:15px 0;width:100%" ref="moveData" class="lastinput">
                          <el-input v-model="item.moduleName" style="width:60%;"></el-input>
                          <span class="fa fa-arrows" style="margin:0 15px;"></span>
                          <span class="fa fa-trash-o" style="color:#000;margin:0 15px;" @click="removemodule(item)"></span>
                        </div>
                        <!-- <div v-for="(value,index) in fixedArr" :key="index" style="display:flex;align-items:center;margin:15px 0;width:100%">
                          <el-input v-model="value.label" style="width:60%;"></el-input>
                          <span class="fa fa-plus" style="margin:0 15px;" @click="addinput"></span>
                          <span class="fa fa-arrows" style="margin:0 15px;"></span>
                          <span class="fa fa-trash-o" style="color:#000;margin:0 15px;" @click="removeinput(index)"></span>
                        </div> -->
                    </draggable>
                    <draggable v-model="fixedArr" @end="datadragEndabc" style="width:100%;">
                        <!-- <div v-for="item in childrenArr" :key="item.id" style="display:flex;align-items:center;margin:15px 0;width:100%" ref="moveData">
                          <el-input v-model="item.moduleName" style="width:60%;"></el-input>
                          <span class="fa fa-arrows" style="margin:0 15px;"></span>
                          <span class="fa fa-trash-o" style="color:#000;margin:0 15px;" @click="removemodule(item)"></span>
                        </div> -->
                        <div v-for="(value,index) in fixedArr" :key="index" style="display:flex;align-items:center;margin:15px 0;width:100%">
                          <el-input v-model="value.label" style="width:60%;"></el-input>
                          <span class="fa fa-plus" style="margin:0 15px;" @click="addinput"></span>
                          <span class="fa fa-arrows" style="margin:0 15px;"></span>
                          <span class="fa fa-trash-o" style="color:#000;margin:0 15px;" @click="removeinput(index)"></span>
                        </div>
                    </draggable>
                    
                    </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-row style="padding:30px 0;">
            <el-col :span="24" class="exitdiong" style="display:flex;justify-content:center;">
              <el-button @click="changeModule()" style="background-color:#4b78cd;color:#fff;">保 存</el-button>
              <el-button @click="backreturn">返 回</el-button>
            </el-col>
          </el-row>

          <!-- 导入 -->
          <el-dialog
          title="导入"
          :close-on-click-modal='false'
          :visible.sync="dialogimport"
          v-loading= 'exportModuleLoading'
          element-loading-custom-class='loadingModule'
          element-loading-text="正在导入。。。"
          @closed='closedialogimport'
          class="importModu"
          width="30%">
          <div>导入项目：{{useridGetProname(listQuery.projectId)}}</div>
          <el-row style="margin-top:15px;">
            <el-col :span='24' class="progessSty">
                <el-upload
                  action="/sysmanage/qxBaseModule/uploadModule"
                  :data="impData"
                  ref="upload"
                  :headers="myHeader"
                  :auto-upload="false"
                  :on-success='filesuccess'
                  :on-change="handleFile"
                  :on-error='fileerror'
                  :limit='1'
                  accept=".xlsx"
                  :file-list="fileList">
                <el-button slot="trigger" size="small" style="color:#fff;border:none;background-color:#4b78cd;">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只支持xlsx格式文件</div>
                </el-upload>
            </el-col>
          </el-row>
          <el-row style="margin-top:20px;">
            <el-col :span="24" style="display:flex;justify-content:center;">
              <el-button @click="submitUpload" size="small" style="background-color:#4b78cd;color:#fff;">导 入</el-button>
            </el-col>
          </el-row>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
import { getUUID } from '@/utils'
import draggable from 'vuedraggable'
import API from '@/api'
import {systemlogStatis} from '@/api/modules/all'

import {getProjectByUser, listByMap, editorQxBaseModule, isDirectDel, exportModule} from '@/api/xyzqPort/casebase'
export default {
  data () {
    return {
      fileList: [],
      myHeader: {
        token: ''
      },
      moduleLoading: false,
      impData: {
        projectId: '',
        createAuthor: '',
        serNo: ''
      },
      dialogimport: false,
      defaultProps: {
        children: 'children',
        label: 'moduleName'
      },
      data: [],
      childrenArr: [],
      titStr: '',
      projectOptionsAll: [],
      // 传输数据
      moduleChildArr: [],
      parentId: 0,
      fixedArr: [
        {
          label: '',
          id: ''
        }, {
          label: '',
          id: ''
        }, {
          label: '',
          id: ''
        }, {
          label: '',
          id: ''
        }, {
          label: '',
          id: ''
        }
      ],
      appendArr: [],
      proName: '',
      remodeAllname: [],
      a: {},
      exportModuleLoading: false,
      changeArr: [],
      listQuery: {
        projectId: ''
      }
    }
  },
  created () {
    this.impData.createAuthor = localStorage.getItem('userId')
    this.impData.serNo = getUUID()
    this.impData.projectId = this.$route.query.reqId
    this.myHeader.token = this.$cookie.get('token')
    this.listQuery.projectId = this.$route.query.reqId
    this.getAllproject()
  },
  components: {
    draggable
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '用例库',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  methods: {
    // 导出模块数据
    exportData (type) {
      let row = {
        projectId: this.listQuery.projectId,
        projectName: this.useridGetProname(this.listQuery.projectId),
        type: type,
        serNo: getUUID()
      }
      // exportModule(row).then(res => {
      //   console.log(res)
      // })
      var newrow = JSON.stringify(row)
      // console.log(newrow)
      newrow = encodeURIComponent(newrow)
      // console.log(newrow)
      // window.open('/sysmanage/qxBaseModule/exportModule?token=' + this.$cookie.get('token') + '&JosnStr=' + newrow)
      window.open('/sysmanage/qxBaseModule/exportModule?projectId=' + this.listQuery.projectId + '&projectName=' + this.useridGetProname(this.listQuery.projectId) + '&type=' + type + '&serNo=' + getUUID() + '&token=' + this.$cookie.get('token'))
    },
    closedialogimport () {
      this.fileList = []
    },
    submitUpload () {
      this.$nextTick(() => {
        if (this.fileList.length === 0) {
          this.$message({type: 'warning', message: '请上传导入文件'})
          return
        }
        this.exportModuleLoading = true
        this.$refs.upload.submit()
      })
    },
    handleFile (file, fileList) {
      this.fileList = fileList
    },
    // 导入文件成功后的回调
    filesuccess (response, file, fileList) {
      this.exportModuleLoading = false
      if (response.result === 'success') {
        this.$message({type: 'success', message: '导入成功'})
      } else {
        this.$message({type: 'error', message: response.result, duration: 0, showClose: true, dangerouslyUseHTMLString: true})
      }
      // debugger
      this.$nextTick(() => {
        this.fileList = []
      })
      this.dialogimport = false
      // 获取所有的模块
      this.getModuleList()
    },
    fileerror (err, file, fileList) {
      this.exportModuleLoading = false
      this.$nextTick(() => {
        this.fileList = []
      })
      this.$message({type: 'error', message: '导入失败'})
      // 获取所有的模块
      this.getModuleList()
    },
    backreturn () {
      const row = {
        projectId: this.$route.query.reqId,
        moduleIds: this.$route.query.moduleIds,
        priorityIds: this.$route.query.priorityIds,
        isSmokeTest: this.$route.query.isSmokeTest,
        caseType: this.$route.query.caseType,
        status: this.$route.query.status,
        authorId: this.$route.query.authorId,
        subject: this.$route.query.subject,
        page: this.$route.query.page,
        pageSize: this.$route.query.pageSize,
        exportModules: this.$route.query.exportModules,
        caseIds: this.$route.query.caseIds
      }
      this.$router.push({name: 'casebase', params: row})
    },
    datadragEndabc (evt) {
      // console.log(123)
      // this.changeModule('remove')
      this.$message({type: 'warning', message: '请保存后再排序'})
    },
    datadragEnd (evt) {
      this.childrenArr.forEach((item, index) => {
        item.sortOrder = this.listQuery.projectId + '' + this.parentId + '' + (index + 1)
      })
      this.changeModule('remove')
    },
    removemodule (item) {
    //   console.log(item)
      const row = {
        id: item.id,
        loginId: localStorage.getItem('userId'),
        serNo: getUUID()
      }
      isDirectDel(row).then(res => {
        if (res.data.data === true) {
          item.isDelete = 1
          this.$confirm(`是否删除`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res => {
            this.changeModule('delect')
          })
        } else {
          // this.$confirm(`该模块存在用例是否删除`, '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(res => {
          //   item.isDelete = 1
          //   this.changeModule('delect')
          // })
          this.$message({type: 'warning', message: '此模块已关联测试用例，不能删除'})
        }
      })
    },
    removeinput (index) {
      this.fixedArr.splice(index, 1)
    },
    addinput () {
      this.fixedArr.push({label: ''})
    },
    getModuleList (save) {
      this.moduleLoading = true
      const row = {
        projectId: this.listQuery.projectId,
        id: '',
        moduleName: '',
        isDelete: 0,
        loginId: localStorage.getItem('userId'),
        serNo: getUUID(),
        getDataType: 'all'
      }
      listByMap(row).then(res => {
        // if (res.data.data) {
        //   res.data.data.moduleName = res.data.data.label
        // }
        this.moduleLoading = false
        let arr = []
        arr.push(res.data.data)
        this.data = arr
        if (!save) {
          this.parentId = 0
          let abc = this.data[0].children
          this.childrenArr = JSON.parse(JSON.stringify(abc))
        } else {
          this.getChildArrFn(this.data)
          this.childrenArr = this.childrenArr.filter(itemval => {
            return itemval.isDelete !== 1
          })
          // console.log(this.childrenArr)
        }
      })
    },
    getChildArrFn (data) {
      // console.log(data)
      data.forEach(item => {
        if (item.id === this.parentId) {
          // console.log(item.children)
          let List = item.children
          this.childrenArr = JSON.parse(JSON.stringify(List))
          // this.childrenArr = this.childrenArr.filter(itemval => {
          //   return itemval.isDelete !== 1
          // })
          return false
        } else {
          if (item.children) {
            item.children.forEach(value => {
              if (value.id === this.parentId) {
                // console.log(value.children)
                let List = value.children
                this.childrenArr = JSON.parse(JSON.stringify(List))
                // this.childrenArr = value.children
                return false
              } else {
                if (value.children) {
                  this.getChildArrFn(value.children)
                }
              }
            })
          }
        }
      })
    },
    handleNodeClick (data, a, b) {
      this.appendArr = data
      // this.a = a
      // console.log(data)
      // console.log(a)
      this.parentId = data.id
      if (data.children) {
        this.childrenArr = JSON.parse(JSON.stringify(data.children))
      } else {
        this.childrenArr = []
      }
      this.titStr = ''
      this.getTreeData(a)
      let pro = this.proName
      this.titStr = pro + this.titStr
      // console.log(this.titStr)
    },
    getTreeData (data) {
      if (Object.keys(data).length !== 0) {
        if (data.parent !== null) {
          if (data.label !== '全部') {
            this.titStr = '>' + data.label + this.titStr
            this.getTreeData(data.parent)
          }
        } else {
          return false
        }
      } else {
        return false
      }
    },
    useridGetProname (id) {
      let str = ''
      this.projectOptionsAll.forEach(item => {
        if (Number(id) === Number(item.id)) {
          str = item.name
        }
      })
      return str
    },
    getAllproject () {
      API.user.info().then(({data}) => {
        if (data && data.code === 0) {
          const row = {
            userId: data.user.userId,
            roleName: ''
          }
        //   this.userId = data.user.userId
          getProjectByUser(row).then(res => {
            // console.log(res)
            if (res.data.result === 'success') {
              this.projectOptionsAll = res.data.list
              this.proName = this.useridGetProname(this.listQuery.projectId)
              let pro = this.proName
              this.titStr = pro
              this.getModuleList()
            }
          })
        }
      })
    },
    getmodulAllName (data) {
      if (data.parent.data.moduleName !== '全部') {
        // this.remodeAllname += data.parent.data.moduleName
        this.remodeAllname.unshift(data.parent.data.moduleName)
        this.getmodulAllName(data.parent)
      } else {
        return false
      }
    },
    changeModule: _.throttle(function (isdelect) {
      var names = this.titStr.split('>')
      var man = ''
      var cont = '\\'
      for (let i = 0; i < names.length; i++) {
        if (i === names.length - 1) {
          cont = ''
        }
        if (i > 0) {
          man += names[i] + cont
        }
      }
      const row = {
        projectId: Number(this.listQuery.projectId),
        // 父模块名全称
        moduleAllName: man,
        // 该模块父级菜单id
        parentId: this.parentId,
        // 当前登录用户id
        createAuthor: Number(localStorage.getItem('userId')),
        // list一下为子模块集合对象
        list: this.childrenArr,
        // // 模块id
        // id: '',
        // // 模块名称
        // moduleName: '',
        // sortOrder: '',
        // // 是否删除
        // isDelete: 0,
        serNo: getUUID(),
        loginId: localStorage.getItem('userId')
      }
    //   console.log(this.childrenArr)
      let a = 1
      // let rnum = 1
      // if (!isdelect) {
      //   let nullArr = []
      //   nullArr = this.fixedArr.filter(item => {
      //     return item.label !== ''
      //   })
      //   nullArr.length === 0 ? rnum = 0 : rnum = 1
      // }
      let flag
      this.fixedArr.forEach((value) => {
        if (value.label) {
          flag = this.childrenArr.some(item => {
            return item.moduleName === value.label
          })
          // if (this.titStr.includes(value.label)) {
          //   flag = true
          // }
        //   console.log(flag)
          if (flag) {
            // 已存在不追加
            setTimeout(() => {
              this.$message({type: 'error', message: '模块名重复输入'})
            }, 10)
            value.label = ''
            a = 2
          } else {
            let obj = {
              moduleName: value.label,
            //   label: value.label,
              children: [],
              id: '',
              sortOrder: this.listQuery.projectId + '' + this.parentId + '' + (this.childrenArr.length + 1),
              isDelete: 0
            }
            this.childrenArr.push(obj)
            value.label = ''
          }
        }
      })
      // if (!this.childrenArr || this.childrenArr.length === 0) {
      //   if (flag !== true) {
      //     this.$message({message: '请添加模块后保存'})
      //   }
      // } else 
      this.childrenArr.forEach((item, index) => {
        item.sortOrder = this.listQuery.projectId + '' + this.parentId + '' + (index + 1)
      })
      if (a !== 2) {
        editorQxBaseModule(row).then(res => {
          if (res.data.result === 'success') {
            this.$message({type: 'success', message: '保存成功'})
            // this.titStr = this.proName
            this.getModuleList('保存')
          } else {
            this.$message({type: 'error', message: res.data.result})
          }
        })
      }
    }, 2000, {
      leading: true,
      trailing: false
    })
  }
}
</script>

<style lang="scss">
    .savemod .el-tree>.el-tree-node {
      display: inline-block;
      min-width: 100%;
    }
    .lastinput:nth-last-child(1) {
      margin-bottom:0 !important;
    }
    .progessSty .el-upload-list__item .el-progress{
      top: 35px;
    }
    .loadingModule{
      width: 40%;
      height: 40vh;
      margin: 10vh auto;
    }
</style>

<style scoped>
  .importModu >>> .el-dialog__body{
    padding-top: 10px;
  }
</style>