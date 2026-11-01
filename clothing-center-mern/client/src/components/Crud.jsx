import { useEffect, useState } from 'react';
import api, { msg } from '../api';
export default function Crud({ url, label, fields, cols, nodel }) {
  const [rows, setRows] = useState([]), [f, setF] = useState({}), [err, setErr] = useState('');
  const load = () => api.get(url).then((r) => setRows(r.data));
  useEffect(() => { load(); setF({}); }, [url]);
  const save = async (e) => { e.preventDefault(); try { await api.post(url, f); setF({}); setErr(''); load(); } catch (x) { setErr(msg(x)); } };
  const del = async (id) => { if (confirm('Delete?')) { await api.delete(`${url}/${id}`); load(); } };
  return (<>
    <form className="card" onSubmit={save}>
      <div className="f">{fields.map(([k, l, t = 'text', req]) => (
        <label key={k}>{l}<input type={t} step="any" required={!!req} value={f[k] ?? ''} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>))}</div>
      {err && <p className="low">{err}</p>}<button>Save {label}</button>
    </form>
    <div className="card tw"><table><thead><tr>{cols.map((c) => <th key={c[0]}>{c[0]}</th>)}{!nodel && <th />}</tr></thead>
      <tbody>{rows.map((r) => <tr key={r._id}>{cols.map((c) => <td key={c[1]}>{r[c[1]]}</td>)}{!nodel && <td><button className="s d" onClick={() => del(r._id)}>Del</button></td>}</tr>)}</tbody></table></div>
  </>);
}
