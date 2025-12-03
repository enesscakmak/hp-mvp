import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={clsx(
                        "w-full bg-zinc-900/50 border rounded-sm px-3 py-2 text-white focus:outline-none focus:ring-1 transition-all",
                        error
                            ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                            : "border-zinc-800 focus:border-zinc-600 focus:ring-zinc-600",
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-rose-400 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
