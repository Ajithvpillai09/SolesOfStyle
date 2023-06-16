const express =  require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controllers');
const middlewares = require('../middlewares/authentication')

//ADMIN AUTHENTICATION
router.get('/',adminController.login);
router.post('/',adminController.loginPost);
router.get('/logout',adminController.logOut);

//ADMIN HOME
router.get('/dashboard',middlewares.authAdmin,adminController.dashboard);

//USER MANAGEMENT
router.get('/user-details',middlewares.authAdmin,adminController.userDetails)
router.get('/block/:id',adminController.blockUser);
router.get('/unblock/:id',adminController.unblockUser);

//CATEGORY MANAGEMENT
router.get('/add-category',middlewares.authAdmin,adminController.addCategory);
router.post('/add-category',adminController.addCategoryPost);
router.get('/add-subcategory',middlewares.authAdmin,adminController.addSubCategory);
router.post('/add-subcategory',adminController.addSubCategoryPost);
router.patch('/change-subcategory',adminController.changeSubCategory);
router.patch('/change-category',adminController.changeCategory);

//PRODUCT MANAGEMENT
router.get('/product-info',middlewares.authAdmin,adminController.getProductInfo);
router.get('/add-products',middlewares.authAdmin,adminController.addProducts)
router.post('/add-products',adminController.addProductsPost);
router.get('/delete-product/:id',adminController.deleteProduct);
router.get('/undu-delete/:id',adminController.unduDelete);
router.get('/edit-product/:id',middlewares.authAdmin,adminController.editProduct);
router.post('/edit-product/:id',adminController.posteditProduct);
router.post('/get-subcategories',adminController.subCategoriesOnCategory)

//COUPON MANAGEMENT
router.get('/coupons',middlewares.authAdmin,adminController.getCoupon)
router.post('/add-coupon',adminController.addCoupon);
router.patch('/change-coupon-status',adminController.changeCouponStatus)
router.get('/coupon-details/:id',adminController.getCouponById);
router.patch('/edit-coupon',adminController.editCoupon)

//ORDER MANAGEMENT
router.get('/order-info',middlewares.authAdmin,adminController.orderInfo)
router.get('/order-details/:id',middlewares.authAdmin,adminController.singleOrderDetails)
router.patch('/change-status',adminController.changeStatus)
router.get('/sales-report',middlewares.authAdmin,adminController.salesReport)

//BANNER MANAGEMENT
router.get('/banner',middlewares.authAdmin,adminController.banner)
router.get('/edit-banner/:id',middlewares.authAdmin,adminController.editBanner)
router.post('/editBanner/:id',adminController.editBannerPost)
router.get('/add-cat-images',middlewares.authAdmin,adminController.addCatImages)
router.post('/add-cat-images',adminController.addCatImagesPost)
router.post('/edit-cat-image/:id',adminController.editCatImage)











  
 
module.exports = router;