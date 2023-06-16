const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    brand:{
        type : String,
        require : true
    },
    productname:{
        type : String,
        required : true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
      },
    price:{
        type : Number,
        required : true
    },
    dealPrice:{
        type:Number,
        required:true
    },
    inStock:{
        type:Number,
        required:true
    }
    ,
    images:[
        { type : String }
    ],
    description:{
        type:String,
        required:true

    },
    deleted: {
        type: Boolean,
        default: false
    }
});


const Products  = mongoose.model('Products',productSchema)

module.exports = Products;