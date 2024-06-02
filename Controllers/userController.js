const User=require('./../Models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');
const multer=require('multer');
const sharp=require('sharp');
const multerStorage=multer.memoryStorage({
  filename:(req,file,cb)=>{
    const ext=file.mimetype.split('/')[1];
    cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
  
  }
})
const multerFilter=(req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true);
  }else{
    cb(new AppError('Not an image!please upload only images',400),false)
  }
}
const upload=multer({
  storage:multerStorage,
  fileFilter:multerFilter
})
exports.uploadUserPhoto=upload.single('photo');
exports.resizeUserPhoto=(req,res,next)=>{
  if(!req.file) return next();
  req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
  .resize(500,500)
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`public/img/users/${req.file.filename}`);
  next();
}
exports.getMe=(req,res,next)=>{
  req.params.id =req.user.id;
  next();
}
//GET USER BY ID
exports.getUserId=catchAsync(async(req,res)=>{
      const user=await User.findById(req.params.id).populate({path:'reviews',select:' review rating fooditem'})
      res.status(200).json({
      status:'success',
      data:{
          user
      }
  })
})

//GET ALL USERS
exports. getAllUsers=catchAsync(async(req,res,next)=>{
      const users=await User.find(req.query);
      res.status(200).json({
      status:'success',
      results:users.length,
      data:{
          users
      }
  })
  next();
});

//CREATE USER
exports.createUser=catchAsync(async(req,res)=>{
      const newUser=await User.create(req.body);
      res.status(201).json({
          status:'success',
          data:{
              newUser
          }
      })
})

//UPDATE USER
exports.updateUser=catchAsync(async(req,res)=>{
  const updatedUser=await User.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
    res.status(200).json({
      status:'success',
        data:{
            newUser:updatedUser
          }
      })
})

//DELETE USER
exports.deleteUser=catchAsync(async(req,res)=>{
  const user=await User.findByIdAndUpdate(req.params.id,{active:false});
    res.status(200).json({
    status:'success',
    data:null
  })
})

//UPDATE CURRENT USER
exports.updateMe=catchAsync(async(req,res)=>{
 //1.create error if user posts password related data
 if(req.body.password||req.body.passwordConfirm){
   return next(new AppError('This route is not for password update, Please use updateMyPassword',400))
 }
 //2.Filter out unwanted field names that are not allowed to updated
 const filterObj=(obj,...allowedFields)=>{
   const newObj={};
   Object.keys(obj).forEach(el=>{
     if(allowedFields.includes(el)) newObj[el]=obj[el]; 
   })
   return newObj;
 }
 //3.update User document
 const filterBody=filterObj(req.body,'name','email')
 if(req.file) filterBody.photo=req.file.filename;
 const updatedUser=await User.findByIdAndUpdate(req.user.id,filterBody,{new:true, runValidators:true})
 res.status(200).json({
   status:'success',
   data:{
     user:updatedUser
   }
 })
})

//DELETE CURRENT USER
exports.deleteMe=catchAsync(async(req,res)=>{
  await User.findByIdAndUpdate(req.user.id,{active:false});
  res.status(204).json({
    status:'success',
    data:null
  })
})






