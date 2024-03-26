import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from '../Store';
import { commaSeperated, getError, roundTo, textWrap } from '../utils';
import CheckoutSteps from '../components/CheckoutSteps';
import { useReducer } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const PlaceOrderScreen = () => {
  const [{ error, loading }, dispatch] = useReducer(reducer, {
    error: '',
    loading: false,
  });
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    // cart: { cartItems, paymentMethod, shippingAddress },
    cart,
    user,
  } = state;

  cart.itemsPrice = cart.cartItems.reduce(
    (a, c) => a + c.price * c.quantity,
    0
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10;
  cart.taxPrice = 0.15 * cart.itemsPrice;
  const totalPrice = cart.shippingPrice + cart.taxPrice + cart.itemsPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/orders',
        {
          cartOrders: cart.cartItems,
          paymentMethod: cart.paymentMethod,
          shippingAddress: cart.shippingAddress,
          itemsPrice: cart.itemsPrice,
          taxPrice: cart.taxPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `BEARER ${user.token}`,
          },
        }
      );
      ctxDispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'CREATE_SUCCESS' });
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) navigate('/payment');
  }, [cart, navigate]);

  return (
    <div>
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <b>Name:</b> {cart.shippingAddress.fullName} <br />
              <b>Address: </b>
              {commaSeperated(
                cart.shippingAddress.address,
                cart.shippingAddress.city,
                cart.shippingAddress.postalCode,
                cart.shippingAddress.country
              )}{' '}
              <br />
              <div className="mt-3">
                <Link to="/shipping">Edit</Link>
              </div>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <b>Method:</b> {cart.paymentMethod} <br />
              <div className="mt-3">
                <Link to="/shipping">Edit</Link>
              </div>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item>
                    <Row key={item._id} className="align-items-center">
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
              <div className="my-3">
                <Link to="/cart">Edit</Link>
              </div>
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
                    <Col>${roundTo(cart.itemsPrice, 2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${roundTo(cart.shippingPrice, 2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${roundTo(cart.taxPrice, 2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>
                    <Row>
                      <Col>Order Total</Col>
                      <Col>${roundTo(totalPrice, 2)}</Col>
                    </Row>
                  </b>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button className="btn-fullWidth" onClick={placeOrderHandler}>
                    Place Order
                  </Button>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
