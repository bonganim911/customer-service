import {Transaction} from "../models/Transaction";
import {AggregatedData, AggregatedTransaction} from "../models/AggregatedTransaction";
import {RelatedCustomer} from "../models/RelatedCustomer";
import fetchTransactions from "./transactionFetcher";
import {TransactionType} from "../util/TransactionType";


class TransactionService {
    private transactions: Transaction[];

    constructor(transactions: Transaction[]) {
        this.transactions = transactions;
    }

    async getCustomerTransactions(customerId: number): Promise<AggregatedData> {
        const transactions = await this.fetchFilteredCustomerTransactions(customerId);

        if (transactions.length === 0)
            return { transactions: [] };

        return this.aggregateTransactions(transactions);
    }

    async fetchFilteredCustomerTransactions(customerId: number): Promise<Transaction[]> {
        if (this.transactions.length === 0) {
            this.transactions = await fetchTransactions();
        }
        return this.transactions.filter(transaction => transaction.customerId === customerId);
    }

    aggregateTransactions(transactions: Transaction[]): AggregatedData {
        const groupedTransactions: { [key: string]: AggregatedTransaction } = {};

        transactions.forEach(transaction => {
            const authorizationCode = transaction.authorizationCode;
            const createdAt = transaction.transactionDate;
            const updatedAt = transaction.transactionDate;
            const status = transaction.transactionStatus;
            const description = transaction.description;
            const transactionType = transaction.transactionType;
            const metadata = transaction.metadata;
            const transactionId = transaction.transactionId;

            const relatedTransactionId = metadata.relatedTransactionId;

            const timelineEntry = {
                createdAt: createdAt,
                status: status,
                amount: transaction.amount,
            };

            if (!groupedTransactions[authorizationCode]) {
                groupedTransactions[authorizationCode] = {
                    createdAt: createdAt,
                    updatedAt: updatedAt,
                    transactionId: transactionId,
                    authorizationCode: authorizationCode,
                    status: status,
                    description: description,
                    transactionType: transactionType,
                    metadata: metadata,
                    timeline: [timelineEntry],
                };
            } else {
                groupedTransactions[authorizationCode].status = status;
                groupedTransactions[authorizationCode].updatedAt = updatedAt;
                groupedTransactions[authorizationCode].timeline.push(timelineEntry);
            }
        });

        return {transactions: Object.values(groupedTransactions)};
    }


    async getRelatedCustomers(customerId: number): Promise<{
        relatedCustomers: RelatedCustomer[]
    }> {
        const transactions = await this.fetchFilteredCustomerTransactions(customerId);

        const relatedCustomers = this.extractRelatedCustomers(customerId, transactions);

        return {relatedCustomers};
    }

     extractRelatedCustomers(customerId: number, transactions: Transaction[]) {
        const relatedCustomers: RelatedCustomer[] = [];

        for (const transaction of transactions) {
            if (transaction.metadata) {
                if (transaction.metadata.relatedTransactionId !== undefined) {
                    const relatedTransaction = this.transactions.find(t => t.transactionId === transaction.metadata.relatedTransactionId);
                    if (relatedTransaction) {
                        let relationType: TransactionType | null = null;
                        if (relatedTransaction.transactionType === TransactionType.P2P_SEND) {
                            relationType = TransactionType.P2P_SEND;
                        } else if (relatedTransaction.transactionType === TransactionType.P2P_RECEIVE) {
                            relationType = TransactionType.P2P_RECEIVE;
                        } else if (relatedTransaction.transactionType === TransactionType.DEVICE) {
                            relationType = TransactionType.DEVICE;
                        }
                        if (relationType) {
                            relatedCustomers.push({
                                relatedCustomerId: relatedTransaction.customerId,
                                relationType: relationType,
                            });
                        }
                    }
                } else if (transaction.metadata.deviceId) {
                    relatedCustomers.push({
                        relatedCustomerId: customerId,
                        relationType: TransactionType.DEVICE,
                    });
                }
            }
        }
        return relatedCustomers;
    }
}

export default TransactionService;

