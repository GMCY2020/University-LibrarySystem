<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'

import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const outLogin = async () => {
  await ElMessageBox.confirm('确认退出?', '温馨提示', {
    type: 'waring',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(() => {
      userStore.setIsLogin(false)
      userStore.setUser({})
      ElMessage.success('退出成功')
      router.push('/login')
      return
    })
    .catch(() => {
      ElMessage.success('取消退出')
      return
    })
}

const Login = () => {
  router.push('/login')
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="rgb(33, 38, 68)"
        text-color="#fff"
        router
      >
        <el-menu-item index="/home">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/books/brrow">
          <el-icon>
            <Management />
          </el-icon>
          <span>图书列表</span>
        </el-menu-item>
        <el-menu-item index="/books/return">
          <el-icon>
            <Management />
          </el-icon>
          <span>我借的书</span>
        </el-menu-item>

        <el-sub-menu index="/admin" v-if="userStore.user.user_permission == 1">
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>管理员</span>
          </template>
          <el-menu-item index="/admin/booksedit">
            <el-icon>
              <Management />
            </el-icon>
            <span>图书管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/useredit">
            <el-icon>
              <User />
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div></div>
        <el-dropdown placement="bottom-end">
          <span class="el-dropdown__box">
            <div class="user_name">
              {{
                !userStore.user.user_name ? '未登录' : userStore.user.user_name
              }}
            </div>
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                command="logout"
                :icon="SwitchButton"
                @click="Login"
                v-if="!userStore.isLogin"
                >登录</el-dropdown-item
              >
              <el-dropdown-item
                command="logout"
                :icon="SwitchButton"
                @click="outLogin"
                v-if="userStore.isLogin"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>图书管理系统 ©2023 Created by 408</el-footer>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: rgb(33, 38, 68);
    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}

.user_name {
  font-size: 18px;
  font-weight: bolder;
}
</style>
