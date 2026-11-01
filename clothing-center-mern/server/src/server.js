import 'dotenv/config';
import bcrypt from 'bcryptjs';
import app from './app.js';
import connect from './config/db.js';
import User from './models/User.js';
await connect();
const email = (process.env.ADMIN_EMAIL || 'admin@admin.com').toLowerCase();
if (!(await User.findOne({ email })))
  await User.create({ email, password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin@123', 10) });
app.listen(process.env.PORT || 5000, () => console.log('API running on port ' + (process.env.PORT || 5000)));
