import express = require('express');
import CustomerController from '../controllers/customerController';

const router = express.Router();

router.get('/:customerId', CustomerController.getTransactions);

export default router;
