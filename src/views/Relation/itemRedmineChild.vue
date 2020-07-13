<template>
    <div class="itemChildhead">
        <div style="height:34px;width:100%;background-color:#4b78cd;" class="childHead">
            <span>项目子集配置</span>
            <span class="fa fa-close fa-2x" style="color:#fff;cursor:pointer;" @click="returnItemConfig()"></span>
        </div>
        <div class="itemChild" v-loading='isLoading' element-loading-text="正在加载中。。。">
            <div style="display:flex;align-items:center;margin-bottom:25px;width:100%;justify-content:center;">
                <!-- <span style="margin:0 15px">父项目</span> -->
                <el-form :model="listQuery" :rules="rules" ref="formNameSave" label-width="100px" class="demo-ruleForm" style="width:100%;margin:auto;">
                  <div style="display:flex;width:86%;margin: 0 auto">
                    <el-form-item prop="projectName" label="父项目" style="width:65%;">
                        <el-input v-model="listQuery.projectName" placeholder="请输入项目名称" style="width:100%" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="order" label="排序" style="">
                        <el-input v-model="listQuery.order" placeholder="请输入项目排序" style="width:91%" clearable></el-input>
                    </el-form-item>
                  </div>
                </el-form>
            </div>
            <div style="width:100%" class="stee" >
                <el-transfer
                  style="text-align: left; display: flex;justify-content:center;"
                  v-model="value"
                  filterable
                  :props="{key: 'id',label:'name'}"
                  :titles="['可选项目', '已选子项目']"
                  :button-texts="['', '']"
                  :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                  }"
                  ref="mytransfer"
                  @change="handleChange"
                  :data="data">
                  <span slot-scope="{ option }">{{ option.name }}</span>
                </el-transfer>
                <div style="display:flex;justify-content:center;margin:30px 0;">
                    <el-button style="border:none;background-color:#4b78cd;color:#fff;" @click="saveRedmineChild()">保存</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import API from '@/api'
import { getUUID } from '@/utils'
import {systemlogStatis} from '@/api/modules/all'

