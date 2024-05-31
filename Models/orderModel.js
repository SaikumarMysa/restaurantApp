const mongoose=require('mongoose');
const User=require('./userModel')
const Cart=require('./cartModel');
const itemSchema=require('./../Models/itemSchema')
const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    orderItems:{//here passing the cart id
        type:mongoose.Schema.ObjectId,
        ref:'Cart'
    },
    subTotalPrice:{
        type:Number,
        required:true
    },
    gst:{
        type:Number,
        required:true
    },
    shippingCharges:{
        type:Number,
        required:true
    },
    shippingAddress1:{
        type:String,
        required:true
    },
    shippingAddress2:{
        type:String,
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['pending','processing','completed','cancelled'],
        default:'processing'
    },
    orderDate:{
        type:Date,
        default:Date.now()
    }
},
{
    toJSON:{virtuals:true},  
    toObject:{virtuals:true}
}  
)
// //virtual for finalTotalPrice:data will not be saved in db
orderSchema.virtual('finalTotalPrice').get (function(next){
    return this.subTotalPrice + this.gst + this.shippingCharges;
    next();
});
//querymiddleware
orderSchema.pre(/^find/,function(next){
    this.populate({
        path:'orderItems',
        select:'-_id -userId'
    })
    next();
})
const Order=mongoose.model('Order',orderSchema);
module.exports=Order;