import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    riskLevel: { type: String, required: true, enum: ['low', 'medium', 'high'] } 
});

const User = mongoose.model('User', userSchema);
export default User;
