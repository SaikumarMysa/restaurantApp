const mongoose=require('mongoose');
const Cart=require('./cartModel');
const orderSchema=new mongoose.Schema({
    adminId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    cartId:{
        type:mongoose.Schema.ObjectId,
        ref:'Cart'
    },
    products:[{
        type:mongoose.Schema.ObjectId,
        ref:'Fooditem'
    }],
    quantity:Number,
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
    statusOrder:{
    type:String,
    enum:['processing','pending','cancelled','completed']
    },
    // finalTotalPrice:{
    //     type:Number,
    //     required:true
    // },
    billingAddress:{
        type:String,
        required:true
    },
    orderDate:{
        type:Date,
        default:Date.now()
    }
}
,{
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
        path:'products',
        select:'foodItem_name price'
    })
    next();
})




const Order=mongoose.model('Order',orderSchema);
module.exports=Order;