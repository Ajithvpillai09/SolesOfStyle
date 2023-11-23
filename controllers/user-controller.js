
const userHelper = require('../helpers/userHelper');
const productHelpers = require('../helpers/productHelpers');
const addresssHelpers = require('../helpers/addressHelpers');
const cartHelpers = require('../helpers/cartHelpers')
const orderHelpers = require('../helpers/orderHelpers');
const couponHelpers = require('../helpers/couponHelpers');
const adminHelpers = require('../helpers/adminHelpers');



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_SERVICE_SSID;
const client = require("twilio")(accountSid, authToken);



let errMessage = "";
let others=true;
let deliveryAddress ;

const baseRouter = (req,res)=>{

    if(req.session.userLoggedIn){
        res.redirect('/home')
    }else{
    userHelper.bannerData().then(bannerData=>{
        adminHelpers.getCategoryImage().then(catImage=>{
            res.render('user/home',{others,userLoggedIn:false,bannerData,catImage});
        })
        
      })   
  }
}


const getLogin = (req,res)=>{
    if(req.session.userLoggedIn){
        res.redirect('/home')
    }else{
    res.render('user/userLogin',{errMessage});
    errMessage ="";
    email="";
    }
}  

const getSignUp = (req,res)=>{
    if(req.session.userLoggedIn){
        res.redirect('/home')
    }else{
    
    res.render('user/userRegister',{errMessage});
    errMessage="";
    email="";
    name="";
    phone="";
    
    }
}
const signupPost = (req,res)=>{
    userHelper.findUserSignUp(req.body).then( async (response)=>{
        if(response.status){
            try{
                req.session.body = req.body;
                const mob = req.body.phone;
                req.session.mobile = mob;
                 await client.verify.v2.services(verifySid).verifications.create({to: `+91${mob}`, channel: "sms" });
                 req.session.newUser = true;
                 res.redirect('/validate-otp'); 
             }catch(e){
              console.log("!!!!!!!!!!!!!!Error in otp sending in singin!!!!!!!!!!!!");
            }
         }else{
            email = req.body.email;
            name = req.body.name;
            phone = req.body.phone;
            errMessage = "user already exists";
            res.redirect('/signup');
        }
    })
}
 
const home = (req,res)=>{
    user = req.session.user;
    req.session.userLoggedIn = true;
    cartCount = req.cartcount;
    userHelper.bannerData().then(bannerData=>{
        adminHelpers.getCategoryImage().then(catImage=>{
        res.render('user/home',{others,user,userLoggedIn:true,cartCount,bannerData,catImage});
       })
    }) 
  
}

const loginPost = (req,res)=>{
    userHelper.doLogin(req.body).then((response)=>{
       if(response.status){
        req.session.user = response.userData;
        user = req.session.user;
        req.session.userLoggedIn = true;
        req.session.newUser = false;
        res.redirect('/home')
       }else{
          email = req.body.email;
          errMessage = response.message;
          res.redirect('/login');
       }
    })
}

const getOtp = (req,res)=>{
    if(req.session.userLoggedIn){
        res.redirect('/home')
    }else{
    res.render('user/userOtp',{errMessage});
    errMessage="";
    phone="";
    }
};

const postOtp= async (req, res) => {
    const mob = req.body.phone;
     try {
        const response = await userHelper.validateNumber(mob);

        if (response.status) {
            req.session.mobile = mob;
            req.session.user = response.user;
          await client.verify.v2.services(verifySid).verifications.create({to: `+91${mob}`, channel: "sms" });
           req.session.newUser = false;
           res.redirect('/validate-otp');
        } else {
            errMessage = response.message;
            phone = mob;
            res.redirect('/getotp');
        }
    } catch (error) {
        console.log(error);
        errMessage = "Cant send OTP"
        res.redirect('/login');
    }
};


const otpValidate = (req,res)=>{
    res.render('user/userOtpValidation',{errMessage})
    errMessage=""
}

