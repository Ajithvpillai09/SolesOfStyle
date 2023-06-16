const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({
    category :{
        type:String,
        required:true
    }, 
    isDeleted:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
}
)


const Catogory = mongoose.model('Catogory',categorySchema );

module.exports = Catogory;