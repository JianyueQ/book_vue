import request from '@/utils/request'
import { useTokenStore } from '@/stores/token'

export const ArticleCategoryListService = () => {
    const tokenStore = useTokenStore();
    //在piain中定义响应式数据不需要.value
    // console.log('Current Token:', tokenStore.token)
    // return request.get('/category', { headers: { 'Authorization': tokenStore.token } })
    return request.get('/category')
}
//添加文章分类
export const ArticleCategoryAddService = (categoryData) => {
    return request.post('/category', categoryData)
}
//修改文章分类
export const ArticleCategoryUpdateService = (categoryData) => {
    return request.put('/category', categoryData)
}
//删除文章分类
export const ArticleCategoryDeleteService = (id) => {
    return request.delete('/category?id=' + id)
}
//获取文章列表
export const ListArticleService = (params) => {
    return request.get('/article', { params: params })
}
//添加文章信息
export const articleAddService = (articleModel) => {
    return request.post('/article', articleModel)
}
//删除文章信息
export const articleDeleteService = (id) => {
    return request.delete('/article', { params: { id } })
}
//编辑文章信息
export const ArticleUpdateService = (params) => {
    return request.put('/article', params)
}