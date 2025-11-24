import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface CustomDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    disabled = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            // Use mousedown to catch clicks before they bubble
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Calculate dropdown position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = options.length * 40; // Approximate height per option

            // If not enough space below but more space above, flip to top
            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                setDropdownPosition('top');
            } else {
                setDropdownPosition('bottom');
            }
        }
    }, [isOpen, options.length]);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={clsx("relative", className)}>
            <button
                ref={buttonRef}
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) {
                        setIsOpen(!isOpen);
                    }
                }}
                disabled={disabled}
                className={clsx(
                    "w-full flex items-center justify-between gap-2 bg-zinc-900/50 border border-zinc-800 rounded-sm px-3 py-2 text-sm transition-all",
                    disabled
                        ? "opacity-50 cursor-not-allowed text-zinc-500"
                        : "text-white hover:border-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
                )}
            >
                <span className={clsx(!selectedOption && "text-zinc-500")}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={clsx("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: dropdownPosition === 'bottom' ? 5 : -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: dropdownPosition === 'bottom' ? 5 : -5 }}
                        transition={{ duration: 0.1 }}
                        className={clsx(
                            "absolute left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-sm shadow-xl overflow-y-auto",
                            dropdownPosition === 'bottom' ? "top-full mt-2 z-[100] max-h-24" : "bottom-full mb-2 z-[100] max-h-24"
                        )}
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={clsx(
                                    "w-full text-left px-3 py-2 text-sm transition-colors",
                                    value === option.value
                                        ? "bg-zinc-800 text-white"
                                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDropdown;
