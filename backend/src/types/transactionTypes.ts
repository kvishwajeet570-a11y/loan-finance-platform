export interface TransactionBody {

  walletId: string;

  type: string;

  amount: number;

  description?: string;

  paymentMethod?: string;

}


export interface TransactionParams {

  walletId: string;

}