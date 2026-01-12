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
        : 'https://placehold.co/300x300/f1f5f9/94a3b8?text=No+Image';

    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-gold-500/30 hover:shadow-[0_0_30px_-5px_rgba(253,185,49,0.15)] transition-all duration-300 flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-luxury-800/50">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/1a0b2e/e2e8f0?text=No+Image';
                    }}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-luxury-900/0 group-hover:bg-luxury-900/20 transition-colors duration-300"></div>

                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`absolute bottom-3 left-3 right-3 py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ${product.stock <= 0
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gold-500 text-luxury-900 hover:bg-gold-400 shadow-lg shadow-black/20'
                        }`}
                >
                    <ShoppingCart size={16} />
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                {/* Category Badge */}
                {product.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-luxury-900/80 backdrop-blur-md border border-white/10 text-gold-400 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                        {product.category}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 text-white">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={12}
                            className={i < 4 ? 'text-gold-400 fill-gold-400' : 'text-gray-700'}
                        />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1 font-medium">(4.0)</span>
                </div>

                <h3 className="font-bold text-white mb-1.5 line-clamp-1 group-hover:text-gold-400 transition-colors">
                    {product.name}
                </h3>

                <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
                    {product.description || 'Premium quality packaging solution for your business.'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                    <div>
                        <span className="text-lg font-bold text-white">
                            ₹{product.price?.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">/unit</span>
                    </div>

                    {product.stock > 0 && product.stock <= 10 && (
                        <span className="text-[10px] text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            Low Stock
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
