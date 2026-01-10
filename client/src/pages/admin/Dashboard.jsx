import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, Clock, ArrowRight, Activity, Box, Sparkles, Calendar, Filter } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import RevenueChart from '../../components/admin/RevenueChart';
import CategoryChart from '../../components/admin/CategoryChart';

// Skeleton Loader Component
function SkeletonCard() {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                <div className="w-16 h-6 rounded-full bg-slate-200" />
            </div>
            <div className="h-8 w-24 bg-slate-200 rounded-lg mb-2" />
            <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
    );
}

function SkeletonChart() {
    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse">
            <div className="h-6 w-40 bg-slate-200 rounded mb-2" />
            <div className="h-4 w-32 bg-slate-100 rounded mb-6" />
            <div className="h-64 bg-slate-100 rounded-xl" />
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('week');

    useEffect(() => {
        loadDashboardData();
    }, [dateFilter]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, ordersRes] = await Promise.all([
                ordersAPI.getStats(),
                ordersAPI.getAll({ limit: 5 }),
            ]);
            setStats(statsRes.data.stats);
            setRecentOrders(ordersRes.data.orders);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            icon: DollarSign,
            label: 'Total Revenue',
            value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
            trend: '+12.5%',
            trendUp: true,
            color: 'from-emerald-400 to-teal-500',
            shadow: 'shadow-emerald-500/20'
        },
        {
            icon: ShoppingCart,
            label: 'Total Orders',
            value: stats.totalOrders,
            trend: '+8.2%',
            trendUp: true,
            color: 'from-blue-400 to-indigo-500',
            shadow: 'shadow-blue-500/20'
        },
        {
            icon: Clock,
            label: 'Pending',
            value: stats.pendingOrders,
            trend: 'Action needed',
            trendUp: false,
            color: 'from-amber-400 to-orange-500',
            shadow: 'shadow-amber-500/20'
        },
        {
            icon: Package,
            label: 'Products',
            value: stats.totalProducts,
            trend: 'In Stock',
            trendUp: true,
            color: 'from-purple-400 to-fuchsia-500',
            shadow: 'shadow-purple-500/20'
        },
    ];

    return (
        <div className="space-y-10 pb-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className={`relative overflow-hidden bg-white rounded-3xl p-6 shadow-lg ${stat.shadow} hover:-translate-y-1 transition-all duration-300 border border-slate-100`}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl`} />

                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} p-[1px]`}>
                                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                                        <stat.icon className="text-slate-700" size={20} />
                                    </div>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {stat.trend}
                                </span>
                            </div>

                            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
                            <p className="text-slate-500 font-medium mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Charts Section with Period Filter */}
            <div className="space-y-4">
                {/* Section Header with Date Filter */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Analytics Overview</h2>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                        {[
                            { key: 'today', label: 'Today' },
                            { key: 'week', label: 'This Week' },
                            { key: 'month', label: 'This Month' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setDateFilter(key)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${dateFilter === key
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Charts Grid */}
                {loading ? (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2"><SkeletonChart /></div>
                        <SkeletonChart />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <RevenueChart />
                        </div>
                        <CategoryChart />
                    </div>
                )}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Area - Recent Orders */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-800">Recent Orders</h3>
                            <Link to="/admin/orders" className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1 group">
                                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-purple-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">#{order.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">
                                                        {order.user_name?.[0] || 'G'}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">{order.user_name || 'Guest'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{order.total?.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${order.status === 'completed' || order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {recentOrders.length === 0 && (
                            <div className="p-12 text-center text-slate-400">
                                <Box size={48} className="mx-auto mb-3 opacity-20" />
                                <p>No orders to display yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Side Panel - Quick Actions */}
                <div className="space-y-6">
                    {/* Quick Actions Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="text-amber-400" size={20} />
                                <h3 className="font-bold">Quick Actions</h3>
                            </div>

                            <div className="space-y-3">
                                <Link to="/admin/products" className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all">
                                    <Box size={18} className="text-purple-300" />
                                    <span className="text-sm font-medium">Add New Product</span>
                                </Link>
                                <Link to="/admin/orders" className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all">
                                    <ShoppingCart size={18} className="text-blue-300" />
                                    <span className="text-sm font-medium">Process Orders</span>
                                </Link>
                                <Link to="/admin/announcements" className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all">
                                    <TrendingUp size={18} className="text-green-300" />
                                    <span className="text-sm font-medium">Create Promo</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Store Health */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Store Health</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <Users size={18} className="text-indigo-600" />
                                    </div>
                                    <span className="text-sm text-slate-600">Customers</span>
                                </div>
                                <span className="font-bold text-slate-800">{stats.totalUsers}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-fuchsia-50 flex items-center justify-center">
                                        <Activity size={18} className="text-fuchsia-600" />
                                    </div>
                                    <span className="text-sm text-slate-600">Conversion</span>
                                </div>
                                <span className="font-bold text-slate-800">2.4%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
