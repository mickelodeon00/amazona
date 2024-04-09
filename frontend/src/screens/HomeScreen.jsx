import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
// import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { API_URL } from '../ApiUrl';

// const API_URL = `${process.env.REACT_APP_BACKEND_API_URL}`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'SUCCESS_REQUEST':
      return { ...state, loading: false, products: action.payload };
    case 'FAIL_REQUEST':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ products, loading, error }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`${API_URL}/products`);
        dispatch({ type: 'SUCCESS_REQUEST', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FAIL_REQUEST', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Featured Products</h2>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
