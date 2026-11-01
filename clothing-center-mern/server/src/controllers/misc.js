import Product from '../models/Product.js';
import Sale from '../models/Sale.js';
import { Setting, Return, Customer, Expense } from '../models/simple.js';
export const getSettings = async () => (await Setting.findOne()) || Setting.create({});
export const settings = async (req, res) => res.json(await getSettings());
export const saveSettings = async (req, res) => {
  const s = await getSettings(); Object.assign(s, req.body); await s.save(); res.json(s);
};
export const createReturn = async (req, res) => {
  const { barcode, qty, amount, reason } = req.body, q = Math.floor(+qty);
  if (!(q > 0)) return res.status(400).json({ message: 'Invalid quantity' });
  const p = await Product.findOneAndUpdate({ barcode }, { $inc: { stock: q } }, { new: true });
  if (!p) return res.status(404).json({ message: 'Barcode not found' });
  res.status(201).json(await Return.create({ barcode, name: p.name, qty: q, amount: +amount || p.price * q, reason }));
};
export const summary = async (req, res) => {
  const t0 = new Date(); t0.setHours(0, 0, 0, 0);
  const w0 = new Date(t0); w0.setDate(w0.getDate() - 6);
  const tot = (m) => [{ $match: m }, { $group: { _id: null, total: { $sum: '$total' }, bills: { $sum: 1 } } }];
  const [all, today, prod, low, customers, exp, profit, daily, top, recent] = await Promise.all([
    Sale.aggregate(tot({})), Sale.aggregate(tot({ createdAt: { $gte: t0 } })),
    Product.aggregate([{ $group: { _id: null, n: { $sum: 1 }, units: { $sum: '$stock' }, value: { $sum: { $multiply: ['$stock', '$cost'] } } } }]),
    Product.find({ $expr: { $lte: ['$stock', '$min'] } }).limit(20), Customer.countDocuments(),
    Expense.aggregate([{ $group: { _id: null, t: { $sum: '$amount' } } }]),
    Sale.aggregate([{ $unwind: '$items' }, { $group: { _id: null, p: { $sum: { $multiply: [{ $subtract: ['$items.price', '$items.cost'] }, '$items.qty'] } } } }]),
    Sale.aggregate([{ $match: { createdAt: { $gte: w0 } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, bills: { $sum: 1 }, sales: { $sum: '$total' } } }, { $sort: { _id: -1 } }]),
    Sale.aggregate([{ $unwind: '$items' }, { $group: { _id: '$items.name', units: { $sum: '$items.qty' } } }, { $sort: { units: -1 } }, { $limit: 10 }]),
    Sale.find().sort('-createdAt').limit(8),
  ]);
  const g = (a, k) => a[0]?.[k] || 0;
  res.json({ todaySales: g(today, 'total'), todayBills: g(today, 'bills'), totalSales: g(all, 'total'), products: g(prod, 'n'), units: g(prod, 'units'),
    stockValue: g(prod, 'value'), customers, expenses: g(exp, 't'), profit: g(profit, 'p'), low, daily, top, recent });
};
