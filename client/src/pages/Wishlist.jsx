import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/products/ProductCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5
        }
    }
};

export default function Wishlist() {
    const { items, isLoading, fetchWishlist } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        }
    }, [isAuthenticated, fetchWishlist]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '80px' }}>
                <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart size={32} className="text-purple-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Please login to view your wishlist</h2>
                    <p className="text-gray-500 mb-8">Save items you love and come back to them later</p>
                    <Link to="/login" className="inline-flex items-center bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white" style={{ paddingTop: '80px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50/50 to-white" style={{ paddingTop: '80px' }}>
                <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart size={32} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-8">Start exploring products and save your favorites!</p>
                    <Link to="/products" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                        Explore Products <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="text-purple-600 fill-purple-600" size={28} />
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-sm">
                        {items.length}
                    </span>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {items.map((item) => (
                        <motion.div key={item.id} variants={itemVariants} className="h-full">
                            {/* We map the wishlist item structure back to what ProductCard expects */}
                            <ProductCard
                                product={{
                                    id: item.product_id,
                                    name: item.name,
                                    price: item.price,
                                    image_url: item.image_url,
                                    stock: item.stock,
                                    category: item.category
                                }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
