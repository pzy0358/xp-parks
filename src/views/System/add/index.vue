<template>
  <div class="addPer">
    <div class="header">
      <el-page-header content="添加角色" @back="goBack" />
      <div class="user-name">{{ name }}</div>
    </div>
    <div class="center">
      <div class="left">
        <el-steps direction="vertical" :active="active" style="padding: 5px;">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div class="right">
        <!-- 角色信息 -->
        <div v-if="active==1">
          <p style="border-left: 3px solid blue;">角色信息</p>
          <el-form ref="form" :model="form" :rules="rules" label-position="left" style="margin-left: 40px;">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入" size="small" style="width: 80%;" />
            </el-form-item>
            <el-form-item label="角色描述" prop="desc">
              <el-input v-model="form.desc" type="textarea" placeholder="请输入" size="small" style="width: 80%;" />
            </el-form-item>
          </el-form>
        </div>
        <!-- 权限信息 -->
        <div v-else-if="active==2">
          <p style="border-left: 3px solid blue;">权限配置</p>
          <!-- 树形控件 -->
          <div class="tree">
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
        </div>
        <div v-else>确认信息</div>
      </div>
    </div>
    <div class="bottom">
      <el-button v-if="active==2||active==3" style="margin-top: 12px;" size="mini" @click="shang">上一步</el-button>
      <el-button v-if="active==1||active==2" style="margin-top: 12px;" type="primary" size="mini" @click="next">下一步</el-button>
      <el-button v-if="active==3" style="margin-top: 12px;" type="primary" size="mini">确定添加</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTreeListApi } from '@/api/permission'
export default {
  data() {
    return {
      active: 1,
      form: {
        roleName: '',
        desc: ''
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['name'])
    // username() {
    //   return this.$store.getters.name;
    // },
  },
  created() {
    this.getTreeList()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    next() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.roleName === '') {
            this.$message({
              message: '角色名称不能为空',
              type: 'warning'
            })
            return false
          }
        } else {
          console.log('error submit!!')
          return false
        }
        if (this.active++ > 2) this.active = 1
      })
    },
    shang() {
      if (this.active-- < 0) this.active = 1
    },
    // tree列表
    async getTreeList() {
      const res = await getTreeListApi()
      this.treeList = res.data
    }
  }
}
</script>
<style lang="scss" scoped>
.addPer{
  background-color: #f4f6f8;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;

  .user-name {
    font-weight: bold;
  }

  .el-page-header {
    ::v-deep .el-page-header__title {
      font-weight: bold;
      font-size: 16px;
    }
    ::v-deep .el-page-header__content {
      font-weight: bold;
      font-size: 16px;
    }
  }
}
.left{
  width: 200px;
  height: 200px;
  margin:50px 20px;
  // background-color: pink;
}
.right{
  width: 700px;
  // height: 200px;
  background-color: #fff;
  padding-top: 10px;
  margin:25px 100px;
}
.bottom{
  width: 100%;
  height: 80px;
  background-color: #fff;
  // position: fixed;
  bottom: 0;
  text-align: center;
}
.center{
  display: flex;
}
.tree-title {
  background: #f5f7fa;
  text-align: center;
  padding: 10px 0;
  margin-bottom: 12px;
}

.tree{
  margin-left: 20px;
  width: 100%;
  display: flex;
  flex: 3;
  flex-wrap: wrap;

  .tree-item {
  width: 30%;
  // flex: 1;
  border-right: 1px solid #e4e7ec;
  padding: 0px 4px;
  text-align: center;
}
}
</style>
