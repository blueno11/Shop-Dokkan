const express = require('express');
const db = require('../db');
const router = express.Router();

// Helper function to safely parse JSON
const parseMetaJson = (metaJson) => {
  if (!metaJson) return null;
  
  // Nếu đã là object rồi thì return luôn
  if (typeof metaJson === 'object') {
    return metaJson;
  }
  
  // Nếu là string thì parse
  if (typeof metaJson === 'string') {
    try {
      return JSON.parse(metaJson);
    } catch (e) {
      console.error('Failed to parse meta_json:', e);
      return null;
    }
  }
  
  return null;
};

// List products for storefront (only active)
router.get('/products', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         p.id, p.name, p.slug, p.description, p.price, p.sale_price, p.is_active, p.created_at,
         pm.meta_json
       FROM products p 
       LEFT JOIN product_meta pm ON pm.product_id = p.id
       WHERE p.is_active=1 
       ORDER BY p.created_at DESC 
       LIMIT 100`
    );
    const items = rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      description: r.description,
      price: r.price,
      sale_price: r.sale_price,
      is_active: r.is_active,
      created_at: r.created_at,
      meta: parseMetaJson(r.meta_json),
    }));
    res.json({ items });
  } catch (e) {
    console.error('Error fetching products:', e);
    const [rows] = await db.query(
      `SELECT p.id, p.name, p.slug, p.description, p.price, p.sale_price, p.is_active, p.created_at
       FROM products p WHERE p.is_active=1 ORDER BY p.created_at DESC LIMIT 100`
    );
    res.json({ items: rows.map((r) => ({ ...r, meta: null })) });
  }
});

// Product details with meta
router.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    
    const [[row]] = await db.query('SELECT * FROM products WHERE id=? AND is_active=1', [id]);
    if (!row) return res.status(404).json({ error: 'Không tìm thấy' });
    
    const [[meta]] = await db.query('SELECT meta_json FROM product_meta WHERE product_id=?', [id]);
    
    res.json({ 
      ...row, 
      meta: parseMetaJson(meta?.meta_json)
    });
  } catch (e) {
    console.error('Error fetching product details:', e);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

module.exports = router;