import { useContext, useState } from 'react';
import api, { msg } from '../api';
import { Ctx } from '../App';
export default function Settings() {
  const { settings, setSettings } = useContext(Ctx), [f, setF] = useState(settings), [note, setNote] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const save = async () => { try { const r = await api.put('/settings', { ...f, tax: +f.tax }); setSettings(r.data); setNote('Settings saved'); } catch (x) { setNote(msg(x)); } };
  const T = (k, l, t = 'text') => <label>{l}<input type={t} step="any" value={f[k] ?? ''} onChange={set(k)} /></label>;
  return (<div className="card"><div className="f">{T('name', 'Store name')}{T('address', 'Address')}{T('phone', 'Phone')}{T('cur', 'Currency')}{T('tax', 'Tax %', 'number')}
    <label>Paper size<select value={f.width || '80mm'} onChange={set('width')}><option>58mm</option><option>80mm</option><option>A4</option></select></label></div>
    {T('footer', 'Bill footer message')}<label><input type="checkbox" style={{ width: 'auto' }} checked={!!f.autoPrint} onChange={set('autoPrint')} /> Auto print after sale</label>
    <button onClick={save}>Save Settings</button> <span>{note}</span></div>);
}
