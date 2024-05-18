const mongoose=require('mongoose');
const customerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name!']
    },
    email:{
        type:String,
        required:[true,'Please provide email!'],
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,'Please provide Password'],
        minlength:8
    },
    passwordConfirm:{
        type:String,
        required:[true,'please provide password'],
        validate:{
            validator:function(el){
               return el===this.password
            }
        }
    }
    
})
const Customer=mongoose.model('Customer',customerSchema);
module.exports=Customer;