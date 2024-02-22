import axios from 'axios';
import fetchTransactions from '../../src/services/transactionFetcher';

jest.mock('axios');
const originalConsoleError = console.error;
console.error = jest.fn(); // Mock console.error

describe('fetchTransactions', () => {
    afterAll(() => {
        console.error = originalConsoleError;
    });
    it('should fetch transactions successfully given the seen api', async () => {
        const mockResponseData: any[] = [];
        (axios.get as jest.MockedFunction<typeof axios.get>).mockImplementation(() => Promise.resolve({ data: mockResponseData }));

        const transactions = await fetchTransactions();

        expect(transactions).toEqual(mockResponseData);
        expect(axios.get).toHaveBeenCalledWith('https://cdn.seen.com/challenge/transactions-v2.json');
    });

    it('should throw an error when fetching transactions fails given that seen api is not available', async () => {
        const mockError = new Error('Failed to fetch transactions');
        (axios.get as jest.MockedFunction<typeof axios.get>).mockImplementation(() => Promise.reject(mockError));

        await expect(fetchTransactions()).rejects.toThrowError('Error fetching transactions, please try again later.');
        expect(axios.get).toHaveBeenCalledWith('https://cdn.seen.com/challenge/transactions-v2.json');
    });
});

