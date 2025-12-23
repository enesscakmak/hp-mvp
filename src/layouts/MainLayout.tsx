import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Rocket, AlertTriangle, CheckSquare, LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

const Layout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Projects', href: '/projects', icon: FolderKanban },
        { name: 'Deployments', href: '/deployments', icon: Rocket },
        { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
        { name: 'Checklists', href: '/checklists', icon: CheckSquare },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex">
            {/* Sidebar */}
            <div
                className={clsx(
                    "bg-zinc-950 border-r border-zinc-800 flex flex-col fixed h-full z-20 transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800">
                    <div className={clsx("flex items-center gap-2 overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                        <div className="h-4 w-4 bg-white rounded-sm flex items-center justify-center flex-shrink-0">
                            <div className="h-1.5 w-1.5 bg-black rounded-full" />
                        </div>
                        <span className="text-sm font-bold tracking-widest uppercase font-mono text-white whitespace-nowrap">HP_MVP</span>
                    </div>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-sm hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </button>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={clsx(
                                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-sm transition-all duration-200',
                                    isActive
                                        ? 'bg-zinc-900 text-white border-l-2 border-white'
                                        : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300',
                                    isCollapsed && 'justify-center'
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <item.icon
                                    className={clsx(
                                        'h-5 w-5 transition-colors flex-shrink-0',
                                        isActive ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400',
                                        !isCollapsed && 'mr-3'
                                    )}
                                />
                                <span className={clsx("transition-all duration-300 overflow-hidden whitespace-nowrap", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <div className={clsx("flex items-center gap-3 mb-4 px-2 transition-all duration-300", isCollapsed ? "justify-center" : "")}>
                        <div className="h-8 w-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div className={clsx("flex-1 min-w-0 transition-all duration-300 overflow-hidden", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
                            <p className="text-sm font-medium text-white truncate">{user?.username || 'User'}</p>
                            <p className="text-xs text-zinc-500 truncate font-mono">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className={clsx(
                            "w-full flex items-center justify-center px-4 py-2 text-xs font-medium text-zinc-400 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-sm transition-colors uppercase tracking-wider",
                            isCollapsed && "px-0"
                        )}
                        title={isCollapsed ? "Sign Out" : undefined}
                    >
                        <LogOut className={clsx("h-3 w-3", !isCollapsed && "mr-2")} />
                        <span className={clsx("transition-all duration-300 overflow-hidden whitespace-nowrap", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                            Sign Out
                        </span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={clsx("flex-1 transition-all duration-300 ease-in-out", isCollapsed ? "ml-20" : "ml-64")}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
