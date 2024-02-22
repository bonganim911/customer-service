import axios from 'axios';
import Logger from "../util/Logger";

async function fetchTransactions(): Promise<any[]> {
    try {
        const response = await axios.get('https://cdn.seen.com/challenge/transactions-v2.json');
        return response.data || [];
    } catch (error) {
        Logger.error('Error fetching transactions using seen api:', error);
        throw new Error('Error fetching transactions, please try again later.');
    }
}
export default fetchTransactions;
