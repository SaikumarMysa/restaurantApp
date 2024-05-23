const mongoose=require('mongoose');
const Cart=require('./cartModel');
const OrderSchema=new mongoose.Schema({
    adminId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    cartId:{
        type:mongoose.Schema.ObjectId,
        ref:'Cart'
    },
    orderSummary:[
        {
            subTotalPrice:Number,
            gst:Number,
            shippingCharges:Number,
            statusOrder:{
                type:String,
                enum:['processing','pending','cancelled','completed']
            },
            finalTotalPrice:Number,
            billingAddress:String
        }
    ]
    
})
const Order=mongoose.model('Order',OrderSchema);
module.exports=Order;