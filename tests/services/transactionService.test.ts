import {Transaction} from "../../src/models/Transaction";
import {AggregatedData, AggregatedTransaction} from "../../src/models/AggregatedTransaction";
import TransactionService from "../../src/services/transactionService";
import fetchTransactions from "../../src/services/transactionFetcher";
import {TransactionType} from "../../src/util/TransactionType";

jest.mock("../../src/services/transactionFetcher");

const originalConsoleError = console.error;
console.error = jest.fn(); // Mock console.error

describe('TransactionService', () => {
    let mockTransactions: Transaction[];
    let transactionService: TransactionService;
    const customerId = 123;

    beforeEach(() => {
        mockTransactions = [
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
            {
                "transactionId": 2,
                "authorizationCode": "F10000",
                "transactionDate": "2022-09-03T15:41:42+00:00",
                "customerId": 1,
                "transactionType": "ACH_INCOMING",
                "transactionStatus": "SETTLED",
                "description": "Deposit from Citibank",
                "amount": 5000,
                "metadata": {
                    "relatedTransactionId": 1
                }
            },
        ];
        transactionService = new TransactionService([]);
    });
    afterAll(() => {
        console.error = originalConsoleError;
    });
    describe('getCustomerTransactions', () => {
        it('should fetch and aggregate customer transactions correctly', async () => {
            const mockFetchCustomerTransactions = jest.fn().mockResolvedValue(mockTransactions);
            const mockAggregateTransactions = jest.fn().mockReturnValue(mockTransactions[0]);

            transactionService.fetchFilteredCustomerTransactions = mockFetchCustomerTransactions;
            transactionService.aggregateTransactions = mockAggregateTransactions;

            await transactionService.getCustomerTransactions(customerId);

            expect(mockFetchCustomerTransactions).toHaveBeenCalledWith(customerId);
            expect(mockAggregateTransactions).toHaveBeenCalledWith(mockTransactions);
        });

        it('should handle the edge case where fetchCustomerTransactions returns an empty array', async () => {
            transactionService.fetchFilteredCustomerTransactions = jest.fn().mockResolvedValue([]);

            const result = await transactionService.getCustomerTransactions(customerId);

            expect(result).toEqual({transactions: []});
        });

        it('should handle the edge case where fetchCustomerTransactions returns no transactions for the given customerId', async () => {
            transactionService.fetchFilteredCustomerTransactions = jest.fn().mockResolvedValue([]);

            const result = await transactionService.getCustomerTransactions(customerId);

            expect(result).toEqual({transactions: []});
        });
    });
    describe('fetchCustomerTransactions', () => {
        it('should fetch customer transactions from seen service when transactions are not available', async () => {

            (fetchTransactions as jest.Mock).mockResolvedValue(mockTransactions);

            const result = await transactionService.fetchFilteredCustomerTransactions(customerId);

            expect(fetchTransactions).toHaveBeenCalled();

            let filteredByCustomerId = mockTransactions.filter(transaction => transaction.customerId === customerId);
            expect(result).toEqual(filteredByCustomerId);
        });
        it('should return an empty array when no transactions are available from seen service', async () => {
            (fetchTransactions as jest.Mock).mockResolvedValue([]);

            const result = await transactionService.fetchFilteredCustomerTransactions(customerId);

            expect(fetchTransactions).toHaveBeenCalled();

            expect(result).toEqual([]);
        });
    });
    describe('aggregateTransactions', () => {
        it('should aggregate transactions correctly given transactions', () => {
            const result: AggregatedData = transactionService.aggregateTransactions(mockTransactions);

            expect(result.transactions.length).toEqual(1);

            const aggregatedTransaction: AggregatedTransaction = result.transactions[0];
            expect(aggregatedTransaction.authorizationCode).toEqual("F10000");
            expect(aggregatedTransaction.createdAt).toEqual("2022-09-01T11:46:42+00:00");
            expect(aggregatedTransaction.updatedAt).toEqual("2022-09-03T15:41:42+00:00");
            expect(aggregatedTransaction.transactionId).toEqual(1);
            expect(aggregatedTransaction.status).toEqual("SETTLED");
            expect(aggregatedTransaction.description).toEqual("Deposit from Citibank");
            expect(aggregatedTransaction.transactionType).toEqual("ACH_INCOMING");
            expect(aggregatedTransaction.metadata).toEqual({});
            expect(aggregatedTransaction.timeline.length).toEqual(2);

            const timelineEntry1 = aggregatedTransaction.timeline[0];
            expect(timelineEntry1.createdAt).toEqual("2022-09-01T11:46:42+00:00");
            expect(timelineEntry1.status).toEqual("PENDING");
            expect(timelineEntry1.amount).toEqual(5000);

            const timelineEntry2 = aggregatedTransaction.timeline[1];
            expect(timelineEntry2.createdAt).toEqual("2022-09-03T15:41:42+00:00");
            expect(timelineEntry2.status).toEqual("SETTLED");
            expect(timelineEntry2.amount).toEqual(5000);
        });
        it('should aggregate transactions correctly, given another transaction with a different authorizationCodes', () => {
            let newTransactionWithDifferentAuthCode = {
                "transactionId": 3,
                "authorizationCode": "F20000",
                "transactionDate": "2022-09-03T15:41:42+00:00",
                "customerId": 1,
                "transactionType": "ACH_INCOMING",
                "transactionStatus": "SETTLED",
                "description": "Deposit from Citibank",
                "amount": 5000,
                "metadata": {
                    "relatedTransactionId": 1
                }
            };
            mockTransactions.push(...mockTransactions, <Transaction>newTransactionWithDifferentAuthCode);

            const result: AggregatedData = transactionService.aggregateTransactions(mockTransactions);

            expect(result.transactions.length).toEqual(2);

            const aggregatedTransaction: AggregatedTransaction = result.transactions[0];
            const secondAggregatedTransaction: AggregatedTransaction = result.transactions[1];
            expect(aggregatedTransaction.authorizationCode).toEqual("F10000");
            expect(secondAggregatedTransaction.authorizationCode).toEqual("F20000");

        });
    });
    describe('extractRelatedCustomers', () => {
        it('extract related customers successfully given the transaction with metadata value',() => {
            transactionService = new TransactionService([
                {
                    "transactionId": 1,
                    "authorizationCode": "F10000",
                    "transactionDate": "2022-09-01T11:46:42+00:00",
                    "customerId": 1,
                    "transactionType": TransactionType.P2P_RECEIVE,
                    "transactionStatus": "PENDING",
                    "description": "Deposit from Citibank",
                    "amount": 5000,
                    "metadata": {
                        "relatedTransactionId": 1
                    }
                },
            ]);
            const relatedCustomers = transactionService.extractRelatedCustomers(1, mockTransactions);
            expect(relatedCustomers.length).toBe(1);
            expect(relatedCustomers[0]).toEqual({relatedCustomerId: 1, relationType: TransactionType.P2P_RECEIVE});
        });

        it('should return an empty array when there are no related transactions given tha metadata has no values', () => {
            const transactions: Transaction[] = [
                {
                    "transactionId": 1,
                    "authorizationCode": "F10000",
                    "transactionDate": "2022-09-01T11:46:42+00:00",
                    "customerId": 1,
                    "transactionType": TransactionType.DEVICE,
                    "transactionStatus": "PENDING",
                    "description": "Deposit from Citibank",
                    "amount": 5000,
                    "metadata": {}
                }
            ];

            const relatedCustomers = transactionService.extractRelatedCustomers(1, transactions);
            expect(relatedCustomers).toEqual([]);
        });
    });

    describe('fetchFilteredCustomerTransactions', () => {
        it('should fetch customer transactions when transactions given that they are available in transaction object', async () => {
            transactionService = new TransactionService(mockTransactions);
            const result = await transactionService.fetchFilteredCustomerTransactions(customerId);

            let filteredByCustomerId = mockTransactions.filter(transaction => transaction.customerId === customerId);

            expect(result).toEqual(filteredByCustomerId);
        });

        it('should return customer transactions from seen api when they not available in transactions object', async () => {
            (fetchTransactions as jest.Mock).mockResolvedValue(mockTransactions);

            const result = await transactionService.fetchFilteredCustomerTransactions(customerId);
            expect(fetchTransactions).toHaveBeenCalled();

            expect(result).toEqual([]);
        });
    });
});
