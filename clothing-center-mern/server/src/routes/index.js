import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { wrap } from '../middleware/error.js';
import { crud } from '../controllers/crud.js';
import { login } from '../controllers/auth.js';
import { byBarcode } from '../controllers/product.js';
import { createSale } from '../controllers/sale.js';
import { settings, saveSettings, createReturn, summary } from '../controllers/misc.js';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import { Category, Customer, Supplier, Expense, Return } from '../models/simple.js';
const r = Router();
r.post('/auth/login', wrap(login));
const mount = (path, c, only) => {
  const x = Router();
  if (!only) { x.post('/', wrap(c.create)); x.put('/:id', wrap(c.update)); x.delete('/:id', wrap(c.remove)); }
  x.get('/', wrap(c.list)); x.get('/:id', wrap(c.one)); r.use(path, protect, x);
};
r.get('/products/barcode/:code', protect, wrap(byBarcode));   // must be before /products/:id
mount('/products', crud(Product, ['name', 'barcode', 'brand', 'category', 'color']));
mount('/categories', crud(Category, ['name']));
mount('/customers', crud(Customer, ['name', 'phone']));
mount('/suppliers', crud(Supplier, ['name']));
mount('/expenses', crud(Expense, ['title']));
r.post('/sales', protect, wrap(createSale));
mount('/sales', crud(Sale, ['invoice', 'customer']), true);
r.post('/returns', protect, wrap(createReturn));
mount('/returns', crud(Return, ['name', 'barcode']), true);
r.get('/settings', protect, wrap(settings)); r.put('/settings', protect, wrap(saveSettings));
r.get('/reports/summary', protect, wrap(summary));
export default r;
