<template>
  <div class="app-container">
    <el-button type="primary" @click="addArea">添加区域</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="areaName" label="区域名称" />
      <el-table-column prop="spaceNumber" label="车位数（个）" />
      <el-table-column prop="areaProportion" label="面积（m²）" />
      <el-table-column label="计费规则" prop="ruleName">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.hoverRuleName" placement="top">
            <span>{{ scope.row.ruleName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="edit(row)">编辑</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="changePage"
      />
    </div>
    <!-- 添加区域模态框 -->
    <el-dialog title="添加区域" :visible.sync="dialogVisible" width="60%">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-position="top"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="ruleForm.areaName" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="车位数（个）" prop="spaceNumber">
          <el-input
            v-model="ruleForm.spaceNumber"
            placeholder="请输入车位个数"
          />
        </el-form-item>
        <el-form-item label="面积（m²）" prop="areaProportion">
          <el-input v-model="ruleForm.areaProportion" placeholder="请输入面积">
            <template slot="append">m²</template>
          </el-input>
        </el-form-item>
        <el-form-item label="关联计费规则" prop="ruleId">
          <el-select
            v-model="ruleForm.ruleId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.ruleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="ruleForm.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑区域模态框 -->
    <el-dialog title="编辑区域" :visible.sync="dialogVisible1" width="60%">
      <el-form
        ref="ruleForm1"
        :model="ruleForm1"
        :rules="rules"
        label-position="top"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="区域名称" prop="areaName">
          <el-input v-model="ruleForm1.areaName" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="车位数（个）" prop="spaceNumber">
          <el-input
            v-model="ruleForm1.spaceNumber"
            placeholder="请输入车位个数"
          />
        </el-form-item>
        <el-form-item label="面积（m²）" prop="areaProportion">
          <el-input v-model="ruleForm1.areaProportion" placeholder="请输入面积">
            <template slot="append">m²</template>
          </el-input>
        </el-form-item>
        <el-form-item label="关联计费规则" prop="ruleId">
          <el-select
            v-model="ruleForm1.ruleId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.ruleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="ruleForm1.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="conformEdit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAreaListApi,
  deleteAreaApi,
  addAreaApi,
  UpdateAreaApi,
  getRuleListApi
} from '@/api/area'
export default {
  data() {
    return {
      list: [],
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      dialogVisible1: false,
      ruleForm: {
        areaName: '',
        areaProportion: '',
        spaceNumber: '',
        ruleId: null,
        remark: ''
      },
      ruleForm1: {
        areaName: '',
        areaProportion: '',
        spaceNumber: '',
        ruleId: null,
        remark: ''
      },
      rules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        areaProportion: [
          { required: true, message: '请输入面积', trigger: 'blur' }
        ],
        spaceNumber: [
          { required: true, message: '请输入车位数量', trigger: 'blur' }
        ],
        ruleName: [
          { required: true, message: '请选择关联计费规则', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getAreaList()
    this.getRule()
  },
  methods: {
    // 分页
    changePage(page) {
      this.page = page
      this.getAreaList()
    },
    async getAreaList() {
      const res = await getAreaListApi({
        page: this.page,
        pageSize: this.pageSize
      })
      console.log('area', res)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    // 区域列表接口
    async getRule() {
      const res = await getRuleListApi()
      console.log('liebiao', res)
      this.list = res.data.rows
    },
    // 删除区域
    async del(id) {
      await deleteAreaApi(id)
      this.$confirm('此操作将永久删除区域, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.getAreaList()
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
    addArea() {
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
          const res = await addAreaApi(this.ruleForm)
          console.log('++', res)
          this.close()
          this.getAreaList()
          this.page = 1
        }
      })
    },
    // 编辑
    edit(obj) {
      this.dialogVisible1 = true
      delete obj.ruleName
      delete obj.hoverRuleName
      this.ruleForm1 = { ...obj }
      console.log(this.ruleForm1)
    },
    // 编辑方法
    conformEdit() {
      this.$refs.ruleForm1.validate(async(valid) => {
        if (valid) {
          const res = await UpdateAreaApi(this.ruleForm1)
          console.log('修改', res)
          this.close()
          this.getAreaList()
        }
      })
    }
  }
}
</script>
<style></style>
