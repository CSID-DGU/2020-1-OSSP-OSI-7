const express=require('express');
const router=express.Router();

router.get('/logout_process',function(req,res){
  req.logout();
  req.session.save(function(){
    res.redirect('/login');
  })
});

module.exports=router;