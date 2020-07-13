<template>
    <div class="management">
        <el-tabs v-model="activeName" style="padding:0 70px;">
          <el-tab-pane label="质量墙" name="first" style="color:#4b78cd"></el-tab-pane>
        </el-tabs>

        <div class="downBox">
            <div class="downLeft">
                <div @click="goE" ref="ehome">兴证E家</div>
                <div @click="goS" ref="smart">SmartTrader</div>
            </div>
            <div class="downRight">
                <el-form label-position="top" :model="formLabelAlign">
                  <el-form-item label="延时功能号监控">
                    <el-input v-model="formLabelAlign.name"></el-input>
                    <el-button style="background-color:#4b78cd;color:#fff;border:none;height:30px;line-height:7px;margin-top:5px;" class="edit" @click="goEdit('name')">编辑</el-button>
                  </el-form-item>
                  <el-form-item label="访问量功能号监控">
                    <el-input v-model="formLabelAlign.region"></el-input>
                    <el-button style="background-color:#4b78cd;color:#fff;border:none;height:30px;line-height:7px;margin-top:5px;" class="edit" @click="goEdit('region')">编辑</el-button>
                  </el-form-item>
                  <el-form-item label="模块监控">
                    <el-input v-model="formLabelAlign.type"></el-input>
                    <el-button style="background-color:#4b78cd;color:#fff;border:none;height:30px;line-height:7px;margin-top:5px;" class="edit" @click="goEdit('type')">编辑</el-button>
                  </el-form-item>
                </el-form>
            </div>
        </div>


        <el-dialog
          :visible.sync="dialogVisible"
          :close-on-click-modal = "false"
          :show-close = 'false'
          width="30%">
          <el-form label-position="top" :model="formLabelAlign">
            <el-form-item label="延时功能号监控" v-if="editType==='name'">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="访问量功能号监控" v-if="editType==='region'">
              <el-input v-model="formLabelAlign.region"></el-input>
            </el-form-item>
            <el-form-item label="模块监控" v-if="editType==='type'">
              <el-input v-model="formLabelAlign.type"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button style="background-color:#4b78cd;color:#fff;border:none;">保 存</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      formLabelAlign: {
        name: 'hello world',
        region: '斯巴达斯巴达斯巴达斯巴达斯巴达斯巴达斯巴达斯巴达',
        type: 'opospd'
      },
      dialogVisible: false,
      editType: ''
    }
  },
  methods: {
    goE () {
      this.$refs.ehome.style.backgroundColor = '#4b78cd'
      this.$refs.smart.style.backgroundColor = '#ccc'
    },
    goS () {
      this.$refs.ehome.style.backgroundColor = '#ccc'
      this.$refs.smart.style.backgroundColor = '#4b78cd'
    },
    goEdit (type) {
      this.dialogVisible = true
      this.editType = type
      console.log(type)
      console.log(this.editType)
    }
  }
}
</script>

<style lang="scss" scoped>
    .management{
        background-color: #fff;
        .downBox{
            padding: 0 40px;
            width: 100%;
            height:600px;
            position: relative;
            .downLeft{
                display: flex;
                position: absolute;
                left: -80px;
                top: 80px;
                transform: rotate(-90deg);
                cursor: pointer;
                div{
                    width: 100px;
                    height: 40px;
                    text-align: center;
                    line-height: 40px;
                    background-color: #4b78cd;
                    color: #fff;
                    &:nth-of-type(2){
                        background-color: #ccc;
                        color: #eee;
                    }
                }
            }
            .downRight{
                padding: 0 30px;
                height: 600px;
            }
        }
    }
</style>
<style lang="scss">
   .management .el-tabs__item.is-active{
       color: #4b78cd;
   }
   .management .el-tabs__active-bar,.is-top{
       width: 120px !important;
   }
   .management .el-tabs__active-bar{
       background-color: #4b78cd;
   }
   .management .el-form--label-top .el-form-item__label{
       font-weight: 700;
       font-size: 15px;
   }
   .management .el-form-item__content{
       position: relative;
       .edit{
           position: absolute;
           right: 10px;
           top: 0;
       }
   }
</style>