const postOtpValidate = async (req,res)=>{
    const otp = req.body.otp;
    const mob = req.session.mobile;
  
  
    try{
        let response = await client.verify.v2.services(verifySid ).verificationChecks.create({ to: `+91${mob}`, code: otp })
        if(response.valid){
            if(req.session.newUser){
                 userHelper.doSignUp(req.session.body).then(response=>{
                    req.session.userLoggedIn = true
                    req.session.user = response.userData;
                    user = req.session.user
                    res.redirect('/home')
                 })
  
            }else{
                const id = req.session.user._id;
                userHelper.findUser(id).then(response=>{
                    if(!response.isBlocked){
                        req.session.userLoggedIn = true;
                        req.session.user = response;
                        user = req.session.user;
                        res.redirect('/home')
                    }else{
                        errMessage = "You are restricted"
                        res.redirect('/login')
                    }
                   
                }).catch(e=>{
                    console.log(e.message);
                })
            }
           

        }else{
            errMessage = "Invalid OTP"
            res.redirect('/validate-otp');
        } 

    }catch (error) {
        console.log(error);
    }
}

const resendOtp = async (req,res)=>{
  
    let mob = req.session.mobile;
    try{
        if(mob){
            await client.verify.v2.services(verifySid).verifications.create({to: `+91${mob}`, channel: "sms" });
           
            res.redirect('/validate-otp')
        }else{
        }

    }catch(error){
        console.log(error);

    }
}



const getAllMenProducts = (req,res)=>{
    let pageNum = req.query.page || 1;
     productHelpers.getCategoryId("MEN").then(category=>{
        productHelpers.getProductsByCategory(category._id,pageNum).then(response=>{
            products = response.products;
            pageNum =response.pageNum;
            count=response.count;
            perPage = response.perPage;  
            pages = response.pages;
        if(req.session.userLoggedIn){
            cartCount = req.cartcount; 
            res.render('user/products',{others,userLoggedIn:true,products,category,user,cartCount,pageNum,count,perPage,pages})
        }else{
            res.render('user/products',{others,userLoggedIn:false,products,category,pageNum,count,perPage,pages})
        }
    })

     }).catch(e=>{
        console.log(e);
     })
}
const getAllWomenProducts = (req,res)=>{
    let pageNum = req.query.page || 1;
    productHelpers.getCategoryId("WOMEN").then(category=>{
       productHelpers.getProductsByCategory(category._id,pageNum).then(response=>{
        products = response.products;
        pageNum = response.pageNum;
        count=response.count;
        perPage = response.perPage;  
        pages = response.pages;
       if(req.session.userLoggedIn){
            cartCount = req.cartcount;
           res.render('user/products',{others,userLoggedIn:true,products,category,user,cartCount,pageNum,count,perPage,pages})
       }else{
           res.render('user/products',{others,userLoggedIn:false,products,category,pageNum,count,perPage,pages})
       }
   })
      }).catch(e=>{
       console.log(e);
    })
}
const getAllKidProducts = (req,res)=>{
    let pageNum = req.query.page || 1;
    productHelpers.getCategoryId("KIDS").then(category=>{
       productHelpers.getProductsByCategory(category._id,pageNum).then(response=>{
        products = response.products;
        pageNum = response.pageNum;
        count=response.count;
        perPage = response.perPage;  
        pages = response.pages;
       if(req.session.userLoggedIn){
           cartCount = req.cartcount;
           res.render('user/products',{others,userLoggedIn:true,products,category,user,cartCount,pageNum,count,perPage,pages})
       }else{
           res.render('user/products',{others,userLoggedIn:false,products,category,pageNum,count,perPage,pages})
       }
   })

    }).catch(e=>{
       console.log(e);
    })

}

const getAllProducts = (req,res) =>{
    let pageNum = req.query.page || 1;
    productHelpers.ShopPage(pageNum).then((response)=>{
        products = response.products
        pageNum = response.pageNum;
        count=response.count;
        perPage = response.perPage;  
        pages = response.pages;
        category = "MEN"
        if(req.session.userLoggedIn){
            cartCount = req.cartcount;
            res.render('user/products',{others,userLoggedIn:true,products,user,cartCount,category,pageNum,count,perPage,pages})
        }else{
            res.render('user/products',{others,userLoggedIn:false,products,category,pageNum,count,perPage,pages})
        }
        
    })

}

