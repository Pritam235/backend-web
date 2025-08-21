// // models/Trip.js
// const mongoose = require('mongoose');

// const tripSchema = new mongoose.Schema({
//   destination: String,
//   startDate: String,
//   days: Number,
//   persons: Number,
//   contact: Number,
// });

// module.exports = mongoose.model('Trip', tripSchema);

const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: String,
  destination: String,
  startDate: String,
  endDate: String,
  persons: Number,
  contact: Number,
});

module.exports = mongoose.model('Trip', tripSchema);

