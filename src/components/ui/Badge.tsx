import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'outline' | 'purple';
    size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({
    className,
    variant = 'default',
    size = 'md',
    children,
    ...props
}) => {
    const variants = {
        default: 'bg-zinc-800 text-zinc-300',
        success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        error: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
        info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        neutral: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
        outline: 'bg-transparent border border-zinc-700 text-zinc-400',
        purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    };

    const sizes = {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-0.5 text-xs',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-sm font-mono uppercase tracking-wider font-medium',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
