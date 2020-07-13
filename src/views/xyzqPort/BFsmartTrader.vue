<template>
    <div class="SmartTrader">
        <el-row class="headerTime">
            <el-col :span="20">
                <div class="block" style="display:flex;align-items:center">
                  <div class="patten">
                    <el-select v-model="pattern" placeholder="请选择" style="width:130px;" @change="patternChange" popper-class="mouthFix">
                      <el-option
                        v-for="item in patternArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <el-date-picker
                    v-model="changeTime"
                    type="datetimerange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="patternFlag"
                    :clearable = 'false'
                    :default-time="['08:00:00', '08:00:00']"
                    :unlink-panels = 'true'
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
            <div class="headericon" :class="[{'errclass' : Number(titObj.yanshiavg)>50}]">
                <div class="t_icon">
                    <div class="fa fa-clock-o fa-5x i_l" style="color:#fff"></div>
                    <div class="i_r">
                        <p>平均延时</p>
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
            </div>

            <div class="headericon" :class="[{'errclass' : titObj.fuwu==='异常'}]">
                <div class="t_icon">
                    <div class="fa fa-server fa-5x i_l" style="color:#fff"></div>
                    <div class="i_r">
                        <p>服务</p>
                        <p v-if="infoArr.length === 0"></p>
                        <p v-else>{{titObj.fuwu}}</p>
                    </div>
                    
                      <div class="i_icon" style="flex:1">
                        <el-tooltip placement="bottom" v-if="titObj.fuwu==='异常'">
                          <div slot="content"><div v-for="(value,index) in tipsArr" :key="index"><span>{{value}}</span></div></div>
                          <span class="fa fa-question-circle-o" style="color:#fff;font-size:20px;margin:15px 0 0 15px;"></span>
                        </el-tooltip>
                      </div>
                </div>
                <div class="f_icon">
                  <span class="fa fa-heart" style="color:#fff;font-size:22px;"></span>
                </div>
            </div>

            <div class="headericon">
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
            </div>

            <div class="headericon" :class="[{'errclass' : titObj.lianlu==='异常'}]">
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
            </div>
        </div>

        <div class="renderbox" v-loading='echartsLoading'>
          <div class="onedelay">
            <p>延时(重要)</p>
            <div id="delayOne" style="width:100%;height:240px;">
              <div v-if="dataHide===true" style="width:100%;height:240px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:200px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:50px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
          <div class="onedelay">
            <p>延时(使用率高)</p>
            <div id="delayTwo" style="width:100%;height:240px;">
              <div v-if="ysShow===true" style="width:100%;height:240px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:200px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:50px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
          <div class="onedelay">
            <p>延时(延时最大)</p>
            <div id="delayThree" style="width:100%;height:240px;">
              <div v-if="ysbigShow===true" style="width:100%;height:240px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:200px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:50px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="renderbox" style="margin-top:15px;" v-loading='echartsLoading'>
          <div class="onedelay">
            <p>访问量(重要)</p>
            <div id="visitOne" style="width:100%;height:240px;">
              <div v-if="fwlzyShow===true" style="width:100%;height:240px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:200px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:50px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
          <div class="onedelay">
            <p>访问量(使用率高)</p>
            <div id="visitTwo" style="width:100%;height:240px;">
              <div v-if="fwlblShow===true" style="width:100%;height:240px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:200px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:50px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
          <div class="onedelay">
            <p>访问量(延时最大)</p>
            <div id="visitThree" style="width:100%;height:240px;">
              <div v-if="fwlbigShow===true" style="width:100%;height:240px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:200px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:50px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="smartTig" v-if="infoArr.length>0">
          <div class="smartbox" v-for="(value,index) in infoArr" :key="index">
            <div style="background-color:rgb(255,102,102);height:100%" v-if="value.fuwu==='异常'">
                <h4>{{value.ip}}</h4>
              <div class="smartinfo">
                <div class="smartlist">
                  <p v-if="Number(value.cpu.split('%')[0])>80 || value.cpu === ''" style="background-color:red;border-right:1px solid #FFF;">CPU:<span>{{value.cpu}}</span></p>
                  <p v-else style="background-color:transparent">CPU:<span>{{value.cpu}}</span></p>
                  <p v-if="Number(value.neicun.split('%')[0])>80 || value.neicun===''" style="background-color:red;border-right:1px solid #FFF;">内存:<span>{{value.neicun}}</span></p>
                  <p v-else style="background-color:transparent">内存:<span>{{value.neicun}}</span></p>
                </div>
                <div class="smartlist">
                  <p v-if="Number(value.process.split('/')[0])<Number(value.process.split('/')[1]) || value.process===''" style="background-color:red">进程:<span>{{value.process}}</span></p>
                  <p v-else style="background-color:transparent">进程:<span>{{value.process}}</span></p>
                  <p v-if="Number(value.rom)>85 || value.rom === ''" style="background-color:red;">磁盘:<span>{{Number(value.rom).toFixed(2)}}</span></p>
                  <p v-else style="background-color:transparent;">磁盘:<span>{{Number(value.rom).toFixed(2)}}</span></p>
                </div>
                <div class="smartlist">
                  <p v-if="Number(value.load)>2.5 || value.load===''" style="background-color:red;border-left:1px solid #FFF;">五分钟负载:<span>{{value.load}}</span></p>
                  <p v-else style="background-color:transparent;">五分钟负载:<span>{{value.load}}</span></p>
                </div>
              </div>
            </div>
            <div style="background-color:#67c23a;" v-else>
                <h4 style="height:20px;width:100%">{{value.ip}}</h4>
              <div class="smartinfo">
                <div class="smartlist">
                  <p>CPU:<span>{{value.cpu}}</span></p>
                  <p>内存:<span>{{value.neicun}}</span></p>
                </div>
                <div class="smartlist">
                  <p>进程:<span>{{value.process}}</span></p>
                  <p>磁盘:<span>{{Number(value.rom).toFixed(2)}}</span></p>
                </div>
                <div class="smartlist">
                  <p>五分钟负载:<span>{{value.load}}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="smartTig" v-else>
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

        <div style="width:100%;display:flex;height:40px;margin-top:15px;padding:0 15px;">
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
        </div>

        <div class="smartbody" style="display:flex;margin-top:15px;padding:0 15px;" v-loading='consumeLoading'>
          <div class="consumingLeft" style="flex:1;border:1px solid #eee;z-index:1">
            <p style="font-size:15px;font-weight:700;margin:10px 0 0 15px;">SmartTrader主站耗时</p>
            <div id="smartLeft" ref="smartLeft" style="width:100%;height:240px;">
              <!-- 无数据时显示 -->
              <div v-if="useTimeShow===true" style="width:100%;height:220px;text-align:center;z-index:1000">
                <div class="giftbox" style="width:80%;height:220px;background-color:#FAFAFA;margin:auto;margin-top:20px;">
                  <i class="fa fa-gift fa-5x" style="margin-top:80px;color:#D6D6D6;"></i>
                  <span style="display:block;height:20px;color:#D6D6D6;">暂无数据</span>
                </div>
              </div>
              <!--  -->
            </div>
          </div>
          <!-- <div class="consumingRight" style="flex:1;border:1px solid #eee;">
            <p style="font-size:15px;font-weight:700;margin:10px 0 0 15px;">UF2.0耗时</p>
            <div id="smartRight" ref="smartRight" style="width:100%;height:240px"></div>
          </div> -->
        </div>
        
        <!-- 表格 -->
        <div class="smarTable">
          <div class="lefTable">
            <div class="tableHead" style="height:40px;background-color:#4b78cd;color:#FFF;text-align:center;line-height:40px;font-size:16px;font-weight:700;">TOP访问用户</div>
            <el-table :data="tableData1" style="width: 100%;" :row-class-name="tableRowClassName" border 
            :header-cell-style="{background:'rgb(134,164,218)',color:'#fff'}"  
            :default-sort="{prop: '', order: ''}" tooltip-effect="dark" v-loading='tableLoading'
            @sort-change="productchangeOrder">
              <!-- <el-table-column type="index" label="排名" align="center" width='50'></el-table-column> -->
              <el-table-column  label="UserCode" align="center"  show-overflow-tooltip height='36' sortable="custom" prop="jyyfw.content.user_code">
                <template slot-scope="scope">
                    <span>{{scope.row.UserCode}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="jyyfw.fid" label="功能号" sortable="custom" align="center" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row['功能号']}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="account" label="资金账号" sortable="custom" align="center" show-overflow-tooltip width="200">
                <template slot-scope="scope">
                    <span>{{scope.row['资金账号']}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="jyyfw.fid" label="模块" sortable="custom" align="center" show-overflow-tooltip width="220">
                <template slot-scope="scope">
                    <span>{{scope.row['功能名称']}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="cnt" label="访问量" sortable="custom" align="center" show-overflow-tooltip width="150">
                <template slot-scope="scope">
                    <span>{{scope.row['访问次数']}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="jyyfw.content.telephone" label="手机" sortable="custom" align="center" show-overflow-tooltip width="150">
                <template slot-scope="scope">
                    <span>{{scope.row['手机号']}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="时间" sortable="custom" align="center" show-overflow-tooltip width="180">
                <template slot-scope="scope">
                    <span>{{scope.row['时间(h)']}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
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
        <div style="display:flex;justify-content: flex-end;width:100%;">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.page"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>

        <div class="smartFoot" v-loading='logLoading'>
          <div class="footLeft">
            <div style="height:40px;line-height:40px;text-align:center;color:#FFF;background-color:#ff8585;font-size:16px;font-weight:700">Error日志</div>
            <el-table :data="errlogData" style="width: 100%" :show-header=false border>
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
                          <a href="javascript:;" style="line-height:40px;display:bolck;" v-if="activeNames.includes(scope.row._id)">收起</a>
                          <a href="javascript:;" style="line-height:40px;display:bolck;" v-else>展开</a>
                        </div>
                      </template>
                      <pre>{{scope.row.raw_message}}</pre>
                      <!-- <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                      <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div> -->
                    </el-collapse-item>
                  </el-collapse>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="footRight">
            <div style="height:40px;line-height:40px;text-align:center;color:#FFF;background-color:#ffa366;font-size:16px;font-weight:700">可疑日志</div>
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
                      <!-- <div v-html="scope.row.raw_message"></div> -->
                      <!-- <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div> -->
                    </el-collapse-item>
                  </el-collapse>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <smartTemplate v-if="!patternFlag" :fatherdata='changeTime' @sontime='sontime'> </smartTemplate>
    </div>
</template>

<script>
import smartTemplate from '../templates/SmartTemplate'
import {getYanshiAndFangwenliang, getMaster, getSyster, getUseTime, getMoney, getJournal, SmartlistByMap} from '@/api/xyzqPort/smartTrader'
import echarts from 'echarts'
// import {getYanshiAndFangwenliang} from '@/api/xyzqPort/smartTrader'
export default {
  data () {
    return {
      activeNames: ['1'],
      changeTime: [],
      refreshArr: [{
        value: '5',
        label: '5min'
      }, {
        value: '10',
        label: '10min'
      }, {
        value: '30',
        label: '30min'
      }],
      refresh: '5',
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
      listQuery: {
        startTime: '',
        endTime: '',
        pageSize: 10,
        page: 1,
        portalNos: '',
        uid: '',
        orderType: '-',
        orderField: 'time',
        'jyyfw.fid': '',
        paramsType: 'account',
        paramsValue: ''
      }
    }
  },
  created () {
    // 获取最近半个小时的时间
    this.getOneHoursTime()
    // 获取UID的所有id和显示信息
    this.getfunctionNumber()
  },
  components: {
    smartTemplate
  },
  mounted () {
    // 初次加载获取页面所有的数据
    this.getInit()
    this.timeIntervle = setInterval(() => {
      this.tableLoading = true
      this.echartsLoading = true
      this.pieLoading = true
      this.consumeLoading = true
      this.logLoading = true
      this.getOneHoursTime()
      this.getInit()
    }, 1000 * 60 * 5)
  },
  methods: {
    sontime (timearr) {
      console.log(timearr)
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
    changeRefsh () {
      // 切换自动刷新的时间
      clearInterval(this.timeIntervle)
      var timeDays = Number(this.refresh)
      // console.log(timeDays)
      this.timeIntervle = setInterval(() => {
        this.tableLoading = true
        this.echartsLoading = true
        this.pieLoading = true
        this.consumeLoading = true
        this.logLoading = true
        this.getOneHoursTime()
        this.getInit()
      }, 1000 * 60 * timeDays)
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
      // this.listQuery.startTime = '2019-12-26 16:16:00'
      // this.listQuery.endTime = '2019-12-26 16:46:00'
      this.listQuery.portalNos = 'b31_21,b21_31,getTwo,b31_212,b21_312,b12_13'
      this.titObj.yanshiavg = 0
      this.titObj.fwlSum = 0
      getYanshiAndFangwenliang(this.listQuery).then(response => {
        this.echartsLoading = false
        // 当返回的数据是null的时候
        if (response.data.data === null) {
          this.titObj.yanshiavg = 0
          this.titObj.fwlSum = 0
          this.dataHide = true
          this.fwlzyShow = true
          this.ysShow = true
          this.ysbigShow = true
          this.fwlblShow = true
          this.fwlbigShow = true
        }
        if (response.data.result === 'success') {
          if (response.data.data.hasOwnProperty('yanshiavg')) {
            this.titObj.yanshiavg = response.data.data.yanshiavg
          } else {
            this.titObj.yanshiavg = 0
          }
          if (response.data.data.hasOwnProperty('fwlSum')) {
            this.titObj.fwlSum = response.data.data.fwlSum
          } else {
            this.titObj.fwlSum = 0
          }
          // response.data.data.yszy.xAxis = []
          if (response.data.data.hasOwnProperty('yszy') && response.data.data.yszy.xAxis.length !== 0 && JSON.stringify(response.data.data.yszy.xAxis) !== '{}') {
            this.newrenderEcharts('delayOne', response.data.data.yszy)
          } else {
            this.dataHide = true
          }
          // response.data.data.fwlzy.xAxis = []
          if (response.data.data.hasOwnProperty('fwlzy') && response.data.data.fwlzy.xAxis.length !== 0 && JSON.stringify(response.data.data.fwlzy.xAxis) !== '{}') {
            this.newrenderEcharts('visitOne', response.data.data.fwlzy)
          } else {
            this.fwlzyShow = true
          }
          // 延时(延时最大)
          if (response.data.data.hasOwnProperty('ys5mapt') && response.data.data.ys5mapt.xAxis.length !== 0 && JSON.stringify(response.data.data.ys5mapt.xAxis) !== '{}') {
            this.newrenderEcharts('delayThree', response.data.data.ys5mapt)
          } else {
            this.ysShow = true
          }
          // 访问量延时最大
          if (response.data.data.hasOwnProperty('ysfwl5mapt') && response.data.data.ysfwl5mapt.xAxis.length !== 0 && JSON.stringify(response.data.data.ysfwl5mapt.xAxis) !== '{}') {
            this.newrenderEcharts('visitThree', response.data.data.ysfwl5mapt)
          } else {
            this.ysbigShow = true
          }
          // 访问量(使用率高)
          // response.data.data.fwl5mapt.xAxis = []
          if (response.data.data.hasOwnProperty('fwl5mapt') && response.data.data.fwl5mapt.xAxis.length !== 0 && JSON.stringify(response.data.data.fwl5mapt.xAxis) !== '{}') {
            this.newrenderEcharts('visitTwo', response.data.data.fwl5mapt)
          } else {
            this.fwlblShow = true
          }
          // response.data.data.fwlys5mapt.xAxis = []
          // 延时(使用率高)
          if (response.data.data.hasOwnProperty('fwlys5mapt') && response.data.data.fwlys5mapt.xAxis.length !== 0 && JSON.stringify(response.data.data.fwlys5mapt.xAxis) !== '{}') {
            this.newrenderEcharts('delayTwo', response.data.data.fwlys5mapt)
          } else {
            this.fwlbigShow = true
          }
        }
      })
      this.titObj.fuwu = ''
      getMaster(this.listQuery).then(response => {
        this.infoArr = []
        this.tipsArr = []
        // debugger
        if (response.data.result === 'success') {
          this.infoArr = response.data.data.returnlist
          this.titObj.fuwu = response.data.data.fuwu
          if (response.data.data.reaList) {
            this.tipsArr = response.data.data.reaList
          }
        }
      })
      // 饼图echarts
      getSyster(this.listQuery).then(response => {
        this.pieLoading = false
        if (response.data.data !== null) {
          // response.data.data.caozuoallname = []
          // response.data.data.yingyongallname = []
          if (response.data.data.caozuoallname.length > 0) {
            var cz = {
              name: response.data.data.caozuoallname,
              list: response.data.data.caozuolist
            }
            this.pieEcharts('operation', cz, 1)
          } else {
            this.pieOpShow = true
          }
          if (response.data.data.yingyongallname.length > 0) {
            var yy = {
              name: response.data.data.yingyongallname,
              list: response.data.data.yingyonglist
            }
            this.pieEcharts('version', yy, 2)
          } else {
            this.pieVeShow = true
          }
        }
      })
      this.getfootData()
      // 获取底部日志的log接口信息
      getJournal(this.listQuery).then(response => {
        this.logLoading = false
        this.logData = []
        this.errlogData = []
        if (response.data.result === 'success') {
          this.logData = response.data.data.keyiList
          this.errlogData = response.data.data.errorList
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
      getUseTime(this.listQuery).then(response => {
        this.consumeLoading = false
        if (response.data.result === 'success') {
          var adrows = response.data.data.series
          for (let i = 0; i < adrows.length; i++) {
            var narr = adrows[i].data
            for (let j = 0; j < narr.length; j++) {
              narr[j] = Number(narr[j]).toFixed(2)
            }
            // adrows[i].itemStyle.color = 'blue'
          }
          // if (response.data.data.xAxis.length > 0) {
          this.newrenderEcharts('smartLeft', response.data.data)
          // } else {
          //   this.useTimeShow = true
          // }
          // if (response.data.data.xAxis.length === 0) {
          //   this.useTimeShow = true
          // }
          this.titObj.lianlu = response.data.data.lianlu
          this.titObj.errorList = response.data.data.reaList
        }
      })
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
      start.setTime(start.getTime() - 60 * 1000 * 30 * 6 + 1000)
      var s = this.getTimeByDate(start)
      var e = this.getTimeByDate(end)
      console.log(end)
      console.log(e)
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
      this.changeTime = [s, e]
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
      // if (window.ActiveXObject || 'ActiveXObject' in window) {
      //   event.target.setSelectionRange(this.position.length, this.position.length)
      // }
    },
    newrenderEcharts (id, data) {
      // console.log(window.innerWidth)
      var top = '28%'
      var fonts = 11
      if (window.innerWidth <= 1280) {
        top = '31%'
        fonts = 10
      }
      for (let i = 0; i < data.legend.length; i++) {
        data.legend[i] = data.legend[i] + '-' + this.getidreturnName(data.legend[i])
      }
      data.series.forEach(item => {
        item.name = item.name + '-' + this.getidreturnName(item.name)
      })
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
          data: data.legend,
          textStyle: {
            fontSize: fonts
          }
        },
        // legend: data.legend,
        tooltip: {
          trigger: 'axis',
          // cursor: 'pointer',
          // formatter: '{a}' + '{c}',

          axisPointer: {
            type: 'line'
          }
        },
        // 时间选择
        // brush: {
        //   xAxisIndex: 'all',
        //   toolbox: ['clear'],
        //   // brushLink: 'all',
        //   transformable: false,
        //   throttleType: 'debounce',
        //   outOfBrush: {
        //     colorAlpha: 0.1,
        //     color: 'transparent'
        //   }
        // },
        xAxis: [
          {
            type: 'category',
            data: data.xAxis,
            axisPointer: {
              type: 'line'
            },
            axisLabel: {
              interval: '0',
              textStyle: {
                color: function (value, index) {
                  if (data.xAxis.length > 6) {
                    return index % 3 === 0 ? '#aaa' : 'transparent'
                  } else {
                    return '#aaa'
                  }
                }
              },
              formatter: function (value) {
                if (value.length > 5) {
                  return value
                } else {
                  return value
                }
              },
              rotate: 30
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
            }
          }
        ],
        series: data.series
      }, true)
      var arr = []
      myChart.getZr().on('mousedown', (params) => {
        var pointInPixel = [params.offsetX, params.offsetY]
        var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
        var xIndex = pointInGrid[0]
        var op = myChart.getOption()

        // /
        // this.changeTime[0] = op.xAxis[0].data[xIndex]
        // this.$set(this.changeTime, 0, op.xAxis[0].data[xIndex])
        // arr[0] = this.changeTime[0]
        // renderArr[0] = this.changeTime[0]
      })
      myChart.getZr().on('mouseup', (params) => {
        var pointInPixel = [params.offsetX, params.offsetY]
        var pointInGrid = myChart.convertFromPixel({seriesIndex: 0}, pointInPixel)
        var xIndex = pointInGrid[0]
        var op = myChart.getOption()

        // this.changeTime[1] = op.xAxis[0].data[xIndex]
        // this.$set(this.changeTime, 1, op.xAxis[0].data[xIndex])
        // arr[1] = this.changeTime[1]
        // this.getInit()
        myChart.dispatchAction({
          type: 'brush',
          areas: [
            {
              brushType: 'lineX',
              coordRange: arr,
              xAxisIndex: 'arr'
            }
          ]
        })
        arr = []
      })
      myChart.dispatchAction({
        type: 'brush',
        areas: [
          {
            brushType: 'lineX',
            coordRange: arr,
            xAxisIndex: 'all'
          }
        ]
      })
      // myChart.on('brushselected', renderBrushed)
      // function renderBrushed (params) {
      //   console.log(params)
      //   var timeArr = params.batch[0].areas[0].coordRange
      // }
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
            margin-right: 50px;
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
                animation: heart 3s infinite linear;
              }
            }
            @keyframes heart {
              0% { 
                opacity:1; 
              }
              10% {
                opacity: 0.9;
              }
              20% {
                opacity: 0.8;
              }
              30% {
                opacity: 0.7;
              }
              40% {
                opacity: 0.6;
              }
              50% { 
                opacity:0.5; 
                // color: black;
              }
              60% { 
                opacity:0.6; 
              }
              70% { 
                opacity:0.7; 
              }
              80% { 
                opacity:0.8; 
              }
              90% { 
                opacity:0.9; 
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
        margin-top: 15px;
        width: 100%;
        display: flex;
        flex-flow: wrap;
        .smartbox{
          width: 33.3%;
          height: 100px;
          border-right: 2px solid #FFF;
          border-bottom: 2px solid #FFF;
          background-color:#67c23a;
          color: #fff;
          h4{
            padding: 0;
            margin:0;
            text-align: center;
            line-height:25px;
            // margin-top: 10px;
            font-size: 16px;
          }
          .smartinfo{
            display: flex;
            .smartlist{
              flex: 1;
              p{
                margin: 10px 0;
                // padding-left: 15px;
                text-align: center;
                font-size:14px;
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
</style>