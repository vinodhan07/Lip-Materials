const express = require('express');
const db = require('../database/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

// Get active announcements (public)
router.get('/active', optionalAuth, (req, res) => {
    try {
        const now = new Date().toISOString();

        const announcements = db.prepare(`
      SELECT * FROM announcements 
      WHERE is_active = 1 
      AND (start_date IS NULL OR start_date <= ?)
      AND (end_date IS NULL OR end_date >= ?)
      ORDER BY created_at DESC
    `).all(now, now);

        res.json({ announcements });
    } catch (error) {
        console.error('Get active announcements error:', error);
        res.status(500).json({ error: 'Failed to get announcements' });
    }
});

// Get all announcements (admin only)
router.get('/', authenticateToken, isAdmin, (req, res) => {
    try {
        const announcements = db.prepare(`
      SELECT a.*, u.name as created_by_name
      FROM announcements a
      LEFT JOIN users u ON a.created_by = u.id
      ORDER BY a.created_at DESC
    `).all();

        res.json({ announcements });
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ error: 'Failed to get announcements' });
    }
});

// Create announcement (admin only)
router.post('/', authenticateToken, isAdmin, (req, res) => {
    try {
        const { title, message, type, isActive, startDate, endDate } = req.body;

        if (!title || !message) {
            return res.status(400).json({ error: 'Title and message are required' });
        }

        const result = db.prepare(`
      INSERT INTO announcements (title, message, type, is_active, start_date, end_date, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
            title,
            message,
            type || 'both',
            isActive !== false ? 1 : 0,
            startDate || null,
            endDate || null,
            req.user.id
        );

        const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json({ message: 'Announcement created', announcement });
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ error: 'Failed to create announcement' });
    }
});

// Update announcement (admin only)
router.put('/:id', authenticateToken, isAdmin, (req, res) => {
    try {
        const { title, message, type, isActive, startDate, endDate } = req.body;
        const announcementId = req.params.id;

        const existing = db.prepare('SELECT * FROM announcements WHERE id = ?').get(announcementId);
        if (!existing) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        db.prepare(`
      UPDATE announcements SET 
        title = ?, message = ?, type = ?, is_active = ?, 
        start_date = ?, end_date = ?
      WHERE id = ?
    `).run(
            title || existing.title,
            message || existing.message,
            type || existing.type,
            isActive !== undefined ? (isActive ? 1 : 0) : existing.is_active,
            startDate !== undefined ? startDate : existing.start_date,
            endDate !== undefined ? endDate : existing.end_date,
            announcementId
        );

        const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(announcementId);
        res.json({ message: 'Announcement updated', announcement });
    } catch (error) {
        console.error('Update announcement error:', error);
        res.status(500).json({ error: 'Failed to update announcement' });
    }
});

// Toggle announcement status (admin only)
router.patch('/:id/toggle', authenticateToken, isAdmin, (req, res) => {
    try {
        const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        const newStatus = announcement.is_active ? 0 : 1;
        db.prepare('UPDATE announcements SET is_active = ? WHERE id = ?').run(newStatus, req.params.id);

        res.json({ message: `Announcement ${newStatus ? 'activated' : 'deactivated'}`, isActive: !!newStatus });
    } catch (error) {
        console.error('Toggle announcement error:', error);
        res.status(500).json({ error: 'Failed to toggle announcement' });
    }
});

// Delete announcement (admin only)
router.delete('/:id', authenticateToken, isAdmin, (req, res) => {
    try {
        const announcement = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
});

module.exports = router;
