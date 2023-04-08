import { CurrencyType } from '../enums/currency.enum';

interface CreatePayment {
  amount: string | number;
  comment: string;
  currency: CurrencyType;
}

export type { CreatePayment };
