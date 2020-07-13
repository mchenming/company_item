<template>
    <div class="digital" v-loading='tableLoading'>
        <!-- <div class="box" style="display:flex;">
            <div style="flex:1;height:40px;line-height:40px;background-color:#4b78cd;border-right:1px solid #fff;"></div>
            <div style="flex:1;height:40px;line-height:40px;background-color:#4b78cd;border-right:1px solid #fff;border-left:1px solid #fff;"></div>
            <div style="flex:1;height:40px;line-height:40px;background-color:#4b78cd;border-right:1px solid #fff;border-left:1px solid #fff;"></div>
            <div style="flex:1;height:40px;line-height:40px;background-color:#4b78cd;border-right:1px solid #fff;border-left:1px solid #fff;"></div>
            <div style="flex:1;height:40px;line-height:40px;background-color:#4b78cd;border-right:1px solid #fff;border-left:1px solid #fff;"></div>
            <div style="flex:1;height:40px;line-height:40px;background-color:#4b78cd;"></div>
        </div> -->
        <!-- <el-select filterable v-model="itemArr" style="margin-left:10px;position:relative" @change="getversiondict('1', 0)" class="fixedSearch" popper-class='onmouthFix'>
          <div class="ddBox" style="width:100%">
            <el-input placeholder="请输入搜索内容" style="padding:0 15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp' class="fixedBox"></el-input>
          </div>
          <el-option
            v-for="projectItem in UserInfo"
            :key="projectItem.id"
            :label='projectItem.name'
            :value='projectItem.id'
            >
          </el-option>
        </el-select> -->
        <!-- abcdefg -->

        <div class="oneTable">
        <!-- <div class="fixbox" style="height:40px;width:100%;z-index:1000;background-color:#fff;"></div> -->
        <el-table :data="tableData1" style="width: 100%;" class="titTable" :show-header='false' :cell-class-name="rowClass">
          <el-table-column prop="date" label="项目" align="center">
              <template slot-scope="scope">
                  <div style="width:100%;color:#fff;position:relative">
                    <div style="width:100%" ref="selectName">
                      项目
                    </div>
                    <el-select v-model="itemArr" placeholder="项目" multiple  popper-class='onmouthFix' style="width:200px;position:absolute;left:0;top:-10px;height:40px;background:transparent" @change="changeItem">
                      <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                        <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                      </div>
                      <el-option
                        v-for="item in UserInfo"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="name" label="需求中" align="center">
              <template slot-scope="scope">
                <div>
                  需求中({{listObj.newcont}})
                </div>
              </template>
          </el-table-column>
          <el-table-column prop="address" label="开发中" align="center">
              <template slot-scope="scope">
                开发中({{listObj.kfcont}})
              </template>
          </el-table-column>
          <el-table-column prop="address" label="测试中" align="center">
              <template slot-scope="scope">
                测试中({{listObj.cscont}})
              </template>
          </el-table-column>
          <el-table-column prop="address" label="待验收" align="center">
              <template slot-scope="scope">
                待验收({{listObj.dyscont}})
              </template>
          </el-table-column>
          <el-table-column prop="address" label="待上线" align="center">
              <template slot-scope="scope">
                待上线({{listObj.dsxcont}})
              </template>
          </el-table-column>
        </el-table>
        </div>
        <!-- <div class="fixbox" style="height:48px;width:100%;z-index:1000"></div> -->

        <div class="scrollbox">
          <div class="bslid">
            <el-table :data="listObj.datalist" border style="width: 100%;" class="dTable" :show-header='false' :cell-class-name="addClass" :row-class-name="tableRowClassName" height="87vh">
              <el-table-column prop="date" label="项目"  align="center">
                <template slot-scope="scope">
                  <div class="cellColor ont">
                    <!-- <div style="position:absolute;left:0;top:50px;z-index:1999;width:100%"> -->
                      <p style="color:transparent;margin:9px 0;">12</p>
                      <p style="margin:0;background-color:#4b78cd;color:#FFF;">{{scope.row.project_name}}</p>
                      <p style="margin:0;font-size:13px;background-color:#4b78cd;color:#FFF;">需求总计({{scope.row.cont}})</p>
                    <!-- </div> -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="需求中" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row['需求中'].length>0" style='background-color:#4b78cd;color:#fff;' class="cellColor" id="alla">总计({{scope.row['需求中'].length}})</div>
                  <div v-for="(item, index) in scope.row['需求中']" :key='index'>
                    <div style="margin-top:10px;background-color:#208fbd;color:#fff;cursor:pointer;text-align:left" @click='goredmine(item.id)' class="cellColor"><span style="text-decoration:underline">#{{item.id}}</span>-{{item.subject}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="开发中" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row['开发中'].length>0" style='background-color:#4b78cd;color:#fff;' class="cellColor" id="allb">总计({{scope.row['开发中'].length}})</div>
                  <div v-for="(item, index) in scope.row['开发中']" :key='index'>
                    <div style="margin-top:10px;background-color:#4b78cd;color:#fff;cursor:pointer;text-align:left" @click='goredmine(item.id)' class="cellColor"><span style="text-decoration:underline">#{{item.id}}</span>-{{item.subject}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="测试中" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row['测试中'].length>0" style='background-color:#4b78cd;color:#fff;' class="cellColor" id="allc">总计({{scope.row['测试中'].length}})</div>
                  <div v-for="(item, index) in scope.row['测试中']" :key='index'>
                    <div style="margin-top:10px;background-color:#208fbd;color:#fff;cursor:pointer;text-align:left" @click='goredmine(item.id)' class="cellColor"><span style="text-decoration:underline">#{{item.id}}</span>-{{item.subject}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="待验收" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row['待验收'].length>0" style='background-color:#4b78cd;color:#fff;' class="cellColor" id="alld">总计({{scope.row['待验收'].length}})</div>
                  <div v-for="(item, index) in scope.row['待验收']" :key='index'>
                    <div style="margin-top:10px;background-color:#4b78cd;color:#fff;cursor:pointer;text-align:left" @click='goredmine(item.id)' class="cellColor"><span style="text-decoration:underline">#{{item.id}}</span>-{{item.subject}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="待上线" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row['待上线'].length>0" style='background-color:#4b78cd;color:#fff;' class="cellColor" id="allin">总计({{scope.row['待上线'].length}})</div>
                  <div v-for="(item, index) in scope.row['待上线']" :key='index'>
                    <div style="margin-top:10px;background-color:#208fbd;color:#fff;cursor:pointer;text-align:left" @click='goredmine(item.id)' class="cellColor"><span style="text-decoration:underline">#{{item.id}}</span>-{{item.subject}}</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
    </div>
