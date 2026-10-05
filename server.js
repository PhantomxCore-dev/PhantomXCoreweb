const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = 3000;
const DB   = path.join(__dirname, 'orders.json');

// ── Middleware ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html + assets

// ── Helpers ─────────────────────────────────────────────────────────
function loadOrders() {
  if (!fs.existsSync(DB)) return [];
  try { return JSON.parse(fs.readFileSync(DB, 'utf8')); }
  catch { return []; }
}

function saveOrders(orders) {
  fs.writeFileSync(DB, JSON.stringify(orders, null, 2), 'utf8');
}

// ── POST /api/order  ─────────────────────────────────────────────────
// Body: { name, phone, product }
app.post('/api/order', (req, res) => {
  const { name, phone, product } = req.body;

  if (!phone || !product) {
    return res.status(400).json({ ok: false, message: 'Phone and product are required.' });
  }

  const order = {
    id:        Date.now(),
    name:      name   || 'N/A',
    phone:     phone.trim(),
    product:   product.trim(),
    status:    'pending',
    createdAt: new Date().toISOString(),
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  console.log(`[NEW ORDER] #${order.id} | ${order.name} | ${order.phone} | ${order.product}`);

  res.json({ ok: true, orderId: order.id });
});

// ── GET /api/orders  (admin view) ────────────────────────────────────
app.get('/api/orders', (req, res) => {
  res.json(loadOrders());
});

// ── Start ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  Phantom X Core backend running at http://localhost:${PORT}`);
  console.log(`  Orders saved to: ${DB}`);
  console.log(`  Admin view: http://localhost:${PORT}/api/orders\n`);
});
