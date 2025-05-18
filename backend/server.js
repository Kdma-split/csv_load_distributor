require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRoutes = require('./routes/user.route.js');
const agentRoutes = require('./routes/agent.route.js');
const listRoutes = require('./routes/list.route.js');
const { errorHandler } = require('./middlewares/errorHandler.middleware.js');
const morgan = require('morgan');
require('./db/dbConnect.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  // credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/lists', listRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});