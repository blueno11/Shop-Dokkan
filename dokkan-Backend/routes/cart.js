const express = require('express');
const router = express.Router();

// Ensure cart exists on session
function ensureCart(req) {
	if (!req.session.cart) {
		req.session.cart = [];
	}
	return req.session.cart;
}

// GET /api/cart - list cart items
router.get('/', (req, res) => {
	const cart = ensureCart(req);
	res.json({ items: cart });
});

// POST /api/cart - add item {productId, name, price, quantity, image}
router.post('/', (req, res) => {
	const { productId, name, price, quantity = 1, image } = req.body;
	if (!productId || !name || typeof price !== 'number') {
		return res.status(400).json({ error: 'Thiếu productId, name hoặc price' });
	}
	const qty = Number(quantity) || 1;
	const cart = ensureCart(req);
	const existing = cart.find((i) => i.productId === productId);
	if (existing) {
		existing.quantity += qty;
	} else {
		cart.push({ productId, name, price, quantity: qty, image });
	}
	res.status(201).json({ items: cart });
});

// PATCH /api/cart/:productId - update quantity {quantity}
router.patch('/:productId', (req, res) => {
	const { productId } = req.params;
	const { quantity } = req.body;
	const qty = Number(quantity);
	if (!Number.isFinite(qty) || qty < 0) {
		return res.status(400).json({ error: 'quantity không hợp lệ' });
	}
	const cart = ensureCart(req);
	const item = cart.find((i) => i.productId === productId);
	if (!item) {
		return res.status(404).json({ error: 'Sản phẩm không có trong giỏ' });
	}
	if (qty === 0) {
		req.session.cart = cart.filter((i) => i.productId !== productId);
		return res.json({ items: req.session.cart });
	}
	item.quantity = qty;
	res.json({ items: cart });
});

// DELETE /api/cart/:productId - remove one item
router.delete('/:productId', (req, res) => {
	const { productId } = req.params;
	const cart = ensureCart(req);
	const next = cart.filter((i) => i.productId !== productId);
	req.session.cart = next;
	res.json({ items: next });
});

// DELETE /api/cart - clear cart
router.delete('/', (req, res) => {
	req.session.cart = [];
	res.json({ items: [] });
});

module.exports = router; 