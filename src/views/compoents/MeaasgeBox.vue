<script setup>
import { ref } from 'vue'

defineProps({
  tableTitle: {
    required: true,
    type: String
  },

  loading: {
    required: true,
    type: Boolean
  },

  tableTitleList: {
    required: true
  },

  tableData: {
    required: true
  },

  total: {
    required: true
  }
})

// 页面跳转
const pagenum = ref(1)
const emit = defineEmits(['onCurrentChange'])
const onCurrentChange = (page) => {
  emit('onCurrentChange', page)
}
</script>

<template>
  <!-- 表格名称 -->
  <div class="title-box">
    <div class="title-name">{{ tableTitle }}</div>
    <div class="title-btn">
      <slot name="title-btn"></slot>
    </div>
  </div>

  <!-- 表格 -->
  <el-table v-loading="loading" :data="tableData">
    <el-table-column
      :label="title_name"
      :prop="index"
      v-for="(title_name, index) in tableTitleList"
      :key="index"
      width="auto"
    ></el-table-column>
    <slot name="table-btn"></slot>

    <template #empty>
      <el-empty description="没有数据" />
    </template>
  </el-table>

  <!-- 分页 -->
  <el-pagination
    :total="total"
    v-model:current-page="pagenum"
    layout="jumper, total, prev, pager, next"
    background
    @current-change="onCurrentChange"
    style="margin-top: 20px; justify-content: flex-end"
  />
</template>
