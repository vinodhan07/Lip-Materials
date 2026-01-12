import { useState, useEffect } from 'react';
import { X, Bell, Sparkles } from 'lucide-react';
import { announcementsAPI } from '../../services/api';

export default function ToastBanner() {
    const [announcement, setAnnouncement] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const response = await announcementsAPI.getActive();
            const toasts = response.data.announcements.filter(
                a => a.type === 'toast' || a.type === 'both'
            );

            if (toasts.length > 0) {
                const dismissedIds = JSON.parse(localStorage.getItem('dismissedToasts') || '[]');
                const toShow = toasts.find(t => !dismissedIds.includes(t.id));

                if (toShow) {
                    setAnnouncement(toShow);
                    setShow(true);
                }
            }
        } catch (error) {
            console.error('Failed to load announcements:', error);
        }
    };

    const handleDismiss = () => {
        if (announcement) {
            const dismissedIds = JSON.parse(localStorage.getItem('dismissedToasts') || '[]');
            dismissedIds.push(announcement.id);
            localStorage.setItem('dismissedToasts', JSON.stringify(dismissedIds));
        }
        setShow(false);
    };

    if (!show || !announcement) return null;

    return (
        <div className="fixed top-20 left-0 right-0 z-40 toast-enter">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white py-3.5 px-6 rounded-2xl shadow-xl shadow-purple-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Sparkles size={16} className="text-amber-300" />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold">{announcement.title}</span>
                            <span className="text-purple-200">—</span>
                            <span className="text-purple-100">{announcement.message}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors flex-shrink-0 ml-4"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
