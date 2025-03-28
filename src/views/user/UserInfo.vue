<template>
    <el-card>
        <template #header>
            <span>基本资料</span>
        </template>
        <el-form :rules="rules" :model="userInfoData.info">
            <el-form-item label="登录名称" style="width: 600px;">
                <el-input disabled v-model="userInfoData.info.username"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" style="width: 600px;" prop="nickname">
                <el-input v-model="userInfoData.info.nickname"></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" style="width: 600px;" prop="email">
                <el-input v-model="userInfoData.info.email"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="UpdateUser">提交修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup>
import { userUpdateSercice } from '@/api/user';
import { useUserInfoStore } from '@/stores/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';


// const userInfoData = ref({})
const userInfoData = useUserInfoStore();


const rules = {
    nickname: [
        { required: true, message: "请输入输入用户名称", trigger: "blur" },
        { pattern: /^[\S]{2,10}$/, message: "昵称必须是2~10位非空字符", trigger: "blur" }
    ],
    email: [
        { required: true, message: "请输入用户邮箱", trigger: "blur" },
        { type: 'email', message: "邮箱格式不正确", trigger: "blur" }
    ]
}

const UpdateUser = async () => {
    let result = await userUpdateSercice(userInfoData.info)
    ElMessageBox.confirm(
        '确定要修改吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        ElMessage({
            type: 'info',
            message: result.message,
            type: 'success'
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '取消修改',
        })
    })
}

</script>
<style scoped lang="scss"></style>