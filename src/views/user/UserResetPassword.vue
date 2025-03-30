<template>
    <el-card>
        <template #header>
            <div>
                <span>更换密码</span>
            </div>
        </template>
        <el-form :rules="rules" :model="PwdData">
            <el-form-item label="旧密码" style="width: 400px;" prop="old_pwd">
                <el-input v-model="PwdData.old_pwd" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" style="width: 400px;" prop="new_pwd">
                <el-input v-model="PwdData.new_pwd" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" style="width: 400px;" prop="re_pwd">
                <el-input v-model="PwdData.re_pwd" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="UpdatePwd">提交修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup>
import { userUpdatePwdService } from '@/api/user';
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'

//密码的校验函数
const CheckRePassword = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请再次输入确认密码"));
    } else if (value !== PwdData.value.new_pwd) {
        callback(new Error("两次输入的密码不正确"));
    } else {
        callback();
    }
};
const ChecknewPassword = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入新密码"));
    } else if (value === PwdData.value.old_pwd) {
        callback(new Error("新密码不能与旧密码相同"));
    } else {
        callback();
    }
};
const rules = {
    old_pwd: [
        { required: true, message: "请输入旧密码", trigger: "blur" },
        {
            min: 5,
            max: 16,
            message: "格式不正确,长度应该为5~16位",
            trigger: "blur",
        },
    ],
    new_pwd: [
        {
            required: true, validator: ChecknewPassword, trigger: "blur"
        },
    ],
    re_pwd: [{ required: true, validator: CheckRePassword, trigger: "blur" }],
}

//密码的数据模型
const PwdData = ref(
    {
        old_pwd: "",
        new_pwd: "",
        re_pwd: ""
    }
)
//修改密码接口的函数
const UpdatePwd = () => {
    ElMessageBox.confirm(
        '确定要修改吗？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        let result = await userUpdatePwdService(PwdData.value)
        ElMessage({
            showClose: true,
            message: '更改成功，请重新登陆',
            type: 'success',
        })
        setTimeout(() => {
            window.location.reload()
        }, 1500) // 延迟1.5秒刷新，让用户看到成功提示
    })
}
</script>