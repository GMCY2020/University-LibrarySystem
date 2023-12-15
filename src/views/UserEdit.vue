<!-- 用户管理 -->
<script setup>
// 基本
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'

// 组件
import MessageBox from './compoents/MeaasgeBox.vue'

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

// 组件数据
const messageBoxRef = ref()
// 组件数据 常量
const tableTitle = '用户管理'
const tableTitleList = {
  user_id: '用户id'
  // user_permission: '权限'
}

// 组件数据 变量
const loading = ref(false)
const total = ref(0)

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
      loading.value = false
    }, 1000)
    return
  }

  const res = await getUserListService(pagenum)
  if (res.status == 200) {
    if (res.data.status == 'success') {
      userStore.setUserList(res.data.object)
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
    .catch((e) => {
      console.log(e)
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
    .catch((e) => {
      console.log(e)
      return
    })
}

const onCancel = () => {
  dialogVisible.value = false
}
</script>

<template>
  <!-- 组件 -->
  <message-box
    ref="messageBoxRef"
    :table-title="tableTitle"
    :loading="loading"
    :table-title-list="tableTitleList"
    :table-data="userStore.userList"
    :total="total"
    @on-current-change="getUsersList"
  >
    <template v-slot:table-btn>
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
    </template>
  </message-box>

  <!-- 弹窗 编辑用户权限 -->
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
