<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <el-button type="primary" @click="
          dialogFormVisible = true;
        title = '添加分类';
        ">添加分类</el-button>
      </div>
      <!-- *********************************弹窗******************************************* -->
      <el-dialog v-model="dialogFormVisible" width="500" :title="title">
        <el-form :model="categoryModel" label-width="100px" style="padding-right: 30px" :rules="rules">
          <el-form-item label="分类名称" prop="categoryName">
            <el-input v-model="categoryModel.categoryName"></el-input>
          </el-form-item>
          <el-form-item label="分类别名" prop="categoryAlias">
            <el-input v-model="categoryModel.categoryAlias"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div>
            <el-button @click="
              dialogFormVisible = false;
            categoryDelect();
            ">取消</el-button>
            <el-button @click="categoryAllCongig(title)" type="primary">确定</el-button>
          </div>
        </template>
      </el-dialog>


      <!-- ******************************************************************************** -->
    </template>
    <el-table style="width: 100%" :data="categoryData">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="categoryName" label="分类名称" />
      <el-table-column prop="categoryAlias" label="分类别名" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="success" :icon="Edit" circle plain @click="showUpdateCategory(row)" />
          <el-button type="danger" :icon="Delete" circle plain @click="showDeleteCategory(row)" /></template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </el-card>
</template>

<script setup>
import { Delete, Edit, Message } from "@element-plus/icons-vue";
import { ref } from "vue";
//编辑弹窗的config函数
const categoryAllCongig = (title) => {
  if (title === "添加分类") {
    addCategory();
  } else if (title === "编辑分类") {
    updateCategory();
  } else {
    ElMessage({
      showClose: true,
      message: "操作异常",
      type: "error",
    });
  }
};
//控制弹窗
const dialogFormVisible = ref(false);
//定义弹窗的标题
let title = ref("");
//编辑分类点击事件的函数
const showUpdateCategory = (row) => {
  dialogFormVisible.value = true;
  title.value = "编辑分类";
  // 将当前行的数据填充到表单模型
  categoryModel.value = {
    categoryName: row.categoryName,
    categoryAlias: row.categoryAlias,
    //向后台传递的id
    id: row.id,
  };
};

//删除文章分类点击事件的函数
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
    let result = await ArticleCategoryDeleteService(row.id);
    ElMessage({
      type: 'success',
      message: result.message ? result.message : '删除成功',
    })
    getAllCategory();

  })
  // .catch(() => {
  //   ElMessage({
  //     type: 'info',
  //     message: '',
  //   })
  // })
};

//添加分类数据模型
const categoryModel = ref({
  categoryName: "",
  categoryAlias: "",
});

//添加分类表单校验
const rules = {
  categoryName: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
  ],
  categoryAlias: [
    { required: true, message: "请输入分类别名", trigger: "blur" },
  ],
};
//点击事件清空数据模型函数
const categoryDelect = () => {
  categoryModel.value = {
    categoryName: "",
    categoryAlias: "",
  };
};
//表单数据模型
const categoryData = ref([]);
import {
  ArticleCategoryListService,
  ArticleCategoryAddService,
  ArticleCategoryUpdateService,
  ArticleCategoryDeleteService,
} from "@/api/article";
//声明一下异步函数
const getAllCategory = async () => {
  let rusult = await ArticleCategoryListService();
  categoryData.value = rusult.data;
};
getAllCategory();
//调用添加文字的接口
import { ElMessage, ElMessageBox } from "element-plus";
const addCategory = async () => {
  let result = await ArticleCategoryAddService(categoryModel.value);
  ElMessage({
    showClose: true,
    message: result.message ? result.message : "添加成功",
    type: "success",
  });
  dialogFormVisible.value = false;
  categoryDelect();
  getAllCategory();
};
//调用编辑分类的接口
const updateCategory = async () => {
  let result = await ArticleCategoryUpdateService(categoryModel.value);
  ElMessage({
    showClose: true,
    message: result.message ? result.message : "修改成功",
    type: "success",
  });
  dialogFormVisible.value = false;
  // categoryDelect();
  getAllCategory();
};


</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center; //当布局方向为默认的 row 时，交叉轴是垂直方向 center 值实现垂直居中效果
    justify-content: space-between; //当布局方向为默认的 row 时，主轴是水平方向 space-between 值实现两端对齐+自动间距效果 首尾元素紧贴容器边缘，中间元素等间距分布
  }
}
</style>