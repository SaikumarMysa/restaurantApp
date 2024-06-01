const express = require('express');
const router = express.Router();
const userController = require('./../Controllers/userController');
const userAuthController=require('./../Controllers/userAuthController');
router.post('/signup',userAuthController.signUp)
router.post('/login',userAuthController.login)
router.get('/me',userAuthController.protect,userController.getMe,userController.getUserId)
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
.get(userAuthController.protect,
userAuthController.restrictTo('subadmin','admin'),
userController.getAllUsers)
.post(userAuthController.protect,
userAuthController.restrictTo('superadmin','admin'),
userController.createUser
)
 router
.route('/:id')
.get(userAuthController.protect,
userAuthController.restrictTo('subadmin','admin'),
userController.getUserId)
   
.patch(userAuthController.protect,
userAuthController.restrictTo('superadmin','admin'),
userController.updateUser)

.delete(userAuthController.protect,
userAuthController.restrictTo('superadmin'),
userController.deleteUser)

module.exports=router;
