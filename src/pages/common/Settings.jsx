import React from 'react';
import { User, Bell, Shield, Cloud, Save } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Settings = () => {
    const user = JSON.parse(localStorage.getItem('admin_user')) || {};
    const [name, setName] = React.useState(user.name || '');
    const [bio, setBio] = React.useState("Senior recruiting specialist committed to finding the best talent for Embel Talentry technical teams.");
    const [saving, setSaving] = React.useState(false);

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        localStorage.setItem('admin_user', JSON.stringify({ ...user, name }));
        setSaving(false);
        alert('Settings saved successfully!');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 page-fade-in">
            <div>
                <h1 className="text-3xl font-black text-[#19325c] tracking-tight">Account Settings</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your professional profile and system preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1 space-y-2">
                    <Button
                        variant="secondary"
                        size="md"
                        icon={User}
                        className="w-full justify-start shadow-lg shadow-orange-500/20"
                    >
                        Profile
                    </Button>
                    <Button
                        variant="ghost"
                        size="md"
                        icon={Bell}
                        className="w-full justify-start text-slate-500 hover:text-[#ff6e00]"
                    >
                        Notifications
                    </Button>
                    <Button
                        variant="ghost"
                        size="md"
                        icon={Shield}
                        className="w-full justify-start text-slate-500 hover:text-[#ff6e00]"
                    >
                        Security
                    </Button>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <Card className="p-8 border-none ring-1 ring-slate-100 shadow-elevation-high">
                        <h3 className="text-xl font-black text-[#19325c] mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#ff6e00]">
                                <User className="w-5 h-5" />
                            </div>
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label htmlFor="full-name" className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                <input
                                    id="full-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] font-bold text-slate-700 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="email-address" className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                <input
                                    id="email-address"
                                    type="email"
                                    defaultValue={user.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm opacity-60 cursor-not-allowed font-bold text-slate-700"
                                />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <label htmlFor="professional-bio" className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Professional Bio</label>
                                <textarea
                                    id="professional-bio"
                                    rows={4}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] font-medium text-slate-700 resize-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                            <Button
                                variant="secondary"
                                size="lg"
                                icon={Save}
                                onClick={handleSave}
                                loading={saving}
                                className="px-10 shadow-lg shadow-orange-500/20"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-8 border-none ring-1 ring-emerald-100 bg-emerald-50/20 shadow-xl shadow-emerald-500/5">
                        <div className="flex items-start gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 shrink-0">
                                <Shield className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-emerald-900">Two-Factor Authentication</h3>
                                <p className="text-sm text-emerald-700 font-medium mt-1">Add an extra layer of security to your recruiting account by enabling 2FA.</p>
                                <Button
                                    variant="success"
                                    size="md"
                                    className="mt-5 bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 shadow-sm"
                                >
                                    Enable Now
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
