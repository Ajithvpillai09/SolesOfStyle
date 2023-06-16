const Coupon = require('../models/couponSchema')
 const voucher_codes = require("voucher-code-generator");


module.exports = {
    addCoupon:async (data)=>{
        const voucher = voucher_codes.generate({           
            length: 7,
            charset: voucher_codes.charset("alphabetic"),
          });
           let code = voucher.toString()
         

        try{
            const coupon = new Coupon({
                couponCode:code,
                discount:data.discount,
                minPurchase:data.minPurchase,
                expires:data.expires,
                statusEnable:true
            })
            await coupon.save();

        }catch(e){
            console.log(e);
         }
     },
     getCoupon: async ()=>{
        try{
            let coupons = await Coupon.find();
            return coupons;

        }catch(e){
            console.log(e);
        }
     },
     changeCoupenStatus: async (id)=>{
        try{

          let coupon = await Coupon.findById(id);
         if(coupon.statusEnable){
             await Coupon.updateOne({_id:id},{$set:{statusEnable:false}})
             return
         }else{
            await Coupon.updateOne({_id:id},{$set:{statusEnable:true}})
         }

        }catch(e){
            console.log(e);
        }
     },
     getCouponById:async (id)=>{
        try{
            let coupon = await Coupon.findById(id)
            return coupon

        }catch(e){
            console.log(e);
        }

     },
     getAvailableCoupons: async ()=>{    
        try{
         let coupon = await Coupon.find({
            statusEnable:true,
            expires: { $gt: Date.now() } 
         })

         return coupon        

        }catch(e){
            console.log(e)
        }
     },
     applyCoupon: async (data)=>{
        const {coupon,total} = data;
           let response = {} 
        try{
         let findCoupon   = await Coupon.findOne({
                couponCode:coupon,
            })
        if(!findCoupon){
            response.message = "Invalid coupon code"
            response.status = false;
        }    
        else if( total < findCoupon.minPurchase){
            response.message = `Coupon requires minimum puchase of ${findCoupon.minPurchase}`
            response.status = false; 
        }
        else {
            response.discountAmount = (findCoupon.discount*total)/100
            response.discountPrice = total-response.discountAmount;
            response.message = `Coupon applied ! you have received a discount of ${response.discountAmount} `
            response.status = true;
        }  
        
        return response 
       


        }catch(e){
            console.log(e);
        }
     },
     editCoupon: async (details)=>{
        try{
            const {couponCode,discount,minPurchase, expires, couponId} = details;
           let updated = await Coupon.findOneAndUpdate({_id:couponId},
                {
                    $set:{
                        couponCode:couponCode,
                        discount:discount,
                        minPurchase:minPurchase,
                        expires:expires
                    }
                })

               

        }catch(e){
            console.log(e);
        }
     }
}