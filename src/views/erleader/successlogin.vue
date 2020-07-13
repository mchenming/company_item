<template>
    <div class="seccesslogin" :style="{'background': bgImg,'backgroundSize':'cover'}">
        
    </div>
</template>

<script>
export default {
  data () {
    return {
      bgImg: 'url(' + require('../../assets/img/home.png') + ')'
    }
  },
  created () {
    if (this.$route.query.norolse) {
      this.$message({type: 'error', message: '无该菜单权限', showClose: true, duration: 5000})
    }
  },
  beforeDestroy () {
    this.$message.closeAll()
  }
}
</script>

<style lang="scss" scope>
    .seccesslogin{
        // margin-top: 2px;
        width: 100%;
        // height: 900px;
        height: 90vh;
        background-position: 77% 10% !important;
    }
</style>