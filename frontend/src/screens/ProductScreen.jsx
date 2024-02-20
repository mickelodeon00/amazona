import React from 'react';
import { useParams } from 'react-router-dom';

const ProductScreen = () => {
  const params = useParams();
  const { slug } = params;
  return <div>ProductScreen {slug}</div>;
};

export default ProductScreen;
