import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import { Product } from '../models/productModel.js';

const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);
const PAGE_SIZE = 3;
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const category = query.category || '';
    const seacrhQuery = query.query || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const categoryFilter = category && category !== 'all' ? { category } : {};

    const queryFilter =
      seacrhQuery && seacrhQuery !== 'all'
        ? {
            name: {
              $regex: seacrhQuery,
              $options: 'i',
            },
          }
        : {};

    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : {};

    const products = await Product.find({
      ...queryFilter,
      ...ratingFilter,
      ...priceFilter,
      ...categoryFilter,
    })
      .sort(sortOrder)
      .skip(Number(pageSize) * (Number(page) - 1))
      .limit(Number(pageSize));

    const countProduct = await Product.countDocuments({
      ...queryFilter,
      ...ratingFilter,
      ...priceFilter,
      ...categoryFilter,
    });
    res.send({
      products,
      countProduct,
      page,
      pages: Math.ceil(countProduct / pageSize),
    });
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found ' });
  }
});

productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found ' });
  }
});

export default productRouter;
