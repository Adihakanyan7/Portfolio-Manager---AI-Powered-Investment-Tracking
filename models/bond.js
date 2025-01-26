const mongoose = require('mongoose');
const Security = require('./security');

const BondSchema = new mongoose.Schema({
  maturityDate: { type: Date, required: true },
  subType: { type: String, required: true, enum: ['government', 'corporate'] },
});

const Bond = Security.discriminator('Bond', BondSchema);

module.exports = Bond;
