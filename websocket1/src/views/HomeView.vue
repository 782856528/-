<template>
  <div class="test">
    <!-- 用户 -->
    <div class="people">
      <!-- 搜索 -->
      <!-- 用户列表 -->
      <div class="people_box" v-if="nameList.length > 0">
        <div
          class="item_p"
          @click="checkPeople(item.username)"
          :class="[item.username == defaultName ? 'active' : '']"
          v-for="(item, index) in nameList"
          :key="index"
        >
          <!-- 姓名 -->
          <div>{{ item.username }}</div>
        </div>
      </div>
    </div>
    <!-- 聊天室 -->
    <div class="textbox">
      <div class="title">聊天室</div>
      <div
        style="overflow: auto; height: 296px"
        ref="scoll"
        v-if="msgList && msgList.length > 0"
      >
        <div class="msgbox" v-for="(item, index) in msgList" :key="index">
          <div class="sender" v-if="item.type == 'sender'">
            <div>{{ item.time }}</div>
            <div>{{ item.content }}</div>
          </div>
          <div class="receiver" v-else>
            <div>{{ item.time }}</div>
            <div>{{ item.content }}</div>
          </div>
        </div>
      </div>
      <span class="send">
        <textarea v-model="content" @keyup.enter="send"></textarea>
        <div class="btn"><button @click="send">发送</button></div>
      </span>
    </div>
  </div>
</template>

<script>
import axios from "../utils/request";
import store from "../store";

export default {
  name: "WebsocketConnectTest",
  data() {
    return {
      wsUrl: `ws://116.205.137.182:8999/${
        JSON.parse(store.state.userinfo).username
      }`, // ws地址
      websock: null, // ws实例
      content: "",
      msgList: [],
      nameList: JSON.parse(store.state.friendInfo),
      defaultName: JSON.parse(store.state.friendInfo)[0].username,
      peopleName: JSON.parse(store.state.userinfo).username,
    };
  },
  async mounted() {
    this.initWebSocket();
    const res = await axios({
      method: "get",
      url: `/list?name=${this.peopleName}&sendName=${this.defaultName}`,
    });
    this.msgList = res.data.data || [];
    this.$nextTick(() => {
      if (this.$refs.scoll.scrollHeight) {
        this.$refs.scoll.scrollTop = this.$refs.scoll.scrollHeight + 296;
        console.log(this.$refs.scoll.scrollTop);
      }
    });
  },
  unmounted() {
    // 离开路由之后断开websocket连接
    this.websock.close();
  },
  updated(){
this.$nextTick(() => {
      if (this.$refs.scoll.scrollHeight) {
        this.$refs.scoll.scrollTop = this.$refs.scoll.scrollHeight + 296;
        console.log(this.$refs.scoll.scrollTop);
      }
    });
  },
  methods: {
    // 初始化weosocket
    initWebSocket() {
      if (typeof WebSocket === "undefined")
        return console.log("您的浏览器不支持websocket");
      this.websock = new WebSocket(this.wsUrl);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    checkPeople(e) {
      this.defaultName = e;
      this.initWebSocket();
      axios({
        method: "get",
        url: `/list?name=${this.peopleName}&sendName=${this.defaultName}`,
      }).then((res) => {
        this.msgList = res.data.data || [];
      });
    },
    send() {
      var d = new Date();
      var times =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();
      let opt = {
        senderId: this.peopleName,
        receiverId: this.defaultName,
        content: this.content,
        type: "sender",
        time: times,
      };
      let actions = {
        senderId: this.peopleName,
        receiverId: this.defaultName,
        content: this.content,
        type: "sender",
        time: times,
      };
      this.msgList.push(opt);
      this.websocketsend(JSON.stringify(actions));
      this.content = "";
      this.$nextTick(() => {
        if (this.$refs.scoll.scrollHeight) {
          this.$refs.scoll.scrollTop = this.$refs.scoll.scrollHeight + 296;
          console.log(this.$refs.scoll.scrollTop);
        }
      });
    },
    websocketonerror() {
      // 连接建立失败重连
      this.initWebSocket();
    },
    websocketonmessage(e) {
      var d = new Date();
      var times =
        d.getFullYear() +
        "-" +
        (d.getMonth() + 1) +
        "-" +
        d.getDate() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes() +
        ":" +
        d.getSeconds();
      let opt = {
        senderId: this.peopleName,
        receiverId: this.defaultName,
        content: JSON.parse(e.data),
        time: times,
        type: "receiver",
      };
      this.msgList.push(opt);
      axios({
        method: "post",
        url: `/sendName`,
        data: opt,
      }).then((res) => {
        console.log(res);
      });
    },
    websocketsend(Data) {
      // 数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      // 关闭
      console.log("断开连接", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.test {
  display: flex;
  margin: 0 auto;
  width: 1100px;
  ::-webkit-scrollbar { width: 3px; height: 10px;color: #eee; }
  .people {
    height: 600px;
    width: 200px;
    border: solid 1px #dedcdb;
    background: #eee;
    overflow: auto;
  }
  .active {
    background: #c6c4c4;
  }
  .people_box {
  }
  .item_p {
    line-height: 20px;
    height: 80px;
    border: solid 1px #eee;
    text-align: left;
    padding-left: 10px;
    color: darkgray;
  }
  .item_p:hover {
    background: #dddbda;
  }
}
.textbox {
  width: 800px;
  height: 600px;
  overflow: auto;
  position: relative;
  background: #fff;
  box-shadow: 0 0 1px;
  .title {
    font-size: 18px;
    text-align: center;
    font-weight: bold;
    height: 50px;
    border-bottom: solid 1px #eee;
    line-height: 50px;
  }
  .send {
    position: absolute;
    bottom: 0;
    width: 800px;
    display: inline-block;
    left: 0;
    overflow: hidden;
    padding-bottom: 20px;
    .btn {
      display: flex;
      justify-content: flex-end;
    }
    textarea {
      width: 100%;
      height: 200px;
      font-size: 20px;
      border: none;
      background: #fff;
      word-wrap: break-word;
      box-sizing: border-box;
      outline: none;
      resize: none;
      border-top: solid 1px #eee;
    }
    button {
      border: none;
      background: #fff;
      width: 80px;
      font-size: 14px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #05bbab;
      background: #d2d2d2;
      border-radius: 4px;
      margin-right: 20px;
    }
  }
  .sender {
    text-align: right;
    :first-child {
      color: red;
    }
  }
  .receiver {
    text-align: left;
    :first-child {
      color: blue;
    }
  }
}
</style>
