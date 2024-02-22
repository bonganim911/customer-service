import express = require('express');
import RelatedCustomersController from "../controllers/relatedCustomersController";

const router = express.Router();

router.get('/:customerId', RelatedCustomersController.getRelatedCustomers);

export default router;
