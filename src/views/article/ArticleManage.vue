<template>
    <el-card class="card">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <el-button type="primary" @click="visibleDrawer = true;">添加文章</el-button>
            </div>
            <el-drawer v-model="visibleDrawer" size="50%" title="添加文章" direction="rtl">
                <el-form label-width="100px" style="padding-right: 30px" :rules="rules" :model="articleModel">
                    <el-form-item label="文章标题" prop="title">
                        <el-input v-model="articleModel.title"></el-input>
                    </el-form-item>
                    <el-form-item label="文章分类">
                        <el-select v-model="articleModel.categoryId" placeholder="请选择">
                            <el-option v-for="c in categoryData" :key="c.id" :label="c.categoryName"
                                :value="c.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文章封面">
                        <!-- 
                            auto-upload:设置是否自动上传
                            action:设置服务器接口路径
                            name:设置上传文件的字段名
                            headers:设置文件的上传请求头
                            on-success:设置上传成功的回调函数
                        -->

                        <!-- action="#" :auto-upload="false" :on-change="handleFileChange"
                            :show-file-list="true" :file-list="fileList" :on-remove="handleRemove" -->
                        <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                            action="/api/upload" name="file" :headers="{ 'Authorization': TokenStore.token }"
                            :on-success="uploadSuccess">
                            <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="文章内容">
                        <div class="editor">
                            <quill-editor theme="snow" v-model:content="articleModel.content"
                                contentType="html"></quill-editor>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addArticle('已发布')">发布</el-button>
                        <el-button type="info" @click="addArticle('草稿')">草稿</el-button>
                    </el-form-item>
                </el-form>
            </el-drawer>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类">
                <el-select v-model="categoryId" placeholder="请选择">
                    <el-option v-for="c in categoryData" :key="c.id" :label="c.categoryName" :value="c.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发布状态">
                <el-select v-model="state" placeholder="请选择">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search()">搜索</el-button>
                <el-button @click="resetData()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表部分 -->
        <el-table style="width: 100%;" :data="articleData">
            <el-table-column prop="title" label="文章标题" />
            <el-table-column prop="categoryName" label="分类" />
            <el-table-column prop="createTime" label="发表时间" />
            <el-table-column prop="state" label="状态" />
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button type="success" :icon="Edit" circle plain @click="showUpdate(row)" />
                    <el-button type="danger" :icon="Delete" circle plain @click="showDeleteCategory(row)" /></template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 编辑的弹窗 -->
        <el-drawer v-model="visibleDrawerUpdate" size="50%" title="编辑文章" direction="rtl">
            <el-form label-width="100px" style="padding-right: 30px" :rules="rules" :model="articleUpdateModel">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="articleUpdateModel.title"></el-input>
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-select v-model="articleUpdateModel.categoryId" placeholder="请选择">
                        <el-option v-for="c in categoryData" :key="c.id" :label="c.categoryName"
                            :value="c.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">
                    <!-- 
                            auto-upload:设置是否自动上传
                            action:设置服务器接口路径
                            name:设置上传文件的字段名
                            headers:设置文件的上传请求头
                            on-success:设置上传成功的回调函数
                        -->

                    <!-- action="#" :auto-upload="false" :on-change="handleFileChange"
                            :show-file-list="true" :file-list="fileList" :on-remove="handleRemove" -->
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/upload"
                        name="file" :headers="{ 'Authorization': TokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="articleUpdateModel.coverImg" :src="articleUpdateModel.coverImg" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleUpdateModel.content"
                            contentType="html"></quill-editor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="UpdateArticle('已发布')">发布</el-button>
                    <el-button type="info" @click="UpdateArticle('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
        <!-- 分页部分 -->
        <!-- 
        el-pagination 是 Element Plus 的分页组件
        layout 定义了分页器包含的功能模块:
          - jumper: 页码跳转输入框
          - total: 显示总条目数
          - sizes: 每页显示条数选择器
          - prev: 上一页按钮
          - pager: 页码列表
          - next: 下一页按钮
        v-model:current-page - 双向绑定当前页码(pageNum)
        v-model:page-size - 双向绑定每页显示条数(pageSize)
        :page-sizes 设置每页显示条数的可选值数组 [3,5,10,15]
        background 为分页按钮添加背景色
        :total="70" 设置总条目数为70
        @size-change 每页条数变化时触发的事件
        @current-change 当前页码变化时触发的事件
        class 设置自定义样式类名
        -->
        <!-- <el-pagination layout="jumper, total, sizes, prev,pager, next" v-model:current-page="pageNum"
            v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]" background :total="total"
            @size-change="onSizeChange(size)" @current-change="onCurrentChange(num)" class="fixed-pagination" /> -->
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>
</template>
<script setup>
import { ref } from 'vue';
import { ElEmpty, ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Message } from "@element-plus/icons-vue";
import { ArticleCategoryListService, ArticleUpdateService, ListArticleService, articleAddService, articleDeleteService } from '@/api/article';
import { Plus } from '@element-plus/icons-vue'
import { useTokenStore } from '@/stores/token';

