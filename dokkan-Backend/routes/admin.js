const express = require('express');
const db = require('../db');
const router = express.Router();

// Helpers for pagination/sort
function parseListQuery(req) {
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '20', 10)));
  const q = (req.query.q || '').trim();
  const sortBy = (req.query.sortBy || 'created_at');
  const sortDir = (req.query.sortDir || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
  return { page, pageSize, q, sortBy, sortDir };
}

// PRODUCTS CRUD
router.get('/products', async (req, res) => {
  const { page, pageSize, q, sortBy, sortDir } = parseListQuery(req);
  const offset = (page - 1) * pageSize;
  const where = q ? 'WHERE p.name LIKE ? OR p.sku LIKE ?' : '';
  const params = q ? [`%${q}%`, `%${q}%`] : [];
  const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM products p ${where}`, params);
  const [rows] = await db.query(
    `SELECT p.* , c.name as category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     ${where}
     ORDER BY ${sortBy} ${sortDir}
     LIMIT ? OFFSET ?`,
     [...params, pageSize, offset]
  );
  res.json({ items: rows, total, page, pageSize });
});

router.post('/products', async (req, res) => {
  const { name, slug, description, price, sale_price, category_id, sku, is_active, meta } = req.body;
  if (!name || !slug || typeof price !== 'number') return res.status(400).json({ error: 'Thiếu name/slug/price' });
  try {
    const [result] = await db.query(
      `INSERT INTO products (name, slug, description, price, sale_price, category_id, sku, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description || null, price, sale_price || null, category_id || null, sku || null, is_active ? 1 : 0]
    );
    const id = result.insertId;
    if (meta && typeof meta === 'object') {
      await db.query('INSERT INTO product_meta (product_id, meta_json) VALUES (?, ?)', [id, JSON.stringify(meta)]);
    }
    const [[created]] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: 'Tạo sản phẩm thất bại' });
  }
});

router.get('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const [[row]] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  if (!row) return res.status(404).json({ error: 'Không tìm thấy' });
  const [[meta]] = await db.query('SELECT meta_json FROM product_meta WHERE product_id = ?', [id]);
  res.json({ ...row, meta: meta?.meta_json || null });
});

router.put('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, slug, description, price, sale_price, category_id, sku, is_active, meta } = req.body;
  const [result] = await db.query(
    `UPDATE products SET name=?, slug=?, description=?, price=?, sale_price=?, category_id=?, sku=?, is_active=? WHERE id=?`,
    [name, slug, description || null, price, sale_price || null, category_id || null, sku || null, is_active ? 1 : 0, id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy' });
  if (meta && typeof meta === 'object') {
    await db.query(
      `INSERT INTO product_meta (product_id, meta_json) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE meta_json=VALUES(meta_json)`,
      [id, JSON.stringify(meta)]
    );
  }
  const [[updated]] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
  res.json(updated);
});

router.delete('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ success: true });
});

// CATEGORIES CRUD
router.get('/categories', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
  res.json({ items: rows });
});

router.post('/categories', async (req, res) => {
  const { name, slug, parent_id, is_active } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Thiếu name/slug' });
  const [result] = await db.query(
    'INSERT INTO categories (name, slug, parent_id, is_active) VALUES (?, ?, ?, ?)',
    [name, slug, parent_id || null, is_active ? 1 : 0]
  );
  const id = result.insertId;
  const [[created]] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
  res.status(201).json(created);
});

router.put('/categories/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, slug, parent_id, is_active } = req.body;
  const [result] = await db.query(
    'UPDATE categories SET name=?, slug=?, parent_id=?, is_active=? WHERE id=?',
    [name, slug, parent_id || null, is_active ? 1 : 0, id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy' });
  const [[updated]] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
  res.json(updated);
});

router.delete('/categories/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Không tìm thấy' });
  res.json({ success: true });
});

// INVENTORIES (read/update stock)
router.get('/inventories', async (req, res) => {
  const [rows] = await db.query(
    `SELECT i.*, p.name as product_name FROM inventories i
     JOIN products p ON p.id = i.product_id
     ORDER BY i.id DESC`
  );
  res.json({ items: rows });
});

router.put('/inventories/:productId', async (req, res) => {
  const productId = parseInt(req.params.productId, 10);
  const { stock, low_stock_threshold } = req.body;
  if (!Number.isFinite(stock)) return res.status(400).json({ error: 'stock không hợp lệ' });
  const [result] = await db.query(
    `INSERT INTO inventories (product_id, stock, low_stock_threshold)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE stock=VALUES(stock), low_stock_threshold=VALUES(low_stock_threshold)` ,
     [productId, stock, Number.isFinite(low_stock_threshold) ? low_stock_threshold : 5]
  );
  const [[row]] = await db.query('SELECT * FROM inventories WHERE product_id = ?', [productId]);
  res.json(row);
});

module.exports = router;


