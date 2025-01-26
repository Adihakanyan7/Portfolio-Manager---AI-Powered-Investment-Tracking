const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const securityRoutes = require('./routes/securityRoutes');

const app = express();
app.use(express.json());

connectDB();

app.use('/api/', securityRoutes);



module.exports = app;

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}