import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, Bell,
    LogOut, Menu, X, ChevronRight, Home, Sparkles
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuthStore();

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/announcements', icon: Bell, label: 'Announcements' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 via-gray-900 to-purple-900 text-white transition-all duration-300 z-40 shadow-2xl ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-20 px-4 border-b border-white/10">
                    {sidebarOpen && (
                        <Link to="/admin" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <Sparkles className="text-white" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white">LIP Admin</span>
                                <span className="text-[10px] text-purple-300 -mt-1 tracking-wider">DASHBOARD</span>
                            </div>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isActive(item.path, item.exact)
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/10 hover:text-white rounded-xl transition-all"
                    >
                        <Home size={20} />
                        {sidebarOpen && <span>Back to Site</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Bar */}
                <header className="bg-white/80 backdrop-blur-md h-20 border-b border-purple-100 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Link to="/admin" className="hover:text-purple-600 transition-colors">Admin</Link>
                        {location.pathname !== '/admin' && (
                            <>
                                <ChevronRight size={16} />
                                <span className="text-gray-900 font-semibold">
                                    {navItems.find(item => isActive(item.path) && !item.exact)?.label || 'Dashboard'}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, <span className="font-semibold text-gray-900">{user?.name}</span></span>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <span className="text-white font-bold">{user?.name?.[0]}</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
