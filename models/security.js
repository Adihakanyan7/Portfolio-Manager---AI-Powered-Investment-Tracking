const mongoose = require('mongoose');

const SecuritySchema = new mongoose.Schema({
    name: { type: String, required: true },
    sector: { type: String, required: true, enum: ['Technology', 'Real Estate', 'Finance', 'Health', 'Energy'] },
    levelOfRisk: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    variance: { type: Number, required: true, enum: [1, 2] },
    percentage: { type: Number, min: 1, max: 100 },
    type: { type: String, required: true, enum: ['stock', 'bond'] },
    subType: { type: String, required: true, enum: ['regular', 'preferred', 'government', 'corporate'] },
    S_industry: { type: Number, required: true, enum: [1, 2, 3] },
  });

const Security = mongoose.model('Security', SecuritySchema);
module.exports = Security;