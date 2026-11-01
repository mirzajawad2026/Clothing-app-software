import { useContext, useEffect, useState } from 'react';
import api, { money } from '../api';
import { Ctx } from '../App';
import Bill from '../components/Bill';
export default function Sales() {
  const [rows, setRows] = useState([]), [q, setQ] = useState(''), [sel, setSel] = useState(null), { settings } = useContext(Ctx);
  useEffect(() => { api.get('/sales', { params: { q } }).then((r) => setRows(r.data)); }, [q]);
  return (<div className="card"><input placeholder="Search invoice or customer..." value={q} onChange={(e) => setQ(e.target.value)} /><br /><br />
    <div className="tw"><table><thead><tr>{['Invoice', 'Date', 'Customer', 'Method', 'Total', ''].map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((s) => <tr key={s._id}><td>{s.invoice}</td><td>{new Date(s.createdAt).toLocaleString()}</td><td>{s.customer || 'Walk-in'}</td><td>{s.method}</td><td>{money(s.total, settings.cur)}</td>
        <td><button className="s" onClick={() => setSel(s)}>Preview / Print</button></td></tr>)}</tbody></table></div>
    {sel && <Bill sale={sel} settings={settings} onClose={() => setSel(null)} />}</div>);
}
