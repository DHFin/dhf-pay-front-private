import { CurrencyType } from '../../enums/currency.enum';
import { BaseCurrency } from './baseCurrency';
import { Bitcoin } from './bitcoin';
import { Casper } from './casper';
import { Ethereum } from './ethereum';

class CurrencyFabric {
  static create(currency: CurrencyType): BaseCurrency {
    switch (currency) {
      case CurrencyType.Bitcoin: {
        return new Bitcoin();
      }
      case CurrencyType.Casper: {
        return new Casper();
      }
      case CurrencyType.Ethereum: {
        return new Ethereum();
      }
    }
  }
}

export { CurrencyFabric };
