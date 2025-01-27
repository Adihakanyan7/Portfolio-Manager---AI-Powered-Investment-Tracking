const mongoose = require('mongoose');
const Security = require('../models/security');
const Stock = require('../models/stock');
const Bond = require('../models/bond');
const request = require('supertest');
const app = require('../server');

beforeAll(() => {
    server = app.listen(3000, () => {
        console.log('Test server is running on port 3000');
    });
});

afterEach(async () => {
    await Security.deleteMany(); 
});

afterAll(async () => {
    await mongoose.connection.close();
    await new Promise((resolve) => {
        server.close(() => {
            console.log('Test server closed.');
            resolve(); // Ensure Jest waits for this
        });
    });
});

describe('CRUD Operations for Securities', () => {

    it('should create a new stock', async () => {
        const res = await request(app)
            .post('/api/create-stock')
            .send({
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
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('Apple');
    });

    it('should create a new bond', async () => {
        const res = await request(app)
            .post('/api/create-bond')
            .send({
                name: 'US Treasury',
                shares: 100,
                sector: 'Finance',
                levelOfRisk: 'low',
                variance: 2,
                percentage: 20,
                type: 'bond',
                subType: 'government',
                S_industry: 1,
                maturityDate: '2035-01-01',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('US Treasury');
    });

    it('should update a stock by name', async () => {
        const stock = await Stock.create({
            name: 'Google',
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

        const res = await request(app)
            .put('/api/update-stock-by-name')
            .send({
                name: 'Google',
                shares: 150,
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Google');
        expect(res.body.shares).toBe(150);
    });

    it('should return 404 if stock not found for update', async () => {
        const res = await request(app)
            .put('/api/update-stock-by-name')
            .send({
                name: 'NonExistentStock',
                shares: 50,
            });

        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Stock not found');
    });


    it('should retrieve all securities', async () => {
        const stock = await Stock.create({
            name: 'Google',
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

        const res = await request(app).get('/api/get-all-securities');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0); // Assumes at least one document exists
    });

    it('should delete a stock by name', async () => {
        const stock = await Stock.create({
            name: 'Apple',
            sector: 'Technology',
            levelOfRisk: 'high',
            variance: 1,
            percentage: 10,
            type: 'stock',
            subType: 'regular',
            S_industry: 3,
            shares: 100,
            dividend: 2,
        });

        const res = await request(app)
            .delete('/api/delete-stock-by-name')
            .send({ name: 'Apple' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Stock 'Apple' deleted successfully");
    });

    it('should delete a bond by name', async () => {
        const bond = await Bond.create({
            name: 'US Treasury',
            sector: 'Finance',
            levelOfRisk: 'low',
            variance: 2,
            percentage: 20,
            type: 'bond',
            subType: 'government',
            S_industry: 1,
            shares: 50,
            maturityDate: '2035-01-01',
        });

        const res = await request(app)
            .delete('/api/delete-bond-by-name')
            .send({ name: 'US Treasury' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe("Bond 'US Treasury' deleted successfully");
    });

    it('should return 404 if stock not found for deletion by name', async () => {
        const res = await request(app)
            .delete('/api/delete-stock-by-name')
            .send({ name: 'NonexistentStock' });

        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBe('Stock not found');
    });
    
    it('should calculate the risk of a security', async () => {
        const stock = await Stock.create({
          name: 'Apple',
          shares: 100,
          sector: 'Technology',
          levelOfRisk: 'high',
          variance: 2,
          percentage: 10,
          type: 'stock',
          subType: 'regular',
          S_industry: 3,
          dividend: 2,
        });
      
        const res = await request(app).get(`/api/calculate-risk/${stock.name}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
          name: 'Apple',
          risk: 6,
        });
      });
      
});
