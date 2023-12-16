<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
</script>
<template>
  <el-config-provider :locale="zh">
    <router-view></router-view>
  </el-config-provider>
</template>

<style lang="scss">
body,
html,
router-view {
  padding: 0;
  margin: 0;
  border: 0;
  user-select: none;
}

body,
html {
  min-width: 800px;
}

::-webkit-scrollbar {
  display: none;
}

.title-box {
  width: 100%;
  height: 60px;

  font-size: 25px;
  color: #232323;
  // font-weight: bolder;

  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;

  .title-name,
  .title-btn {
    margin: 10px;
  }
}

body {
  margin: 0;
  background-color: #f5f5f5;
}

.fade-slide-leave-active,
.fade-slide-enter-active {
  transition: all 0.3s;
}

.fade-slide-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}

.fade-slide-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
