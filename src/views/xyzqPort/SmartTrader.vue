<template>
    <div class="SmartTrader">
        <el-row class="headerTime">
            <el-col :span="20">
                <div class="block" style="display:flex;align-items:center">
                  <div class="patten">
                    <!-- <el-select v-model="pattern" placeholder="请选择" style="width:130px;" @change="patternChange" popper-class="mouthFix">
                      <el-option
                        v-for="item in patternArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select> -->
                    <span style="padding: 0 15px;">时间</span>
                  </div>
                  <el-date-picker
                    v-model="changeTime"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :clearable = 'false'
                    :unlink-panels = 'true'
                    @change="getchangeTimeData"
                    class="mouthFix">
                  </el-date-picker>
                </div>
            </el-col>

            <el-col :span="4" v-if="patternFlag">
                <span>自动刷新</span>
                <el-select v-model="refresh" placeholder="请选择" style="width:100px;" popper-class="mouthFix" @change="changeRefsh">
                  <el-option
                    v-for="item in refreshArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
        </el-row>
      <div v-if="patternFlag">
        <div class="headTlog" style="padding:0 15px;">
          <!-- <el-tooltip placement="top">
            <div slot="content">多行信息<br/>第二行信息</div>
            <el-button>Top center</el-button>
          </el-tooltip> -->
            <div class="headericon" :class="[{'errclass' : Number(avgtime.eveAvg)>200}]">
                <div class="t_icon">
                    <div class="fa fa-clock-o fa-5x i_l" style="color:#fff"></div>
                    <div class="i_r">
                        <p>平均延时/最近5min延时</p>
                        <p>
                          <!-- <span v-if="isNaN('avgtime.eveAvg')">0ms</span> -->
                          <span v-if="Number(avgtime.eveAvg)>200" style="color:red">{{Number(avgtime.eveAvg)}}ms</span>
                          <span v-else>{{Number(avgtime.eveAvg)}}ms</span>
                        /
                          <span v-if="Number(avgtime.minAvg)===0">--</span>
                          <span v-else>{{Number(avgtime.minAvg)}}ms</span>
                        </p>
                        <!-- <p v-if="titObj.yanshiavg==='NaN'">0ms</p>
                        <p v-else-if="titObj.yanshiavg">{{Number(titObj.yanshiavg).toFixed(2)}}ms</p> -->
                    </div>
                      <div class="i_icon" style="flex:1">
                        <el-tooltip placement="bottom" v-if="Number(avgtime.eveAvg)>200">
                          <div slot="content">平均延时数大于200ms</div>
                            <span class="fa fa-question-circle-o" style="color:#fff;font-size:20px;margin:15px 0 0 15px;"></span>
                        </el-tooltip>
                      </div>
                </div>
                <div class="f_icon" v-if="Number(titObj.yanshiavg)>200">
                    <span class="fa fa-heart" style="color:red;font-size:22px;"></span>
                </div>
                <div class="f_icon" v-else>
                    <span class="fa fa-heart" style="color:#fff;font-size:22px;"></span>
                </div>
            </div>

            <!-- <div class="headericon" :class="[{'errclass' : Number(titObj.yanshiavg)>50}]">
                <div class="t_icon">
                    <div class="fa fa-clock-o fa-5x i_l" style="color:#fff"></div>
                    <div class="i_r">
                        <p>最新延时</p>
                        <p v-if="titObj.yanshiavg==='NaN'">0ms</p>
                        <p v-else-if="titObj.yanshiavg">{{Number(titObj.yanshiavg).toFixed(2)}}ms</p>
                    </div>
                      <div class="i_icon" style="flex:1">
                        <el-tooltip placement="bottom" v-if="Number(titObj.yanshiavg)>50">
                          <div slot="content">平均延时数大于50ms</div>
                            <span class="fa fa-question-circle-o" style="color:#fff;font-size:20px;margin:15px 0 0 15px;"></span>
                        </el-tooltip>
                      </div>
                </div>
                <div class="f_icon">
                    <span class="fa fa-heart" style="color:#fff;font-size:22px;"></span>
                </div>
            </div> -->

            <div class="headericon server" :class="[{'errclass' : titObj.fuwu==='异常'}]">
                <div class="t_icon">
                    <div class="fa fa-server fa-5x i_l" style="color:#fff"></div>
                    <div class="i_r">
                        <p>服务</p>
                        <p v-if="infoArr">{{titObj.fuwu}}</p>
                        <p v-else></p>
                    </div>
                    
                      <div class="i_icon" style="flex:1">
                        <el-tooltip placement="bottom" v-if="titObj.fuwu==='异常'">
                          <div slot="content"><div v-for="(value,index) in tipsArr" :key="index"><span>{{value}}</span></div></div>
                          <span class="fa fa-question-circle-o" style="color:#fff;font-size:20px;margin:15px 0 0 15px;"></span>
                        </el-tooltip>
                      </div>
                </div>
                <div class="f_icon" v-if="titObj.fuwu==='异常'">
                  <span class="fa fa-heart" style="color:red;font-size:22px;"></span>
                </div>
                <div class="f_icon" v-else>
                  <span class="fa fa-heart" style="color:#fff;font-size:22px;"></span>
                </div>
            </div>

            <!-- <div class="headericon">
                <div class="t_icon">
                    <div class="fa fa-sort-amount-asc fa-5x i_l" style="color:#fff;transform:rotate(180deg)"></div>
                    <div class="i_r">
                        <p>访问量UV</p>
                        <p>{{titObj.fwlSum}}</p>
                    </div>
                </div>
                <div class="f_icon">
                  <span class="fa fa-heart fa-x" style="color:#fff;font-size:22px;"></span>
                </div>
            </div> -->

            <!-- <div class="headericon" :class="[{'errclass' : titObj.lianlu==='异常'}]">
                <div class="t_icon">
                    <div class="fa fa-key fa-5x i_l" style="color:#fff"></div>
                    <div class="i_r">
                        <p>链路</p>
                        <p>{{titObj.lianlu}}</p>
                    </div>
                    <div class="i_icon" style="flex:1">
                        <el-tooltip placement="bottom" v-if="titObj.lianlu==='异常'">
                          <div slot="content">
                            <div v-for="(value,index) in titObj.errorList" :key="index">{{value}}</div>
                          </div>
                          <span class="fa fa-question-circle-o" style="color:#fff;font-size:20px;margin:15px 0 0 15px;"></span>
                        </el-tooltip>
                      </div>
                </div>
                <div class="f_icon">
                    <span class="fa fa-heart" style="color:#fff;font-size:22px;"></span>
                </div>
            </div> -->
        </div>

        <div class="midbox" style="display:flex;padding:0 15px;">
          <div class="midechart" style="flex:1;margin-right:30px;margin-top:10px;"  v-loading='echartsLoading'>
            <div style="display:flex;justify-content: space-between;align-items:center;height:30px">
              <p style="margin:0px;font-size:16px;font-weight:700">平均延时&重要功能号平均延时</p>
              <el-tooltip placement="top" style="margin:0px;padding:0px 15px 0 0;">
                <div slot="content">
                  <div>重要功能号</div>
                  <div v-for="(value,index) in gongnengArr" :key="index">
                    <div>{{value}}</div>
                  </div>
                </div>
                <span class="fa fa-question-circle-o" style="color:#cca;font-size:20px;margin:15px 0 0 15px;"></span>
              </el-tooltip>
            </div>
            <div id="visitTwo" style="width:100%;height:240px;z-index:1;border:1px solid #ccc;">
              <div v-if="fwlblShow===true" style="width:100%;height:240px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:200px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:50px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
          <div class="smartTig" style="flex:1;" v-if="infoArr.length>0" v-loading='masterLoading'>
            <div class="smartbox" v-for="(value,index) in infoArr" :key="index">
              <div style="background-color:rgb(255,102,102);height:100%;" v-if="value.fuwu==='异常'">
                  <h4>{{value.ip}}</h4>
                <div class="smartinfo">
                  <div class="smartlist">
                    <p v-if="Number(value.cpu.split('%')[0])>80 || value.cpu === ''" style="background-color:red;border-right:1px solid #FFF;text-align:left;padding-left:20px;">CPU:<span>{{value.cpu}}</span></p>
                    <p v-else style="background-color:transparent;text-align:left;padding-left:20px;">CPU:<span>{{value.cpu}}</span></p>
                    <p v-if="Number(value.neicun.split('%')[0])>80 || value.neicun===''" style="background-color:red;border-right:1px solid #FFF;text-align:left;padding-left:20px;">内存:<span>{{value.neicun}}</span></p>
                    <p v-else style="background-color:transparent;text-align:left;padding-left:20px;">内存:<span>{{value.neicun}}</span></p>
                  </div>
                  <div class="smartlist">
                    <p v-if="Number(value.process.split('/')[0])<Number(value.process.split('/')[1]) || value.process===''" style="background-color:red;text-align:left;padding-left:20px;">进程:<span>{{value.process}}</span></p>
                    <p v-else style="background-color:transparent;text-align:left;padding-left:20px;">进程:<span>{{value.process}}</span></p>
                    <p v-if="Number(value.rom)>85 || value.rom === ''" style="background-color:red;text-align:left;padding-left:20px;">磁盘:<span>{{Number(value.rom).toFixed(2)}}%</span></p>
                    <p v-else style="background-color:transparent;text-align:left;padding-left:20px;">磁盘:<span>{{Number(value.rom).toFixed(2)}}%</span></p>
                  </div>
                  <div class="smartlist">
                    <p v-if="Number(value.load)>2.5 || value.load===''" style="background-color:red;text-align:left;"><span style="margin-left:20px;">五分钟负载:{{value.load}}</span></p>
                    <p v-else style="background-color:transparent;padding-left:20px;text-align:left;">五分钟负载:<span>{{value.load}}</span></p>
                    <p></p>
                  </div>
                </div>
              </div>
              <div style="background-color:#67c23a;height:100%;" v-else>
                  <h4 style="height:20px;width:100%">{{value.ip}}</h4>
                <div class="smartinfo">
                  <div class="smartlist">
                    <p style="text-align:left;padding-left:20px;">CPU:<span>{{value.cpu}}</span></p>
                    <p style="text-align:left;padding-left:20px;">内存:<span>{{value.neicun}}</span></p>
                  </div>
                  <div class="smartlist">
                    <p style="text-align:left;padding-left:20px;">进程:<span>{{value.process}}</span></p>
                    <p style="text-align:left;padding-left:20px;">磁盘:<span>{{Number(value.rom).toFixed(2)}}%</span></p>
                  </div>
                  <div class="smartlist">
                    <p style="text-align:left;padding-left:20px;">五分钟负载:<span>{{value.load}}</span></p>
                    <p style="text-align:left;padding-left:20px;"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="smartTig" style="flex:1;" v-else>
            <div class="smartbox" v-for="(value,index) in 9" :key="index" style="background-color:#67c23a">
              <h4>ip</h4>
              <div class="smartinfo">
                <div class="smartlist">
                  <p>CPU:<span></span></p>
                  <p>内存:<span></span></p>
                </div>
                <div class="smartlist">
                  <p>进程:<span></span></p>
                  <p>磁盘:<span></span></p>
                </div>
                <div class="smartlist">
                  <p>五分钟负载:<span></span></p>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="ver" style="display:flex;margin-top:15px;padding:0 15px;" v-loading='pieLoading'>
          <div class="verleft" style="flex:1;margin-right:15px;height:320px;border:1px solid #eee">
            <p style="font-size:15px;font-weight:700;margin:10px 0 0 15px;">操作系统分布</p>
            <div id="operation" ref="operation" style="height:290px;width:100%;">
              <div v-if="pieOpShow===true" style="width:100%;height:250px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:250px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:80px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
          <div class="verright" style="flex:1;height:320px;border:1px solid #eee">
            <p style="font-size:15px;font-weight:700;margin:10px 0 0 15px;">应用版本分布</p>
            <div id="version" ref="version" style="height:290px;width:100%;">
              <div v-if="pieVeShow===true" style="width:100%;height:250px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:250px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:80px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
        </div> -->

        <!-- 功能号 -->
        <!-- <div style="width:100%;display:flex;height:40px;margin-top:15px;padding:0 15px;">
          <div style="width:15%;border:1px solid #ccc;text-align:center;line-height:40px;">功能号</div>
          <div style="width:35%;">
              <el-select v-model="fName" multiple placeholder="请选择" style="width:100%" @change="funChange" popper-class='onmouthFix'>
                <div class="dBox" style="position:absolute;top:5px;left:0px;width:100%">
                  <el-input placeholder="请输入搜索内容" style="box-sizing:border-box; width:90%;margin-left:15px;" v-model='searchText' @input="searchInfo" @focus='leaveinp'></el-input>
                </div>
              <el-option
                v-for="item in functionNumberArr"
                :key="item.functionnumber"
                :label="item.functionnumber + '-' + item.functionname"
                :value="item.functionnumber">
              </el-option>
            </el-select>
          </div>
          <div style="">
            <el-select v-model="listQuery.paramsType" placeholder="UID" @change="UIDchange" popper-class="mouthFix">
              <el-option
                v-for="item in UIDArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div style="width:30%">
            <el-input v-model="listQuery.paramsValue" placeholder="" @change="changUIDnumber"></el-input>
          </div>
        </div> -->

        <!-- 主站耗时 -->
        <!-- <div class="smartbody" style="display:flex;margin-top:15px;padding:0 15px;" v-loading='consumeLoading'>
          <div class="consumingLeft" style="flex:1;border:1px solid #eee;z-index:1">
            <p style="font-size:15px;font-weight:700;margin:10px 0 0 15px;">SmartTrader主站耗时</p>
            <div id="smartLeft" ref="smartLeft" style="width:100%;height:240px;">
              <div v-if="useTimeShow===true" style="width:100%;height:220px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:220px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:80px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
        </div> -->
        
        <!-- 表格 -->
        <div class="smarTable">
          <!-- <div class="lefTable"> -->
            <!-- <div class="tableHead" style="height:40px;background-color:#4b78cd;color:#FFF;text-align:center;line-height:40px;font-size:16px;font-weight:700;">TOP访问用户</div> -->
            <!-- <el-table :data="tableData1" style="width: 100%;" :row-class-name="tableRowClassName" border  -->
            <!-- :header-cell-style="{background:'rgb(134,164,218)',color:'#fff'}"   -->
            <!-- :default-sort="{prop: '', order: ''}" tooltip-effect="dark" v-loading='tableLoading' -->
            <!-- @sort-change="productchangeOrder"> -->
              <!-- <el-table-column  label="UserCode" align="center"  show-overflow-tooltip height='36' sortable="custom" prop="jyyfw.content.user_code"> -->
                <!-- <template slot-scope="scope"> -->
                    <!-- <span>{{scope.row.UserCode}}</span> -->
                <!-- </template> -->
              <!-- </el-table-column> -->
              <!-- <el-table-column prop="jyyfw.fid" label="功能号" sortable="custom" align="center" width="120"> -->
                <!-- <template slot-scope="scope"> -->
                    <!-- <span>{{scope.row['功能号']}}</span> -->
                <!-- </template> -->
              <!-- </el-table-column> -->
              <!-- <el-table-column prop="account" label="资金账号" sortable="custom" align="center" show-overflow-tooltip width="200"> -->
                <!-- <template slot-scope="scope"> -->
                    <!-- <span>{{scope.row['资金账号']}}</span> -->
                <!-- </template> -->
              <!-- </el-table-column> -->
              <!-- <el-table-column prop="jyyfw.fid" label="模块" sortable="custom" align="center" show-overflow-tooltip width="220"> -->
                <!-- <template slot-scope="scope"> -->
                    <!-- <span>{{scope.row['功能名称']}}</span> -->
                <!-- </template> -->
              <!-- </el-table-column> -->
              <!-- <el-table-column prop="cnt" label="访问量" sortable="custom" align="center" show-overflow-tooltip width="150"> -->
                <!-- <template slot-scope="scope"> -->
                    <!-- <span>{{scope.row['访问次数']}}</span> -->
                <!-- </template> -->
              <!-- </el-table-column> -->
              <!-- <el-table-column prop="jyyfw.content.telephone" label="手机" sortable="custom" align="center" show-overflow-tooltip width="150"> -->
                <!-- <template slot-scope="scope"> -->
                    <!-- <span>{{scope.row['手机号']}}</span> -->
                <!-- </template> -->
              <!-- </el-table-column> -->
              <!-- <el-table-column prop="time" label="时间" sortable="custom" align="center" show-overflow-tooltip width="180"> -->
                <!-- <template slot-scope="scope"> -->
                    <!-- <span>{{scope.row['时间(h)']}}</span> -->
                <!-- </template> -->
              <!-- </el-table-column> -->
            <!-- </el-table> -->
          <!-- </div> -->


          <!-- <div class="righTable">
            <div class="tableHead" style="height:40px;background-color:#4b78cd;color:#FFF;text-align:center;line-height:40px;font-size:16px;font-weight:700;">TOP访问资产账户</div>
            <el-table :data="tableData" style="width: 100%;" :row-class-name="tableRowClassName" border 
            :header-cell-style="{background:'rgb(134,164,218)',color:'#fff'}"  
            :default-sort="{prop: '', order: ''}" tooltip-effect="dark" 
            @sort-change="prodescchangeOrder">
              <el-table-column  label="UID" align="center"  show-overflow-tooltip height='36' sortable="custom">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="prodescnum" label="功能号" sortable="custom" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.date}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="prodescnum" label="模块" sortable="custom" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="prodescnum" label="手机" sortable="custom" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.date}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="prodescnum" label="访问量" sortable="custom" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.date}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div> -->
        </div>

        <!--  排序 -->
        <!-- <div style="display:flex;justify-content: flex-end;width:100%;">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.page"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div> -->

        <div class="smartFoot" v-loading='logLoading' v-if="latershow">
          <div class="footLeft">
            <div style="position:relative;height:40px;line-height:40px;text-align:center;color:#FFF;background-color:#ff8585;font-size:16px;font-weight:700">
              <span>Error日志</span>
              <div style="position:absolute;right:30px;top:0px;cursor:pointer;" @click="goLogpage" v-if="errlogData.length>5">更多>></div>
            </div>
            <el-table :data="errlogData" style="width: 100%" :show-header=false border>
              <el-table-column prop="time" label="时间" width="180" align="center">
              </el-table-column>
              <el-table-column prop="id" label="log">
                <template slot-scope="scope">
                  <el-collapse v-model="activeNames" @change="selectColl">
                    <el-collapse-item :name="scope.row.id">
                      <template slot="title">
                        <div style="display:flex;justify-content: space-between;">
                          <div style="width:95%;display:flex;flex-flow:wrap">
                            <span style="margin-right:20px;">appname:{{scope.row.appName}}</span>
                            <span style="margin-right:20px;">hostname:{{scope.row.hostname}}</span>
                            <span style="margin-right:20px;">ip:{{scope.row.ip}}</span>
                            <span style="margin-right:20px;">tag:{{scope.row.tag}}</span>
                            <span style="margin-right:20px;">logtype:{{scope.row.logType}}</span>
                            <span style="margin-right:20px;">timestamp:{{scope.row.time}}</span>
                            <span style="margin-right:20px;">source:{{scope.row.source}}</span>
                          </div>
                          <a href="javascript:;" style="line-height:40px;display:bolck;" v-if="activeNames.includes(scope.row.id)">收起</a>
                          <a href="javascript:;" style="line-height:40px;display:bolck;" v-else>展开</a>
                        </div>
                      </template>
                      <pre>{{scope.row.rawMessage}}</pre>
                      <!-- <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                      <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div> -->
                    </el-collapse-item>
                  </el-collapse>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- <div class="footRight">
            <div style="position:relative;height:40px;line-height:40px;text-align:center;color:#FFF;background-color:#ffa366;font-size:16px;font-weight:700">
              <span>
                可疑日志
              </span>
              <div style="position:absolute;right:30px;top:0px;cursor:pointer;" @click="goLogpage">更多>></div>
            </div>
            <el-table :data="logData" style="width: 100%" :show-header=false border>
              <el-table-column prop="time" label="时间" width="180" align="center">
              </el-table-column>
              <el-table-column prop="_id" label="log">
                <template slot-scope="scope">
                  <el-collapse v-model="activeNames" @change="selectColl">
                    <el-collapse-item :name="scope.row._id">
                      <template slot="title">
                        <div style="display:flex;justify-content: space-between;">
                          <div style="width:95%;display:flex;flex-flow:wrap">
                            <span style="margin-right:20px;">appname:{{scope.row.appname}}</span>
                            <span style="margin-right:20px;">hostname:{{scope.row.hostname}}</span>
                            <span style="margin-right:20px;">ip:{{scope.row.ip}}</span>
                            <span style="margin-right:20px;">tag:{{scope.row.tag[0]}}</span>
                            <span style="margin-right:20px;">logtype:{{scope.row.logtype}}</span>
                            <span style="margin-right:20px;">timestamp:{{scope.row.time}}</span>
                            <span style="margin-right:20px;">source:{{scope.row.source}}</span>
                          </div>
                          <a href="javascript:;" style="display:bolck;line-height:40px;" v-if="activeNames.includes(scope.row._id)">收起</a>
                          <a href="javascript:;" style="display:bolck;line-height:40px;" v-else>展开</a>
                        </div>
                      </template>
                      <pre>{{scope.row.raw_message}}</pre>
                    </el-collapse-item>
                  </el-collapse>
                </template>
              </el-table-column>
            </el-table>
          </div> -->
        </div>
      </div>

      <smartTemplate v-if="!patternFlag" :fatherdata='changeTime' @sontime='sontime'> </smartTemplate>
      
    <div style="padding:0 15px 5px;margin:0 0;" class="addtem">
        <!-- <h1>{{portadd}}</h1> -->
        <div style="display:flex">
            <div style="flex:2;margin-right:20px">
                <p style="margin:10px 0;font-size:16px;font-weight:700;">重要功能号延时</p>
                <div id="addPort" ref="addPort" style="width:100%;height:340px;border:1px solid #eee" v-loading='portLoading'></div>
            </div>
            <div style="flex:1">
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%;"
                  max-height="395"
                  @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55" align="center">
                  </el-table-column>
                  <el-table-column width="55" align="center" label=".">
                      <template slot-scope="scope">
                          <div style="background-color:#4b78cd;color:#fff;">
                              {{scope.$index + 1}}
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="functionNumber" label="重要功能号延时排行榜" align="center">
                      <template slot-scope="scope">
                          <div style="background-color:#4b78cd;color:#fff;text-align:left;">
                              {{scope.row.functionNumber}}-{{scope.row.functionName}}
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="avg" label="." width="120" align="center">
                      <template slot-scope="scope">
                          <div style="background-color:#4b78cd;color:#fff;">
                              <div v-if="scope.row.hasOwnProperty('avg')">
                                {{scope.row.avg}}ms
                              </div>
                          </div>
                      </template>
                  </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import smartTemplate from '../templates/SmartTemplate'
