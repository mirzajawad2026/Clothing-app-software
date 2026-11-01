import mongoose from 'mongoose';
export default mongoose.model('Product', new mongoose.Schema({
  barcode: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  category: String, brand: String, size: String, color: String, type: String, supplier: String, description: String,
  cost: { type: Number, required: true, min: 0 }, price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 }, min: { type: Number, default: 5 },
}, { timestamps: true }));
