import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { money } from '../api';
import { Ctx } from '../App';
export default function Products({ mode }) {
  const [rows, setRows] = useState([]), [q, setQ] = useState(''), nav = useNavigate(), { add, settings } = useContext(Ctx);
  const load = () => api.get('/products', { params: { q } }).then((r) => setRows(r.data));
  useEffect(() => { load(); }, [q]);
  const del = async (id) => { if (confirm('Delete product?')) { await api.delete('/products/' + id); load(); } };
  return (<div className="card"><input placeholder="Search name / barcode / brand..." value={q} onChange={(e) => setQ(e.target.value)} /><br /><br />
    <div className="tw"><table><thead><tr>{['Barcode', 'Name', 'Category', 'Size', 'Color', 'Price', 'Stock', ''].map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((p) => <tr key={p._id}><td>{p.barcode}</td><td>{p.name}</td><td>{p.category}</td><td>{p.size}</td><td>{p.color}</td><td>{money(p.price, settings.cur)}</td>
        <td className={p.stock <= p.min ? 'low' : ''}>{p.stock}</td>
        <td>{mode === 'sell' ? <button className="s" onClick={() => { add(p); nav('/pos'); }}>Sell</button>
          : <><button className="s" onClick={() => nav('/add-clothes/' + p._id)}>Edit</button> <button className="s d" onClick={() => del(p._id)}>Del</button></>}</td></tr>)}</tbody></table></div></div>);
}
