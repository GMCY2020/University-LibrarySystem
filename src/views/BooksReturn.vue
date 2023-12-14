<!-- 还书 -->
<script setup>
// 基本
import { Minus } from '@element-plus/icons-vue'
import { ref } from 'vue'

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

// 页面展示
const loading = ref(false)
const total = ref(0)
const pagenum = ref(1)
const onCurrentChange = (page) => {
  getBooksBrrowList(page)
}

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
      ElMessage.success('获取图书成功')
      loading.value = false
    }, 500)
    return
  }

  const res = await getBooksBrrowService(userStore.user.user_id, pagenum)
  if (res.status == 200) {
    if (res.data.status == 'success') {
      booksStore.setBooksBrrow(res.data.object)
      ElMessage.success('获取图书成功')
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
    .catch(() => {
      ElMessage.success('取消还书')
      return
    })
}
</script>

<template>
  <div class="title">我借的书</div>
  <el-table
    v-loading="loading"
    :data="booksStore.booksBrrow"
    style="width: 100%"
  >
    <el-table-column label="ISBN" prop="book_id"></el-table-column>
    <el-table-column label="书名">
      <template #default="{ row }">
        <el-link type="primary" :underline="false">{{ row.book_name }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="作者" prop="book_author"></el-table-column>
    <el-table-column label="出版社" prop="book_publisher"> </el-table-column>
    <el-table-column label="类型" prop="type_name"> </el-table-column>
    <el-table-column label="存放地点" prop="type_position"> </el-table-column>
    <el-table-column label="借阅时间" prop="log_date"></el-table-column>
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
  </el-table>
  <el-pagination
    :total="total"
    v-model:current-page="pagenum"
    layout="jumper, total, prev, pager, next"
    background
    @current-change="onCurrentChange"
    style="margin-top: 20px; justify-content: flex-end"
  />
</template>
<style scoped></style>
