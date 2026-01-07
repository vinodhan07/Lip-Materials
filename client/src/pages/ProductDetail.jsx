import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, Package, Check, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { productsAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const response = await productsAPI.getById(id);
            setProduct(response.data.product);
        } catch (error) {
            console.error('Failed to load product:', error);
            toast.error('Product not found');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        const result = await addToCart(product.id, quantity);
        if (result.success) {
            toast.success(`Added ${quantity} item(s) to cart!`);
        } else {
            toast.error(result.error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16 bg-gradient-to-b from-purple-50/50 to-white">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) return null;

    const imageUrl = product.image_url
        ? (product.image_url.startsWith('http') ? product.image_url : `${API_URL}${product.image_url}`)
        : 'https://via.placeholder.com/600x600?text=No+Image';

    const features = [
        { icon: Truck, text: 'Free shipping on orders over ₹500' },
        { icon: Shield, text: 'Quality guaranteed materials' },
        { icon: RotateCcw, text: '30-day return policy' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/products" className="hover:text-purple-600 transition-colors">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900">{product.name}</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 to-white border border-purple-100 shadow-xl shadow-purple-500/5">
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                                }}
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="lg:pl-8">
                        {/* Category */}
                        {product.category && (
                            <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
                                {product.category}
                            </span>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">(24 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                ₹{product.price?.toFixed(2)}
                            </span>
                            <span className="text-gray-500 ml-2">per unit</span>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description || 'Premium quality packaging solution designed to make your products stand out. Perfect for luxury lip care items with elegant finishing.'}
                        </p>

                        {/* Stock Status */}
                        <div className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-gray-50">
                            {product.stock > 0 ? (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Check className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-700">In Stock</p>
                                        <p className="text-sm text-gray-500">{product.stock} units available</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <Package className="text-red-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-red-700">Out of Stock</p>
                                        <p className="text-sm text-gray-500">Currently unavailable</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        {product.stock > 0 && (
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        className="p-4 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="px-8 py-4 min-w-[80px] text-center font-bold text-lg">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        disabled={quantity >= product.stock}
                                        className="p-4 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 btn btn-primary py-4 text-lg"
                                >
                                    <ShoppingCart size={22} />
                                    Add to Cart
                                </button>
                            </div>
                        )}

                        {/* Features */}
                        <div className="space-y-3">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3 text-gray-600">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                        <feature.icon size={18} className="text-purple-600" />
                                    </div>
                                    <span>{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* SKU */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                <span className="font-medium">SKU:</span> LIP-{String(product.id).padStart(4, '0')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
