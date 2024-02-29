<template>
  <div class="app-container">
    <div class="form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="企业名称:">
          <el-input
            v-model="formInline.name"
            placeholder="请输入企业名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button v-auth-btn="'park:enterprise:add'" class="add" type="primary">添加企业</el-button>
    </div>

    <!-- 表格  -->
    <el-table :data="tableData" style="width: 100%; margin-top: 90px">
      <el-table-column type="index" label="序号" />
      <el-table-column type="expand">

        <el-table
          :data="tableList"
          label-position="left"
          inline
          class="demo-table-expand"
        >

          <el-table-column prop="buildingName" label="租凭楼宇" />
          <el-table-column prop="" label="租凭起止时间" />
          <el-table-column prop="" label="合同状态" />
          <el-table-column prop="" label="操作" />
        </el-table>
      </el-table-column>
      <el-table-column label="企业名称" prop="name" />
      <el-table-column label="联系人" prop="contact" />
      <el-table-column label="联系电话" prop="contactNumber" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text">添加合同</el-button>
          <el-button type="text">查看</el-button>
          <el-button v-auth-btn="'park:enterprise:edit'" type="text">编辑</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @current-change="changePage"
    />
  </div>
</template>

<script>
import { EnterApi, LookEnterApi, DelEnterApi } from '@/api/enterprise'
export default {
  data() {
    return {
      formInline: {
        name: ''
      },
      tableData: [],
      tableList: [],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getTable()
    this.getEnter()
  },
  methods: {
    // 搜索
    async search() {
      const res = await EnterApi({
        name: this.formInline.name,
        page: this.page,
        pageSize: this.pageSize
      })
      console.log('ss', res)
      this.tableData = res.data.rows
    },
    changePage(page) {
      this.page = page
      this.getTable()
    },
    async getTable() {
      const res = await EnterApi({
        page: this.page,
        pageSize: this.pageSize
      })
      console.log('表格数据==>', res)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    // 获取企业下拉
    async getEnter() {
      const res = await LookEnterApi({ id: 1 })
      console.log('企业下拉', res)
      this.tableList = res.data
    },
    // 删除企业
    async del(id) {
      await DelEnterApi(id)
      this.$confirm('此操作将永久删企业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.getTable()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  height: 60px;
  border-bottom: 1px solid #ccc;
}

.add {
  margin-top: 10px;
}
</style>
