const express =require('express');
const orderController=require('./../Controllers/orderController');
const authController=require('./../Controllers/authController')
const router=express.Router();
router
.route('/:userId')
.get(orderController.getOrder)
.post(orderController.createOrder)
    
module.exports=router;