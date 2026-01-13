import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown, Grid, List, Package } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        sortBy: searchParams.get('sortBy') || 'newest',
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [filters]);

    const loadCategories = async () => {
        try {
            const response = await productsAPI.getCategories();
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await productsAPI.getAll(filters);
            setProducts(response.data.products);
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);

        const params = new URLSearchParams();
        if (newFilters.search) params.set('search', newFilters.search);
        if (newFilters.category) params.set('category', newFilters.category);
        if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
        setSearchParams(params);
    };

    const clearFilters = () => {
        setFilters({ search: '', category: '', sortBy: 'newest' });
        setSearchParams({});
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A to Z' },
    ];

    // Category pills configuration
    const categoryPills = [
        { key: '', label: 'All Products' },
        { key: 'boxes', label: 'Boxes' },
        { key: 'covers', label: 'Covers' },
        { key: 'tapes', label: 'Tapes' },
    ];

    return (
        <div className="min-h-screen bg-gray-50" style={{ paddingTop: '80px', paddingBottom: '64px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between" style={{ marginBottom: '32px', paddingTop: '24px' }}>
                    {/* Title */}
                    <div style={{ marginBottom: '20px' }}>
                        <h1 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '4px' }}>
                            Products
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Showing {products.length} products
                        </p>
                    </div>

                    {/* Search and Sort */}
                    <div className="flex flex-col sm:flex-row" style={{ gap: '12px' }}>
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search product..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full sm:w-64 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                style={{ paddingLeft: '44px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}
                            />
                            {filters.search && (
                                <button
                                    onClick={() => handleFilterChange('search', '')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="appearance-none w-full sm:w-48 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-gray-700"
                                style={{ padding: '12px 40px 12px 16px' }}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                style={{ padding: '12px' }}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                style={{ padding: '12px' }}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center" style={{ gap: '8px', marginBottom: '32px' }}>
                    {categoryPills.map((pill) => (
                        <button
                            key={pill.key}
                            onClick={() => handleFilterChange('category', pill.key)}
                            className={`font-medium transition-all rounded-lg ${filters.category === pill.key
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                }`}
                            style={{ padding: '10px 20px' }}
                        >
                            {pill.label}
                        </button>
                    ))}

                    {/* Clear Filters */}
                    {(filters.search || filters.category) && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center text-purple-600 hover:text-purple-700 font-medium transition-all"
                            style={{ gap: '4px', padding: '10px 16px' }}
                        >
                            <X size={16} />
                            Clear
                        </button>
                    )}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center" style={{ padding: '96px 0' }}>
                        <div className="spinner"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div
                        className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}
                        style={{ gap: '20px' }}
                    >
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-white rounded-2xl border border-gray-100" style={{ padding: '96px 32px' }}>
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center" style={{ margin: '0 auto 20px' }}>
                            <Search size={28} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>No products found</h3>
                        <p className="text-gray-500" style={{ marginBottom: '24px' }}>Try adjusting your search or filter criteria</p>
                        <button
                            onClick={clearFilters}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all"
                            style={{ padding: '12px 24px' }}
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
