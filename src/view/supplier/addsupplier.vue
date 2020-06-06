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
          <div class="loginwr" style="margin-top:10px;"><span class="loginw animated bounceIn">添加供应商</span></div>
        </div>
      </div>
      <div class="formWrap">
        <div class="formName animated bounceInLeft">
          <span class="formB">供应商名称</span>
          <el-input v-model="loginForm.name" placeholder="请输入供应商名称" name="name" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">联系人</span>
          <el-input v-model="loginForm.contact" placeholder="请输入联系人" name="contact" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">电话</span>
          <el-input v-model="loginForm.phone" placeholder="请输入电话" name="phone" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">供应商地址</span>
          <el-input v-model="loginForm.address" :rows="2" placeholder="请输入供应商地址" name="address" type="textarea" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">备注</span>
          <el-input v-model="loginForm.remark" :rows="2" placeholder="请输入备注" name="remark" type="textarea" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInUp" style="margin-top: 20px;">
          <button :disabled="is_login" class="bubbly-button" @click="addgoods">{{ logins }}</button>
        </div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="right">
      <div class="hellpContent">
        <div class="hellepB" @click="popupVisible = false"><span class="hellepBB">添加供应商 - 使用帮助</span><span class="hellepBBB">X</span></div>
        <div class="hellepDiv smB">概述：此页为添加供应商功能页</div>
        <div class="smContent">
          <span class="smContentB">字段说明：</span>
          <div class="smContentC">
            <div>1."供应商名称"：该供应商的名称(必填)</div>
            <div>2."供应商地址"：该供应商的联系地址(必填)</div>
            <div>3."联系人"：该供应商的联系人姓名(必填)</div>
            <div>4."电话"：该供应商的联系电话(必填)</div>
            <div>5."备注"：该供应商的备注信息(选填)</div>
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
import { addSupplier } from '@/api/supplier' //获取分类
import { getpartantId, getRoleId, getUserid } from '@/utils/cookie'

export default {
  name: 'addsupplier',
  components: {
    
  },
  mounted() {
    
  },
  data () {
    return {
      popupVisible: false,
      is_login: false,
      logins: '提 交',
      loginForm: {
        name: '',
        contact: '',
        phone: '',
        address: '',
        remark: '',
        uid: getUserid(),
        pid: getpartantId(),
        role: getRoleId(),
      },
    }
  },
  methods: {
    //添加商品
    addgoods(e) {
      e.preventDefault
      e.target.classList.remove('animate')
      e.target.classList.add('animate')
      setTimeout(function(){
        e.target.classList.remove('animate')
      },700);
      //验证表单是否填写完整
      if (this.loginForm.name == '' || this.loginForm.address == '' || this.loginForm.contact == '' || this.loginForm.phone == '') {
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
      addSupplier(self.loginForm).then(res => {
        let { data } = res
        if (data.code == 200) {
          self.$message({
            message: '恭喜您！创建成功！',
            type: 'success',
            center: true
          });
          self.$router.push({ path: '/supplierlist' })
        } else {
          self.$message({
            message: '对不起！创建失败！',
            type: 'error',
            center: true
          });
        }
      }).catch(error => {
        self.$message({
          message: '对不起！创建失败！',
          type: 'error',
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
</style>
