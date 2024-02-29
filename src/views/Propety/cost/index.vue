<template>
  <div class="app-container">
    <div class="top">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="企业名称:">
          <el-input
            v-model="formInline.enterpriseName"
            placeholder="请输入企业名称"
          />
        </el-form-item>
        <el-form-item label="缴费时间:">
          <el-date-picker
            v-model="formInline.time"
            type="daterange"
            range-separator="→"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button
      type="primary"
      size="mini"
      style="margin-top: 20px"
      @click="addOrd"
    >添加账单</el-button>

    <!-- 表格 -->
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="billNumber" label="账单编号" />
      <el-table-column prop="enterpriseName" label="企业名称" />
      <el-table-column prop="buildingName" label="租赁楼宇" />
      <el-table-column prop="propertyFeePrice" label="物业费（元/m²）" />
      <el-table-column prop="paymentAmount" label="账单金额（元）" />
      <el-table-column prop="createTime" label="缴费时间" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="look(row.id)">查看</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
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
    <!-- 添加模态框 -->
    <el-dialog
      title="添加账单"
      :visible.sync="dialogFormVisible"
      style="width: 70%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="top"
        style="padding-left: 80px"
      >
        <el-form-item label="选择租户" prop="enterpriseId">
          <el-select
            v-model="form.enterpriseId"
            placeholder="请选择租户"
            size="small"
            style="width: 60%"
          >
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="租赁楼宇" prop="buildingId">
          <el-select
            v-model="form.buildingId"
            placeholder="请选择租赁楼宇"
            size="small"
            style="width: 60%"
          >
            <el-option
              v-for="item in building"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="缴费周期" prop="time">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="→"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="small"
            style="width: 60%"
            @change="changeTime"
          />
        </el-form-item>
        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input
            v-model="form.paymentAmount"
            placeholder="请输入支付金额"
            disabled
            size="small"
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select
            v-model="form.paymentMethod"
            placeholder="请选择支付方式"
            size="small"
            style="width: 60%"
          >
            <el-option label="微信" value="1" />
            <el-option label="支付宝" value="2" />
            <el-option label="现金" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情模态框 -->
    <el-dialog title="查看账单详情" :visible.sync="dialogVisible">
      <div class="a">
        <span>租户名称:</span><span class="b">{{ lookList.enterpriseName }} </span>
      </div>
      <div class="a">
        <span>租赁楼宇:</span><span class="b">{{ lookList.buildingName }} </span>
      </div>
      <div class="a">
        <span>缴费周期: </span><span class="b">{{ lookList.startTime }}至{{ lookList.endTime }}</span>
      </div>
      <div class="a">
        <span>物业费（元/m²）: </span><span class="b">{{ lookList.propertyFeePrice }} </span>
      </div>
      <div class="a">
        <span>账单金额（元）: </span><span class="b">{{ lookList.paymentAmount }} </span>
      </div>
      <div class="a">
        <span>支付方式: </span><span class="b">{{ lookList.paymentMethod }}</span>
      </div>
      <div class="a">
        <span>缴费时间: </span><span class="b">{{ lookList.createTime }}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCostListApi,
  delCostApi,
  GetSearchApi,
  addCostApi,
  getBuildingApi,
  getPriceApi,
  getViewAllApi,
  LookOrdApi
} from '@/api/cost'
export default {
  data() {
    return {
      formInline: {
        enterpriseName: '',
        time: ''
      },
      form: {
        paymentMethod: '',
        paymentAmount: '',
        enterpriseId: '',
        buildingId: '',
        startTime: '',
        endTime: ''
      },
      time: [],
      rules: {
        enterpriseId: [
          { required: true, message: '请输入企业名称', trigger: 'change' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        paymentAmount: [
          { required: true, message: '请输入支付金额', trigger: 'blur' }
        ],
        buildingId: [
          { required: true, message: '请选择租赁楼宇', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择缴费周期', trigger: 'change' }
        ]
      },
      dialogFormVisible: false,
      dialogVisible: false,
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      list: [],
      building: [],
      lookList: {}
    }
  },

  created() {
    this.getCostList()
    this.getZuList()
    this.getBuilding()
  },
  methods: {
    // 搜索
    async search() {
      const res = await GetSearchApi({
        start: this.formInline.time ? this.formInline.time[0] : '',
        end: this.formInline.time ? this.formInline.time[1] : '',
        enterpriseName: this.formInline.enterpriseName,
        page: this.page,
        pageSize: this.pageSize
      })
      console.log('搜搜', res)
      this.tableData = res.data.rows
      // this.getCostList()
    },
    async getCostList() {
      const res = await getCostListApi({
        page: this.page,
        pageSize: this.pageSize
      })
      console.log('表格', res)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    async del(id) {
      await delCostApi(id)
      this.$confirm('此操作将永久删除该账单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.getCostList()
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
    changePage(val) {
      this.page = val
      this.getCostList()
    },
    handleCurrentChange(val) {
      this.pageSize = val
      this.getCostList()
    },
    addOrd() {
      this.dialogFormVisible = true
    },
    // 租户下拉
    async getZuList() {
      const res = await getViewAllApi()
      this.list = res.data
    },
    // 楼宇下拉
    async getBuilding() {
      const res = await getBuildingApi()
      console.log('楼宇', res)
      this.building = res.data
    },
    close() {
      this.dialogFormVisible = false
    },
    // 确认添加
    confirmAdd() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const res = await addCostApi(this.form)
          console.log('1111111111111', res)
          this.dialogFormVisible = false
          this.$message.success('添加成功')
          this.getCostList()
        }
      })
    },
    async changeTime() {
      this.form.startTime = this.time[0]
      this.form.endTime = this.time[1]
      const res = await getPriceApi({
        buildingId: this.form.buildingId,
        startTime: this.form.startTime,
        endTime: this.form.endTime
      })
      this.form.paymentAmount = res.data
    },
    async look(id) {
      this.dialogVisible = true
      const res = await LookOrdApi(id)
      console.log('查看详情', res)
      this.lookList = res.data
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
.a{
  margin-top: 30px;
  color: #ccc;
  font-size: 15px;
  margin-left: 50px;
}
.b{
  color: #666;
  margin-left: 20px;
}
</style>
