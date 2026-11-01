import Product from '../models/Product.js';
export const byBarcode = async (req, res) => {
  const p = await Product.findOne({ barcode: req.params.code });
  p ? res.json(p) : res.status(404).json({ message: 'Barcode not found: ' + req.params.code });
};
