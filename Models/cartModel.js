const mongoose=require('mongoose');
const Food=require('./foodModel')
const cartSchema=new mongoose.Schema({
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
        quantity:{
            type:[Number],
            required:[true,'please provide quantity']
        },
        price:Number       
})
const Cart=mongoose.model('Cart',cartSchema);