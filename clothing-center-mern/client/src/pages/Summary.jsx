import { useContext, useEffect, useState } from 'react';
import api, { money } from '../api';
import { Ctx } from '../App';
const Tbl = ({ h, rows }) => <div className="tw"><table><thead><tr>{h.map((x) => <th key={x}>{x}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>;
export default function Summary({ full }) {
  const [d, setD] = useState(null), { settings } = useContext(Ctx), m = (n) => money(n, settings.cur);
  useEffect(() => { api.get('/reports/summary').then((r) => setD(r.data)); }, []);
  if (!d) return <p>Loading...</p>;
  const cards = full ? [['Revenue', m(d.totalSales)], ['Gross profit', m(d.profit)], ['Expenses', m(d.expenses)], ['Net profit', m(d.profit - d.expenses)], ['Stock value (cost)', m(d.stockValue)]]
    : [['Today sales', m(d.todaySales)], ['Bills today', d.todayBills], ['Total sales', m(d.totalSales)], ['Products', d.products], ['Stock units', d.units], ['Low stock', d.low.length], ['Customers', d.customers], ['Net profit', m(d.profit - d.expenses)]];
  return (<><div className="grid">{cards.map(([l, v]) => <div key={l} className="card stat"><span>{l}</span><b>{v}</b></div>)}</div>
    {full ? (<><div className="card"><h3>Last 7 days</h3><Tbl h={['Date', 'Bills', 'Sales']} rows={d.daily.map((x) => [x._id, x.bills, m(x.sales)])} /></div>
      <div className="card"><h3>Top selling</h3><Tbl h={['Item', 'Units']} rows={d.top.map((x) => [x._id, x.units])} /></div></>)
      : (<><div className="card"><h3>Low stock items</h3><Tbl h={['Item', 'Barcode', 'Stock', 'Min']} rows={d.low.map((p) => [p.name + ' ' + (p.size || ''), p.barcode, <span className="low">{p.stock}</span>, p.min])} /></div>
        <div className="card"><h3>Recent sales</h3><Tbl h={['Invoice', 'Customer', 'Total']} rows={d.recent.map((s) => [s.invoice, s.customer || 'Walk-in', m(s.total)])} /></div></>)}</>);
}
