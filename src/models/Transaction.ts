export interface Transaction {
    transactionId: number;
    authorizationCode: string;
    transactionDate: string;
    customerId: number;
    transactionType: string;
    transactionStatus: string;
    description: string;
    amount: number;
    metadata: { relatedTransactionId?: any, deviceId?: string };
}

