import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';
// import data from '../data';

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
  // const [products, setProducts] = useState([]);
  const [{ products, loading, error }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('api/products');
        dispatch({ type: 'SUCCESS_REQUEST', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FAIL_REQUEST', payload: err.message });
      }
      // setProducts(result.data);
    };
    fetchData();
  }, []);

  console.log('GGGGGGG');
  console.log(products);

  return (
    <div>
      <h2>Featured Products</h2>
      <div className="products">
        {loading ? (
          <div>Loading... </div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          products.map((product) => (
            <div key={product.name} className="product">
              <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name}></img>
              </Link>
              <div className="product-info">
                <Link to={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </Link>
                <p>
                  <strong>${product.price}</strong>
                </p>
                <button> Add to cart </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
