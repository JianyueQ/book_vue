//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus'
//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({ baseURL })

import { useTokenStore } from '@/stores/token';

//添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        const tokenStore = useTokenStore();
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

import router from '@/router';
//添加响应拦截器
instance.interceptors.response.use(
    result => {
        if (result.data.code === 0) {
            return result.data;
        } else if (result.data.message === '用户名错误') {
            ElMessage({
                showClose: true,
                message: '用户名错误',
                type: 'error',
            })
        } else if (result.data.message === '密码错误') {
            ElMessage({
                showClose: true,
                message: '密码错误',
                type: 'error',
            })
        } else if (result.data.message === '该用户名已经被注册') {
            ElMessage({
                showClose: true,
                message: '该用户名已经被注册',
                type: 'error',
            })
        } else if (result.data.message === '旧密码不一致') {
            ElMessage({
                showClose: true,
                message: '输入的旧密码与原密码不一致',
                type: 'error',
            })
        } else if (result.data.message === '新密码与确认密码不一致') {
            ElMessage({
                showClose: true,
                message: '新密码与确认密码不一致',
                type: 'error',
            })
        } else if (result.data.message === '新密码与旧密码一致') {
            ElMessage({
                showClose: true,
                message: '新密码与旧密码一致',
                type: 'error',
            })
        }


        // else {
        //     ElMessage({
        //         showClose: true,
        //         message: '操作失败',
        //         type: 'error',
        //     })
        // }
        return Promise.reject(err);//异步的状态转化成失败的状态
    },
    err => {
        if (err.response.status === 401) {
            ElMessage({
                showClose: true,
                message: '未登录',
                type: 'error',
            })
            router.push('/login')
        } else {
            ElMessage({
                showClose: true,
                message: '服务异常',
                type: 'error',
            })
        }

        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;