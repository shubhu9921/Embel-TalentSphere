import React from 'react';
import { Search, Bell, User, Settings } from 'lucide-react';

const Header = ({ role }) => {
    const user = JSON.parse(localStorage.getItem('admin_user')) || { name: 'Alex Rivera', role: 'superadmin' };

    const userInitials = user.name.substring(0, 2).toUpperCase();

    return (
        <header className="h-16 bg-white/50 backdrop-blur-xl flex items-center px-6 sticky top-0 z-20 justify-between transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.15)] border-b border-gray-100">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search (Candidates, Reports, Questions)..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-slate-400 shadow-md shadow-orange-100/50 hover:shadow-orange-200/50 hover:border-orange-300 hover:bg-white"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <button className="p-2 rounded-full text-slate-600 hover:bg-orange-50 hover:text-[#ff6e00] transition relative group/icon">
                        <Bell size={20} className="text-slate-600 group-hover/icon:text-[#ff6e00]" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                    </button>
                    <button className="p-2 rounded-full text-slate-600 hover:bg-orange-50 hover:text-[#ff6e00] transition-colors group/icon">
                        <Settings size={20} className="text-slate-600 group-hover/icon:text-[#ff6e00]" />
                    </button>
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
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                        {userInitials}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
