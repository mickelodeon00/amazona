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
  console.log(product, 'ssssssssssssssssssssssss');
  if (product) {
    console.log(product, 'llllllllll');
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found ' });
  }
});

app.get('/api/products/:id', (req, res) => {
  console.log('CCCCCCCCCCCCCCCCCC', req.params.id);
  // console.log('KKKKKKKKKKKKKKKKKK', data.products);
  console.log(typeof req.params.id, 'PPPPPPPPP');
  const product = data.products.find((x) => x._id === req.params.id);
  console.log(product, 'XXXXXXXXXXXXXXXXX');
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found ' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});
