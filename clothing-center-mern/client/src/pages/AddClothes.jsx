import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { msg } from '../api';
const blank = { barcode: '', name: '', category: '', brand: '', size: 'M', color: '', type: 'Casual', supplier: '', cost: '', price: '', stock: '', min: 5, description: '' };
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free', '28', '30', '32', '34', '36', '38', '40'], TYPES = ['Casual', 'Formal', 'Party', 'Sports', 'Winter', 'Summer'];
export default function AddClothes() {
  const { id } = useParams(), nav = useNavigate(), nameRef = useRef(), bcRef = useRef();
  const [f, setF] = useState(blank), [cats, setCats] = useState([]), [sups, setSups] = useState([]), [err, setErr] = useState('');
  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data)); api.get('/suppliers').then((r) => setSups(r.data));
    id ? api.get('/products/' + id).then((r) => setF({ ...blank, ...r.data })) : setF(blank); bcRef.current?.focus();
  }, [id]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try { id ? await api.put('/products/' + id, f) : await api.post('/products', f); alert('Saved'); id ? nav('/inventory') : (setF(blank), setErr(''), bcRef.current.focus()); }
    catch (x) { setErr(msg(x)); }
  };
  const T = (k, l, t = 'text', p = {}) => <label>{l}<input type={t} step="any" value={f[k] ?? ''} onChange={set(k)} {...p} /></label>;
  const S = (k, l, o) => <label>{l}<select value={f[k] ?? ''} onChange={set(k)}><option value="">-</option>{o.map((x) => <option key={x}>{x}</option>)}</select></label>;
  return (<form className="card" onSubmit={submit}><div className="f">
    <label>Barcode (scan here)<input ref={bcRef} required value={f.barcode} placeholder="Click here and scan barcode" onChange={set('barcode')} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); nameRef.current.focus(); } }} /></label>
    <label>Product name<input ref={nameRef} required value={f.name} onChange={set('name')} /></label>
    {S('category', 'Category', cats.map((c) => c.name))}{T('brand', 'Brand')}{S('size', 'Size', SIZES)}{T('color', 'Color')}{S('type', 'Type', TYPES)}{S('supplier', 'Supplier', sups.map((s) => s.name))}
    {T('cost', 'Cost price', 'number', { required: true, min: 0 })}{T('price', 'Sale price', 'number', { required: true, min: 0 })}{T('stock', 'Stock qty', 'number', { required: true, min: 0 })}{T('min', 'Low stock alert', 'number', { min: 0 })}</div>
    <label>Description<textarea rows="2" value={f.description || ''} onChange={set('description')} /></label>{err && <p className="low">{err}</p>}
    <div className="row"><button>{id ? 'Update' : 'Save'} Clothes</button>
      <button type="button" className="g" onClick={() => setF({ ...f, barcode: String(Date.now()).slice(1) + Math.floor(Math.random() * 90 + 10) })}>Generate Barcode</button>
      {id && <button type="button" className="g" onClick={() => nav('/add-clothes')}>Cancel</button>}</div></form>);
}
