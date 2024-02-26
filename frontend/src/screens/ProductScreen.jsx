import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'SUCCESS_REQUEST':
      return { ...state, loading: false, product: action.payload };
    case 'FAIL_REQUEST':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  const params = useParams();
  const { slug } = params;

  const [{ product, loading, error }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'SUCCESS_REQUEST', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FAIL_REQUEST', payload: err.message });
      }
    };
    fetchData();
    console.log(product);
  }, [slug]);

  return (
    <div>
      ProductScreen {slug} {product.price}
      <div className="product-page">
        <div className="grid-item1 img">Image</div>
        <div className="grid-item details">Details</div>
        <div className="grid-item cart">cart</div>
      </div>
    </div>
  );
};

export default ProductScreen;
