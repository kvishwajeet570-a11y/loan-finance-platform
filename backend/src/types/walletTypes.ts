export interface WalletParams {

  userId: string;

}


export interface AddMoneyBody {

  userId: string;

  amount: number;

  paymentMethod?: string;

}


export interface WithdrawBody {

  userId: string;

  amount: number;

}