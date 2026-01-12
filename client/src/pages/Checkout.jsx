import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, Loader2, MapPin, Phone, User, ArrowLeft, Shield, Package, Sparkles } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
    const { items, total, fetchCart } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        paymentMethod: 'cod',
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [isAuthenticated, navigate, fetchCart]);

    useEffect(() => {
        if (items.length === 0 && step !== 3) {
            navigate('/cart');
        }
    }, [items, step, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { name, phone, address, city, state, pincode } = formData;
        if (!name || !phone || !address || !city || !state || !pincode) {
            toast.error('Please fill in all shipping details');
            return false;
        }
        if (phone.length < 10) {
            toast.error('Please enter a valid phone number');
            return false;
        }
        if (pincode.length !== 6) {
            toast.error('Please enter a valid 6-digit pincode');
            return false;
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.product_id,
                    quantity: item.quantity,
                })),
                shippingDetails: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                },
                paymentMethod: formData.paymentMethod,
            };

            await ordersAPI.create(orderData);
            setStep(3);
            toast.success('Order placed successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const gst = total * 0.18;
    const grandTotal = total + gst;

    // Success Screen
    if (step === 3) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white flex items-center justify-center" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
                <div className="text-center bg-white rounded-3xl shadow-xl shadow-purple-500/5 border border-purple-100" style={{ padding: '48px', maxWidth: '480px', margin: '0 16px' }}>
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30" style={{ margin: '0 auto 32px' }}>
                        <CheckCircle className="text-white" size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '12px' }}>Order Placed!</h2>
                    <p className="text-gray-600" style={{ marginBottom: '32px' }}>
                        Thank you for your order. We'll send you an email confirmation shortly.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg"
                            style={{ padding: '16px' }}
                        >
                            View My Orders
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
                            style={{ padding: '16px' }}
                        >
                            Continue Shopping
                        </button>
                    </div>
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
                        <button
                            onClick={() => step === 1 ? navigate('/cart') : setStep(1)}
                            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                            style={{ gap: '8px' }}
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">{step === 1 ? 'Back to Cart' : 'Back to Shipping'}</span>
                        </button>

                        {/* Progress Steps */}
                        <div className="hidden md:flex items-center" style={{ gap: '8px' }}>
                            <div className="flex items-center" style={{ gap: '8px' }}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${step >= 1 ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-200 text-gray-500'}`}>
                                    <Truck size={18} />
                                </div>
                                <span className={`font-medium text-sm ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Shipping</span>
                            </div>
                            <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-purple-600 to-amber-500' : 'bg-gray-200'}`}></div>
                            <div className="flex items-center" style={{ gap: '8px' }}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${step >= 2 ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-gray-200 text-gray-500'}`}>
                                    <CreditCard size={18} />
                                </div>
                                <span className={`font-medium text-sm ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Payment</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-sm text-gray-500">Step {step} of 2</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '160px 24px 48px' }}>
                <div className="grid lg:grid-cols-3" style={{ gap: '32px' }}>
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-purple-100" style={{ padding: '32px' }}>
                            {step === 1 && (
                                <>
                                    <h2 className="text-xl font-bold flex items-center" style={{ marginBottom: '24px', gap: '12px' }}>
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                            <MapPin className="text-purple-600" size={20} />
                                        </div>
                                        Shipping Details
                                    </h2>
                                    <div className="grid md:grid-cols-2" style={{ gap: '20px' }}>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    style={{ padding: '14px 14px 14px 48px' }}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    style={{ padding: '14px 14px 14px 48px' }}
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>Address</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                                rows="3"
                                                style={{ padding: '14px' }}
                                                placeholder="Street address, building, floor..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                style={{ padding: '14px' }}
                                                placeholder="Chennai"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                style={{ padding: '14px' }}
                                                placeholder="Tamil Nadu"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '8px' }}>Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                style={{ padding: '14px' }}
                                                placeholder="600001"
                                                maxLength="6"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => validateForm() && setStep(2)}
                                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center"
                                        style={{ marginTop: '32px', padding: '16px', gap: '8px' }}
                                    >
                                        Continue to Payment
                                        <CreditCard size={18} />
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <h2 className="text-xl font-bold flex items-center" style={{ marginBottom: '24px', gap: '12px' }}>
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                            <CreditCard className="text-amber-600" size={20} />
                                        </div>
                                        Payment Method
                                    </h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <label className={`flex items-center border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`} style={{ padding: '20px' }}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-purple-600"
                                            />
                                            <div style={{ marginLeft: '16px' }}>
                                                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                                                <p className="text-sm text-gray-500">Pay when your order arrives</p>
                                            </div>
                                            <div className="bg-green-100 text-green-700 text-xs font-bold rounded-lg" style={{ marginLeft: 'auto', padding: '4px 10px' }}>
                                                Available
                                            </div>
                                        </label>
                                        <label className="flex items-center border-2 border-gray-200 rounded-xl cursor-not-allowed opacity-60" style={{ padding: '20px' }}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="online"
                                                disabled
                                                className="w-5 h-5"
                                            />
                                            <div style={{ marginLeft: '16px' }}>
                                                <p className="font-semibold text-gray-700">Online Payment</p>
                                                <p className="text-sm text-gray-500">UPI, Cards, Net Banking</p>
                                            </div>
                                            <div className="bg-gray-100 text-gray-500 text-xs font-bold rounded-lg" style={{ marginLeft: 'auto', padding: '4px 10px' }}>
                                                Coming Soon
                                            </div>
                                        </label>
                                    </div>

                                    {/* Shipping Address Summary */}
                                    <div className="bg-gray-50 rounded-xl border border-gray-200" style={{ marginTop: '24px', padding: '20px' }}>
                                        <h4 className="font-semibold text-gray-800" style={{ marginBottom: '12px' }}>Shipping To:</h4>
                                        <p className="text-gray-600">{formData.name}</p>
                                        <p className="text-gray-600">{formData.address}</p>
                                        <p className="text-gray-600">{formData.city}, {formData.state} - {formData.pincode}</p>
                                        <p className="text-gray-600">Phone: {formData.phone}</p>
                                    </div>

                                    <div className="flex" style={{ gap: '16px', marginTop: '32px' }}>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                                            style={{ padding: '16px' }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center"
                                            style={{ padding: '16px', gap: '8px' }}
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                                <>
                                                    Place Order
                                                    <CheckCircle size={18} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Order Summary - Fixed on Desktop */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 lg:sticky" style={{ padding: '24px', top: '160px' }}>
                            <h2 className="text-xl font-bold text-gray-900" style={{ marginBottom: '24px' }}>Order Summary</h2>

                            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm border-b border-gray-100 last:border-0" style={{ padding: '12px 0' }}>
                                        <div className="flex items-center" style={{ gap: '12px' }}>
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Package size={16} className="text-purple-600" />
                                            </div>
                                            <div>
                                                <span className="text-gray-800 font-medium block">{item.name}</span>
                                                <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-purple-100" style={{ paddingTop: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
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
                                    <div className="border-t border-purple-100" style={{ paddingTop: '12px' }}>
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total</span>
                                            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                                ₹{grandTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="border-t border-purple-100" style={{ marginTop: '24px', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div className="flex items-center text-sm text-gray-500" style={{ gap: '10px' }}>
                                        <Shield size={16} className="text-green-500" />
                                        <span>Secure checkout</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500" style={{ gap: '10px' }}>
                                        <Truck size={16} className="text-purple-500" />
                                        <span>Free shipping on orders above ₹2000</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500" style={{ gap: '10px' }}>
                                        <Sparkles size={16} className="text-amber-500" />
                                        <span>Quality guaranteed</span>
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
