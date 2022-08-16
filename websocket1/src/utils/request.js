import axios from "axios";
import store from "../store";
// 创建axios
const service = axios.create({
  baseURL: "http://116.205.137.182:8085",
});

//post请求头
service.defaults.headers.post["Content-Type"] =
  "multipart/form-data;charset=UTF-8";

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (store.state.token) {
      // config.headers["authorization"] = store.state.token;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    console.log("res", response);
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;
