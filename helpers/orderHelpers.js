const Order = require('../models/orderSchema');
const Cart = require('../models/cartSchema');
const Wallet = require('../models/walletSchema')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const Razorpay = require('razorpay');
const { totalmem } = require('os');
const User = require('../models/userSchema');


var instance = new Razorpay({
  key_id: process.env.RAZOR_KEY_ID,
  key_secret: process.env.RAZOR_SECRET_KEY,
});

module.exports = {
    placeOrder : async (deliveryAddress,products,orderTotal,payment_option)=>{
      let status = payment_option === "COD" ? 'pending' : 'placed';
      let orderStatus = status === "pending" ? 'Order Confirmed' : 'Order Processing'
    
        for(let i = 0 ; i < products.products.length; i++){
          products.products[i].orderStatus = orderStatus
        }
  
    
        const order = new  Order({
            deliveryDetails:{
                firstname:deliveryAddress.firstname,
                lastname:deliveryAddress.lastname,
                state:deliveryAddress.state,
                streetaddress:deliveryAddress.streetaddress,
                appartment:deliveryAddress.appartment,
                town:deliveryAddress.town,
                zip:deliveryAddress.zip,
                mobile:deliveryAddress.mobile,
                email:deliveryAddress.email,
                radio:deliveryAddress.radio
            },
            userId:products.userId,
            paymentMethod:payment_option,
            products:products.products,
            discount:orderTotal.discount,
            totalAmount:orderTotal.totalWithTax-orderTotal.discount,
            paymentMethod:payment_option,
            paymentStatus:status,
            createdAt: new Date(),
       })
        
        try{

          let orderDoc =  await Order.create(order)
          
          // await Cart.findOneAndDelete({userId:products.userId});
          return orderDoc;

        }catch(e){

        }

        
    },
    deleteCart:async(id)=>{
      try{
         await Cart.findOneAndDelete({userId:id})
      }catch(e){
        console.log(e);
      }

    },
    getOrders: async  (id)=>{
      try{
        let orders = await Order.find({userId:id})
        return orders;
      }catch(e){
        console.log(e);
      }
    },
    getOrdersById : async (id)=>{
      try{
        let orders = await Order.findById(id)
        return orders
      }catch(e){
        console.log(e);
      }
     
    },
    getOrderDetails:async (id)=>{
      id = new ObjectId(id)
      try{
         let orders = await Order.aggregate([
          {
            $match:{_id:id},
          },
          {
            $lookup:{
              from:"products",
              localField:"products.item",
              foreignField:"_id",
              as:"productInfo"

            },
          },
          {
            $project:{
              _id:1,
              deliveryDetails:1,
              userId:1,
              paymentMethod:1,
              products:1,
              discount:1,
              totalAmount:1,
              paymentStatus:1,
              createdAt:1,
              productInfo:1,
              productInfo:{
                $map:{
                  input: "$productInfo",
                  as: "p",
                  in: {
                    _id: "$$p._id",
                    productname: "$$p.productname",
                    images: "$$p.images",
                    quantity: {
                      $arrayElemAt: [
                        "$products.quantity",
                        {
                          $indexOfArray: ["$products.item", "$$p._id"],
                        },
                      ],
                    },
                   
                    currentPrice: {
                      $arrayElemAt: [
                        "$products.currentPrice",
                        {
                          $indexOfArray: ["$products.item", "$$p._id"],
                        },
                      ],
                    },
                    tax: {
                      $arrayElemAt: [
                        "$products.tax",
                        {
                          $indexOfArray: ["$products.item", "$$p._id"],
                        },
                      ],
                    },
                    orderStatus:{
                      $arrayElemAt: [
                        "$products.orderStatus",
                        {
                          $indexOfArray: ["$products.item", "$$p._id"],
                        },
                      ],
                    },
                    deliveredDate:{
                      $arrayElemAt: [
                        "$products.deliveredDate",
                        {
                          $indexOfArray: ["$products.item", "$$p._id"],
                        },
                      ],
                    },

                  }, 
                }
              }
            }
          },
          // {
          //   $unwind:"$productInfo"
          // }
         
       ]);
       return orders;

      }catch(e){
        console.log(e);
      }
    },
    changeStatus:async(orderId,productId,status)=>{
        try{
         
        let order = await Order.updateOne({ _id: orderId, "products": { $elemMatch: { 'item':productId } } },
        {
            $set: {
                'products.$.orderStatus': status
            }
        }
    )
       
     if(status === "Delivered"){
         await Order.updateOne({_id: orderId, "products": { $elemMatch: { 'item':productId } }},
         {
          $set:{
            'products.$.deliveredDate': Date.now()
          }
         }
         )

         await Order.updateOne({_id: orderId},
         {
          $set:{
            paymentStatus:'placed'
          }
         }
         )

     }
    
      }catch(e){

      }
      
    },
    changeRazorStatus: async (orderId)=>{
         orderId = new ObjectId(orderId)
       try{
        await Order.updateOne({_id:orderId},
          {
             $set:{
              'products.$[].orderStatus':"Order Confirmed"
             }
          }
          )
       }catch(e){
        console.log(e);
       }

    },
    deleteOrder:async (orderId)=>{
      orderId = new ObjectId(orderId)
      try{
        await Order.deleteOne({_id:orderId})
      }catch(e){
        console.log(e);
      }
    },
    getAllOrders: async ()=>{
      try{

        let orders = await Order.find()
            .populate({
              path: 'userId',
              model: 'User',
              select: 'name email phone' 
            })
            .exec();
          
        return orders;

      }catch(e){
        console.log(e);
      }
    },
    generateRazorpay:(orderId,total)=>{
       total = parseInt(total)

      return new Promise((resolve, reject) => {
      

            var options = {
                amount: total * 100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "" + orderId
            };


        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err)
            } else {
                console.log('razor payyyyyyyyyyyy');
                console.log(order);
                resolve(order)
            }
        });
    })
},

     verifyPayment:(details)=>{
        return new Promise((resolve,reject)=>{
          const crypto = require('crypto');
          let hmac = crypto.createHmac('sha256', 'c1hjaXxvUMt7nYkjJ54jeFhp')

          hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
          hmac = hmac.digest('hex')
          if (hmac == details['payment[razorpay_signature]']) {
              console.log('become equal tooooooooo');
              resolve()
          } else {
              console.log('entered to case not equalllllllllllllll');
              reject()
          }

        })


     },
     returnOrder:async(details)=>{
        
         await Order.updateOne(
          {
            _id:details.orderId,
            "products": { $elemMatch: { 'item':details.productId } }
          },
          {
            $set:{
              'products.$.orderStatus':"Return requested",
               'products.$.returnReason':details.text
              }
          })
        },
        walletPayment : async (userId,totalAmount)=>{
          let response = {}
          let wallet = await Wallet.findOne({userId:userId})
          if(!wallet){
            response.message = `you dont have money in wallet`
            response.wallet = false;
          }else if(wallet.walletAmount < totalAmount){
            let amount = totalAmount-wallet.walletAmount
            response.message = `you need ${amount} more to procedd wallet transaction`
            response.wallet = false;
          }else{
            await Wallet.updateOne({userId:userId},{
              $inc:{
                      walletAmount: -totalAmount
                  }
            })
            response.wallet = true;

          }
            return response;
        }
        
}