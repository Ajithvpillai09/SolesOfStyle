const User = require('../models/userSchema');

const Category = require('../models/categorySchema');
const SubCategory = require('../models/subCategorySchema');
const Admin = require('../models/adminSchema');
const bcrypt = require('bcryptjs');
const Orders = require('../models/orderSchema');
const Products = require('../models/productSchema');
const CategoryImage = require('../models/categoryImageSchema')
const Wallet = require('../models/walletSchema')


module.exports = {
    doLogin:(admindata)=>{
        return new Promise (async (resolve,reject)=>{
           
            let response={}
            try{
             let adminfind =await Admin.findOne({email:admindata.email});
             if(adminfind){
                bcrypt.compare(admindata.password,adminfind.password).then(current=>{
                    if(current){
                        response.status = true
                        response.admin = adminfind;
                        resolve(response)
                    }else{
                       response.status=false
                       response.message="Invalid Password"
                       resolve(response);
                    }
                })
              }else{
                response.status=false;
                response.message = "Invalid Username"
                resolve(response);
             }
            }catch(e){
                reject(e);
            }
        })

    },
    getAllUsers:()=>{
        return new Promise (async (resolve,reject)=>{
            try{
                let users = await User.find();
                resolve(users)

            }catch(error){
                reject(error)
            }
        })

    },
    blockUser: (id)=>{
        return new Promise (async (resolve,reject)=>{
            try{
                await User.findByIdAndUpdate(id,{$set:{isBlocked:true}});
                resolve()
            }
            catch(error){
               reject(error) 
            }
        })
    
    },
    unblockUser: (id)=>{
        return new Promise (async (resolve,reject)=>{
            try{
                await User.findByIdAndUpdate(id,{$set:{isBlocked:false}});
                resolve()
            }
            catch(error){
               reject(error) 
            }
        })
        
    },
    refundAmount: async (userid,refundAmount)=>{
         let amount = parseInt(refundAmount)

        try{
           let transaction = {amount:amount,date:Date.now()}
          let user =  await Wallet.findOne({userId:userid})
          if(user){
            await Wallet.updateOne({userId:userid},{
                $inc:{
                    walletAmount:amount
                },
                $push:{transactions:transaction}
            })
          }else{
              let walletObj = new Wallet({
                 userId : userid,
                 walletAmount:amount,
                 transactions:[transaction]
              })
              await Wallet.create(walletObj)
          }
            

        }catch(e){
            console.log(e);
        }
    },
    getSubcategoriesOnCategory: async (categoryId)=>{
        try{
         let subcategories =  await SubCategory.find({category_id:categoryId})
         return subcategories;

        }catch(e){
            console.log(e);
        }
    },
    dashboardData: async ()=>{
        try{
            let dataObj = {};
            let ordersCount = await Orders.countDocuments();
            let productsCount = await Products.countDocuments();
            let categoryCount = await Category.countDocuments();
            dataObj.ordersCount = ordersCount;
            dataObj.productsCount = productsCount;
            dataObj.categoryCount = categoryCount
            
            return dataObj

        }catch(e){
            console.log(e);
        }
    },
    getCategoryImage : async ()=>{
        try{
            let catImage = await CategoryImage.find();
            return catImage ;

        }catch(e){
            console.log(e);
        }
    }
}