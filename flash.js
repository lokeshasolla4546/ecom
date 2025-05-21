const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// MOCK DATABASE
const products = [
  { id: 1, name: 'iPhone 16', price: 99999 },
  { id: 2, name: 'Samsung Galaxy S24', price: 89999 },
  { id: 3, name: 'OnePlus 13RT', price: 72999 },
  { id: 4, name: 'Nothing', price: 69999 },
  { id: 5, name: 'OPPO Reno9', price: 50999 },
  { id: 6, name: 'Vivo Y100', price: 39999 },
  { id: 7, name: 'Nokia', price: 10999 }
];

const users = [];
const orders = [];
const carts = {}; 

//  UTILITIES 
const mockPayment = () => 'Success';

//  AUTHENTICATION CHECK
const authenticate = (req, res, next) => {
  const { user_id } = req.headers;
  const user = users.find(u => u.user_id === user_id);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
};

//  PRODUCT ROUTES 
// List products with pagination
app.get('/api/products', (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  if (page && limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = products.slice(startIndex, endIndex);
    return res.json({ data: paginated, total: products.length, page });
  }

  res.json({ data: products });
});

// Get product detail
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

//  USER ROUTES 
// Register user
app.post('/api/users/register', (req, res) => {
  const { user_id, password } = req.body;
  if (!user_id || !password) return res.status(400).json({ error: 'user_id and password required' });
  if (users.some(u => u.user_id === user_id)) return res.status(400).json({ error: 'User exists' });
  users.push({ user_id, password });
  res.status(201).json({ message: 'User registered' });
});

// Login user
app.post('/api/users/login', (req, res) => {
  const { user_id, password } = req.body;
  const user = users.find(u => u.user_id === user_id && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful', user_id });
});

//  CART ROUTES 
// Add product to cart
app.post('/api/cart', authenticate, (req, res) => {
  const { productId } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  if (!carts[req.user.user_id]) carts[req.user.user_id] = [];
  carts[req.user.user_id].push(product);
  res.json({ message: 'Product added to cart' });
});

// View cart
app.get('/api/cart', authenticate, (req, res) => {
  res.json({ cart: carts[req.user.user_id] || [] });
});
//  ORDER ROUTES 
// Create order with mock payment
app.post('/api/orders', authenticate, (req, res) => {
  const userId = req.user.user_id;
  const userCart = carts[userId] || [];
  if (userCart.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const order = {
    id: orders.length + 1,
    user_id: userId,
    items: userCart,
    total: userCart.reduce((sum, p) => sum + p.price, 0),
    paymentStatus: mockPayment(),
    createdAt: new Date()
  };
  orders.push(order);
  carts[userId] = []; // clear cart
  res.status(201).json({ message: 'Order placed', order });
});

// View order history with pagination
app.get('/api/orders', authenticate, (req, res) => {
  const userOrders = orders.filter(o => o.user_id === req.user.user_id);
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  if (page && limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = userOrders.slice(startIndex, endIndex);
    return res.json({ orders: paginated, total: userOrders.length, page });
  }

  res.json({ orders: userOrders });
});
//  TESTING PAYMENT STATUS 
app.get('/api/testpayment', (req, res) => {
  const status = mockPayment();
  res.json({ paymentStatus: status });
});


//  START SERVER 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n Server running on http://localhost:${PORT}`));
