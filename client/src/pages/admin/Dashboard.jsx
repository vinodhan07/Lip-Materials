import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { Link } from 'react-router-dom';

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

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
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
        { icon: ShoppingCart, label: 'Total Orders', value: stats.totalOrders, color: 'from-purple-500 to-purple-600', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
        { icon: DollarSign, label: 'Total Revenue', value: `₹${stats.totalRevenue?.toFixed(0) || 0}`, color: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
        { icon: AlertCircle, label: 'Pending', value: stats.pendingOrders, color: 'from-orange-500 to-orange-600', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
        { icon: TrendingUp, label: 'Completed', value: stats.completedOrders, color: 'from-green-500 to-green-600', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
        { icon: Package, label: 'Products', value: stats.totalProducts, color: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
        { icon: Users, label: 'Users', value: stats.totalUsers, color: 'from-indigo-500 to-indigo-600', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
    ];

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-100 text-amber-700',
            confirmed: 'bg-blue-100 text-blue-700',
            processing: 'bg-indigo-100 text-indigo-700',
            shipped: 'bg-purple-100 text-purple-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's your store overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50 hover:shadow-lg hover:shadow-purple-500/5 transition-all">
                        <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                            <stat.icon className={stat.iconColor} size={22} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link
                    to="/admin/products"
                    className="group bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-2xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/20"
                >
                    <Package size={28} className="mb-3" />
                    <h3 className="text-lg font-bold">Manage Products</h3>
                    <p className="text-purple-200 text-sm mt-1">Add, edit, or remove products</p>
                    <ArrowUpRight size={18} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link
                    to="/admin/orders"
                    className="group bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
                >
                    <ShoppingCart size={28} className="mb-3" />
                    <h3 className="text-lg font-bold">View Orders</h3>
                    <p className="text-amber-100 text-sm mt-1">Track and manage customer orders</p>
                </Link>
                <Link
                    to="/admin/announcements"
                    className="group bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-2xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/20"
                >
                    <AlertCircle size={28} className="mb-3" />
                    <h3 className="text-lg font-bold">Announcements</h3>
                    <p className="text-indigo-200 text-sm mt-1">Create popups and notifications</p>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-purple-50">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-purple-600 hover:text-purple-700 text-sm font-semibold flex items-center gap-1">
                        View All
                        <ArrowUpRight size={16} />
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-500 border-b border-purple-50">
                                    <th className="pb-4 font-semibold">Order ID</th>
                                    <th className="pb-4 font-semibold">Customer</th>
                                    <th className="pb-4 font-semibold">Amount</th>
                                    <th className="pb-4 font-semibold">Status</th>
                                    <th className="pb-4 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-purple-50 last:border-0 hover:bg-purple-50/50 transition-colors">
                                        <td className="py-4 font-mono text-sm font-medium">#{order.id}</td>
                                        <td className="py-4 font-medium text-gray-900">{order.user_name || 'Guest'}</td>
                                        <td className="py-4 font-bold text-purple-600">₹{order.total?.toFixed(2)}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-500 text-sm">
                                            {new Date(order.created_at).toLocaleDateString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-12">No orders yet</p>
                )}
            </div>
        </div>
    );
}
