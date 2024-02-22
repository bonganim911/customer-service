import { Request, Response } from 'express';
import CustomerController from '../../src/controllers/customerController';
import TransactionService from '../../src/services/transactionService';

jest.mock('../../src/services/transactionService');

const originalConsoleError = console.error;
console.error = jest.fn(); // Mock console.error

describe('CustomerController', () => {
    afterAll(() => {
        console.error = originalConsoleError;
    });
    describe('getTransactions', () => {
        it('should return customer transactions for a valid customer ID', async () => {
            const mockReq = {params: {customerId: '123'}} as unknown as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

           const  mockTransactions = [
                {
                    "transactionId": 1,
                    "authorizationCode": "F10000",
                    "transactionDate": "2022-09-01T11:46:42+00:00",
                    "customerId": 1,
                    "transactionType": "ACH_INCOMING",
                    "transactionStatus": "PENDING",
                    "description": "Deposit from Citibank",
                    "amount": 5000,
                    "metadata": {}
                },
            ];
            (TransactionService.prototype.getCustomerTransactions as jest.Mock).mockResolvedValue(mockTransactions);

            await CustomerController.getTransactions(mockReq, mockRes);

            let customerId = 123;
            expect(TransactionService.prototype.getCustomerTransactions).toHaveBeenCalledWith(customerId);
            expect(mockRes.json).toHaveBeenCalledWith({ transactions: mockTransactions });
        });

        it('should handle errors and return 500 for invalid input', async () => {
            const mockReq = { params: { customerId: 'abc' } } as unknown as Request;
            const mockRes = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            } as unknown as Response;

            const mockError = new Error('Invalid customer ID');
            (TransactionService.prototype.getCustomerTransactions as jest.Mock).mockRejectedValue(mockError);

            await CustomerController.getTransactions(mockReq, mockRes);

            expect(TransactionService.prototype.getCustomerTransactions).toHaveBeenCalledWith(NaN);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
        });
    });
});
