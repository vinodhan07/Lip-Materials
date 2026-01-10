import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, Bell,
    LogOut, ChevronRight, Home, Sparkles, ChevronLeft
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function AdminLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

    const sidebarWidth = sidebarCollapsed ? '80px' : '280px';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Fixed Sidebar */}
            <aside
                style={{ width: sidebarWidth }}
                className="fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-out flex flex-col bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl"
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-between px-5 border-b border-white/10 flex-shrink-0">
                    {!sidebarCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                                <Sparkles className="text-white" size={20} />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-white">LIP ADMIN</h1>
                                <p className="text-[10px] text-amber-400 font-medium tracking-widest">PREMIUM</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all ${sidebarCollapsed ? 'mx-auto' : ''}`}
                    >
                        {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = isActive(item.path, item.exact);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                                        : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                    } ${sidebarCollapsed ? 'justify-center px-3' : ''}`}
                                title={sidebarCollapsed ? item.label : ''}
                            >
                                <item.icon size={20} className="flex-shrink-0" />
                                {!sidebarCollapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-white/10 flex-shrink-0">
                    <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                            <span className="font-bold text-white text-sm">{user?.name?.[0]}</span>
                        </div>

                        {!sidebarCollapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                                    <p className="text-xs text-slate-400">Admin</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area - Offset by Sidebar Width */}
            <div
                style={{ marginLeft: sidebarWidth }}
                className="min-h-screen transition-all duration-300"
            >
                {/* Top Header Bar */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
                    <div className="px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-slate-800">
                                {navItems.find(item => isActive(item.path, item.exact))?.label || 'Dashboard'}
                            </h2>
                            <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            </button>
                            <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                                <Home size={16} />
                                View Site
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content with Proper Padding */}
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
