const mongoose=require('mongoose');
const Customer=require('./customerModel');
const Cart=require('./cartModel');
const OrderSchema=new mongoose.Schema({
    customer_name:{
        type:String,
        required:[true,'provide  customer name']
    },
    order_id:String,
    order_date:{
        type:Date,
        default:Date.now()
    },
    item_id:{
        type:String,
        required:[true,'provide item_id']
    },
    item_name:{
        type:String,
        required:[true,'food item should have a name'],
        trim:true,
        lowercase:true
    },
    quantity:Number,
    price:{
        type:Number,
        required:true
    },
    Items:Number,
    TotalAmount:Number
})
const Order=mongoose.model('Order',OrderSchema);