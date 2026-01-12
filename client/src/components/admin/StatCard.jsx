import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatCard - Matches reference design
 * Layout: Label top-left, Value below, Icon on right, Trend at bottom
 */

const colorPresets = {
    emerald: {
        iconBg: 'bg-emerald-500',
        trendColor: 'text-emerald-600'
    },
    blue: {
        iconBg: 'bg-blue-500',
        trendColor: 'text-blue-600'
    },
    amber: {
        iconBg: 'bg-amber-400',
        trendColor: 'text-amber-600'
    },
    purple: {
        iconBg: 'bg-purple-500',
        trendColor: 'text-purple-600'
    },
    pink: {
        iconBg: 'bg-pink-500',
        trendColor: 'text-pink-600'
    },
    cyan: {
        iconBg: 'bg-cyan-400',
        trendColor: 'text-cyan-600'
    },
    red: {
        iconBg: 'bg-red-500',
        trendColor: 'text-red-600'
    }
};

export default function StatCard({
    icon: Icon,
    label,
    value,
    trend,
    trendText = '',
    trendUp = true,
    color = 'blue'
}) {
    const colorClass = colorPresets[color] || colorPresets.blue;

    return (
        <div
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow h-full"
            style={{ padding: '20px' }}
        >
            {/* Top Section: Label + Icon */}
            <div className="flex items-start justify-between" style={{ marginBottom: '12px' }}>
                {/* Left: Label */}
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {label}
                </span>

                {/* Right: Circular Icon */}
                <div
                    className={`${colorClass.iconBg} rounded-full flex items-center justify-center`}
                    style={{ width: '44px', height: '44px' }}
                >
                    <Icon className="text-white" size={22} />
                </div>
            </div>

            {/* Value - Large and Bold */}
            <h3
                className="font-bold text-slate-900"
                style={{ fontSize: '28px', lineHeight: '1.2', marginBottom: '8px' }}
            >
                {value}
            </h3>

            {/* Trend Row */}
            {trend && (
                <div className="flex items-center" style={{ gap: '6px' }}>
                    {trendUp ? (
                        <TrendingUp size={14} className="text-emerald-500" />
                    ) : (
                        <TrendingDown size={14} className="text-red-500" />
                    )}
                    <span className={`text-xs font-semibold ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend}
                    </span>
                    {trendText && (
                        <span className="text-xs text-slate-400">
                            {trendText}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// Skeleton loader
export function StatCardSkeleton() {
    return (
        <div
            className="bg-white rounded-2xl shadow-sm animate-pulse h-full"
            style={{ padding: '24px' }}
        >
            <div className="flex items-start justify-between" style={{ marginBottom: '12px' }}>
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="w-11 h-11 rounded-full bg-slate-200" />
            </div>
            <div className="h-7 w-24 bg-slate-200 rounded" style={{ marginBottom: '8px' }} />
            <div className="h-3 w-28 bg-slate-100 rounded" />
        </div>
    );
}
