<!-- 借书 -->
<script setup>
// 基本
import { Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'

// api
import {
  getBooksService,
  getBooksCountService,
  brrowBookService
} from '@/api/books'

// 存储
import { useDebugStore, useUserStore, useBooksStore } from '@/stores'
const debugStore = useDebugStore()
const userStore = useUserStore()
const booksStore = useBooksStore()

// 页面展示
const loading = ref(false)
const total = ref(0)
const pagenum = ref(1)
const onCurrentChange = (page) => {
  getBooksList(page)
}

// 书 获取 所有 数量 √
const getBooksCount = async () => {
  if (debugStore.isStartDebug) {
    total.value = debugStore.booksList.length
    return
  }

  const res = await getBooksCountService()
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
getBooksCount()

// 书 获取 所有 数据 √
const getBooksList = async (pagenum) => {
  loading.value = true

  if (debugStore.isStartDebug) {
    setTimeout(() => {
      booksStore.setBooks(debugStore.booksList)
      ElMessage.success('获取图书成功')
      loading.value = false
    }, 500)
    return
  }

  const res = await getBooksService(pagenum)
  if (res.status == 200) {
    if (res.data.status == 'success') {
      booksStore.setBooks(res.data.object)
      ElMessage.success('获取图书成功')
    } else {
      ElMessage.error(res.data.status)
    }
  } else {
    ElMessage.error('服务器错误')
  }

  loading.value = false
}
getBooksList(1)

// 书 借 √
const onBrrowBook = async (row) => {
  await ElMessageBox.confirm('确认借书 ' + row.book_name + ' ?', '温馨提示', {
    type: 'waring',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      if (row.book_count == 0) {
        ElMessage.error('书已借完')
        return
      }

      if (debugStore.isStartDebug) {
        ElMessage.success('借书成功')
        getBooksCount()
        getBooksList(1)
        return
      }

      const res = await brrowBookService(userStore.user.user_id, row.book_id)
      if (res.status == 200) {
        if (res.data.status == 'success') {
          ElMessage.success('借书成功')
          getBooksCount()
          getBooksList(1)
        } else {
          ElMessage.error(res.data.status)
        }
      } else {
        ElMessage.error('服务器错误')
      }
      return
    })
    .catch(() => {
      ElMessage.success('取消借书')
      return
    })
}
</script>

<template>
  <div class="title">图书列表</div>
  <el-table v-loading="loading" :data="booksStore.books" style="width: 100%">
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
    <el-table-column label="数量" prop="book_count"></el-table-column>
    <el-table-column label="入库时间" prop="book_date"></el-table-column>
    <el-table-column label="借书">
      <template #default="{ row }">
        <el-button
          :icon="Plus"
          circle
          plain
          type="primary"
          @click="onBrrowBook(row)"
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
