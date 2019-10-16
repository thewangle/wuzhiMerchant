<template>
  <div class="loginWrap" @scroll="handleFilterScrloo">
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter" style="color:black;">账号列表</div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="sortContentWrpa">
      <div class="subWrapGoodslist">
        <div style="font-size:17px;">条件筛选</div>
        <div>
          <el-input v-model="listQuery.username" placeholder="请输入用户名" @keyup.enter.native="handleFilter"/>
        </div>
        <div class="subWrap">
          <el-button type="success" icon="el-icon-search" @click="handleFilter" style="margin-top:10px;">查询</el-button>
          <el-button style="margin-top:10px;" class="filter-item" type="primary" icon="el-icon-edit" @click="adduser()">添加账号</el-button>
        </div>
      </div>
      <div class="sortListWrap" v-for="(item,index) in sortList">
        <div class="sortListB">
          <div class="goodsList">
            <div class="biao">用户名：
              <span class="sortListSp yellow">{{ item.username }}</span>
            </div>
            <div>电话：
              <span class="sortListSp red">{{ item.phone }}</span>
            </div>
            <div>账号名称：
              <span class="sortListSp blue">{{ item.department }}</span>
            </div>
          </div>
          <div class="userbtWrap">
            <div class="myBtn" @click="addsort(index)">编辑</div>
            <div class="myBtn" @click="renewalfee(index)" style="margin-top:10px;background:orange;">续费</div>
          </div>
        </div>
        <div class="sortListB">
          <div class="goodsList">
            <div>管理员名称：
              <span class="sortListSp blue">{{ item.adminname }}</span>
            </div>
            <div>到期时间：
              <span class="sortListSp yellow">{{ item.addtime }}</span>
            </div>
          </div>
          <div class="myBtn" style="background:#191970;" @click="copyTask(index)">删除</div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogaddsort" title="编辑账号" style="width:80%;" :modal-append-to-body='false'>
      <div class="dialog_div">
        <span class="dialog_sp">用户名</span>
        <el-input disabled v-model="sorts.username" placeholder="请输入用户名" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">密码</span>
        <el-input v-model="sorts.password" placeholder="请输入密码" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">账号名称</span>
        <el-input v-model="sorts.department" placeholder="请输入账号名称" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">管理员</span>
        <el-input v-model="sorts.adminname" placeholder="请输入管理员" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">电话</span>
        <el-input v-model="sorts.phone" placeholder="请输入电话" autocomplete="off"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddsort = false">取 消</el-button>
        <el-button type="primary" @click="addsortsubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 续费 -->
    <el-dialog :visible.sync="dialogrenewalfee" title="续费" style="width:80%;" :modal-append-to-body='false'>
      <div class="dialog_div">
        <span class="dialog_sp" style="width:100px;">续费年限：</span>
        <div style="width:150px;">
          <el-input v-model="years" autocomplete="off"><template slot="append">年</template></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogrenewalfee = false">取 消</el-button>
        <el-button type="primary" @click="renewalfeebt">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment' //日期转换插件
import { getUserid, getRoleId, getpartantId, getUserName } from '@/utils/cookie'
import { getUserByPermission, editeUser, deletUser, renewalFee } from '@/api/user' //请求函数
import { Indicator } from 'mint-ui'

export default {
  name: 'supplierlist',
  components: {
    
  },
  mounted() {
    this.handleFilter()
  },
  data () {
    return {
      loading: false,
      dialogaddsort: false,
      dialogrenewalfee: false,
      years: 1, //续费用年限
      listQuery: { //动态请求table数据时传递的参数
        page_no: 1, //页码
        page_size: 10,//每页显示条数
        role: null,//角色
        username: null,//用户名
        partantuser: getUserName(),//上级用户名
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
    //点击续费
    renewalfee(index) {
      this.sorts = this.sortList[index]
      this.dialogrenewalfee = true
    },
    //更改续费提交
    renewalfeebt() {
      let is_num = /^\+?[1-9][0-9]*$/
      if (!is_num.test(this.years)) {
        this.$message({
          message: '请您输入正确的数量',
          type: 'warning',
          center: true
        });
        return
      }
      let addtimes = moment(this.sorts.addtime).add('days',365 * (this.years)).format('YYYY-MM-DD HH:mm:ss')
      let data = {
        username : this.sorts.username,
        addtime : addtimes
      }
      renewalFee(data).then(res => {
        this.dialogrenewalfee = false
        this.$message({
          type: 'success',
          message: res.data.message
        });
        this.sorts = ''
        this.years = 1
        // this._fetchActivityList()
      }).catch(error => {
        this.$message(error)
      })
    },
    //添加账号
    adduser() {
      this.$router.push({ path: '/adduser' })
    },
    //编辑商品
    addsort(index) {
      this.sorts = this.sortList[index]
      this.dialogaddsort = true
    },
    //添加/更改商品信息
    addsortsubmit() {
      //验证表单是否填写完整
      if(!(/^1[3456789]\d{9}$/.test(this.sorts.phone))){ 
          this.$message({
            message: '请您输入正确的手机号格式！',
            type: 'warning',
            center: true
          });
          return false; 
      }
      this.editsortinfo()
    },
    //更改商品信息
    editsortinfo() {
      editeUser(this.sorts).then(res => {
        this.dialogaddsort = false
        this.$message({
          type: 'success',
          message: res.data.message,
          center: true
        })
      }).catch(error => {
        this.$message({
          type: 'error',
          message: '编辑账号信息失败!',
          center: true
        })
      })
    },
    //点击删除
    copyTask(num) {
      let sort = this.sortList[num]
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          'username': sort.username
        }
        deletUser(data).then(res => {
          this.$message({
            type: 'success',
            message: res.data.message,
            center: true
          });
          this.handleFilter()
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '删除失败!',
            center: true
          })
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
      getUserByPermission(this.listQuery).then(res => {
        let { data } = res
        if (data.code == 200) {
          Indicator.close()
          if (query == 1) {
            let newsortList = this.sortList.concat(data.data.data)
            if (data.data.data == '') {
              this.$message({
                type: 'error',
                message: '没有更多账号!',
                center: true
              })
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
          this.$message({
            type: 'error',
            message: '没有更多账号!',
            center: true
          })
        }
      }).catch(error => {
        this.sortList = []
        Indicator.close()
        this.$message({
          type: 'error',
          message: '没有更多账号!',
          center: true
        })
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
  border-bottom: 1px solid rgb(220,220,220);
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
  margin-bottom: 30px;
  text-align: center;
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
.subWrap {
  display: flex;
  align-items: center;
}
</style>
