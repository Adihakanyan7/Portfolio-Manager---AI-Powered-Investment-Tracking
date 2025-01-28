import mongoose from 'mongoose';
import Security from './security.js';

const StockSchema = new mongoose.Schema({
    dividend: { type: Number, required: true },
});

const Stock = Security.discriminator('Stock', StockSchema);

export default Stock;
