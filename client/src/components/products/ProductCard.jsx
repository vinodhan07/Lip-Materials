import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductCard({ product }) {
    const { addToCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            navigate('/login');
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
        : 'https://placehold.co/300x300/EEE/999?text=No+Image';

    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 border border-purple-50 hover:border-purple-100"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-white">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/EEE/999?text=No+Image';
                    }}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`absolute bottom-4 left-4 right-4 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ${product.stock <= 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-purple-700 hover:bg-purple-50 shadow-lg'
                        }`}
                >
                    <ShoppingCart size={18} />
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                {/* Category Badge */}
                {product.category && (
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-semibold rounded-full shadow-lg">
                        {product.category}
                    </span>
                )}

                {/* Out of Stock Overlay */}
                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
                        />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">(4.0)</span>
                </div>

                <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {product.name}
                </h3>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {product.description || 'Premium quality packaging solution'}
                </p>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            ₹{product.price?.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">/unit</span>
                    </div>

                    {product.stock > 0 && product.stock <= 10 && (
                        <span className="text-xs text-amber-600 font-medium">
                            Only {product.stock} left
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
