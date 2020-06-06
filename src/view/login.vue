<template>
  <div id="jsi-water-line-container" class="loginWrap container">
    <!-- <div class="mc"></div> -->
    <div class="content">
      <div class="logoWrap" style="z-index:1">
        <div class="logoWrap1">
          <img src="../assets/img/logo.jpg" alt="" class="animated bounceInDown">
          <div class="loginwr"><span class="loginw animated bounceIn">五指大数据</span></div>
        </div>
      </div>
      <div class="formWrap">
        <div class="formName animated bounceInLeft">
          <span class="formB">账号</span>
          <el-input v-model="loginForm.username" placeholder="请输入账号" name="username" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">密码</span>
          <el-input v-model="loginForm.password" placeholder="请输入密码" name="password" type="text" show-password auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <el-checkbox v-model="user_record" class="animated bounceInUp">记住密码</el-checkbox>
        </div>
        <div class="formName animated bounceInUp" style="margin-top: 20px;">
          <button :disabled="is_login" class="bubbly-button" @click="login">{{ logins }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { loginByUsername, getuserinfoByusername} from '@/api/login' //请求函数
import moment from 'moment' //日期转换插件
import { setUserInfo, getRoleId, setPassword, getPassword, setUserName, getUserName, removeUserName, removePassword } from '@/utils/cookie'

var RENDERER = {
  MAX_LINE_COUNT : 3000,
  DELTA_LINE_COUNT : 5,
  DELTA_THETA : Math.PI / 1000,
  
  init : function(){
    this.setParameters();
    this.reconstructMethods();
    this.createLines();
    this.render();
  },
  setParameters : function(){
    var $container = $('#jsi-water-line-container');
    this.width = $container.width();
    this.height = $container.height();
    this.context = $('<canvas />').attr({width : this.width, height : this.height}).appendTo($container).get(0).getContext('2d');
    this.lines = [];
    this.theta = 0;
    this.thresholdX1 = this.width * 3 / 5;
    this.thresholdX2 = this.width / 8;
    this.thresholdY1 = this.height / 6;
    this.thresholdY2 = -this.height / 8;
    this.aspectRatio = (this.thresholdY1 - this.thresholdY2) / (this.thresholdX1 - this.thresholdX2);
  },
  reconstructMethods : function(){
    this.render = this.render.bind(this);
  },
  createLines : function(){
    if(this.lines.length >= this.MAX_LINE_COUNT){
      return;
    }
    for(var i = 0, length = this.DELTA_LINE_COUNT; i < length; i++){
      this.lines.push(new LINE(this));
    }
  },
  getPosition : function(x){
    return {
      relation : (x >= -this.thresholdX2 && x <= this.thresholdX2) ? 0 : 1,
      floor : this.thresholdY1 + (this.thresholdY2 - this.thresholdY1) * (this.thresholdX1 - Math.abs(x)) / (this.thresholdX1 - this.thresholdX2)
    };
  },
  render : function(){
    requestAnimationFrame(this.render);
    this.context.clearRect(0, 0, this.width, this.height);
    var hue = 200 + 30 * Math.sin(this.theta);
    
    for(var i = 0, length = this.lines.length; i < length; i++){
      this.lines[i].render(hue);
    }
    this.createLines();
    this.theta += this.DELTA_THETA;
    this.theta %= Math.PI * 2;
  }
};
var LINE = function(renderer){
  this.renderer = renderer;
  this.init();
};
LINE.prototype = {
  FOCUS_POSITION : 600,
  NEAR_LIMIT : -400,
  FAR_LIMIT : 600,
  LENGTH : 10,
  RADIUS : 5,
  INIT_COUNT : 120,
  GRAVITY : -0.05,
  RESISTANCE : 0.05,
  MAX_EXTEND_COUNT : 30,
  MAX_RIPPLE_COUNT : 50,
  VZ : -3,
  
  init : function(){
    this.x = this.getRandomValue(-this.renderer.width * 3 / 5, this.renderer.width * 3 / 5);
    this.y = this.renderer.height * 3 / 4;
    this.z = this.getRandomValue(this.NEAR_LIMIT, this.FAR_LIMIT);
    this.vy = 0;
    var position = this.renderer.getPosition(this.x);
    this.floor = position.floor;
    this.relation = position.relation;
    this.status = 0;
    this.extendCount = 0;
    this.rippleCount = 0;
  },
  getRandomValue : function(min, max){
    return min + (max - min) * Math.random();
  },
  controlStatus : function(context, hue){
    var rate = this.FOCUS_POSITION / (this.z + this.FOCUS_POSITION),
      axis = {
        x1 : this.renderer.width / 2 + this.x * rate,
        y1 : this.renderer.height / 2 - this.y * rate,
        rate : rate,
        ratio : (this.FAR_LIMIT - this.z) / (this.FAR_LIMIT + this.FOCUS_POSITION),
        ripple : false
      };
    switch(this.relation){
    case 0:
      switch(this.status){
      case 0:
        this.y += this.vy;
        this.vy += this.GRAVITY;
        axis.x2 = axis.x1;
        axis.y2 = this.renderer.height / 2 - Math.max(this.renderer.thresholdY2, this.y - this.LENGTH) * rate;
        
        if(this.y < this.renderer.thresholdY2){
          this.y = this.renderer.thresholdY2;
          this.rippleCount = 0;
          this.status = 1;
        }
        break;
      case 1:
        if(this.rippleCount++ == this.MAX_RIPPLE_COUNT || this.z < -this.FOCUS_POSITION){
          this.init();
        }else{
          this.z += this.VZ;
          axis.ripple = true;
        }
      }
      break;
    case 1:
      switch(this.status){
      case 0:
        this.y += this.vy;
        this.vy += this.GRAVITY;
        axis.x2 = axis.x1;
        axis.y2 = this.renderer.height / 2 - Math.max(this.floor, this.y - this.LENGTH) * rate;
        
        if(this.y < this.floor){
          this.y = this.floor;
          this.vy = 0;
          this.extendCount = this.MAX_EXTEND_COUNT;
          this.status = 1;
        }
        break;
      case 1:
        if(this.extendCount-- == 0){
          this.status = 2;
          this.vy = 0;
        }
      case 2:
        this.x += this.vy / this.renderer.aspectRatio * ((this.x < 0) ? -1 : 1);
        this.y += this.vy;
        this.vy += this.GRAVITY * this.RESISTANCE;
        
        var extendRate = (this.MAX_EXTEND_COUNT - this.extendCount) / this.MAX_EXTEND_COUNT,
          offsetY = -this.LENGTH / 2 * extendRate,
          offsetX = -offsetY / this.renderer.aspectRatio * ((this.x < 0) ? 1 : -1);
          
        if(this.x + offsetX < 0 && this.x + offsetX > -this.renderer.thresholdX2 || this.x + offsetX > 0 && this.x + offsetX < this.renderer.thresholdX2){
          axis.shadow = this.renderer.width / 2 + (this.x + offsetX) * rate;
          offsetY *= (this.renderer.thresholdX2 * ((this.x + offsetX < 0) ? -1 : 1) - this.x) / offsetX;
          offsetX = this.renderer.thresholdX2 * ((this.x + offsetX < 0) ? -1 : 1) - this.x;
        }
        axis.x2 = this.renderer.width / 2 + (this.x + offsetX) * rate;
        axis.y2 = this.renderer.height / 2 - (this.y + offsetY) * rate;
        
        if(axis.shadow){
          axis.shadow = (axis.x1 - axis.x2) / (axis.x1 - axis.shadow);
        }
        if(this.x >= -this.renderer.thresholdX2 && this.x <= this.renderer.thresholdX2){
          this.init();
        }
      }
    }
    return axis;
  },
  render : function(hue){
    var context = this.renderer.context,
      axis = this.controlStatus(context, hue),
      ratio = 20 + 60 * axis.ratio;
    context.lineWidth = 0.5 + 1 * axis.ratio;
    context.strokeStyle = 'hsl(' + hue + ', ' + ratio + '%, ' + ratio + '%)';
    context.beginPath();
    context.moveTo(axis.x1, axis.y1);
    context.lineTo(axis.x2, axis.y2);
    context.stroke();
    
    if(axis.ripple){
      var rate = this.rippleCount / this.MAX_RIPPLE_COUNT;
      context.save();
      context.translate(axis.x1, axis.y1);
      context.scale(rate, rate * 0.5);
      context.lineWidth = 1 + 3 * axis.ratio;
      context.strokeStyle = 'hsla(' + hue + ', ' + ratio + '%, ' + ratio + '%, ' + (1 - rate * rate) + ')';
      context.beginPath();
      context.arc(0, 0, this.RADIUS * axis.rate, 0, Math.PI * 2, false);
      context.stroke();
      context.restore();
    }else if(axis.shadow){
      context.strokeStyle = 'hsla(' + hue + ', ' + (ratio + 20) + '%, ' + ratio + '%, ' + axis.shadow + ')';
      context.beginPath();
      context.moveTo(axis.x2, axis.y2);
      context.lineTo(axis.x2, axis.y2 + this.LENGTH * axis.rate * (1 - axis.shadow));
      context.stroke();
    }
  }
};
$(function(){
  RENDERER.init();
});

export default {
  name: 'login',
  components: {
    
  },
  mounted(){
    this.getCookie()
  },
  data () {
    return {
      user_record: true,
      is_login: false,
      logins: '登 录',
      loginForm: {
        username: '',
        password: ''
      },
    }
  },
  methods: {
    //设置cookie
    setCookie(c_name, c_pwd, exdays) {
        var exdate = new Date();
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
        document.cookie = "userName=" + c_name + ";path=/;expires=" + exdate.toLocaleString()
        document.cookie = "userPwd=" + c_pwd + ";path=/;expires=" + exdate.toLocaleString()
    },
    //获取cookie
    getCookie: function() {
        if (document.cookie.length > 0) {
            var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
            // console.log(arr)
            for (var i = 0; i < arr.length; i++) {
                var arr2 = arr[i].split('='); //再次切割
                //判断查找相对应的值
                if (arr2[0] == 'userName') {
                    this.loginForm.username = arr2[1]; //保存到保存数据的地方
                } else if (arr2[0] == 'userPwd') {
                    this.loginForm.password = arr2[1];
                }
            }
        }
    },
    //删除cookie
    clearCookie: function() {
        this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    },
    //登录
    login(e) {
      if (this.user_record) {
        this.setCookie(this.loginForm.username, this.loginForm.password, 7);
      }else{
        this.clearCookie();
      }
      e.preventDefault
      e.target.classList.remove('animate')
      e.target.classList.add('animate')
      setTimeout(function(){
        e.target.classList.remove('animate')
      },700);
      if (this.loginForm.username == '' || this.loginForm.password == '') {
        this.$message({
          message: '账号密码不能为空！',
          center: true,
          type: 'error'
        });
        return
      }
      this.is_login = true
      this.logins='登录中...'
      let user = {
        username: this.loginForm.username
      }
      getuserinfoByusername(user).then(res => {
        let { data } = res
        if (data.code == 200) {
          let nowtime = moment(new Date()).valueOf()
          let usertime = moment(data.data.addtime).valueOf()
          if (data.data.role != 0 && usertime < nowtime) {
            this.$message({
              type: 'warning',
              center: true,
              message: '您的账号已经到期，请续费或联系管理员！'
            });
            this.is_login = false
            this.logins='登 录'
          } else {
            const { username, password } = this.loginForm
            let data = {
              username: username,
              password: password
            }
            loginByUsername(data).then(res => {
              let { data } = res
              if (data.code == 200) {
                setUserInfo(data.data)
                this.is_login = false
                this.logins='登 录'
                if (data.data.role == 3) {
                  this.$router.push({ path: '/index' })
                } else {
                  this.$router.push({ path: '/userindex' })
                }
              }
              if (data.code == 201) {
                this.$message({
                  message: data.message,
                  center: true,
                  type: 'error'
                });
                let self = this
                setTimeout(function() {
                  self.is_login = false
                  self.logins='登 录'
                },3000)
              }
            }).catch(error => {
              this.$message({
                message: error.message,
                center: true,
                type: 'error'
              });
            })
          }
        }
        if (data.code == 201) {
          this.is_login = false
          this.logins='登 录'
          this.$message({
            message: '请输入正确的账号密码！',
            center: true,
            type: 'error'
          });
        }
      }).catch(error => {
        this.is_login = false
        this.logins='登 录'
        this.$message({
          message: '请输入正确的账号密码！',
          center: true,
          type: 'error'
        });
      })
    },
  },
}
</script>

<style scoped>
.loginWrap {
  width: 100%;
  height: 100%;
  background-color: #000000;
  /*background-image: linear-gradient( 153deg, rgb(100,100,100) 0%, rgb(0,0,0) 100%);*/
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
  /*position: relative;*/
  position: absolute;
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
.formWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.formName {
  width: 70%;
}
.formB {
  width: 100%;
  font-weight: bold;
  color: white;
  font-size: 14px; /*no*/
  margin-bottom: 20px;
}
.el-input {
  margin-top: 20px;
}
</style>
