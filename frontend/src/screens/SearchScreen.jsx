import axios from 'axios';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useState } from 'react';
import { useReducer } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { API_URL } from '../ApiUrl';
import { getError } from '../utils';
import Rating from '../components/Rating';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $1000', value: '201-1000' },
];

export const ratings = [
  { name: '4 ratings & up', rating: 4 },
  { name: '3 ratings & up', rating: 3 },
  { name: '2 ratings & up', rating: 2 },
  { name: '1 ratings & up', rating: 1 },
  { name: '0 ratings & up', rating: 0 },
];

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        countProduct: action.payload.countProduct,
        pages: action.payload.pages,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProduct }, dispatch] =
    useReducer(reducer, { loading: true, error: '' });

  useEffect(() => {
    const FetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `${API_URL}/products/search?category=${category}&query=${query}&price=${price}&rating=${rating}&order=${order}&page=${page}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    FetchData();
  }, [category, query, price, rating, order, page, dispatch]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(`${API_URL}/products/categories`);
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterPrice = filter.price || price;
    const filterRating = filter.rating || rating;
    const filterOrder = filter.order || order;

    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&page=${filterPage}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <Row>
        <Col md={3} className="justify-content-between">
          <h1>Department</h1>
          <ul>
            <li>
              <Link
                to={getFilterUrl({ category: 'all' })}
                className={category === 'all' ? 'text-bold' : ''}
              >
                Any
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  to={getFilterUrl({ category: c })}
                  className={category === c ? 'text-bold' : ''}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
          <h1>Price</h1>
          <ul>
            <li>
              <Link
                to={getFilterUrl({ price: 'all' })}
                className={price === 'all' ? 'text-bold' : ''}
              >
                {' '}
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  to={getFilterUrl({ price: p.value })}
                  className={price === p.value ? 'text-bold' : ''}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
          <h1>Avg. Customer Review</h1>
          <ul>
            {ratings.map((r) => (
              <li key={r.name}>
                {' '}
                <Link
                  to={getFilterUrl({ rating: r.rating })}
                  className={`${rating}` === `${r.rating}` ? 'text-bold' : ''}
                >
                  <Rating rating={r.rating} caption={' & up'}></Rating>
                </Link>
              </li>
            ))}
          </ul>
        </Col>
        <Col md={9}>
          <Row>
            <div className="d-flex justify-content-between mb-3">
              <span>
                {countProduct ? countProduct : 'No'} Results
                {query && query !== 'all' && ` : ${query}`}
                {category && category !== 'all' && ` : ${category}`}
                {price && price !== 'all' && ` : Price ${price}`}
                {rating && rating !== 'all' && ` : Rating ${rating} & up`}
                {(query && query !== 'all') ||
                  (category && category !== 'all') ||
                  (price && price !== 'all') ||
                  (rating && rating !== 'all' && (
                    <Button variant="light" onClick={() => navigate('/search')}>
                      <i className="fas fa-times-circle"></i>
                    </Button>
                  ))}
              </span>
              <span>
                Sort by
                <select
                  value={order}
                  onChange={(e) =>
                    navigate(getFilterUrl({ order: e.target.value }))
                  }
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="lowest">Low to High</option>
                  <option value="highest">High to Low</option>
                  <option value="toprated">Avg. Customer Review</option>
                </select>
              </span>
            </div>
          </Row>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox>{error}</MessageBox>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product._id} className="mb-3" lg={4} md={6}>
                  <Product product={product}></Product>
                </Col>
              ))}
            </Row>
          )}
          <Row>
            <div className="d-flex ">
              {[...Array(pages).keys()].map((p) => (
                <Button
                  key={p}
                  variant="light"
                  onClick={() => navigate(getFilterUrl({ page: p + 1 }))}
                  className={`${page === p + 1 ? 'text-bold' : ''} mx-1`}
                >
                  {p + 1}
                </Button>
              ))}
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
