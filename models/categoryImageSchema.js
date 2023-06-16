const mongoose = require('mongoose');

const CategoryImageSchema = new mongoose.Schema({
   category:
      {
        type: String,
        required: true
      },
     
      image:
        { 
            type : String,
            required:true
        }
},
{
    timestamps:true
});

const CategoryImage = mongoose.model('CategoryImage',CategoryImageSchema);

module.exports = CategoryImage;