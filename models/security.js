import mongoose from 'mongoose';

const SecuritySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    shares: { type: Number, required: true, default: 0 },
    variance: { type: Number, required: true, enum: [1, 2] },
    type: { type: String, required: true, enum: ['stock', 'bond'] },
    S_industry: { type: Number, required: true, enum: [1, 2, 3] },
    dividend: { type: Number, required: false, default: 0 },
    currentPrice: { type: Number, required: false },
});

const Security = mongoose.model('Security', SecuritySchema);
export default Security;
