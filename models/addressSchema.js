const mongoose = require('mongoose');


const AddressSchema =new mongoose.Schema({
   user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
   },
   address:[
    {
        firstname:{
            type:String,
            required: true
        },
        lastname:{
            type:String,
            required: true
        },
        state:{
            type:String,
            required:true   
        },
        streetaddress:{
            type:String,
            required:true
        },
        appartment:{
            type:String,
            required:true
        },
        town:{
            type:String,
            required:true
        },
        zip:{
            type:Number,
            required:true
        },
        mobile:{
            type:Number,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        radio:{
            type:String,
            required:true
        }
    }
   ]
},
{
    timestamps:true
});

const Address = mongoose.model('Address',AddressSchema)

module.exports = Address;