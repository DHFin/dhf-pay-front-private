import { useTypedSelector } from '../../../../../hooks/useTypedSelector';
import { useTypedDispatch } from '../../../../../hooks/useTypedDispatch';
import React, { FC, useEffect, useState } from 'react';
import { Loader } from '../../../../Loader';
import { Button, Col, Form, Input, Select, SelectProps, Statistic } from 'antd';
import { AreaChartOutlined, ClockCircleOutlined, CommentOutlined, UserOutlined } from '@ant-design/icons';
import { getUsdFromCrypto } from '../../../../../../utils/getUsdFromCrypto';
import { Payment } from '../../../../../interfaces/payment.interface';
import { getBtcTransaction } from '../../../../../store/slices/transaction/asyncThunks/getBtcTransaction';
import { get } from '../../../../../../api';
import { generateTransaction } from '../../../../../store/slices/transaction/asyncThunks/generateTransaction';

interface Props {
  billInfo: Payment;
  course: number;
}

const BitcoinBill: FC<Props> = ({ billInfo, course }) => {
  const transaction = useTypedSelector((state) => state.transaction.generateData);
  const transactionStatus = useTypedSelector((state) => state.transaction.generateStatus);
  const dispatch = useTypedDispatch();
  const [form] = Form.useForm();

  console.log('transaction', transaction);
  console.log('billInfo', billInfo);

  const [commissionWithPrice, setCommissionWithPrice] = useState<any>(0);
  const [selectFee, setSelectFee] = useState<any>('');
  const [valid, setValid] = useState(false);
  const [options, setOptions] = useState<SelectProps['options']>([]);

  const updateCoursValue = () => {
    // const value = getUsdFromCrypto(+billInfo.amount + (+selectFee / 100_000_000), course);

    const value = (((+billInfo.amount / 1000000000 + +selectFee / 100_000_000) - 0.000_005) * course).toFixed(2);
    setCommissionWithPrice(value);
  };

  const generateNewWallet = async (emailProps: string) => {
    await form.validateFields();
    if (billInfo?.id) {
      await dispatch(generateTransaction({ paymentId: billInfo?.id, email: emailProps }));
    }
  };

  console.log('transaction', transaction);

  const onFinish = async (values: any) => {
    setValid(true);
    await generateNewWallet(values.email);
    console.log('Success:', values);
  };

  const onFinishFailed = () => {
    setValid(false);
  };

  const handleChange = (value: string) => {
    setSelectFee(value);
  };

  const getStatusTransaction = () => {
    if (!billInfo.type && (transaction?.status === 'success' || transaction?.status === 'confirmed')) {
      return (
        <Col
          span={24}
          style={{ padding: '20px 0 20px 20px', background: 'white' }}
        >
          <Statistic
            title="Status"
            value={transaction?.status}
          />
        </Col>
      );
    }
    if (billInfo.type || (billInfo.status !== 'Paid')) {
      return (
        <Col
          span={24}
          style={{ padding: '20px 0 20px 20px', background: 'white' }}
        >
          <Statistic
            title="Pay wallet"
            value={'Pay BTC on wallet ' + transaction?.walletForTransaction + ' If you transfer' +
              ' less than the amount for the buyer, the transaction will not be processed'}
          />
        </Col>
      );
    }
    if (billInfo.status === 'Paid') {
      return (
        <Col
          span={24}
          style={{ padding: '20px 0 20px 20px', background: 'white' }}
        >
          <Statistic
            title="Status"
            value={billInfo.status}
          />
        </Col>
      );
    }
  };

  const getStatusForButton = () => {
    return (
      <>
        <Col
          span={24}
          style={{ padding: '20px 0 20px 20px', background: 'white' }}
        >
          <Form
            name="email"
            initialValues={{ remember: true }}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 12 }}
            validateTrigger={'onSubmit'}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
          >
            <Form.Item
              label="Buyer's email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                {
                  type: 'email',
                  message: 'Please enter a valid email!',
                },
              ]}
            >
              <Input
                name="email"
                style={{ width: 400 }}
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            {!valid &&
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Pay
                </Button>
              </Form.Item>
            }
          </Form>
        </Col>
        {valid &&
          <Col
            span={24}
            style={{ padding: '20px 0 20px 20px', background: 'white' }}
          >
            <Statistic
              title="Pay wallet"
              value={'Pay BTC on wallet ' + transaction?.walletForTransaction + ' If you transfer' +
                ' less than the amount for the buyer, the transaction will not be processed'}
            />
          </Col>
        }
      </>
    );
  };

  const getFeeForTransaction = async () => {
    try {
      const commission = await get('transaction/btc/commission');
      setOptions([
        {
          label: 'Low fee',
          value: commission.data?.economyFee,
          key: 1,
        },
        {
          label: 'Average fee',
          value: commission.data?.avarageFee,
          key: 2,
        },
        {
          label: 'High fee',
          value: commission.data?.fastestFee + 1,
          key: 3,
        },
      ]);
      setSelectFee(commission.data?.economyFee);
    } catch (e) {
      console.log(e);
    }
  };

  const selectUi = () => {
    return (
      <Select
        style={{ width: '130%' }}
        placeholder="Please select"
        onChange={handleChange}
        options={options}
        defaultValue={'Low fee'}
        value={selectFee as string}
      />
    );
  };

  useEffect(() => {
    (async () => {
      await dispatch(getBtcTransaction(billInfo.id));
      await getFeeForTransaction();
    })();
  }, []);

  useEffect(() => {
    updateCoursValue();
  }, [selectFee]);

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
          prefix={<AreaChartOutlined />}
          title="Fee"
          formatter={() => selectUi()}
        />
      </Col>
      <Col span={24} style={{ padding: '20px 0 0 20px', background: 'white' }}>
        <Statistic
          title="Amount for buyer"
          value={`${(((+billInfo.amount / 1_000_000_000) + (+selectFee / 100_000_000)).toFixed(8))} ${
            billInfo.currency
          } ($${+commissionWithPrice})`}
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
      {!billInfo.type ?
        getStatusTransaction()
        :
        getStatusForButton()
      }
    </>
  );
};

export { BitcoinBill };
