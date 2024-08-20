const express = require('express');
const cors = require('cors');
const connectDB = require('./config');
const salesRoutes = require('./routes/salesRoutes'); // Ensure correct import
const customerRoutes = require('./routes/customerRoutes');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use the sales routes
app.use('/api/sales', salesRoutes);  // Pass the router to app.use()
app.use('/api/customer',customerRoutes);


module.exports = app;
