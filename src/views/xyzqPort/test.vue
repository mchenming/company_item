<template>
    <div>
        <el-tree
      :data="data"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <button
            type="text"
            size="mini"
            @click="() => append(data)" style="color:#2d2c2c;border:none;background-color:transparent">
            <span class="fa fa-arrows"></span>
          </button>
          <button
            type="text"
            size="mini"
            @click="() => remove(node, data)" style="color:#2d2c2c;border:none;background-color:transparent">
            <span class="fa fa-trash"></span>
          </button>
        </span>
      </span>
    </el-tree>
    </div>
</template>

<script>
let id = 1000
export default {
  data () {
    // const data = [{
    //   id: 1,
    //   label: '一级 1',
    //   children: [{
    //     id: 4,
    //     label: '二级 1-1',
    //     children: [{
    //       id: 9,
    //       label: '三级 1-1-1'
    //     }, {
    //       id: 10,
    //       label: '三级 1-1-2'
    //     }]
    //   }]
    // }, {
    //   id: 2,
    //   label: '一级 2',
    //   children: [{
    //     id: 5,
    //     label: '二级 2-1'
    //   }, {
    //     id: 6,
    //     label: '二级 2-2'
    //   }]
    // }, {
    //   id: 3,
    //   label: '一级 3',
    //   children: [{
    //     id: 7,
    //     label: '二级 3-1'
    //   }, {
    //     id: 8,
    //     label: '二级 3-2'
    //   }]
    // }]
    return {
    //   data: JSON.parse(JSON.stringify(data))
    }
  },
  props: ['data', 'isshow'],
  methods: {
    append (data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>