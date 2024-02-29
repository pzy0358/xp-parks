<template>
  <div class="app-container">
    <el-button
      type="primary"
      size="mini"
      @click="open"
    >增加停车计费规则</el-button>
    <!-- 计费表格 -->
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="ruleNumber" label="计费规则编号" />
      <el-table-column prop="ruleName" label="计费规则名称" />
      <el-table-column prop="freeDuration" label="免费时长(分钟)" />
      <el-table-column prop="chargeCeiling" label="收费上限(元)" />
      <el-table-column prop="chargeType" label="计费方式">
        <template v-slot="{ row }">
          <span>{{
            row.chargeType === "duration"
              ? "时长收费"
              : row.chargeType === "turn"
                ? "按次收费"
                : "分段收费"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ruleNameView" label="计费规则" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="edit(row.id)">编辑</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right">
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="ChangePage"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 添加计费规则模态框 -->
    <el-dialog
      :title="flag ? '修改计费规则' : '添加计费规则'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-form-item label="计费规则编号" prop="ruleNumber">
          <el-input
            v-model="ruleForm.ruleNumber"
            size="small"
            placeholder="请输入计费规则编号"
          />
        </el-form-item>
        <el-form-item label="计费规则名称" prop="ruleName">
          <el-input
            v-model="ruleForm.ruleName"
            size="small"
            placeholder="请输入计费规则名称"
          />
        </el-form-item>
        <el-form-item label="计费方式(全天收费)" prop="chargeType">
          <el-radio-group v-model="ruleForm.chargeType">
            <el-radio label="duration" border>时长收费</el-radio>
            <el-radio label="turn" border>按次收费</el-radio>
            <el-radio label="partition" border>分段收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="time">
          <el-form-item label="免费时长" prop="freeDuration">
            <el-input-number
              v-model="ruleForm.freeDuration"
              controls-position="right"
              :min="1"
              placeholder="请输入免费时长"
              size="small"
              style="width: 180px"
            />分钟
          </el-form-item>
          <el-form-item label="收费上限" prop="chargeCeiling">
            <el-input
              v-model="ruleForm.chargeCeiling"
              placeholder="请输入收费上限"
              size="small"
              style="width: 180px"
            />元
          </el-form-item>
        </div>
        <el-form-item label="计费规则" prop="chargeType">
          <!-- 按时长收费区域 -->
          <div v-if="ruleForm.chargeType == 'duration'">
            <!-- 时长收费 -->
            每
            <el-input
              v-model="ruleForm.durationTime"
              class="input-box"
              placeholder="请输入"
              size="small"
              style="width: 20%"
            />
            <el-select
              v-model="ruleForm.durationType"
              placeholder="请选择"
              size="small"
              style="width: 25%; padding-left: 5px"
            >
              <el-option label="小时" value="hour" />
              <el-option label="分钟" value="minute" />
            </el-select>
            <el-input
              v-model="ruleForm.durationPrice"
              placeholder="请输入"
              size="small"
              style="width: 20%; padding-left: 5px"
            />
            元
          </div>
          <!-- 按时长收费区域 -->
          <div v-else-if="ruleForm.chargeType == 'turn'">
            <!-- 按次收费 -->
            每次
            <el-input
              v-model="ruleForm.turnPrice"
              placeholder="请输入金额"
              size="small"
              style="width: 40%"
            />
            元
          </div>
          <div v-else>
            <!-- 分段收费 -->
            <div class="item">
              <el-input
                v-model="ruleForm.partitionFrameTime"
                size="small"
                placeholder="请输入"
                style="width: 25%"
              />小时内,每小时收费
              <el-input
                v-model="ruleForm.partitionFramePrice"
                placeholder="请输入"
                size="small"
                style="width: 25%"
              />
              元
            </div>
            <div class="item">
              每增加<el-input
                v-model="ruleForm.partitionIncreaseTime"
                size="small"
                placeholder="请输入"
                style="width: 25%"
              />小时,增加<el-input
                v-model="ruleForm.partitionIncreasePrice"
                placeholder="请输入"
                size="small"
                style="width: 25%"
              />
              元
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRuleApi,
  deleteRuleApi,
  addRuleApi,
  UpdateRuleApi,
  getUpdateRuleApi
} from '@/api/billing'
export default {
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      ruleForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: '',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱
      },
      rules: {
        ruleNumber: [
          { required: true, message: '请输入计费规则编号', trigger: 'blur' }
        ],
        ruleName: [
          { required: true, message: '请输入计费规则名称', trigger: 'blur' }
        ],
        chargeType: [
          { required: true, message: '请选择计费方式', trigger: 'change' }
        ],
        durationTime: [
          { required: true, message: '请选择计费时间', trigger: 'change' }
        ]
      },
      id: null,
      flag: false
    }
  },
  created() {
    this.getRuleList()
  },
  methods: {
    async getRuleList() {
      const res = await getRuleApi({
        page: this.page,
        pageSize: this.pageSize
      })
      console.log('rule', res)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    ChangePage(page) {
      console.log(111)
      this.page = page
      this.getRuleList()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getRuleList()
    },
    async del(id) {
      await deleteRuleApi(id)
      this.$confirm('此操作将永久删除当前计费规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.getRuleList()
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
    open() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
      this.id = null
    },
    // 添加
    confirmAdd() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (valid) {
          if (this.id) {
            console.log(this.id)
            await getUpdateRuleApi(this.ruleForm)
            this.$message.success('编辑成功')
          } else {
            this.flag = false
            await addRuleApi(this.ruleForm)
            this.$message.success('添加成功')
          }
          // const res = await addRuleApi(this.ruleForm)
          // console.log('添加', res)

          this.close()
          this.getRuleList()
        }
      })
    },
    // 编辑回填
    async edit(id) {
      this.flag = true
      this.id = id
      this.dialogVisible = true
      const res = await UpdateRuleApi(id)
      console.log(res)
      this.ruleForm = res.data
    },
    handleClose() {
      // this.$refs.ruleForm.resetFields()
      this.close()
      this.id = null
    }

  }
}
</script>
<style lang="scss" scoped>
.time {
  width: 100%;
  display: flex;
  justify-content: left;
}
</style>
