<template>
  <div class="loginWrap" @scroll="handleFilterScrloo">
    <div class="goBack" @click="$router.go(-1)">< 返回</div>
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
            <div>商品名称：
              <span class="sortListSp">{{ item.name }}</span>
            </div>
            <div>商品编码：
              <span class="sortListSp">{{ item.code }}</span>
            </div>
            <div>商品规格：
              <span class="sortListSp">{{ item.format }}</span>
            </div>
            <div>商品数量：
              <span class="sortListSp">{{ item.nums }}</span>
            </div>
          </div>
          <div class="myBtn" @click="addsort(index)">入库</div>
          <!-- <el-button type="primary" @click="addsort(index)">编辑</el-button> -->
        </div>
        <div class="sortListBr"></div>
        <div class="sortListB">
          <div class="goodsList">
            <div>商品进价：
              <span class="sortListSp">{{ item.inprice }}</span>
            </div>
            <div>商品售价：
              <span class="sortListSp">{{ item.outprice }}</span>
            </div>
            <div>毛利率：
              <span class="sortListSp">{{ ((item.outprice - item.inprice) / item.inprice * 100).toFixed(2) }} %</span>
            </div>
            <div>添加时间：
              <span class="sortListSp">{{ item.addtime }}</span>
            </div>
          </div>
          <div class="myBtn" style="background:#191970;" @click="copyTask(index)">退货</div>
          <!-- <el-button type="primary" @click="copyTask(index)">删除</el-button> -->
        </div>
      </div>
    </div>
    <!-- 出售商品 -->
    <el-dialog :visible.sync="dialogaddsort" title="出售商品" style="width:80%;">
      <div class="dialog_div">
        <span class="dialog_sp">出售数量</span>
        <el-input v-model="sorts.changenums" placeholder="请输入商品规格" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">出售日期</span>
        <el-select style="width:100%;" v-model="sorts.date" placeholder="请选择出售日期">
          <el-option v-for="item in dates" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">出售时间</span>
        <el-select style="width:100%;" v-model="sorts.time" placeholder="请选择出售日期">
          <el-option v-for="item in times" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">商品进价</span>
        <el-input v-model="sorts.inprice" placeholder="请输入库存上线" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">商品售价</span>
        <el-input v-model="sorts.outprice" placeholder="请输入库存下线" autocomplete="off"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddsort = false">取 消</el-button>
        <el-button type="primary" @click="addsortsubmit(0)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 报损商品 -->
    <el-dialog :visible.sync="dialogaddsort1" title="出售商品" style="width:80%;">
      <div class="dialog_div">
        <span class="dialog_sp">报损数量</span>
        <el-input v-model="sorts.changenums" placeholder="请输入商品规格" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">报损日期</span>
        <el-select style="width:100%;" v-model="sorts.date" placeholder="请选择报损日期">
          <el-option v-for="item in dates" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">报损时间</span>
        <el-select style="width:100%;" v-model="sorts.time" placeholder="请选择报损日期">
          <el-option v-for="item in times" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">商品进价</span>
        <el-input v-model="sorts.inprice" placeholder="请输入库存上线" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">商品售价</span>
        <el-input v-model="sorts.outprice" placeholder="请输入库存下线" autocomplete="off"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddsort1 = false">取 消</el-button>
        <el-button type="primary" @click="addsortsubmit(1)">确 定</el-button>
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
      dialogaddsort1: false,
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
      dates: [
        {value: 1,label: '星期一'},
        {value: 2,label: '星期二'},
        {value: 3,label: '星期三'},
        {value: 4,label: '星期四'},
        {value: 5,label: '星期五'},
        {value: 6,label: '星期六'},
        {value: 7,label: '星期天'},
      ],
      times: [
        {value: 1,label: '1:00'},
        {value: 2,label: '2:00'},
        {value: 3,label: '3:00'},
        {value: 4,label: '4:00'},
        {value: 5,label: '5:00'},
        {value: 6,label: '6:00'},
        {value: 7,label: '7:00'},
        {value: 8,label: '8:00'},
        {value: 9,label: '9:00'},
        {value: 10,label: '10:00'},
        {value: 11,label: '11:00'},
        {value: 12,label: '12:00'},
        {value: 13,label: '13:00'},
        {value: 14,label: '14:00'},
        {value: 15,label: '15:00'},
        {value: 16,label: '16:00'},
        {value: 17,label: '17:00'},
        {value: 18,label: '18:00'},
        {value: 19,label: '19:00'},
        {value: 20,label: '20:00'},
        {value: 21,label: '21:00'},
        {value: 22,label: '22:00'},
        {value: 23,label: '23:00'},
        {value: 24,label: '24:00'},
      ],
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
    //入库商品
    addsort(index) {
      this.sorts = this.sortList[index]
      this.sorts.changenums = 1
      this.sorts.numtype = 4
      this.dialogaddsort = true
    },
    //入库商品提交
    addsortsubmit(num) {
      //验证表单是否填写完整
      if (this.sorts.changenums == '' || this.sorts.numtype == '' || this.sorts.date == '' || this.sorts.time == '' || this.sorts.inpricenow == '' || this.sorts.outpricenow == '') {
        this.$message({
          message: '请您填写完整信息',
          type: 'warning'
        });
        return
      }
      if (!this.sorts.date || !this.sorts.time) {
        this.$message({
          message: '请您选择日期和时间',
          type: 'warning'
        });
        return
      }
      this.sorts.type = 2
      editeGoodsinfo(this.sorts).then(res => {
        if (num == 0) {
          this.dialogaddsort = false
        }
        if (num == 1) {
          this.dialogaddsort1 = false
        }
        this.$message({
          type: 'success',
          message: res.data.message
        });
        this.sorts = ''
        this._fetchActivityList(0)
      }).catch(error => {
        this.$message('商品出入库失败!')
      })
    },
    //报损商品
    copyTask(index) {
      this.sorts = this.sortList[index]
      this.sorts.changenums = 1
      this.sorts.numtype = 2
      this.dialogaddsort1 = true
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
          this.$message('没有更多分类!')
        }
      }).catch(error => {
        this.sortList = []
        Indicator.close()
        this.$message('获取分类信息失败！')
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
.sortContentWrpa {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 40px 0;
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
  background-image: linear-gradient( 153deg, rgb(100,10,30) 0%, rgb(10,200,30) 100%);
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
  background-image: linear-gradient( 153deg, rgb(255,215,0) 0%, rgb(10,200,30) 100%);
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
  color: white;
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
  color: white;
}
</style>
