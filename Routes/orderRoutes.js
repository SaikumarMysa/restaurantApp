const express =require('express');
const orderController=require('./../Controllers/orderController');
const router=express.Router();
router
.route('/')
.get(orderController.viewOrder)
.post(orderController.createOrder)
module.exports=router;