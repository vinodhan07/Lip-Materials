const db = require('./db');
const bcrypt = require('bcryptjs');

const seedDatabase = () => {
    console.log('Seeding database...');

    // Create default admin user
    const adminPassword = bcrypt.hashSync('admin@123', 10);

    try {
        const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@gmail.com');

        if (!existingAdmin) {
            db.prepare(`
        INSERT INTO users (email, password_hash, name, role)
        VALUES (?, ?, ?, ?)
      `).run('admin@gmail.com', adminPassword, 'Admin', 'admin');
            console.log('Default admin created: admin@gmail.com / admin@123');
        } else {
            console.log('Admin already exists');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    }

    // Seed sample products
    const products = [
        {
            name: 'Premium Lip Packaging Box',
            description: 'High-quality packaging box for lip products. Perfect for lipstick, lip gloss, and lip balm packaging.',
            price: 299.00,
            category: 'Lip Boxes',
            image_url: '/uploads/products/lip-box-1.jpg',
            stock: 100
        },
        {
            name: 'Luxury Lipstick Container',
            description: 'Elegant luxury container for premium lipstick products. Features gold trim and magnetic closure.',
            price: 499.00,
            category: 'Containers',
            image_url: '/uploads/products/container-1.jpg',
            stock: 50
        },
        {
            name: 'Eco-Friendly Lip Balm Tube',
            description: 'Sustainable and biodegradable lip balm tube. Made from recycled materials.',
            price: 149.00,
            category: 'Tubes',
            image_url: '/uploads/products/tube-1.jpg',
            stock: 200
        },
        {
            name: 'Custom Printed Gift Box',
            description: 'Customizable gift box set for lip care products. Includes inner tray and ribbon.',
            price: 799.00,
            category: 'Gift Sets',
            image_url: '/uploads/products/gift-box-1.jpg',
            stock: 30
        },
        {
            name: 'Lip Gloss Wand Applicator',
            description: 'Professional-grade lip gloss applicator wand. Doe foot design for smooth application.',
            price: 49.00,
            category: 'Applicators',
            image_url: '/uploads/products/applicator-1.jpg',
            stock: 500
        },
        {
            name: 'Matte Black Lipstick Tube',
            description: 'Sleek matte black aluminum lipstick tube. Modern minimalist design.',
            price: 199.00,
            category: 'Tubes',
            image_url: '/uploads/products/matte-tube-1.jpg',
            stock: 150
        }
    ];

    const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (name, description, price, category, image_url, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    for (const product of products) {
        try {
            insertProduct.run(
                product.name,
                product.description,
                product.price,
                product.category,
                product.image_url,
                product.stock
            );
        } catch (error) {
            // Product might already exist
        }
    }
    console.log('Sample products seeded');

    // Seed sample announcement
    try {
        const existingAnnouncement = db.prepare('SELECT id FROM announcements LIMIT 1').get();

        if (!existingAnnouncement) {
            db.prepare(`
        INSERT INTO announcements (title, message, type, is_active, created_by)
        VALUES (?, ?, ?, ?, ?)
      `).run(
                'Welcome to LIP Packaging!',
                '🎉 Get 20% off on your first order! Use code WELCOME20 at checkout.',
                'both',
                1,
                1
            );
            console.log('Sample announcement created');
        }
    } catch (error) {
        console.error('Error creating announcement:', error);
    }

    console.log('Database seeding completed!');
};

// Run seeding
seedDatabase();
