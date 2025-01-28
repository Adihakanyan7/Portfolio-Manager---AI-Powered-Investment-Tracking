import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import securityRoutes from './routes/securityRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

connectDB();
global.riskLevel = "medium";
global.riskThreshold = { min: 2.51, max: 4.5 };

app.use('/api/', securityRoutes);
app.use('/api/', transactionRoutes);
app.use('/api', riskRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


if (process.argv[1] === __filename) {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
} else {
    console.log('Not running as the main module');
}

export default app;
