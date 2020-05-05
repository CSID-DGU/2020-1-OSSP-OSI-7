module.exports={
    LOGIN:function(fm1='',fm2=''){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Login</title>
        <link href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round" rel="stylesheet">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <link rel="stylesheet" href="/css/login.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        </head>
        <body>
        <!-- Modal HTML -->
        <div id="myModal">
            <div class="modal-dialog modal-login">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="avatar">
                            <img src="/imgs/avatar.png" alt="Avatar">
                        </div>				
                        <h4 class="modal-title">Member Login</h4>	
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form action="/login_process" method="post">
                            <div class="form-group">
                                <input type="text" class="form-control" name="email" placeholder="이메일 주소" required="required">	
                                <nav style="color:#FF0000;">${fm1}</nav>	
                            </div>
                            <div class="form-group">
                                <input type="password" class="form-control" name="pw" placeholder="비밀번호" required="required">	
                                <nav style="color:#FF0000;">${fm2}</nav>
                            </div>        
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-lg btn-block login-btn">로그인</button>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <a href="/sign_up">회원가입 →</a>
                    </div>
                </div>
            </div>
        </div>     
        </body>
        </html> 
        `;
    },SIGNUP:function(fm=''){
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">
        <title>Sign Up</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="/css/signup.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <script>
         function validate(){
             var inputPW=document.getElementById("inputPW").value;
             var checkPW=document.getElementById("checkPW").value;
             var resultStatus=true;

             if(inputPW!=checkPW){
                 resultStatus=false;
             }
             if(resultStatus==false){
                 alert("비밀번호를 확인해 주세요!");
             }
          return resultStatus;
         }
        </script>
        </head>
        <body>
        <div class="signup-form">
            <form action="/signup_process" method="post" onsubmit="return validate();">
                <h2>회원가입</h2>
                <p>Please fill in this form to create an account!</p>
                <hr>
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon"><i class="fa fa-user"></i></span>
                        <input type="text" class="form-control" name="id" placeholder="이름" required="required">
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon"><i class="fa fa-paper-plane"></i></span>
                        <input type="email" class="form-control" name="email" placeholder="이메일 주소" required="required">
                    </div>
                    <nav style="color:#FF0000;">${fm}</nav>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                        <input type="text" class="form-control" id="inputPW" name="pw" placeholder="비밀번호" required="required">
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="fa fa-lock"></i>
                            <i class="fa fa-check"></i>
                        </span>
                        <input type="text" class="form-control" id="checkPW" name="confirm_password" placeholder="비밀번호 확인" required="required">
                    </div>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-lg">Sign Up</button>
                </div>
            </form>
            <div class="text-center">Already have an account? <a href="/login">Login here</a></div>
        </div>
        </body>
        </html>    
        `;
    },HOME:function(nn){
        return `
        <html>
        <head>
        <title>success</title>
        </head>
        <body>
         <h1>로그인 성공</h1>
         <p>${nn}</p>
         <a href=/logout_process>로그아웃</a>
        </body>
        </html>
        `;
    }
}
