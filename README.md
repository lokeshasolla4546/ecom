# E-Commerce Backend (Node.js + Express)
This is a simple backend app where users can register, login, view products, manage cart, place orders and simulate payments. All data is stored in memory (mock).

# How to Run
npm install  
node flash.js

# Server
http://localhost:5000

# Endpoints

# Products
GET    /api/products?page=1&limit=3    → List products (paginated optional)  
GET    /api/products/:id               → Get single product

# Users
POST   /api/users/register             → Register user  
POST   /api/users/login                → Login user

# Cart (requires user_id in header)
POST   /api/cart                       → Add to cart  
GET    /api/cart                       → View cart

# Orders (requires user_id in header)
POST   /api/orders                     → Create order  
GET    /api/orders?page=1&limit=2     → View order history

# Payment
GET    /api/testpayment                → Mock payment status

# Headers (for auth routes)
user_id: <your_user_id>

# Postman Results
# products listing 
![alt text](/postman/1.png)
# single product detailing
![alt text](/postman/2.png)
# user registration
![alt text](/postman/3.png)
# user login
![alt text](/postman/4.png)
# Adding product to the cart
![alt text](/postman/5.png)
# view cart
![alt text](/postman/6.png)
# create order
![alt text](/postman/7.png)
# view order history 
![alt text](/postman/8.png)
# payment status
![alt text](/postman/9.png)

