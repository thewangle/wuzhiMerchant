<template>
  <div class="loginWrap">
    <div class="vanNavBar" style="background:white;">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter">导航</div>
      <div class="vanNavBarRight"></div>
    </div>
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
