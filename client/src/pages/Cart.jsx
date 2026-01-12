import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Sparkles, Shield, Truck } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Cart() {
    const { items, total, isLoading, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        setUpdating(itemId);
        const result = await updateQuantity(itemId, newQuantity);
        if (!result.success) {
            toast.error(result.error);
        }
        setUpdating(null);
    };

    const handleRemove = async (itemId) => {
        const result = await removeItem(itemId);
        if (result.success) {
            toast.success('Item removed from cart');
        } else {
            toast.error(result.error);
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            const result = await clearCart();
            if (result.success) {
                toast.success('Cart cleared');
            }
        }
    };

    const gst = total * 0.18;
    const grandTotal = total + gst;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white flex items-center justify-center" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
                <div className="text-center">
                    <div className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center" style={{ margin: '0 auto 24px' }}>
                        <ShoppingBag size={40} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Please login to view your cart</h2>
                    <p className="text-gray-600" style={{ marginBottom: '32px' }}>Sign in to add items and manage your cart</p>
                    <Link to="/login" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg" style={{ gap: '8px', padding: '14px 28px' }}>
                        Sign In
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white flex items-center justify-center" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white flex items-center justify-center" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
                <div className="text-center">
                    <div className="w-24 h-24 bg-purple-100 rounded-2xl flex items-center justify-center" style={{ margin: '0 auto 24px' }}>
                        <ShoppingBag size={40} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>Your cart is empty</h2>
                    <p className="text-gray-600" style={{ marginBottom: '32px' }}>Start shopping to add items to your cart</p>
                    <Link to="/products" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg" style={{ gap: '8px', padding: '14px 28px' }}>
                        Browse Products
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white">
            {/* Fixed Header */}
            <div className="fixed top-16 lg:top-20 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-purple-100 z-40" style={{ padding: '16px 0' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                            <p className="text-gray-500 text-sm">{items.length} item(s) in your cart</p>
                        </div>
                        <button
                            onClick={handleClearCart}
                            className="text-red-500 hover:text-red-600 text-sm font-medium hover:bg-red-50 rounded-xl transition-all"
                            style={{ padding: '8px 16px' }}
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '160px 24px 48px' }}>
                <div className="grid lg:grid-cols-3" style={{ gap: '32px' }}>
                    {/* Cart Items - Scrollable */}
                    <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {items.map((item) => {
                            const imageUrl = item.image_url
                                ? (item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`)
                                : 'https://placehold.co/100x100/EEE/999?text=No+Image';

                            return (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-purple-50 hover:shadow-lg hover:shadow-purple-500/5 transition-all" style={{ padding: '24px' }}>
                                    <div className="flex" style={{ gap: '20px' }}>
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-xl bg-purple-50"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/100x100/EEE/999?text=No+Image';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <Link
                                                to={`/products/${item.product_id}`}
                                                className="font-bold text-gray-900 hover:text-purple-600 transition-colors text-lg"
                                            >
                                                {item.name}
                                            </Link>
                                            <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent" style={{ marginTop: '4px' }}>
                                                ₹{item.price?.toFixed(2)}
                                            </p>

                                            <div className="flex items-center justify-between" style={{ marginTop: '16px' }}>
                                                <div className="flex items-center" style={{ gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        disabled={updating === item.id || item.quantity <= 1}
                                                        className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-10 text-center font-bold">
                                                        {updating === item.id ? <Loader2 size={14} className="animate-spin" style={{ margin: '0 auto' }} /> : item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        disabled={updating === item.id || item.quantity >= item.stock}
                                                        className="w-9 h-9 flex items-center justify-center border-2 border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center" style={{ gap: '16px' }}>
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRemove(item.id)}
                                                        className="text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        style={{ padding: '8px' }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary - Fixed on Desktop */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 lg:sticky" style={{ padding: '24px', top: '160px' }}>
                            <h2 className="text-xl font-bold text-gray-900" style={{ marginBottom: '24px' }}>Order Summary</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({items.length} items)</span>
                                    <span className="font-medium">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (18%)</span>
                                    <span className="font-medium">₹{gst.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-purple-100" style={{ paddingTop: '16px' }}>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                            ₹{grandTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div style={{ marginBottom: '24px' }}>
                                <div className="flex" style={{ gap: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        style={{ padding: '12px' }}
                                    />
                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all" style={{ padding: '12px 16px' }}>Apply</button>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center"
                                style={{ padding: '16px', marginBottom: '16px', gap: '8px' }}
                            >
                                Proceed to Checkout
                                <ArrowRight size={20} />
                            </button>

                            <Link
                                to="/products"
                                className="block text-center text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Continue Shopping
                            </Link>

                            {/* Trust Badges */}
                            <div className="border-t border-purple-100" style={{ marginTop: '24px', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div className="flex items-center text-sm text-gray-500" style={{ gap: '10px' }}>
                                        <Shield size={16} className="text-green-500" />
                                        <span>Secure checkout with SSL encryption</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500" style={{ gap: '10px' }}>
                                        <Truck size={16} className="text-purple-500" />
                                        <span>Free shipping on orders above ₹2000</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500" style={{ gap: '10px' }}>
                                        <Sparkles size={16} className="text-amber-500" />
                                        <span>Premium quality guaranteed</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
