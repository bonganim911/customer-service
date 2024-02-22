import request from 'supertest';
import express from 'express';
import CustomerController from '../../src/controllers/customerController';
import router from "../../src/routes/customerRoutes";

jest.mock('../../src/controllers/customerController');

const app = express();
app.use('/', router); // Mount the router on the app

describe('Customer Routes', () => {
    describe('GET /:customerId', () => {
        it('should return 200 OK and transactions for a valid customer ID', async () => {
            const mockReq = { params: { customerId: '123' } };
            const mockRes = { json: jest.fn() };

            // Mock the controller method
            (CustomerController.getTransactions as jest.Mock).mockImplementation(async (req, res) => {
                const transactions = [{ id: 1, amount: 100 }, { id: 2, amount: 200 }];
                res.json({ transactions });
            });

            const res = await request(app).get('/123');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('transactions');
        });
    });

    // Add more route tests as needed
});
