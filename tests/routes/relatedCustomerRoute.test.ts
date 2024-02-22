import request from 'supertest';
import express from 'express';
import router from "../../src/routes/relatedCustomerRoutes";
import RelatedCustomersController from "../../src/controllers/relatedCustomersController";

jest.mock('../../src/controllers/relatedCustomersController');

const app = express();
app.use('/', router); // Mount the router on the app

describe('Related Customers Routes', () => {
    describe('GET /:customerId', () => {
        it('should return related customers for a valid customer ID', async () => {
            let customerId = '123';
            const mockReq = { params: { customerId: customerId } };
            const mockRes = { json: jest.fn() };

            (RelatedCustomersController.getRelatedCustomers as jest.Mock).mockImplementation(async (req, res) => {
                const relatedCustomers = [
                    {
                        "relatedCustomerId": 3,
                        "relationType": "P2P_SEND"
                    }];
                res.json({ relatedCustomers });
            });

            const response = await request(app).get('/' + customerId);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('relatedCustomers');
            expect(response.body.relatedCustomers).toHaveLength(1);
        });
    });
});
