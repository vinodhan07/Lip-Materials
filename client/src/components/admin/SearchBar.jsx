import { Search, X } from 'lucide-react';

/**
 * SearchBar - Modern reusable search component for admin pages
 * 
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Callback when value changes
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 */
export default function SearchBar({
    value = '',
    onChange,
    placeholder = 'Search...',
    className = ''
}) {
    const handleClear = () => {
        onChange?.({ target: { value: '' } });
    };

    return (
        <div className={`relative ${className}`}>
            {/* Search Icon */}
            <div
                className="absolute left-0 top-0 bottom-0 flex items-center justify-center text-slate-400"
                style={{ width: '44px' }}
            >
                <Search size={18} />
            </div>

            {/* Input */}
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{
                    paddingLeft: '44px',
                    paddingRight: value ? '44px' : '16px',
                    paddingTop: '10px',
                    paddingBottom: '10px'
                }}
                className="w-full bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:border-slate-300"
            />

            {/* Clear Button */}
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-0 top-0 bottom-0 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    style={{ width: '44px' }}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
