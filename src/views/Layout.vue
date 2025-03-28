<template>
  <!-- element-plus中的容器 -->
  <el-container class="layout-container">
    <!-- 左侧侧边栏 -->
    <el-aside width="200px">
      <!-- element-plus菜单标签 -->
      <el-menu router>
        <el-menu-item index="/article/category">
          <el-icon>
            <Management />
          </el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <!-- element-plus子菜单标签 -->
        <el-sub-menu>
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/info">
            <el-icon>
              <User />
            </el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon>
              <Crop />
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/resetpassword">
            <el-icon>
              <EditPen />
            </el-icon>
            <span>更换密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!-- 右侧侧边栏 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>用户名:<strong>{{ getUserInfo.info.nickname }}</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box"><el-avatar :src="funina" /></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="User" command="info">基本资料</el-dropdown-item>
              <el-dropdown-item :icon="Crop" command="avatar">更换头像</el-dropdown-item>
              <el-dropdown-item :icon="EditPen" command="resetpassword">更换密码</el-dropdown-item>
              <el-dropdown-item :icon="SwitchButton" command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 底栏容器 -->
      <el-footer> 文章管理系统 ©2025 Created by Yuxia </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  EditPen,
  Crop,
  SwitchButton,
} from "@element-plus/icons-vue";
import avatar from "@/assets/avatar.jpg";
import funina from "@/assets/funina.jpg"
import { ref } from "vue";
import { useUserInfoStore } from "@/stores/user";
import { userInfoService } from "@/api/user";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useTokenStore } from "@/stores/token";

const TokenStore = useTokenStore();
const getUserInfo = useUserInfoStore();
const router = useRouter();

const userInfo = async () => {
  let result = await userInfoService();
  // 存储pinia
  getUserInfo.info = result.data;
}
userInfo();

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm(
      '确定要退出登录吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(async () => {
      TokenStore.removeToken();
      getUserInfo.removeInfo();
      router.push('/login')
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出',
      })
    })
  } else {
    router.push('/user/' + command)
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  // background-color: #ffffff;

  .el-aside {
    background-color: #ffffff;

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    margin: 16px;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>