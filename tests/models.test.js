const mongoose = require('mongoose');
const Security = require('../models/security');
const Stock = require('../models/stock');
const Bond = require('../models/bond');
require('dotenv').config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await Security.deleteMany(); 
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Mongoose Models', () => {
    it('should create a Stock document successfully', async () => {
        const stock = new Stock({
            name: 'Apple',
            shares: 100,
            sector: 'Technology',
            levelOfRisk: 'high',
            variance: 1,
            percentage: 10,
            type: 'stock',
            subType: 'regular',
            S_industry: 3,
            dividend: 2,
        });
        const savedStock = await stock.save();

        expect(savedStock._id).toBeDefined();
        expect(savedStock.name).toBe('Apple');
        expect(savedStock.dividend).toBe(2);
    });

    it('should fail when required fields are missing', async () => {
        const stock = new Stock({
            sector: 'Technology',
        });

        let err;
        try {
            await stock.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.errors.name).toBeDefined();
        expect(err.errors.levelOfRisk).toBeDefined();
    });

    it('should create a Bond document successfully', async () => {
        const bond = new Bond({
            name: 'US Treasury',
            shares: 100,
            sector: 'Finance',
            levelOfRisk: 'low',
            variance: 2,
            percentage: 20,
            type: 'bond',
            subType: 'government',
            S_industry: 1,
            maturityDate: new Date('2035-01-01'),
        });
        const savedBond = await bond.save();

        expect(savedBond._id).toBeDefined();
        expect(savedBond.name).toBe('US Treasury');
        expect(savedBond.maturityDate).toBeInstanceOf(Date);
    });
});
