import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Loader2, Bell, BellOff, Eye } from 'lucide-react';
import { announcementsAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AnnouncementManagement() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [saving, setSaving] = useState(false);
    const [previewType, setPreviewType] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'both',
        isActive: true,
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            const response = await announcementsAPI.getAll();
            setAnnouncements(response.data.announcements);
        } catch (error) {
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (announcement = null) => {
        if (announcement) {
            setEditingAnnouncement(announcement);
            setFormData({
                title: announcement.title,
                message: announcement.message,
                type: announcement.type,
                isActive: announcement.is_active === 1,
                startDate: announcement.start_date ? announcement.start_date.split('T')[0] : '',
                endDate: announcement.end_date ? announcement.end_date.split('T')[0] : '',
            });
        } else {
            setEditingAnnouncement(null);
            setFormData({
                title: '',
                message: '',
                type: 'both',
                isActive: true,
                startDate: '',
                endDate: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAnnouncement(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.message) {
            toast.error('Title and message are required');
            return;
        }

        setSaving(true);

        try {
            if (editingAnnouncement) {
                await announcementsAPI.update(editingAnnouncement.id, formData);
                toast.success('Announcement updated');
            } else {
                await announcementsAPI.create(formData);
                toast.success('Announcement created');
            }
            handleCloseModal();
            loadAnnouncements();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save announcement');
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await announcementsAPI.toggle(id);
            toast.success('Announcement status updated');
            loadAnnouncements();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;

        try {
            await announcementsAPI.delete(id);
            toast.success('Announcement deleted');
            loadAnnouncements();
        } catch (error) {
            toast.error('Failed to delete announcement');
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'popup': return 'Popup Only';
            case 'toast': return 'Toast Only';
            case 'both': return 'Popup & Toast';
            default: return type;
        }
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                    <p className="text-gray-600 text-sm">Create popups and toast notifications for users</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    New Announcement
                </button>
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <div
                        key={announcement.id}
                        className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${announcement.is_active ? 'border-primary-500' : 'border-gray-300'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${announcement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {announcement.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                                        {getTypeLabel(announcement.type)}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-3">{announcement.message}</p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    {announcement.start_date && (
                                        <span>Start: {new Date(announcement.start_date).toLocaleDateString()}</span>
                                    )}
                                    {announcement.end_date && (
                                        <span>End: {new Date(announcement.end_date).toLocaleDateString()}</span>
                                    )}
                                    <span>Created by: {announcement.created_by_name || 'Admin'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPreviewType(announcement)}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Preview"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    onClick={() => handleToggle(announcement.id)}
                                    className={`p-2 rounded-lg transition-colors ${announcement.is_active
                                            ? 'text-yellow-600 hover:bg-yellow-50'
                                            : 'text-green-600 hover:bg-green-50'
                                        }`}
                                    title={announcement.is_active ? 'Deactivate' : 'Activate'}
                                >
                                    {announcement.is_active ? <BellOff size={18} /> : <Bell size={18} />}
                                </button>
                                <button
                                    onClick={() => handleOpenModal(announcement)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(announcement.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {announcements.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
                        <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No announcements yet. Create one to start engaging your users!</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">
                                {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g., New Year Sale!"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="input"
                                    rows="3"
                                    placeholder="e.g., Get 20% off on all products!"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="both">Popup & Toast (Both)</option>
                                    <option value="popup">Popup Only</option>
                                    <option value="toast">Toast Only</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Popup: Shows as a modal on page load. Toast: Shows as a notification bar near the header.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary-600 rounded"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700">Active immediately</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={20} /> : null}
                                    {editingAnnouncement ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewType && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="text-primary-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{previewType.title}</h3>
                        <p className="text-gray-600 mb-6">{previewType.message}</p>
                        <button
                            onClick={() => setPreviewType(null)}
                            className="btn btn-primary w-full"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
