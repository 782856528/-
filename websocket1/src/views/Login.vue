<template>
  <div class="login">
    <div>
      <div class="title">
        <h1>后台管理系统-模板</h1>
      </div>
      <div class="box">
        <div class="bg1">
          <img src="@/assets/base.png" alt="" />
        </div>
        <!-- form start -->
        <div class="form">
          <div>
            <h2 class="s-title">后台管理系统模板</h2>
            <el-form
              autoComplete="on"
              :model="loginForm"
              :rules="loginRules"
              ref="form"
              label-position="left"
            >
              <el-form-item prop="username">
                <el-input
                  type="text"
                  v-model="loginForm.username"
                  size="default"
                  autoComplete="on"
                  placeholder="请输入帐号"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  name="password"
                  :type="pwdType"
                  size="default"
                  @keyup.enter="handleLogin(form)"
                  v-model="loginForm.password"
                  autoComplete="on"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="default"
                  style="width: 100%"
                  :loading="Loading"
                  @click.prevent="handleLogin(form)"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- form end -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElForm, ElInput, ElFormItem, ElButton } from "element-plus";

import { useStore } from "vuex";

import { reactive, ref } from "vue";

import { useRouter } from "vue-router";
import axios from "../utils/request";
const router = useRouter();
const store = useStore();
const form = ref();
const pwdType = ref("password");

const loginForm = reactive({
  username: "",
  password: "",
});
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
const handleLogin = async () => {
  const opt = {
    username: loginForm.username,
    password: loginForm.password,
  };
  let res = await axios({
    method: "post",
    url: `/login`,
    data: opt,
  });
  store.dispatch("set_userinfo", res.data.data.result[0]);
  store.dispatch("set_token", res.data.data.token);
  let res1 = await axios({
    method: "post",
    url: `/searchFrend`,
    data: { frendId: res.data.data.result[0].frendId },
  });
  store.dispatch("set_friendInfo", res1.data.data.result);

  router.push("/");
};
</script>

<style lang="scss" scoped>
.login {
  background-color: #e8f0fb;
  min-height: 100vh;
  min-width: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  .title {
    width: 996px;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    height: 100px;
    color: #236ef8;
    box-sizing: border-box;
    padding-bottom: 20px;
    margin-bottom: 10px;
    h1 {
      margin: 0 20px 0 0;
      font-size: 34px;
    }
    p {
      color: #0099ff;
      font-size: 17px;
    }
  }
  .box {
    width: 996px;
    height: 529px;
    background-color: #ffffff;
    display: flex;
    box-shadow: 0px 0px 21px 0px rgba(0, 99, 234, 0.32);
    border-radius: 10px;
    overflow: hidden;
    .bg1 {
      width: 550px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .form {
    width: calc(100% - 550px);
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    .s-title {
      width: 100%;
      text-align: center;
      font-weight: bold;
      margin-bottom: 27px;
      color: #333;
      font-size: 22px;
    }

    :deep(.el-form) {
      width: 240px;
    }
  }
}
</style>
