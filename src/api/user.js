import request from '@/utils/request'

// 注册 √
export const userRegisterService = (user_id, user_password) =>
  request.post('/reg', { user_id, user_password })

// 登录 √
export const userLoginService = (user_id, user_password) =>
  request.post('/login', {
    user_id,
    user_password
  })

// 获取 所有用户数量 √
export const getUserCountService = () => request.post('/countUser')

// 获取 所有用户 √
export const getUserListService = (page) => request.post('/getUser', { page })

// 用户 删除 根据id √
export const delUserService = (user_id) => request.post('/delUser', { user_id })

// 用户 权限 修改 √
export const editUserService = (user_id, permission) =>
  request.post('/updatePermission', { user_id, permission })
