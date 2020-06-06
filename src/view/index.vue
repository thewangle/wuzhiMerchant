<template>
  <div class="loginWrap">
    <div class="vanNavBar" style="background:white;">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter">导航</div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="hellpWrap" @click="popupVisible = true">
      <div class="hellpWrap1">
        <img src="../assets/img/hellp.png" alt="" class="hellpImg">
        <span class="hellpB">使用帮助</span>
      </div>
    </div>
    <div class="navB">
      <div class="navTab"></div>
      <span class="navName">经营</span>
    </div>
    <ul class="navListUl">
      <li class="navListLi" @click="routes(10)">
        <div class="navListL">
          <img src="../assets/img/hy.png" alt="" class="navListimg">
          <span>经营报表</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
      <li class="navListLi" @click="routes(11)">
        <div class="navListL">
          <img src="../assets/img/mmjf.png" alt="" class="navListimg">
          <span>今日之最</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
    </ul>
    <div class="navB">
      <div class="navTab"></div>
      <span class="navName">商品</span>
    </div>
    <ul class="navListUl">
      <li class="navListLi" @click="routes(6)">
        <div class="navListL">
          <img src="../assets/img/tu5.png" alt="" class="navListimg">
          <span>分类列表</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
      <li class="navListLi" @click="routes(1)">
        <div class="navListL">
          <img src="../assets/img/tu3.png" alt="" class="navListimg">
          <span>商品列表</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
      <li class="navListLi" @click="routes(0)">
        <div class="navListL">
          <img src="../assets/img/mmjf.png" alt="" class="navListimg">
          <span>添加商品</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
      <li class="navListLi" @click="routes(7)">
        <div class="navListL">
          <img src="../assets/img/tu3.png" alt="" class="navListimg">
          <span>商品出库</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
      <li class="navListLi" @click="routes(8)">
        <div class="navListL">
          <img src="../assets/img/tu4.png" alt="" class="navListimg">
          <span>商品入库</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
      <li class="navListLi" @click="routes(9)">
        <div class="navListL">
          <img src="../assets/img/tu2.png" alt="" class="navListimg">
          <span>价格调整</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
    </ul>
    <div class="navB">
      <div class="navTab"></div>
      <span class="navName">供应商</span>
    </div>
    <ul class="navListUl">
      <li class="navListLi" @click="routes(3)">
        <div class="navListL">
          <img src="../assets/img/hy.png" alt="" class="navListimg">
          <span>供应商列表</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
      <li class="navListLi" @click="routes(2)">
        <div class="navListL">
          <img src="../assets/img/mmjf.png" alt="" class="navListimg">
          <span>添加供应商</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
    </ul>
    <div class="navB">
      <div class="navTab"></div>
      <span class="navName">会员</span>
    </div>
    <ul class="navListUl">
      <li class="navListLi" @click="routes(5)">
        <div class="navListL">
          <img src="../assets/img/hy.png" alt="" class="navListimg">
          <span>会员列表</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
      <li class="navListLi" @click="routes(4)">
        <div class="navListL">
          <img src="../assets/img/tu5.png" alt="" class="navListimg">
          <span>添加会员</span>
        </div>
        <img class="navListRimg" src="../assets/img/biao.png" alt="">
      </li>
    </ul>
    <mt-popup v-model="popupVisible" position="right">
      <div class="hellpContent">
        <div class="hellepB"><span class="hellepBB">导航页 - 使用帮助</span><span @click="popupVisible = false" class="hellepBBB">X</span></div>
        <div class="hellepDiv smB">概述：此页为进入各功能页的导航页</div>
        <div class="smContent">
          <span class="smContentB">经营：</span>
          <div class="smContentC">
            <div>1.此栏展现当前登录账号"今日"和"昨日"的经营状况</div>
            <div>2.点击"经营报表"进入经营报表页（展示当前账号"今日"和"昨日"的销售、退货、报损、补货、新入库、当前库存的相关信息）</div>
            <div>3.点击"今日之最"进入今日之最页（展示当前账号"今日"和"昨日"的销售、退货、报损、补货、新入库、当前库存的"今日之星"和"需要努力"的单品）</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB">商品：</span>
          <div class="smContentC">
            <div>1.此栏可进入商品相关的操作页</div>
            <div>2.点击"分类列表"进入分类列表页，可对分类进行"添加"、"编辑"、"删除"等操作</div>
            <div>3.点击"商品列表"进入商品列表页，可对商品进行"编辑"、"删除"操作（"编辑"不包括价格和出入库的操作）</div>
            <div>4.点击"添加商品"进入添加商品页，可进行新商品的入库添加（新商品区别于已有商品的"补货"）</div>
            <div>5.点击"商品出库"进入商品出库页，可对商品进行"售出"、"报损"的出库操作</div>
            <div>6.点击"商品入库"进入商品入库页，可对商品进行"补货"、"退货"的入库操作</div>
            <div>7.点击"价格调整"进入价格调整页，可对商品进行"更改进价"、"更改售价"的价格调整操作</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB">供应商：</span>
          <div class="smContentC">
            <div>1.此栏可进入供应商相关的操作页</div>
            <div>2.点击"供应商列表"进入供应商列表页，可对供应商进行"编辑"和"删除"</div>
            <div>3.点击"添加供应商"进入添加供应商页，可新添加供应商</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB">会员：</span>
          <div class="smContentC">
            <div>1.此栏可进入会员相关的操作页</div>
            <div>2.点击"会员列表"进入会员列表页，可对会员进行"编辑"和"删除"</div>
            <div>3.点击"添加会员"进入添加会员页，可新添加会员</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB">备注：</span>
          <div class="smContentC smContentCc">
            <div>1.只有"柜组级别"账号有此页功能</div>
            <div>2.商品出入库操作时，如果需要更改进/售价需要先进入价格调整页进行价格调整</div>
            <div>3.点击"返回"将进入"登录页"</div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { loginByUsername, getuserinfoByusername} from '@/api/login' //请求函数
