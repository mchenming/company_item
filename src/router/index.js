import Vue from 'vue'
import Router from 'vue-router'
// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有开发环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

Vue.use(Router)

// 路由定义使用说明:
// 1. 代码中路由统一使用name属性跳转.
// 2. 开放path属性用做简短路由, 比如: '/a1', 访问地址: www.renren.io/#/a1

export default new Router({
  mode: 'hash',
  routes: [
    { path: '/404', component: _import('error/404'), name: '404', desc: '404未找到' },
    { path: '/preview', name: 'preview', component: _import('mailpost/preview'), desc: '绩效预览' }, // 37 邮件发送
    { path: '/previewSecond', name: 'previewSecond', component: _import('mailpost/previewSecond'), desc: '二期绩效预览' }, // 41 需求成效评价
    { path: '/lookUp', name: 'lookUp', component: _import('mailpost/lookUp'), desc: '绩效预览查看' }, // 38 邮件发送
    { path: '/newlookUp', name: 'newlookUp', component: _import('mailpost/newlookUp'), desc: '新绩效预览查看' }, // 40 需求成效评价
    {
      path: '/',
      name: 'frameCon',
      component: _import('home/frameCon'),
      redirect: {name: 'qualityPort'},
      children: [
        { path: '/eHomePort', name: 'eHomePort', component: _import('xyzqPort/eHomePort'), desc: 'E家质量' },
        { path: '/qualityPort', name: 'qualityPort', component: _import('xyzqPort/qualityPort'), desc: '质量看板' },
        { path: '/qualityPortNew', name: 'qualityPortNew', component: _import('xyzqPort/qualityPortNew'), desc: '质量看板new' }, // 8 项目看板
        { path: '/StatisticsPort', name: 'StatisticsPort', component: _import('xyzqPort/StatisticsPort'), desc: '统计看板' },
        { path: '/serverPort', name: 'serverPort', component: _import('xyzqPort/serverPort'), desc: '服务' }, // 26 敏感词扫描
        { path: '/serverinfo', name: 'serverinfo', component: _import('xyzqPort/serverinfo'), desc: '服务详情' }, // 27 敏感词扫描
        { path: '/serverTable', name: 'serverTable', component: _import('xyzqPort/serverTable'), desc: '定时任务详情' }, // 28 敏感词扫描
        { path: '/youlibao', name: 'youlibao', component: _import('xyzqPort/youlibao'), desc: '优理宝' }, // 1
        { path: '/joblist', name: 'joblist', component: _import('xyzqPort/joblist'), desc: '工作一览' },
        { path: '/leaderReport', name: 'leaderReport', component: _import('xyzqPort/leaderReport'), desc: '领导视窗' }, // 2
        { path: '/newleaderReport', name: 'newleaderReport', component: _import('xyzqPort/newleaderReport'), desc: '领导视窗' },
        { path: '/user', component: _import('user/index'), name: 'user', desc: '管理员管理' }, // 33 用户管理
        { path: '/role', component: _import('role/index'), name: 'role', desc: '角色管理' }, // 34 角色管理
        { path: '/menu', component: _import('menu/index'), name: 'menu', desc: '菜单管理' }, // 35 菜单管理
        { path: '/log', component: _import('log/index'), name: 'log', desc: '系统日志' },  // 36 系统日志
        { path: '/esal', component: _import('xyzqPort/esal'), name: 'esal', desc: 'e家服务' },
        { path: '/ebusiness', component: _import('xyzqPort/ebusiness'), name: 'ebusiness', desc: 'e家业务场景' },
        { path: '/eproblem', component: _import('xyzqPort/eproblem'), name: 'eproblem', desc: 'e家生产问题' },
        { path: '/errnode', component: _import('xyzqPort/errnode'), name: 'errnode', desc: 'e家节点异常' },
        { path: '/crashdata', component: _import('xyzqPort/crashdata'), name: 'crashdata', desc: 'e家crash数据' },
        { path: '/etopfive', component: _import('xyzqPort/etopfive'), name: 'etopfive', desc: 'e家top5' },
        { path: '/erprob', component: _import('erleader/erprob'), name: 'erprob', desc: '领导视窗二级产线' },  // 6
        { path: '/erneed', component: _import('erleader/erneed'), name: 'erneed', desc: '领导视窗二级需求' }, // 3
        { path: '/erstantard', component: _import('erleader/erstantard'), name: 'erstandard', desc: '领导视窗二级redmine规范' },  // 7  项目驾驶舱2-7
        { path: '/esubmission', component: _import('erleader/esubmission'), name: 'esubmission', desc: '领导视窗二级提交缺陷分布' }, // 5
        { path: '/ertask', component: _import('erleader/ertask'), name: 'ertask', desc: '领导视窗二级任务块' }, // 4
        { path: '/eronlineversion', component: _import('erleader/eronlineversion'), name: 'eronlineversion', desc: '领导视窗二级上线版本' },
        { path: '/successlogin', component: _import('erleader/successlogin'), name: 'successlogin', desc: '登陆成功后的img' },
        { path: '/newdefect', component: _import('erleader/newdefect'), name: 'newdefect', desc: '新的二级缺陷页面' },
        { path: '/newerprob', component: _import('erleader/newerprob'), name: 'newerprob', desc: '新的二级产线页面' },
        { path: '/newtask', component: _import('erleader/newtask'), name: 'newtask', desc: '新的二级任务页面' },
        { path: '/task', component: _import('erleader/task'), name: 'task', desc: '二级任务页面' },
        { path: '/yewuneed', component: _import('erleader/yewuneed'), name: 'yewuneed', desc: '新的业务需求页面' },
        { path: '/newRedmine', component: _import('erleader/newRedmine'), name: 'newRedmine', desc: '新的redmine规范' },
        { path: '/needlist', component: _import('erleader/needlist'), name: 'needlist', desc: '新的需求列表页面' },
        { path: '/mailpost', component: _import('mailpost/mailpost'), name: 'mailpost', desc: '邮件策略的页面' },
        { path: '/ReqPort', component: _import('xyzqPort/NeedPort'), name: 'NeedPort', desc: '项目看板需求看板' }, // 10 旧需求看板
        { path: '/OaPort', component: _import('xyzqPort/OaPort'), name: 'OaPort', desc: '项目看板oa需求看板' },  // 12 需求看板
        { path: '/isyqPort', component: _import('xyzqPort/isyqPort'), name: 'isyqPort', desc: '项目看板需求看板延期列表' }, // 11 旧需求看板
        { path: '/OaisyqPort', component: _import('xyzqPort/OaisyqPort'), name: 'OaisyqPort', desc: '项目看板OA需求看板延期列表' }, // 13需求看板
        { path: '/SmartTrader', component: _import('xyzqPort/SmartTrader'), name: 'SmartTrader', desc: '质量墙SmartTrader页面' }, // 19 SMART
        { path: '/newEhome', component: _import('newEhome/newEhome'), name: 'newEhome', desc: '新的e家' }, // 20 newHome
        { path: '/newcrashdata', component: _import('newEhome/newcarshdata'), name: 'newcarshdata', desc: '新的e家子页面' }, // 21 兴证e家
        { path: '/newebusiness', component: _import('newEhome/newebusiness'), name: 'newebusiness', desc: '新的e家子页面' }, // 22 兴证e家
        { path: '/neweproblem', component: _import('newEhome/neweproblem'), name: 'neweproblem', desc: '新的e家子页面' }, // 23 兴证e家
        { path: '/newerrnode', component: _import('newEhome/newerrnode'), name: 'newerrnode', desc: '新的e家子页面' }, // 24 兴证e家
        { path: '/newesal', component: _import('newEhome/newesal'), name: 'newesal', desc: '新的e家子页面' }, // 25 兴证e家
        { path: '/management', component: _import('management/management'), name: 'management', desc: '系统管理系统配置' },
        { path: '/Relation', component: _import('Relation/relation'), name: 'Relation', desc: '关联需求管理页面' },
        { path: '/Digital', component: _import('xyzqPort/Digital'), name: 'Digital', desc: '电子看板' },  // 9 电子看板
        { path: '/BFsmart', component: _import('xyzqPort/BFsmartTrader'), name: 'BFsmartTrader', desc: '备份的smartTrader' },
        { path: '/doubtfulLog', component: _import('xyzqPort/doubtfulLog'), name: 'doubtfulLog', desc: 'smartTrader二级可疑日志' },
        { path: '/achievement', component: _import('xyzqPort/achievement'), name: 'achievement', desc: '绩效oa子页面' }, // 14需求看板
        { path: '/EmailPost', component: _import('mailpost/EmailPost'), name: 'EmailPost', desc: '邮件日志' }, // 37 邮件发送
        { path: '/userinfo', component: _import('casebase/userinfo'), name: 'userinfo', desc: '测试单' },
        { path: '/caseline', component: _import('casebase/caseline'), name: 'caseline', desc: '关联详情' },
        { path: '/EmailPostOther', component: _import('mailpost/twoEmailPost'), name: 'EmailPostOther', desc: 'EmailPostOther' }, // 39 需求成效评价
        {path: '/casebase', component: _import('xyzqPort/casebase'), name: 'casebase', desc: '案例库'}, // 29 用例库
        { path: '/defineModule', component: _import('casebase/defineModule'), name: 'defineModule' },  // 30 用例库
        { path: '/newCase', component: _import('casebase/newCase'), name: 'newCase' },  // 31 用例库
        { path: '/detail', component: _import('casebase/detail'), name: 'detail', desc: '查看编辑详情信息' }, // 32 用例库
        {path: '/ItemConfig', component: _import('Relation/itemConfig'), name: 'ItemConfig', desc: '项目关联配置'}, // 42 项目关系配置
        {path: '/ItemConfigChild', component: _import('Relation/ItemConfigChild'), name: 'ItemConfigChild', desc: '项目关联配置info'}, // 43项目关系配置
        {path: '/itemRedmineChild', component: _import('Relation/itemRedmineChild'), name: 'itemRedmineChild', desc: 'redmine子集配置'}, // 44 项目关系配置
        {path: '/cicdIndex', component: _import('cicd/cicdIndex'), name: 'cicdIndex', desc: 'cicd首页'}, // 15 CICD 16下面
        {path: '/cicdDetails/:projectId/:projectName/:statisPeriod', component: _import('cicd/cicdDetails'), name: 'cicdDetails', desc: 'cicd详情'}, // statisPeriod = %说明不是历史返回的不等于%就是历史返回的
        {path: '/cicdHistory/:projectId/:proname', component: _import('cicd/cicdHistory'), name: 'cicdHistory', desc: 'cicd历史'}, // 17cicd
        // {path: '/cicdInfo', component: _import('cicd/cicdInfo'), name: 'cicdInfo', desc: 'cicd信息详情'},
        {path: '/cicdChartInfo/:projectId/:projectName/:proid/:proname/:statisPeriod', component: _import('cicd/cicdChartInfo'), name: 'cicdChartInfo', desc: 'cicd图表信息详情'}, // 18cicd
        {path: '/pvuv', component: _import('log/pvuv'), name: 'pvuv', desc: '用户访问量'}
        // { path: '/detail', component: _import('casebase/detail'), name: 'detail' }
        // { path: '/test', component: _import('xyzqPort/test'), name: 'test', desc: '222' }
        // { path: '/mgtCenter',
        //   name: 'mgtCenter',
        //   component: _import('port/mgtCenter'),
        //   desc: '管理中心',
        //   children: [
        //   ]
        // }
      ]
      // beforeEnter (to, from, next) {
      //   let token = Vue.cookie.get('token')
      //   if (!token || !/\S/.test(token)) {
      //     next({ name: 'login' })
      //   }
      //   next()
      // }
    },
    { path: '/login', component: _import('login/index'), name: 'login', desc: '登录' },
    {
      path: '/',
      component: _import('layout/index'),
      name: 'index1',
      redirect: { name: 'qualityBoard' },
      desc: '上布局',
      children: [
        { path: '/home', component: _import('home/index'), name: 'home', desc: '首页' },
        {
          path: '/',
          component: _import('layout/indexVice'),
          name: 'layout',
          redirect: { name: 'home' },
          desc: '左右整体布局',
          children: [
            {
              path: '/content-tabs',
              component: _import('layout/content-tabs'),
              name: 'content-tabs',
              redirect: { name: '404' },
              desc: '内容需通过tabs展示',
              children: [
                // 以'/n'开头统一拦截, 标记为左侧菜单导航tab展示内容方式路由
                { path: '/n/user', component: _import('user/index'), name: 'user', desc: '管理员管理' },
                { path: '/n/role', component: _import('role/index'), name: 'role', desc: '角色管理' },
                { path: '/n/menu', component: _import('menu/index'), name: 'menu', desc: '菜单管理' },
                { path: '/n/schedule', component: _import('schedule/index'), name: 'schedule', desc: '定时任务' },
                { path: '/n/config', component: _import('config/index'), name: 'config', desc: '参数管理' },
                { path: '/n/oss', component: _import('oss/index'), name: 'oss', desc: '文件上传' },
                { path: '/n/log', component: _import('log/index'), name: 'log', desc: '系统日志' }
              ]
            }
          ]
        }
      ],
      beforeEnter (to, from, next) {
        let token = Vue.cookie.get('token')
        if (!token || !/\S/.test(token)) {
          next({ name: 'login' })
        }
        next()
      }
    },
    { path: '*', redirect: { name: '404' } }
  ]
})
