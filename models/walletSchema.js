const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    userId:{
        type:String,
        required :true
    },
    walletAmount:{
        type:Number,
        required:true
    },
    transactions:[
        {
     amount:{type:Number,required:true},
     date:{type:Date,required:true}   
       }
    ]
   
},{
    timestamps:true
});

const Wallet = mongoose.model('Wallet',WalletSchema);

module.exports = Wallet;