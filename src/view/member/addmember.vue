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
          <div class="loginwr" style="margin-top:10px;"><span class="loginw animated bounceIn">添加会员</span></div>
        </div>
      </div>
      <div class="formWrap">
        <div class="formName animated bounceInLeft">
          <span class="formB">会员姓名</span>
          <el-input v-model="loginForm.name" placeholder="name" name="name" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">电话</span>
          <el-input v-model="loginForm.phone" placeholder="phone" name="phone" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">会员生日</span>
          <!-- <el-input @focus="birthdaySele" v-model="loginForm.birthday" placeholder="birthday" name="birthday" type="text" auto-complete="on"/> -->
          <div class="birthdayItem" @click="birthdaySele">{{ loginForm.birthday }}</div>
        </div>
        <mt-datetime-picker
          v-model="birthday"
          type="date"
          @confirm="birthdaySelect"
          ref="birthdayPicker">
        </mt-datetime-picker>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">会员性别</span>
          <div>
            <el-radio v-model="loginForm.sex" label="1">男</el-radio>
            <el-radio v-model="loginForm.sex" label="2">女</el-radio>
          </div>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">会员描述</span>
          <el-input v-model="loginForm.description" :rows="2" placeholder="请输入会员描述" name="description" type="textarea" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInUp" style="margin-top: 20px;">
          <button :disabled="is_login" class="bubbly-button" @click="addgoods">{{ logins }}</button>
        </div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="right">
      <div class="hellpContent">
        <div class="hellepB" @click="popupVisible = false"><span class="hellepBB">添加会员 - 使用帮助</span><span class="hellepBBB">X</span></div>
        <div class="hellepDiv smB">概述：此页为添加会员功能页</div>
        <div class="smContent">
          <span class="smContentB">字段说明：</span>
          <div class="smContentC">
            <div>1."会员姓名"：该会员的名称(必填)</div>
            <div>2."电话"：该会员的电话(选填)</div>
            <div>3."会员生日"：该会员的生日(必填)</div>
            <div>4."会员性别"：该会员的性别(必填)</div>
            <div>10."会员描述"：该会员的描述信息(选填)</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB smContentBb">备注：</span>
          <div class="smContentC smContentCc">
            <div>点击"返回"将进入"导航页"</div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { addMember } from '@/api/member' //获取分类
import { getpartantId, getRoleId, getUserid } from '@/utils/cookie'
import moment from 'moment' //日期转换插件

export default {
  name: 'addmember',
  components: {
    
  },
  mounted() {
    
  },
  data () {
    return {
      popupVisible: false,
      birthday: '',
      is_login: false,
      logins: '提 交',
      loginForm: {
        name: '',
        birthday: '请选择会员生日',
        phone: '',
        sex: null,
        description: '',
        userid: getUserid(),
        userpartid: getpartantId(),
      },
    }
  },
  methods: {
    //会员生日选择
    birthdaySele() {
      if (this.loginForm.birthday != '请选择会员生日') {
        this.birthday = this.loginForm.birthday
      } else {
        this.birthday = new Date()
      }
      this.$refs.birthdayPicker.open()
    },
    //会员生日选择
    birthdaySelect(query) {
      this.loginForm.birthday = moment(query).format('YYYY-MM-DD')
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
      if (this.loginForm.name == '' || this.loginForm.birthday == '' || this.loginForm.description == '' || this.loginForm.phone == '') {
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
      let self = this
      let age = Math.round(parseInt((new Date()).getTime()/1000 - moment(self.loginForm.birthday).valueOf()/1000)/31536000)
      addMember(self.loginForm).then(res => {
        let { data } = res
        if (data.code == 200) {
          self.$message({
            message: '恭喜您！添加会员成功！',
            type: 'success',
            center: true
          });
          self.$router.push({ path: '/memberlist' })
        } else if(data.code == 201){
          self.$message({
            message: '对不起！添加会员失败！',
            type: 'warning',
            center: true
          });
        } else {
          self.$message({
            message: '对不起！添加会员失败！',
            type: 'warning',
            center: true
          });
        }
      }).catch(error => {
        self.$message({
          message: '对不起！添加会员失败！',
          type: 'warning',
          center: true
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
.birthdayItem {
  width: 100%;
  border-bottom: 1px solid #CCC;
  position: relative;
  z-index: 100;
  color: #606266;
  font-weight: bold;
  padding-bottom: 2px;
}
</style>
