import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, Sparkles } from 'lucide-react';
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
            <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white pt-20 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                        <ShoppingBag size={40} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Please login to view your cart</h2>
                    <p className="text-gray-600 mb-8">Sign in to add items and manage your cart</p>
                    <Link to="/login" className="btn btn-primary">
                        Sign In
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white pt-20 pb-12 flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white pt-20 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                        <ShoppingBag size={40} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
                    <Link to="/products" className="btn btn-primary">
                        Browse Products
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="text-gray-500 mt-1">{items.length} item(s) in your cart</p>
                    </div>
                    <button
                        onClick={handleClearCart}
                        className="text-red-500 hover:text-red-600 text-sm font-medium hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const imageUrl = item.image_url
                                ? (item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`)
                                : 'https://placehold.co/100x100/EEE/999?text=No+Image';

                            return (
                                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 hover:shadow-lg hover:shadow-purple-500/5 transition-all">
                                    <div className="flex gap-6">
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            className="w-28 h-28 object-cover rounded-xl bg-purple-50"
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
                                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mt-1">
                                                ₹{item.price?.toFixed(2)}
                                            </p>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        disabled={updating === item.id || item.quantity <= 1}
                                                        className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-all"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-12 text-center font-bold text-lg">
                                                        {updating === item.id ? <Loader2 size={16} className="animate-spin mx-auto" /> : item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        disabled={updating === item.id || item.quantity >= item.stock}
                                                        className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-all"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <span className="text-xl font-bold text-gray-900">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRemove(item.id)}
                                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
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
                                <div className="border-t border-purple-100 pt-4">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                            ₹{grandTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        className="flex-1 input py-3"
                                    />
                                    <button className="btn btn-secondary px-4">Apply</button>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full btn btn-primary py-4 text-lg mb-4"
                            >
                                Checkout
                                <ArrowRight size={20} />
                            </button>

                            <Link
                                to="/products"
                                className="block text-center text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Continue Shopping
                            </Link>

                            {/* Trust Badge */}
                            <div className="mt-6 pt-6 border-t border-purple-100">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Sparkles size={16} className="text-amber-500" />
                                    <span>Secure checkout with SSL encryption</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