const viewProductDetails = (req,res)=>{
    let id = req.params.id;
    productHelpers.getProductById(id).then(singleProduct=>{
        if(req.session.userLoggedIn){
            cartCount = req.cartcount;
         res.render('user/viewProduct',{others,userLoggedIn:true,singleProduct,user,cartCount}); 
        }else{
            res.render('user/viewProduct',{others,userLoggedIn:false,singleProduct});
        }
       
    })
}

const myAccount = (req,res)=>{
    id = req.session.user._id;
     
    addresssHelpers.getAddress(user._id).then(address=>{
        orderHelpers.getOrders(user._id).then(async(orders)=>{
            let user = await userHelper.findUser(id)
            let wallet = await userHelper.findWallet(id);
          
            if(address.length > 0){
                address = address[0].address;
            }
            cartCount = req.cartcount;
         res.render('user/myAccount',{others:true,userLoggedIn:true,user,address,errMessage,cartCount,orders,wallet})
         errMessage=""
        })
       
    }).catch(e=>{
        console.log(e);
    })
}

const addAddress =(req,res)=>{
    addresssHelpers.addAddress(user,req.body).then(()=>{
        res.json({status:true})
    }).catch(e=>{
        console.log(e);
    })
}
const getEditAddress =(req,res)=>{
    const addressId = req.params.id;
    const userId = req.session.user._id;
    addresssHelpers.editAddress(userId,addressId).then((address)=>{
        cartCount = req.cartcount;
        res.render('user/editAddress',{address,others:true,userLoggedIn:true,cartCount})
    })
}

const getAddressDetails = (req,res)=>{
  const{addressId,userId} = req.body;
  addresssHelpers.editAddress(userId,addressId).then((address)=>{
     res.json(address)
  })

}

const patchEditAddress = (req,res)=>{
  const userId = req.session.user._id;
  addresssHelpers.updateAddress(userId,req.body).then(()=>{
    res.json({status:true})
}).catch(e=>{
    console.log(e);
})
}

const editAddress = (req,res)=>{
    const userId = req.body.userId;
    addresssHelpers.updateAddress(userId,req.body).then(()=>{
        res.json({status:true})
    }).catch(e=>{
        console.log(e);
    })
}

const deleteAddress = (req,res)=>{
    const userid = req.session.user._id;
    const addressid = req.body.id;
    addresssHelpers.deleteAddress(userid,addressid).then(()=>{
        res.json({status:true})
    })
}

const editProfile = (req,res)=>{
    const user = req.session.user;
    userHelper.editProfile(req.body,user).then(response=>{
        if(response.status){
            userHelper.findUser(user._id).then(userData=>{
                req.session.user = userData;
                res.json({status:true})
            })
        }else{
            res.json({status:false})
        }
    })
}

const changePassword = (req,res)=>{
    const {currentpassword,newpassword} = req.body;
    let user = req.session.user;
    userHelper.changePassword(currentpassword,newpassword,user).then((response)=>{
        if(response.status){
            req.session.user = response.data;
            res.json({status:true})
        }else{
            res.json({status:false})
        }
    })
}

const addToCart = (req,res)=>{
    if(!req.session.userLoggedIn){
       res.json({status:false})
    }else{
       const  userId = req.session.user._id;
       const proId = req.params.id; 
        cartHelpers.addProductsToCart(userId,proId).then(()=>{
            res.json({status:true})
        })
     }
   }

const getcart = (req,res)=>{
   
    let userId = req.session.user._id
    cartHelpers.getCartProducts(userId).then(async(cartItems)=>{
    let cartTotal = await cartHelpers.getCartTotal(userId)
   
        total = cartTotal.totalWithTax;
           
            user = req.session.user;
            cartCount = req.cartcount;
            res.render('user/cart',
            {  cartItems,
                cartCount,
                others,
                user,
                userLoggedIn:true,
                cartTotal
               
            })
      

     }).catch((e)=>{
        console.log(e);
     })
}

