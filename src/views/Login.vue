<template>
  <el-row class="login-page">
    <el-col class="bg" :span="12"></el-col>
    <el-col class="form" :span="6" :offset="2">
      <!-- 注册模块 -->
      <el-form ref="from" size="large" autocomplete="off" v-if="isRegister" :model="registerDate" :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerDate.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" placeholder="请输入密码" type="password" show-password
            v-model="registerDate.password"></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input :prefix-icon="Lock" placeholder="请再次输入密码" type="password" show-password
            v-model="registerDate.rePassword"></el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-link type="primary" @click="
            isRegister = false;
          clearData();
          " :underline="false">
            ← 去登录
          </el-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" auto-insert-space class="button" @click="register">注册</el-button>
        </el-form-item>
      </el-form>

      <!-- 登录模块 -->
      <el-form ref="form" size="large" autocomplete="off" v-else :model="registerDate" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" type="username" v-model="registerDate.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" placeholder="请输入密码" type="password" show-password
            v-model="registerDate.password"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住密码</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item class="flex">
          <el-link type="primary" @click="
            isRegister = true;
          clearData();
          " :underline="false">去注册 →</el-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" auto-insert-space class="button" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
//控制注册与登录表单的显示， 默认显示登录
const isRegister = ref(false);
//用于注册的数据模型
const registerDate = ref({
  username: "",
  password: "",
  rePassword: "",
});
//清空数据模型
const clearData = () => {
  registerDate.value = {
    username: "",
    password: "",
    rePassword: "",
  };
};
//密码的校验函数
const CheckRePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入确认密码"));
  } else if (value !== registerDate.value.password) {
    callback(new Error("两次输入的密码不正确"));
  } else {
    callback();
  }
};
//表单校验
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 5,
      max: 16,
      message: "格式不正确,长度应该为5~16位",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 5,
      max: 16,
      message: "格式不正确,长度应该为5~16位",
      trigger: "blur",
    },
  ],
  rePassword: [{ validator: CheckRePassword, trigger: "blur" }],
};
import { useTokenStore } from "@/stores/token";
const tokenStore = useTokenStore();
//导入路由器，实现跳转
import { useRouter } from "vue-router";
const router = useRouter();
//调用后台接口
import { requestUserService, loginUserService } from "@/api/user";
const register = async () => {
  //响应式是数据需要用value
  let result = await requestUserService(registerDate.value);
  // if (result.code === 0) {
  //   //成功
  //   alert(result.message ? result.message : "注册成功");
  // } else {
  //   alert("注册失败");
  // }
  ElMessage({
    showClose: true,
    message: "注册成功",
    type: "success",
  });
  //将得到的token存储到pinia
  tokenStore.setToken(result.data);
  //跳转页面，完成路由
  router.push("/login");
};
//调用登录接口
const login = async () => {
  let result = await loginUserService(registerDate.value);
  // if (result.code === 0) {
  //   //成功
  //   alert(result.message ? result.message : "登录成功");
  // } else {
  //   alert("登录失败");
  // }
  ElMessage({
    showClose: true,
    message: "登录成功",
    type: "success",
  });
  tokenStore.setToken(result.data);
  router.push("/");
};

</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url("@/assets/login_bg.jpg") no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 11 auto;
      font-size: 11;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>