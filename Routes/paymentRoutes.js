const express=require('express');
const paymentController=require('./../Controllers/paymentController');
const userAuthController=require('./../Controllers/userAuthController');
const router=express.Router();
router
.get('/checkOut-session/:cartId',
userAuthController.protect,
paymentController.getCheckOutSession)
module.exports=router;

