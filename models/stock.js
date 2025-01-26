const mongoose = require('mongoose');
const Security = require('./security');

const StockSchema = new mongoose.Schema({
  dividend: { type: Number, required: true },
  subType: { type: String, required: true, enum: ['regular', 'preferred'] },
});

const Stock = Security.discriminator('Stock', StockSchema);

module.exports = Stock;
