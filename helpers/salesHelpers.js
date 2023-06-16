
const Order = require('../models/orderSchema')



module.exports = {
    weeklySales:async ()=>{
        try{
            let weeklyReport =   await Order.aggregate([
                {
                 $unwind:'$products'
                },
                {
                 $match: {
                     'products.orderStatus': {
                         $nin: ['Cancelled','Returned']
                     }
                 }
                },
                {
                  $group:{
                    _id:'$createdAt',
                    total:{
                       $sum:'$totalAmount'
                            }  
                    }
                },
                {
                    $sort:{
                        '_id':-1
                    }
                },
                {
                    $limit:7
                },
                {
                    $sort:{
                        '_id':1
                    }
                }
             ])
              weeklyReport = weeklyReport.map((document) => ({
                date: document._id.toLocaleDateString('en-US'),
                total: document.total
              }));

          return weeklyReport;

        }catch(e){
            console.log(e);
        }
     },
     weekTotal: async ()=>{
        let weekTotal = await Order.aggregate([
            {
                $unwind:'$products'
            },
            {
                $match:{
                    'products.orderStatus':{
                         $nin: ['Cancelled','Returned']
                        }
                }
            },
            {
                $group:{
                  _id:'$createdAt',
                  total:{
                     $sum:'$totalAmount'
                          }  
                  }
              },
              {
                  $sort:{
                      '_id':-1
                  }
              },
              {
                  $limit:7
              },
              {
                  $sort:{
                      '_id':1
                  }
              },
              {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: '$total'
                    }
                }
              }

        ])
        return weekTotal;
     },
     monthlySales:async()=>{
        try{
            let monthlySales = await Order.aggregate([
               {
                $unwind:'$products'
               },
               {
                $match:{
                    'products.orderStatus':{
                         $nin: ['Cancelled','Returned']
                        }
                }
               },
               {
                $group:{
                    _id:{
                        $dateToString: {
                          format: '%m-%Y', // format to extract year and month
                          date: '$createdAt'
                        }
                      },
                      total:{
                        $sum:'$totalAmount'
                             }  
                     
                }
               },
               {
                $sort:{
                    '_id':-1
                }
               },
               {
                $limit:7
               },
               {
                $sort:{
                    '_id':1
                }
               },
               

            ])
console.log(monthlySales);
            return monthlySales
            
        }catch(e){
            console.log(e);
        }
     },
     monthlyTotal:async ()=>{
        try{
            let monthlyTotal = await Order.aggregate([
                {
                    $unwind:'$products'
                },
                {
                    $match:{
                       'products.orderStatus':{
                        $nin:['Cancelled','Returned']
                       }
                    }
                },
                {
                 $group:{
                      _id:{
                          $dateToString: {
                          format: '%m-%Y', // format to extract year and month
                          date: '$createdAt'
                      }
                         },
                    total:{
                     $sum:'$totalAmount'
                          }  
                         
                  }
                 },
                {
                    $sort:{
                        '_id':-1
                    }
               },
               {
                    $limit:7
               },
               {
                  $sort:{
                        '_id':1
                    }
               },
               {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: '$total'
                    }
                }
              }
    
            ])

            return monthlyTotal;

        }catch(e){
            console.log(e);
        }
     },
     yearlySales:async()=>{
        try{
            let yearlySales = await Order.aggregate([
                {
                 $unwind:'$products'
                },
                {
                 $match:{
                     'products.orderStatus':{
                          $nin: ['Cancelled','Returned']
                         }
                 }
                },
                {
                 $group:{
                     _id:{
                         $dateToString: {
                           format: '%Y', // format to extract year and month
                           date: '$createdAt'
                         }
                       },
                       total:{
                         $sum:'$totalAmount'
                              }  
                      
                 }
                },
                {
                 $sort:{
                     '_id':-1
                 }
                },
                {
                 $limit:7
                },
                {
                 $sort:{
                     '_id':1
                 }
                },
                
 
             ])
 
             return yearlySales
             


        }catch(e){
            console.log(e);
        }
     },
     yearTotal: async()=>{
        try{
            let yearTotal = await Order.aggregate([
                {
                    $unwind:'$products'
                },
                {
                    $match:{
                       'products.orderStatus':{
                        $nin:['Cancelled','Returned']
                       }
                    }
                },
                {
                 $group:{
                      _id:{
                          $dateToString: {
                          format: '%Y', // format to extract year and month
                          date: '$createdAt'
                      }
                         },
                    total:{
                     $sum:'$totalAmount'
                          }  
                         
                  }
                 },
                {
                    $sort:{
                        '_id':-1
                    }
               },
               {
                    $limit:7
               },
               {
                  $sort:{
                        '_id':1
                    }
               },
               {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: '$total'
                    }
                }
              }
    
            ])

            return yearTotal;

        }catch(e){
            console.log(e);
        }

     },
     totalSales:async ()=>{
        try{
            let salesTotal = await Order.aggregate([
                {
                    $unwind:'$products'
                },
                {
                    $match:{
                    'products.orderStatus':{
                        $nin:['Cancelled','Returned']
                    }
                    }
                },
                {
                    $group:{
                        _id:null,
                        salesTotal:{
                            $sum:'$totalAmount'
                        }
                    }

                }
            ])

           

            return salesTotal

        }catch(e){
            console.log(e);
        }
     },
     allOrderBasedOnMonths: async ()=>{
        try{
                    
            const startOfYear = new Date(new Date().getFullYear(), 0, 1); // start of the year
            const endOfYear = new Date(new Date().getFullYear(), 11, 31); // end of the year
        
            let orderBasedOnMonths = await Order.aggregate([
            // match orders within the current year
            { $match: { createdAt: { $gte: startOfYear, $lte: endOfYear } } },
        
            // group orders by month
            {
                $group: {
                _id: { $month: "$createdAt" },
                orders: { $push: "$$ROOT" }
                }
            },
        
            // project the month and orders fields
            {
                $project: {
                _id: 0,
                month: "$_id",
                orders: 1
                }
            },
            {
                $project: {
                month: 1,
                orderCount: { $size: "$orders" }
                }
            }
            , {
                $sort: { month: 1 }
            }
            ]);
           
        
        return orderBasedOnMonths;

        }catch(e){
            console.log(e);
        }
     },
     cancelledOrders : async ()=>{
        try{
            let cancelledOrders = await Order.aggregate([
                {
                   $unwind:'$products'
                },
                // match orders within the current year
                {
                    $match:{
                        'products.orderStatus':{
                            $in:['Cancelled']
                        }
                        }
                
                },
                   
                // group orders by month
                {
                    $group: {
                    _id: { $month: "$createdAt" },
                    orders: { $push: "$$ROOT" }
                    }
                },
            
                // project the month and orders fields
                {
                    $project: {
                    _id: 0,
                    month: "$_id",
                    orders: 1
                    }
                },
                {
                    $project: {
                    month: 1,
                    orderCount: { $size: "$orders" }
                    }
                }
                , {
                    $sort: { month: 1 }
                }
                ]);
            
            return cancelledOrders;

        }catch(e){

        }
     },
     returnedOrders: async ()=>{
        try{
            let returnedOrders = await Order.aggregate([
                {
                    $unwind:'$products'
                },
                {
                    $match:{
                        'products.orderStatus':{
                            $in:['Returned']
                        }
                    }
                },
                {
                    $group: {
                    _id: { $month: "$createdAt" },
                    orders: { $push: "$$ROOT" }
                    }
                },
                {
                    $project: {
                    _id: 0,
                    month: "$_id",
                    orders: 1
                    }
                },
                {
                    $project: {
                    month: 1,
                    orderCount: { $size: "$orders" }
                    }
                }
                , {
                    $sort: { month: 1 }
                }

            ])

            return returnedOrders;

        }catch(e){

        }

     },
     monthSales: async ()=>{
        try{
            let monthlySales = await Order.aggregate([
                {
                    $unwind:'$products'
                },
                {
                    $match:{
                        'products.orderStatus':{
                            $nin:['Cancelled','Returned']
                        }
                    }
                },
                {
                    $group: {
                    _id: { $month: "$createdAt" },
                    total:{
                        $sum:'$totalAmount'
                             }  
                    }
                },
                {
                    $project: {
                    _id: 0,
                    month: "$_id",
                    total: 1
                    }
                },
                {
                    $sort: { month: 1 }
                }

            ])
            return monthlySales;

        }catch(e){
            console.log(e);
        }
     }
}