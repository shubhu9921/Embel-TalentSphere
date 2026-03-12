import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, FileQuestion, Briefcase, Award,
    LogOut, Settings, HelpCircle, Menu, ShieldAlert
} from 'lucide-react';
import Button from './Button';

const Sidebar = ({ role = 'superadmin', collapsed, setCollapsed }) => {
    const navigate = useNavigate();

    const adminLinks = [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { label: 'Live Proctoring', path: '/admin/proctoring', icon: ShieldAlert },
        { label: 'Vacancies', path: '/admin/vacancies', icon: Briefcase },
        { label: 'Question Bank', path: '/admin/questions', icon: FileQuestion },
        { label: 'Candidates', path: '/admin/candidates', icon: Users },
        { label: 'Interviews', path: '/admin/interviews', icon: Award },
        { label: 'Email Portal', path: '/admin/emails', icon: FileQuestion },
        { label: 'Team', path: '/admin/team', icon: Users },
    ];

    const interviewerLinks = [
        { label: 'Home', path: '/interviewer', icon: LayoutDashboard },
        { label: 'My Interviews', path: '/interviewer/interviews', icon: Briefcase },
        { label: 'Technical Review', path: '/interviewer/reviews', icon: Award },
    ];

    let links = role === 'interviewer' ? interviewerLinks : adminLinks;

    // Filter out "Team" for HR role
    if (role === 'hr') {
        links = links.filter(l => l.label !== 'Team');
    }

    const handleLogout = () => {
        localStorage.removeItem('admin_user');
        sessionStorage.clear();
        navigate('/login');
    };

    return (
        <aside
            className={`
                bg-white transition-all duration-300 z-30 border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.08)]
                ${collapsed ? "w-20" : "w-64"}
                flex flex-col h-screen overflow-x-hidden shrink-0
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
                            <div className="font-black text-base tracking-tight leading-none uppercase">
                                <span className="text-[#ff6e00]">E</span>
                                <span className="text-[#19325c]">m</span>
                                <span className="text-[#ff6e00]">b</span>
                                <span className="text-[#19325c]">el</span>
                            </div>
                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest mt-0.5">Talentry</span>
                        </div>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    icon={Menu}
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className={`p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all border-none ${collapsed ? 'mx-auto' : ''}`}
                />
            </div>

            {/* Menu Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col gap-0.5 mt-4">
                {!collapsed && (
                    <div className="px-5 mb-2">
                        <span className="text-xs font-black text-[#19325c] uppercase tracking-[0.2em]">Hiring Process</span>
                    </div>
                )}

                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        title={collapsed ? link.label : ""}
                        aria-label={link.label}
                        end={link.path === '/admin' || link.path === '/interviewer'}
                        className={({ isActive }) => `
                            flex items-center gap-3 w-full py-3 transition-all duration-200 group shrink-0
                            ${collapsed ? "justify-center rounded-lg mx-2 w-auto" : "pl-4 rounded-r-full rounded-l-none mr-2"}
                            ${isActive
                                ? "bg-[#19325c] text-white font-bold border-l-4 border-[#ff6e00]"
                                : "text-slate-950 font-bold hover:bg-[#19325c] hover:text-white border-l-4 border-transparent"}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon size={18} className={isActive ? "text-[#ff6e00]" : "text-slate-950 group-hover:text-[#ff6e00] transition-colors"} aria-hidden="true" />
                                <span className={`text-[13px] ${collapsed ? 'hidden' : 'block'}`} aria-hidden={collapsed}>{link.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                {/* System Grouping */}
                <div className="mt-6">
                    {!collapsed && (
                        <div className="px-5 mb-2">
                            <span className="text-xs font-black text-[#19325c] uppercase tracking-[0.2em]">Management</span>
                        </div>
                    )}

                    <NavLink
                        to={`${(role === 'superadmin' || role === 'admin' || role === 'hr') ? '/admin' : `/${role}`}/settings`}
                        title={collapsed ? "Settings" : ""}
                        aria-label="Settings"
                        className={({ isActive }) => `
                            flex items-center gap-3 w-full py-3 transition-all duration-200 group shrink-0
                            ${collapsed ? "justify-center rounded-lg mx-2 w-auto" : "pl-4 rounded-r-full rounded-l-none mr-2"}
                            ${isActive
                                ? "bg-[#19325c] text-white font-bold border-l-4 border-[#ff6e00]"
                                : "text-slate-950 font-bold hover:bg-[#19325c] hover:text-white border-l-4 border-transparent"}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <Settings size={18} className={isActive ? "text-[#ff6e00]" : "text-slate-950 group-hover:text-[#ff6e00] transition-colors"} aria-hidden="true" />
                                <span className={`text-[13px] ${collapsed ? 'hidden' : 'block'}`} aria-hidden={collapsed}>Settings</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to={`${(role === 'superadmin' || role === 'admin' || role === 'hr') ? '/admin' : `/${role}`}/help`}
                        title={collapsed ? "Support" : ""}
                        aria-label="Support"
                        className={({ isActive }) => `
                            flex items-center gap-3 w-full py-3 transition-all duration-200 group shrink-0
                            ${collapsed ? "justify-center rounded-lg mx-2 w-auto" : "pl-4 rounded-r-full rounded-l-none mr-2"}
                            ${isActive
                                ? "bg-[#19325c] text-white font-bold border-l-4 border-[#ff6e00]"
                                : "text-slate-950 font-bold hover:bg-[#19325c] hover:text-white border-l-4 border-transparent"}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <HelpCircle size={18} className={isActive ? "text-[#ff6e00]" : "text-slate-950 group-hover:text-[#ff6e00] transition-colors"} aria-hidden="true" />
                                <span className={`text-[13px] ${collapsed ? 'hidden' : 'block'}`} aria-hidden={collapsed}>Support</span>
                            </>
                        )}
                    </NavLink>
                </div>
            </nav>

            {/* Logout Button */}
            <div className={`px-2 py-3 border-t border-gray-100 shrink-0 ${collapsed ? 'flex justify-center' : ''}`}>
                <Button
                    variant="ghost"
                    size="md"
                    icon={LogOut}
                    onClick={handleLogout}
                    aria-label="Sign Out"
                    className={`
                        flex items-center gap-3 transition-all duration-200 group rounded-xl hover:bg-rose-50 border-none
                        ${collapsed ? "justify-center p-3" : "w-full py-3 pl-4 justify-start"}
                    `}
                >
                    {!collapsed && (
                        <span className="text-[13px] font-black text-slate-950 group-hover:text-rose-600 uppercase tracking-wider">Sign Out</span>
                    )}
                </Button>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 shrink-0 text-center bg-gray-50/50 border-t border-gray-100">
                <p className="text-[9px] font-black text-slate-400 tracking-widest">
                    {collapsed ? "©" : "© 2026 EMBEL TECH"}
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;

