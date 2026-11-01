import { useState, useEffect, createContext } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import api from './api';
import Login from './pages/Login';
import Crud from './components/Crud';
import Products from './pages/Products';
import AddClothes from './pages/AddClothes';
import POS from './pages/POS';
import Sales from './pages/Sales';
import Summary from './pages/Summary';
import Settings from './pages/Settings';
export const Ctx = createContext();
const NAV = [['/', 'Dashboard'], ['/pos', 'POS'], ['/sell', 'Sell Clothes'], ['/add-clothes', 'Add Clothes'], ['/inventory', 'Inventory'], ['/categories', 'Categories'],
  ['/add-customer', 'Add Customer'], ['/customers', 'Customers'], ['/suppliers', 'Suppliers'], ['/sales', 'Sales History'], ['/print-bill', 'Print Bill'],
  ['/returns', 'Returns'], ['/expenses', 'Expenses'], ['/reports', 'Reports'], ['/bill-settings', 'Bill Printing Settings']];
const cust = { url: '/customers', label: 'Customer', fields: [['name', 'Name', 'text', 1], ['phone', 'Phone'], ['email', 'Email', 'email'], ['address', 'Address']], cols: [['Name', 'name'], ['Phone', 'phone'], ['Email', 'email'], ['Address', 'address']] };
function Shell({ logout }) {
  const [open, setOpen] = useState(false), [cart, setCart] = useState([]), [settings, setSettings] = useState({}), { pathname } = useLocation();
  useEffect(() => { api.get('/settings').then((r) => setSettings(r.data)); }, []);
  const add = (p) => {
    if (p.stock < 1) return alert('Out of stock');
    setCart((c) => c.find((i) => i._id === p._id) ? c.map((i) => (i._id === p._id ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i)) : [...c, { ...p, qty: 1 }]);
  };
  const theme = () => { const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = t; localStorage.setItem('theme', t); };
  const title = (NAV.find((n) => n[0] === pathname) || [0, 'Clothing Center'])[1];
  return (
    <Ctx.Provider value={{ cart, setCart, add, settings, setSettings }}>
      <div id="app">
        <div id="side" className={open ? 'open' : ''}>
          <h2>&#128717; Clothing Center</h2>
          {NAV.map(([p, l]) => <NavLink key={p} to={p} end onClick={() => setOpen(false)}>{l}</NavLink>)}
        </div>
        <div id="right">
          <div id="top"><button id="burger" className="g" onClick={() => setOpen(!open)}>&#9776;</button><h1>{title}</h1>
            <button className="g" onClick={theme}>&#9681; Theme</button><button className="d" onClick={logout}>Logout</button></div>
          <div id="main"><Routes>
            <Route path="/" element={<Summary />} /><Route path="/reports" element={<Summary full />} />
            <Route path="/pos" element={<POS />} /><Route path="/sell" element={<Products mode="sell" />} /><Route path="/inventory" element={<Products mode="inv" />} />
            <Route path="/add-clothes" element={<AddClothes />} /><Route path="/add-clothes/:id" element={<AddClothes />} />
            <Route path="/categories" element={<Crud url="/categories" label="Category" fields={[['name', 'Category name', 'text', 1]]} cols={[['Name', 'name']]} />} />
            <Route path="/add-customer" element={<Crud {...cust} />} /><Route path="/customers" element={<Crud {...cust} />} />
            <Route path="/suppliers" element={<Crud url="/suppliers" label="Supplier" fields={[['name', 'Supplier name', 'text', 1], ['phone', 'Phone'], ['address', 'Address']]} cols={[['Name', 'name'], ['Phone', 'phone'], ['Address', 'address']]} />} />
            <Route path="/expenses" element={<Crud url="/expenses" label="Expense" fields={[['title', 'Title', 'text', 1], ['amount', 'Amount', 'number', 1], ['date', 'Date', 'date']]} cols={[['Title', 'title'], ['Amount', 'amount'], ['Date', 'date']]} />} />
            <Route path="/returns" element={<Crud url="/returns" nodel label="Return (restocks item)" fields={[['barcode', 'Item barcode', 'text', 1], ['qty', 'Quantity', 'number', 1], ['amount', 'Refund amount', 'number'], ['reason', 'Reason']]} cols={[['Item', 'name'], ['Qty', 'qty'], ['Refund', 'amount'], ['Reason', 'reason']]} />} />
            <Route path="/sales" element={<Sales />} /><Route path="/print-bill" element={<Sales />} /><Route path="/bill-settings" element={<Settings />} />
          </Routes></div>
        </div>
      </div>
    </Ctx.Provider>
  );
}
export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));
  if (!auth) return <Login onLogin={() => setAuth(true)} />;
  return <Shell logout={() => { localStorage.removeItem('token'); setAuth(false); }} />;
}
