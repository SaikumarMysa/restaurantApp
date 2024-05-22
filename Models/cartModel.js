const mongoose=require('mongoose');
const cartSchema=new mongoose.Schema({
      adminId:{
        type:String,
        required:true
      },
      items:[{
        type:mongoose.Schema.ObjectId,
        ref:'Fooditem'
      }],
      quantity:Number
})

//querymiddleware
cartSchema.pre(/^find/,function(next){
  this.populate({
    path:'items',
    select:'-__v'
  });
  next();
})
const Cart=mongoose.model('Cart',cartSchema);
module.exports=Cart;