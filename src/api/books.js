import request from '@/utils/request'

// 获取 所有书的数量 √
export const getBooksCountService = () => request.post('/countBook')

// 获取 所有书 √
export const getBooksService = (page) => request.post('/findAllBook', { page })

// 获取 借的书的数量 √
export const getBooksBrrowCountService = (user_id) =>
  request.post('/countUserBook', { user_id })

// 获取 借的书 √
export const getBooksBrrowService = (user_id, page) =>
  request.post('/getUserBook', { user_id, page })

// 借书 √
export const brrowBookService = (user_id, book_id) =>
  request.post('/borrow', { book_id, user_id })

// 还书 √
export const returnBookService = (user_id, book_id, date) =>
  request.post('/backBook', { user_id, book_id, date })

// 删除 书 根据id √
export const delBookByIdService = (book_id) =>
  request.post('/delBook', { book_id })

// 添加 书 √
export const addBookService = (book) => request.post('/insertBook', book)

// 根据id获取书 × √
export const getBookByIdService = (book_id) =>
  request.post('/findBook', { book_id })

// 编辑 书 √
export const editBookService = (book) => request.post('/updateBook', book)
