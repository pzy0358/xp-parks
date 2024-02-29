<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="(item, index) in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{ active: index === activeIndex }"
        @click="changeRole(index, item.roleId)"
      >
        <div class="role-info">
          <svg-icon
            :icon-class="index === activeIndex ? 'user-active' : 'user'"
            class="icon"
            @click="changeRole(idx)"
          />
          {{ item.roleName }}
        </div>
        <div class="more">
          <i class="el-icon-more" />
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/System/add')">添加角色</el-button>
    </div>
    <div class="right-wrapper">
      <div class="tree-wrapper">
        <el-tabs v-model="activeName" style="width: 150vh">
          <el-tab-pane label="功能权限" name="first">
            <div style="display: flex">
              <div v-for="item in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="tree"
                  :props="{ label: 'title' }"
                  :data="item.children"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="'成员(' + tableData.length + ')'" name="second">
            <el-table
              ref="singleTable"
              :data="tableData"
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column type="index" label="序号" />
              <el-table-column prop="name" label="员工姓名" />
              <el-table-column prop="userName" label="登录账号" />
            </el-table>
            <!-- 分页 -->
            <div style="float: right">
              <el-pagination
                :current-page="page.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="page.pageSize"
                layout="total,  prev, pager, next,sizes"
                :total="total"
                @size-change="handleCurrentChange"
                @current-change="changePage"
              />
            </div>
          </el-tab-pane>
        </el-tabs>

      </div>
    </div>
  </div>
</template>

<script>
import {
  getRoleListApi,
  getTreeListApi,
  getPermissionListApi,
  getUserListApi
} from '@/api/permission'
export default {
  data() {
    return {
      roleList: [],
      activeIndex: 0,
      treeList: [],
      activeName: 'first',
      perms: [],
      tableData: [],
      total: 0,
      page: {
        page: 1,
        pageSize: 10
      },
      roleId: 2
    }
  },
  created() {
    this.getRoleList()
    this.getTreeList()
    this.getPermissionList(2)
  },
  methods: {
    async getRoleList() {
      const res = await getRoleListApi()
      this.roleList = res.data
      this.getPermissionList(res.data[0].roleId)
      this.getUserList(res.data[0].roleId)
    },
    // 切换角色
    changeRole(idx, roleId) {
      this.activeIndex = idx
      this.getPermissionList(roleId)
      this.getUserList(roleId)
      this.roleId = roleId
    },
    // tree列表
    async getTreeList() {
      const res = await getTreeListApi()
      this.treeList = res.data
    },
    // 权限高亮
    async getPermissionList(roleId) {
      const res = await getPermissionListApi(roleId)
      this.perms = res.data.perms
      // console.log("res====>", res);

      const tree = this.$refs.tree
      tree.forEach((tree, index) => {
        // console.log(this.perms[index]);
        tree.setCheckedKeys(this.perms[index])
      })
    },
    // 获取关联列表
    async getUserList(roleId) {
      console.log(this.roleId, '890')
      const res = await getUserListApi(this.roleId, this.page)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    changePage(val) {
      this.page.page = val
      this.getUserList(this.roleId)
    },
    handleCurrentChange(val) {
      this.page.pageSize = val
      this.getUserList(this.roleId)
    }
  }
}
</script>
<style lang="scss" scoped>
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding: 20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn {
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      // display: flex;
      justify-content: space-around;
      width: 100%;
      flex: 5;
      .tree-item {
        width: 26%;
        flex: 1;
        border-right: 1px solid #e4e7ec;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper {
      padding: 20px;
    }
  }
}
</style>
