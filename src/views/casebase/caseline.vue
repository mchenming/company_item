<template>
    <div class="relation">
        <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="指派案例" name="first"></el-tab-pane>
              <el-tab-pane label="已指派" name="second"></el-tab-pane>
              <el-tab-pane label="执行进度" name="third"></el-tab-pane>
            </el-tabs> 
        </div>
        <div>
            <el-row>
                <el-col :span="5">
                    <el-tree :data="treedata" :props="defaultProps" @node-click="handleNodeClick" :default-expanded-keys="expandedKeys" node-key="id"></el-tree>
                </el-col>
                <el-col :span="19">
                  <div class="realtionHead">
                    <el-row>
                      <el-col :span="16">
                        <span style="padding:0 10px;font-size:14px;">需求</span>
                        <el-select v-model="allItemName" placeholder="请选择" style="width:85%" multiple>
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-col>

                      <el-col :span="8">
                        <span style="padding:0 10px;">指派</span>
                        <el-select v-model="allItemName" placeholder="请选择" style="width:40%">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                         
                         <el-button style="color:#fff;background-color:#4b78cd;border:none;margin-left:15px;">清空</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="relationMid" style="margin-top:10px;">
                    <el-row>
                      <el-col :span="10">
                        <el-select v-model="categoryType" placeholder="请选择" style="width:20%">
                          <el-option
                            v-for="item in category"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                        <el-input v-model="searchIteminfo" placeholder="输入关键字搜索" style="width:75%"></el-input>
                      </el-col>

                      <el-col :span="14">
                        <span style="padding:0 10px;">优先级</span>
                        <el-select v-model="priorityType" placeholder="请选择" style="width:18%">
                          <el-option
                            v-for="item in priority"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                        <span style="padding:0 10px;">用例类型</span>
                        <el-select v-model="caseType" placeholder="请选择" style="width:18%">
                          <el-option
                            v-for="item in casein"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                        <span style="padding:0 10px;">创建人</span>
                        <el-select v-model="categoryType" placeholder="请选择" style="width:18%">
                          <el-option
                            v-for="item in category"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="realtionFooter" style="margin-top:10px;">
                    <el-table
                      ref="multipleTable"
                      :data="tableData"
                      border
                      tooltip-effect="dark"
                      style="width: 100%"
                      @sort-change="orderChange"
                      @selection-change="handleSelectionChange">
                      <el-table-column
                        type="selection"
                        width="55">
                      </el-table-column>
                      <el-table-column label="用例ID" width="120" align="center" sortable>
                        <template slot-scope>
                          123
                        </template>
                      </el-table-column>
                      <el-table-column prop="name" label="模块" width="120" align="center" sortable>
                        <template slot-scope> 
                          <el-tag>父模块二</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="address" label="标题" show-overflow-tooltip align="center">
                        <template slot-scope='scope'>
                          <!-- <div>{{scope.row.date}}</div> -->
                          <div style="color:#4b78cd;cursor:pointer;text-decoration:underline" @click="geDetail(scope.row)">这里是标题点击跳转</div>
                        </template>
                      </el-table-column>

                      <el-table-column prop="name" label="优先级" width="100" align="center" sortable>
                        <template slot-scope> 
                          <div style="border-radius:50%;border:3px solid red;width:30px;height:30px;margin:auto;">1</div>
                        </template>
                      </el-table-column>

                      <el-table-column prop="name" label="用例类型" width="110" align="center" sortable>
                        <template slot-scope>
                          正例
                        </template>
                      </el-table-column>

                       <el-table-column prop="name" label="执行人" width="100" align="center">
                        
                      </el-table-column>
                    </el-table>
                    <div style="display:flex;justify-content:flex-end">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="1"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next"
                        :total="1000">
                      </el-pagination>
                    </div>
                  </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '12',
      activeName: 'first',
      treedata: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 2,
          label: '二级 1-1',
          children: [{
            id: 3,
            label: '三级 1-1-1'
          }]
        }]
      }, {
        id: 4,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1',
          children: [{
            id: 6,
            label: '三级 2-1-1'
          }]
        }, {
          id: 7,
          label: '二级 2-2',
          children: [{
            id: 8,
            label: '三级 2-2-1'
          }]
        }]
      }, {
        id: 9,
        label: '一级 3',
        children: [{
          id: 10,
          label: '二级 3-1',
          children: [{
            id: 11,
            label: '三级 3-1-1'
          }]
        }, {
          id: 12,
          label: '二级 3-2',
          children: [{
            id: 13,
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      expandedKeys: [3, 13],
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
      allItemName: [],
      category: [{
        id: 1,
        name: '用例标题'
      }, {
        id: 2,
        name: '关键字'
      }],
      priority: [{
        id: 0,
        name: 'P0'
      }, {
        id: 1,
        name: 'P1'
      }, {
        id: 2,
        name: 'P2'
      }, {
        id: 3,
        name: 'P3'
      }, {
        id: 4,
        name: 'P4'
      }],
      casein: [{id: 0, name: '正例'}, {id: 1, name: '反例'}],
      caseType: 0,
      priorityType: 0,
      categoryType: 1,
      searchIteminfo: '',
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },
  methods: {
    geDetail (data) {
      const row = {
        id: '123'
      }
      this.$router.push({path: '/detail', query: row})
    },
    handleClick () {
      console.log(this.activeName)
    },
    handleNodeClick (data) {
      console.log(data)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 排序
    orderChange (column) {
      console.log(column)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>
    .relation{
        background-color: #fff;
        padding: 15px;
        margin:10px auto;
        span{
          font-size: 14px;
        }
    }
</style>

<style lang="scss">
.relation{
  .el-select-dropdown__item{
    padding:0 11px;
  }
  .el-input__inner{
    padding: 0 5px;
  }
  .el-input--suffix .el-input__inner{
    padding-right:20px; 
  }
}
</style>