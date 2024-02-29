<template>
  <div class="app-container">
    <div class="form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="车牌号码:">
          <el-input v-model="formInline.carNumber" placeholder="请输入车牌号码" />
        </el-form-item>
        <el-form-item label="缴纳状态">
          <el-select v-model="formInline.paymentStatus" placeholder="请选择">
            <el-option label="全部" value="2" />
            <el-option label="待缴纳" value="0" />
            <el-option label="已缴纳" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search(formInline.paymentStatus,formInline.carNumber)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 缴费表格 -->
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="carNumber" label="车牌号码" />
      <el-table-column prop="chargeType" label="收费类型">
        <template v-slot="{ row }">
          <span>{{ row.chargeType == "card" ? "月卡" : "临时停车" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="parkingTime" label="停车总时长" />
      <el-table-column prop="actualCharge" label="缴纳费用(元)" />
      <el-table-column prop="paymentStatus" label="缴纳状态">
        <template v-slot="{ row }">
          <span>{{ row.paymentStatus == 0 ? "未缴纳" : "已缴纳" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="缴纳方式">
        <template v-slot="{ row }">
          <span>{{
            row.paymentMethod == "Alipay"
              ? "支付宝"
              : row.paymentMethod == "WeChat"
                ? "微信"
                : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentTime" label="缴纳时间" />
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
  </div>
</template>

<script>
import { getPayListApi } from '@/api/pay'
export default {
  data() {
    return {
      formInline: {
        carNumber: '',
        paymentStatus: ''
      },
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getPayList()
  },
  methods: {
    async getPayList() {
      const res = await getPayListApi({
        page: this.page,
        pageSize: this.pageSize,
        ...this.formInline
      })
      console.log('列表', res)
      this.tableData = res.data.rows
      this.total = res.data.total
      this.formInline.carNumber = res.data.rows.carNumber
      this.formInline.paymentStatus = res.data.rows.paymentStatus
    },
    ChangePage(page) {
      console.log(111)
      this.page = page
      this.getPayList()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getPayList()
    },
    search(carNumber, paymentStatus) {
      this.carNumber = carNumber
      this.paymentStatus = paymentStatus
      this.getPayList()
    }
  }
}
</script>
<style></style>
