const express = require('express');
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, (req, res) => {
    try {
        const cartItems = db.prepare(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `).all(req.user.id);

        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.json({ items: cartItems, total });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Failed to get cart' });
    }
});

// Add item to cart
router.post('/add', authenticateToken, (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        // Check if product exists
        const product = db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        // Check if already in cart
        const existingItem = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.user.id, productId);

        if (existingItem) {
            // Update quantity
            db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity, existingItem.id);
        } else {
            // Add new item
            db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(req.user.id, productId, quantity);
        }

        res.json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
});

// Update cart item quantity
router.put('/:itemId', authenticateToken, (req, res) => {
    try {
        const { quantity } = req.body;
        const { itemId } = req.params;

        const cartItem = db.prepare('SELECT * FROM cart_items WHERE id = ? AND user_id = ?').get(itemId, req.user.id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        if (quantity <= 0) {
            // Remove item
            db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);
            return res.json({ message: 'Item removed from cart' });
        }

        // Check stock
        const product = db.prepare('SELECT stock FROM products WHERE id = ?').get(cartItem.product_id);
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, itemId);
        res.json({ message: 'Cart updated' });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

// Remove item from cart
router.delete('/:itemId', authenticateToken, (req, res) => {
    try {
        const cartItem = db.prepare('SELECT * FROM cart_items WHERE id = ? AND user_id = ?').get(req.params.itemId, req.user.id);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.itemId);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
});

// Clear cart
router.delete('/', authenticateToken, (req, res) => {
    try {
        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

module.exports = router;
