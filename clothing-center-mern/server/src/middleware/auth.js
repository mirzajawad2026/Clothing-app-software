import jwt from 'jsonwebtoken';
export const protect = (req, res, next) => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try { req.user = jwt.verify(t, process.env.JWT_SECRET); if (req.user.role !== 'admin') throw 0; next(); }
  catch { res.status(401).json({ message: 'Not authorized' }); }
};
