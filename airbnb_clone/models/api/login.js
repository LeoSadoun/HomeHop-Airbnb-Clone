//Import models
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//import User model
const User = require('./User');

 // Load environment variables
require('dotenv').config();   


const app = express();
const port = process.env.PORT || 8080;


// MongoDB connection
mongoose.connect(`mongodb+srv://leosadoun4:Sadoun2018@homehop.8oykt.mongodb.net/`)//Change to the main mongoose cluster
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


app.use(express.json());

app.post('/modules/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      //Checks if user put in both email and password
      if(!email || !password){
        return res.status(400).json({message: `Missing email or password`})
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET); // Replace with a strong secret
      res.json({ token });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})