<template>
  <div class="loginWrap">
    <!-- <div class="goBack" @click="$router.go(-1)">< 返回</div> -->
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter" style="color:black;"></div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="content" style="z-index:0;">
      <div class="logoWrap" style="z-index:1">
        <div class="logoWrap1">
          <img src="../../assets/img/logo.jpg" alt="" class="animated bounceInDown">
          <div class="loginwr"><span class="loginw animated bounceIn" style="font-size:17px;">五 指 大 数 据</span></div>
          <div class="loginwr" style="margin-top:10px;"><span class="loginw animated bounceIn">添加商品</span></div>
        </div>
      </div>
      <div class="formWrap">
        <div class="formName animated bounceInLeft">
          <span class="formB">商品名称</span>
          <el-input v-model="loginForm.name" placeholder="请输入商品名称" name="name" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">商品编码</span>
          <el-input v-model="loginForm.code" placeholder="请输入商品编码" name="code" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">商品规格</span>
          <el-input v-model="loginForm.format" placeholder="请输入商品规格" name="format" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">商品数量</span>
          <el-input v-model="loginForm.nums" placeholder="请输入商品数量" name="nums" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">库存上线</span>
          <el-input v-model="loginForm.maxnums" placeholder="请输入库存上线" name="maxnums" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">库存下线</span>
          <el-input v-model="loginForm.minnums" placeholder="请输入库存下线" name="minnums" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">商品进价</span>
          <el-input v-model="loginForm.inprice" placeholder="请输入商品进价" name="inprice" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">商品售价</span>
          <el-input v-model="loginForm.outprice" placeholder="请输入商品售价" name="outprice" type="text" auto-complete="on"/>
        </div>
        <!-- <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">商品分类</span>
          <el-select filterable v-model="loginForm.sort" placeholder="请选择商品分类" @change="selectted">
            <el-option
              v-for="item in sorts"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div> -->
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">商品分类</span>
          <div class="seleDiv" @click="showSortSelect">{{ sortname }}</div>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">供应商</span>
          <div class="seleDiv" @click="showsupplierSelect">{{ suppliername }}</div>
        </div>
        <!-- <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">供应商</span>
          <el-select filterable v-model="loginForm.supplier" placeholder="请选择供应商">
            <el-option
              v-for="item in suppliers"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div> -->
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">备注</span>
          <el-input v-model="loginForm.remark" ref="remarks" :rows="2" placeholder="请输入备注" name="remark" type="textarea"/>
        </div>
        <div class="formName animated bounceInUp" style="margin-top: 20px;">
          <button :disabled="is_login" class="bubbly-button" @click="addgoods">{{ logins }}</button>
        </div>
      </div>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <div class="selectBWrap"><span class="selectBSpan" @click="selectqr">确定</span></div>
      <mt-picker :slots="sorts" @change="onValuesChange" value-key="name"></mt-picker>
    </mt-popup>
    <mt-popup v-model="popupsupplier" position="bottom">
      <div class="selectBWrap"><span class="selectBSpan" @click="selectqr1">确定</span></div>
      <mt-picker :slots="suppliers" @change="onValuesChange1" value-key="name"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { loginByUsername, getuserinfoByusername} from '@/api/login' //请求函数
import { getSortinfoall, getSupplierall, addGoods } from '@/api/goods' //获取分类
import moment from 'moment' //日期转换插件
import { getpartantId, getRoleId, getUserid } from '@/utils/cookie'

export default {
  name: 'addgoods',
  components: {
    
  },
  mounted() {
    this.getsortinfoall() //获取该id下分类
    this.getsupplierall() //获取改id下供应商
  },
  data () {
    return {
      suppliername: '请选择供应商',
      sortname: '请选择商品分类',
      popupVisible: false,
      popupsupplier: false,
      is_login: false,
      logins: '提 交',
      loginForm: {
        name: '',
        code: '',
        format: '',
        nums: '',
        maxnums: '',
        minnums: '',
        inprice: '',
        outprice: '',
        remark: '',
        sort: '',
        supplier: '',
        uid: getUserid(),
        pid: getpartantId(),
        role: getRoleId(),
      },
      sorts: [
        {
          flex: 1,
          values: [{value: 0,name: '请选择商品分类'}],
          className: 'slot1',
          textAlign: 'center',
          defaultIndex:0
        }
      ],
      suppliers: [
        {
          flex: 1,
          values: [{value: 0,name: '请选择供应商'}],
          className: 'slot1',
          textAlign: 'center',
          defaultIndex:0
        }
      ],
    }
  },
  methods: {
    selectqr() {
      this.popupVisible = !this.popupVisible
    },
    selectqr1() {
      this.popupsupplier = !this.popupsupplier
    },
    showSortSelect() {
      this.popupVisible = !this.popupVisible
    },
    showsupplierSelect() {
      this.popupsupplier = !this.popupsupplier
    },
    onValuesChange(picker, values) {
      this.loginForm.sort = values[0].value
      this.sortname = values[0].name
    },
    onValuesChange1(picker, values) {
      this.loginForm.supplier = values[0].value
      this.suppliername = values[0].name
    },
    //根据用户id获取分类
    getsortinfoall() {
      let params = {
        role: getRoleId(),
        uid: getUserid(),
        pid: getpartantId()
      }
      getSortinfoall(params).then(res => {
        let { data } = res
        data.forEach((item) => {
          this.sorts[0].values.push({value: item.id,name: item.name})
        })
      }).catch(error => {
        console.log(error)
      })
    },
    //根据用户id获取供应商
    getsupplierall() {
      let params = {
        role: getRoleId(),
        uid: getUserid(),
        pid: getpartantId()
      }
      getSupplierall(params).then(res => {
        let { data } = res
        data.forEach((item) => {
          this.suppliers[0].values.push({value: item.id,name: item.name})
        })
      }).catch(error => {
        console.log(error)
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
      if (this.loginForm.name == '' || this.loginForm.inprice == '' || this.loginForm.outprice == '' || this.loginForm.nums == '' || this.loginForm.format == '' || this.loginForm.sort == '' || this.loginForm.supplier == '') {
        this.$message({
          message: '请您填写完整信息',
          type: 'warning',
          center: true
        });
        return
      }
      let is_num = /^\+?[1-9][0-9]*$/
      if (!is_num.test(this.loginForm.nums) || !is_num.test(this.loginForm.maxnums) || !is_num.test(this.loginForm.minnums)) {
        this.$message({
          message: '请您输入正确的数量',
          type: 'warning',
          center: true
        });
        return
      }
      if (Number(this.loginForm.maxnums) < Number(this.loginForm.minnums)) {
        this.$message({
          message: '库存上线不得小于库存下线',
          type: 'warning',
          center: true
        });
        return
      }
      if (Number(this.loginForm.outprice) < Number(this.loginForm.inprice)) {
        this.$message({
          message: '售价不得小于进价',
          type: 'warning',
          center: true
        });
        return
      }
      let self = this
      addGoods(self.loginForm).then(res => {
        let { data } = res
        if (data.code == 200) {
          self.$message({
            message: '恭喜您！添加商品成功！',
            type: 'success',
            center: true
          });
          self.$router.push({ path: '/goodslist' })
        } else {
          self.$message({
            message: '对不起！添加商品失败！',
            type: 'success',
            center: true
          });
        }
      }).catch(error => {
        self.$message({
          message: '对不起！添加商品失败！',
          type: 'success',
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
  -webkit-overflow-scrolling: touch;
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
