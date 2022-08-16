let mysql = require('mysql');
let connection = mysql.createConnection({
    host: '116.205.137.182',
    user: 'wml',
    password: 'weimengli521.',
    database: 'wml'
});

module.exports={connection}
  
  

