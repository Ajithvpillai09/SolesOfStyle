
const bcrypt = require('bcryptjs')

const User = require('../models/userSchema');
const Banner = require('../models/bannerSchema')
const Wallet = require('../models/walletSchema')

module.exports={
    findUserSignUp:(userData)=>{
        const {email,phone} = userData
         let response ={};
         return new Promise(async (resolve,reject)=>{
            try{
                response.userFind = await User.findOne({$or:[{email:email},{phone:phone}]})
                if(response.userFind){
                    response.status = false
                    resolve(response)
                }else{
                    response.status = true
                    resolve(response)
                 }
            }catch(e){
               reject(e)
            }
         })

    },
     doSignUp:(userData)=>{
        let {name,email,password,phone} = userData
        let response = {}
        return new Promise(async(resolve,reject)=>{
            try{
                const newUser = new User({
                  name,
                  email,
                  password,
                  phone  
                })
                newUser.password = await bcrypt.hash(password,10)
                newUser.save()
                .then(data=>{
                    response.status = true;
                    response.userData = data;
                    resolve(response)
                }).catch(e=>{
                    reject(e)
                })

            }catch(error){
                reject(error)
            }
        })
    },
   
    doLogin : (userData)=>{
        const {email,password} = userData;
        const response = {};
        return new Promise (async (resolve,reject)=>{
            try{
                let authUser = await User.findOne({email:email});
                if(authUser){
                    if(!authUser.isBlocked){
                        bcrypt.compare(password,authUser.password).then((current)=>{
                              if(current){
                              response.userData = authUser;
                              response.status = true;
                              resolve(response);
                              }else{
                              response.message = "Invalid Password"
                              response.status = false;
                              resolve(response);
                             }
                     }).catch(e=>{
                        console.log(e.message);
                     })
                    }else{
                        response.message = "You are Restricted"
                        response.status = false;
                        resolve(response);
                    }

                }else{
                    response.message = "Invalid Username";
                    response.status = false;
                    resolve(response)
                }

            }catch(error){
                reject(error)
    
            }

        })
        

    },
    validateNumber: async (mob) => {
        let response = {};
        try {
            let user = await User.findOne({phone: mob});
            if (user) {
                response.status = true;
                response.user = user;
            } else {
                response.status = false;
                response.message = "Invalid Phone Number";
            }
            return response;
        } catch (err) {
            console.log(err);
            throw new Error('Internal server error');
        }
    },
    findUser : (id)=>{
        return new Promise (async (resolve,reject)=>{
             User.findById({_id:id}).then(userData=>{
                resolve(userData)
             }).catch(err=>{
                reject(err)
             })
        })
    },
    editProfile:async (newData,user)=>{
        let response ={}
        try{
         if(newData.email != user.email ){
            let user = await User.findOne({email:newData.email})
            if(user){
                 response.status = false;
                 response.message = "Email already registered"
                 return response;
                }
                
            }
        else if(newData.phonenumber != user.phone){
            let user = await User.findOne({phone:newData.phonenumber})
            if(user){
                response.status = false;
                response.message = " Already registered mobile number"
                return response;
               }
            }
    
            await User.findByIdAndUpdate(user._id,{name:newData.username,email:newData.email,phone:newData.phonenumber});
            response.status = true;
            return response;
    
        
    }catch(e){
            console.log("!!!!!!!!!!!!!!!!!!!Profile editing errorr!!!!!!!!!!!!");
        }
    },
    changePassword: async (oldPassword, newPassword, user) => {
        let response = {};
        let id = user._id;
        try {
          let current = bcrypt.compareSync(oldPassword, user.password);
          
          if (current) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            try {
             let user = await User.findByIdAndUpdate(id, { password: hashedPassword });
             console.log(user);
              response.data = user;
              response.status = true;
            } catch (error) {
              console.log("Error updating user's password:", error);
              response.status = false;
            }
          } else {
            response.status = false;
          }
      
          return response;
            }catch(e){
            console.log("!!!!!!!!!!!!!!!!!!password changing error!!!!!!!!!!!!!");
         }
    },
    activeUser :async ()=>{
        try{
            let activeUsers = await User.countDocuments({isBlocked:false})
            return activeUsers

        }catch(e){
            console.log(e);
        }
    },
    bannerData : async ()=>{
        try{
            let bannerData = await Banner.findOne()
            return bannerData

        }catch(e){
            console.log(e);
        }
    },

    findBanner : async (id)=>{
        try{
            let bannerData = await Banner.findById(id)
            return bannerData;

        }catch(e){
            console.log(e);
        }
    },
   findWallet: async (id)=>{
    try{
        let wallet = await Wallet.findOne({userId:id})
        return wallet;
    }catch(e){
        console.log(e);
    }
   }

}

 