import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Mock category data
const generateCategoryData = () => [
    { name: 'Lip Boxes', value: 35, color: '#8b5cf6' },
    { name: 'Containers', value: 25, color: '#6366f1' },
    { name: 'Tubes', value: 20, color: '#3b82f6' },
    { name: 'Applicators', value: 12, color: '#06b6d4' },
    { name: 'Gift Sets', value: 8, color: '#fbbf24' },
];

export default function CategoryChart({ data = null }) {
    const chartData = data || generateCategoryData();

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800">Sales by Category</h3>
                <p className="text-sm text-slate-500">Product distribution</p>
            </div>

            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                padding: '10px 14px',
                            }}
                            formatter={(value, name) => [`${value}%`, name]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2">
                {chartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-slate-600 truncate">{item.name}</span>
                        <span className="text-xs font-bold text-slate-800 ml-auto">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
