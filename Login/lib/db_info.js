const mysql=require('mysql');

var connection=mysql.createConnection({
    connectionLimit: 10,
    host:'localhost',
    port: '3306',
    user:'root',
    password:'',
	database:'users'
});

module.exports=connection;