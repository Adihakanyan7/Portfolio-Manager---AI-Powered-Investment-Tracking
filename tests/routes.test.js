const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server');



describe('CRUD Operations for Securities', () => {
    beforeAll(() => {
        server = app.listen(3000, () => {
            console.log('Test server is running on port 3000');
        });
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


    it('should create a new stock', async () => {
        const res = await request(app)
            .post('/api/create-stock')
            .send({
                name: 'Apple',
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

    it('should retrieve all securities', async () => {
        const res = await request(app).get('/api/get-all-securities');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0); // Assumes at least one document exists
    });
});
