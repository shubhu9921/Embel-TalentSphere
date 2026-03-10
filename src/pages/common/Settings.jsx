import React from 'react';
import { User, Bell, Shield, Cloud, Save } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Settings = () => {
    const user = JSON.parse(localStorage.getItem('admin_user')) || {};

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 font-medium mt-1">Manage your professional profile and system preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#ff6e00] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#ff6e00]/20">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-orange-50 rounded-2xl text-sm font-bold transition-all hover:text-[#ff6e00]">
                        <Bell className="w-4 h-4" />
                        <span>Notifications</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-orange-50 rounded-2xl text-sm font-bold transition-all hover:text-[#ff6e00]">
                        <Shield className="w-4 h-4" />
                        <span>Security</span>
                    </button>
                </div>

                <div className="md:col-span-3 space-y-6">
                    <Card className="p-8 border-none ring-1 ring-slate-100 shadow-xl shadow-orange-100/50">
                        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#ff6e00]">
                                <User className="w-5 h-5" />
                            </div>
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] font-bold text-slate-700 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm opacity-60 cursor-not-allowed font-bold text-slate-700"
                                />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Professional Bio</label>
                                <textarea
                                    rows={4}
                                    defaultValue="Senior recruiting specialist committed to finding the best talent for Embel TalentSphere technical teams."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] font-medium text-slate-700 resize-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                            <Button className="px-10 py-3 rounded-xl flex items-center gap-2 bg-[#ff6e00] hover:bg-[#e05d00] border-none shadow-lg shadow-[#ff6e00]/20">
                                <Save className="w-4 h-4" />
                                <span>Save Changes</span>
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
                                <button className="mt-5 text-xs font-black text-emerald-600 bg-white px-5 py-3 rounded-xl border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all uppercase tracking-widest shadow-sm">
                                    Enable Now
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
