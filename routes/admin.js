const express =  require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controllers');
const middlewares = require('../middlewares/authentication')


//ADMIN AUTHENTICATION
router.get('/',adminController.login);
router.post('/',adminController.loginPost);
router.get('/logout',adminController.logOut);

//ADMIN AUTHENTICATION MIDDLEWARE
router.use(middlewares.authAdmin)

//ADMIN HOME
router.get('/dashboard',adminController.dashboard);

//USER MANAGEMENT
router.get('/user-details',adminController.userDetails)
router.get('/block/:id',adminController.blockUser);
router.get('/unblock/:id',adminController.unblockUser);

//CATEGORY MANAGEMENT
router.get('/add-category',adminController.addCategory);
router.post('/add-category',adminController.addCategoryPost);
router.get('/add-subcategory',adminController.addSubCategory);
router.post('/add-subcategory',adminController.addSubCategoryPost);
router.patch('/change-subcategory',adminController.changeSubCategory);
router.patch('/change-category',adminController.changeCategory);

//PRODUCT MANAGEMENT
router.get('/product-info',adminController.getProductInfo);
router.get('/add-products',adminController.addProducts)
router.post('/add-products',adminController.addProductsPost);
router.get('/delete-product/:id',adminController.deleteProduct);
router.get('/undu-delete/:id',adminController.unduDelete);
router.get('/edit-product/:id',adminController.editProduct);
router.post('/edit-product/:id',adminController.posteditProduct);
router.post('/get-subcategories',adminController.subCategoriesOnCategory)

//COUPON MANAGEMENT
router.get('/coupons',adminController.getCoupon)
router.post('/add-coupon',adminController.addCoupon);
router.patch('/change-coupon-status',adminController.changeCouponStatus)
router.get('/coupon-details/:id',adminController.getCouponById);
router.patch('/edit-coupon',adminController.editCoupon)

//ORDER MANAGEMENT
router.get('/order-info',adminController.orderInfo)
router.get('/order-details/:id',adminController.singleOrderDetails)
router.patch('/change-status',adminController.changeStatus)
router.get('/sales-report',adminController.salesReport)

//BANNER MANAGEMENT
router.get('/banner',adminController.banner)
router.get('/edit-banner/:id',adminController.editBanner)
router.post('/editBanner/:id',adminController.editBannerPost)
router.get('/add-cat-images',adminController.addCatImages)
router.post('/add-cat-images',adminController.addCatImagesPost)
router.post('/edit-cat-image/:id',adminController.editCatImage)
 
 
module.exports = router;