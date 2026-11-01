import { useState } from 'react';
import api, { msg } from '../api';
export default function Login({ onLogin }) {
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [err, setErr] = useState('');
  const submit = async (e) => { e.preventDefault(); try { const r = await api.post('/auth/login', { email, password }); localStorage.setItem('token', r.data.token); onLogin(); } catch (x) { setErr(msg(x)); } };
  return (<div id="lg"><form className="card" onSubmit={submit}><h2 style={{ marginTop: 0 }}>Admin Login</h2>
    <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
    <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
    <p className="low">{err}</p><button style={{ width: '100%' }}>Login</button></form></div>);
}
