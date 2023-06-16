const Address = require('../models/addressSchema');

const getAddress = async (id)=>{
    try{
       let address =await Address.find({user:id},{address:1,_id:0})
       return address
    }catch(e){
        console.log(e);
    }
}

const addAddress = async (user,userData)=>{
    let addAddress = {
        firstname:userData.firstname,
        lastname:userData.lastname,
        state:userData.state,
        streetaddress:userData.streetAddress,
        appartment:userData.appartment,
        town:userData.town,
        zip:userData.zip,
        mobile:userData.mobile,
        email:userData.email,
        radio:userData.radio
    }

   try{
   let data = await Address.findOne({user:user._id})
    if(data){
        data.address.push(addAddress) 
        const userData = await Address.findOneAndUpdate(
            {user:user._id},
            {$set:{address:data.address}},
            { returnDocument: "after" }
            );
          
         }else{
        const newAddress = new Address({
            user:user._id,
            address:[addAddress]
        });

        const addressData = await newAddress.save();
      
      
    }
   }catch(e){
    console.log(e);
   }
}

const editAddress =async (userId,addressId)=>{
    try{
        const userfind = await Address.findOne({user:userId});
        const address = userfind.address.find(index=>index._id == addressId);
        return address;
    }catch(e){
        console.log(e);
    }
}

const updateAddress = async (userId,data)=>{
  
   const addressId = data.addressId
  
   const updatedAddress = {
    firstname:data.firstname,
    lastname:data.lastname,
    email:data.email,
    mobile:data.mobile,
    streetaddress:data.streetAddress,
    appartment:data.appartment,
    town:data.town,
    state:data.state,
    zip:data.zip,
    radio:data.radio
}
   try{ 
    const result = await Address.updateOne(
        { user: userId, "address._id": addressId },
        { $set: { "address.$": updatedAddress } }
      );
    
   }catch(e){
   console.log(e);
   }
}

const deleteAddress = async (userid, addressid) => {
    try {
      const result = await Address.updateOne(
        { user: userid},
        { $pull: { address: { _id: addressid } } }
      );
      
    } catch (e) {
      console.log(e);
    }
  };

const getDeliveryAddress = async (userId,addressId)=>{
    try{
       const addressFind = await Address.findOne({user:userId});
       const address = addressFind.address;
       const deliveryAddress = address.find(item => item._id == addressId)
       return deliveryAddress
      }catch(e){
        console.log(e);
    }
}

module.exports  = {
    getAddress,
    addAddress,
    editAddress,
    updateAddress,
    deleteAddress,
    getDeliveryAddress
}