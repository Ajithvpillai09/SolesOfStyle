const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    
    sub_category:{
        type:String,
        required:true
        },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
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

const SubCategory  = mongoose.model('SubCategory',subCategorySchema);

module.exports = SubCategory;