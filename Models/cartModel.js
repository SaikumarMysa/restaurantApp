const mongoose=require('mongoose');
const User=require('./userModel');
const itemSchema=require('./itemSchema');
const cartSchema=new mongoose.Schema({
      userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
      items:[itemSchema],
      subTotal:{
        type:Number,
        default:0
      },
    active:{
      type:Boolean,
      default:true,
      select:false
    }
});
//document middleware
cartSchema.pre('save',function(next){
  next();
})
//querymiddleware
cartSchema.pre(/^find/,function(next){
  //this points to the current query
  this.find({active:{$ne:false}})
  next();
});
const Cart=mongoose.model('Cart',cartSchema);
module.exports=Cart;