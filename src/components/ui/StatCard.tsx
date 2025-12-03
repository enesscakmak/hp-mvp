import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { Link } from 'react-router-dom';

interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    to?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon: Icon, to }) => {
    const Content = (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 group h-full"
        >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-500 opacity-50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-500 opacity-50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-500 opacity-50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-500 opacity-50" />

            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-zinc-800/50 rounded-sm border border-zinc-700/50 group-hover:border-zinc-500 transition-colors">
                    <Icon className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                {trend && (
                    <span className={`text-xs font-mono px-2 py-1 rounded-sm border ${trendUp
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>

            <h3 className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-1">{title}</h3>
            <p className="text-2xl font-bold text-white font-sans">{value}</p>

            {/* Scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 pointer-events-none" />
        </motion.div>
    );

    if (to) {
        return (
            <Link to={to} className="block h-full">
                {Content}
            </Link>
        );
    }

    return Content;
};

export default StatCard;
