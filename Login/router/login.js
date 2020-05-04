const express=require('express');
const template=require('../lib/template');
const con=require('../lib/db_info');
const crypto=require('crypto');
const flash=require('connect-flash');
const router=express.Router();

con.connect();
router.use(flash());

router.get('/login',function(req,res){
  var fmsg=req.flash();
  var feedback='';
  var feedback2='';
  if(fmsg.error){
    feedback=fmsg.error[0];
  }
  if(feedback=='Incorrect Password'){feedback2=feedback; feedback='';}
  res.send(template.LOGIN(feedback,feedback2));
});

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) { //로그인 성공 시 딱 한번 호출
  done(null, user.email);
});

passport.deserializeUser(function(email, done) { //로그인 후 방문할 때마다 사용자 확인을 위해 호출
    con.query("select * from info where email = ?",email,function(err,rows){	
    done(err, rows[0]);
    });
  });

  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'pw'
    },
    function (useremail, password, done) {
      con.query("select * from info where email=?",useremail,function(error,result,fields){
         if(result.length>0){
          var salt=result[0].salt;
          var hspw=crypto.createHash("sha512").update(password + salt).digest("hex");
            if(hspw==result[0].password){
               return done(null,result[0]);
            }
            else{
              return done(null,false,{
                message: 'Incorrect Password'
              });
            }
         }
         else{
           return done(null,false,{
             message: 'Incorrect Email'
           });
         }
      });
    }
  ));  

router.post('/login_process',
passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

module.exports=router;