const removeItem = (req,res)=>{
    const{user,product,cart} = req.body;
  
    cartHelpers.removeCartItem(cart,product).then(()=>{
        cartHelpers.getCartTotal(user).then((response)=>{
            res.json(response)
        })
    })
}

const changeCartQuantity = (req,res)=>{
    let obj = {}
    const {cart,product,count,quantity,user} = req.body;
    cartHelpers.getProductQuantity(cart,product,count,quantity,user).then(async (response)=>{
       let products = await cartHelpers.getCartProducts(user);
       let total = await cartHelpers.getCartTotal(user)
       obj.response = response;
       obj.products = products;
       obj.total = total
   
       res.json(obj)
   })
   
}
const getDeliveryAddress = async (req,res)=>{
    user = req.session.user;
    const id= user._id;
    cartCount = req.cartcount;
    addresssHelpers.getAddress(id).then(async (address)=>{
        
     let cartItems = await cartHelpers.getCartProducts(id);
     let cartTotal = await cartHelpers.getCartTotal(id);
     let total = cartTotal.totalWithTax;
     let coupon = await couponHelpers.getAvailableCoupons()

    
         if(address.length > 0){
            address = address[0].address;
        }
        let subTotal = 0;
        let tax = 0;
        let totalWithTax = 0  
           subTotal= cartTotal.total;
           tax=cartTotal.totalTax;
           totalWithTax=cartTotal.totalWithTax

         

       res.render('user/addAddress',
     { 
        others,
        userLoggedIn:true,
        user,cartCount,
        address,
        cartItems,
        cartTotal,
        coupon
    })
    
}).catch(e=>{
    console.log(e,"Error in rendering add address page");
})
}


const postDeliveryAddress = (req,res)=>{
   
    const userId = req.session.user._id;
    const {addressId} = req.body;
    addresssHelpers.getDeliveryAddress(userId,addressId).then((response)=>{
        deliveryAddress = response
        res.json({status:true})
    })
}

const checkOut = (req,res)=>{
    id = req.session.user._id;
    user = req.session.user;
    cartCount = req.cartcount;
    cartHelpers.getCartProducts(id).then(cartItems=>{
        cartHelpers.getCartTotal(id).then(async cartTotal=>{
            let wallet = await userHelper.findWallet(id)
            console.log(wallet);
           
            res.render('user/checkOut',
                {others,
                 user,
                 userLoggedIn:true,
                 deliveryAddress,
                 cartItems,
                 cartTotal,
                 cartCount,
                 wallet
                })
        })
    })
  
}

const placeOrder = async (req,res)=>{
    let response = {}
    console.log(req.body,"placing the orderrrrrrrrrrr");
    const { addressId,payment_option} = req.body;
    const userId = req.session.user._id;  
    try{
        let deliveryAddress = await  addresssHelpers.getDeliveryAddress(userId,addressId);
        let cartItems = await cartHelpers.getCartItems(userId)
        
        let orderTotal = await cartHelpers.getCartTotal(userId);
        if(payment_option === "Wallet"){
         let response = await  orderHelpers.walletPayment(userId,orderTotal.totalWithTax-orderTotal.discount);
         console.log(response);
         if(!response.wallet) {
            message = response.message;
            res.json({wallet:false,message})
            return 
        }
    }
        
        await orderHelpers.placeOrder(deliveryAddress,cartItems,orderTotal,payment_option).then((order)=>{
           
            
            if(payment_option === "COD" || payment_option === "Wallet"){
                cartItems.products.forEach(element => {
                    productHelpers.decrementStock(element);
                });
                orderHelpers.deleteCart(userId).then(()=>{
                    res.json({COD:true})

                })
             
            }else if(payment_option === "Razorpay"){
                orderHelpers.generateRazorpay(order._id,orderTotal.totalWithTax-orderTotal.discount).then((order)=>{
                    console.log("razorrrrrrrrrrr","ppppppppppppppppppppppp");

                    res.json(order)

                })

            }    
        }).catch(e=>{
            console.log(e);
        })
        

      
    }catch(e){
        console.log(e);
    }
}

