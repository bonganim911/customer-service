import express = require('express');
import bodyParser = require("body-parser");
import customerRoutes from './routes/customerRoutes';
import relatedCustomersRoutes from './routes/relatedCustomerRoutes';
import Logger from "./util/Logger";
require('dotenv').config();

const app = express();

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    Logger.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.use(bodyParser.json());

app.use('/customer-transactions', customerRoutes);
app.use('/related-customers', relatedCustomersRoutes);

export default app;
