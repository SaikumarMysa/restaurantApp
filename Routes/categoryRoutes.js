const express=require('express');
const router=express.Router();
const categoryController=require('./../Controllers/categoryController');
const userAuthController=require('./../Controllers/userAuthController');
router
.route('/')
.get(categoryController.getAllCategories)
.post(userAuthController.protect,userAuthController.restrictTo('superadmin','admin'),categoryController.createCategory)
router
.route('/:id')
.get(categoryController.getCategoryById)
.patch(userAuthController.protect,userAuthController.restrictTo('superadmin','admin'),categoryController.updateCategory)
.delete(userAuthController.protect,userAuthController.restrictTo('superadmin'),categoryController.deleteCategory)
module.exports=router;
