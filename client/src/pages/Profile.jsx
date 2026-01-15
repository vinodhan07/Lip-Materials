import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, Check, X, User, AlertCircle, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

// Validation functions
const validate = {
    name: (v) => v?.trim().length >= 2 && v.trim().length <= 50 && /^[a-zA-Z\s]+$/.test(v.trim()),
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v?.trim()),
    phone: (v) => !v || /^[\d\s\-()]{6,15}$/.test(v?.replace(/\s/g, '')),
    address: (v) => !v || (v.trim().length >= 10 && v.trim().length <= 200),
    city: (v) => !v || (v.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(v.trim())),
    pincode: (v) => !v || /^[0-9]{5,6}$/.test(v?.trim()),
};

const errorMessages = {
    name: 'Enter full name (2-50 characters, letters only)',
    email: 'Enter a valid email address',
    phone: 'Enter a valid phone number',
    address: 'Enter complete address (10-200 characters)',
    city: 'Enter a valid city name',
    pincode: 'Enter a valid pincode (5-6 digits)',
};

// Country codes with flags (emoji)
const countryCodes = [
    { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
    { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
    { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
    { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
    { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
    { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
    { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil' },
    { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia' },
    { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea' },
    { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy' },
    { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Spain' },
    { code: '+52', country: 'MX', flag: '🇲🇽', name: 'Mexico' },
    { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
    { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore' },
    { code: '+60', country: 'MY', flag: '🇲🇾', name: 'Malaysia' },
    { code: '+63', country: 'PH', flag: '🇵🇭', name: 'Philippines' },
    { code: '+66', country: 'TH', flag: '🇹🇭', name: 'Thailand' },
    { code: '+84', country: 'VN', flag: '🇻🇳', name: 'Vietnam' },
];

export default function Profile() {
    const fileInputRef = useRef(null);
    const { user, fetchProfile, updateProfile, uploadPhoto, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [originalData, setOriginalData] = useState({});

    // Load profile data on mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const result = await fetchProfile();
        if (result.success && result.user) {
            const data = {
                name: result.user.name || '',
                email: result.user.email || '',
                phone: result.user.phone || '',
                address: result.user.address || '',
                city: result.user.city || '',
                state: result.user.state || '',
                country: result.user.country || '',
                pincode: result.user.pincode || '',
            };
            setFormData(data);
            setOriginalData(data);
        }
    };

    // Track changes
    useEffect(() => {
        const changed = Object.keys(formData).some(key => formData[key] !== originalData[key]);
        setHasChanges(changed);
    }, [formData, originalData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate field
        const validator = validate[name];
        if (validator && !validator(value)) {
            setErrors(prev => ({ ...prev, [name]: errorMessages[name] }));
        } else {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!validate.name(formData.name)) newErrors.name = errorMessages.name;
        if (!validate.email(formData.email)) newErrors.email = errorMessages.email;

        // Optional fields
        if (formData.phone && !validate.phone(formData.phone)) newErrors.phone = errorMessages.phone;
        if (formData.address && !validate.address(formData.address)) newErrors.address = errorMessages.address;
        if (formData.city && !validate.city(formData.city)) newErrors.city = errorMessages.city;
        if (formData.pincode && !validate.pincode(formData.pincode)) newErrors.pincode = errorMessages.pincode;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

        if (!validateForm()) {
            toast.error('Please fix the errors before saving');
            return;
        }

        const result = await updateProfile(formData);
        if (result.success) {
            toast.success('Profile updated successfully!');
            setOriginalData(formData);
            setHasChanges(false);
        } else {
            toast.error(result.error || 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
        setErrors({});
        setTouched({});
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload JPG, PNG, or WebP image');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        setIsUploading(true);
        const result = await uploadPhoto(file);
        setIsUploading(false);

        if (result.success) {
            toast.success('Photo uploaded successfully!');
        } else {
            toast.error(result.error || 'Failed to upload photo');
        }

        // Reset file input
        e.target.value = '';
    };

    const photoUrl = user?.photo_url ? `${API_URL}${user.photo_url}` : null;

    return (
        <motion.div
            className="min-h-screen bg-gray-50"
            style={{ paddingTop: '100px', paddingBottom: '60px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
                <motion.div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100"
                    style={{ padding: '40px' }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {/* Profile Photo Section */}
                    <div className="text-center" style={{ marginBottom: '32px' }}>
                        <div className="relative inline-block">
                            <motion.div
                                className="w-28 h-28 rounded-full border-2 border-gray-200 overflow-hidden bg-purple-100 flex items-center justify-center mx-auto cursor-pointer"
                                onClick={handlePhotoClick}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isUploading ? (
                                    <Loader2 className="animate-spin text-purple-600" size={36} />
                                ) : photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt={user?.name || 'Profile'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={48} className="text-purple-400" />
                                )}
                            </motion.div>

                            {/* Camera Icon Overlay */}
                            <motion.button
                                type="button"
                                onClick={handlePhotoClick}
                                className="absolute bottom-0 right-0 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-purple-50 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isUploading}
                            >
                                <Camera size={18} className="text-purple-600" />
                            </motion.button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />

                        <h2 className="text-xl font-bold text-gray-900" style={{ marginTop: '16px', marginBottom: '4px' }}>
                            {user?.name || 'Your Name'}
                        </h2>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                    </div>

                    {/* Personal Details Form */}
                    <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '32px' }}>
                        <h3 className="text-lg font-semibold text-gray-900" style={{ marginBottom: '24px' }}>
                            Personal Details
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {/* Full Name */}
                            <FormField
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && errors.name}
                                required
                                placeholder="Enter your full name"
                            />

                            {/* Email */}
                            <FormField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && errors.email}
                                required
                                placeholder="your.email@example.com"
                            />

                            {/* Phone with Country Code Dropdown */}
                            <PhoneInput
                                value={formData.phone}
                                onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                                onBlur={() => {
                                    setTouched(prev => ({ ...prev, phone: true }));
                                    if (formData.phone && !validate.phone(formData.phone)) {
                                        setErrors(prev => ({ ...prev, phone: errorMessages.phone }));
                                    } else {
                                        setErrors(prev => ({ ...prev, phone: null }));
                                    }
                                }}
                                error={touched.phone && errors.phone}
                            />

                            {/* Address */}
                            <div style={{ marginBottom: '20px' }}>
                                <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows={2}
                                    className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y ${touched.address && errors.address ? 'border-red-400' : 'border-gray-200'}`}
                                    style={{ padding: '10px 12px', minHeight: '60px' }}
                                    placeholder="Street address, apartment, suite, etc."
                                />
                                {touched.address && errors.address && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} /> {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* City & State Row */}
                            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                                <FormField
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.city && errors.city}
                                    placeholder="Enter city"
                                />
                                <FormField
                                    label="State"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Enter state"
                                />
                            </div>

                            {/* Country & Pincode Row */}
                            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                                <FormField
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Enter country"
                                />
                                <FormField
                                    label="Pincode"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.pincode && errors.pincode}
                                    placeholder="Enter pincode"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end" style={{ gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>
                                <motion.button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={!hasChanges || isLoading}
                                    className="font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    style={{ padding: '12px 24px' }}
                                    whileHover={{ scale: hasChanges ? 1.02 : 1 }}
                                    whileTap={{ scale: hasChanges ? 0.98 : 1 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={!hasChanges || isLoading}
                                    className="font-semibold text-white bg-purple-600 rounded-xl shadow-lg shadow-purple-500/30 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center transition-colors"
                                    style={{ padding: '12px 24px', gap: '8px' }}
                                    whileHover={{ scale: hasChanges && !isLoading ? 1.02 : 1 }}
                                    whileTap={{ scale: hasChanges && !isLoading ? 0.98 : 1 }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

// Reusable form field component
function FormField({ label, name, type = 'text', value, onChange, onBlur, error, required, placeholder }) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${error ? 'border-red-400' : 'border-gray-200'}`}
                style={{ padding: '10px 12px', height: '40px' }}
                placeholder={placeholder}
            />
            {error && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {error}
                </p>
            )}
        </div>
    );
}

// Phone input with country code dropdown
function PhoneInput({ value, onChange, onBlur, error }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCode, setSelectedCode] = useState(countryCodes[1]); // Default to India
    const dropdownRef = useRef(null);

    // Parse existing phone to extract country code if present
    useEffect(() => {
        if (value) {
            const match = countryCodes.find(c => value.startsWith(c.code));
            if (match) {
                setSelectedCode(match);
            }
        }
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCodes = countryCodes.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.includes(search) ||
        c.country.toLowerCase().includes(search.toLowerCase())
    );

    const handleCodeSelect = (code) => {
        setSelectedCode(code);
        setIsOpen(false);
        setSearch('');
        // Update the phone value with new code
        const phoneNumber = value?.replace(/^\+\d+\s*/, '') || '';
        onChange(code.code + ' ' + phoneNumber);
    };

    const handlePhoneChange = (e) => {
        const phoneNumber = e.target.value.replace(/[^\d\s\-()]/g, '');
        onChange(selectedCode.code + ' ' + phoneNumber);
    };

    // Extract phone number without code
    const phoneNumber = value?.replace(/^\+\d+\s*/, '') || '';

    return (
        <div style={{ marginBottom: '20px' }}>
            <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: '6px' }}>
                Phone Number
            </label>
            <div className="flex" style={{ gap: '8px' }}>
                {/* Country Code Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex items-center border rounded-lg bg-white hover:bg-gray-50 transition-colors ${error ? 'border-red-400' : 'border-gray-200'}`}
                        style={{ padding: '10px 12px', height: '40px', gap: '6px', minWidth: '100px' }}
                    >
                        <span className="text-lg">{selectedCode.flag}</span>
                        <span className="text-sm text-gray-700">{selectedCode.code}</span>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                                style={{ width: '240px', maxHeight: '280px' }}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.15 }}
                            >
                                {/* Search */}
                                <div style={{ padding: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="Search country..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        style={{ padding: '8px 10px' }}
                                        autoFocus
                                    />
                                </div>

                                {/* List */}
                                <div className="overflow-y-auto" style={{ maxHeight: '220px' }}>
                                    {filteredCodes.map((code) => (
                                        <button
                                            key={code.code + code.country}
                                            type="button"
                                            onClick={() => handleCodeSelect(code)}
                                            className={`w-full flex items-center text-left hover:bg-purple-50 transition-colors ${selectedCode.code === code.code ? 'bg-purple-50' : ''}`}
                                            style={{ padding: '10px 12px', gap: '10px' }}
                                        >
                                            <span className="text-lg">{code.flag}</span>
                                            <span className="text-sm text-gray-900 flex-1">{code.name}</span>
                                            <span className="text-sm text-gray-500">{code.code}</span>
                                        </button>
                                    ))}
                                    {filteredCodes.length === 0 && (
                                        <div className="text-center text-gray-400 text-sm" style={{ padding: '16px' }}>
                                            No countries found
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Phone Number Input */}
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    onBlur={onBlur}
                    className={`flex-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${error ? 'border-red-400' : 'border-gray-200'}`}
                    style={{ padding: '10px 12px', height: '40px' }}
                    placeholder="(555) 123-4567"
                />
            </div>
            {error && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {error}
                </p>
            )}
        </div>
    );
}

