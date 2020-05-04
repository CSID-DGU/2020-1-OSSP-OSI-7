const express=require('express');
const app = express();
const session=require('express-session');
const bodyparser=require('body-parser');

app.use(session({ 
	secret : 'keyboard cat',  
	resave : false,
	saveUninitialized : true, })
);

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));

const login=require('./router/login');
const siguup=require('./router/signup');
const home=require('./router/home');
const logout=require('./router/logout');
app.use('',login);
app.use('',siguup);
app.use('',home);
app.use('',logout);

app.listen(3000);