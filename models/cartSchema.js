const mongoose = require('mongoose')
const { ObjectId } = require('bson');


const CartSchema = new mongoose.Schema({
    userId:{
        type:String,
        required :true
    },
    discount:{
        type:Number,
        default:0
    },
    products:[
            {
            item:{
               type:ObjectId,
               required:true
            },
            quantity: {
                type:Number,
                required:true
            },
            currentPrice:{
               type:Number,
               required:true
            },
            tax:{
               type:Number,
               required:true
            },
            orderStatus:{
                type:String,
            }
          }
        ]
},
{
    timestamps:true
});

const Cart = mongoose.model('Cart',CartSchema);
module.exports = Cart;

