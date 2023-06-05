var Validator = {};

Validator.validatePassword = function(password){
    console.log(password);
    //var pattern = new RegExp("(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$");
    var re = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
 
    if((re.test(password))){
        return true;
        // let err = new Error();
        // err.status = 200;
        // err.message = "you got it";
        // throw err;
    }else{
        let err = new Error();
        err.status = 400;
        err.message = "Password is invalid";
        throw err;
    }
}
 
Validator.validateEmail = function(email){
    //var pattern = new RegExp("^[A-Z0-9+_.-]+@[A-Z0-9.-]+$");
    
    var pattern = new RegExp("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
    if((pattern.test(email))){
        return true;
    }else{
        let err = new Error();
        err.status = 400;
        err.message = "Email is invalid";
        throw err;
    }
}

Validator.validatePhone = function(phone){
    //var pattern = new RegExp("^[A-Z0-9+_.-]+@[A-Z0-9.-]+$");
   
    var patterns = new RegExp("[0-9]{10}");
    
    
    if((patterns.test(phone))){
        return true;
    }else{
        let err = new Error();
        err.status = 400;
        err.message = "Phone number is invalid";
        throw err;
    }
}

module.exports = Validator;