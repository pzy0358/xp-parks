<template>
  <div class="app-container">
    <div class="top">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="员工姓名:">
          <el-input
            v-model="formInline.name"
            size="mini"
            placeholder="请输入员工姓名"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="search(formInline.name)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button
      type="primary"
      size="mini"
      style="margin-top: 20px"
      @click="open"
    >添加员工</el-button>

    <!-- 员工表格 -->
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="员工姓名" />
      <el-table-column prop="userName" label="登录账号" />
      <el-table-column prop="phonenumber" label="联系方式" />
      <el-table-column prop="roleName" label="角色" />
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <span>{{ row.status == 0 ? "禁用" : "启用" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button size="mini" type="text" @click="edit(row)">编辑</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(row.id)"
          >删除</el-button>
          <el-button size="mini" type="text" @click="reserve(row.id)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="float: right">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total,  prev, pager, next,sizes"
        :total="total"
        @size-change="handleCurrentChange"
        @current-change="changePage"
      />
    </div>
    <!-- 添加编辑员工模态框 -->
    <el-dialog
      :title="id ? '编辑员工' : '添加员工'"
      :visible.sync="dialogFormVisible"
      @close="close"
    >
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <el-form-item label="员工姓名" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请填写员工姓名"
            size="small"
          />
        </el-form-item>
        <el-form-item label="登录账号" prop="userName">
          <el-input
            v-model="form.userName"
            placeholder="请填写登录账号"
            size="small"
          /> </el-form-item>默认密码：123456
        <el-form-item label="联系方式" prop="phonenumber">
          <el-input
            v-model="form.phonenumber"
            placeholder="请填写联系方式"
            size="small"
          />
        </el-form-item>
        <el-form-item label="分配角色" prop="roleId">
          <el-select
            v-model="form.roleId"
            placeholder="请选择分配角色"
            size="small"
            style="width: 100%"
          >
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getEmployeeListApi,
  delEmployeeApi,
  addEmployeeApi,
  getRoleListApi,
  editEmployeeApi,
  resetPasswordApi
} from '@/api/employee'
export default {
  data() {
    return {
      formInline: {
        name: ''
      },
      form: {
        name: '',
        userName: '',
        phonenumber: '',
        roleId: '',
        status: ['0', '1']
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'change' }
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      list: [],
      id: ''
    }
  },
  created() {
    this.getEmployeeList()
    this.getRoleList()
  },
  methods: {
    // 列表数据
    async getEmployeeList() {
      const res = await getEmployeeListApi({
        page: this.page,
        pageSize: this.pageSize,
        name: this.formInline.name
      })
      console.log('列表', res)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    changePage(val) {
      this.page = val
      this.getEmployeeList()
    },
    handleCurrentChange(val) {
      this.pageSize = val
      this.getEmployeeList()
    },
    // 删除
    handleDelete(id) {
      this.$confirm(
        '此操作将永久删除该员工，并且此账号无法登陆, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          const res = await delEmployeeApi(id)
          this.$message.success('删除成功', res)
          this.getEmployeeList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    open() {
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
      this.$refs.form.resetFields()
      this.id = null
      this.getEmployeeList()
    },
    // 角色下拉
    async getRoleList() {
      const res = await getRoleListApi()
      console.log('role', res)
      this.list = res.data
    },
    // 添加
    confirmAdd() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          if (this.id) {
            this.form.id = this.id
            delete this.form.createTime
            await editEmployeeApi(this.form)
            this.$message.success('编辑成功')
          } else {
            const res = await addEmployeeApi(this.form)
            this.$message.success('添加成功', res)
            console.log('+++', res)
          }
          this.close()
          this.getEmployeeList()
        }
      })
    },
    // 编辑回填
    async edit(row) {
      this.dialogFormVisible = true
      this.id = row.id
      this.form = { ...row }
      const res = await getEmployeeListApi()
      console.log('llll', res)
    },
    // 重置密码
    reserve(id) {
      this.$confirm('将密码重置为123456', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await resetPasswordApi({ id: id })
        this.$message.success('重置成功', res)
        this.getEmployeeList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },
    // 搜索
    search() {
      this.getEmployeeList()
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
