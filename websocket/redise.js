


let redis = require("redis"),
RDS_PORT = 6379, //端口号
RDS_HOST = "116.205.137.182", //服务器IP  要连接的A服务器redis
//   RDS_PWD = "123456", //密码
RDS_OPTS = {}, //设置项
client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
 
client.on("error", function (err) {
 console.log("Error " + err);
});
 
let setKey = (key,value) =>{
 return new Promise((resolve, reject) => {
  client.set(key,value,(err,replay)=>{
   if(err){
    reject(err);
   }else{
    resolve(replay);
   }
  })
 })
};
 
let getKey = (key)=>{
 return new Promise((resolve, reject) => {
  client.get(key,(err,replay)=>{
   if(err){
    reject(err);
   }else{
    resolve(replay);
   }
  })
 })
};
 
module.exports = {
 setKey,getKey
};

