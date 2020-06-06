<template>
  <div class="loginWrap">
    <div class="vanNavBar reportF">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span style="color:white;">返回</span></div>
      <div class="vanNavBarCenter" style="color:white;">经营报表</div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="hellpWrap" @click="popupVisible = true">
      <div class="hellpWrap1">
        <img src="../../assets/img/hellp.png" alt="" class="hellpImg">
        <span class="hellpB" style="color:white;">使用帮助</span>
      </div>
    </div>
    <div class="reportImgWrap">
      <img src="../../assets/img/reportbg.png" alt="" class="reportImg">
      <div class="reportImgInfo">
        <div class="reportImgInfoWrap1">
          <div class="reportImgInfoWrap">
            <!-- <div class="info"><span class="yingkui">￥{{ saleprofit }}</span><span>销售盈亏</span></div> -->
            <div class="fenInfo">
              <div><span class="infoN size18"><span>{{salenums}}</span></span><span>销售数量</span></div>
              <div><span class="infoN size18">￥{{ salemoney }}</span><span>销售额</span></div>
            </div>
            <!-- <div class="fenInfo">
              <div><span class="infoN">￥{{ salecb }}</span><span>销售成本</span></div>
              <div><span class="infoN">%{{ salelilv }}</span><span>销售利率</span></div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="infoWrap">
      <div class="selectB" v-if="is_zzh">
        <el-select style="width: 80%;margin-bottom:30px;" v-model="listQuery2.bm" placeholder="请选择部门" clearable @change="handleFilter2">
          <el-option v-for="item in bms" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="selectB" v-if="is_bm">
        <el-select style="width: 80%;margin-bottom:30px;" v-model="listQuery2.gz" placeholder="请选择柜组" clearable @change="handleFilter2">
          <el-option v-for="item in gzs" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <mt-navbar v-model="selected">
        <mt-tab-item id="1"><span @click="istaday" style="width:100%;display:block;">今日</span></mt-tab-item>
        <mt-tab-item id="2"><span @click="istaday1" style="width:100%;display:block;">昨日</span></mt-tab-item>
      </mt-navbar>
      <ul class="infoListWrap">
        <li class="infoList">
          <div class="infoListB">退</div>
          <div class="infoListC">
            <div><span class="infoN">{{returnums}}</span><span>退货数量</span></div>
            <div><span class="infoN">￥{{returnmoney}}</span><span>退货额</span></div>
          </div>
        </li>
        <li class="infoList">
          <div class="infoListB" style="background:#909399;">损</div>
          <div class="infoListC">
            <div><span class="infoN">{{lossums}}</span><span>报损数量</span></div>
            <div><span class="infoN">￥{{lossmoney}}</span><span>报损额</span></div>
          </div>
        </li>
        <li class="infoList">
          <div class="infoListB" style="background:#E6A23C;">补</div>
          <div class="infoListC">
            <div><span class="infoN">{{patchnums}}</span><span>补货数量</span></div>
            <div><span class="infoN">￥{{patchmoney}}</span><span>补货额</span></div>
          </div>
        </li>
        <li class="infoList">
          <div class="infoListB" style="background:#F56C6C;">入</div>
          <div class="infoListC">
            <div><span class="infoN">{{storageums}}</span><span>新入库数量</span></div>
            <div><span class="infoN">￥{{storagemoney}}</span><span>新入库成本</span></div>
          </div>
        </li>
        <li class="infoList">
          <div class="infoListB" style="background:#67C23A;">存</div>
          <div class="infoListC">
            <div><span class="infoN">{{stockums}}</span><span>总库存数量</span></div>
            <div><span class="infoN">￥{{stockmoney}}</span><span>总库存成本</span></div>
          </div>
        </li>
      </ul>
    </div>
    <mt-popup v-model="popupVisible" position="right">
      <div class="hellpContent">
        <div class="hellepB" @click="popupVisible = false"><span class="hellepBB">经营报表 - 使用帮助</span><span class="hellepBBB">X</span></div>
        <div class="hellepDiv smB">概述：此页为当前账号"今日"和"昨日"的经营状况</div>
        <div class="smContent">
          <span class="smContentB">经营状况：</span>
          <div class="smContentC">
            <div>1.此栏展现当前登录账号"今日"和"昨日"的经营状况</div>
            <div>2."商场级别"账号可以选择部门来查看所选部门的经营报表（默认不选择，展现整个商场的经营报表，选择后可去除）</div>
            <div>3."部门级别"账号可以选择柜组来查看所选柜组的经营报表（默认不选择，展现整个部门的经营报表，选择后可去除）</div>
            <div>4.点击"昨日"展示当前账号"昨日"的销售、退货、报损、补货、新入库、当前库存的相关信息（默认"今日"）</div>
            <div>5.点击"今日"展示当前账号"今日"的销售、退货、报损、补货、新入库、当前库存的相关信息</div>
            <div>6.上面显示框展示该账号"今日"或"昨日"的销售盈亏、销售数量、销售额、销售成本、销售利率</div>
            <div>7.下面列表展示该账号"今日"或"昨日"的退货、退货、报损、补货、新入库、当前库存的数量和额度</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB">备注：</span>
          <div class="smContentC smContentCc">
            <div>1."退货额"为当时退货操作时的"售价"字段，"报损额"、"补货额"、"入库成本"、"库存成本"均为"进价"</div>
            <div>2.点击"返回"将进入"导航页"</div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { getallUserByidthis, getruninfo } from '@/api/report'
import { getcost } from '@/api/user'
import { getpartantId, getRoleId, getUserid } from '@/utils/cookie'
import moment from 'moment' //日期转换插件