</template>

<script>
import {getReqsByParams} from '@/api/xyzqPort/digital'
import {getProjectByUser} from '@/api/xyzqPort/erneed'
import {systemlogStatis} from '@/api/modules/all'
export default {
  data () {
    return {
      tableData1: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      itemArr: [],
      UserInfo: [],
      listObj: {},
      searchText: '',
      allItem: [],
      tableLoading: true
    }
  },
  created () {
    this.getuserMessage()
    this.getList()
  },
  mounted () {
    let allObj = {
      url: this.$route.path,
      moduleName: '敏捷看板',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
  },
  methods: {
    // rowClass (row, rowIndex) {
    //   console.log(rowIndex)
    // },
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      var newVal = this.searchText
      var allList = []
      this.allItem.forEach((item) => {
        if (item.name.toLowerCase().includes(newVal.toLowerCase()) === true) {
          allList.push(item)
        }
      })
      if (allList.length === 0) {
        this.UserInfo = [{name: '暂无数据', id: '', disabled: true}]
      } else {
        this.UserInfo = allList
      }
    },
    tableRowClassName ({row, rowIndex}) {
      // if (rowIndex % 2 === 0) {
      //   return 'w-row'
      // } else if (rowIndex % 2 === 1) {
      //   return 's-row'
      // }
    },
    changeItem () {
      this.tableLoading = true
      this.searchText = ''
      this.UserInfo = this.allItem
      for (let i = 0; i < this.itemArr.length; i++) {
        if (this.itemArr[i] === '') {
          this.itemArr = []
        }
      }
      if (this.itemArr.length === 0) {
        this.$refs.selectName.style.color = '#fff'
      } else {
        this.$refs.selectName.style.color = 'transparent'
      }
      this.getList()
    },
    goredmine (id) {
      window.open('http://192.25.97.80/redmine/issues/' + id)
    },
    addClass ({ row, column, rowIndex, columnIndex }) {
      // if (columnIndex !== -1) {
      //   return 'addc'
      // }
      if (columnIndex === 0) {
        return 'addc'
      }
    },
    rowClass ({ row, column, rowIndex, columnIndex }) {
      return 'rgb196'
    },
    getuserMessage () {
      const row = {
        userId: localStorage.getItem('userId'),
        roleName: ''
      }
      getProjectByUser(row).then(res => {
        // console.log(res)
        this.UserInfo = res.data.list
        this.UserInfo.unshift({id: '', name: '全部'})
        this.allItem = [...this.UserInfo]
      })
    },
    useridGetName (id) {
      var name = ''
      this.UserInfo.forEach(item => {
        if (Number(id) === Number(item.id)) {
          name = item.name
        }
      })
      return name
    },
    getList () {
      const row = {
        token: this.$cookie.get('token'),
        roleName: '',
        project_ids: this.itemArr.join(',')
      }
      getReqsByParams(row).then(res => {
        this.tableLoading = false
        console.log(res)
        this.listObj = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .digital{
        width: 100%;
        // height: 1000px;
        background-color: #fff;
        padding: 15px 0;
        position: relative;
        .dTable{
            // margin-top: 15px;
            // padding: 15px;
        }
        .scrollbox{
          // position: relative;
          // height: 100vh;
          // overflow-y: auto;
          // position: absolute;
          // top: 100px;
        }
        .oneTable{
          // float: left;
          // position: absolute;
          z-index: 1000;
          width: 100%;
        //   position: fixed;
        //   // max-width: 1570px;
        //   // min-width: 1070px;
        //   // max-width: 1424px;
        //   // min-width: 924px;
        //   // width: 100%;
        //   z-index: 1000;
        //   top: 0px;
        }
    }
    //  @media screen and (max-width: 1280px) {
    //    .oneTable{
    //      width: 1172px !important;
    //    }
    //  }
</style>

<style lang="scss">
.rgb196{
  background: #214E89;
  color: #fff;
}
 .onmouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
    border: none !important;
  }
  .onmouthFix .el-select .el-input.is-focus .el-input__inner{
    border: none !important;
  }
  .digital .el-input--suffix .el-input__inner{
      // background-color: #4b78cd;
      background-color: transparent;
      color: transparent;
      border: none;
  }
  .digital .el-select .el-input__inner:focus{
      border: none !important;
  }
.oneTable .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #214E89;
/* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
}
.oneTable input::placeholder{
// color:#fff;
color:transparent;
}
.oneTable .el-select__tags{
  height: 40px;
  overflow: hidden;
  width: 0px;
}
// .el-table--enable-row-hover .el-table__body tr>td {
//   vertical-align: text-bottom;
// }
.addc{
  // background-color: red;
  // vertical-align: text-bottom;
  padding-top:30px;
}
.el-table__body tr td{
  vertical-align: text-bottom;
}

.w-row .cellColor{
  background-color: #4b78cd !important;
}
.s-row .cellColor{
  background-color: #208fbd !important;
  // justify-content: space-between
}
#alla,#allb,#allc,#alld,#allin{
  color: #214e89 !important;
  border-radius: 5px;
  font-weight: 700;
  background-color: transparent !important;
}
.scrollbox .el-table__body{
  width: 100% !important;
}
.scrollbox ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    /* padding: 5px 5px; */
    /* margin-left: 9px; */
    background-color: #fff;
    display: block;
}
.el-scrollbar__view,.el-select-dropdown__list{
  position: static !important;
}
.onmouthFix ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #fff;
    display: none;
}
</style>

<style scoped>
  .digital >>> .el-tag.el-tag--info{
    background: transparent;
    color: #fff;
    border: none;
  }
  .digital >>> .el-select .el-tag{
    margin: 10px 5px;
  }
</style>

