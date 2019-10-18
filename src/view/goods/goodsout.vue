<template>
  <div class="loginWrap" @scroll="handleFilterScrloo">
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter" style="color:black;">商品出库</div>
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
          <el-select style="width:100%;" clearable v-model="listQuery.sortid" placeholder="请选择分类" @change="handleFilter">
            <el-option v-for="item in sortss" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
        <div>
          <el-select style="width:100%;" clearable v-model="listQuery.supplierid" placeholder="请选择供应商" @change="handleFilter">
            <el-option v-for="item in suppliers" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
        <div>
          <el-button type="success" icon="el-icon-search" @click="handleFilter" style="margin-top:10px;width:100%;padding:10px 0;">查询</el-button>
        </div>
      </div>
      <div class="noDate" v-show="!isShowList">
        <img src="../../assets/img/nodata.jpg" alt="" class="nodataImg">
        <span class="nodataSpan">暂无数据</span>
      </div>
      <div class="sortListWrap" v-show="isShowList" v-for="(item,index) in sortList">
        <div class="sortListB">
          <div class="goodsList">
            <div class="biao">
              <span class="spanB">商品名称：</span>
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
          <div class="myBtn" @click="addsort(index)">售出</div>
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
          <div class="myBtn" style="background:#191970;" @click="copyTask(index)">报损</div>
        </div>
      </div>
    </div>
    <!-- 出售商品 -->
    <el-dialog :visible.sync="dialogaddsort" title="出售商品" style="width:80%;" :modal-append-to-body='false'>
      <div class="dialog_div">
        <span class="dialog_sp">出售数量</span>
        <el-input v-model="sorts.changenums" placeholder="请输入出售数量" name="changenums" type="text" auto-complete="on" @input="change($event)"></el-input>
      </div>
      <!-- <div class="dialog_div">
        <span class="dialog_sp">出售日期</span>
        <el-select style="width:100%;" clearable v-model="sorts.date" placeholder="请选择出售日期">
          <el-option v-for="item in dates" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">出售时间</span>
        <el-select style="width:100%;" clearable v-model="sorts.time" placeholder="请选择出售日期">
          <el-option v-for="item in times" :label="item.label" :value="item.value"/>
        </el-select>
      </div> -->
      <div class="dialog_div">
        <span class="dialog_sp">商品进价</span>
        <el-input disabled v-model="sorts.inpricenow" placeholder="请输入商品进价" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">商品售价</span>
        <el-input disabled v-model="sorts.outpricenow" placeholder="请输入商品售价" autocomplete="off"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogaddsort = false">取 消</el-button>
        <el-button type="primary" @click="addsortsubmit(0)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 报损商品 -->
    <el-dialog :visible.sync="dialogaddsort1" title="商品报损" style="width:80%;" :modal-append-to-body='false'>
      <div class="dialog_div">
        <span class="dialog_sp">报损数量</span>
        <el-input v-model="sorts.changenums" @input="change($event)" placeholder="请输入商品规格" autocomplete="off"></el-input>
      </div>
      <!-- <div class="dialog_div">
        <span class="dialog_sp">报损日期</span>
        <el-select style="width:100%;" clearable v-model="sorts.date" placeholder="请选择报损日期">
          <el-option v-for="item in dates" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">报损时间</span>
        <el-select style="width:100%;" clearable v-model="sorts.time" placeholder="请选择报损日期">
          <el-option v-for="item in times" :label="item.label" :value="item.value"/>
        </el-select>
      </div> -->
      <div class="dialog_div">
        <span class="dialog_sp">商品进价</span>
        <el-input disabled v-model="sorts.inpricenow" placeholder="请输入商品进价" autocomplete="off"></el-input>
      </div>
      <div class="dialog_div">
        <span class="dialog_sp">商品售价</span>
        <el-input disabled v-model="sorts.outpricenow" placeholder="请输入商品售价" autocomplete="off"></el-input>
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
      isShowList: true,
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
        changenums: 1,
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
    //解决input不能输入问题
    change() {
      this.$forceUpdate()
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
    //售出商品
    addsort(index) {
      this.sorts = this.sortList[index]
      this.sorts.changenums = 1
      this.sorts.numtype = 1
      this.sorts.inpricenow = this.sortList[index].inprice
      this.sorts.outpricenow = this.sortList[index].outprice
      this.dialogaddsort = true
    },
    //出售商品
    addsortsubmit(num) {
      //验证表单是否填写完整
      if (this.sorts.changenums == '' || this.sorts.numtype == '' || this.sorts.inpricenow == '' || this.sorts.outpricenow == '') {
        this.$message({
          message: '请您填写完整信息',
          type: 'warning',
          center: true
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
          message: res.data.message,
          center: true
        });
        this.sorts = ''
        this._fetchActivityList(0)
      }).catch(error => {
        this.$message({
          type: 'error',
          message: '商品出入库失败！',
          center: true
        });
      })
    },
    //报损商品
    copyTask(index) {
      this.sorts = this.sortList[index]
      this.sorts.inpricenow = this.sortList[index].inprice
      this.sorts.outpricenow = this.sortList[index].outprice
      this.sorts.changenums = 1
      this.sorts.numtype = 3
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
          this.isShowList = true
          Indicator.close()
          if (query == 1) {
            let newsortList = this.sortList.concat(data.data.data)
            if (data.data.data == '') {
              this.$message({
                type: 'error',
                message: '没有更多商品！',
                center: true
              });
              this.listQuery.page_no -= 1
            }
            this.sortList = newsortList
          } else {
            if (data.data.data == '') {
              this.isShowList = false
              this.$message({
                type: 'error',
                message: '没有更多商品！',
                center: true
              });
            }
            this.sortList = data.data.data
          }
        }
        if (data.code == 201) {
          this.isShowList = false
          this.sortList = []
          Indicator.close()
          this.$message({
            type: 'error',
            message: '没有更多商品！',
            center: true
          });
        }
      }).catch(error => {
        this.isShowList = false
        this.sortList = []
        Indicator.close()
        this.$message({
          type: 'error',
          message: '没有更多商品！',
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
  border-bottom: 1px solid rgb(230,230,230);
}
.subWrapGoodslist>div {
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  /*color: white;*/
}
.addSortbtWrap {
  width:100%;
  position:fixed;
  bottom:30px;
  left:0;
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
  width: 350px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /*color: white;*/
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
