<template>
    <el-card>
        <template #header>
            <div>
                <span>更换头像</span>
            </div>
        </template>
        <el-upload>
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <img v-else :src="funina" width="120" />
        </el-upload>
        <br />
        <el-button type="primary" :icon="Plus" size="large">选择图片</el-button>
        <el-button type="success" :icon="Upload" size="large">上传头像</el-button>
    </el-card>
</template>

<script setup>
import funina from "@/assets/funina.jpg"
</script>

<style></style>