<template>
  <div class="loginWrap">
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter"></div>
      <div class="vanNavBarRight"></div>
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
        <div class="animated bounceInRight activeGa" @click="activeGa" v-if="isroleone">活动管理</div>
      </div>
    </div>
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
  height: 48%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.activeBtWrap>div {
  width: 200px;
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
