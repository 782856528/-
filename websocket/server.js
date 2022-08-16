var express = require("express");

const url = require("url");
const { WebSocketServer } = require("ws");
const { connection } = require("./connect");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var http = require("http");
const { setKey, getKey } = require("./redise");
var app = express();

app.use(bodyParser.json());
const wss = new WebSocketServer({
  port: 8999,
});
let wsList = {};
app.all("*", function (req, res, next) {
  let no_router = ['/login']
  console.log(req.url)

    if (!req.get("Origin")) return next();
  // use "*" here to accept any origin
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ("OPTIONS" == req.method) return res.send(200);
  next();
  
  
});
app.get("/list", async (req, res) => {
  let query = url.parse(req.url).path;
  // key为客户端传参的uuid
  var key = query.split("?name=")[1];
  var key1 = query.split("&sendName=")[1];
  let list = await getKey("list");
  if (JSON.parse(list) && JSON.parse(list).length > 0) {
    let dataList = JSON.parse(list).filter((i) => {
      return i.senderId == key || i.receiverId == key1;
    });
    res.send({ data: dataList });
  } else {
    res.send();
  }
});
app.post("/sendName", urlencodedParser, async (req, res) => {
  let list = await getKey("list");
  let arr = list && JSON.parse(list).length > 0 ? JSON.parse(list) : [];
  arr.push(req.body);
  await setKey("list", JSON.stringify(arr));
  res.send("请求成功");
});
app.post("/addFrend", urlencodedParser, async (req, res) => {
  let list = await getKey("list");
  let arr = list && JSON.parse(list).length > 0 ? JSON.parse(list) : [];
  arr.push(req.body);
  await setKey("list", JSON.stringify(arr));
  res.send("请求成功");
});
app.post("/searchFrend", urlencodedParser, async (req, res) => {
  let arr = [];
  JSON.parse(req.body.frendId).forEach((element) => {
    var sql = `SELECT * FROM user where id='${element}'`;
    connection.query(sql, function (err, result) {
      if (err) {
        console.log("[SELECT ERROR] - ", err.message);
        return;
      }
      arr.push(JSON.parse(JSON.stringify(result))[0]);
      const opt = {
        data: {
          result: arr,
        },
        message: "查询朋友成功",
      };
      if (JSON.parse(req.body.frendId).length == arr.length) {
        res.send(opt);
      }
    });
   
  });
});
app.post("/login", urlencodedParser, async (req, res) => {
  var sql = `SELECT * FROM user where password='${req.body.password}' and username = '${req.body.username}'`;
  connection.query(sql, function (err, result) {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }
    if (result.length > 0) {
      const opt = {
        data: {
          result: result,
          token: jwt.sign(
            { username: "用户名" },
            //2. 私钥
            "secret12345",

            //3. 过期时间
            {
              expiresIn: 3600 * 24 * 3,
            }
          ),
        },
        message: "登陆成功",
      };
      res.send(opt);
    } else {
      res.send("登陆失败");
    }
  });
});
var server = app.listen(8085, function () {
  var host = server.address().address;
  var port = server.address().port;
});
wss.on("connection", (ws, req) => {
  // console.log("客户端已连接", req.socket.remoteAddress);
  let query = url.parse(req.url).path;
  // key为客户端传参的uuid
  var key = query.split("/")[1];
  function broadcast(server, msg) {
    server.connections.forEach(function (conn) {
      conn.sendText(msg);
    });
  }
  // 将创建的连接收集起来
  wsList[key] = ws;
  ws.on("message", async (data) => {
    let list = await getKey("list");
    let arr = list && JSON.parse(list).length > 0 ? JSON.parse(list) : [];
    arr.push(JSON.parse(data));
    await setKey("list", JSON.stringify(arr));
    var messageArray = JSON.parse(data);
    var toUserWebSocket = wsList[JSON.parse(data)["receiverId"]];
    if (toUserWebSocket) {
      messageArray["senderId"] = key;
      // key为客户端传参的uuid
      toUserWebSocket.send(JSON.stringify(messageArray.content));
    }
  });
});
