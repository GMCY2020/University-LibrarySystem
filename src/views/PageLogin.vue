<script setup>
// 基本
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

// api
import { userRegisterService, userLoginService } from '@/api/user.js'

// 存储 与 路由
import { useUserStore, useDebugStore } from '@/stores'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const debugStore = useDebugStore()
const router = useRouter()

// 表单 校验 与 规则
const form = ref()
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 5,
      max: 10,
      message: '用户名必须是 5 - 10 位的字符',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{5,15}$/,
      message: '密码必须是 5 - 15 位数的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{5,15}$/,
      message: '密码必须是 5 - 15 位数的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})

const isRegister = ref(false)

// 更新
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

// 登录 √
const login = async () => {
  await form.value.validate()

  if (debugStore.isStartDebug) {
    userStore.setUser(debugStore.user)
    userStore.setIsLogin(true)
    ElMessage.success('登陆成功')
    router.push('/')
    return
  }

  const res = await userLoginService(
    formModel.value.username,
    formModel.value.password
  )
  if (res.status == 200) {
    if (res.data.status == 'success') {
      userStore.setUser(res.data.object)
      userStore.setIsLogin(true)
      ElMessage.success('登陆成功')
      router.push('/')
    } else {
      ElMessage.error(res.data.status)
    }
  } else {
    ElMessage.error('服务器错误')
  }
}

// 注册 √
const register = async () => {
  await form.value.validate()

  const res = await userRegisterService(
    formModel.value.username,
    formModel.value.password
  )
  if (res.status == 200) {
    if (res.data.status == 'success') {
      ElMessage.success('注册成功')
      isRegister.value = false
    } else {
      ElMessage.error(res.data.status)
    }
  } else {
    ElMessage.error('服务器错误')
  }
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            :prefix-icon="Lock"
            v-model="formModel.repassword"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
