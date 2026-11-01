const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const crud = (M, fields = []) => ({
  list: async (req, res) => {
    const q = req.query.q;
    const f = q ? { $or: fields.map((k) => ({ [k]: new RegExp(esc(q), 'i') })) } : {};
    res.json(await M.find(f).sort('-createdAt').limit(500));
  },
  one: async (req, res) => { const d = await M.findById(req.params.id); d ? res.json(d) : res.status(404).json({ message: 'Not found' }); },
  create: async (req, res) => res.status(201).json(await M.create(req.body)),
  update: async (req, res) => {
    const d = await M.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    d ? res.json(d) : res.status(404).json({ message: 'Not found' });
  },
  remove: async (req, res) => { await M.findByIdAndDelete(req.params.id); res.json({ ok: true }); },
});
