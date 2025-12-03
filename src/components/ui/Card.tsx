import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
    className,
    hover = false,
    padding = 'md',
    children,
    ...props
}) => {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={clsx(
                'bg-zinc-900/30 border border-zinc-800 rounded-sm transition-all',
                hover && 'hover:bg-zinc-900/50 hover:border-zinc-700',
                paddings[padding],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
