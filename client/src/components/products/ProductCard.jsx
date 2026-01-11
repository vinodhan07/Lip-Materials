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
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/300x300/f1f5f9/94a3b8?text=No+Image';
                    }}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300"></div>

                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`absolute bottom-3 left-3 right-3 py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ${product.stock <= 0
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-white text-purple-600 hover:bg-purple-50 shadow-sm'
                        }`}
                >
                    <ShoppingCart size={16} />
                    {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                {/* Category Badge */}
                {product.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                        {product.category}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={12}
                            className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                        />
                    ))}
                    <span className="text-[10px] text-slate-400 ml-1 font-medium">(4.0)</span>
                </div>

                <h3 className="font-bold text-slate-800 mb-1.5 line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {product.name}
                </h3>

                <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
                    {product.description || 'Premium quality packaging solution for your business.'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
                    <div>
                        <span className="text-lg font-bold text-slate-900">
                            ₹{product.price?.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">/unit</span>
                    </div>

                    {product.stock > 0 && product.stock <= 10 && (
                        <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                            Low Stock
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
