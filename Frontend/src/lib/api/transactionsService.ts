import api from '@/lib/api';

export interface Transaction {
    id: number;
    courseId: string;
    courseName: string;
    date: Date;
    amount: number;
    paymentMethod: string;
    status: string;
    thumbnail: string;
    transactionId: string;
    currency: string;
}

export interface TransactionStats {
    totalSpent: number;
    totalTransactions: number;
    averageTransaction: number;
    currency: string;
}

export const transactionsService = {
    async getMyTransactions(): Promise<Transaction[]> {
        const response = await api.get('/transactions');
        return response.data;
    },

    async getTransactionById(id: number): Promise<Transaction> {
        const response = await api.get(`/transactions/${id}`);
        return response.data;
    },

    async getTransactionStats(): Promise<TransactionStats> {
        const response = await api.get('/transactions/stats');
        return response.data;
    },

    async createTransaction(data: { 
        courseIds: string[], 
        amount: number, 
        paymentMethod: string,
        billingDetails?: {
            billing_name: string;
            billing_email: string;
            billing_address: string;
            billing_city: string;
            billing_state: string;
            billing_zip: string;
            billing_country: string;
        }
    }): Promise<any> {
        const response = await api.post('/transactions', data);
        return response.data;
    },

    async downloadInvoice(transactionId: number | string): Promise<void> {
        const response = await api.get(`/transactions/${transactionId}/invoice`, {
            responseType: 'blob', 
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Invoice-${transactionId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentElement?.removeChild(link);
    }
};
