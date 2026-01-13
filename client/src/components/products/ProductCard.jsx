import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, ArrowUpRight } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductCard({ product }) {
    const { addToCart } = useCartStore();
    const { isAuthenticated, isAdmin } = useAuthStore();
    const navigate = useNavigate();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast('Please login to add items to cart', { icon: '🔐' });
            navigate('/login');
            return;
        }

        if (isAdmin()) {
            toast.error('Admins cannot add items to cart');
            return;
        }

        const result = await addToCart(product.id);
        if (result.success) {
            toast.success('Added to cart!');
        } else {
            toast.error(result.error);
        }
    };

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : `${API_URL}${product.image_url}`)
        : 'https://placehold.co/300x300/f3f4f6/9ca3af?text=No+Image';

    const userIsAdmin = isAuthenticated && isAdmin();

    // Simulated sold count (can be replaced with real data later)
    const soldCount = Math.floor(product.stock * 0.4) + 50;

    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            aria-label={`View ${product.name} - ₹${product.price?.toFixed(2)}`}
        >
            {/* Image Container - Light Gray Background */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    width="300"
                    height="300"
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/f3f4f6/9ca3af?text=No+Image';
                    }}
                />

                {/* Hover Arrow Icon */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <ArrowUpRight size={16} className="text-gray-700" />
                </div>

                {/* Quick Add Button - Hidden for admins */}
                {!userIsAdmin && (
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        aria-label={product.stock <= 0 ? 'Out of Stock' : `Add ${product.name} to cart`}
                        className={`absolute bottom-4 left-4 right-4 py-3 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out focus:translate-y-0 focus:opacity-100 ${product.stock <= 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 active:scale-[0.98]'
                            }`}
                    >
                        <ShoppingCart size={18} aria-hidden="true" />
                        <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </button>
                )}

                {/* Admin View-Only Badge */}
                {userIsAdmin && (
                    <div className="absolute bottom-3 left-3 right-3 py-2 px-4 rounded-xl bg-gray-800/90 backdrop-blur-sm flex items-center justify-center gap-2 text-sm text-white font-medium">
                        <ShieldCheck size={16} aria-hidden="true" />
                        View Only
                    </div>
                )}

                {/* Out of Stock Overlay */}
                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-gray-900 text-white text-xs font-bold rounded-full px-4 py-2">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content - Simplified */}
            <div className="flex flex-col flex-1" style={{ padding: '16px' }}>
                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors" style={{ marginBottom: '6px' }}>
                    {product.name}
                </h3>

                {/* Price */}
                <span className="text-lg font-bold text-gray-900" style={{ marginBottom: '12px' }}>
                    ₹{product.price?.toFixed(2)}
                </span>

                {/* Stock and Sold */}
                <div className="flex items-center mt-auto" style={{ gap: '16px' }}>
                    <div className="flex items-center" style={{ gap: '4px' }}>
                        <span className="text-xs text-gray-400">Stock:</span>
                        <span className="text-xs font-semibold text-gray-700">{product.stock}</span>
                    </div>
                    <div className="flex items-center" style={{ gap: '4px' }}>
                        <span className="text-xs text-gray-400">Sold:</span>
                        <span className="text-xs font-semibold text-gray-700">{soldCount}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
