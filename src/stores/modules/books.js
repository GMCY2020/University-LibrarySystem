import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBooksStore = defineStore(
  'library-books',
  () => {
    const books = ref([])

    const setBooks = (b) => {
      books.value = b
    }

    const booksBrrow = ref([])

    const setBooksBrrow = (b) => {
      booksBrrow.value = b
    }

    return { books, setBooks, booksBrrow, setBooksBrrow }
  },
  {
    persist: true
  }
)
