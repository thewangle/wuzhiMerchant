<template>
  <div class="loginWrap" @scroll="handleFilterScrloo">
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter" style="color:black;">商品列表</div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="sortContentWrpa">
      <div class="subWrapGoodslist">
        <div style="font-size:17px;">条件筛选</div>
        <div>
          <el-input v-model="listQuery.name" placeholder="请输入商品名称" @keyup.enter.native="handleFilter"/>
        </div>
        <div>
          <el-input v-model="listQuery.code" placeholder="请输入商品编码" @keyup.enter.native="handleFilter"/>
        </div>
        <div>
          <el-select style="width:100%;" v-model="listQuery.sortid" placeholder="请选择分类" @change="handleFilter">
            <el-option v-for="item in sortss" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
        <div>
          <el-select style="width:100%;" v-model="listQuery.supplierid" placeholder="请选择供应商" @change="handleFilter">
            <el-option v-for="item in suppliers" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
        <div>
          <el-button type="success" icon="el-icon-search" @click="handleFilter" style="margin-top:10px;">查询</el-button>
        </div>
      </div>
      <div class="sortListWrap" v-for="(item,index) in sortList">
        <div class="sortListB">
          <div class="goodsList">
            <div class="biao">商品名称：
              <span class="sortListSp yellow">{{ item.name }}</span>
            </div>
            <div>商品编码：
              <span class="sortListSp red">{{ item.code }}</span>
            </div>
            <div>商品规格：
              <span class="sortListSp blue">{{ item.format }}</span>
            </div>
            <div>商品数量：
              <span class="sortListSp yellow">{{ item.nums }}</span>
            </div>
          </div>
          <div class="myBtn" @click="addsort(index)">编辑</div>
        </div>
        <div class="sortListB">
          <div class="goodsList">
            <div>商品进价：
              <span class="sortListSp yellow">{{ item.inprice }}</span>
            </div>
            <div>商品售价：
              <span class="sortListSp blue">{{ item.outprice }}</span>
            </div>
            <div>毛利率：
              <span class="sortListSp red">{{ ((item.outprice - item.inprice) / item.inprice * 100).toFixed(2) }} %</span>
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
        <span class="dialog_sp">商品名称</span>
        <el-input v-model="sorts.name" placeholder="请输入商品名称" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">商品编码</span>
        <el-input v-model="sorts.code" placeholder="请输入商品编码" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">商品分类</span>
        <el-select style="width:100%;" v-model="sorts.sortid" placeholder="请选择分类">
          <el-option v-for="item in sortss" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">供应商</span>
        <el-select style="width:100%;" v-model="sorts.supplierid" placeholder="请选择供应商">
          <el-option v-for="item in suppliers" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">商品规格</span>
        <el-input v-model="sorts.format" placeholder="请输入商品规格" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">库存上线</span>
        <el-input v-model="sorts.maxnums" placeholder="请输入库存上线" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">库存下线</span>
        <el-input v-model="sorts.minnums" placeholder="请输入库存下线" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">备注</span>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入分类备注"
          v-model="sorts.remark">
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
import { addSort, getGoodsinfo, editeGoodsinfo, deletegoodsinfo, getSortinfoall, getSupplierall } from '@/api/goods' //请求函数
import { Indicator } from 'mint-ui'

export default {
  name: 'goodslist',
  components: {
    
  },
  mounted() {
    this.handleFilter()
    this.getsortinfoall() //获取该id下分类
    this.getsupplierall() //获取改id下供应商
  },
  data () {
    return {
      loading: false,
      dialogaddsort: false,
      listQuery: { //动态请求table数据时传递的参数
        page_no: 1, //页码
        page_size: 10,//每页显示条数
        name: '',//商品名称
        code: '',//商品编码
        sortid: '',
        supplierid: '',
        role: getRoleId(),
        uid: getUserid(),
        pid: getpartantId()
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
          this.sortss.push({value: item.id,label: item.name})
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
          this.suppliers.push({value: item.id,label: item.name})
        })
      }).catch(error => {
        console.log(error)
      })
    },
    //编辑商品
    addsort(index) {
      this.dialogaddsort = true
      this.sorts = this.sortList[index]
    },
    //添加/更改商品信息
    addsortsubmit() {
      //验证表单是否填写完整
      //验证表单是否填写完整
      if (this.sorts.name == '' || this.sorts.format == '' || this.sorts.sortid == '' || this.sorts.supplierid == '') {
        this.$message({
          message: '请您填写完整信息',
          type: 'warning'
        });
        return
      }
      let is_num = /^\+?[1-9][0-9]*$/
      if (!is_num.test(this.sorts.maxnums) || !is_num.test(this.sorts.minnums)) {
        this.$message({
          message: '请您输入正确的数量',
          type: 'warning'
        });
        return
      }
      if (Number(this.sorts.maxnums) < Number(this.sorts.minnums)) {
        this.$message({
          message: '库存上线不得小于库存下线',
          type: 'warning'
        });
        return
      }
      this.sorts.type = 0
      this.editsortinfo()
    },
    //更改商品信息
    editsortinfo() {
      editeGoodsinfo(this.sorts).then(res => {
        this.dialogaddsort = false
        this.$message({
          type: 'success',
          message: res.data.message
        })
      }).catch(error => {
        this.$message('编辑商品信息失败!')
      })
    },
    //点击删除
    copyTask(num) {
      let sort = this.sortList[num]
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          'id': sort.id
        }
        deletegoodsinfo(data).then(res => {
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
      getGoodsinfo(this.listQuery).then(res => {
        let { data } = res
        if (data.code == 200) {
          Indicator.close()
          if (query == 1) {
            let newsortList = this.sortList.concat(data.data.data)
            if (data.data.data == '') {
              this.$message('没有更多商品!')
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
          this.$message('没有更多商品!')
        }
      }).catch(error => {
        this.sortList = []
        Indicator.close()
        this.$message('获取商品信息失败！')
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
  /*background-image: linear-gradient( 153deg, rgb(255,215,0) 0%, rgb(10,200,30) 100%);*/
  margin:20px 0;
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
}
</style>
