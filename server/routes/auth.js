const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database/db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, '../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Use memory storage for multer - we'll save manually after auth
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'));
        }
    }
});

// Register new user
router.post('/register', (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        // Check if user exists
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = bcrypt.hashSync(password, 10);

        // Insert user
        const result = db.prepare(`
      INSERT INTO users (email, password_hash, name, phone, role)
      VALUES (?, ?, ?, ?, 'user')
    `).run(email, passwordHash, name, phone || null);

        // Generate token
        const token = jwt.sign(
            { id: result.lastInsertRowid, email, name, role: 'user' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: { id: result.lastInsertRowid, email, name, role: 'user' }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const validPassword = bcrypt.compareSync(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                photo_url: user.photo_url
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
    try {
        const user = db.prepare(`
            SELECT id, email, name, phone, address, city, state, country, pincode, photo_url, role, created_at 
            FROM users WHERE id = ?
        `).get(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
    try {
        const { name, phone, address, city, state, country, pincode } = req.body;

        db.prepare(`
            UPDATE users 
            SET name = ?, phone = ?, address = ?, city = ?, state = ?, country = ?, pincode = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(name, phone, address, city || null, state || null, country || null, pincode || null, req.user.id);

        // Get updated user
        const user = db.prepare(`
            SELECT id, email, name, phone, address, city, state, country, pincode, photo_url, role 
            FROM users WHERE id = ?
        `).get(req.user.id);

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Upload profile photo - authenticateToken runs BEFORE upload middleware
router.post('/profile/photo', authenticateToken, upload.single('photo'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No photo uploaded' });
        }

        // Generate filename now that we have req.user
        const ext = path.extname(req.file.originalname) || '.jpg';
        const filename = `profile_${req.user.id}_${Date.now()}${ext}`;
        const filePath = path.join(uploadDir, filename);

        // Save file from memory buffer
        fs.writeFileSync(filePath, req.file.buffer);

        const photoUrl = `/uploads/profiles/${filename}`;

        // Delete old photo if exists
        const oldUser = db.prepare('SELECT photo_url FROM users WHERE id = ?').get(req.user.id);
        if (oldUser?.photo_url && oldUser.photo_url.startsWith('/uploads/profiles/')) {
            const oldPath = path.join(__dirname, '..', oldUser.photo_url);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Update database
        db.prepare('UPDATE users SET photo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(photoUrl, req.user.id);

        res.json({
            message: 'Photo uploaded successfully',
            photo_url: photoUrl
        });
    } catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({ error: 'Failed to upload photo' });
    }
});

module.exports = router;
