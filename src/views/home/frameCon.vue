<template>
  <div class="allcss">
    <sk-head></sk-head>
    <div class="content">
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <sk-foot></sk-foot>
  </div>
</template>

<script>
import skHead from '../../components/headCon'
import skFoot from '../../components/footCon'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    skHead, skFoot
  },
  created () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    /*margin: 0 10px;*/
  }
  a {
    color: #42b983;
  }
  .content{
    max-width: 1570px;
    min-width: 1070px;
    margin: 0 auto;
    height: auto;
    background: rgba(247, 240, 242, 0.8);
    padding: 0 3%;
    box-sizing: border-box;
  }
</style>

<style>
.allcss{
  background: rgba(247, 240, 242, 0.8);
}
.el-tooltip__popper{
  /* max-width:500px; */
  word-break: break-word;
  z-index: 9999 !important;
}
.topUP{
  z-index: 999;
  position: absolute;
  top:0;
  left: 0;
  width:40px;
  height: 15px;
  background: #676c76;
  cursor: pointer;
  
}
.topUPin{
  z-index: 999;
  position: absolute;
  top:0;
  left: 0;
  width:40px;
  height: 15px;
  background: white;
  cursor: pointer;
}
.el-message, .el-message--success {
  z-index: 19999 !important;
}
</style>