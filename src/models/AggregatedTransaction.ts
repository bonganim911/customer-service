export interface AggregatedTransaction {
    createdAt: string;
    updatedAt: string;
    transactionId: number;
    authorizationCode: string;
    status: string;
    description: string;
    transactionType: string;
    metadata: { [key: string]: any };
    timeline: { createdAt: string; status: string; amount: number }[];
}

export interface AggregatedData {
    transactions: AggregatedTransaction[];
}