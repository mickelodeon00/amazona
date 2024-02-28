import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { textWrap } from '../utils';
import Rating from './Rating';

const Product = (props) => {
  const { product } = props;
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
          <Card.Title> {textWrap(product.name)}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        <Button>Add to cart</Button>
      </Card.Body>
    </Card>
  );
};

export default Product;