export default {
  name: 'report',
  components: {
    
  },
  mounted() {
    if (getRoleId() !=3) {
      this.getAllUserByidthis()
    }
    if (getRoleId() == 1) {
      this.is_zzh = true
      this.is_bm = false
    } else if (getRoleId() == 2) {
      this.is_zzh = false
      this.is_bm = true
    } else if (getRoleId() == 3) {
      this.is_zzh = false
      this.is_bm = false
    }
    this.handleFilter2()
  },
  data () {
    return {
      popupVisible: false,
      selected: '1',
      is_zzh: false,
      is_bm: false,
      bms: [],
      gzs: [],
      salenums: 0,
      salemoney: 0,
      saleprofit: 0,
      salelilv: 0,
      salecb: 0,
      returnums: 0,
      returnmoney: 0,
      lossums: 0,
      lossmoney: 0,
      patchnums: 0,
      patchmoney: 0,
      storageums: 0,
      storagemoney: 0,
      stockums: 0,
      stockmoney: 0,
      listQuery2: { 
        time: [],
        bm: '',
        gz: '',
        role: getRoleId(),
        uid: getUserid(),
        pid: getpartantId()
      },
      listQuery3: { 
        role: getRoleId(),
        uid: getUserid(),
        pid: getpartantId()
      },
    }
  },
  methods: {
    //根据用户id获取该id下的所有用户信息
    getAllUserByidthis() {
      getallUserByidthis(this.listQuery2).then(res => {
        let {data} = res
        data.forEach((item) => {
          if (getRoleId() == 1) {
            this.bms.push({label:item.department,value:item.id})
          }
          if (getRoleId() == 2) {
            this.gzs.push({label:item.department,value:item.id})
          }
        })
      }).catch(error => {
        console.log(error)
      })
    },
    istaday() {
      this.selected = 1
      this.handleFilter2()
    },
    istaday1() {
      this.selected = 2
      this.handleFilter2()
    },
    //获取经营报表信息
    handleFilter2() {
      getcost(this.listQuery3).then(res => {
        let {data} = res
        console.log(data)
        if (data.code == 200) {
          this.stockmoney = data.data[0].cost
        } else {
          this.stockmoney = 0
        }
      }).catch(err => {
        this.stockmoney = 0
      })
      let startTime =moment(new Date(new Date(new Date().toLocaleDateString()).getTime())).valueOf() // 当天0点
      let endTime = startTime + 24 * 60 * 60 * 1000 -1// 当天23:59
      let zuoTime = startTime - 24 * 60 * 60 * 1000// 昨日 24:00
      if (this.selected == '1') {
        this.listQuery2.time = []
        this.listQuery2.time.push(startTime / 1000)
        this.listQuery2.time.push(endTime / 1000)
      }
      if (this.selected == '2') {
        this.listQuery2.time = []
        this.listQuery2.time.push(zuoTime / 1000)
        this.listQuery2.time.push(startTime / 1000)
      }
      this.salenums = this.salemoney = this.saleprofit = this.salelilv = this.salecb = this.returnums = this.returnmoney = this.lossums = this.lossmoney = this.patchnums = this.patchmoney = this.storageums = this.storagemoney = this.stockums = 0
      getruninfo(this.listQuery2).then(res => {
        let { data } = res
        if (data.soldgoods) {
          this.salenums = data.soldgoods.zongnums
          this.salemoney = data.soldgoods.zonoutprice
          this.saleprofit = data.soldgoods.zonlirun
          this.salecb = data.soldgoods.zoninprice
          this.salelilv = data.soldgoods.zonlilv
        }
        if (data.returngoods) {
          this.returnums = data.returngoods.zongnums
          this.returnmoney = data.returngoods.zonoutprice
        }
        if (data.lossgoods) {
          this.lossums = data.lossgoods.zongnums
          this.lossmoney = data.lossgoods.zoninprice
        }
        if (data.patchgoods) {
          this.patchnums = data.patchgoods.zongnums
          this.patchmoney = data.patchgoods.zoninprice
        }
        if (data.storagegoods) {
          this.storageums = data.storagegoods.zongnums
          this.storagemoney = data.storagegoods.zoninprice
        }
        if (data.stockgoods) {
          this.stockums = data.stockgoods.zongnums
        }
      }).catch(error => {
        console.log(error)
      })
    },
  },
}
</script>

<style scoped>
.reportImgWrap {
  width: 100%;
  position: relative;
  height: 500px;
}
.reportImg {
  width: 100%;
  height: 100%;
}
.reportImgInfo {
  width: 100%;
  position: absolute;
  height: 400px;
  bottom: -120px;
}
.reportImgInfoWrap1 {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.reportImgInfoWrap {
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .42), 0 0 6px rgba(0, 0, 0, .14)
}
.reportImgInfoWrap>div {
  width: 80%;
  color: #409EFF;
}
.yingkui {
  font-size: 19px; /*no*/
  font-weight: bold;
  color: #F56C6C;
}
.fenInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fenInfo>div,.info {
  display: flex;
  flex-direction: column;
}
.infoN {
  font-size: 16px;/*no*/
  font-weight: bold;
}
.selectB {
  width: 100%;
  display: flex;
  justify-content: center;
}
.infoWrap {
  margin-top: 180px;
  width: 100%;
}
.infoListWrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.infoList {
  width: 90%;
  padding: 40px 0;
  border-bottom: 1px solid rgb(230,230,230);
  display: flex;
  align-items: center;
}
.infoListB {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #409EFF;
  font-size: 22px; /*no*/
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.infoListC {
  display: flex;
  width: 500px;
  height: 100px;
  justify-content: space-between;
  margin-left: 30px;
}
.infoListC>div {
  display: flex;
  flex-direction: column;
  height: 100px;
  justify-content: center;
}
.reportF {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
.size18 {
  font-size: 18px;/*no*/
}
</style>
