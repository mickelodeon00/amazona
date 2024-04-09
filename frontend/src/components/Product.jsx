import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { textWrap } from '../utils';
import Rating from './Rating';
import { Store } from '../Store';
import axios from 'axios';
import { API_URL } from '../ApiUrl';

const Product = (props) => {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((item) => item._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`${API_URL}/products/${product._id}`);

    if (data.countInStock < quantity) {
      window.alert('Sorry, product is out of stock');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  return (
    <Card key={product.name}>
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          className="card-img-top product-img"
          alt={product.name}
        ></img>
      </Link>
      <Card.Body>
        {/* create animation for card title */}
        <Link to={`/product/${product.slug}`}>
          <Card.Title> {textWrap(product.name, 15)}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={addToCartHandler}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
