import mongoose from 'mongoose';
import Security from './security.js';

const BondSchema = new mongoose.Schema({
    maturityDate: { type: Date, required: true },
});

const Bond = Security.discriminator('Bond', BondSchema);

export default Bond;
