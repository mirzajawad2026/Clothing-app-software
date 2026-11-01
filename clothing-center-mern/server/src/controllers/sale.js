import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import { Counter } from '../models/simple.js';
import { getSettings } from './misc.js';
export const createSale = async (req, res) => {
  const { items = [], customer = '', discount = 0, method = 'Cash', paid } = req.body;
  if (!items.length) return res.status(400).json({ message: 'Cart is empty' });
  const done = [], lines = [];
  try {
    for (const it of items) {                       // atomic stock deduction, rolled back on failure
      const q = Math.floor(+it.qty);
      if (!(q > 0)) throw new Error('Invalid quantity');
      const p = await Product.findOneAndUpdate({ _id: it.product, stock: { $gte: q } }, { $inc: { stock: -q } }, { new: true });
      if (!p) throw new Error('Insufficient stock for one of the items');
      done.push([p._id, q]);
      lines.push({ product: p._id, barcode: p.barcode, name: p.name, size: p.size, price: p.price, cost: p.cost, qty: q });
    }
    const S = await getSettings();
    const subtotal = lines.reduce((s, i) => s + i.price * i.qty, 0), d = Math.min(Math.max(+discount || 0, 0), subtotal);
    const tax = ((subtotal - d) * S.tax) / 100, total = subtotal - d + tax;
    const c = await Counter.findOneAndUpdate({ _id: 'invoice' }, { $inc: { seq: 1 } }, { upsert: true, new: true });
    res.status(201).json(await Sale.create({ invoice: 'INV-' + String(c.seq).padStart(5, '0'), customer, items: lines, subtotal, discount: d, tax, total, paid: +paid || total, method }));
  } catch (e) {
    await Promise.all(done.map(([id, q]) => Product.updateOne({ _id: id }, { $inc: { stock: q } })));
    res.status(400).json({ message: e.message });
  }
};
