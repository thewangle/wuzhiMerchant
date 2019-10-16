<template>
  <div class="loginWrap">
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter"></div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="content" style="z-index:0;">
      <div class="logoWrap" style="z-index:1">
        <div class="logoWrap1">
          <img src="../../assets/img/logo.jpg" alt="" class="animated bounceInDown">
          <div class="loginwr"><span class="loginw animated bounceIn" style="font-size:17px;">五 指 大 数 据</span></div>
          <div class="loginwr" style="margin-top:10px;"><span class="loginw animated bounceIn">添加活动</span></div>
        </div>
      </div>
      <div class="formWrap">
        <div class="formName animated bounceInLeft">
          <span class="formB">活动名称</span>
          <el-input v-model="loginForm.Merchant" placeholder="请输入商户名称" name="Merchant" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top:20px;">
          <span class="formB">活动区域</span>
          <div @click="seleArea" class="activeQy">{{ area }}</div>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">示例起价/单位：元</span>
          <el-input v-model="loginForm.money" placeholder="请输入示例起价" name="money" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">示例标签</span>
          <el-input v-model="loginForm.tag" placeholder="请输入示例标签" name="tag" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">副标题-惠</span>
          <el-input v-model="loginForm.tab" placeholder="请输入副标题-惠" name="tab" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">副标题-折</span>
          <el-input v-model="loginForm.tab1" placeholder="请输入副标题-折" name="tab1" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInLeft" style="margin-top: 20px;">
          <span class="formB">副标题-促</span>
          <el-input v-model="loginForm.tab2" placeholder="请输入副标题-促" name="tab2" type="text" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">活动图片</span>
          <el-form :inline="true" :model="activityInfo">
            <el-upload
              :http-request="handleUpLoadIconImg"
              :on-preview="handleIconCardPreview"
              :on-remove="handleIconCardicon"
              :limit="1"
              :action="domain"
              :file-list="iconFilelist"
              list-type="picture-card"
            >
            <i class="el-icon-plus"></i>
            </el-upload>
          </el-form>
        </div>
        <div class="formName animated bounceInRight" style="margin-top: 20px;">
          <span class="formB">活动详情</span>
          <el-input v-model="loginForm.remark" :rows="2" placeholder="活动详情" name="remark" type="textarea" auto-complete="on"/>
        </div>
        <div class="formName animated bounceInUp" style="margin-top: 20px;">
          <button :disabled="is_login" class="bubbly-button" @click="addgoods">{{ logins }}</button>
        </div>
      </div>
    </div>
    <van-popup v-model="isAreaShow" position="bottom" :style="{ height: '40%' }">
      <van-area @confirm="seleAreaOver" @cancel="isAreaShow = false" value="371402" :area-list="areaList" />
    </van-popup>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body='false'>
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { addactives, getqiniutoken } from '@/api/actives' 
import { getpartantId, getRoleId, getUserid } from '@/utils/cookie'
import { getUserName } from '@/utils/cookie'
import moment from 'moment' //日期转换插件

