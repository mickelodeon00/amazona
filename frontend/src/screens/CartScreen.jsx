import React from 'react';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { Link, useNavigate } from 'react-router-dom';
import { textWrap } from '../utils';
import axios from 'axios';
import MessageBox from '../components/MessageBox';
import { API_URL } from '../ApiUrl';

// const API_URL = `${process.env.REACT_APP_BACKEND_API_URL}/products/${item._id}`;

const CartScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`${API_URL}/products/${item._id}`);

    if (data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    dispatch({
      type: 'CART_REMOVE_ITEM',
      payload: { ...item },
    });
  };
  const orderItemsHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox variant="danger">
              Cart is Empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
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
                    <Col md={3}>
                      <Button
                        variant="light"
                        disabled={item.quantity === 1}
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                      >
                        <i className="fas fa-minus-circle"></i>
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        disabled={item.quantity === item.countInStock}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        <i className="fas fa-plus-circle"></i>
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => removeItemHandler(item)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    <span>
                      Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                      items) :{' '}
                    </span>
                    <span>
                      ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                    </span>
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button variant="primary" onClick={orderItemsHandler}>
                    Proceed to Checkout{' '}
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;