import SmartPortAdd from '../templates/SmartAddport'
import {getMaster, getMoney, getJournal, SmartlistByMap, getYanshi, getYanshiLishi, getImportantDelayEchar, getImportantDelay} from '@/api/xyzqPort/smartTrader'
import echarts from 'echarts'

// import {getImportantDelayEchar, getImportantDelay} from '@/api/xyzqPort/smartTrader'
import {systemlogStatis} from '@/api/modules/all'

// import {getYanshiAndFangwenliang} from '@/api/xyzqPort/smartTrader'
export default {
  data () {
    return {
      latershow: false,
      obj: {},
      tableData: [],
      multipleSelection: [],
      functionNumbers: '',
      sendType: 'first',
      portAddFlag: true,
      activeNames: ['1'],
      changeTime: [],
      refreshArr: [{
        value: '',
        label: '关闭'
      }, {
        value: '1',
        label: '1min'
      }, {
        value: '5',
        label: '5min'
      }, {
        value: '10',
        label: '10min'
      }, {
        value: '30',
        label: '30min'
      }],
      refresh: '',
      // sname:鼠标按下和鼠标起来的时间
      value1: '',
      pattern: '1',
      patternFlag: true,
      total: 10,
      patternArr: [
        {id: '1', name: '实时查询'},
        {id: '2', name: '统计查询'}
      ],
      logData: [],
      tableData1: [],
      currentPage1: 1,
      functionNumberArr: [],
      SearchfunctionNumberArr: [],
      fName: [],
      infoArr: [],
      errlogData: [],
      UIDArr: [{
        id: 'account',
        name: '资金账号'
      }, {
        id: 'jyyfw.content.user_code',
        name: 'UserCode'
      }],
      searchText: '',
      tableLoading: true,
      echartsLoading: true,
      pieLoading: true,
      consumeLoading: true,
      logLoading: true,
      masterLoading: true,
      titObj: {
        yanshiavg: 0,
        fwlSum: 0,
        fuwu: '',
        lianlu: '',
        errorList: []
      },
      timeIntervle: '',
      tipsArr: [],
      dataHide: false,
      ysShow: false,
      ysbigShow: false,
      fwlbigShow: false,
      fwlzyShow: false,
      fwlblShow: false,
      pieOpShow: false,
      pieVeShow: false,
      useTimeShow: false,
      allList: [],
      // 所有的重要功能号
      gongnengArr: [],
      avgtime: {
        eveAvg: 0,
        minAvg: 0
      },
      defaultTime: [],
      listQuery: {
        startTime: '',
        endTime: '',
        pageSize: 5,
        page: 1,
        portalNos: '',
        uid: '',
        orderType: '-',
        orderField: 'time',
        'jyyfw.fid': '',
        paramsType: 'account',
        paramsValue: '',
        type: '2'
      },
      multArr: ['1', '2', '3'],
      checkFlag: false,
      portLoading: false
    }
  },
  created () {
    // 获取最近半个小时的时间
    this.getOneHoursTime()
    // 获取UID的所有id和显示信息
    // this.getfunctionNumber()
  },
  components: {
    smartTemplate,
    SmartPortAdd
  },
  watch: {
    $route (to, from) {
      console.log(to)
      console.log(from)
    }
  },
  mounted () {
    this.getData('first')
    // 初次加载获取页面所有的数据
    this.getInit()
    let allObj = {
      url: this.$route.path,
      moduleName: 'smarttrader',
      token: this.$cookie.get('token')
    }
    systemlogStatis(allObj).then(res => {
      // console.log(res)
    })
    // this.timeIntervle = setInterval(() => {
    //   // this.tableLoading = true
    //   this.echartsLoading = true
    //   // this.pieLoading = true
    //   // this.consumeLoading = true
    //   this.logLoading = true
    //   this.getOneHoursTime()
    //   this.getInit()
    // }, 1000 * 60 * 5)
  },
  methods: {
    getchangeTimeData () {
      clearInterval(this.timeIntervle)
      this.refresh = ''
      this.getInit()
      this.sendType = 'second'
      this.multArr = this.multipleSelection
      this.checkFlag = false
      this.portLoading = true
      this.getData('second')
      // this.portAddFlag = false
      // this.$nextTick(() => {
      //   this.portAddFlag = true
      // })
    },
    sontime (timearr) {
      // console.log(timearr)
      this.$set(this.changeTime, 0, timearr[0])
      this.$set(this.changeTime, 1, timearr[1])
    },
    funChange () {
      // 查询
      this.searchText = ''
      this.functionNumberArr = this.SearchfunctionNumberArr
      // 功能号id
      this.listQuery['jyyfw.fid'] = this.fName.join(',')
      this.consumeLoading = true
      this.tableLoading = true
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.getfootData()
    },
    goLogpage () {
      const rows = {
        stime: this.changeTime[0],
        etime: this.changeTime[1]
      }
      this.$router.push({path: '/doubtfulLog', query: rows})
    },
    changeRefsh () {
      // 切换自动刷新的时间
      clearInterval(this.timeIntervle)
      // console.log(Number(this.refresh))
      if (this.refresh !== '') {
        var timeDays = Number(this.refresh)
        this.timeIntervle = setInterval(() => {
          this.tableLoading = true
          this.echartsLoading = true
          this.pieLoading = true
          this.consumeLoading = true
          this.logLoading = true
          this.getOneHoursTime()
          this.getInit()
          // 新增重要延时号
          this.multArr = this.multipleSelection
          this.checkFlag = false
          this.getData()
        }, 1000 * 60 * timeDays)
        // console.log(123)
      }
    },
    // 切换UID类型
    UIDchange () {
      this.listQuery.paramsValue = ''
    },
    // 根据手机号获取表格数据
    changUIDnumber () {
      this.tableLoading = true
      if (this.listQuery.paramsValue === '无') {
        this.listQuery.paramsValue = ''
      }
      this.getTableData()
    },
    getInit () {
      this.listQuery.startTime = this.changeTime[0]
      this.listQuery.endTime = this.changeTime[1]
      // console.log(this.changeTime[1])
      // this.listQuery.startTime = '2019-12-30 01:27:42'
      // this.listQuery.endTime = '2019-12-30 12:27:41'
      this.listQuery.portalNos = 'b31_21,b21_31,getTwo,b31_212,b21_312,b12_13'
      this.titObj.yanshiavg = 0
      this.titObj.fwlSum = 0
      this.echartsLoading = true
      getYanshi(this.listQuery).then(response => {
        // console.log(response)
        // this.avgtime.eveAvg = 0
        this.avgtime.minAvg = 0
        // var data = response.data.data
        if (response.data.result === 'success') {
          if (response.data.data.hasOwnProperty('minAvg')) {
            this.avgtime.minAvg = response.data.data.minAvg
          }
        }
      })
      getYanshiLishi(this.listQuery).then(response => {
        this.echartsLoading = false
        // console.log(response)
        this.avgtime.eveAvg = 0
        // this.avgtime.minAvg = 0
        var data = response.data.data
        if (response.data.result === 'success') {
          // this.avgtime.minAvg = response.data.data.minAvg
          var arr = []
          for (var value in data.nameMap) {
            var str = value + '-' + data.nameMap[value]
            arr.push(str)
          }
          this.gongnengArr = arr
          if (JSON.stringify(response.data.data) !== '{}') {
            this.avgtime.eveAvg = response.data.data.eveAvg
          }
          if (JSON.stringify(response.data.data) !== '{}' && response.data.data.timeList.length > 0) {
            // console.log(data.avgAllList)
            // console.log(data.timeList)
            this.newrenderEcharts('visitTwo', data)
          } else {
            data.timeList = []
            data.avgAllList = []
            data.avgList = []
            this.newrenderEcharts('visitTwo', data)
            // alert(41)
            this.fwlblShow = true
          }
        }
      })
      this.titObj.fuwu = ''
      this.masterLoading = true
      getMaster(this.listQuery).then(response => {
        this.masterLoading = false
        this.infoArr = []
        this.tipsArr = []
        // debugger
        if (response.data.result === 'success') {
          if (JSON.stringify(response.data.data) !== '{}' && response.data.data.returnlist.length > 0) {
            this.infoArr = response.data.data.returnlist
            this.titObj.fuwu = response.data.data.fuwu
            // this.titObj.fuwu = '异常'
            // this.infoArr[0].load = 3.5
            // this.infoArr[0].fuwu = '异常'
            if (response.data.data.reaList) {
              this.tipsArr = response.data.data.reaList
            }
          }
        }
      })
      // 饼图echarts
      // getSyster(this.listQuery).then(response => {
      //   this.pieLoading = false
      //   if (response.data.data !== null) {
      //     // response.data.data.caozuoallname = []
      //     // response.data.data.yingyongallname = []
      //     if (response.data.data.caozuoallname.length > 0) {
      //       var cz = {
      //         name: response.data.data.caozuoallname,
      //         list: response.data.data.caozuolist
      //       }
      //       this.pieEcharts('operation', cz, 1)
      //     } else {
      //       this.pieOpShow = true
      //     }
      //     if (response.data.data.yingyongallname.length > 0) {
      //       var yy = {
      //         name: response.data.data.yingyongallname,
      //         list: response.data.data.yingyonglist
      //       }
      //       this.pieEcharts('version', yy, 2)
      //     } else {
      //       this.pieVeShow = true
      //     }
      //   }
      // })
      // this.getfootData()
      // 获取底部日志的log接口信息
      getJournal(this.listQuery).then(response => {
        this.logLoading = false
        this.logData = []
        this.errlogData = []
        if (response.data.result === 'success') {
          this.errlogData = response.data.data
          // this.logData = response.data.data.keyiList
          // this.errlogData = response.data.data.errorList
        }
      })
    },
    // 获取的表格数据
    getTableData () {
      this.tableData1 = []
      getMoney(this.listQuery).then(response => {
        if (response.data.result === 'success') {
          this.tableLoading = false
          this.tableData1 = response.data.data
          this.total = Number(response.data.total)
        }
      })
    },
    getfootData () {
      this.titObj.lianlu = ''
      this.titObj.errorList = []
      if (this.listQuery['jyyfw.fid'] === '') {
        this.listQuery['jyyfw.fid'] = '*'
      }
      // getUseTime(this.listQuery).then(response => {
      //   this.consumeLoading = false
      //   if (response.data.result === 'success') {
      //     var adrows = response.data.data.series
      //     for (let i = 0; i < adrows.length; i++) {
      //       var narr = adrows[i].data
      //       for (let j = 0; j < narr.length; j++) {
      //         narr[j] = Number(narr[j]).toFixed(2)
      //       }
      //       // adrows[i].itemStyle.color = 'blue'
      //     }
      //     // if (response.data.data.xAxis.length > 0) {
      //     this.newrenderEcharts('smartLeft', response.data.data)
      //     // } else {
      //     //   this.useTimeShow = true
      //     // }
      //     // if (response.data.data.xAxis.length === 0) {
      //     //   this.useTimeShow = true
      //     // }
      //     this.titObj.lianlu = response.data.data.lianlu
      //     this.titObj.errorList = response.data.data.reaList
      //   }
      // })
      // 获取的表格数据
      this.getTableData()
    },
    // 获取所有功能号对应的对象
    getfunctionNumber () {
      SmartlistByMap().then(res => {
        if (res.data.result === 'success') {
          this.functionNumberArr = res.data.data
          this.SearchfunctionNumberArr = [...this.functionNumberArr]
        }
      })
    },
    // 根据功能号的id获取功能号的name
    getidreturnName (id) {
      var name = ''
      this.SearchfunctionNumberArr.forEach(item => {
        if (Number(id) === Number(item.functionnumber)) {
          name = item.functionname
        }
      })
      return name
    },
    // 获取最近半个小时的时间
    getOneHoursTime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 60 * 1000 * 30 * 14)
      var s = this.getTimeByDate(start)
      var e = this.getTimeByDate(end)
      // console.log(end)
      // console.log(e)
      // this.changeTime = [s, e]
      this.$set(this.changeTime, 0, s)
      this.$set(this.changeTime, 1, e)
    },
    // 获取最近半个小时的时间
    getTimeByDate (date) {
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const HH = (date.getHours()).toString().padStart(2, 0)
      const mm = (date.getMinutes()).toString().padStart(2, 0)
      const ss = (date.getSeconds()).toString().padStart(2, 0)
      // console.log(ss)
      const time = `${YY}-${MM}-${DD} ${HH}:${mm}:${ss}`
      return time
    },
    // 根据查询方式切换
    patternChange () {
      // console.log(this.pattern)
      if (this.pattern === '1') {
        this.patternFlag = true
        this.getOneHoursTime()
        // 实时查询   获取最近半个小时的时间
        this.getInit()
      } else if (this.pattern === '2') {
        // 统计查询 获取最近一天的时间
        clearInterval(this.timeIntervle)
        this.getOneDayTime()
        this.patternFlag = false
        // this.getInit()
        // console.log(this.pattern)
      }
    },
    // 获取最近一天的时间
    getOneDayTime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      var s = this.getTimeByDateOne(start)
      var e = this.getTimeByDateOne(end)
      this.$set(this.defaultTime, 0, s)
      this.$set(this.defaultTime, 1, e)
    },
    getTimeByDateOne (date) {
      // const date = new Date()
      const YY = date.getFullYear()
      const MM = (date.getMonth() + 1).toString().padStart(2, 0)
      const DD = (date.getDate()).toString().padStart(2, 0)
      const HH = (date.getHours()).toString().padStart(2, 0)
      const time = `${YY}-${MM}-${DD} ${HH}:00:00`
      return time
    },
    // 查询
    leaveinp () {
      this.searchText = ''
      this.searchInfo()
    },
    searchInfo () {
      console.log(this.searchText)
      // this.$forceUpdate()
      var newVal = this.searchText
      this.allList = []
      this.SearchfunctionNumberArr.forEach((item) => {
        if (item.functionnumber.toLowerCase().includes(newVal.toLowerCase()) === true || item.functionname.toLowerCase().includes(newVal.toLowerCase()) === true) {
          this.allList.push(item)
        }
      })
      // console.log(this.allList)
      if (this.allList.length === 0) {
        this.functionNumberArr = [{functionnumber: '暂无数据', functionname: '', disabled: true}]
        // this.$set(this.functionNumberArr, 0, {functionnumber: '暂无数据', functionname: '', disabled: true})
      } else {
        this.functionNumberArr = this.allList
      }
    },


    /* start */
    handleSelectionChange (val) {
      this.multipleSelection = val
      let arr = this.multipleSelection.map(item => {
        return item.functionNumber
      })
      // console.log(this.multipleSelection)
      this.functionNumbers = arr.join(',')
      // console.log(this.multipleSelection, this.multArr)
      if (this.multipleSelection.length === this.multArr.length) {
        this.checkFlag = true
        this.getChartData()
      } else if (this.checkFlag === true) {
        this.getChartData()
      }
    },
    getData (type) {
      let obj = {
        startTime: this.changeTime[0],
        endTime: this.changeTime[1]
      }
      getImportantDelay(obj).then(res => {
        this.tableData = res.data.data
        if (type === 'first') {
          this.$nextTick(() => {
            res.data.data.forEach((item, index) => {
              if (index < 3) {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              }
            })
          })
        } else {
          // console.log(this.multipleSelection)
          // console.log(this.functionNumbers)
          this.$nextTick(() => {
            res.data.data.forEach((item, index) => {
              this.multArr.forEach(value => {
                if (value.functionNumber === item.functionNumber) {
                  this.$refs.multipleTable.toggleRowSelection(item, true)
                }
              })
            })
          })
          // this.getChartData()
        }
      })
    },
    getChartData () {
      let objChart = {
        startTime: this.changeTime[0],
        endTime: this.changeTime[1],
        functionNumbers: this.functionNumbers
      }
      this.portLoading = true
      getImportantDelayEchar(objChart).then(res => {
        let arr = []
        let name = []
        Object.keys(res.data.data).forEach(item => {
          let obj = {
            name: item,
            type: 'line',
            barGap: 0,
            itemStyle: {
              normal: {
                // color: '#4b78cd',
                // label: {
                //   show: true,
                //   position: 'top'
                // }
              }
            },
            showAllSymbol: true,
            data: res.data.data[item]
          }
          arr.push(obj)
          name.push(item)
        })
        let sendData = {
          arr: arr,
          time: res.data.timeList,
          name: name
        }
        this.portLoading = false
        this.echartsproline('addPort', sendData)
      })
    },
    echartsproline (id, data) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        legend: {
          x: 'center',
          top: '8px',
          data: data.name
        },
        grid: {
          top: '12%',
          left: '3%',
          right: '5%',
          bottom: '2%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          cursor: 'pointer',
          axisPointer: {
            type: 'shadow'
          },
          // formatter: function (params) {
          //   return params[0].name + '<br/>' + params[0].seriesName + ' : ' + params[0].value + '<br/>' + params[1].seriesName + ':' + params[1].value
          // }
        },
        xAxis: [
          {
            type: 'category',
            data: data.time,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 'auto',
              formatter: function (value) {
                return value.substr(0, 10) + '\n' + value.substr(10)
              }
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true
            //   lineStyle: {
            //     color: '#aaa'
            //   }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'ms',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                // color: '#ccc'
              }
            }
          }
        ],
        series: data.arr
      }, true)
    },
    /* end     */
    newrenderEcharts (id, data) {
      // console.log(data)
      var top = '18%'
      var fonts = 11
      var sizef = 10
      if (window.innerWidth <= 1280) {
        top = '21%'
        fonts = 10
        sizef = 8
        document.getElementById('visitTwo').style.height = 280 + 'px'
      }
      // document.getElementById(id).clear()
      // echarts.clear()
      var myChart = echarts.init(document.getElementById(id))
      myChart.resize()
      myChart.setOption({
        grid: {
          top: top,
          left: '5%',
          right: '5%',
          bottom: '2%',
          containLabel: true
        },
        color: ['#4878cd', '#36cbcb', '#4ecb73', '#fbd437', '#FA8072', '#BDB76B', '#2E8B57', '#90EE90', '#708090'],
        legend: {
          x: 'center',
          data: ['平均延时', '重要功能号平均延时'],
          textStyle: {
            fontSize: fonts
          }
        },
        // dataZoom: [{
        //   type: 'inside',
        //   start: 0,
        //   end: 10,
        //   show: true
        // }],
        // legend: data.legend,
        tooltip: {
          trigger: 'axis',
          // cursor: 'pointer',
          // formatter: '{a}' + '{c}',

          axisPointer: {
            type: 'line'
          }
        },
        xAxis: [
          {
            type: 'category',
            data: data.timeList,
            axisPointer: {
              type: 'line'
            },
            axisLabel: {
              interval: 'auto',
              // interval: function (index, value) {
              //   var flag = false
              //   var inpag = data.timeList.length / 9
              //   for (let i = 1; i <= 10; i++) {
              //     var num = Math.round(inpag * i)
              //     if (index === num) {
              //       console.log(index)
              //       flag = true
              //     }
              //   }
              //   if (index === 0 || index === data.timeList.length - 1) {
              //     flag = true
              //   }
              //   return flag
              // },
              // textStyle: {
              //   color: function (value, index) {
              //     if (data.timeList.length > 36) {
              //       return index % 3 === 0 || index === 0 || index === data.timeList.length - 1 ? '#aaa' : 'transparent'
              //     } else {
              //       return '#aaa'
              //     }
              //   }
              // },
              fontSize: sizef,
              formatter: function (value) {
                if (value.length > 11) {
                  return value.split(' ')[0] + '\n' + value.split(' ')[1]
                } else {
                  return value
                }
              },
              // rotate: 45,
              padding: [0, 0, 0, 0]
            },
            // type: 'value',
            'axisTick': {
              'show': true,
              lineStyle: {
                color: '#aaa'
              }
            },
            'splitLine': {     // 网格线
              'show': false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#aaa'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            'axisTick': {       // y轴刻度线
              'show': false
            },
            minInterval: 1,
            'splitLine': {     // 网格线
              'show': true,
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#aaa'
              }
            },
            max: function (value) {
              if (value.max > 200) {
                var numberMax = Math.ceil(value.max / 5 / 2 / 10) * 10 * 5 * 2
                return numberMax
              } else {
                return Math.ceil(250)
              }
            }
          }
        ],
        series: [
          {
            name: '平均延时',
            type: 'line',
            barGap: 0,
            showAllSymbol: true,
            itemStyle: {
              normal: {
                color: 'rgb(94,189,124)'
                // label: {
                //   show: true,
                //   position: 'top'
                // }
              }
            },
            data: data.avgAllList,
            markLine: {
              data: [{
                yAxis: 200
              }],
              itemStyle: {
                normal: {
                  type: 'dashed',
                  color: 'rgb(255, 133, 133)'
                }
              },
              lineStyle: {
                width: 2
              }
            }
          },
          {
            name: '重要功能号平均延时',
            type: 'line',
            barGap: 0,
            showAllSymbol: true,
            itemStyle: {
              normal: {
                color: '#4B78CD'
                // label: {
                //   show: true,
                //   position: 'top'
                // }
              }
            },
            data: data.avgList
          }

        ]
      }, true)
    },
    pieEcharts (id, data, about) {
      for (let i = 0; i < data.name.length; i++) {
        if (data.name[i] === '') {
          data.name[i] = '其他'
        }
      }
      data.list.forEach(item => {
        if (item.name === '') {
          item.name = '其他'
        }
      })
      var myChartsaccept = echarts.init(document.getElementById(id))
      var aboutinfo = ''
      if (Number(about) === 1) {
        aboutinfo = '系统'
      } else if (Number(about) === 2) {
        aboutinfo = '版本'
      }
      myChartsaccept.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: {
          top: '10%',
          containLabel: true
        },
        legend: {
          type: 'plain',
          orient: 'horizontal',
          // right: '20%',
          bottom: 5,
          data: data.name,
          textStyle: {
            fontSize: 10
          }
        },
        series: [
          {
            name: aboutinfo,
            type: 'pie',
            radius: '65%',
            center: ['50%', '47%'],
            data: data.list,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function (params) {
                // 自定义颜色
                  var colorList = ['#4878cd', '#36cbcb', '#4ecb73', '#fbd437', '#FA8072', '#BDB76B', '#2E8B57', '#90EE90', '#708090', '#f66']
                  return colorList[params.dataIndex]
                },
                label: {
                  show: true,
                  formatter: '{b} :({d}%)',
                  fontSize: 10
                },
                labelLine: {show: true}
              }
            }
          }
        ]
      }, true)
    },
    // 表格各行高亮显示的类名
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else if (rowIndex % 2 === 0) {
        return 'success-row'
      }
      return ''
    },
    selectColl (env) {
      console.log(env)
    },
    // 分页
    handleCurrentChange (val) {
      // this.currentPage1 = val
      // console.log(val)
      this.tableLoading = true
      this.listQuery.page = val
      // console.log(this.listQuery.page)
      this.getTableData()
    },
    // 排序
    productchangeOrder (column, prop, order) {
      // console.log(column.prop)
      this.tableLoading = true
      this.listQuery.orderField = column.prop
      if (column.prop === null) {
        this.listQuery.orderField = 'time'
      }
      this.listQuery.orderType = '-'
      if (column.order === 'ascending') {
        this.listQuery.orderType = '+'
      } else {
        this.listQuery.orderType = '-'
      }
      this.getTableData()
    }
  }
}
</script>
<style lang="scss">
  .el-table .warning-row {
    background: rgba(204, 225, 245, 0.5);
    
  }
  .el-table .success-row {
    background: #ffffff;
  }
  .smartFoot .el-table tbody tr:hover>td { 
    background-color:#ffffff!important
  }
  .smartFoot .el-collapse-item__header{
    border-bottom: 1px solid #fff;
  }
  .smartFoot .el-collapse{
    border: 1px solid #FFF;
  }
  .smartFoot .el-collapse-item__wrap{
    border-bottom: 1px solid #FFF;
  }
  .smartFoot .el-collapse-item__header{
    min-height: 40px;
    line-height: 20px;
    height: 40px;
  }
  .smartFoot .el-collapse-item__arrow{
    // line-height: 100px;
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>
<style lang="scss" scoped>
    
    .SmartTrader{
        background-color: #fff;
      .headerTime{
          height: 50px;
          line-height: 50px;
      }
      .headTlog{
          margin-top: 15px;
          height: 120px;
          display: flex;
          .headericon{
            height: 110px;
            flex:1;
            margin-right: 30px;
            // height: 100%;
            // background-color: red;
            border-radius: 5px;
            .t_icon{
              height: 85px;
              display:flex;
              .i_l{
                flex:2;
                display: flex;
                justify-content: center;
                line-height: 85px;
              }
              .i_r{
                flex: 3;
                padding-left: 15px;
                p{
                  color: #fff;
                  margin: 0;
                  padding: 0;
                  padding: 15px 0 0 0 ;
                  font-size: 15px;
                  &:nth-of-type(2){
                      font-size: 30px;
                  }
                }
              }
            }
            .f_icon{
              height: 25px;
              background-color: #fff;
            // opacity: 0.4;
              background-color: rgba(255, 255, 255, 0.4);
              display: flex;
              align-items: center;
              justify-content: flex-end;
              padding-right: 20px;
              span{
                animation: heart 5s infinite linear;
              }
            }
            @keyframes heart {
              0% { 
                opacity:1; 
              }
              10% {
                opacity: 0.8;
              }
              20% {
                opacity: 0.6;
              }
              30% {
                opacity: 0.3;
              }
              40% {
                opacity: 0.1;
              }
              50% { 
                opacity:0; 
                // color: black;
              }
              60% { 
                opacity:0.2; 
              }
              70% { 
                opacity:0.4; 
              }
              80% { 
                opacity:0.6; 
              }
              90% { 
                opacity:0.8; 
              }
              100% { 
                opacity:1; 
              }
            }
            &:nth-of-type(4){
              margin-right: 0;
              background-color: #53a8ff;
            }
            &:nth-of-type(3){
              background-color: #99f;
            }
            &:nth-of-type(2){
              background-color: #67c23a;
            }
            &:nth-of-type(1){
              background-color: #4b78cd;
            }
          }
          .server{
            flex: 1;
            margin-right: 0px;
          }
      }
      .renderbox{
        margin-top: 15px;
        width: 100%;
        padding: 0 15px;
        box-sizing: border-box;
        display: flex;
        .onedelay{
          flex: 1;
          border: 1px solid #eee;
          height: 275px;
          // overflow: hidden;
          z-index: 1;
          p{
            margin: 0;
            padding: 10px 0 0 10px;
            font-weight: 700;
            font-size: 15px;
          }
          &:nth-of-type(2){
            margin: 0 15px;
          }
        }
      }
      .smartTig{
        margin-top: 10px;
        width: 100%;
        display: flex;
        flex-flow: wrap;
        .smartbox{
          width: 33.3%;
          // height: 100px;
          border-right: 2px solid #FFF;
          border-bottom: 2px solid #FFF;
          background-color:#67c23a;
          color: #fff;
          // padding-top: 20px;
          h4{
            height: 20px;
            padding: 0;
            margin:0;
            text-align: center;
            line-height:25px;
            // margin-top: 10px;
            font-size: 16px;
          }
          .smartinfo{
            display: flex;
            flex-flow: wrap;
            .smartlist{
              // flex: 1;
              width: 100%;
              display: flex;
              // font-size: 12px;
              p{
                flex: 1;
                margin: 5px 0;
                // margin:0;
                // padding-left: 15px;
                // margin-top: 8px;
                text-align: center;
                font-size:12px;
              }
            }
          }
        }
      }
      .smarTable{
        display: flex;
        margin-top: 15px;
        padding: 0 15px;
        .lefTable{
          // flex: 1;
          width: 100%;
          // margin-right: 15px;
          // padding: 0 15px;
        }
        .righTable{
          flex: 1;
        }
      }
      .smartFoot{
        margin-top: 15px;
        display: flex;
        flex-flow: wrap;
        .footLeft{
          // flex: 1;
          width: 100%;
          // margin-right: 15px;
          padding: 0 15px;
        }
        .footRight{
          // flex:1;
          margin-top: 15px;
          padding: 0 15px;
          width: 100%;
          margin-bottom: 15px;
        }
      }
    }
</style>

<style lang="scss">
  .errclass{
    border:5px solid red;
    height: 120px !important;
  }
  .mouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
  .patten .el-select:hover .el-input__inner{
    border-color: transparent !important;
  }
  .patten .el-input__inner{
    border: none;
  }
  .onmouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 50px !important;
  }
  .mouthFix .el-select-dropdown__wrap, .el-scrollbar__wrap{
    margin-bottom: 0px !important;
    margin-right: 0px !important;
    margin-top: 0px !important;
  }
  .onmouthFix .el-scrollbar__view,.el-select-dropdown__list{
    position: static !important;
  }
  .el-table th.gutter{
    display: table-cell!important;
  }
  .errsmartbox{
    background-color: red !important;
  }
  pre {
    white-space: pre-wrap;       /* css-3 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
    margin: 0;
  }
  .smartFoot .el-collapse-item__content{
    padding-bottom: 0 !important;
  }
  .smartFoot .el-table td, .el-table th{
    padding: 5px 0 !important;
  }
</style>

<style scoped>
    .addtem /deep/ .el-table td, .el-table th.is-leaf{
        border: none;
    }
    .addtem /deep/ .el-table th.is-leaf{
        border: none;
    }
    .addtem /deep/.el-table tbody tr:hover>td { 
    background-color:transparent !important
    }
    .addtem /deep/.el-table thead{
        font-weight: 700;
        font-size: 17px;
    }
    .addtem /deep/.el-table .cell{
        padding: 0;
        background-color: #4b78cd;
        color: #fff;
        height: 33px;
        line-height: 33px;
        /* border-radius: 10px; */
    }
    .addtem /deep/.el-table td:nth-of-type(1) .cell{
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .addtem /deep/.el-table td:nth-last-of-type(1) .cell{
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .addtem /deep/.el-table th:nth-of-type(1) .cell{
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .addtem /deep/.el-table th:nth-of-type(4) .cell{
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .addtem /deep/.el-table th:nth-of-type(2) .cell{
        color: transparent;
    }
    .addtem /deep/.el-table th:nth-of-type(4) .cell{
        color: transparent;
    }
    .addtem /deep/ .el-table td, .el-table th{
        padding: 3px 0;
    }
    .addtem /deep/ .el-table td .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: #fff;
      border-color: #aaa;
    }
    .addtem /deep/ .el-table td .el-checkbox__inner::after{
      border-color: #000;
    }
    .addtem /deep/ .el-table th .el-checkbox__input.is-indeterminate .el-checkbox__inner{
      background-color: #fff;
      border-color: #aaa;
    }
    .addtem /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before{
      background-color: #000;
    }
    .addtem /deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
      border-color: #aaa;
      background-color: #fff;
    }
    .addtem /deep/ .el-checkbox__inner::after{
      border-color: #000;
    }
</style>