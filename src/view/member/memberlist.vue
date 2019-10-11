<template>
  <div class="loginWrap" @scroll="handleFilterScrloo">
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter" style="color:black;">会员列表</div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="sortContentWrpa">
      <div class="subWrapGoodslist">
        <div style="font-size:17px;">条件筛选</div>
        <div>
          <el-input v-model="listQuery.name" placeholder="请输入会员姓名" @keyup.enter.native="handleFilter"/>
        </div>
        <div>
          <el-input v-model="listQuery.phone" placeholder="请输入会员手机号" @keyup.enter.native="handleFilter"/>
        </div>
        <div>
          <el-button type="success" icon="el-icon-search" @click="handleFilter" style="margin-top:10px;">查询</el-button>
        </div>
      </div>
      <div class="sortListWrap" v-for="(item,index) in sortList">
        <div class="sortListB">
          <div class="goodsList">
            <div class="biao">会员姓名：
              <span class="sortListSp">{{ item.name }}</span>
            </div>
            <div>电话：
              <span class="sortListSp yellow">{{ item.phone }}</span>
            </div>
            <div>会员生日：
              <span class="sortListSp blue">{{ item.birthday }}</span>
            </div>
          </div>
          <div class="myBtn" @click="addsort(index)">编辑</div>
        </div>
        <div class="sortListB">
          <div class="goodsList">
            <div>年龄：
              <span class="sortListSp red">{{ item.age }}</span>
            </div>
            <div>会员性别：
              <span class="sortListSp blue">{{ item.sex }}</span>
            </div>
            <div>会员描述：
              <span class="sortListSp yellow">{{ item.description }}</span>
            </div>
            <div>添加时间：
              <span class="sortListSp">{{ item.addtime }}</span>
            </div>
          </div>
          <div class="myBtn" style="background:#191970;" @click="copyTask(index)">删除</div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogaddsort" title="编辑商品" style="width:80%;">
      <div class="dialog_div">
        <span class="dialog_sp">会员姓名</span>
        <el-input disabled v-model="sorts.name" placeholder="请输入供应商名称" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">电话</span>
        <el-input v-model="sorts.phone" placeholder="请输入电话" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">会员生日</span>
        <el-input disabled v-model="sorts.birthday" placeholder="请输入联系人" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">会员性别</span>
        <el-input disabled v-model="sorts.sex" placeholder="请输入联系人" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">会员描述</span>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入分类备注"
          v-model="sorts.description">
        </el-input>
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
import { getUserid, getRoleId, getpartantId } from '@/utils/cookie'
import { getMemberinfo, editeMemberinfo, deleteMemberinfo } from '@/api/member' //请求函数
import { Indicator } from 'mint-ui'

export default {
  name: 'memberlist',
  components: {
    
  },
  mounted() {
    this.handleFilter()
  },
  data () {
    return {
      loading: false,
      dialogaddsort: false,
      listQuery: { //动态请求table数据时传递的参数
        page_no: 1, //页码
        page_size: 10,//每页显示条数
        name: '',//商品名称
        phone: '',//商品编码
        role: getRoleId(),
        userid: getUserid(),
        userpartid: getpartantId()
      },
      sortss: [],
      suppliers: [],
      sorts: {
        name: '',
        remark: '',
        role: getRoleId(),
        uid: getUserid(),
        pid: getpartantId()
      },
      sortList: [],
    }
  },
  methods: {
    //编辑商品
    addsort(index) {
      this.dialogaddsort = true
      this.sorts = this.sortList[index]
    },
    //添加/更改商品信息
    addsortsubmit() {
      //验证表单是否填写完整
      if(!(/^1[3456789]\d{9}$/.test(this.sorts.phone))){ 
          this.$message({
            message: '请您输入正确的手机号格式！',
            type: 'warning'
          });
          return false; 
      }
      this.editsortinfo()
    },
    //更改商品信息
    editsortinfo() {
      editeMemberinfo(this.sorts).then(res => {
        this.dialogaddsort = false
        this.$message({
          type: 'success',
          message: res.data.message
        })
      }).catch(error => {
        this.$message('编辑会员信息失败!')
      })
    },
    //点击删除
    copyTask(num) {
      let sort = this.sortList[num]
      this.$confirm('此操作将永久删除该会员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          'id': sort.id
        }
        deleteMemberinfo(data).then(res => {
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
      this.listQuery.page_no = 1 //将当前页归1
      this._fetchActivityList(0) //重新获取数据 0表示正常请求、1表示滚动加载请求
    },
    // 滚动无限加载
    handleFilterScrloo() {
      let wrap_height = $('.loginWrap').height();  //容器的高度
      let scroll_top = $('.loginWrap').scrollTop();   //滚动条的scrolltop
      let scroll_height = $('.loginWrap').prop('scrollHeight');  //内容的高度
      let is_height = scroll_height - wrap_height - scroll_top
      if (is_height == 0) {
        this.listQuery.page_no += 1 //将当前页归1
        this._fetchActivityList(1) //重新获取数据
      }
    },
    // 获取table数据函数
    async _fetchActivityList(query) {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      getMemberinfo(this.listQuery).then(res => {
        let { data } = res
        if (data.code == 200) {
          Indicator.close()
          data.data.data.forEach((item,index) => {
            if (item.sex == 1) {
              item.sex = '男'
            }
            if (item.sex == 2) {
              item.sex = '女'
            }
          })
          if (query == 1) {
            let newsortList = this.sortList.concat(data.data.data)
            if (data.data.data == '') {
              this.$message('没有更多会员!')
              this.listQuery.page_no -= 1
            }
            this.sortList = newsortList
          } else {
            this.sortList = data.data.data
          }
        }
        if (data.code == 201) {
          this.sortList = []
          Indicator.close()
          this.$message('没有更多会员!')
        }
      }).catch(error => {
        this.sortList = []
        Indicator.close()
        this.$message('获取会员信息失败！')
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
}
.addSortbtWrap {
  width:100%;
  position:fixed;
  bottom:30px;
  left:0;
  text-align: center;
}
.sortListWrap {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-bottom: 10px solid rgb(230,230,230);
  margin:20px 0;
}
.sortListWrap:last-child{
  margin-bottom: 90px;
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
  width: 350px;
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
</style>
