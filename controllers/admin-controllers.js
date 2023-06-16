const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
const Category = require("../models/categorySchema");
const SubCategory = require("../models/subCategorySchema");
const Product = require('../models/productSchema');
const Banner = require('../models/bannerSchema')
const CategoryImage = require('../models/categoryImageSchema')
const adminHelpers = require("../helpers/adminHelpers");
const orderHelpers = require('../helpers/orderHelpers')
const productHelpers = require('../helpers/productHelpers');
const couponHelpers = require('../helpers/couponHelpers')
const multer = require('multer');
const userHelper = require("../helpers/userHelper");
const salesHelpers = require('../helpers/salesHelpers');

//storage
const storage = multer.diskStorage({
    destination: function(req, file , cb){
      return cb (null, "./public/uploads")
    },
    filename : function(req, file , cb){
      return cb (null, `${Date.now()}-${file.originalname}`)
    }
  })


  
  const upload = multer({storage})

let errMessage = "";

const login = (req,res)=>{
    if(req.session.adminLoggedIn){
        res.redirect('admin/dashboard')
    }else{
        
        res.render('admin/adminLogin',{errMessage});
        errMessage="";
    }
   
}

const loginPost =  (req,res)=>{
    
    adminHelpers.doLogin(req.body).then(response=>{
        if(response.status){
            req.session.adminLoggedIn=true;
            res.redirect('admin/dashboard')
        }else{
            errMessage = response.message;
            res.redirect('admin');
        }
    })

}

const dashboard = (req,res)=>{
    adminHelpers.dashboardData().then( async (data)=>{
      let totalSales = await salesHelpers.totalSales();
      let orderBasedOnMonths = await salesHelpers.allOrderBasedOnMonths()
      let cancelledOrders =await salesHelpers.cancelledOrders()
      let returnedOrders = await salesHelpers.returnedOrders()
      let monthlySales = await salesHelpers.monthSales()
      let activeUsers = await userHelper.activeUser()
      res.render('admin/dashboard',
          {admin:true,
            data,totalSales,
            orderBasedOnMonths,
            cancelledOrders,
            returnedOrders,
            monthlySales,
            activeUsers
        })
    }).catch(e=>{
        console.log(e);
    })

   
}

const userDetails = (req,res)=>{
    adminHelpers.getAllUsers().then((users)=>{
        
        res.render('admin/userDetails',{users,admin:true})

    }).catch(e=>{
        console.log(e);
    })
   
}
const blockUser = (req,res)=>{
    let id = req.params.id;
    adminHelpers.blockUser(id).then(()=>{
        res.redirect('/admin/user-details');
    }).catch(e=>{
        console.log(e);
    })
}

const unblockUser = (req,res)=>{
    let id = req.params.id;
    adminHelpers.unblockUser(id).then(()=>{
        res.redirect('/admin/user-details');
    }).catch(e=>{
        console.log(e);
    })

}

const addCategory = (req,res) =>{
    productHelpers.getAllCategory().then((category)=>{
        res.render('admin/categoryManagement',{category,admin:true,errMessage});
        errMessage="";
    }).catch(e=>{
        console.log(e);
    })
}
    

const addCategoryPost = async (req,res)=>{
    productHelpers.getAllCategory().then((category)=>{
        if(category.length > 0){
            let found = false;
            for(let i =0 ; i < category.length ; i++){
                if(category[i]["category"].toLowerCase() === req.body.category.toLowerCase()){
                    found = true;
                    break;
                }
            }
            if(found){
                errMessage = "Already existing category"
                res.redirect('/admin/add-category');
            }else{
                let newCategory = new Category({
                    category:req.body.category
                })
                newCategory.save();
                res.redirect('/admin/add-category');
            }
        }else{
            let newCategory = new Category({
                category:req.body.category

            });
            newCategory.save()
            res.redirect('/admin/add-category');
        }
        
    }).catch(e=>{
        console.error(e);
        res.status(500).send("Internal Server Error");
  
    })
   
}

const addSubCategory = (req,res)=>{
    productHelpers.getAllCategory().then((category)=>{
        productHelpers.getAllSubCategoryWithCategory().then((subCategory)=>{
            res.render('admin/subCategory',{admin:true,category,subCategory,errMessage});
            errMessage="";
         })
    }).catch(e=>{
        console.log(e.message);
    })

}

const addSubCategoryPost = async (req,res)=>{
    const {category,subcategory} = req.body;
    try{
        let checkSub = await SubCategory.find({category_id:category});
        
        if(checkSub.length >0){
            let found = false;
            for(let i = 0 ; i < checkSub.length ; i++){
                if(checkSub[i]['sub_category'].toLowerCase()===subcategory.toLowerCase()){
                    found = true
                    break  
                }
            }
            if(!found){
                let newSubCategory = new SubCategory({
                    sub_category:subcategory,
                    category_id:category
                })
                await newSubCategory.save();
                res.redirect('/admin/add-subcategory');
            }else{
                errMessage = "Already existing sub-category"
                res.redirect('/admin/add-subcategory');
            }

        }else{
            let newSubCategory = new SubCategory({
                sub_category:subcategory,
                category_id:category
            })
            await newSubCategory.save();
            res.redirect('/admin/add-subcategory');
        }

    }catch(error){

    }
}

