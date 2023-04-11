import { store } from '../../store/store';
import { BaseCurrency } from './baseCurrency';
import { getCourse } from '../../store/slices/course/asyncThunks/getCourse';

class Bitcoin extends BaseCurrency {
  getCourse(): void {
    store.dispatch(
      // @ts-ignore
      getCourse('bitcoin'),
    );
  }

  validateWallet(wallet: string): boolean {
    console.log('process.env.NEXT_BITCOIN_NET', process.env.NEXT_PUBLIC_BITCOIN_NET);
    const includesTestnet = /\b((bc|tb)(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87})|([13]|[mn2])[a-km-zA-HJ-NP-Z1-9]{25,39})\b/g;
    const mainnet = /\b(bc(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87})|[13][a-km-zA-HJ-NP-Z1-9]{25,35})\b/g;
    return new RegExp(process.env.NEXT_PUBLIC_BITCOIN_NET === 'testnet' ? includesTestnet : mainnet).test(wallet);
  }
}

export { Bitcoin };
