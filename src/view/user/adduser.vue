<template>
  <div class="loginWrap">
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter" style="color:black;"></div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="hellpWrap" @click="popupVisible = true">
      <div class="hellpWrap1">
        <img src="../../assets/img/hellp.png" alt="" class="hellpImg">
        <span class="hellpB">使用帮助</span>
      </div>
    </div>
    <div class="content" style="z-index:0;">
      <div class="logoWrap" style="z-index:1">
        <div class="logoWrap1">
          <img src="../../assets/img/logo.jpg" alt="" class="animated bounceInDown">
          <div class="loginwr"><span class="loginw animated bounceIn" style="font-size:17px;">五 指 大 数 据</span></div>
          <div class="loginwr" style="margin-top:10px;"><span class="loginw animated bounceIn">添加账号</span></div>
        </div>
      </div>
      <div class="formWrap">
        <div class="formName animated bounceInLeft">
          <span class="formB">用户名</span>
          <el-input v-model="loginForm.username" placeholder="请输入用户名" name="username" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">密码</span>
          <el-input v-model="loginForm.password" placeholder="请输入密码" name="password" type="text" show-password auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">账号名称</span>
          <el-input v-model="loginForm.department" placeholder="请输入账号名称" name="contact" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">管理员</span>
          <el-input v-model="loginForm.adminname" placeholder="请输入管理员名称" name="phone" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">电话</span>
          <el-input v-model="loginForm.phone" placeholder="请输入联系电话" name="phone" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInUp" style="margin-top: 20px;">
          <button :disabled="is_login" class="bubbly-button" @click="addgoods">{{ logins }}</button>
        </div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="right">
      <div class="hellpContent">
        <div class="hellepB" @click="popupVisible = false"><span class="hellepBB">添加账号 - 使用帮助</span><span class="hellepBBB">X</span></div>
        <div class="hellepDiv smB">概述：此页为添加账号功能页</div>
        <div class="smContent">
          <span class="smContentB">字段说明：</span>
          <div class="smContentC">
            <div>1."用户名"：该账号的用户名，用于登录(必填)</div>
            <div>2."名称"：该账号的电话，用于经营分析、列表等的展示(必填)</div>
            <div>3."密码"：该账号的密码，用于登录(必填)</div>
            <div>4."管理员"：该账号的管理员(必填)</div>
            <div>5."电话"：该账号的联系电话(必填)</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB smContentBb">备注：</span>
          <div class="smContentC smContentCc">
            <div>"商场级别"的账号可以创建"部门级别"的账号，"部门级别"的账号可以创建"柜组级别"的账号</div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { addUser, getallUser } from '@/api/user' //获取分类
import { getUserName } from '@/utils/cookie'
import moment from 'moment' //日期转换插件

export default {
  name: 'addsupplier',
  components: {
    
  },
  mounted() {
    // 获取所有用户信息数据函数
    this._fetchUserList()
  },
  data () {
    return {
      popupVisible: false,
      is_login: false,
      logins: '提 交',
      allusers: [],
      loginForm: {
        username: '',
        password: '',
        department: '',
        adminname: '',
        phone: '',
        partantuser: getUserName(),
        addtime: moment(new Date()).add('days',365).format('YYYY-MM-DD HH:mm:ss')
      },
    }
  },
  methods: {
    // 获取所有用户信息数据函数
    async _fetchUserList() {
      getallUser().then(res => {
        let { data } = res
        if (data.code == 200) {
          this.allusers = data.data
          // console.log(this.allusers)
        }
        if (data.code == 201) {
          console.log('获取失败')
        }
      }).catch(error => {
        console.log('获取失败')
      })
    },
    //添加商品
    addgoods(e) {
      e.preventDefault
      e.target.classList.remove('animate')
      e.target.classList.add('animate')
      setTimeout(function(){
        e.target.classList.remove('animate')
      },700);
      //验证表单是否填写完整
      if (this.loginForm.username == '' || this.loginForm.password == '' || this.loginForm.department == '' || this.loginForm.phone == '' || this.loginForm.adminname == '') {
        this.$message({
          message: '请您填写完整信息',
          type: 'warning',
          center: true
        });
        return
      }
      if(!(/^1[3456789]\d{9}$/.test(this.loginForm.phone))){ 
          this.$message({
            message: '请您输入正确的手机号格式！',
            type: 'warning',
            center: true
          });
          return false; 
      } 
      //验证用户是否已经存在
      let is_by = true
      this.allusers.forEach((item,index) => {
        if (item.username == this.username) {
          this.$message({
            message: '对不起！该用户已存在！',
            type: 'warning',
            center: true
          });
          is_by = false
        }
      })
      if (is_by) {
        let self = this
        addUser(self.loginForm).then(res => {
          let { data } = res
            if (data.code == 200) {
              self.$message({
                message: '恭喜您！注册成功！',
                type: 'success',
                center: true
              });
              self.$router.push({ path: '/userlist' })
            } else if(data.code == 202){
              self.$message({
                message: '该用户名已经存在！',
                type: 'warning',
                center: true
              });
            } else {
              self.$message({
                message: '对不起！注册失败！',
                type: 'warning',
                center: true
              });
            }
        }).catch(error => {
          self.$message({
            message: '对不起！注册失败！',
            type: 'warning',
            center: true
          });
        })
      }
    },
  },
}
</script>

<style scoped>
.loginWrap {
  width: 100%;
  height: 100%; 
  background-image: linear-gradient( 153deg, rgb(10,100,10) 0%, rgb(100,2,30) 100%);
  color: white;
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
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.formName {
  width: 70%;
  display: flex;
  flex-direction: column;
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
