const Order=require('./../Models/orderModel');
const Cart=require('./../Models/cartModel');
const catchAsync=require('./../utils/catchAsync');
const itemSchema = require('../Models/itemSchema');
// CREATE ORDER
exports.createOrder=catchAsync(async(req,res)=>{
    const {userId,orderItems, gst, shippingCharges, shippingAddress1, shippingAddress2, city, zip, phone } = req.body;
    //getting the detail of cart by passing cart id
    let cart=await Cart.findById(orderItems);
    if(!cart) res.status(400).json({
        status:'fail',
        message:'no cart'
    })
    //calculate for subTotalPrice
    const subTotalPrice=cart.items.reduce((acc,item)=>acc+item.quantity*item.price,0)
    //create new order
    const newOrder=new Order({
        userId,
        orderItems,
        subTotalPrice,
        gst,
        shippingCharges,
        shippingAddress1,
        shippingAddress2,
        city,
        zip,
        phone
    })
    await newOrder.save();
    res.status(201).json({
    status:'success',
    data:{
        newOrder
        }
    })         
})

//GET ORDERS
exports.getOrder=catchAsync(async(req,res)=>{
    const userId=req.params.userId
    const order=await Order.findOne({userId})
    res.status(200).json({
        status:'success',
        data:{
            order
        }
    })
})
