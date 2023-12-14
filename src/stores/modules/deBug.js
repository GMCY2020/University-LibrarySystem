import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDebugStore = defineStore(
  'library-debug',
  () => {
    const isStartDebug = ref(false)

    const booksList = ref([
      {
        book_id: '001',
        book_name: 'name1',
        book_author: 'author1',
        book_publisher: 'publisher1',
        type_name: 'type_name1',
        type_position: '11',
        book_count: 10,
        book_date: '1111-11-11'
      },
      {
        book_id: '002',
        book_name: 'name2',
        book_author: 'author2',
        book_publisher: 'publisher2',
        type_name: 'type_name2',
        type_position: '22',
        book_count: 20,
        book_date: '2222-22-22'
      },
      {
        book_id: '003',
        book_name: 'name3',
        book_author: 'author3',
        book_publisher: 'publisher3',
        type_name: 'type_name3',
        type_position: '33',
        book_count: 10,
        book_date: '3333-33-33'
      }
    ])

    const booksBrrowList = ref([
      {
        book_id: '001',
        book_name: 'name1',
        book_author: 'author1',
        book_publisher: 'publisher1',
        type_name: 'type_name1',
        type_position: '11',
        book_count: 10,
        book_date: '1111-11-11'
      },
      {
        book_id: '002',
        book_name: 'name2',
        book_author: 'author2',
        book_publisher: 'publisher2',
        type_name: 'type_name2',
        type_position: '22',
        book_count: 20,
        book_date: '2222-22-22'
      },
      {
        book_id: '003',
        book_name: 'name3',
        book_author: 'author3',
        book_publisher: 'publisher3',
        type_name: 'type_name3',
        type_position: '33',
        book_count: 10,
        book_date: '3333-33-33'
      }
    ])

    const usersList = ref([
      {
        user_id: 'admin1',
        user_name: '',
        user_permission: 1
      },
      {
        user_id: 'admin2',
        user_name: '',
        user_permission: 0
      },
      {
        user_id: 'admin3',
        user_name: '',
        user_permission: 0
      },
      {
        user_id: 'admin4',
        user_name: '',
        user_permission: 1
      }
    ])

    const user = ref({
      user_id: 'admin',
      user_name: '管理员',
      user_password: 'admin',
      user_permission: 1
    })

    return { isStartDebug, booksList, booksBrrowList, usersList, user }
  },
  {
    persist: true
  }
)
