const express=require('express');
const router=express.Router();
const categoryController=require('./../Controllers/categoryController');
const authController=require('./../Controllers/authController');
router
.route('/')
.get(categoryController.getAllCategories)
.post(authController.protect,authController.restrictTo('superadmin','admin'),categoryController.createCategory)
router
.route('/:id')
.get(categoryController.getCategoryById)
.patch(authController.protect,authController.restrictTo('superadmin','admin'),categoryController.updateCategory)
.delete(authController.protect,authController.restrictTo('superadmin'),categoryController.deleteCategory)
module.exports=router;
