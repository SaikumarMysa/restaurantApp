const mongoose=require('mongoose');
const cartSchema=new mongoose.Schema({
      adminId:{
        type:mongoose.Schema.ObjectId,
        ref:'Admin',
        //unique:[true,'A Cart already exists!']
      },
      items:[{
        type:mongoose.Schema.ObjectId,
        ref:'Fooditem'
      }],
      quantity:Number
})

//document middleware
cartSchema.pre('save',function(next){
  //console.log('save data')
  next();
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