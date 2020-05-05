const express=require('express');
const template=require('../lib/template');
const con=require('../lib/db_info');
const flash=require('connect-flash');
const router=express.Router();
const crypto=require('crypto');

router.use(flash());
router.get('/sign_up',function(req,res){
  var fmsg=req.flash('EMerr');
  var feedback='';
  
  feedback=fmsg[0];
  res.send(template.SIGNUP(feedback));
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
          req.flash('EMerr','Email already Exist!');
          res.redirect('/sign_up');
      }
      else {
          res.send(`
          <script type="text/javascript">alert("가입이 완료되었습니다!");</script>
          res.send('<script type="text/javascript">location.href="/login";</script>');
          `);
      }
      });
  });

module.exports=router;
