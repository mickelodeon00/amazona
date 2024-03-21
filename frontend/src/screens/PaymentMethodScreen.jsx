import React from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useContext } from 'react';
import { Store } from '../Store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentMethodScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (!shippingAddress.address) navigate('/shipping');
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: 'PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/order');
  };
  return (
    <div>
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 />

      <div className="container small-container">
        <h1 className="my-3">Payment Method</h1>
        <Form onSubmit={submitHandler}>
          <Form.Check
            className="mb-3"
            type="radio"
            id="PayPal"
            value="PayPal"
            label="PayPal"
            checked={paymentMethodName === 'PayPal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <Form.Check
            className="mb-3"
            type="radio"
            id="Stripe"
            value="Stripe"
            label="Stripe"
            checked={paymentMethodName === 'Stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PaymentMethodScreen;
