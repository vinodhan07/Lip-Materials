/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                'luxury': {
                    900: '#0F0518', // Deepest Purple
                    800: '#1A0B2E', // Deep Purple
                    700: '#2D1B4E', // Rich Purple
                },
                'gold': {
                    100: '#FFF9C4',
                    300: '#FDB931',
                    400: '#FFD700', // Standard Gold
                    500: '#D4AF37', // Metallic Gold
                    600: '#AA8C2C',
                    gradient: 'linear-gradient(135deg, #FDB931 0%, #FFD700 100%)'
                }
            },
            backgroundImage: {
                'hero-glow': 'radial-gradient(circle at center, rgba(45, 27, 78, 0.4) 0%, rgba(15, 5, 24, 1) 70%)',
                'gold-gradient': 'linear-gradient(135deg, #FDB931 0%, #FFD700 50%, #D4AF37 100%)',
                'card-glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            }
        },
    },
    plugins: [],
}
