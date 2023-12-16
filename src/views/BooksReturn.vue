<!-- 还书 -->
<script setup>
// 基本
import { ref } from 'vue'
import { Minus } from '@element-plus/icons-vue'

// 组件
import MessageBox from './compoents/MeaasgeBox.vue'

// api
import {
  getBooksBrrowService,
  getBooksBrrowCountService,
  returnBookService
} from '@/api/books'

// 存储
import { useBooksStore, useDebugStore, useUserStore } from '@/stores'
const booksStore = useBooksStore()
const debugStore = useDebugStore()
const userStore = useUserStore()

// 组件数据
const messageBoxRef = ref()
// 组件数据 常量
const tableTitle = '我借的书'
const tableTitleList = {
  book_id: 'ISBN',
  book_name: '书名',
  book_author: '作者',
  book_publisher: '出版社',
  type_name: '类型',
  type_position: '存放地点',
  log_date: '时间'
}

// 组件数据 变量
const loading = ref(false)
const total = ref(0)

// 书 获取 所有 数量 √
const getBooksBrrowCount = async () => {
  if (debugStore.isStartDebug) {
    total.value = debugStore.booksBrrowList.length
    return
  }

  const res = await getBooksBrrowCountService(userStore.user.user_id)
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
getBooksBrrowCount()

// 书 获取 所有 数据 √
const getBooksBrrowList = async (pagenum) => {
  loading.value = true

  if (debugStore.isStartDebug) {
    setTimeout(() => {
      booksStore.setBooksBrrow(debugStore.booksBrrowList)
      loading.value = false
    }, 500)
    return
  }

  const res = await getBooksBrrowService(userStore.user.user_id, pagenum)
  if (res.status == 200) {
    if (res.data.status == 'success') {
      booksStore.setBooksBrrow(res.data.object)
    } else {
      ElMessage.error(res.data.status)
    }
  } else {
    ElMessage.error('服务器错误')
  }

  loading.value = false
}
getBooksBrrowList(1)

// 书 还 √
const onReturnBook = async (row) => {
  await ElMessageBox.confirm('确认还书 ' + row.book_name + ' ?', '温馨提示', {
    type: 'waring',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      if (debugStore.isStartDebug) {
        ElMessage.success('还书成功')
        getBooksBrrowCount()
        getBooksBrrowList(1)
        return
      }

      const res = await returnBookService(
        userStore.user.user_id,
        row.book_id,
        row.log_date
      )
      if (res.status == 200) {
        if (res.data.status == 'success') {
          ElMessage.success('还书成功')
          getBooksBrrowCount()
          getBooksBrrowList(1)
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
</script>

<template>
  <!-- 组件 -->
  <message-box
    ref="messageBoxRef"
    :table-title="tableTitle"
    :loading="loading"
    :table-title-list="tableTitleList"
    :table-data="booksStore.booksBrrow"
    :total="total"
    @on-current-change="getBooksBrrowList"
  >
    <template v-slot:table-btn>
      <el-table-column label="还书">
        <template #default="{ row }">
          <el-button
            :icon="Minus"
            circle
            plain
            type="primary"
            @click="onReturnBook(row)"
          ></el-button>
        </template>
        <template #empty>
          <el-empty description="没有数据" />
        </template>
      </el-table-column>
    </template>
  </message-box>
</template>
<style scoped></style>
