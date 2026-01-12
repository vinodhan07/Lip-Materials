import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Leaf, Palette, TrendingUp, Star, Shield, Truck, Sparkles } from 'lucide-react';
import { productsAPI, announcementsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const productsRes = await productsAPI.getAll({ limit: 6 });
            setProducts(productsRes.data.products.slice(0, 6));
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: Package,
            title: 'Premium Quality',
            description: 'High-grade materials ensuring durability and elegance for your luxury products.',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: Leaf,
            title: 'Eco-Friendly',
            description: 'Sustainable packaging solutions with biodegradable and recycled materials.',
            color: 'from-emerald-500 to-emerald-600',
        },
        {
            icon: Palette,
            title: 'Custom Designs',
            description: 'Personalized packaging with your brand colors, logo, and unique styling.',
            color: 'from-amber-500 to-amber-600',
        },
        {
            icon: TrendingUp,
            title: 'Bulk Orders',
            description: 'Competitive pricing for wholesale and bulk purchases with fast delivery.',
            color: 'from-blue-500 to-blue-600',
        },
    ];

    const stats = [
        { value: '10K+', label: 'Products Delivered' },
        { value: '500+', label: 'Happy Clients' },
        { value: '50+', label: 'Design Options' },
        { value: '99%', label: 'Satisfaction Rate' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-4s' }}></div>
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left animate-slide-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-purple-200 text-sm font-medium mb-6">
                                <Sparkles size={16} className="text-amber-400" />
                                Premium Packaging Solutions
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                Elevate Your Brand with
                                <span className="block mt-2 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                                    Premium Packaging
                                </span>
                            </h1>

                            <p className="text-lg text-purple-200/80 mb-8 max-w-xl mx-auto lg:mx-0">
                                Transform your lip products with our exquisite packaging solutions.
                                From luxury gift boxes to sustainable containers, we craft packaging that tells your brand story.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/products"
                                    className="btn btn-accent text-lg px-8 py-4"
                                >
                                    Explore Products
                                    <ArrowRight size={20} />
                                </Link>
                                <Link
                                    to="/contact"
                                    className="btn btn-ghost text-white border-2 border-white/30 hover:bg-white/10 px-8 py-4"
                                >
                                    Get Custom Quote
                                </Link>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                                {[Shield, Truck, Star].map((Icon, i) => (
                                    <div key={i} className="flex items-center gap-2 text-purple-300 text-sm">
                                        <Icon size={18} className="text-amber-400" />
                                        <span>{['Secure', 'Free Shipping', '5★ Rated'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image/3D Element */}
                        <div className="hidden lg:block relative">
                            <div className="relative w-full aspect-square">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-amber-500/20 rounded-3xl backdrop-blur-sm border border-white/10"></div>
                                <div className="absolute inset-4 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-center mb-6 animate-float">
                                            <Package size={48} className="text-white" />
                                        </div>
                                        <p className="text-white/60 text-sm">Premium Packaging Collection</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8f7ff" />
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-[#f8f7ff] py-8 -mt-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-[#f8f7ff]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                            Crafted with Excellence
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We're committed to providing the best packaging solutions that make your products stand out.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-purple-50 hover:border-purple-100"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="text-white" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
                        <div>
                            <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Our Collection</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Featured Products</h2>
                        </div>
                        <Link
                            to="/products"
                            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold group"
                        >
                            View All Products
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="spinner"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            No products available yet.
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Brand?
                    </h2>
                    <p className="text-purple-200 text-lg mb-10 max-w-2xl mx-auto">
                        Get custom packaging solutions tailored to your unique brand identity.
                        Let's create something extraordinary together.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="btn btn-accent text-lg px-8 py-4"
                        >
                            Start Your Project
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/products"
                            className="btn text-white border-2 border-white/30 hover:bg-white/10 px-8 py-4"
                        >
                            Browse Catalog
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
