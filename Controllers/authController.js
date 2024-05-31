const jwt=require('jsonwebtoken');
const Admin=require('./../Models/adminModel')
const Cart=require('./../Models/cartModel');
const AppError=require('./../utils/appError');
//SIGNUP
exports.signUp=async(req,res,next)=>{
    try{
        const newAdmin=await Admin.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            role:req.body.role
        })
        const token=jwt.sign({id:newAdmin._id},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRES_IN
        });
        res.status(201).json({
            status:'success',
            token,
            data:{
                admin:newAdmin
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
    const admin=await Admin.findOne({email}).select('+password');
    const correct=await admin.correctPassword(password,admin.password)
    if(!admin || !correct){
       return next(new AppError('Incorrect email or password',400))
    }
    //3.When there is correct password and user exists in db send a token to user
    const token=jwt.sign({id:admin._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
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
    //console.log('token for login:'+token)
    //check token is there or not
    if(!token){
        return next(new AppError('You are not loggin in, please login to get access',401))
    }

    // 2. check whether given token is valid or not
     
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    //console.log('decoded: '+decoded);

    // 3. check if user still exists in our db

    const currentAdmin= await Admin.findById(decoded.id);
    
      if(!currentAdmin){
        return next(new AppError('The Admin belonging to this token doesnot exist',401))
      }

    // 4. Checking if admin has changed his password after token issused
     if(currentAdmin.changedPasswordAfter(decoded.iat)){
        
        return next(new AppError('Admin recently changed his password, please log in again',401))
     }

     //When everything is clear grant permisson to protected route
     req.admin=currentAdmin;
     next();
}

//Restrict To: authorized admins
exports.restrictTo=(...roles)=>{
    return (req, res, next) => {
        if(!roles.includes(req.admin.role)){
           return next(new AppError('You do not have Permission to perform this action',403))
        }
        next();
    }
}

//cart validation
 exports.checkCart =async (req,res,next)=>{
    //console.log('in check')
    const adminId=req.body.adminId;
    //console.log('in check 2')
    //console.log(adminId)
     const cart = await Cart.findOne({adminId});
     //console.log('in check 3')
     if(!cart){
        //console.log('in check 4')
         return next ()
     }else if(cart){
        next(new AppError('A cart exists!',400))
     }
     next();
    }
