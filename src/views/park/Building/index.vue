<template>
  <div class="app-container">
    <div class="form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="楼宇名称:">
          <el-input v-model="formInline.name" placeholder="请输入楼宇名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button v-auth-btn="'park:building:add'" class="add" type="primary" @click="open">添加楼宇</el-button>
    </div>

    <!-- 表格  -->
    <el-table :data="tableData" style="width: 100%; margin-top: 90px">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="楼宇名称" />
      <el-table-column prop="floors" label="层数" />
      <el-table-column prop="area" label="在管面积（m²）" />
      <el-table-column prop="propertyFeePrice" label="物业费（元/m²）" />
      <el-table-column label="状态">
        <template v-slot="{ row }" prop="status">
          <span>{{ row.status == 1 ? "已入住" : "空置中" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="edit(row)">编辑</el-button>
          <el-button v-auth-btn="'park:building:remove'" type="text" @click="del(row.id)">删除</el-button>
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

    <!-- 添加模态框 -->
    <el-dialog title="添加楼宇" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="楼宇名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入楼宇名称" />
        </el-form-item>
        <el-form-item label="楼宇层数" prop="floors">
          <el-input v-model="ruleForm.floors" placeholder="请输入楼宇层数" />
        </el-form-item>
        <el-form-item label="在管面积" prop="area">
          <el-input v-model="ruleForm.area" placeholder="请输入再管面积">
            <template slot="append">m²</template>
          </el-input>
        </el-form-item>
        <el-form-item label="物业费" prop="propertyFeePrice">
          <el-input v-model="ruleForm.propertyFeePrice" placeholder="请输入物业费">
            <template slot="append">m²</template>
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑模态框 -->
    <el-dialog title="修改楼宇" :visible.sync="dialogVisible1" width="40%">
      <el-form ref="form" :model="form" :rules="rules1" label-width="100px" class="demo-form" label-position="top">
        <el-form-item label="楼宇名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入楼宇名称" />
        </el-form-item>
        <el-form-item label="楼宇层数" prop="floors">
          <el-input v-model="form.floors" placeholder="请输入楼宇层数" />
        </el-form-item>
        <el-form-item label="在管面积" prop="area">
          <el-input v-model="form.area" placeholder="请输入再管面积">
            <template slot="append">m²</template>
          </el-input>
        </el-form-item>
        <el-form-item label="物业费" prop="propertyFeePrice">
          <el-input v-model="form.propertyFeePrice" placeholder="请输入物业费">
            <template slot="append">m²</template>
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  BuildingApi,
  AddBuildingApi,
  DeleteBuildingApi,
  UpdateBuildingApi,
  SeBuildingApi
} from '@/api/building'
export default {
  data() {
    return {
      formInline: {
        name: ''
      },
      ruleForm: {
        name: '',
        floors: '',
        area: '',
        propertyFeePrice: ''
      },
      form: {
        name: '',
        floors: '',
        area: '',
        propertyFeePrice: ''
      },
      rules: {
        name: [{ required: true, message: '请输入楼宇名称', trigger: 'blur' }],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' },
          { min: 1, max: 20, message: '楼层最多20层', trigger: 'blur' }
        ],
        area: [{ required: true, message: '请输入在管面积', trigger: 'blur' }],
        propertyFeePrice: [
          { required: true, message: '请输入物业费', trigger: 'blur' }
        ]
      },
      rules1: {
        name: [{ required: true, message: '请输入楼宇名称', trigger: 'blur' }],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' },
          { max: 20, message: '楼层最多20层', trigger: 'blur' }
        ],
        area: [{ required: true, message: '请输入在管面积', trigger: 'blur' }],
        propertyFeePrice: [
          { required: true, message: '请输入物业费', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      dialogVisible1: false,
      tableData: [],
      arr: [],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },

  created() {
    this.getTableData()
  },
  methods: {
    // 搜索
    async search() {
      const res = await SeBuildingApi({
        name: this.formInline.name,
        page: this.page,
        pageSize: this.pageSize
      })
      console.log('搜索', res)
      this.tableData = res.data.rows
      // this.getTableData()
    },
    // 分页
    changePage(page) {
      this.page = page
      this.getTableData()
    },
    // 获取表格数据
    async getTableData() {
      const res = await BuildingApi({
        page: this.page,
        pageSize: this.pageSize
      })
      console.log('res==>', res)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    open() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
      this.dialogVisible1 = false
      this.ruleForm = {}
    },
    confirmAdd() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          const res = await AddBuildingApi(this.ruleForm)
          console.log('添加', res)
          this.$message.success('添加楼宇成功')
          this.close()
          this.getTableData()
          this.page = 1
        }
      })
    },
    async del(id) {
      await DeleteBuildingApi(id)
      this.$confirm('此操作将永久删除楼宇, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.getTableData()
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
    },
    edit(obj) {
      this.dialogVisible1 = true
      delete obj.status
      this.form = { ...obj }
    },
    // 编辑方法
    handleConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const res = await UpdateBuildingApi(this.form)
          console.log('修改', res)
          this.close()
          this.getTableData()
          this.$message.success('修改成功')
        }
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