const getProductInfo = (req,res)=>{
     productHelpers.getAllProducts().then(response=>{
       
        res.render('admin/productsInfo',{admin:true,response});
     }).catch(e=>{
        console.log(e);
     })
}

const addProducts = (req,res)=>{
    productHelpers.getAllCategory().then((category)=>{
      productHelpers.getAllSubCategory().then(async (subCategory)=>{     
            res.render('admin/addProducts',{admin:true,category,subCategory});
         })
    }).catch(e=>{
        console.log(e.message);
    })

}

const addProductsPost = (req,res,next)=>{
    upload.array('image',5)(req, res, async (err) => {
        if (err) {
          console.log(err);
          return next(err);
        }
      try{
        const newProduct = new Product({
            brand: req.body.brand,
            productname: req.body.productname,
            category: req.body.category,
            subcategory:req.body.subcategory,
            price: req.body.price,
            dealPrice:req.body.dealprice,
            inStock:req.body.stock,
            images: req.files.map(file => file.filename),
            description:req.body.Description
        });
    
        await Product.create(newProduct);
        res.redirect('/admin/product-info');
       
      }catch(error){
        console.log(error);
      }
    
    });
}

const deleteProduct =  (req, res) => {
    const id = req.params.id;
    productHelpers.softDelProd(id).then(response=>{
        res.redirect('/admin/product-info');
    }).catch(e=>{
        console.log(e);
    })
  }

const unduDelete =  (req,res)=>{
    
    const id = req.params.id;
   
    productHelpers.unduDel(id).then(response=>{
        res.redirect('back');
    }).catch(e=>{
        console.log(e);
    })
}
 
const editProduct = (req,res)=>{
    let id = req.params.id;
    productHelpers.getProductById(id).then(product=>{
        productHelpers.getAllCategory().then(category=>{
            productHelpers.getAllSubCategory().then(subCategory=>{
                res.render('admin/editProducts',{product,category,subCategory,admin:true})
                
            })
        })
        
    })
}
const posteditProduct = async(req,res)=>{
   upload.array('image',5)(req, res, async (err) => {
    try{  
        if(req.files.length > 0){
             const items = await Product.updateOne({_id:req.params.id},{
            brand: req.body.brand,
            productname: req.body.productname,
            category: req.body.category,
            subcategory:req.body.subcategory,
            price: req.body.price,
            dealPrice:req.body.dealprice,
            inStock:req.body.stock,
            images: req.files.map(file => file.filename),
            description:req.body.Description
     })

      
        }else{
            const items = await Product.updateOne({_id:req.params.id},{
                brand: req.body.brand,
                productname: req.body.productname,
                category: req.body.category,
                subcategory:req.body.subcategory,
                price: req.body.price,
                dealPrice:req.body.dealprice,
                inStock:req.body.stock,
                description:req.body.Description
            })

        }
     res.redirect('/admin/product-info');
    }catch(error){
      console.log(error)
    }
 
   });
   
 }

const orderInfo = (req,res)=>{
    orderHelpers.getAllOrders().then((orders)=>{
            res.render('admin/order',{admin:true,orders})
        })
    }

const singleOrderDetails = (req,res)=>{
    let id = req.params.id;
    orderHelpers.getOrderDetails(id).then((order)=>{
        order = order[0];
        let productInfo = order.productInfo;
        let deliveryDetails = order.deliveryDetails;
        let userId = order.userId;
        userHelper.findUser(userId).then((userInfo)=>{
              res.render('admin/orderDetails',{admin:true,userInfo,productInfo,deliveryDetails,order})

        })

       
    })
}

const changeStatus =async (req,res)=>{
    const {orderId,productId,userId,status,paymentStatus,refundAmount,quantity} = req.body;
   
    if(status === "Returned" || status === "Cancelled" && paymentStatus === "placed'"){
        await  adminHelpers.refundAmount(userId,refundAmount);
        await productHelpers.incrementStock(productId,quantity);
    }
    orderHelpers.changeStatus(orderId,productId,status).then(()=>{
        res.json({status:true})
    }).catch(e=>{
        console.log(e);
    })
   
}

const getCoupon = (req,res)=>{
    couponHelpers.getCoupon().then((coupon)=>{
        res.render('admin/coupon',{admin:true,coupon})
    })  
}

const addCoupon = (req,res)=>{
    couponHelpers.addCoupon(req.body);
        res.redirect('/admin/coupons')

}
const changeCouponStatus =(req,res)=>{
    let id = req.body.id;
    couponHelpers.changeCoupenStatus(id).then(()=>{
        res.json({status:true})
    })

}

