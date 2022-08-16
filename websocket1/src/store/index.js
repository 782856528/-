import { createStore } from "vuex";

export default createStore({
  state: {
    userinfo: localStorage.getItem("userinfo")&&localStorage.getItem("userinfo")?localStorage.getItem("userinfo"):{},
    friendInfo:localStorage.getItem("friendInfo") &&localStorage.getItem("friendInfo")?localStorage.getItem("friendInfo"):[],
    token:localStorage.getItem("token")||""
  },
  getters: {},
  mutations: {
    set_userinfo(state,userinfo) {
      state.userinfo=JSON.stringify(userinfo)

      localStorage.setItem("userinfo",JSON.stringify(userinfo));
    },
    set_friendInfo(state,friendInfo) {
      state.friendInfo=JSON.stringify(friendInfo)

      localStorage.setItem("friendInfo",JSON.stringify(friendInfo));
    },
    set_token(state,token){
      state.token=JSON.stringify(token)
      localStorage.setItem("token",JSON.stringify(token));
    }
  },
  actions: {
    set_userinfo(context,userinfo) {
      context.commit("set_userinfo",userinfo)
    },
    set_friendInfo(context,friendInfo) {
      context.commit("set_friendInfo",friendInfo)
    },
    set_token(context,token){
      context.commit("set_token",token)
    }
  },
});
