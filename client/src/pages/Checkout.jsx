import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, Loader2, MapPin, Phone, User, ArrowLeft, Shield } from 'lucide-react';
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
            <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white pt-20 pb-12 flex items-center justify-center">
                <div className="text-center bg-white rounded-3xl p-10 shadow-xl shadow-purple-500/5 max-w-md mx-4 border border-purple-100">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
                        <CheckCircle className="text-white" size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Placed!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for your order. We'll send you an email confirmation shortly.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full btn btn-primary py-4"
                        >
                            View My Orders
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="w-full btn btn-secondary py-4"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => step === 1 ? navigate('/cart') : setStep(1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    {step === 1 ? 'Back to Cart' : 'Back to Shipping'}
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${step >= 1 ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-200 text-gray-500'}`}>
                            <Truck size={20} />
                        </div>
                        <span className={`ml-3 font-semibold ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Shipping</span>
                    </div>
                    <div className={`w-20 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gray-200'}`}></div>
                    <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${step >= 2 ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-200 text-gray-500'}`}>
                            <CreditCard size={20} />
                        </div>
                        <span className={`ml-3 font-semibold ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Payment</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-50">
                            {step === 1 && (
                                <>
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                        <MapPin className="text-purple-600" size={24} />
                                        Shipping Details
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="input pl-12"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="input pl-12"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="input"
                                                rows="3"
                                                placeholder="Street address, building, floor..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="Mumbai"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="Maharashtra"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="400001"
                                                maxLength="6"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => validateForm() && setStep(2)}
                                        className="w-full btn btn-primary mt-8 py-4"
                                    >
                                        Continue to Payment
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                        <CreditCard className="text-purple-600" size={24} />
                                        Payment Method
                                    </h2>
                                    <div className="space-y-4">
                                        <label className="flex items-center p-5 border-2 border-purple-200 rounded-xl cursor-pointer hover:bg-purple-50 bg-purple-50 transition-all">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={formData.paymentMethod === 'cod'}
                                                onChange={handleChange}
                                                className="w-5 h-5 text-purple-600"
                                            />
                                            <div className="ml-4">
                                                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                                                <p className="text-sm text-gray-500">Pay when your order arrives</p>
                                            </div>
                                        </label>
                                        <label className="flex items-center p-5 border-2 border-gray-200 rounded-xl cursor-not-allowed opacity-60">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="online"
                                                disabled
                                                className="w-5 h-5"
                                            />
                                            <div className="ml-4">
                                                <p className="font-semibold text-gray-700">Online Payment</p>
                                                <p className="text-sm text-gray-500">Coming soon - UPI, Cards, Net Banking</p>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="flex gap-4 mt-8">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 btn btn-secondary py-4"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className="flex-1 btn btn-primary py-4 flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Place Order'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-50 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                                        <span className="text-gray-600 flex-1">{item.name} × {item.quantity}</span>
                                        <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-purple-100 pt-4 space-y-3">
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
                                <div className="border-t border-purple-100 pt-3">
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                            ₹{grandTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-6 pt-6 border-t border-purple-100">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Shield size={16} className="text-green-500" />
                                    <span>Secure checkout - Your data is protected</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
