import { Request, Response } from 'express';
import TransactionService from '../services/transactionService';
import Logger from "../util/Logger";


const transactionService = new TransactionService([]);

class CustomerController {
    static async getTransactions(req: Request, res: Response) {
        try {
            const customerId = parseInt(req.params.customerId);
            const transactions = await transactionService.getCustomerTransactions(customerId);
            res.json({ transactions });
        }catch (error){
            Logger.error('Error fetching customer transactions:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default CustomerController;
