const Cart = require('../models/cartSchema')
   

const Count = async (req,res,next)=>{
    if(req.session.userLoggedIn){
        let userId = req.session.user._id
        let cart = await Cart.findOne({userId:userId})
        if(cart){
            let count = cart.products.length;
            req.cartcount = count;
        }
       
    } 
    next()
   
}

module.exports = {
    Count
}