import moment from 'moment' //日期转换插件
import { setUserInfo, getRoleId, setPassword, getPassword, setUserName, getUserName, removeUserName, removePassword } from '@/utils/cookie'

export default {
  name: 'ligin',
  components: {
    
  },
  data () {
    return {
      popupVisible: false,
      urls: [
        {path: '/addgoods'},
        {path: '/goodslist'},
        {path: '/addsupplier'},
        {path: '/supplierlist'},
        {path: '/addmember'},
        {path: '/memberlist'},
        {path: '/sort'},
        {path: '/goodsout'},
        {path: '/goodsin'},
        {path: '/goodsprice'},
        {path: '/report'},
        {path: '/most'},
      ]
    }
  },
  methods: {
    routes(num) {
      this.$router.push(this.urls[num])
    },
  },
}
</script>

<style scoped>
.loginWrap {
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  background: rgb(245,245,245);
  overflow: auto;
}
.navB {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  background: white;
  margin-top:20px;
  border-bottom: 1px solid rgb(230,230,230);
}
.navTab {
  width: 4px; /*no*/
  height: 100%;
  background: #409EFF;
  margin: 0 40px 0 0;
}
.navName {
  font-size: 15px; /*no*/
  font-weight: bold;
  color: #409EFF;
}
.navListUl {
  width: 100%;
  background: white;
  color: rgb(120,120,120);
  font-size: 14px; /*no*/
}
.navListLi {
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgb(240,240,240);
}
.navListL {
  display: flex;
  align-items: center;
}
.navListimg {
  width: 40px;
  height: 40px;
  margin: 0 40px 0 20px; 
}
.navListRimg {
  width: 14px;
  height: 30px;
  margin-right: 20px;  
}
</style>
