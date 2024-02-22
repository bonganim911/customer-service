import { Request, Response } from 'express';
import TransactionService from '../services/transactionService';
import Logger from "../util/Logger";

const transactionService = new TransactionService([]);

class RelatedCustomersController {
    static async getRelatedCustomers(req: Request, res: Response) {
        try {
            const customerId = parseInt(req.params.customerId);
            const relatedCustomers = await transactionService.getRelatedCustomers(customerId);
            res.json({relatedCustomers});
        }catch (error){
            Logger.error('Error fetching related transactions:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default RelatedCustomersController;
