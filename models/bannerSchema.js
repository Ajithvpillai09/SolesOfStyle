const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      images:[
        { type : String }
    ],
      createdAt: {
        type: Date,
        default: Date.now
      }
});

const Banner = mongoose.model('Banner',BannerSchema);

module.exports = Banner;