const mongoose=require('mongoose');
const foodSchema=new mongoose.Schema({
    item_id:{
        type:String,
        required:[true,'provide item_id']
    },
    category_id:Number,
    category:String,
    item_name:{
        type:String,
        required:[true,'food item should have a name'],
        trim:true,
        lowercase:true,
    },
    description:{
        type:String,
        trim:true
    },
    price:Number,
    images:String
})
const Food=mongoose.model('Food',foodSchema);
module.exports=Food;