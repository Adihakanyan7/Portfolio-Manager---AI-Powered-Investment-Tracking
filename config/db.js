import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        //console.log('MongoDB Connection Success');
    } catch (err) {
        console.error('MongoDB Connection Failed:', err.message);
        console.log('Stack trace:', err.stack);
        process.exit(1);
    }
};

export default connectDB;