const getCouponById = (req,res)=>{
   
    let id = req.params.id;
    couponHelpers.getCouponById(id).then((coupon)=>{
       
        res.json(coupon)
    })

}

const editCoupon = (req,res)=>{
   
    couponHelpers.editCoupon(req.body).then(()=>{
        res.json({status:true})
    })
    
}
const subCategoriesOnCategory = (req,res)=>{
   
    adminHelpers.getSubcategoriesOnCategory(req.body.categoryId).then((subCategories)=>{
        res.json(subCategories)
      
    }).catch(e=>{
        console.log(e);
    })
}

const salesReport =async (req,res)=>{
    let render = false;
    let weeklyReport = await salesHelpers.weeklySales();
    let weekTotal = await salesHelpers.weekTotal();
    let monthlySales = await salesHelpers.monthlySales()
    let monthTotal = await salesHelpers.monthlyTotal()
    let yearlySales =await salesHelpers.yearlySales()
    let yearTotal = await salesHelpers.yearTotal()
    console.log(weeklyReport);
  
    if(weeklyReport.length > 0){
        render = true;
    }
    res.render('admin/salesReport',
       {admin:true,
        weeklyReport,
        weekTotal,
        monthlySales,
        monthTotal,
        yearlySales,
        yearTotal,
        render
    })
}

const banner = (req,res) =>{
    userHelper.bannerData().then(bannerData=>{
        adminHelpers.getCategoryImage().then(catImages=>{
            productHelpers.getAllCategory().then(category=>{
                res.render('admin/showBanner',{admin:true,bannerData,catImages,category})
             })
        })
   })
}


const editBanner = (req,res)=>{
    let id = req.params.id;
    userHelper.findBanner(id).then(bannerData=>{
        res.render('admin/editBanner',{admin:true,bannerData})
    })
}


const editBannerPost = (req,res)=>{
    let id = req.params.id;
    upload.array('image',3)(req, res, async (err) => {
        const {title,description} = req.body;
        try{
            if(req.files.length > 0){
                await Banner.updateOne({_id:id},
                    {
                        
                        images: req.files.map(file => file.filename)

                    })

            }else{
                await Banner.updateOne({_id:id},
                    {
                        title:title,
                        description:description
                    })

            }
          res.redirect('/admin/banner')

        }catch(e){
            console.log(e);
        }
    })
    

}



const postBanner = (req,res)=>{
    upload.array("image", 3)(req, res, async (err) => {
        if (err) {
          console.log(err);
          return next(err);
        }
        console.log(req.body);
        console.log(req.files);
        try {
          const banner = new Banner({
            title: req.body.title,
            description: req.body.description,
            images: req.files.map((file) => file.filename),
          });
          await Banner.create(banner);
          console.log(banner);
          res.redirect('/admin/banner');
        } catch (error) {
          console.log(error);
        }
      });
}

const addCatImages = (req,res)=>{
    productHelpers.getAllCategory().then(category=>{
            res.render('admin/addCatImages',{admin:true,category})  
        })
       
   
}

const addCatImagesPost = (req,res)=>{
    upload.single('image')(req,res, async(err)=>{
        if (err) {
            console.log(err);
            return next(err);
          }
          const newImage = new CategoryImage({
            category:req.body.category,
            image:req.file.filename

          })
          newImage.save()

    })
    res.redirect('/admin/banner')

}

const editCatImage = (req,res)=>{
    upload.single('image')(req,res, async(err)=>{
        const id = req.params.id;
        if (err) {
            console.log(err);
            return next(err);
          }
          await CategoryImage.updateOne({_id:id},{
            category : req.body.category,
            image:req.file.filename
        })
          
    })
    res.redirect('/admin/banner')

}

const changeSubCategory =async (req,res)=>{
    console.log(req.body);
    const {id,status} = req.body;
    await SubCategory.updateOne({_id:id},{
        $set:{isDeleted:status}
    })
    res.json({status:true})
}

const changeCategory =async (req,res)=>{
    console.log(req.body);
    const {id,status} = req.body;
    await Category.updateOne({_id:id},{
        $set:{isDeleted:status}
    })
    res.json({status:true})
}



const logOut = (req,res)=>{
    req.session.adminLoggedIn = false;
    res.redirect('/admin');
}
module.exports = {
    login,
    loginPost,
    dashboard,
    userDetails,
    blockUser,
    unblockUser,
    addCategory,
    addCategoryPost,
    addSubCategory,
    addSubCategoryPost,
    getProductInfo,
    addProducts,
    addProductsPost,
    deleteProduct,
    unduDelete,
    editProduct,
    posteditProduct,
    orderInfo,
    singleOrderDetails,
    changeStatus,
    getCoupon,
    addCoupon,
    changeCouponStatus,
    getCouponById,
    editCoupon,
    subCategoriesOnCategory,
    salesReport,
    banner,
    postBanner,
    editBanner,
    editBannerPost,
    addCatImages,
    addCatImagesPost,
    editCatImage,
    changeSubCategory,
    changeCategory,
    logOut,
}
    