import {getQxBaseProjectsSubset, getProjects, addQxBaseProjectsSubset, updateQxBaseProjectsSubset} from '@/api/xyzqPort/itConfig'
export default {
  data () {
    let projectNameaa = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入父项目名称'))
      } else {
        callback()
      }
    }
    let sortOrderType = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入项目排序'))
      } else if (isNaN(Number(value))) {
        callback(new Error('请输入数字类型'))
      } else if ((value + '').includes('.')) {
        callback(new Error('请输入整数'))
      } else {
        callback()
      }
    }
    return {
      listQuery: {
        projectName: '',
        order: ''
      },
      rules: {
        projectName: [{validator: projectNameaa, trigger: 'blur', required: true}],
        order: [{validator: sortOrderType, trigger: 'blur', required: true}]
      },
      isLoading: false,
      defaultprops: {
        key: 'id',
        label: 'name'
      },
      data: [],
      value: []
    }
  },
  created () {
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '项目关系配置',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    this.getProjects()
  },
  methods: {
    handleChange (value, direction, movedKeys) {
      if (direction) {
        this.$refs.mytransfer.clearQuery('left')
        this.$refs.mytransfer.clearQuery('right')
      }
      if (direction === 'left') {
        for (let i = 0; i < movedKeys.length; i++) {
          let array = this.data.filter(item => movedKeys[i] !== item.id)
          array.unshift(this.data.filter(item => movedKeys[i] === item.id)[0])
          this.data = array
        }
      }
    },
    saveRedmineChild () {
      this.$refs.formNameSave.validate((valid) => {
        if (valid) {
          this.isLoading = true
          let obj = {
            serNo: getUUID(),
            projectName: this.listQuery.projectName,
            createAuthor: localStorage.getItem('userId'),
            sort: this.listQuery.order
          }
          let arr = []
          for (let i = 0; i < this.value.length; i++) {
            this.data.forEach(item => {
              if (item.id === this.value[i]) {
                let listObj = {projectId: item.id, projectName: item.name}
                arr.push(listObj)
              }
            })
          }
          obj.list = arr
          if (arr.length === 0) {
            this.isLoading = false
            this.$message({type: 'error', message: '请添加子项目后保存', duration: 5000})
            return
          }
          // 修改
          if (typeof (this.$route.query.type) !== 'undefined' && this.$route.query.type === 'edit') {
            obj.id = this.$route.query.id
            updateQxBaseProjectsSubset(obj).then(res => {
              if (res.data.result === 'success') {
                this.$message({type: 'success', message: '修改成功'})
                this.returnItemConfig()
              } else {
                this.$message({type: 'error', message: res.data.result, duration: 5000})
              }
              this.$nextTick(() => {
                this.isLoading = false
              })
            })
            return
          }
          // 新增的接口
          addQxBaseProjectsSubset(obj).then(res => {
            if (res.data.result === 'success') {
              this.$message({type: 'success', message: '新增成功'})
              this.returnItemConfig()
            } else {
              this.$message({type: 'error', message: res.data.result, duration: 5000})
            }
            this.$nextTick(() => {
              this.isLoading = false
            })
          })
        } else {
          return false
        }
      })
    },
    getAllProject () {
      this.isLoading = true
      API.user.getAllProject().then(res => {
        this.data = res.data.rows
        this.data.forEach(item => {
          item.key = item.id
          item.label = item.name
        })
        this.$nextTick(() => {
          this.isLoading = false
        })
      })
    },
    getProjects () {
      this.isLoading = true
      let obj = {
        type: 'notin'
      }
      getProjects(obj).then(res => {
        this.data = res.data.data
        // this.data.forEach(item => {
        //   item.key = item.id
        //   item.label = item.name
        // })
        if (typeof (this.$route.query.id) !== 'undefined' && this.$route.query.id !== '') {
          let id = this.$route.query.id
          this.getOneList(id)
        }
        this.$nextTick(() => {
          this.isLoading = false
        })
      })
    },
    // 获取编辑对象的数据
    getOneList (id) {
      const obj = {
        id
      }
      // 获取编辑信息
      getQxBaseProjectsSubset(obj).then(res => {
        this.listQuery.projectName = res.data.data.projectName
        this.listQuery.order = res.data.data.sort
        res.data.data.list.forEach(item => {
          this.value.push(item.projectId)
          this.data.push({id: item.projectId, name: item.projectName})
        })
      })
    },
    // 返回主页
    returnItemConfig () {
      const row = {
        projectName: this.$route.query.projectName,
        ItemType: this.$route.query.ItemType,
        page: this.$route.query.page,
        pageSize: this.$route.query.pageSize,
        activeName: this.$route.query.activeName
      }
      this.$router.push({name: 'ItemConfig', params: row})
    }
  }
}
</script>

<style lang="scss" scoped>
    .itemChildhead{
        background-color: #fFF;
        margin-top: 15px;
        .childHead{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding:0 15px;
            span{
                &:nth-of-type(1){
                    font-size:18px;
                    color:#fff;
                    font-weight: 700;
                }
            }
        }
    }
    .itemChild{
        padding: 15px;
    }
</style>

<style scoped>
    .itemChild >>> .el-transfer-panel__list.is-filterable{
        height: 400px;
    }
    .itemChild >>> .el-transfer{
        width: 100%;
    }
    .itemChild >>> .el-transfer-panel{
        height: 500px;
        width: 30%;
    }
    .stee >>> .el-button--primary.is-disabled {
        background-color: #ccc;
        border-color: #ccc;
    }
    .stee >>> .el-button--primary{
        border-color: #4b78cd;
        background-color: #4b78cd;
    }
    .stee >>> .el-transfer__button.is-with-texts{
        width: 50px;
    }
    .stee >>> .el-transfer__buttons{
        display: flex;
        align-items: center;
    }
    .stee >>> .el-transfer__button:first-child{
        margin: 0;
    }
</style>