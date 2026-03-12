import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Settings as SettingsIcon } from 'lucide-react';
import Button from './Button';
import Dropdown from './Dropdown';

const Header = ({ role }) => {
    const navigate = useNavigate();
    const getInitialUser = () => {
        try {
            return JSON.parse(localStorage.getItem('admin_user')) || { name: 'Alex Rivera', role: 'superadmin' };
        } catch (e) {
            console.error("Failed to parse user data:", e);
            return { name: 'Alex Rivera', role: 'superadmin' };
        }
    };
    const user = getInitialUser();
    const userInitials = (user.name || 'AR').substring(0, 2).toUpperCase();

    const getNotifications = () => {
        switch (role) {
            case 'interviewer':
                return [
                    { id: 1, text: "Upcoming technical review scheduled for 2 PM.", time: "10m ago" },
                    { id: 2, text: "Technical assessment feedback pending.", time: "1h ago" }
                ];
            case 'hr':
                return [
                    { id: 1, text: "Candidate status update received for Backend Dev.", time: "5m ago" },
                    { id: 2, text: "New resume submitted for HR Manager role.", time: "2h ago" }
                ];
            default: // admin / superadmin
                return [
                    { id: 1, text: "New assessment completed for Software Engineer.", time: "2m ago" },
                    { id: 2, text: "System security audit successful.", time: "4h ago" }
                ];
        }
    };

    const notifications = getNotifications();

    const handleSettingsClick = () => {
        const settingsPath = role === 'interviewer' ? '/interviewer/settings' : '/admin/settings';
        navigate(settingsPath);
    };

    const notificationTrigger = (
        <Button
            variant="ghost"
            size="sm"
            icon={Bell}
            className="p-2 rounded-full text-slate-600 hover:text-[#ff6e00] transition relative group/icon bg-transparent border-none focus:ring-0"
        >
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
        </Button>
    );

    return (
        <header className="h-16 bg-white/50 backdrop-blur-xl flex items-center px-6 sticky top-0 z-20 justify-between transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.15)] border-b border-gray-100 overflow-visible">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search (Candidates, Reports, Questions)..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-slate-400 shadow-elevation-high hover:shadow-orange-200/50 hover:border-orange-300 hover:bg-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 overflow-visible">
                <div className="flex items-center gap-1 overflow-visible">
                    <Dropdown 
                        trigger={notificationTrigger} 
                        align="right" 
                        closeOnClick={false}
                        contentClassName="w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-4 mt-2 origin-top-right overflow-hidden"
                    >
                        <div className="px-4 mb-3 flex items-center justify-between">
                            <h4 className="font-bold text-[#19325c] text-sm">Notifications</h4>
                            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span>
                        </div>
                        <div className="max-h-75 overflow-y-auto px-2 scrollbar-hide">
                            {notifications.map(n => (
                                <div key={n.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group mb-1">
                                    <p className="text-xs font-semibold text-slate-700 group-hover:text-[#ff6e00] leading-relaxed transition-colors">{n.text}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{n.time}</p>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 mt-3 pt-3 border-t border-slate-50">
                            <Button
                                variant="ghost"
                                size="xs"
                                className="text-[11px] font-black text-[#19325c] hover:text-[#ff6e00] transition-colors uppercase tracking-widest block w-full text-center border-none"
                            >
                                Mark all as read
                            </Button>
                        </div>
                    </Dropdown>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSettingsClick}
                        icon={SettingsIcon}
                        className="p-2 rounded-full text-slate-600 hover:text-[#ff6e00] transition-colors group/icon bg-transparent border-none"
                    />
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                    <div className="hidden lg:block text-right">
                        <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-orange-600 transition">
                            {user.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-black">
                            {user.role === 'superadmin' ? 'Super Admin' : user.role === 'interviewer' ? 'Technical Interviewer' : 'HR Manager'}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        {userInitials}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
