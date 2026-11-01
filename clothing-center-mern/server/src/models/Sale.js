import mongoose from 'mongoose';
export default mongoose.model('Sale', new mongoose.Schema({
  invoice: { type: String, unique: true }, customer: { type: String, default: '' },
  items: [{ product: mongoose.Schema.Types.ObjectId, barcode: String, name: String, size: String, price: Number, cost: Number, qty: Number }],
  subtotal: Number, discount: Number, tax: Number, total: Number, paid: Number, method: String,
}, { timestamps: true }));
