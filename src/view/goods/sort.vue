<template>
  <div class="loginWrap" @scroll="handleFilterScrloo">
    <div class="goBack" @click="$router.go(-1)">< 返回</div>
    <div class="sortContentWrpa">
      <div class="subWrap">
        <el-input v-model="listQuery.name" placeholder="请输入分类名称" style="width: 250px;" @keyup.enter.native="handleFilter"/>
        <el-button type="success" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </div>
      <div class="sortListWrap" v-for="(item,index) in sortList">
        <div class="sortListB">
          <span class="sortListSp">{{ item.name }}</span>
          <div class="myBtn" @click="addsort(1,index)">编辑</div>
        </div>
        <div class="sortListBr"></div>
        <div class="sortListB">
          <span class="sortListSp">{{ item.remark }}</span>
          <div class="myBtn" style="background:#191970;" @click="copyTask(index)">删除</div>
        </div>
      </div>
    </div>
    <div class="addSortbtWrap">
      <el-button style="width:90%;" class="filter-item" type="primary" icon="el-icon-edit" @click="addsort(0)">添加分类</el-button>
    </div>
    <el-dialog :visible.sync="dialogaddsort" title="添加分类">
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
          type: 'warning'
        });
        return
      }
      if (this.sortType == 0) {
        addSort(this.sorts).then(res => {
          let { data } = res
          if (data.code == 200) {
            this.$message({
              message: '恭喜您！添加成功！',
              type: 'success'
            });
            this.dialogaddsort = false
          } else {
            this.$message.error('对不起！添加失败！')
            this.dialogaddsort = false
          }
        }).catch(error => {
          this.$message.error('对不起！添加失败！')
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
          message: res.data.message
        });
      }).catch(error => {
        this.$message('编辑分类信息失败!')
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
      getSortinfo(this.listQuery).then(res => {
        let { data } = res
        if (data.code == 200) {
          Indicator.close()
          if (query == 1) {
            let newsortList = this.sortList.concat(data.data.data)
            if (data.data.data == '') {
              this.$message('没有更多分类!')
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

}
.dialog_div{
  padding: 10px 0;
}
.dialog_sp {
  margin-bottom: 10px;
  display: inline-block;
}
</style>
