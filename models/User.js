// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Clear existing model if it exists
mongoose.models = {};
mongoose.modelSchemas = {};

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    index: true // Add explicit index
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Add this to ensure Mongoose doesn't add any indexes we don't explicitly define
  autoIndex: false 
});

// Create index programmatically
userSchema.index({ email: 1 }, { unique: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// Ensure indexes are created properly
User.syncIndexes().then(() => {
  console.log('User indexes synchronized');
}).catch(err => {
  console.error('Error synchronizing indexes:', err);
});

module.exports = User;