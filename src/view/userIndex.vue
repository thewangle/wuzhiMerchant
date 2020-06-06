<template>
  <div class="loginWrap">
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter" style="color:white;">导航</div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="hellpWrap" @click="popupVisible = true">
      <div class="hellpWrap1">
        <img src="../assets/img/hellp.png" alt="" class="hellpImg">
        <span class="hellpB" style="color:white;">使用帮助</span>
      </div>
    </div>
    <div class="content">
      <div class="logoWrap" style="z-index:1">
        <div class="logoWrap1">
          <img src="../assets/img/logo.jpg" alt="" class="animated bounceInDown">
          <div class="loginwr"><span class="loginw animated bounceIn">五指大数据</span></div>
        </div>
      </div>
      <div class="activeBtWrap">
        <div class="animated bounceInLeft activeRc" @click="activeRc">账号管理</div>
        <div class="animated bounceInLeft activeBb" @click="activeBb">经营报表</div>
        <div class="animated bounceInLeft activeZui" @click="activeZui">今日之最</div>
        <div class="animated bounceInRight activeGa" @click="activeGa" v-if="isroleone">活动管理</div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="right">
      <div class="hellpContent">
        <div class="hellepB" @click="popupVisible = false"><span class="hellepBB">导航页 - 使用帮助</span><span class="hellepBBB">X</span></div>
        <div class="hellepDiv smB">概述：此页为进入各功能页的导航页</div>
        <div class="smContent">
          <span class="smContentB">导航按钮：</span>
          <div class="smContentC">
            <div>1.包括"账号管理"、"经营报表"、"今日之星"、"活动管理"</div>
            <div>2."账号管理"将进入账号的添加和编辑页</div>
            <div>3."经营报表"将进入当前账号的经营报表页</div>
            <div>4."今日之星"将进入当前账号的今日之星页</div>
            <div>5."活动管理"将进入当前账号的活动列表和添加页</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB smContentBb">备注：</span>
          <div class="smContentC smContentCc">
            <div>活动管理只有"商场级别"账号有此功能</div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import moment from 'moment' //日期转换插件
import { getRoleId } from '@/utils/cookie'
import $ from 'jquery'

export default {
  name: 'login',
  components: {
    
  },
  mounted(){
    if (getRoleId() == 1) {
      this.isroleone = true
    }
  },
  data () {
    return {
      popupVisible: false,
      isroleone: false,
    }
  },
  methods: {
    activeRc() {
      $('.activeRc').removeClass('bounceInLeft').addClass('bounceOut')
      setTimeout(() => {
        this.$router.push({ path: '/userlist' })
      },1000)
    },
    activeBb() {
      $('.activeBb').removeClass('bounceInLeft').addClass('bounceOut')
      setTimeout(() => {
        this.$router.push({ path: '/report' })
      },1000)
    },
    activeZui() {
      $('.activeZui').removeClass('bounceInLeft').addClass('bounceOut')
      setTimeout(() => {
        this.$router.push({ path: '/most' })
      },1000)
    },
    activeGa() {
      $('.activeGa').removeClass('bounceInRight').addClass('bounceOut')
      setTimeout(() => {
        this.$router.push({ path: '/activelist' })
      },1000)
    },
  },
}
</script>

<style scoped>
.loginWrap {
  width: 100%;
  height: 100%;
  background-image: linear-gradient( 153deg, rgb(100,100,100) 0%, rgb(0,0,0) 100%);
  overflow: auto;
}
.mc {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  background: rgba(255,255,255,0.2);
}
.content {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
}
.logoWrap {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logoWrap1 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.logoWrap img {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  margin-bottom: 20px;
  box-shadow: 0 0.026667rem 0.333333rem rgba(255, 0, 130, 0.5);
}
.loginw {
  color: white;
  font-weight: bold;
}
.activeBtWrap {
  width: 100%;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
}
.activeBtWrap>div {
  width: 40%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px; /*no*/
  color: white;
  background-image: linear-gradient( 153deg, rgb(255,215,0) 0%, rgb(10,200,30) 100%);
  border-radius: 7px;
}
</style>
