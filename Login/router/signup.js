const express=require('express');
const template=require('../lib/template');
const con=require('../lib/db_info');
const router=express.Router();
const crypto=require('crypto');

router.get('/sign_up',function(req,res){
  res.send(template.SIGNUP());
});

router.post('/signup_process',function(req,res,next){ //회원가입 정보 데이터베이스 삽입
    var userID=req.body.id;
    var userPW=req.body.pw;
    var userEM=req.body.email;
    var salt= Math.round((new Date().valueOf() * Math.random())) + "";
    var hashPassword = crypto.createHash("sha512").update(userPW + salt).digest("hex");
  
    con.query('INSERT INTO info (name,password,email,salt) VALUES(?,?,?,?)',[userID,hashPassword,userEM,salt],
    function(error,result,fields){
      if(error){
             res.send('your email is already used!');
      }
      else {
          res.redirect("/login");	
      }
      });
  });

module.exports=router;