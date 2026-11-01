import { useContext, useEffect, useState } from 'react';
import api, { msg, money } from '../api';
import { Ctx } from '../App';
import Bill from '../components/Bill';
export default function POS() {
  const { cart, setCart, add, settings } = useContext(Ctx);
  const [q, setQ] = useState(''), [list, setList] = useState([]), [custs, setCusts] = useState([]), [cu, setCu] = useState(''), [disc, setDisc] = useState(0),
    [method, setMethod] = useState('Cash'), [paid, setPaid] = useState(''), [sale, setSale] = useState(null), [err, setErr] = useState('');
  useEffect(() => { api.get('/customers').then((r) => setCusts(r.data)); }, []);
  useEffect(() => { api.get('/products', { params: { q } }).then((r) => setList(r.data.slice(0, 15))); }, [q, sale]);
  const scan = async (e) => {
    if (e.key !== 'Enter') return; e.preventDefault();
    const c = e.target.value.trim(); e.target.value = ''; if (!c) return;
    try { add((await api.get('/products/barcode/' + encodeURIComponent(c))).data); setErr(''); } catch (x) { setErr(msg(x)); }
  };
  const qty = (id, n) => setCart((c) => c.map((i) => (i._id === id ? { ...i, qty: Math.min(i.qty + n, i.stock) } : i)).filter((i) => i.qty > 0));
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0), d = Math.min(+disc || 0, sub), tax = ((sub - d) * (settings.tax || 0)) / 100, total = sub - d + tax;
  const checkout = async () => {
    try {
      const r = await api.post('/sales', { items: cart.map((i) => ({ product: i._id, qty: i.qty })), customer: cu, discount: d, method, paid });
      setSale(r.data); setCart([]); setDisc(0); setPaid(''); setErr(''); if (settings.autoPrint) setTimeout(() => window.print(), 300);
    } catch (x) { setErr(msg(x)); }
  };
  return (<div className="pos">
    <div className="card"><label>Scan barcode (press Enter)<input autoFocus placeholder="Scan barcode here" onKeyDown={scan} /></label>
      <input placeholder="Or search product..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="tw" style={{ marginTop: 8 }}><table><tbody>{list.map((p) => <tr key={p._id}><td>{p.name} {p.size}</td><td>{money(p.price, settings.cur)}</td><td>{p.stock}</td><td><button className="s" onClick={() => add(p)}>Add</button></td></tr>)}</tbody></table></div></div>
    <div className="card"><div className="tw"><table><thead><tr><th>Item</th><th>Qty</th><th>Total</th><th /></tr></thead>
      <tbody>{cart.map((i) => <tr key={i._id}><td>{i.name} {i.size}</td><td><button className="s g" onClick={() => qty(i._id, -1)}>-</button> {i.qty} <button className="s g" onClick={() => qty(i._id, 1)}>+</button></td>
        <td>{money(i.price * i.qty, settings.cur)}</td><td><button className="s d" onClick={() => qty(i._id, -i.qty)}>x</button></td></tr>)}</tbody></table></div><br />
      <label>Customer<select value={cu} onChange={(e) => setCu(e.target.value)}><option value="">Walk-in</option>{custs.map((c) => <option key={c._id}>{c.name}</option>)}</select></label>
      <div className="f"><label>Discount<input type="number" min="0" value={disc} onChange={(e) => setDisc(e.target.value)} /></label>
        <label>Payment<select value={method} onChange={(e) => setMethod(e.target.value)}><option>Cash</option><option>Card</option><option>Online</option></select></label>
        <label>Paid amount<input type="number" value={paid} onChange={(e) => setPaid(e.target.value)} /></label></div>
      <div className="tot"><span>Subtotal</span><span>{money(sub, settings.cur)}</span></div><div className="tot"><span>Tax ({settings.tax || 0}%)</span><span>{money(tax, settings.cur)}</span></div>
      <div className="tot big"><span>Total</span><span>{money(total, settings.cur)}</span></div>{err && <p className="low">{err}</p>}
      <div className="row"><button disabled={!cart.length} onClick={checkout}>Complete Sale</button><button className="g" onClick={() => setCart([])}>Clear</button></div></div>
    {sale && <Bill sale={sale} settings={settings} onClose={() => setSale(null)} />}</div>);
}
