import mongoose from 'mongoose';
const m = (name, def) => mongoose.model(name, new mongoose.Schema(def, { timestamps: true }));
export const Category = m('Category', { name: { type: String, required: true, unique: true } });
export const Customer = m('Customer', { name: { type: String, required: true }, phone: String, email: String, address: String });
export const Supplier = m('Supplier', { name: { type: String, required: true }, phone: String, address: String });
export const Expense = m('Expense', { title: { type: String, required: true }, amount: { type: Number, required: true }, date: String });
export const Return = m('Return', { barcode: String, name: String, qty: Number, amount: Number, reason: String });
export const Setting = m('Setting', {
  name: { type: String, default: 'My Clothing Center' }, address: { type: String, default: 'Main Street' }, phone: { type: String, default: '' },
  cur: { type: String, default: 'Rs' }, tax: { type: Number, default: 0 }, footer: { type: String, default: 'Thank you! Exchange within 7 days with bill.' },
  width: { type: String, default: '80mm' }, autoPrint: { type: Boolean, default: false },
});
export const Counter = mongoose.model('Counter', new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } }));
