import { CurrencyType } from '../src/enums/currency.enum';

function getUsdFromCrypto(amount: number, course: number, currency?: CurrencyType) {
  if (currency === CurrencyType.Bitcoin) {
    return (((+amount / 1000000000) - 0.000_005) * course).toFixed(2);
  }
  return ((+amount / 1000000000) * course).toFixed(2);
}

export { getUsdFromCrypto };
