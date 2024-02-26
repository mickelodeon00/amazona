import express from 'express';
import data from './data.js';

const app = express();
// Get all products
app.get('/api/products', (req, res) => {
  res.send(data.products);
});

// Get single product
app.get('/api/products/slug/:slug', (req, res) => {
  console.log(req.params.slug, 'kkkkkk');
  const product = data.products.find((x) => x.slug === req.params.slug);
  if (product) {
    console.log(product, 'llllllllll');
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found ' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
