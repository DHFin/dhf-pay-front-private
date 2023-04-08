import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { useTypedDispatch } from '../../../../../hooks/useTypedDispatch';
import React, { FC, useEffect } from 'react';
import { Loader } from '../../../../Loader';
import { Col, Statistic } from 'antd';
import { AreaChartOutlined, ClockCircleOutlined, CommentOutlined } from '@ant-design/icons';
import { getUsdFromCrypto } from '../../../../../../utils/getUsdFromCrypto';
import { Payment } from '../../../../../interfaces/payment.interface';
import { getBtcTransaction } from '../../../../../store/slices/transaction/asyncThunks/getBtcTransaction';

interface Props {
  billInfo: Payment;
  course: number;
}

const BitcoinBill: FC<Props> = ({ billInfo, course }) => {
  const transaction = useTypedSelector((state) => state.transaction.generateData);
  const transactionStatus = useTypedSelector((state) => state.transaction.generateStatus);

  const dispatch = useTypedDispatch();
  console.log('billInfo', billInfo);

  useEffect(() => {
    (async () => {
      await dispatch(getBtcTransaction(billInfo.id));
    })();
  }, []);

  if (transactionStatus.error) {
    return <p>Error</p>;
  }

  if (transactionStatus.isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Col
        span={24}
        style={{
          padding: '20px 0 0 0',
          display: 'flex',
          justifyContent: 'center',
          background: 'white',
        }}
      >
        <div style={{ color: 'red', fontSize: '24px' }}>
          {billInfo?.cancelled && 'Cancelled'}
        </div>
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Datetime"
          value={billInfo.datetime}
          prefix={<ClockCircleOutlined />}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Amount for buyers"
          value={`${+billInfo.amount / 1_000_000_000} ${
            billInfo.currency
          } ($${getUsdFromCrypto(+billInfo.amount, course)})`}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Amount"
          value={`${(+billInfo.amount / 1_000_000_000) - 0.000_005} ${
            billInfo.currency
          } ($${getUsdFromCrypto(+billInfo.amount, course, billInfo.currency)})`}
          prefix={<AreaChartOutlined />}
        />
      </Col>
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Statistic
          title="Comment"
          value={billInfo.comment || 'none'}
          prefix={<CommentOutlined />}
        />
      </Col>
      {billInfo?.type && billInfo?.status !== 'Paid' ?
        <Col
          span={24}
          style={{ padding: '20px 0 20px 20px', background: 'white' }}
        >
          <Statistic
            title="Pay wallet"
            value={'Pay BTC on wallet ' + transaction?.walletForTransaction + ' If you transfer' +
              ' less than the amount for the buyer, the transaction will not be processed'}
          />
        </Col> :
        <Col
          span={24}
          style={{ padding: '20px 0 20px 20px', background: 'white' }}
        >
          <Statistic
            title="Status"
            value={billInfo?.status}
          />
        </Col>
      }
    </>
  );
};

export { BitcoinBill };