import React from 'react';
import axios from 'axios';

import { Helmet } from 'react-helmet-async';
import { useReducer } from 'react';
import { useEffect } from 'react';
import { commaSeperated, getError, roundTo, textWrap } from '../utils';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { useContext } from 'react';
import { Store } from '../Store';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { API_URL } from '../ApiUrl';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
};

const OrderScreen = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { user } = state;
  const params = useParams();
  const { id: orderId } = params;
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      order: {},
      loadingPay: false,
      successPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`${API_URL}/orders/${orderId}`, {
          headers: {
            authorization: `BEARER ${user.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    const loadPayPalScript = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/keys/paypal`, {
          headers: {
            authorization: `BEARER ${user.token}`,
          },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': data,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      } catch (err) {
        toast.error(getError(err));
      }
    };
    if (!user) navigate('/login');
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchData();
      if (successPay) dispatch({ type: 'PAY_RESET' });
    } else {
      loadPayPalScript();
    }
  }, [order, orderId, user, successPay, dispatch, paypalDispatch, navigate]);

  const createOrder = (data, action) => {
    return action?.order
      ?.create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  };
  const onApprove = (data, action) => {
    return action.order.capture().then(async (details) => {
      dispatch({ type: 'PAY_REQUEST' });
      try {
        const { data } = await axios.put(
          `${API_URL}/orders/${order._id}/pay`,
          details,
          {
            headers: {
              authorization: `BEARER ${user.token}`,
            },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is Paid');
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
      }
    });
  };
  const onError = (err) => {
    toast.error(getError(err));
  };

  return (
    <div>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <Helmet>
            <title>Order </title>
          </Helmet>
          <h1 className="my-3">Order {order._id}</h1>
          <Row>
            <Col md={8}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Shipping</Card.Title>
                  <b>Name:</b> {order.shippingAddress.fullName} <br />
                  <b>Address: </b>
                  {commaSeperated(
                    order.shippingAddress.address,
                    order.shippingAddress.city,
                    order.shippingAddress.postalCode,
                    order.shippingAddress.country
                  )}{' '}
                  <br />
                  <div className="mt-3">
                    {order._isDelivered ? (
                      <MessageBox variant="success">Delivered</MessageBox>
                    ) : (
                      <MessageBox variant="danger">Not Delivered</MessageBox>
                    )}
                  </div>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Payment</Card.Title>
                  <b>Method:</b> {order.paymentMethod} <br />
                  <div className="mt-3">
                    {order.isPaid ? (
                      <MessageBox variant="success">Paid</MessageBox>
                    ) : (
                      <MessageBox variant="danger">Not Paid</MessageBox>
                    )}
                  </div>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Items</Card.Title>
                  <ListGroup variant="flush">
                    {order.orderItems.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <Row className="align-items-center">
                          <Col md={6}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="img-fluid rounded img-thumbnail"
                            ></img>{' '}
                            {'  '}{' '}
                            <Link to={`/product/${item.slug}`}>
                              {textWrap(item.name, 13)}
                            </Link>{' '}
                          </Col>
                          <Col md={2}>{item.quantity}</Col>
                          <Col md={2}>${item.price}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Order Summary</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>Items</Col>
                        <Col>${roundTo(order.itemsPrice, 2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>${roundTo(order.shippingPrice, 2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        <Col>${roundTo(order.taxPrice, 2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>
                        <Row>
                          <Col>Order Total</Col>
                          <Col>${roundTo(order.totalPrice, 2)}</Col>
                        </Row>
                      </b>
                    </ListGroup.Item>
                    {!order.isPaid && (
                      <ListGroup.Item>
                        {isPending ? (
                          <LoadingBox />
                        ) : (
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          />
                        )}
                        {loadingPay && <LoadingBox />}
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default OrderScreen;
