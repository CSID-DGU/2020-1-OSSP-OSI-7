const express=require('express');
const template=require('../lib/template');
router=express.Router();

router.get('/home',function(req,res){
   res.send(template.HOME(req.user.name+'님 반갑습니다!'));
});

module.exports=router;