const verifyPayment = (req,res)=>{
    const userId = req.session.user._id;
      console.log(req.body,"body aaaaaaaaaaaaa");
      orderHelpers.verifyPayment(req.body).then(async ()=>{
         await orderHelpers.changeRazorStatus(req.body['order[receipt]']);
         let cartItems = await cartHelpers.getCartItems(userId);
         cartItems.products.forEach(element => {
            productHelpers.decrementStock(element);
        });
         await orderHelpers.deleteCart(userId);
           res.json({ status: true })       
      }).catch(async ()=>{
        console.log("payment failedddddddd");
         await orderHelpers.deleteOrder(req.body['order[receipt]']);
        res.json({ status: false, errMes: 'payment failed' })
 })
}

const orderDetails = (req,res)=>{
    cartCount = req.cartcount
    user = req.session.user;
    orderId = req.params.id;
    orderHelpers.getOrderDetails(orderId).then((orders)=>{
        if(orders.length > 0){
            deliveryAddress = orders[0].deliveryDetails;
       products = orders[0].productInfo
       orders = orders[0];
      
       let subTotal = products.reduce((sum,products)=> sum + products.currentPrice*products.quantity,0)
       let tax =   products.reduce((sum,products)=> sum + products.tax*products.quantity,0)   
 
  
        res.render('user/order',
            {orders,
            others,
            userLoggedIn:true,
            user,
            deliveryAddress,
            products,
            subTotal,
            tax,
            cartCount
        })

        }
       
        
    })
}

const cancelOrder = (req,res)=>{
    console.log(req.body);
    let status = "Cancelled"
    const {orderId,productId,quantity, paymentSatus,refundAmount} = req.body
    userId = req.session.user._id;  
    
   orderHelpers.changeStatus(orderId,productId,status).then(async()=>{
    if( paymentSatus === "placed"){
       
        await adminHelpers.refundAmount(userId,refundAmount)
    }

     await productHelpers.incrementStock(productId,quantity)

          res.json({status:true})
   
   })
}
   

const applyCoupon = (req,res)=>{
     
    couponHelpers.applyCoupon(req.body).then(async(response)=>{
        if(response.status){
           await cartHelpers.addDiscount(req.body.userId,response.discountAmount)
        }
        
        res.json(response)

    }) 
  
}

const removeCoupon = (req,res)=>{
    cartHelpers.removeDiscount(req.body.userId).then(()=>{
        res.json({status:true})
    })

}
const paymentFailed = (req,res)=>{
    user = req.session.user;
    res.render('user/paymentFailed',{others,userLoggedIn:true,user})
}

const returnOrder = (req,res)=>{
    orderHelpers.returnOrder(req.body).then(()=>{
        res.json({status:true});
    })
}

const searchResult=(req,res)=>{
    const payload = req.body.payload.trim()
    productHelpers.searchResult(payload).then((searchData)=>{
        res.send({ payload: searchData});
    }).catch(e=>{
        console.log(e);
    })
}

const successPage = (req,res)=>{
    res.render('user/orderPlaced')
}

const logOut = (req,res)=>{
    req.session.user = null;
    req.session.userLoggedIn = false;
    res.redirect('/');
}




module.exports = {
    baseRouter,
    getLogin,
    getSignUp,
    signupPost,
    home,
    loginPost,
    logOut,
    getOtp,
    postOtp,
    otpValidate,
    postOtpValidate,
    resendOtp,
    getAllMenProducts,
    getAllWomenProducts,
    getAllKidProducts,
    getAllProducts,
    viewProductDetails,
    myAccount,
    addAddress,
    getEditAddress, 
    patchEditAddress,
    deleteAddress,
    editProfile,
    changePassword,
    getcart,
    addToCart,
    removeItem,
    changeCartQuantity,
    getDeliveryAddress,
    postDeliveryAddress,
    checkOut,
    placeOrder,
    orderDetails,
    applyCoupon,
    cancelOrder,
    verifyPayment,
    paymentFailed,
    returnOrder,
    searchResult,
    getAddressDetails,
    editAddress,
    removeCoupon,
    successPage
} 