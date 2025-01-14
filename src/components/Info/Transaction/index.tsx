import {
  AreaChartOutlined,
  ClockCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { Button, Col, Statistic } from 'antd';

import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { getUsdFromCrypto } from '../../../../utils/getUsdFromCrypto';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { CurrencyFabric } from '../../../modules/curriencies/currencyFabric';
import { getTransaction } from '../../../store/slices/transaction/asyncThunks/getTransaction';
import { Loader } from '../../Loader';
import { CurrencyType } from '../../../enums/currency.enum';

const Transaction = () => {
  const transaction = useTypedSelector((state) => state.transaction.data);
  const transactionStatus = useTypedSelector(
    (state) => state.transaction.status,
  );
  const course = useTypedSelector((state) => state.course.data.usd);
  const courseStatus = useTypedSelector((state) => state.course.status);

  const dispatch = useTypedDispatch();
  const router = useRouter();

  useEffect(() => {
    if (router.query.slug) {
      dispatch(getTransaction(router.query.slug as string));
    }
  }, []);
  
  useEffect(() => {
    if (!transaction) {
      return;
    }
    
    const newCurrency = CurrencyFabric.create(transaction?.payment?.currency);
    newCurrency.getCourse();
  }, [transaction]);

  const date = new Date(transaction?.updated || 0).toDateString();
  
  if (transactionStatus.error || courseStatus.error) {
    router.push('/');
  }

  const getLinkForCheckTransaction = () => {
    switch (transaction?.payment?.currency) {
      case CurrencyType.Bitcoin:
        return `https://${process.env.NEXT_PUBLIC_BITCOIN_NETWORK}/${transaction.txHash}`;
      case CurrencyType.Casper:
        return `https://${process.env.NEXT_PUBLIC_CASPER_NETWORK}/deploy/${transaction.txHash}`;
      // case CurrencyType.Ethereum:
      //   return `${process.env.NEXT_PUBLIC_ETH_TESTNET}${transaction.txHash}`;
      default:
        return '';
    }
  };
  
  if (transactionStatus.isLoading || transaction === null || courseStatus.isLoading || course === null) {
    return <Loader />;
  }

  return (
    <>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic title="TxHash" value={transaction!.txHash} prefix={<CommentOutlined />} />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Updated"
          value={date}
          prefix={<ClockCircleOutlined />}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Receiver"
          value={transaction.receiver.value}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Sender"
          value={transaction.sender}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 0px 20px', background: 'white' }}
      >
        <Statistic
          title="Amount"
          value={`${+transaction?.amount / 1000000000} ${transaction?.payment?.currency} ($${getUsdFromCrypto(+transaction.amount, course)})`}
          prefix={<CommentOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Statistic title="Status" value={transaction?.status} prefix={<CommentOutlined />} />
      </Col>
      {transaction.txHash ? (
        <Link
          href={getLinkForCheckTransaction() as any}
        >
          <a target="_blank" rel="noreferrer">
            <Button style={{ margin: '20px 20px 0 0' }} type="primary">
              Check transaction
            </Button>
          </a>
        </Link>
      ) : null}
      <Button
        onClick={() => router.back()}
        style={{ margin: '20px 0 0 0' }}
        type="primary"
      >
        Back
      </Button>
    </>
  );
};


export default Transaction;
