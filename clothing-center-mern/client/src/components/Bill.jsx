export default function Bill({ sale: s, settings: S, onClose }) {
  const f = (n) => (+n || 0).toFixed(2), w = S.width === 'A4' ? '190mm' : S.width || '80mm';
  return (
    <div id="modal" style={{ display: 'flex' }}><div id="mbox"><div id="bill" style={{ width: w }}>
      <h3>{S.name}</h3><div className="c">{S.address}<br />{S.phone}</div><hr />
      Bill: {s.invoice}<br />{new Date(s.createdAt).toLocaleString()}<br />Customer: {s.customer || 'Walk-in'}<hr />
      <table style={{ width: '100%' }}><tbody><tr><th align="left">Item</th><th>Qty</th><th align="right">Amt</th></tr>
        {s.items.map((i, k) => <tr key={k}><td>{i.name} {i.size}<br /><small>{i.barcode}</small></td><td align="center">{i.qty}</td><td align="right">{f(i.price * i.qty)}</td></tr>)}</tbody></table><hr />
      <table style={{ width: '100%' }}><tbody>
        <tr><td>Subtotal</td><td align="right">{f(s.subtotal)}</td></tr><tr><td>Discount</td><td align="right">-{f(s.discount)}</td></tr><tr><td>Tax</td><td align="right">{f(s.tax)}</td></tr>
        <tr><td><b>Total ({S.cur})</b></td><td align="right"><b>{f(s.total)}</b></td></tr><tr><td>Paid ({s.method})</td><td align="right">{f(s.paid)}</td></tr>
        <tr><td>Change</td><td align="right">{f(Math.max(0, s.paid - s.total))}</td></tr></tbody></table><hr /><div className="c">{S.footer}</div>
    </div>
    <div className="row" style={{ marginTop: 10 }}><button onClick={() => window.print()}>Print</button><button className="g" onClick={onClose}>Close</button></div></div></div>
  );
}
