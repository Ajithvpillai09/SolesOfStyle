const Category = require('../models/categorySchema');
const SubCategory = require('../models/subCategorySchema');
const  Products = require('../models/productSchema');





module.exports = {
    getAllProducts :()=>{
        return new Promise(async (resolve,reject)=>{
            try{
           await Products.find().then(respose=>{
             resolve(respose);
           }).catch(e=>{
            reject(e)
           })
         }catch(e){
         console.log(e);
        }
        })
    },
   
    getAllCategory :async ()=>{
        try{
        let categories = await Category.find();
        return categories;
    
        }catch(e){
            console.log(e);
        }
    },

    getAllSubCategoryWithCategory:async ()=>{
        try{
            let subCategories = await SubCategory.find()
            .populate({            
                    path: 'category_id',
                    model: 'Catogory',
                    select: 'category' ,
                })

            return subCategories;
        
            }catch(e){
                console.log(e);
            }

    },
    
    getAllSubCategory :async ()=>{
        try{

        let subCategories = await SubCategory.find();
        return subCategories;
       
    
        }catch(e){
            console.log(e);
        }
    },
    softDelProd: async (id)=>{
        return new Promise (async (resolve,reject)=>{
            try{
                await Products.findByIdAndUpdate(id,{deleted:true}).then(response=>{
                    resolve(response)
                }).catch(error=>{
                    reject(error)
                })

            }catch(e){
                console.log(e.message);
            }
            
        })
    },
    unduDel: async (id)=>{
        return new Promise (async (resolve,reject)=>{
            try{
                await Products.findByIdAndUpdate(id,{deleted:false}).then(response=>{
                    resolve(response)
                }).catch(error=>{
                    reject(error)
                })

            }catch(e){
                console.log(e.message);
            }
            
        })
    },
    updateProduct: async(id)=>{
        try{
            await Products.updateOne({_id})

        }catch(e){
            console.log(e);
        }

    },
    getCategoryId: async (categoryname)=>{
        try{
           let categoryid = await Category.findOne({category:categoryname});
           return categoryid;
           

        }catch(e){
            console.log(e);
        }
    },
    getProductsByCategory: async(categoryId,pageNum,price)=>{
        try{ 
            // console.log(pageNum,"whileeeeeeeeeeee");
            // console.log(price,"whileeeeeeeeeeeeeee");
            let sortBy = {}
            // let dealPrice = price === "low" ? 1 : -1;
            // sortBy["dealPrice"] = dealPrice;
            //  console.log(sortBy,"ppppppppppppppppppppppppppppp");
            
            pageNum = parseInt(pageNum)
            let response = {};
            let perPage = 2;
            let count = await Products.countDocuments({category:categoryId,deleted:false})
            let pages = Math.ceil(count/perPage)
            let products = await Products.find({category:categoryId, deleted:false})       
            .skip(((pageNum-1)*perPage))
            .limit(perPage)
            // .sort(sortBy)   
           

          
            
            response.perPage = perPage;
            response.pageNum = pageNum
            response.count = count;
            response.pages = pages;
            response.products = products;
            return response;

        }catch(e){
            console.log(e);
        }
    },
    ShopPage:async (pageNum,price)=>{
        try{
            // let sortBy = {}
            // let dealPrice = price === "low" ? 1 : -1;
            // sortBy["dealPrice"] = dealPrice;
            //  console.log(sortBy,"ppppppppppppppppppppppppppppp");

            pageNum = parseInt(pageNum)
            let response = {};
            let perPage = 4;
            let count = await Products.countDocuments({deleted:false});
            let pages = Math.ceil(count/perPage)
            let products = await Products.find({deleted:false})
            .skip(((pageNum-1)*perPage))
            .limit(perPage)
            // .sort(sortBy)
            response.perPage = perPage;
            response.pageNum = pageNum
            response.count = count;
            response.pages = pages;
            response.products = products;
            return response;

        }catch(e){
            console.log(e);
        }

        
    },
    getProductById : async(id)=>{
        try{
            // let product = await Products.findById(id);

            let product = await Products.findById(id)
            .populate({
                path: 'category',
                model: 'Catogory',
                select: '_id category '
            })
            .populate({
                path:'subcategory',
                model:'SubCategory',
                select: '_id sub_category'
            })
          
            return product;

        }catch(e){
            console.log(e);
        }
    },
    decrementStock : async ({item,quantity})=>{
        try{
          await Products.updateOne({
            _id:item
          },
          {
            $inc:{
                   inStock: -quantity
                 }
          })

        }catch(e){
            console.log(e);
        }
    },
    incrementStock: async (productId,quantity)=>{
        quantity =  parseInt(quantity)
        try{
           let updated = await Products.updateOne({
            _id:productId
           },
           {
            $inc:{
                inStock: quantity
              }
           }) 
          

        }catch(e){

        }
    },
    searchResult:async (data)=>{
        try{

           let searchData = await Products.find({  productname: { '$regex': '^' + data + '.*', $options: 'i' }})
           return searchData
          }catch(e){

        }
    }
    

}



