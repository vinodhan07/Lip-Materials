import { useState, useEffect } from 'react';
import { Eye, X, ChevronDown, Package, CreditCard, Truck, User } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '../../components/admin/PageHeader';
import SearchBar from '../../components/admin/SearchBar';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [filter]);

    const loadOrders = async () => {
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await ordersAPI.getAll(params);
            setOrders(response.data.orders);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await ordersAPI.updateStatus(orderId, newStatus);
            toast.success('Order status updated');
            loadOrders();
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdating(null);
        }
    };

    const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
            processing: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            shipped: 'bg-purple-100 text-purple-700 border-purple-200',
            delivered: 'bg-green-100 text-green-700 border-green-200',
            cancelled: 'bg-red-50 text-red-600 border-red-200',
        };
        return styles[status] || 'bg-slate-100 text-slate-600 border-slate-200';
    };

    // Filter dropdown component
    const FilterDropdown = (
        <div className="relative group">
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-purple-600 transition-colors" />
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none pl-5 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm hover:border-purple-300 transition-all capitalize"
            >
                <option value="all">All Statuses</option>
                {statusOptions.map(status => (
                    <option key={status} value={status} className="capitalize">{status}</option>
                ))}
            </select>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Filter */}
            <PageHeader
                title="Orders"
                subtitle="Track and manage your customer orders."
                actions={FilterDropdown}
            />

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100" style={{ padding: '16px 20px' }}>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by order ID, customer name, or email..."
                        className="w-full md:w-96"
                    />
                    <div className="text-sm text-slate-500">
                        {orders.filter(o =>
                            o.id?.toString().includes(search.toLowerCase()) ||
                            o.user_name?.toLowerCase().includes(search.toLowerCase()) ||
                            o.user_email?.toLowerCase().includes(search.toLowerCase())
                        ).length} orders found
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="group hover:bg-purple-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <span className="block font-mono text-sm font-bold text-slate-700">#{order.id}</span>
                                                <span className="text-xs text-slate-500">{order.item_count} items</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                                {order.user_name?.[0] || 'U'}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{order.user_name || 'Guest'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-800">₹{order.total?.toFixed(2)}</span>
                                        <span className="block text-[10px] text-slate-400 font-medium uppercase mt-0.5">{order.payment_method || 'COD'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                disabled={updating === order.id}
                                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all uppercase tracking-wide ${getStatusBadge(order.status)}`}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status} className="capitalize bg-white text-slate-800">{status}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all opacity-0 group-hover:opacity-100"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.length === 0 && (
                    <div className="p-16 text-center text-slate-400 bg-slate-50/50">
                        <Search size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium text-slate-600">No orders found</p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal - Premium Design */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />

                    <div className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-6 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-bold">Order #{selectedOrder.id}</h2>
                                <p className="text-slate-400 text-xs mt-1">
                                    Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Status Section */}
                            <div className="bg-slate-50 rounded-2xl p-5 flex items-center justify-between border border-slate-100">
                                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Current Status</span>
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize border ${getStatusBadge(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <User size={14} /> Customer
                                    </div>
                                    <p className="font-bold text-slate-800 text-lg">{selectedOrder.user_name || 'Guest'}</p>
                                    <p className="text-sm text-slate-500">{selectedOrder.user_email}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <Truck size={14} /> Shipping
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                        {selectedOrder.shipping_address || 'No address provided'}
                                    </p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <Package size={14} /> Order Items
                                </div>
                                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                                    {selectedOrder.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-white border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                                                    {item.quantity}x
                                                </div>
                                                <span className="font-medium text-slate-700">{item.name}</span>
                                            </div>
                                            <span className="font-bold text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    )) || <p className="p-4 text-center text-slate-400">No items found</p>}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-slate-700">Total Amount</span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                        ₹{selectedOrder.total?.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-end mt-2">
                                    <span className="text-xs font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        Via {selectedOrder.payment_method || 'COD'} <CreditCard size={12} />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 text-center">
                            <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary w-full">Close Details</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
