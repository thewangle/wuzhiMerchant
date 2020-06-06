<template>
  <div class="loginWrap">
    <div class="vanNavBar" style="background:white;">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter">今日之最</div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="hellpWrap" @click="popupVisible = true">
      <div class="hellpWrap1">
        <img src="../../assets/img/hellp.png" alt="" class="hellpImg">
        <span class="hellpB">使用帮助</span>
      </div>
    </div>
    <div class="selectB">
      <el-select v-model="listQuery.kind" placeholder="请选择最种类" style="width: 80%;" @change="handleFilter">
          <el-option v-for="item in zuizl" :label="item.label" :value="item.value"/>
        </el-select>
    </div>
    <mt-navbar v-model="selected" style="margin:30px 0;">
      <mt-tab-item id="1"><span @click="istaday" style="width:100%;display:block;">今日</span></mt-tab-item>
      <mt-tab-item id="2"><span @click="istaday1" style="width:100%;display:block;">昨日</span></mt-tab-item>
    </mt-navbar>
    <div class="infoWrap">
        <div class="zuiList">
            <div class="isStart"><span>{{ istady }}</span>之星</div>
            <div class="zuiListWrap">
                <img src="../../assets/img/good.png" alt="" class="goodImg">
                <div class="zuiB">{{ startname }}</div>
                <div class="zuiInfo">
                  <div style="margin-right:15px;"><span>数量：</span><span class="zuiInfoNum">{{ startnum }}</span></div>
                  <div><span>额度：</span><span class="zuiInfoNum">¥{{ startmoney }}</span></div>
                </div>
            </div>
        </div>
        <div class="zuiList" style="margin: 80px 0;">
          <div class="isStart" style="background:#909399;">该努力了</div>
          <div class="zuiListWrap">
            <img src="../../assets/img/nogood.png" alt="" class="goodImg">
            <div class="zuiB">{{ unstartname }}</div>
            <div class="zuiInfo">
              <div style="margin-right:15px;"><span>数量：</span><span class="zuiInfoNum">{{ unstartnum }}</span></div>
              <div><span>额度：</span><span class="zuiInfoNum">¥{{ unstartmoney }}</span></div>
            </div>
          </div>
        </div>
    </div>
    <mt-popup v-model="popupVisible" position="right">
      <div class="hellpContent">
        <div class="hellepB" @click="popupVisible = false"><span class="hellepBB">今日之最 - 使用帮助</span><span class="hellepBBB">X</span></div>
        <div class="hellepDiv smB">概述：此页为当前账号"今日"和"昨日"的各项之最</div>
        <div class="smContent">
          <span class="smContentB">今日之最：</span>
          <div class="smContentC">
            <div>1.下拉框可选择"销售、退货、报损、补货、新产品入库、总库存"之最</div>
            <div>2."商场级别"账号可以选择部门来查看所选部门的经营报表（默认不选择，展现整个商场的经营报表，选择后可去除）</div>
            <div>3.点击"昨日"展示当前账号"昨日"的销售、退货、报损、补货、新入库、当前库存的相关信息（默认"今日"）</div>
            <div>4.点击"今日"展示当前账号"今日"的销售、退货、报损、补货、新入库、当前库存的相关信息</div>
            <div>5.下面展示所选条件下的"今日之星"和"需要努力"的相关信息</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB">备注：</span>
          <div class="smContentC smContentCc">
            <div>1.数据为 0 时不参与评比，例如：销售之最，如果销售为 0 则不参与最好和最差评选</div>
            <div>2."商场级别"账号展现其下面部门之最</div>
            <div>3."部门级别"账号展现其下面柜组之最</div>
            <div>4."柜组级别"账号展现其下面单品之最</div>
            <div>5.点击"返回"将进入"导航页"</div>
            <div>6."新入库"是指之前没有的产品新入库，区别于"补货"(补货是对已有产品的补缺)</div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { getmostone } from '@/api/report'
import { getpartantId, getRoleId, getUserid } from '@/utils/cookie'
import moment from 'moment' //日期转换插件

export default {
  name: 'most',
  components: {
    
  },
  mounted() {
    this.handleFilter()
  },
  data () {
    return {
      popupVisible: false,
      selected: '1',
      istady: '今日',
      listQuery: { 
        time: [],
        kind: 1,
        role: getRoleId(),
        uid: getUserid(),
        pid: getpartantId()
      },
      zuizl: [
        {value: 1,label: '销售之最'},
        {value: 2,label: '退货之最'},
        {value: 3,label: '报损之最'},
        {value: 4,label: '补货之最'},
        {value: 5,label: '新入库之最'},
        // {value: 6,label: '库存之最'},
      ],
      startname: '暂无数据',
      unstartname: '暂无数据',
      startnum: 0,
      startmoney: 0,
      unstartnum: 0,
      unstartmoney: 0,
    }
  },
  methods: {
    istaday() {
      this.selected = 1
      this.istady = '今日'
      this.handleFilter()
    },
    istaday1() {
      this.selected = 2
      this.istady = '昨日'
      this.handleFilter()
    },
    //获取今日之最信息
    handleFilter() {
      let startTime =moment(new Date(new Date(new Date().toLocaleDateString()).getTime())).valueOf() // 当天0点
      let endTime = startTime + 24 * 60 * 60 * 1000 -1// 当天23:59
      let zuoTime = startTime - 24 * 60 * 60 * 1000// 昨日 24:00
      if (this.selected == '1') {
        this.listQuery.time = []
        this.listQuery.time.push(startTime / 1000)
        this.listQuery.time.push(endTime / 1000)
      }
      if (this.selected == '2') {
        this.listQuery.time = []
        this.listQuery.time.push(zuoTime / 1000)
        this.listQuery.time.push(startTime / 1000)
      }
      this.startname = this.unstartname = '暂无数据'
      this.startnum = this.startmoney = this.unstartnum = this.unstartmoney = 0
      getmostone(this.listQuery).then(res => {
        let { data } = res
        if (data.firstname) {
          this.startname = data.firstname
        }
        if (data.lastname) {
          this.unstartname = data.lastname
        }
        if (data.mostinfo.firstone.soldnum) {
          this.startnum = data.mostinfo.firstone.soldnum
        }
        if (data.mostinfo.firstone.soldmonye) {
          this.startmoney = data.mostinfo.firstone.soldmonye
        }
        if (data.mostinfo.lastone.soldnum) {
          this.unstartnum = data.mostinfo.lastone.soldnum
        }
        if (data.mostinfo.lastone.soldmonye) {
          this.unstartmoney = data.mostinfo.lastone.soldmonye
        }
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>

<style scoped>
.selectB {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.infoWrap {
    width: 100%;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.zuiList {
    position: relative;
    width: 80%;
    height: 400px;
}
.isStart {
    border-radius: 50%;
    position: absolute;
    z-index: -1;
    font-size: 12px; /*no*/
    color: white;
    top: -10px;
    right: 0px;
    width: 120px;
    height: 120px;
    background: #F56C6C;
    text-align: center;
    line-height: 70px;
}
.zuiListWrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .42), 0 0 6px rgba(0, 0, 0, .14);
    margin-top: 40px;
}
.goodImg {
    width: 100px;
    height: 100px;
}
.zuiB {
    color: #409EFF;
    font-weight: bold;
    font-size: 20px; /*no*/
    margin: 20px 0;
}
.zuiInfo {
    font-size: 16px; /*no*/
    color: rgb(150,150,150);
    display: flex;
}
.zuiInfoNum {
    color: #F56C6C;
}
</style>
