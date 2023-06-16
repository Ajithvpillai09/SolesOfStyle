const Product = require('../models/productSchema')
const Cart = require('../models/cartSchema')
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    addProductsToCart: async (userId,proId)=>{
        const productId = new ObjectId(proId);
        const product = await Product.findOne({_id:proId})
        let taxAmount = Math.floor((product.dealPrice/100)*12)
        
        try{
            const quantity = 1;
            let productObj = {
                item:productId,
                quantity:quantity,
                currentPrice:product.dealPrice,
                tax:taxAmount,
                orderStatus:"processing"
            }
            
            let userCart = await Cart.findOne({userId:new ObjectId(userId)})
            if(userCart){
                let proExist = userCart.products.findIndex(product=> product.item.toString() === productId.toString())
                if(proExist != -1){
                   
                    // await Cart.updateOne(
                    //     {userId,"products.item":productId},
                    //     {$inc:{"products.$.quantity":1}}
                    // )
                }else{
                    await Cart.updateOne({userId},{$push:{products:productObj}})
                }
              }else{
                const cartObj = new Cart({
                    userId:userId,
                    products:[productObj] 

                });
             await Cart.create(cartObj)
            }
        }catch(e){
            console.error(e);
            res.status(500).send("Internal server error");
        }
    },
    getCartProducts: async (userId)=>{
        
        userId = userId.toString();
        try{
            cartItems = await Cart.aggregate([
                {
                    $match:{userId},
                },
                {
                    $unwind:"$products",
                },
                {
                    $project:{
                        userId:{$toObjectId:userId},
                        item:{$toObjectId:"$products.item"},
                        quantity:"$products.quantity",
                        currentPrice:"$products.currentPrice",
                        tax:"$products.tax",
                        unique_id:"$products._id"
                    }
                },
                {
                    $lookup:{
                        from:"products",
                        localField:"item",
                        foreignField:"_id",
                        as:"productInfo"
                    }
                },{
                  $project:{
                    userId:1,
                    unique_id:1,
                    item:1,
                    quantity:1,
                    currentPrice:1,
                    tax:1,
                    productInfo:{$arrayElemAt:["$productInfo",0]}

                  }  
                }

            ]);
            
            return cartItems;
            
        }catch(e){
            console.log(e,"error on getting cart products");
        }
        
       
    },
    getCartTotal:async (userId,discount)=>{
        let response = {};
        try{
            let grandTotal = await Cart.aggregate([
                {
                    $match:{userId},
                },
                {
                    $unwind:"$products",
                },
                {
                    $project:{
                        discount:1,
                        item:{$toObjectId:"$products.item"},
                        quantity:"$products.quantity",
                        currentPrice:"$products.currentPrice",
                        tax:"$products.tax",
                    },
                },
                {
                    $lookup:{
                        from:"products",
                        localField:"item",
                        foreignField:"_id",
                        as:"productInfo",
                    },
                },
                {
                  $project:{
                    discount:1,
                    item:1,
                    quantity:1,
                    currentPrice:1,
                    tax:1,
                    productInfo:{$arrayElemAt:["$productInfo",0]},

                  },  
                },
                {
                  $group:{ 
                    _id:null,
                    totalTax:{$sum:{$multiply:["$quantity","$tax"]}},
                    total:{$sum:{$multiply:["$quantity","$currentPrice"]}},
                    totalWithTax:{
                        $sum:{
                            $multiply:["$quantity",{$add:["$tax","$currentPrice"]}],
                        }
                    },
                    totalWithDiscount:{
                        $sum:{
                            $multiply:["$quantity",{$add:["$tax","$currentPrice"]}],
                        }

                    },
                    discount: { $first: "$discount" }
                  }  
                },
          ]);
         
          if(grandTotal.length === 0){
            response.status = true
            return response
          }
          if(discount){
            response.discount = discount;
            response.totalWithTax = grandTotal[0].totalWithTax-discount
          }else{
            response.totalWithTax = grandTotal[0].totalWithTax;
          }
          response.status = true;        
          response.totalTax = grandTotal[0].totalTax;
          response.total = grandTotal[0].total;
          response.discount = grandTotal[0].discount;
         
          return response;

        }catch(e){
            console.log(e,"error in getting total of cart");
        }


    },
    getProductQuantity: async (cart,product,count,quantity,user)=>{
        let object = {};
        count = parseInt(count)
        quantity = parseInt(quantity)
      
      
        try{
            if(count === -1 && quantity === 1){
                object.minus = true;
                return object;
            }else{
                if(count != -1){
                   
                  let products =  await Product.findById(product);
               
                  if(quantity >= products.inStock){
                    object.ourOfStock = false
                    return object
                  }else{
                    console.log("i have entered to increment quatity");
                     product = new ObjectId(product)
                    await Cart.updateOne({_id:cart,'products.item':product},
                    {
                        $inc:{'products.$.quantity':count}
                    }
                    )
                    object.ourOfStock = true;
                    return object
                  }
                }else{
                    console.log("i have entered to decrement quatity");
                     product = new ObjectId(product)
                    await Cart.updateOne(
                    {
                        _id:cart,'products.item':product
                    },
                    {
                        $inc:{'products.$.quantity':count}
                    }
                    )
                    object.ourOfStock = true;
                    return object

                }
            }
           
        }catch(e){
            console.log(e,"error in getting product quantity");
        }

    },
    removeCartItem: async(cartId,productId)=>{
        try{
            let unique_id = new ObjectId(productId)
            await Cart.updateOne(
               {
                _id:cartId
               },
               {
                $pull:{products:{_id:unique_id}}
               }
            )

        }catch(e){
            console.log(e,"error in removing cart item");
        }

    },
    getCartItems: async (userId)=>{
        try{
            let cartItems = await Cart.findOne({userId:userId})
            return cartItems;

        }catch(e){
          console.log(e);
        }
    },
    addDiscount: async (userId,discount)=>{
        try{
              await Cart.updateOne({userId:userId},{
                $set:{discount:discount}
              })

        }catch(e){
            console.log(e)
        }
    },
    removeDiscount:async (userId)=>{
        try{
            await Cart.updateOne({userId:userId},{
                $set:{discount:0}
              })
        }catch(e){
            console.log(e)
        }
    }
   
}