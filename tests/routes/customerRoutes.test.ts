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
                const transactions = [
                    {
                        "createdAt": "2022-11-10T13:05:00+00:00",
                        "updatedAt": "2022-11-10T13:05:00+00:00",
                        "transactionId": 33,
                        "authorizationCode": "F10016",
                        "status": "SETTLED",
                        "description": "Transfer to Bob",
                        "transactionType": "P2P_SEND",
                        "metadata": {
                            "relatedTransactionId": 8,
                            "deviceId": "A342011"
                        },
                        "timeline": [
                            {
                                "createdAt": "2022-11-10T13:05:00+00:00",
                                "status": "SETTLED",
                                "amount": -30
                            }
                        ]
                    }
                ];
                res.json({ transactions });
            });

            const res = await request(app).get('/123');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('transactions');
        });
    });

    // Add more route tests as needed
});
