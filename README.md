# SoleOfStyle E-commerce project
This is an e-commerce project built using Node.js, MongoDB, and Express. It provides functionality for managing admin  and regular users.

## Features
- Admin Management
    - Login and authentication for admin
    - Admin dashboard to manage the e-commerce platform
    - User management (block/unblock users)
    - Product management (add/edit/delete)
    - Category management 
    - Coupon mangement (add/edit/disable/enable)
    - Order management (change order status/order details)
    - Sales report (pdf/excel)
    - Banner Management

- User Management
    - User registration and login (otp login/signup)
    - User account to manage personal information and orders
    - Products view (image zoom)
    - Cart(can change quantity based on product stock)
    - Coupon (apply/remove)
    - Order management (cancel/return - within 7 days)
    - Wallet management (money will be credited to user once he cancel or return the product if the payment is done)
    - Payment Option (Cash on delivery, Razorpay, Wallet)
    - Product search

## Technologies Used
- HTML
- CSS
- EJS (Embedded JavaScript)
- Node.js 
- Express.js 
- MongoDB 

## Prerequisites
 - Node.js installed
 - mongodb installed and running

## Getting Started

1.Clone Repository
git clone https://github.com/Ajithvpillai09/SolesOfStyle.git

2.Install dependencies
cd SolesOfStyle
npm install

3.Configure the environment variables
 - Create a .env file in the project root directory.
 - Define the required environment variables
   - MONGODB_URI for connecting to your MongoDB database.
   - Twillio -  TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,TWILIO_SERVICE_SSID
   - Razor pay - RAZOR_KEY_ID,RAZOR_SECRET_KEY
   - Session secret key

4.Start server
- npm start

## Contributing
- Contributions are welcome! If you find any issues or have suggestions for improvement, please feel free to open an issue or submit a pull request.
 


