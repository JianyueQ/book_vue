import request from '@/utils/request'

export const requestUserService = (registerDate) => {
    //借助UrlSeachParams完成传递
    const params = new URLSearchParams();
    for (let key in registerDate) {
        params.append(key, registerDate[key])
    }
    return request.post('/user/register', params)
}
//登录的函数
export const loginUserService = (registerDate) => {
    const params = new URLSearchParams();
    for (let key in registerDate) {
        params.append(key, registerDate[key])
    }
    return request.post('/user/login', params)
}
//查询用户信息
export const userInfoService = () => {
    return request.get('/user/userInfo')
}
//修改用户基本信息
export const userUpdateSercice = (userData) => {
    return request.put('/user/update', userData)
}
//修改用户的密码
export const userUpdatePwdService = (pswData) => {
    return request.patch('/user/updatePwd', pswData)
}
