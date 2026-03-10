import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = ({ role }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            <Sidebar
                role={role}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
                <Header role={role} />
                <main className="p-8 flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Outlet />
                    </div>
                </main>
                <footer className="px-8 py-6 text-center text-xs font-bold text-slate-400 border-t border-slate-100 bg-white/50 backdrop-blur-md">
                    &copy; {new Date().getFullYear()} EMBEL TECH. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
