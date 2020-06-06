<template>
  <div class="loginWrap" @scroll="handleFilterScrloo">
    <div class="vanNavBar">
      <div class="vanNavBarLeft" @click="$router.go(-1)"><img src="../../assets/img/back.png" alt=""> <span>返回</span></div>
      <div class="vanNavBarCenter" style="color:black;">分类列表</div>
      <div class="vanNavBarRight"></div>
    </div>
    <div class="hellpWrap" @click="popupVisible = true">
      <div class="hellpWrap1">
        <img src="../../assets/img/hellp.png" alt="" class="hellpImg">
        <span class="hellpB">使用帮助</span>
      </div>
    </div>
    <div class="sortContentWrpa">
      <div class="subWrap">
        <el-input v-model="listQuery.name" placeholder="请输入分类名称" style="width: 250px;" @keyup.enter.native="handleFilter"/>
        <el-button type="success" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </div>
      <div class="addSortbtWrap">
        <el-button style="width:90%;padding:10px 0;" class="filter-item" type="primary" icon="el-icon-edit" @click="addsort(0)">添加分类</el-button>
      </div>
      <div class="noDate" v-show="!isShowList">
        <img src="../../assets/img/nodata.jpg" alt="" class="nodataImg">
        <span class="nodataSpan">暂无数据</span>
      </div>
      <div class="sortListWrap" v-show="isShowList" v-for="(item,index) in sortList">
        <div class="sortListB">
          <span class="sortListSp biao yellow">分类名称：{{ item.name }}</span>
          <div class="myBtn" @click="addsort(1,index)">编辑</div>
        </div>
        <div class="sortListB">
          <span class="sortListSp blue">分类描述：{{ item.remark }}</span>
          <div class="myBtn" style="background:#191970;" @click="copyTask(index)">删除</div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogaddsort" title="添加分类" :modal-append-to-body='false' @close="tcclose">
      <div class="dialog_div">
        <span class="dialog_sp">分类名称</span>
        <el-input v-model="sorts.name" placeholder="请输入分类名称" autocomplete="off"></el-input>
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
    <mt-popup v-model="popupVisible" position="right">
      <div class="hellpContent">
        <div class="hellepB" @click="popupVisible = false"><span class="hellepBB">分类列表页 - 使用帮助</span><span class="hellepBBB">X</span></div>
        <div class="hellepDiv smB">概述：此页为分类的添加与编辑页</div>
        <div class="smContent">
          <span class="smContentB">分类添加：</span>
          <div class="smContentC">
            <div>1.点击"添加分类"会弹出添加分类对话框</div>
            <div>2."分类名称"为要添加分类的名称</div>
            <div>3."备注"为要添加分类的备注描述</div>
            <div>4.点击"取消"关闭对话框，不会添加分类</div>
            <div>5.点击"确定"添加新分类</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB">分类列表：</span>
          <div class="smContentC">
            <div>1.展示账号下的所有分类</div>
            <div>2.点击"编辑"会弹出"分类编辑"对话框，对该分类进行编辑</div>
            <div>3."分类编辑"时点击"取消"不会提交分类编辑并关闭对话框，点击"确定"提交该分类编辑</div>
            <div>4.点击"删除"会弹出"是否删除该分类"提示框，"取消"将不删除该分类，"确定"会永久删除该分类</div>
          </div>
        </div>
        <div class="smContent">
          <span class="smContentB smContentBb">备注：</span>
          <div class="smContentC smContentCc">
            <div>1.支持下拉加载（即：拉到页面底部会加载更多信息）</div>
            <div>2.可以在输入框输入"分类名称"进行精准查询</div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import moment from 'moment' //日期转换插件
import { getUserid, getRoleId, getpartantId } from '@/utils/cookie'
import { addSort, getSortinfo, editeSortinfo, deleteSort } from '@/api/goods' //请求函数
import { Indicator } from 'mint-ui'

export default {
  name: 'goodslist',
  components: {
    
  },
  mounted() {
    this.handleFilter()
  },
  data () {
    return {
      popupVisible: false,
      isShowList: true,
      loading: false,
      dialogaddsort: false,
      listQuery: { //动态请求table数据时传递的参数
        page_no: 1, //页码
        page_size: 10,//每页显示条数
        name: '',
        role: getRoleId(),
        uid: getUserid(),
        pid: getpartantId()
      },
      sorts: {
        name: '',
        remark: '',
        role: getRoleId(),
        uid: getUserid(),
        pid: getpartantId()
      },
      sortList: [],
      sortType: 0,
    }
  },
  methods: {
    //关闭进/售价格更改弹窗回调函数
    tcclose() {
      this._fetchActivityList(0) //重新获取数据
    },
    //添加分类
    addsort(num,index) {
      this.dialogaddsort = true
      this.sortType = num
      if (num == 1) {
        this.sorts = this.sortList[index]
      }
    },
    //添加/更改分类信息
    addsortsubmit() {
      //验证表单是否填写完整
      if (this.sorts.name == '') {
        this.$message({
          message: '请您填写分类名称',
          type: 'warning',
          center: true
        });
        return
      }
      if (this.sortType == 0) {
        addSort(this.sorts).then(res => {
          let { data } = res
          if (data.code == 200) {
            this.$message({
              message: '恭喜您！添加成功！',
              type: 'success',
              center: true
            });
            this.dialogaddsort = false
          } else {
            this.$message({
              message: '对不起！添加失败！',
              type: 'error',
              center: true
            });
            this.dialogaddsort = false
          }
        }).catch(error => {
          this.$message({
            message: '对不起！添加失败！',
            type: 'error',
            center: true
          });
          this.dialogaddsort = false
        })
      }
      if (this.sortType == 1) {
        this.editsortinfo()
      }
    },
    //更改供应商信息
    editsortinfo() {
      editeSortinfo(this.sorts).then(res => {
        this.dialogaddsort = false
        this.$message({
          type: 'success',
          message: res.data.message,
          center: true
        });
      }).catch(error => {
        this.$message({
          message: '编辑分类信息失败!',
          type: 'error',
          center: true
        });
      })
    },
    //点击删除
    copyTask(num) {
      let sort = this.sortList[num]
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          'id': sort.id
        }
        deleteSort(data).then(res => {
          this.$message({
            type: 'success',
            message: res.data.message,
            center: true
          });
          this.handleFilter()
        }).catch(error => {
          this.$message({
            type: 'error',
            message: '删除失败！',
            center: true
          });
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
      getSortinfo(this.listQuery).then(res => {
        let { data } = res
        if (data.code == 200) {
          this.isShowList = true
          Indicator.close()
          if (query == 1) {
            let newsortList = this.sortList.concat(data.data.data)
            if (data.data.data == '') {
              this.$message({
                type: 'error',
                message: '没有更多分类！',
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
                message: '没有更多分类！',
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
            message: '没有更多分类！',
            center: true
          });
        }
      }).catch(error => {
        this.isShowList = false
        this.sortList = []
        Indicator.close()
        this.$message({
          type: 'error',
          message: '没有更多分类！',
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
  background: white;
  color: rgb(140,140,140);
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}
.sortContentWrpa {
  width: 100%;
  display: flex;
  padding: 40px 0;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.subWrap {
  width: 90%;
  padding: 50px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
