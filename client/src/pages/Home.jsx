import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Package, Leaf, Palette,
    Star, Shield, Truck, Sparkles, CheckCircle,
    Zap, Award, Clock, Play
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 12 }
        },
    };

    const features = [
        {
            icon: Package,
            title: 'Premium Quality',
            description: 'Exquisite materials crafted for the discerning brand.',
            color: 'bg-violet-500',
        },
        {
            icon: Leaf,
            title: 'Eco-Conscious',
            description: 'Sustainable solutions for a greener tomorrow.',
            color: 'bg-emerald-500',
        },
        {
            icon: Palette,
            title: 'Bespoke Design',
            description: 'Tailored packaging that tells your unique story.',
            color: 'bg-amber-500',
        },
        {
            icon: Zap,
            title: 'Rapid Delivery',
            description: 'Swift fulfillment without compromising excellence.',
            color: 'bg-blue-500',
        },
    ];

    const stats = [
        { value: '500+', label: 'Global Brands', icon: Award },
        { value: '10M+', label: 'Units Shipped', icon: Package },
        { value: '48hr', label: 'Turnaround', icon: Clock },
        { value: '99.9%', label: 'Satisfaction', icon: Star },
    ];

    const testimonials = [
        {
            quote: "LIP Packaging transformed our product presentation. The quality is unmatched.",
            author: "Sarah Chen",
            role: "Founder, Luxe Cosmetics",
            initials: "SC",
        },
        {
            quote: "Their custom designs helped us stand out in a crowded market. Truly exceptional.",
            author: "Michael Torres",
            role: "CEO, Bella Beauty",
            initials: "MT",
        },
        {
            quote: "Fast, reliable, and the packaging quality exceeded our expectations.",
            author: "Emma Williams",
            role: "Director, Glow Labs",
            initials: "EW",
        },
    ];

    const processSteps = [
        { step: '01', title: 'Consult', desc: 'Share your vision with our experts' },
        { step: '02', title: 'Design', desc: 'We craft bespoke packaging concepts' },
        { step: '03', title: 'Produce', desc: 'Precision manufacturing at scale' },
        { step: '04', title: 'Deliver', desc: 'Global shipping, on time, every time' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0612] text-white">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[120px]" />
            </div>

            {/* ===== HERO SECTION ===== */}
            <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-16">
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10"
                >
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center lg:text-left"
                        >
                            {/* Badge */}
                            <motion.div
                                variants={itemVariants}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm mb-6"
                            >
                                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                                <span className="text-gold-400 font-medium">AI-Powered Premium Packaging</span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Packaging That
                                <span className="block bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 bg-clip-text text-transparent">
                                    Speaks Luxury
                                </span>
                            </motion.h1>

                            {/* Description */}
                            <motion.p variants={itemVariants} className="text-lg text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
                                Transform your lip products with exquisite packaging. From concept to delivery, we craft premium solutions that define brands.
                            </motion.p>

                            {/* CTAs */}
                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/products"
                                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-amber-500 text-[#0a0612] font-bold rounded-xl hover:shadow-lg hover:shadow-gold-500/25 transition-all"
                                >
                                    Explore Collection
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
                                >
                                    <Play size={16} className="text-gold-400" />
                                    Watch Demo
                                </Link>
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div variants={itemVariants} className="mt-10 pt-6 border-t border-white/10">
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                                    {[
                                        { icon: Shield, text: 'Secure Payments' },
                                        { icon: Truck, text: 'Global Shipping' },
                                        { icon: Star, text: '5-Star Rated' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                            <item.icon size={16} className="text-gold-500" />
                                            <span>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right: Dashboard Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative">
                                {/* Main Card */}
                                <div className="bg-[#1a1225]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                                                <Sparkles size={16} className="text-[#0a0612]" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-white">LIP Dashboard</div>
                                                <div className="text-xs text-gray-500">Enterprise</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                        </div>
                                    </div>

                                    {/* Order Card */}
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                                    <Package size={16} className="text-violet-400" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">Order #LIP-2847</div>
                                                    <div className="text-xs text-gold-400 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                                                        In Production
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white">₹24,500</div>
                                                <div className="text-xs text-gray-500">1,000 units</div>
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-gold-500 to-amber-400 rounded-full"
                                                initial={{ width: "0%" }}
                                                animate={{ width: "75%" }}
                                                transition={{ duration: 1.2, delay: 0.8 }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="text-xl font-bold text-white">156</div>
                                            <div className="text-xs text-gray-400">Orders This Month</div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                            <div className="text-xl font-bold text-emerald-400">+28%</div>
                                            <div className="text-xs text-gray-400">Growth Rate</div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="p-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity">
                                        <div>
                                            <div className="text-[#0a0612] font-bold">New Collection</div>
                                            <div className="text-[#0a0612]/70 text-sm">Luxury Matte Series</div>
                                        </div>
                                        <ArrowRight size={18} className="text-[#0a0612]" />
                                    </div>
                                </div>

                                {/* Floating Badge - Top Right */}
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 -right-4 bg-[#1a1225]/95 backdrop-blur-xl p-3 rounded-xl border border-white/10 shadow-xl"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle size={16} className="text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium text-sm">Quality Verified</div>
                                            <div className="text-xs text-gray-500">ISO Certified</div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Badge - Bottom Left */}
                                <motion.div
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-4 -left-4 bg-[#1a1225]/95 backdrop-blur-xl p-3 rounded-xl border border-white/10 shadow-xl"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-1.5">
                                            <div className="w-6 h-6 rounded-full bg-red-400 border-2 border-[#1a1225]" />
                                            <div className="w-6 h-6 rounded-full bg-teal-400 border-2 border-[#1a1225]" />
                                            <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-[#1a1225]" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium text-sm">500+ Brands</div>
                                            <div className="text-xs text-gray-500">Trust Us</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* ===== STATS SECTION ===== */}
            <section className="py-16 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-5 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/8 transition-colors"
                            >
                                <stat.icon className="mx-auto mb-2 text-gold-500" size={22} />
                                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium mb-3">
                            Why Choose Us
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Crafted for Excellence</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Where precision engineering meets artistic vision.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-6 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                            >
                                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                                    <feature.icon className="text-white" size={22} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PROCESS SECTION ===== */}
            <section className="py-20 relative z-10 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-3">
                            Our Process
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">From Vision to Reality</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            A seamless journey to your perfect packaging.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {processSteps.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center lg:text-left"
                            >
                                <div className="text-5xl font-bold text-white/10 mb-2">{item.step}</div>
                                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-gray-500 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS SECTION ===== */}
            <section className="py-20 relative z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
                            Testimonials
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Loved by Brands</h2>
                    </motion.div>

                    <div className="relative min-h-[180px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTestimonial}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4 }}
                                className="text-center"
                            >
                                <p className="text-xl text-gray-300 mb-6 italic leading-relaxed">
                                    "{testimonials[activeTestimonial].quote}"
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-[#0a0612] font-bold text-sm">
                                        {testimonials[activeTestimonial].initials}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-white font-medium text-sm">{testimonials[activeTestimonial].author}</div>
                                        <div className="text-gray-500 text-xs">{testimonials[activeTestimonial].role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTestimonial(i)}
                                className={`h-2 rounded-full transition-all ${i === activeTestimonial ? 'bg-gold-500 w-6' : 'bg-white/20 w-2 hover:bg-white/30'}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PRODUCTS SECTION ===== */}
            <section className="py-20 relative z-10 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium mb-2">
                                Featured
                            </span>
                            <h2 className="text-3xl font-bold text-white">Curated Collection</h2>
                        </div>
                        <Link
                            to="/products"
                            className="group flex items-center gap-2 text-gold-400 hover:text-white transition-colors text-sm font-medium"
                        >
                            View All Products
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div className="w-10 h-10 border-3 border-gold-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                            No products available yet.
                        </div>
                    )}
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-24 relative z-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Ready to Elevate<br />Your Brand?
                        </h2>
                        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                            Join 500+ brands who trust LIP Packaging for their premium packaging needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-amber-500 text-[#0a0612] font-bold rounded-xl hover:shadow-lg hover:shadow-gold-500/25 transition-all"
                            >
                                Get Started Free
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
                            >
                                Talk to Sales
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
