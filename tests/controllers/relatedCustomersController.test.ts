import { Request, Response } from 'express';
import RelatedCustomersController from '../../src/controllers/relatedCustomersController';
import TransactionService from '../../src/services/transactionService';

jest.mock('../../src/services/transactionService');

const originalConsoleError = console.error;
console.error = jest.fn(); // Mock console.error

describe('RelatedCustomersController', () => {
    afterAll(() => {
        console.error = originalConsoleError;
    });
    describe('getRelatedCustomers', () => {
        it('should return related customer information for a valid customer ID', async () => {
            const mockReq = { params: { customerId: '123' } } as unknown as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

           const  mockRelatedCustomers = [
               {
                   "relatedCustomerId": 3,
                   "relationType": "P2P_SEND"
               },
               {
                   "relatedCustomerId": 5,
                   "relationType": "P2P_RECEIVE"
               }
           ];
            (TransactionService.prototype.getRelatedCustomers as jest.Mock).mockResolvedValue(mockRelatedCustomers);

            await RelatedCustomersController.getRelatedCustomers(mockReq, mockRes);

            let customerId = 123;
            expect(TransactionService.prototype.getRelatedCustomers).toHaveBeenCalledWith(customerId);
            expect(mockRes.json).toHaveBeenCalledWith({ relatedCustomers: mockRelatedCustomers });
        });

        it('should handle errors and return 500 for invalid input', async () => {
            const mockReq = { params: { customerId: 'abc' } } as unknown as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            const mockError = new Error('Invalid customer ID');
            (TransactionService.prototype.getRelatedCustomers as jest.Mock).mockRejectedValue(mockError);

            await RelatedCustomersController.getRelatedCustomers(mockReq, mockRes);

            expect(TransactionService.prototype.getRelatedCustomers).toHaveBeenCalledWith(NaN);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });
});
