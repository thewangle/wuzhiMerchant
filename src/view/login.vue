<template>
  <div class="loginWrap">
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
import { loginByUsername, getuserinfoByusername} from '@/api/login' //请求函数
import moment from 'moment' //日期转换插件
import { setUserInfo, getRoleId, setPassword, getPassword, setUserName, getUserName, removeUserName, removePassword } from '@/utils/cookie'

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
