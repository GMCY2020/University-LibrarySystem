<!-- 借书 -->
<script setup>
// 基本
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

// 组件
import MessageBox from './compoents/MeaasgeBox.vue'

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

// 组件数据
const messageBoxRef = ref()
// 组件数据 常量
const tableTitle = '图书列表'
const tableTitleList = {
  book_id: 'ISBN',
  book_name: '书名',
  book_author: '作者',
  book_publisher: '出版社',
  type_name: '类型',
  type_position: '存放地点',
  book_count: '数量',
  book_date: '时间'
}

// 组件数据 变量
const loading = ref(false)
const total = ref(0)

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
      loading.value = false
    }, 500)
    return
  }

  const res = await getBooksService(pagenum)
  if (res.status == 200) {
    if (res.data.status == 'success') {
      booksStore.setBooks(res.data.object)
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
    :table-data="booksStore.books"
    :total="total"
    @on-current-change="getBooksList"
  >
    <template v-slot:table-btn>
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
      </el-table-column>
    </template>
  </message-box>
</template>
