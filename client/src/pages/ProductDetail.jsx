import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Package, Check, Star, Truck, Shield, RotateCcw, ShieldCheck, Heart, Share2, ChevronLeft, ChevronRight, Sparkles, Box, Info, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/products/ProductCard';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('description');

    const { addToCart } = useCartStore();
    const { isAuthenticated, isAdmin } = useAuthStore();

    useEffect(() => {
        loadProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const loadProduct = async () => {
        try {
            const response = await productsAPI.getById(id);
            setProduct(response.data.product);

            if (response.data.product?.category) {
                const relatedRes = await productsAPI.getAll({
                    category: response.data.product.category,
                    limit: 4
                });
                setRelatedProducts(
                    relatedRes.data.products.filter(p => p.id !== response.data.product.id).slice(0, 4)
                );
            }
        } catch (error) {
            console.error('Failed to load product:', error);
            toast.error('Product not found');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) return navigate('/login');
        if (isAdmin()) return toast.error('Admins cannot add items to cart');

        const result = await addToCart(product.id, quantity);
        if (result.success) toast.success(`Added ${quantity} item(s) to cart!`);
        else toast.error(result.error);
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) return navigate('/login?redirect=/checkout');
        if (isAdmin()) return toast.error('Admins cannot purchase products');

        const result = await addToCart(product.id, quantity);
        if (result.success) navigate('/cart');
        else toast.error(result.error);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return null;

    const images = product.image_url
        ? [product.image_url.startsWith('http') ? product.image_url : `${API_URL}${product.image_url}`]
        : ['https://placehold.co/600x600/f8f8f8/999?text=No+Image'];

    const userIsAdmin = isAuthenticated && isAdmin();
    const originalPrice = product.price * 1.2;
    const discountPercent = 20;

    const specifications = [
        { label: 'SKU', value: `PM-${String(product.id).padStart(4, '0')}` },
        { label: 'Category', value: product.category || 'General' },
        ...(userIsAdmin ? [{ label: 'Stock', value: `${product.stock} units` }] : []),
        { label: 'Material', value: 'Premium Grade' },
        { label: 'Durability', value: 'High Impact Resistance' },
        { label: 'Eco-Friendly', value: '100% Recyclable' },
    ];

    return (
        <div className="min-h-screen bg-white" style={{ paddingBottom: '5rem', paddingTop: '5rem' }}>
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center text-gray-500 hover:text-purple-600 transition-colors group"
                >
                    <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Products
                </button>
            </div>

            <div className="max-w-7xl mx-auto" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <div className="grid lg:grid-cols-12" style={{ gap: '3rem' }}>
                    {/* Left Column: Sticky Image Gallery (7 cols) */}
                    <div className="lg:col-span-7">
                        <div className="sticky" style={{ top: '7rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Main Image */}
                            <motion.div
                                layoutId={`product-image-${product.id}`}
                                className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group"
                            >
                                <img
                                    src={images[currentImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                                />
                                {product.stock <= 10 && product.stock > 0 && (
                                    <span className="absolute bg-red-500 text-white text-xs font-bold rounded-full animate-pulse" style={{ top: '1.5rem', left: '1.5rem', padding: '0.25rem 0.75rem' }}>
                                        Low Stock
                                    </span>
                                )}
                                <div className="absolute flex flex-col" style={{ top: '1.5rem', right: '1.5rem', gap: '0.75rem' }}>
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-red-500"
                                    >
                                        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </motion.div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex overflow-x-auto" style={{ gap: '1rem', paddingBottom: '0.5rem' }}>
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`relative w-24 h-24 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${currentImageIndex === idx ? 'border-purple-600 ring-2 ring-purple-100' : 'border-transparent hover:border-gray-200'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: details (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col h-full">
                        <div className="border-b border-gray-100" style={{ paddingBottom: '2rem', marginBottom: '2rem' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center" style={{ gap: '0.5rem', marginBottom: '1rem' }}
                            >
                                <span className="bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider" style={{ padding: '0.25rem 0.75rem' }}>
                                    {product.category || 'Packaging'}
                                </span>
                                <div className="flex items-center text-amber-400" style={{ gap: '0.25rem' }}>
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-gray-700 text-sm font-semibold">4.8</span>
                                    <span className="text-gray-400 text-sm">(124 reviews)</span>
                                </div>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl font-bold text-gray-900 leading-tight" style={{ marginBottom: '1rem' }}
                            >
                                {product.name}
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-baseline" style={{ gap: '1rem', marginBottom: '1.5rem' }}
                            >
                                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900">
                                    ₹{product.price?.toFixed(0)}
                                </span>
                                <div className="flex flex-col items-start">
                                    <span className="text-gray-400 line-through text-lg">₹{originalPrice.toFixed(0)}</span>
                                    <span className="text-green-600 text-sm font-bold bg-green-50 rounded" style={{ padding: '0.125rem 0.5rem' }}>
                                        Save {discountPercent}%
                                    </span>
                                </div>
                            </motion.div>

                            <p className="text-gray-600 leading-relaxed text-lg">
                                {product.description || 'Elevate your brand with our premium packaging solutions. Designed for durability and aesthetics, ensuring your products arrive in style.'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div style={{ marginBottom: '2rem' }}>
                            {product.stock > 0 && !userIsAdmin ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100" style={{ gap: '1rem', padding: '1rem' }}>
                                        <span className="text-gray-700 font-medium">Quantity:</span>
                                        <div className="flex items-center bg-white rounded-xl border border-gray-200" style={{ gap: '0.75rem', padding: '0.25rem' }}>
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                disabled={quantity >= product.stock}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-500 ml-auto">
                                            Total: <span className="font-bold text-gray-900">₹{(product.price * quantity).toFixed(0)}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                                        <button
                                            onClick={handleAddToCart}
                                            className="font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-all flex items-center justify-center rounded-xl"
                                            style={{ gap: '0.5rem', paddingTop: '1rem', paddingBottom: '1rem' }}
                                        >
                                            <ShoppingCart size={20} />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            className="font-bold text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center rounded-xl"
                                            style={{ gap: '0.5rem', paddingTop: '1rem', paddingBottom: '1rem' }}
                                        >
                                            Buy Now
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : product.stock <= 0 ? (
                                <div className="bg-red-50 rounded-2xl border border-red-100 text-center" style={{ padding: '1.5rem' }}>
                                    <span className="text-red-600 font-bold text-lg">Out of Stock</span>
                                    <p className="text-red-400 text-sm" style={{ marginTop: '0.25rem' }}>We're restocking soon!</p>
                                </div>
                            ) : (
                                <div className="bg-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center" style={{ padding: '1.5rem', gap: '0.5rem' }}>
                                    <ShieldCheck className="text-gray-500" />
                                    <span className="text-gray-600 font-medium">Admin View Mode</span>
                                </div>
                            )}
                        </div>

                        {/* Value Props */}
                        <div className="grid grid-cols-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                { icon: Truck, label: 'Fast Delivery', sub: '2-4 Days' },
                                { icon: Shield, label: 'Quality Check', sub: 'Verified' },
                                { icon: RotateCcw, label: 'Easy Returns', sub: '7 Days' },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center rounded-2xl bg-white border border-gray-100 shadow-sm" style={{ padding: '1rem' }}>
                                    <item.icon className="text-purple-600" size={24} style={{ marginBottom: '0.5rem' }} />
                                    <span className="text-sm font-bold text-gray-900">{item.label}</span>
                                    <span className="text-xs text-gray-500">{item.sub}</span>
                                </div>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div className="flex-1">
                            <div className="flex border-b border-gray-200" style={{ marginBottom: '1.5rem' }}>
                                {['description', 'specifications'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`font-medium text-sm capitalize transition-all relative ${activeTab === tab ? 'text-purple-700' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        style={{ paddingBottom: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-gray-50 rounded-2xl" style={{ padding: '1.5rem', minHeight: '200px' }}>
                                <AnimatePresence mode="wait">
                                    {activeTab === 'description' ? (
                                        <motion.div
                                            key="desc"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="text-gray-600 leading-relaxed"
                                            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                                        >
                                            <p>{product.description || 'No description available.'}</p>
                                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                                                <li className="flex items-center" style={{ gap: '0.5rem' }}><Check size={16} className="text-green-500" /> Premium finish</li>
                                                <li className="flex items-center" style={{ gap: '0.5rem' }}><Check size={16} className="text-green-500" /> Secure packaging</li>
                                                <li className="flex items-center" style={{ gap: '0.5rem' }}><Check size={16} className="text-green-500" /> Brand customizable</li>
                                            </ul>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="specs"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                        >
                                            <div className="divide-y divide-gray-200">
                                                {specifications.map((spec, i) => (
                                                    <div key={i} className="flex justify-between" style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
                                                        <span className="text-gray-500">{spec.label}</span>
                                                        <span className="font-medium text-gray-900">{spec.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div style={{ marginTop: '8rem', marginBottom: '5rem' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                        <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
                        <Link to="/products" className="text-purple-600 font-medium hover:underline flex items-center" style={{ gap: '0.25rem' }}>
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    {relatedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '2rem' }}>
                            {relatedProducts.map((relProduct) => (
                                <ProductCard key={relProduct.id} product={relProduct} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-gray-50 rounded-3xl" style={{ padding: '5rem 0' }}>
                            <Package size={48} className="mx-auto text-gray-300" style={{ marginBottom: '1rem' }} />
                            <p className="text-gray-500">No similar products found at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}
