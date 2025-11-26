import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="relative inline-block">
                    <h1 className="text-9xl font-black text-zinc-800 select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AlertTriangle className="h-24 w-24 text-zinc-700/50" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
                    <p className="text-zinc-400 max-w-md mx-auto">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-sm hover:bg-zinc-200 transition-colors"
                >
                    <Home className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;
