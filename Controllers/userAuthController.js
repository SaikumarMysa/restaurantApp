const jwt=require('jsonwebtoken');
const User=require('./../Models/userModel')
const Cart=require('./../Models/cartModel');
const AppError=require('./../utils/appError');
const crypto=require('crypto');
const sendEmail=require('./../utils/email');
//SIGNUP
exports.signUp=async(req,res,next)=>{
    try{
        const newUser=await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            role:req.body.role
        })
        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRES_IN
        });
        res.status(201).json({
            status:'success',
            token,
            data:{
                user:newUser
            }
        })
        }catch(err){
            res.status(400).json({
                status:'fail',
                message:err.message
            })
        }
}

//LOGIN
exports.login=async(req,res,next)=>{
    //user provides email,password
    const {email,password} = req.body;
    //1. check whether user has given email, password in body field
    if (!email||!password) {
    return next (new AppError('Please provide email and password',400))  
    }
    //2.1 check if there's actually a user with given email in our db
    //2.2 also check is the given password is correct
    const user=await User.findOne({email}).select('+password');
    //console.log(user)
    const correct=await user.correctPassword(password,user.password)
    if(!user || !correct){
       return next(new AppError('Incorrect email or password',400))
    }
    //3.When there is correct password and user exists in db send a token to user
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
    res.status(200).json({
        status:'success',
        token

    })
    next();
}

//Protecting routes from random login's
exports.protect= async (req,res,next) => {
    //1.provide token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
    }
    //check token is there or not
    if(!token){
        return next(new AppError('You are not loggin in, please login to get access',401))
    }
    // 2. check whether given token is valid or not
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log('decoded: '+decoded);
    // 3. check if user still exists in our db
    const currentUser= await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The User belonging to this token doesnot exist',401))
      }
    // 4. Checking if user has changed his password after token issused
     if(currentUser.changedPasswordAfter(decoded.iat)){ 
        return next(new AppError('User has recently changed his password, please log in again',401))
     }
     //When everything is clear grant permisson to protected route
     req.user=currentUser;
     next();
}

//Restrict To: authorized admins
exports.restrictTo=(...roles)=>{

    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
           return next(new AppError('You do not have Permission to perform this action',403))
        }
        next();
    }
}

//cart validation
 exports.checkCart =async (req,res,next)=>{
    //console.log('in check')
    const userId=req.body.userId;
    //console.log('in check 2')
    //console.log(adminId)
     const cart = await Cart.findOne({userId});
     //console.log('in check 3')
     if(!cart){
        //console.log('in check 4')
         return next ()
     }else if(cart){
        next(new AppError('A cart exists!',400))
     }
     next();
    }
//FORGOT PASSWORD
exports.forgotPassword=async(req,res,next)=>{
    //1.check whether if there's a user with given email
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return next(new AppError('No user found with this email',400));
    }
    //2. If user exists with given email then create a passwordResetToken
    const resetToken=user.createPasswordResetToken()
    //return resetToken;
    await user.save({validateBeforeSave:false});
    //3.send a resetUrl which is having a resetPassword to user,s email
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    //console.log(resetUrl)
    const message=`Forgot your Password? Submit a patch request with your new password and passwordConfirm to: ${resetUrl}.\n If you donot forgot your password, please ignore this email`;
    try{
        await sendEmail({
            email:user.email,
            subject:'your password reset token valid for 10min',
            message
        })
    res.status(200).json({
        status:'success',
        message:'Token sent to email'
    })
}catch(err){
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save({
        validateBeforeSave:false
    });
    return next(new AppError('There was an error sending the email! Try again later',500))
}
next();
}

//RESET PASSWORD
exports.resetPassword=async(req,res,next)=>{
    //1. get user based on token provided 
    const hashedToken=crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
    //console.log(hashedToken)
    const user=await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{$gt:Date.now()}
    })
    console.log(user)
    //2.if there's a user based on given token,set a new password
    if(!user){
        return next(new AppError('Invalid password reset Token or reset password expired!',400))
    }
    user.password=req.body.password;
    user.passwordConfirm=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    //3.send a token jwt to user
     const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
     res.status(200).json({
        status:'success',
        token
     })
     next();
}

