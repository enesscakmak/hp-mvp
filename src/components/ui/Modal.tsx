import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    icon,
    children,
    className,
    size = 'md'
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-full m-4'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={clsx(
                            "relative w-full bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
                            sizes[size],
                            className
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(title || icon) && (
                            <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                    {icon && (
                                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-400">
                                            {icon}
                                        </div>
                                    )}
                                    {title && <div className="text-xl font-bold text-white">{title}</div>}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-sm"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        <div className="overflow-y-auto">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};



export default Modal;
