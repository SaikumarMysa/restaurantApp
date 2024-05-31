const express = require('express');
const router = express.Router();
const userController = require('./../Controllers/userController');
const authController=require('./../Controllers/authController');
const userAuthController=require('./../Controllers/userAuthController');
router.post('/signup',userAuthController.signUp)
router.post('/login',userAuthController.login)
router.get('/me',userAuthController.protect,userController.getMe,userController.getUser)
router.post('/forgotPassword',userAuthController.forgotPassword)
router.patch('/resetPassword/:token',userAuthController.resetPassword)
// router.patch('/updateMyPassword',authController.protect,authController.updatePassword)
router.patch('/updateMe',
userAuthController.protect,
userController.uploadUserPhoto,
userController.resizeUserPhoto,
userController.updateMe)
router.delete('/deleteMe',userAuthController.protect,userController.deleteMe);
router
.route('/')
.get(authController.protect,authController.restrictTo('superadmin','admin'),userController.getAllUsers)
 router
   .route('/:id')
   .get(userController.getUser)


module.exports=router;