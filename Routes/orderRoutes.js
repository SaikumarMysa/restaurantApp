const express =require('express');
const orderController=require('./../Controllers/orderController');
const userAuthController=require('./../Controllers/userAuthController');
const router=express.Router();
router
.route('/:userId')
.get(userAuthController.protect,orderController.getOrder)
.post(userAuthController.protect,userAuthController.setUserId,orderController.createOrder) 
module.exports=router;