export default {
  name: 'addactives',
  components: {
    
  },
  mounted() {
    
  },
  data () {
    return {
      domain: 'http://upload-z2.qiniup.com',//上传到七牛云的地址
      qiniuAddress: 'http://m.wuzhi1688.com', //七牛云仓库绑定的域名
      iconFilelist: [],//上传文件列表
      dialogVisible: false,//图片预览展示diolog是否显示
      dialogImageUrl: '',//图片预览展示图片地址
      activityInfo: { //form表单data
        imgUrl_1: require('../../assets/img/logo.jpg'),
        imgUrl_2: '',
      },
      areaList: {
        province_list: {
          370000: '山东省'
        },
        city_list: {
          371400: '德州市',
        },
        county_list: {
          371402: '德城区',
          371403: '陵城区',
          371422: '宁津县',
          371423: '庆云县',
          371424: '临邑县',
          371425: '齐河县',
          371426: '平原县',
          371427: '夏津县',
          371428: '武城县',
          371481: '乐陵市',
          371482: '禹城市',
        }
      },
      isAreaShow: false,
      is_login: false,
      logins: '提 交',
      loginForm: {
        Merchant: '',
        areaold: [
          {
            code: '370000',
            name: '山东省'
          },
          {
            code: '371400',
            name: '德州市'
          },
          {
            code: '371424',
            name: '临邑县'
          }
        ],
        money: '',
        tag: '',
        tab: '',
        tab1: '',
        tab2: '',
        imgurl: '',
        remark: '',
        uid: getUserid(),
      },
    }
  },
  computed: {
    area() {
      return this.loginForm.areaold[0].name + ' / ' + this.loginForm.areaold[1].name + ' / ' + this.loginForm.areaold[2].name
    } 
  },
  methods: {
    // 获取七牛云token
    async _fetchQiNiuToken() {
      const res = await getqiniutoken()
      const { data } = res
      return data
    },
    //自定义上传函数
    handleUpLoadIconImg(req) {
      this._uploadQiNiu(req)//封装的上传七牛云函数
    },
    //图片预览放大
    handleIconCardPreview() {
      this.dialogImageUrl = this.activityInfo.imgUrl_1
      this.dialogVisible = true
      console.log('图片预览放大')
    },
    //移除图片时的钩子函数
    handleIconCardicon() {
      this.activityInfo.imgUrl_1 = '../../assets/img/logo.jpg'
      this.dialogImageUrl = this.activityInfo.imgUrl_1
    },
    // 压缩图片函数
    canvasDataURL(path, obj, callback){
      let img = new Image();
      img.src = path;
      img.onload = function(){
          let that = this;
          let w = that.width,
              h = that.height,
              scale = w / h;
          w = obj.width || w;
          h = obj.height || (w / scale);
          let quality = 0.7;
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          let anw = document.createAttribute("width");
          anw.nodeValue = w;
          let anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          if(obj.quality && obj.quality <= 1 && obj.quality > 0){
              quality = obj.quality;
          }
          let base64 = canvas.toDataURL('image/jpeg', quality);
          callback(base64);
      }
    },
    //创建FileReader实例
    photoCompress(file,w,objDiv){
        let ready=new FileReader();
        ready.readAsDataURL(file);
        let that=this
        ready.onload=function(){
            let re=this.result;
            that.canvasDataURL(re,w,objDiv)
        }
    },
    //将以base64的图片url数据转换为Blob
    convertBase64UrlToBlob(urlData){
        let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    },
    // 上传七牛云
    async _uploadQiNiu(req, type) {
      const fileType = req.file.type.split('/')[1] //获取到上传的文件
      // 重命名要上传的文件
      const keyname = 'wuzhi' + Date.now() + Math.floor(Math.random() * 100) + '.' + fileType
      const token = await this._fetchQiNiuToken() //上传七牛云token
      const formData = new FormData() //创建FormData对象，用来以键值对的方式存储form表单data
      formData.append('token', token)
      formData.append('key', keyname)
      formData.append('file', req.file)
      let self = this
      if(req.file.size/1024 > 1025) { //大于1M，进行压缩上传
        if(req.file.type.indexOf("image/") == -1){ //上传的不是图片
          self.$message({
            message: '请您选择正确的图片格式！',
            type: 'warning',
            center: true
          })
          return
        } else { //上传的是图片
          self.photoCompress(req.file, {
            quality: 0.2
          }, function(base64){
            let bl = self.convertBase64UrlToBlob(base64);
            bl.uid=req.file.uid
            bl.name=req.file.name
            bl.uid=req.file.uid
            bl.lastModified=req.file.lastModified
            bl.lastModifiedDate=req.file.lastModifiedDate
            bl.webkitRelativePath=req.file.webkitRelativePath
            formData.append('file', bl); // 文件对象
            axios.post(self.domain, formData).then(res => {
              const url = self.qiniuAddress + '/' + res.data.key
              self.loginForm.imgurl = url
            })
          })
        }
      } else {
        if(req.file.type.indexOf("image/") == -1){ //上传的不是图片
          self.$message({
            message: '请您选择正确的图片格式！',
            type: 'warning',
            center: true
          })
          return
        } else { //上传的是图片
          axios.post(self.domain, formData).then(res => {
            const url = self.qiniuAddress + '/' + res.data.key
            self.loginForm.imgurl = url
          })
        }
      }
    },
    //选择地区弹窗展示函数
    seleArea() {
      this.isAreaShow = true
    },
    //选择地区函数
    seleAreaOver(query) {
      this.loginForm.areaold = query
      this.isAreaShow = false
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
      if (this.loginForm.Merchant == '' || this.loginForm.money == '' || this.loginForm.tab == '' || this.loginForm.tab1 == '' || this.loginForm.tab2 == '' || this.loginForm.remark == '' || this.loginForm.tag == '') {
        this.$message({
          message: '请您填写完整信息',
          type: 'warning',
          center: true
        });
        return
      }
      let self = this
      addactives(self.loginForm).then(res => {
        let { data } = res
        if (data.code == 200) {
          self.$message({
            message: '恭喜您！创建成功！',
            type: 'success',
            center: true
          });
          self.$router.push({ path: '/activelist' })
        } else {
          self.$message({
            message: '创建活动失败！',
            type: 'warning',
            center: true
          });
        }
      }).catch(error => {
        self.$message({
          message: '创建活动失败！',
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
.activeQy {
  border-bottom: 1px solid white;
  color: #DCDFE6;
}
</style>
