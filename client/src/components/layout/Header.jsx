import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
    const { items, fetchCart } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated, fetchCart]);

    const cartItemCount = items.reduce((count, item) => count + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? 'bg-luxury-900/90 backdrop-blur-md shadow-lg shadow-black/10'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/40 transition-all">
                            <Sparkles className="text-luxury-900" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-white">
                                LIP
                            </span>
                            <span className="text-[10px] text-gold-400 -mt-1 font-medium tracking-wider">PACKAGING</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="relative px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/cart"
                                    className="relative p-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <ShoppingCart size={22} />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 text-luxury-900 text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>

                                {isAdmin() && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all shadow-lg hover:shadow-xl border border-white/10"
                                    >
                                        <LayoutDashboard size={18} />
                                        <span className="font-medium">Admin</span>
                                    </Link>
                                )}

                                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                                    <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
                                            <User size={18} className="text-gold-400" />
                                        </div>
                                        <span className="font-medium text-sm">{user?.name?.split(' ')[0]}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                        title="Logout"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-luxury-900 font-bold rounded-xl transition-all shadow-lg shadow-gold-500/20"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-white/10 bg-luxury-900 animate-slide-up rounded-b-2xl shadow-xl">
                        <nav className="flex flex-col gap-1 px-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/cart"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 font-medium"
                                    >
                                        <ShoppingCart size={18} />
                                        Cart {cartItemCount > 0 && <span className="px-2 py-0.5 bg-gold-500 text-luxury-900 text-xs font-bold rounded-full">{cartItemCount}</span>}
                                    </Link>
                                    {isAdmin() && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-3 font-medium"
                                        >
                                            <LayoutDashboard size={18} />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 font-medium text-left w-full"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-white/10">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="mx-4 py-3 bg-gold-500 text-luxury-900 font-bold rounded-xl text-center"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
