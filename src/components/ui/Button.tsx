import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {

        const variants = {
            primary: 'bg-white text-black hover:bg-zinc-200 border-transparent',
            secondary: 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700',
            outline: 'bg-transparent text-zinc-300 border-zinc-700 hover:text-white hover:border-zinc-500',
            ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50 border-transparent',
            danger: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20',
            success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
            icon: 'p-2',
        };

        return (
            <button
                ref={ref}
                className={clsx(
                    'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all border disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-zinc-500/20',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {!isLoading && leftIcon}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
