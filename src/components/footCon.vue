<template>
  <div class="footWarp">
    <div class="footCon">
      <!-- <el-row>
        <el-col :span="6">热门FAQ</el-col>
        <el-col :span="6">服务支持</el-col>
        <el-col :span="6">客服帮助</el-col>
        <el-col :span="6">关注我们</el-col>
      </el-row> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'footCon'
}
</script>

<style scoped>
  .footWarp{
    width: 100%;
    /* height: 60px; */
    background: rgb(247, 240, 242, 0.8);
  }
  .footCon{
    width: 1024px;
    /* height: 60px; */
    position: absolute;
    left: 50%;
    margin-left: -514px;
    line-height: 60px;
    color: white;
  }
</style>
