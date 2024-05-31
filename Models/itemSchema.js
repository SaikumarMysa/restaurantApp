const mongoose=require('mongoose');
const Fooditem=require('./foodItemModel');
const itemSchema=new mongoose.Schema({
    itemId:{
        type:mongoose.Schema.ObjectId,
        ref:'Fooditem',
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:[1,'Quantity cannot be less than 1']
    },
    price:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true
    }
}
);
module.exports=itemSchema;
