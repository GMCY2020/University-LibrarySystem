<!-- 用户管理 -->
<script setup>
// 基本
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'

// api
import {
  getUserListService,
  getUserCountService,
  delUserService,
  editUserService
} from '@/api/user.js'

// 存储
import { useUserStore, useDebugStore } from '@/stores'
const userStore = useUserStore()
const debugStore = useDebugStore()

// 页面展示
const loading = ref(false)
const total = ref(0)
const pagenum = ref(1)
const onCurrentChange = (page) => {
  getUsersList(page)
}

// 用户 获取 所有 数量 √
const getUsersCount = async () => {
  if (debugStore.isStartDebug) {
    total.value = debugStore.usersList.length
    return
  }

  const res = await getUserCountService()
  if (res.status == 200) {
    if (res.data.status == 'success') {
      total.value = res.data.object
    } else {
      ElMessage.error(res.data.status)
    }
  } else {
    ElMessage.error('服务器错误')
  }
}
getUsersCount()

// 用户 获取 所有 数据 √
const getUsersList = async (pagenum) => {
  loading.value = true

  if (debugStore.isStartDebug) {
    setTimeout(() => {
      userStore.setUserList(debugStore.usersList)
      ElMessage.success('获取用户成功')
      loading.value = false
    }, 1000)
    return
  }

  const res = await getUserListService(pagenum)
  if (res.status == 200) {
    if (res.data.status == 'success') {
      userStore.setUserList(res.data.object)
      ElMessage.success('获取用户成功')
    } else {
      ElMessage.error(res.data.status)
    }
  } else {
    ElMessage.error('服务器错误')
  }

  loading.value = false
}
getUsersList(1)

const dialogVisible = ref(false)
const user = ref()

// 用户 获取 当前 数据 √
const onEditUser = (row) => {
  user.value = row
  user.value.user_permission = user.value.user_permission
    ? '管理员'
    : '普通用户'
  dialogVisible.value = true
}

// 用户 更改权限 √
const onUpdateUser = async () => {
  await ElMessageBox.confirm('确认修改?', '温馨提示', {
    type: 'waring',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      if (debugStore.isStartDebug) {
        ElMessage.success('权限修改成功')
        getUsersCount()
        getUsersList(1)
        dialogVisible.value = false
        return
      }

      const res = await editUserService(
        user.value.user_id,
        user.value.user_permission
      )

      if (res.status == 200) {
        if (res.data.status == 'success') {
          ElMessage.success('权限修改成功')
          getUsersCount()
          getUsersList(1)
          dialogVisible.value = false
        } else {
          ElMessage.error(res.data.status)
        }
      } else {
        ElMessage.error('服务器错误')
      }
      return
    })
    .catch(() => {
      ElMessage.success('取消修改')
      return
    })
}

// 用户 删除
const onDeleteUser = async (row) => {
  await ElMessageBox.confirm('确认删除?', '温馨提示', {
    type: 'waring',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      if (debugStore.isStartDebug) {
        ElMessage.success('删除用户成功')
        getUsersCount()
        getUsersList(1)
        dialogVisible.value = false
        return
      }

      const res = await delUserService(row.user_id)
      if (res.status == 200) {
        if (res.data.status == 'success') {
          ElMessage.success('删除用户成功')
          getUsersCount()
          getUsersList(1)
        } else {
          ElMessage.error(res.data.status)
        }
      } else {
        ElMessage.error('服务器错误')
      }
    })
    .catch(() => {
      ElMessage.success('取消删除')
      return
    })
}

const onCancel = () => {
  dialogVisible.value = false
  ElMessage.success('取消')
}
</script>

<template>
  <div class="title">用户管理</div>
  <el-table v-loading="loading" :data="userStore.userList" style="width: 100%">
    <el-table-column label="用户名" width="150">
      <template #default="{ row }">
        <el-link type="primary" :underline="false">{{ row.user_id }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="权限">
      <template #default="{ row }">
        {{ row.user_permission ? '管理员' : '普通用户' }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150">
      <template #default="{ row }">
        <el-button
          :icon="Edit"
          circle
          plain
          type="primary"
          @click="onEditUser(row)"
        ></el-button>
        <el-button
          :icon="Delete"
          circle
          plain
          type="danger"
          @click="onDeleteUser(row)"
        ></el-button>
      </template>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    :total="total"
    v-model:current-page="pagenum"
    layout="jumper, total, prev, pager, next"
    background
    @current-change="onCurrentChange"
    style="margin-top: 20px; justify-content: flex-end"
  />

  <el-dialog v-model="dialogVisible" title="编辑用户权限" width="30%">
    <el-form>
      <el-form-item>
        <div class="left">用户:</div>
        <div class="right">{{ user.user_id }}</div>
      </el-form-item>
      <el-form-item>
        <div class="left">权限:</div>
        <el-select
          v-model="user.user_permission"
          placeholder="权限"
          style="width: 110px"
          class="right"
        >
          <el-option label="管理员" value="1" />
          <el-option label="普通用户" value="0" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onUpdateUser"> 修改 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped>
.right {
  margin-left: 10px;
}
</style>
