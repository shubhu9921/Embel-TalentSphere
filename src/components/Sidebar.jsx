import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, FileQuestion, Briefcase, Award,
    LogOut, Settings, HelpCircle, Menu, ShieldAlert
} from 'lucide-react';

const Sidebar = ({ role = 'superadmin', collapsed, setCollapsed }) => {
    const navigate = useNavigate();

    const adminLinks = [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Live Proctoring', path: '/admin/proctoring', icon: ShieldAlert },
        { label: 'Vacancies', path: '/admin/vacancies', icon: Briefcase },
        { label: 'Question Bank', path: '/admin/questions', icon: FileQuestion },
        { label: 'Candidates', path: '/admin/candidates', icon: Users },
        { label: 'Interviews', path: '/admin/interviews', icon: Award },
        { label: 'Team', path: '/admin/team', icon: Users },
    ];

    const interviewerLinks = [
        { label: 'Home', path: '/interviewer', icon: LayoutDashboard },
        { label: 'My Interviews', path: '/interviewer/interviews', icon: Briefcase },
        { label: 'Technical Review', path: '/interviewer/reviews', icon: Award },
    ];

    const hrLinks = [
        { label: 'Home', path: '/hr', icon: LayoutDashboard },
        { label: 'Candidates', path: '/hr/candidates', icon: Users },
        { label: 'Interviews', path: '/hr/interviews', icon: Award },
        { label: 'Email Portal', path: '/hr/emails', icon: FileQuestion },
    ];

    const links = role === 'superadmin' ? adminLinks : role === 'interviewer' ? interviewerLinks : hrLinks;

    const handleLogout = () => {
        localStorage.removeItem('admin_user');
        sessionStorage.clear();
        navigate('/login-admin');
    };

    return (
        <aside
            className={`
                bg-white/50 backdrop-blur-md transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-50 border-r border-gray-100
                ${collapsed ? "w-20" : "w-64"}
                flex flex-col h-screen fixed left-0 top-0 overflow-x-hidden
            `}
        >
            {/* Logo Section */}
            <div className={`h-16 flex items-center shrink-0 transition-all duration-300 overflow-hidden ${collapsed ? 'justify-center px-0' : 'justify-between px-4 mt-2'}`}>
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm ring-1 ring-slate-100">
                            <img src="https://www.embel.co.in/images/logos/logo-embel.png" alt="Embel" className="h-full w-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-base text-slate-800 tracking-tight leading-none uppercase">Embel</span>
                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest mt-0.5">TalentSphere</span>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all ${collapsed ? 'mx-auto' : ''}`}
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Menu Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col gap-0.5 mt-4">
                {!collapsed && (
                    <div className="px-5 mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hiring Process</span>
                    </div>
                )}

                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        title={collapsed ? link.label : ""}
                        end={link.path === '/admin' || link.path === '/interviewer' || link.path === '/hr'}
                        className={({ isActive }) => `
                            flex items-center gap-3 w-full py-3 transition-all duration-200 group shrink-0
                            ${collapsed ? "justify-center rounded-lg mx-2 w-auto" : "pl-4 rounded-r-full rounded-l-none mr-2"}
                            ${isActive
                                ? "bg-[#19325c] text-white font-bold border-l-4 border-[#ff6e00]"
                                : "text-slate-600 font-medium hover:bg-[#19325c] hover:text-white hover:font-bold border-l-4 border-transparent"}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon size={18} className={isActive ? "text-[#ff6e00]" : "text-slate-700 group-hover:text-[#ff6e00] transition-colors"} />
                                <span className={`text-[13px] ${collapsed ? 'hidden' : 'block'}`}>{link.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                {/* System Grouping */}
                <div className="mt-6">
                    {!collapsed && (
                        <div className="px-5 mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Management</span>
                        </div>
                    )}

                    <NavLink
                        to={`${role === 'superadmin' ? '/admin' : `/${role}`}/settings`}
                        title={collapsed ? "Settings" : ""}
                        className={({ isActive }) => `
                            flex items-center gap-3 w-full py-3 transition-all duration-200 group shrink-0
                            ${collapsed ? "justify-center rounded-lg mx-2 w-auto" : "pl-4 rounded-r-full rounded-l-none mr-2"}
                            ${isActive
                                ? "bg-[#19325c] text-white font-bold border-l-4 border-[#ff6e00]"
                                : "text-slate-600 font-medium hover:bg-[#19325c] hover:text-white hover:font-bold border-l-4 border-transparent"}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <Settings size={18} className={isActive ? "text-[#ff6e00]" : "text-slate-700 group-hover:text-[#ff6e00] transition-colors"} />
                                <span className={`text-[13px] ${collapsed ? 'hidden' : 'block'}`}>Settings</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to={`${role === 'superadmin' ? '/admin' : `/${role}`}/help`}
                        title={collapsed ? "Support" : ""}
                        className={({ isActive }) => `
                            flex items-center gap-3 w-full py-3 transition-all duration-200 group shrink-0
                            ${collapsed ? "justify-center rounded-lg mx-2 w-auto" : "pl-4 rounded-r-full rounded-l-none mr-2"}
                            ${isActive
                                ? "bg-[#19325c] text-white font-bold border-l-4 border-[#ff6e00]"
                                : "text-slate-600 font-medium hover:bg-[#19325c] hover:text-white hover:font-bold border-l-4 border-transparent"}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <HelpCircle size={18} className={isActive ? "text-[#ff6e00]" : "text-slate-700 group-hover:text-[#ff6e00] transition-colors"} />
                                <span className={`text-[13px] ${collapsed ? 'hidden' : 'block'}`}>Support</span>
                            </>
                        )}
                    </NavLink>
                </div>
            </nav>

            {/* Logout Button */}
            <div className={`px-2 py-3 border-t border-gray-100 shrink-0 ${collapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={handleLogout}
                    title={collapsed ? "Sign Out" : ""}
                    className={`
                        flex items-center gap-3 transition-all duration-200 group rounded-xl hover:bg-rose-50
                        ${collapsed ? "p-3" : "w-full py-3 pl-4"}
                    `}
                >
                    <LogOut size={18} className="text-slate-600 group-hover:text-rose-600 transition-colors" />
                    {!collapsed && (
                        <span className="text-[13px] font-bold text-slate-600 group-hover:text-rose-600 uppercase tracking-wider">Sign Out</span>
                    )}
                </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 shrink-0 text-center bg-gray-50/50 border-t border-gray-100">
                <p className="text-[9px] font-black text-slate-400 tracking-[0.1em]">
                    {collapsed ? "©" : "© 2026 EMBEL TECH"}
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
