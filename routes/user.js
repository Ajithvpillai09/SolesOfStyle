const express =  require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const middlewares = require('../middlewares/authentication')
const cartCount = require('../middlewares/cartCount');

//GET USERS PAGE
router.get('/',middlewares.userAuth,userController.baseRouter);
router.get('/home',middlewares.guestAuth,cartCount.Count,userController.home);
router.get('/mens',cartCount.Count,userController.getAllMenProducts);
router.get('/womens',cartCount.Count,userController.getAllWomenProducts); 
router.get('/kids',cartCount.Count,userController.getAllKidProducts)
router.get('/shop',cartCount.Count,userController.getAllProducts)
router.get('/product-details/:id',cartCount.Count,userController.viewProductDetails);
router.get('/cart',middlewares.guestAuth,cartCount.Count,userController.getcart)
router.get('/payment-failed',middlewares.guestAuth,userController.paymentFailed)
router.get('/success-page',middlewares.guestAuth,userController.successPage)


//USER CONTROLLER
router.get('/signup',userController.getSignUp);
router.get('/login',userController.getLogin);
router.post('/signup',userController.signupPost);
router.post('/login',userController.loginPost);
router.get('/logout',userController.logOut);


//OTP CONTROLLER
router.get('/getotp',middlewares.userAuth,userController.getOtp);
router.post('/getotp',middlewares.userAuth,userController.postOtp);
router.get('/validate-otp',middlewares.userAuth,userController.otpValidate);
router.post('/validate-otp',middlewares.userAuth,userController.postOtpValidate);
router.get('/resend-otp',middlewares.userAuth,userController.resendOtp);


//USER MANAGEMENT
router.get('/my-account',middlewares.guestAuth,cartCount.Count,userController.myAccount);
router.patch('/add-address',middlewares.guestAuth,userController.addAddress);
router.get('/edit-address/:id',middlewares.guestAuth,cartCount.Count,userController.getEditAddress)
router.patch('/edit-address',middlewares.guestAuth,userController.patchEditAddress);
router.delete('/delete-address',middlewares.guestAuth,userController.deleteAddress)
router.patch('/edit-profile',middlewares.guestAuth,userController.editProfile)
router.patch('/change-password',middlewares.guestAuth,userController.changePassword)
router.get('/add-to-cart/:id',userController.addToCart);
router.delete('/remove-item',middlewares.guestAuth,userController.removeItem);
router.post('/change-quantity',middlewares.guestAuth,userController.changeCartQuantity);
router.get('/confirm-address',middlewares.guestAuth,cartCount.Count,userController.getDeliveryAddress)
router.post('/confirm-address',middlewares.guestAuth,userController.postDeliveryAddress);
router.post('/get-address-details',middlewares.guestAuth,userController.getAddressDetails)

//APPLY COUPON
router.post('/apply-coupon',middlewares.guestAuth,userController.applyCoupon);
router.patch('/remove-coupon',middlewares.guestAuth,userController.removeCoupon)

//ORDER MANAGEMENT
router.get('/proceed-to-checkout',middlewares.guestAuth,cartCount.Count,userController.checkOut)
router.post('/place-order',middlewares.guestAuth,userController.placeOrder)
router.post('/verify-payment',middlewares.guestAuth,userController.verifyPayment)
router.get('/order/:id',middlewares.guestAuth,cartCount.Count,userController.orderDetails)
router.patch('/cancel-order',middlewares.guestAuth,userController.cancelOrder)
router.patch('/return-order',middlewares.guestAuth,userController.returnOrder)

//SEARCH RESULT
router.post('/searchResult',userController.searchResult);


module.exports = router;   