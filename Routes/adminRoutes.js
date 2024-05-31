const express=require('express');
const router=express.Router();
const adminController=require('./../Controllers/adminController')
const authController=require('./../Controllers/authController');
router.post('/signup',authController.signUp);
router.post('/login',authController.login);
router.get('/myProfile',authController.protect,adminController.getProfile,adminController.getAdminById)
router
.route('/')
.get(adminController.getAllAdmins)
.post(authController.protect,authController.restrictTo('superadmin','admin'),adminController.createAdmin)
router
.route('/:id')
.get(adminController.getAdminById)
.patch(authController.protect,authController.restrictTo('superadmin','admin'),adminController.updateAdmin)
.delete(authController.protect,authController.restrictTo('superadmin'),adminController.deleteAdmin)
module.exports=router;