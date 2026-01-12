import { useState, useEffect } from 'react';
import { X, Bell, Sparkles } from 'lucide-react';
import { announcementsAPI } from '../../services/api';

export default function AnnouncementPopup() {
    const [announcement, setAnnouncement] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const response = await announcementsAPI.getActive();
            const popups = response.data.announcements.filter(
                a => a.type === 'popup' || a.type === 'both'
            );

            if (popups.length > 0) {
                const dismissedIds = JSON.parse(sessionStorage.getItem('dismissedPopups') || '[]');
                const toShow = popups.find(p => !dismissedIds.includes(p.id));

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
            const dismissedIds = JSON.parse(sessionStorage.getItem('dismissedPopups') || '[]');
            dismissedIds.push(announcement.id);
            sessionStorage.setItem('dismissedPopups', JSON.stringify(dismissedIds));
        }
        setShow(false);
    };

    if (!show || !announcement) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center animate-scale-in shadow-2xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2"></div>

                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                >
                    <X size={20} />
                </button>

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/30 animate-float">
                        <Sparkles className="text-white" size={36} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{announcement.title}</h2>
                    <p className="text-gray-600 mb-8">{announcement.message}</p>

                    <button
                        onClick={handleDismiss}
                        className="btn btn-primary w-full py-4"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
}