//token
const TokenStore = useTokenStore();
//图片的回调函数
const uploadSuccess = (result) => {
    articleModel.value.coverImg = result.data
    console.log(result);

}
//控制抽屉的出现
const visibleDrawer = ref(false)
const visibleDrawerUpdate = ref(false)
//用户搜索时选用的发布状态
const state = ref('')
//用户搜索时选用的文章id
const categoryId = ref('')
//分页的数据模型
const pageNum = ref(1)  //当前页
const pageSize = ref(3)  //每页条数
const total = ref(3) //总条数
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    getAllArticle();
}
//当页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    getAllArticle();
}
//点击搜索根据条件获取文章列表
const search = () => {
    getAllArticle();
}
//点击重置会清空数据模型
const resetData = () => {
    state.value = ""
    categoryId.value = ""
    getAllArticle();
}
//添加弹窗增加文章的表单校验
const rules = {
    title: [
        { required: true, message: "请输入文章名称", trigger: "blur" },
    ],
};
//添加文章的数据模型
const articleModel = ref(
    {
        title: "",
        content: "",
        coverImg: "",
        state: "",
        categoryId: "",
    }
)

const categoryData = ref([])
//调用获取文章分类的接口
const getAllCategory = async () => {
    let rusult = await ArticleCategoryListService()
    categoryData.value = rusult.data
}
getAllCategory();

const articleData = ref([])
//调用获取文章列表的接口
const getAllArticle = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await ListArticleService(params);
    articleData.value = result.data.items
    //为列表中添加categoryName属性
    for (let i = 0; i < articleData.value.length; i++) {
        let article = articleData.value[i];
        for (let j = 0; j < categoryData.value.length; j++) {
            if (article.categoryId === categoryData.value[j].id) {
                article.categoryName = categoryData.value[j].categoryName
            }
        }
    }
    total.value = result.data.total

}
getAllArticle();
//点击发布调用的函数//调用添加文章的接口
//添加文章
const addArticle = async (state) => {
    articleModel.value.state = state
    let result = await articleAddService(articleModel.value);
    ElMessage.success(result.message ? result.message : '添加成功')
    //再次调用getArticles,获取文章
    getAllArticle();
    //隐藏抽屉
    visibleDrawer.value = false
}
//编辑文字信息
const showUpdate = (row) => {
    visibleDrawerUpdate.value = true
    articleUpdateModel.value = {
        id: row.id,
        title: row.title,
        content: row.content,
        coverImg: row.content,
        categoryId: row.categoryId,
    }
}
const UpdateArticle = async (state) => {
    articleUpdateModel.value.state = state
    let result = await ArticleUpdateService(articleUpdateModel.value);
    ElMessage.success(result.message ? result.message : '添加成功')
    //再次调用getArticles,获取文章
    getAllArticle();
    //隐藏抽屉
    visibleDrawerUpdate.value = false
}
//编辑文字信息的数据模型
const articleUpdateModel = ref(
    {
        id: "",
        title: "",
        content: "",
        coverImg: "",
        state: "",
        categoryId: "",
    }
)
//调用删除文章接口
const showDeleteCategory = (row) => {
    ElMessageBox.confirm(
        '确定要删除该分类吗？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        //调用删除文章分类的接口
        let result = await articleDeleteService(row.id);
        console.log(row.id);

        ElMessage({
            type: 'success',
            message: result.message ? result.message : '删除成功',
        })
        getAllArticle();

    })
}


</script>
<style scoped lang="scss">
.card {
    box-sizing: border-box;
    min-height: 100%;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .el-select {
        width: 300px;
    }

    .fixed-pagination {
        margin-top: 20px;
        justify-content: flex-end;
        position: fixed;
        right: 50px;
        bottom: 110px;
    }

    .avatar-uploader {
        :deep() {

            .el-upload--picture-card {
                width: 178px;
                height: 178px;
                line-height: 178px;
            }

            .el-upload-list--picture-card {
                .el-upload-list__item {
                    width: 178px;
                    height: 178px;
                }
            }


            .avatar {
                width: 178px;
                height: 178px;
                display: block;
            }

            /* 上传组件样式 */
            .el-upload {
                /* 设置虚线边框，使用主题变量定义边框颜色 */
                border: 2px dashed var(--el-border-color);
                /* 圆角6px */
                border-radius: 6px;
                /* 鼠标悬停时显示手型指针 */
                cursor: pointer;
                /* 相对定位，为子元素绝对定位做准备 */
                position: relative;
                /* 隐藏溢出内容 */
                overflow: hidden;
                /* 添加过渡动画效果，使用主题变量定义过渡时间 */
                transition: var(--el-transition-duration-fast);
            }

            /* 上传组件悬停状态 */
            .avatar-uploader .el-upload:hover {
                /* 悬停时边框颜色变为主题主色 */
                border-color: var(--el-color-primary);
            }

            /* 上传图标样式 */
            .el-icon.avatar-uploader-icon {
                /* 设置图标大小 */
                font-size: 28px;
                /* 图标颜色为黑色 */
                color: #000000;
                /* 设置宽高与图片预览区域一致 */
                width: 178px;
                height: 178px;
                /* 文字居中显示 */
                text-align: center;
            }
        }
    }

    .editor {
        width: 100%;

        /* 
         * :deep() 是 Vue 的样式穿透选择器
         * 作用：允许修改子组件内部的样式
         * 使用场景：当需要修改第三方组件库或子组件的内部样式时
         * 这里用于设置富文本编辑器 ql-editor 的最小高度为 200px
         */
        :deep(.ql-editor) {
            min-height: 200px;
        }
    }
}
</style>
