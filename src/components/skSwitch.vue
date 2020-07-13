<template>
  <label style="display:flex;align-items:center" @click="switchClick">
    <span style="margin-right:10px" v-if="activeText">{{activeText}}</span>
    <input ref="input" v-if="check === true" class="switch switchCartoon" type="checkbox" checked>
    <input ref="input" v-if="check === false" class="switch switchCartoon" type="checkbox" >
    <span style="margin-left:10px" v-if="inactiveText">{{inactiveText}}</span>
  </label>
</template>
<script>
  export default {
    name: 'ElSwitch',
    props: {
      check: {
        type: Boolean,
        default: false
      },
      activeText: String,
      inactiveText: String
    },
    data () {
      return {
      }
    },
    created () {
    },
    methods: {
      switchClick () {
        // console.log(this.$refs.input.checked)
        if (this.$refs.input.checked === false) {
          // this.check = true
          this.$emit('input', false)
          // this.$emit(this.check, true)
        } else {
          // this.check = false
          this.$emit('input', true)
          // this.$emit(this.check, false)
        }
        // console.log(this.check)
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>

  .switch{
    width:36px;height: 21px;position: relative;border: 1px solid #dfdfdf;
    background-color: #fdfdfd;box-shadow: #dfdfdf 0 0 0 0 inset;
    border-radius: 10px;background-clip: content-box;display: inline-block;
    -webkit-appearance: none;user-select: none;outline: none;cursor: pointer;
  }
  .switch:before{
    content: '';width: 19px;height: 19px;position: absolute;top: 0;left: 0;border-radius: 10px;
    background-color: #fff;box-shadow: 0 1px 3px rgba(0,0,0,0.4)
  }
  .switch:checked{
    border-color: #409eff;box-shadow: #409eff 0 0 0 16px inset;
    background-color: #409eff
  }
  .switch:checked:before{
    left: 16px;
  }
  .switchCartoon{
    transition: border cubic-bezier(0,0,0,1) 0.4s, box-shadow cubic-bezier(0,0,0,1) 0.4s
  }
  .switchCartoon:before{
    transition: left 0.3s;
  }
  .switchCartoon:checked{
    border-color: #409eff;box-shadow: #409eff 0 0 0 16px inset;
    background-color: #409eff;
    transition: border ease 0.4s,box-shadow ease 0.4s,background-color ease 1.2s
  }
  .switchCartoon:checked:before{
    transition: left 0.3s;
  }
</style>