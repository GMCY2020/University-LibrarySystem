<!-- 书管理 -->
<script setup>
// 基本
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'

// api
import {
  getBooksService,
  getBooksCountService,
  delBookByIdService,
  editBookService,
  addBookService
} from '@/api/books'

// 存储
import { useBooksStore, useDebugStore } from '@/stores'
const booksStore = useBooksStore()
const debugStore = useDebugStore()

// 页面展示
const loading = ref(false)
const total = ref(0)
const pagenum = ref(1)
const onCurrentChange = (page) => {
  getBooksList(page)
}

// 表单 校验 与 规则
const form = ref()
const rules = {
  book_id: [
    { required: true, message: '不能为空', trigger: 'blur' },
    {
      pattern: /^[U+0030-U+0039]{0,}$/,
      message: 'ISBN码为数字',
      trigger: ' blur'
    }
  ],
  book_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
  book_author: [{ required: true, message: '不能为空', trigger: 'blur' }],
  book_publisher: [{ required: true, message: '不能为空', trigger: 'blur' }],
  book_type: [{ required: true, message: '不能为空', trigger: 'blur' }],
  type_position: [{ required: true, message: '不能为空', trigger: 'blur' }],
  book_count: [
    { required: true, message: '不能为空', trigger: 'blur' },
    {
      pattern: /^[U+0030-U+0039]{0,}$/,
      message: '数量为数字',
      trigger: ' blur'
    }
  ],
  book_date: [{ required: true, message: '不能为空', trigger: 'blur' }]
}
const bookN = ref({
  book_id: '',
  book_name: '',
  book_author: '',
  book_publisher: '',
  book_type: '',
  type_position: '',
  book_count: '',
  book_date: ''
})

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

const dialogVisible = ref(false)
const book = ref({})

// 书 获取 当前 数据 √
const onEditBook = async (row) => {
  book.value = row
  dialogVisible.value = true
}

// 书 修改 √
const updateBook = async () => {
  await form.value.validate()

  await ElMessageBox.confirm('确认修改?', '温馨提示', {
    type: 'waring',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      if (debugStore.isStartDebug) {
        ElMessage.success('修改成功')
        getBooksCount()
        getBooksList(1)
        dialogVisible.value = false
        return
      }

      const res = await editBookService(book.value)
      if (res.status == 200) {
        if (res.data.status == 'success') {
          ElMessage.success('修改成功')
          getBooksCount()
          getBooksList(1)
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

// 书 删除 √
const onDeletBook = async (row) => {
  await ElMessageBox.confirm('确认删除 ' + row.book_name + '?', '温馨提示', {
    type: 'waring',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      if (debugStore.isStartDebug) {
        ElMessage.success('删除成功')
        getBooksCount()
        getBooksList(1)
        return
      }

      const res = await delBookByIdService(row.book_id)
      if (res.status == 200) {
        if (res.data.status == 'success') {
          ElMessage.success('删除成功')
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
      ElMessage.success('取消删除')
      return
    })
}

const onCancel = () => {
  dialogVisible.value = false
  dialogVisibleN.value = false
  ElMessage.success('取消')
}

const dialogVisibleN = ref(false)

// 弹窗 显示 √
const onShow = () => {
  bookN.value = {
    book_id: '',
    book_name: '',
    book_author: '',
    book_publisher: '',
    book_type: '',
    type_position: '',
    book_count: '',
    book_date: new Date()
  }
  dialogVisibleN.value = true
}

// 书 添加 √
const onAddBook = async () => {
  await form.value.validate()

  await ElMessageBox.confirm('确认添加?', '温馨提示', {
    type: 'waring',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(async () => {
      if (debugStore.isStartDebug) {
        ElMessage.success('添加成功')
        getBooksCount()
        getBooksList(1)
        dialogVisibleN.value = false
        return
      }

      const res = await addBookService(bookN.value)
      if (res.status == 200) {
        if (res.data.status == 'success') {
          ElMessage.success('添加成功')
          getBooksCount()
          getBooksList(1)
          dialogVisibleN.value = false
        } else {
          ElMessage.error(res.data.status)
        }
      } else {
        ElMessage.error('服务器错误')
      }
      return
    })
    .catch(() => {
      ElMessage.success('取消添加')
      return
    })
}

// 获取时间
const shortcuts = [
  {
    text: '今天',
    value: new Date()
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    }
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    }
  }
]
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}
</script>

<template>
  <div class="edit-title title">
    <div></div>
    <div>图书管理</div>

    <div class="btn-box">
      <el-button :icon="Plus" plain type="primary" @click="onShow()"
        >添加图书</el-button
      >
    </div>
  </div>
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
    <el-table-column label="操作" width="100px">
      <template #default="{ row }">
        <el-button
          :icon="Edit"
          circle
          plain
          type="primary"
          @click="onEditBook(row)"
        ></el-button>
        <el-button
          :icon="Delete"
          circle
          plain
          type="danger"
          @click="onDeletBook(row)"
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

  <el-dialog v-model="dialogVisible" title="编辑图书" width="30%">
    <el-form ref="form" :model="book" :rules="rules">
      <el-form-item prop="book_name">
        <el-input v-model="book.book_name" placeholder="书名"></el-input>
      </el-form-item>
      <el-form-item prop="book_author">
        <el-input v-model="book.book_author" placeholder="作者"></el-input>
      </el-form-item>
      <el-form-item prop="book_publisher">
        <el-input v-model="book.book_publisher" placeholder="出版社"></el-input>
      </el-form-item>
      <el-form-item prop="book_count">
        <el-input v-model="book.book_count" placeholder="数量"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="updateBook"> 修改 </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogVisibleN" title="添加图书" width="30%">
    <el-form ref="form" :model="bookN" :rules="rules">
      <el-form-item prop="book_id">
        <el-input v-model="bookN.book_id" placeholder="ISBN"></el-input>
      </el-form-item>
      <el-form-item prop="book_name">
        <el-input v-model="bookN.book_name" placeholder="书名"></el-input>
      </el-form-item>
      <el-form-item prop="book_type">
        <el-select
          v-model="bookN.book_type"
          placeholder="类型"
          style="width: 100%"
          class="right"
        >
          <el-option label="文学类" value="T01" />
          <el-option label="自然科学类" value="T02" />
          <el-option label="农业类" value="T03" />
          <el-option label="工程技术类" value="T04" />
          <el-option label="医药类" value="T05" />
          <el-option label="社会科学类" value="T06" />
          <el-option label="语言文学类" value="T07" />
          <el-option label="历史类" value="T08" />
          <el-option label="艺术类" value="T09" />
          <el-option label="教材类" value="T10" />
          <el-option label="参考书类" value="T11" />
          <el-option label="宗教类" value="T12" />
          <el-option label="传记类" value="T13" />
          <el-option label="幼儿图书类" value="T14" />
        </el-select>
      </el-form-item>
      <el-form-item prop="book_author">
        <el-input v-model="bookN.book_author" placeholder="作者"></el-input>
      </el-form-item>
      <el-form-item prop="book_publisher">
        <el-input
          v-model="bookN.book_publisher"
          placeholder="出版社"
        ></el-input>
      </el-form-item>
      <el-form-item prop="book_count">
        <el-input v-model="bookN.book_count" placeholder="数量"></el-input>
      </el-form-item>
      <el-form-item prpo="book_date">
        <el-date-picker
          v-model="bookN.book_date"
          type="date"
          placeholder="入库时间"
          :disabled-date="disabledDate"
          :shortcuts="shortcuts"
          size="default"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onAddBook"> 添加 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.edit-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-box {
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
