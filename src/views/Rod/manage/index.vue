<template>
  <div class="app-container">
    <div class="top">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="一体杆名称:">
          <el-input
            v-model="formInline.poleName"
            size="mini"
            placeholder="请输入一体杆名称"
          />
        </el-form-item>
        <el-form-item label="一体杆编号:">
          <el-input
            v-model="formInline.poleNumber"
            size="mini"
            placeholder="请输入一体杆编号"
          />
        </el-form-item>
        <el-form-item label="运行状态">
          <el-select
            v-model="formInline.poleStatus"
            placeholder="请选择运行状态"
            size="mini"
          >
            <el-option label="全部" value="2" />
            <el-option label="正常" value="0" />
            <el-option label="异常" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            @click="
              search(
                formInline.poleName,
                formInline.poleNumber,
                formInline.poleStatus
              )
            "
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-button
      type="primary"
      size="mini"
      style="margin-top: 20px"
      @click="open"
    >添加一体杆</el-button>
    <el-button
      size="mini"
      style="margin-top: 20px"
      @click="deletePole"
    >批量删除</el-button>

    <!-- 一体杆表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="getSelectChange"
    >
      <el-table-column type="selection" />
      <el-table-column type="index" label="序号" />
      <el-table-column prop="poleName" label="一体杆名称" />
      <el-table-column prop="poleNumber" label="一体杆编号" />
      <el-table-column prop="poleIp" label="一体杆IP" />
      <el-table-column prop="areaName" label="安装区域" />
      <el-table-column prop="poleType" label="一体杆类型">
        <template v-slot="{ row }">
          <span>{{ row.poleType == "entrance" ? "入口" : "出口" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="poleStatus" label="运行状态">
        <template v-slot="{ row }">
          <span>{{ row.poleStatus == "0" ? "正常" : "异常" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="float: right">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleCurrentChange"
        @current-change="changePage"
      />
    </div>
    <!-- 添加&&编辑模态框 -->
    <el-dialog
      :title="id ? '编辑一体杆' : '添加一体杆'"
      :visible.sync="dialogVisible"
      @close="close"
    >
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item label="一体杆名称" prop="poleName">
          <el-input
            v-model="form.poleName"
            size="mini"
            placeholder="请输入一体杆名称"
          />
        </el-form-item>
        <el-form-item label="一体杆编号" prop="poleNumber">
          <el-input
            v-model="form.poleNumber"
            size="mini"
            placeholder="请输入一体杆编号"
          />
        </el-form-item>
        <el-form-item label="一体杆IP" prop="poleIp">
          <el-input
            v-model="form.poleIp"
            size="mini"
            placeholder="请输入一体杆IP"
          />
        </el-form-item>
        <el-form-item label="关联区域" prop="areaId">
          <el-select
            v-model="form.areaId"
            size="mini"
            placeholder="请选择关联区域"
            style="width: 100%"
          >
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.areaName"
              :value="item.areaId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="一体杆类型" prop="poleType">
          <el-select
            v-model="form.poleType"
            size="mini"
            placeholder="请选择一体杆类型"
            style="width: 100%"
          >
            <el-option label="入口" value="entrance" />
            <el-option label="出口" value="export" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="confirmAdd"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPoleListApi,
  addPoleApi,
  getRuleListApi,
  editPoleApi,
  deletePoleApi
} from '@/api/manage'

export default {
  data() {
    return {
      formInline: {
        poleName: '',
        poleNumber: '',
        poleStatus: ''
      },
      // 添加form
      form: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: '',
        poleType: ''
      },
      rules: {
        poleName: [
          { required: true, message: '请输入杆号名称', trigger: 'blur' }
        ],
        poleNumber: [
          { required: true, message: '请输入杆号编号', trigger: 'blur' }
        ],
        poleIp: [{ required: true, message: '请输入杆号IP', trigger: 'blur' }],
        areaId: [
          { required: true, message: '请选择关联区域', trigger: 'change' }
        ],
        poleType: [
          { required: true, message: '请选择杆号类型', trigger: 'change' }
        ]
      },
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      list: [],
      flag: false,
      id: null
    }
  },
  created() {
    this.getPoleList()
    this.getRuleList()
  },
  methods: {
    // 一体杆列表渲染
    async getPoleList() {
      const res = await getPoleListApi({
        poleName: this.formInline.poleName,
        poleNumber: this.formInline.poleNumber,
        poleStatus: this.formInline.poleStatus,
        page: this.page,
        pageSize: this.pageSize
      })
      console.log('杆', res)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    changePage(val) {
      this.page = val
      this.getPoleList()
    },
    handleCurrentChange(val) {
      this.pageSize = val
      this.getPoleList()
    },
    // 打开模态框
    open() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
      this.$refs.form.resetFields()
      this.id = null
      console.log(this.id)
    },
    // 确认
    confirmAdd() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          if (this.id) {
            delete this.form.areaName
            delete this.form.poleStatus
            await editPoleApi(this.form)
            this.$message.success('编辑成功')
          } else {
            this.flag = false
            const res = await addPoleApi(this.form)
            console.log('添加', res)
            this.$message.success('添加成功')
          }
          this.close()
          this.getPoleList()
        }
      })
    },
    // 区域列表
    async getRuleList() {
      const res = await getRuleListApi()
      console.log('区域', res)
      this.list = res.data
    },
    // 编辑回填
    async handleEdit(row) {
      this.flag = true
      this.dialogVisible = true
      this.id = row.id
      this.form = JSON.parse(JSON.stringify(row))
      const res = await getPoleListApi(row)
      console.log('idd', res)
    },
    // 删除
    handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await deletePoleApi(id)
          this.$message.success('删除成功', res)
          this.getPoleList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 获取复选框选中的数据
    getSelectChange(data) {
      console.log('data=>', data)
      const ids = data.map((item) => item.id)
      this.deleteParams = ids.join()
    },
    // 批量删除
    async deletePole() {
      if (!this.deleteParams) {
        return this.$message.info('请选择要删除的数据')
      }
      this.handleDelete(this.deleteParams)
    },
    // 搜索
    search() {
      this.getPoleList()
    }
  }
}
</script>
<style lang="scss" scoped>
.top {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #ccc;
}
</style>
