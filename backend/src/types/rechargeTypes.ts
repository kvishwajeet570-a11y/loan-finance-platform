export interface RechargeBody {

  userId: string;

  mobileNumber: string;

  operator: string;

  amount: number;

  rechargeType: string;

  planDetails?: string;

}


export interface RechargeParams {

  userId: string;

}