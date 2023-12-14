import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'library-user',
  () => {
    const isLogin = ref(false)

    const setIsLogin = (v) => {
      isLogin.value = v
    }

    const user = ref({})

    const setUser = (u) => {
      user.value = u
    }

    const userList = ref({})

    const setUserList = (u) => {
      userList.value = u
    }

    return {
      isLogin,
      setIsLogin,
      user,
      setUser,
      userList,
      setUserList
    }
  },
  {
    persist: true
  }
)
