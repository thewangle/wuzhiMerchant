<template>
  <div class="loginWrap">
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter">活动列表</div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="addSortbtWrap" v-if="isAddActives">
      <el-button style="width:90%;padding:10px 0;" class="filter-item" type="primary" icon="el-icon-edit" @click="adduser()">添加活动</el-button>
    </div>
    <div class="sortContentWrpa">
      <div class="sortListWrap" v-for="(item,index) in sortList">
        <div class="sortListB">
          <div class="goodsList">
            <div class="biao">
              <span class="spanB">活动名称：</span>
              <span class="sortListSp yellow">{{ item.Merchant }}</span>
            </div>
            <div>示例起价：
              <span class="sortListSp red">{{ item.money }}</span>
            </div>
            <div>示例标签：
              <span class="sortListSp blue">{{ item.tag }}</span>
            </div>
          </div>
          <div class="myBtn" @click="addsort(index)">编辑</div>
        </div>
        <div class="sortListB">
          <div class="goodsList">
            <div>
              <span>副标题-惠：</span>
              <span class="sortListSp blue">{{ item.tab }}</span>
            </div>
            <div>
              <span>副标题-折：</span>
              <span class="sortListSp red">{{ item.tab1 }}</span>
            </div>
            <div>
              <span>副标题-促：</span>
              <span class="sortListSp yellow">{{ item.tab2 }}</span>
            </div>
          </div>
          <div class="myBtn" style="background:#191970;" @click="copyTask(index)">删除</div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogaddsort" title="编辑活动" style="width:80%;" :modal-append-to-body='false'>
      <div class="dialog_div">
        <span class="dialog_sp">活动名称</span>
        <el-input v-model="sorts.Merchant" placeholder="请输入活动名称" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">示例起价</span>
        <el-input v-model="sorts.money" placeholder="请输入示例起价" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">示例标签</span>
        <el-input v-model="sorts.tag" placeholder="请输入示例标签" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">副标题-惠</span>
        <el-input v-model="sorts.tab" placeholder="请输入副标题-惠" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">副标题-折</span>
        <el-input v-model="sorts.tab1" placeholder="请输入副标题-折" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">副标题-促</span>
        <el-input v-model="sorts.tab2" placeholder="请输入副标题-促" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">活动图片</span>
        <el-upload
          :http-request="handleUpLoadIconImg"
          :on-remove="handleIconCardicon"
          :limit="1"
          :action="domain"
          :file-list="iconFilelist"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddsort = false">取 消</el-button>
        <el-button type="primary" @click="addsortsubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment' //日期转换插件
import { getUserid } from '@/utils/cookie'
import { getallactivesbyid, editeactive, deletactive, getqiniutoken } from '@/api/actives' //请求函数
import { Indicator } from 'mint-ui'

export default {
  name: 'activelist',
  components: {
    
  },
  mounted() {
    this.handleFilter()
  },
  data () {
    return {
      isAddActives: true,
      loading: false,
      dialogaddsort: false,
      iconFilelist: [],//上传文件列表
      domain: 'http://upload-z2.qiniup.com',//上传到七牛云的地址
      qiniuAddress: 'http://m.wuzhi1688.com', //七牛云仓库绑定的域名
      listQuery: { //动态请求table数据时传递的参数
        uid: getUserid(),//用户名
      },
      sortss: [],
      suppliers: [],
      sorts: {
        name: '',
        remark: '',
        uid: getUserid(),
      },
      sortList: [],
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
    //移除图片时的钩子函数
    handleIconCardicon() {
      this.sorts.imgurl = '../../assets/img/logo.jpg'
      this.dialogImageUrl = this.sorts.imgurl
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
            type: 'warning'
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
              self.sorts.imgurl = url
            })
          })
        }
      } else {
        if(req.file.type.indexOf("image/") == -1){ //上传的不是图片
          self.$message({
            message: '请您选择正确的图片格式！',
            type: 'warning'
          })
          return
        } else { //上传的是图片
          axios.post(self.domain, formData).then(res => {
            const url = self.qiniuAddress + '/' + res.data.key
            self.sorts.imgurl = url
          })
        }
      }
    },
    //添加活动
    adduser() {
      this.$router.push({ path: '/addactive' })
    },
    //编辑商品
    addsort(index) {
      this.dialogaddsort = true
      this.sorts = this.sortList[index]
      this.iconFilelist = [{ name: '活动介绍图', url: this.sorts.imgurl }]
    },
    //添加/更改商品信息
    addsortsubmit() {
      //验证表单是否填写完整
      this.editsortinfo()
    },
    //更改商品信息
    editsortinfo() {
      editeactive(this.sorts).then(res => {
        this.dialogaddsort = false
        this.$message({
          type: 'success',
          message: '修改活动成功!'
        })
      }).catch(error => {
        this.$message('编辑活动信息失败!')
      })
    },
    //点击删除
    copyTask(num) {
      let sort = this.sortList[num]
      this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          'id': sort.id
        }
        deletactive(data).then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          });
          this.handleFilter()
        }).catch(error => {
          this.$message('删除失败')
        })
      }).catch(() => {

      });
    },
    //顶部搜索框搜索功能
    handleFilter() {
      this._fetchActivityList() //重新获取数据 0表示正常请求、1表示滚动加载请求
    },
    // 获取table数据函数
    async _fetchActivityList() {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      getallactivesbyid(this.listQuery).then(res => {
        let { data } = res
        if (data.code == 200) {
          Indicator.close()
          this.sortList = data.data
          if (this.sortList.lenght > 5) {
            this.isAddActives = false
          }
        }
        if (data.code == 201) {
          this.sortList = []
          Indicator.close()
          this.$message('没有更多活动信息!')
        }
      }).catch(error => {
        this.sortList = []
        Indicator.close()
        this.$message('获取活动信息失败！')
      })
    },
  },
}
</script>

<style scoped>
.loginWrap {
  width: 100%;
  height: 100%; 
  background: rgb(240,240,240);
  background: white;
  color: rgb(140,140,140);
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}
.sortContentWrpa {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.subWrapGoodslist {
  width: 90%;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-bottom: 10px solid rgb(230,230,230);
}
.subWrapGoodslist>div {
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  color: white;
}
.addSortbtWrap {
  width:100%;
  text-align: center;
  margin-top: 30px;
}
.sortListWrap:last-child{
  margin-bottom: 30px;
}
.sortListB {
  width: 90%;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sortListBr {
  width: 90%;
  height: 2px;
  background: #E6A23C;
}
.sortListSp {
  display: inline-block;
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dialog_div{
  padding: 10px 0;
}
.dialog_sp {
  margin-bottom: 10px;
  display: inline-block;
}
.goodsList {
  display: flex;
  flex-direction: column;
}
.goodsList>div {
  padding: 10px 0;
  display: flex;
  align-items: center;
}
.userbtWrap {
  display: flex;
  flex-direction: column;
}
</style>
