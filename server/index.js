require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cooltechauth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Import and use the authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import and use the credentials routes
const credentialRoutes = require('./routes/credentials');
app.use('/api/credentials', credentialRoutes);

// Import and use the admin routes
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Import and use the division routes
const divisionRoutes = require('./routes/division');
app.use('/api/division', divisionRoutes);

// Placeholder for routes
app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
