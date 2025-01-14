import {
  AreaChartOutlined,
  ClockCircleOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { Col, Statistic } from 'antd';
import React, { FC, memo } from 'react';
import { getUsdFromCrypto } from '../../../../../../utils/getUsdFromCrypto';
import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { Payment } from '../../../../../interfaces/payment.interface';

interface Props {
  billInfo: Payment;
  course: number;
}

// eslint-disable-next-line react/display-name
const DefaultBill: FC<Props> = memo(({ billInfo, course }) => {
  const transaction = useTypedSelector((state) => state.transaction.generateData);
  const transactionStatus = useTypedSelector((state) => state.transaction.generateStatus);
  //
  // const dispatch = useTypedDispatch();
  //
  // useEffect(() => {
  //   if (billInfo.currency === CurrencyType) {
  //     return;
  //   }
  //   dispatch(generateTransaction(billInfo.id as number));
  // }, []);
  
  if (transactionStatus.error) {
    return <p>Error</p>;
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
          title="Amount"
          value={`${+billInfo.amount / 1_000_000_000} ${
            billInfo.currency
          } ($${getUsdFromCrypto(+billInfo.amount, course)})`}
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
      <Col
        span={24}
        style={{ padding: '20px 0 20px 20px', background: 'white' }}
      >
        <Statistic
          title="Wallet"
          value={transaction?.walletForTransaction || 'none'}
          prefix={<CommentOutlined />}
        />
      </Col>
    </>
  );
});

export { DefaultBill };
