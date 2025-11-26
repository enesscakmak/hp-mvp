import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Rocket, AlertTriangle, CheckSquare, ArrowRight, Activity, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
        {children}
    </div>
);

const MarketingPage: React.FC = () => {
    return (
        <div className="bg-zinc-950 text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 bg-white rounded-sm flex items-center justify-center">
                                <div className="h-2 w-2 bg-black rounded-full" />
                            </div>
                            <span className="text-sm font-bold tracking-widest uppercase font-mono">HP_MVP</span>
                        </div>
                        <Link
                            to="/login"
                            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-colors duration-200 rounded-sm"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <Section>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <div className="mb-6 flex items-center justify-center gap-2 text-zinc-500">
                        <span className="h-px w-8 bg-zinc-700" />
                        <span className="text-xs font-mono uppercase tracking-widest">Internal Tool v1.0</span>
                        <span className="h-px w-8 bg-zinc-700" />
                    </div>
                    <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.85]">
                        SHIP <br />
                        <span className="text-zinc-700">FASTER.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
                        The central nervous system for our engineering operations.
                        Manage projects, deployments, and incidents with surgical precision.
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                    >
                        <Link
                            to="/login"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-black bg-white rounded-full hover:bg-zinc-200 transition-all duration-200"
                        >
                            Start Dashboard
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                    </motion.div>
                </motion.div>
            </Section>

            {/* Projects Section */}
            <Section className="border-t border-zinc-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                            <FolderKanban className="h-6 w-6 text-blue-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            The Command <br /> Center.
                        </h2>
                        <p className="text-xl text-zinc-400 leading-relaxed">
                            Stop switching between tabs. Get a bird's-eye view of every microservice,
                            dependency, and owner in one unified interface.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 aspect-square flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-black/40 rounded-xl p-4 border border-zinc-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-zinc-800" />
                                            <div className="space-y-1">
                                                <div className="h-2 w-24 bg-zinc-700 rounded" />
                                                <div className="h-2 w-16 bg-zinc-800 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Deployments Section */}
            <Section className="border-t border-zinc-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-2 md:order-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 aspect-square flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute bottom-0 left-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="relative z-10 font-mono text-sm text-emerald-400 space-y-2">
                            <p>{'> initiating deployment sequence...'}</p>
                            <p>{'> verifying checksums [OK]'}</p>
                            <p>{'> running integration tests...'}</p>
                            <div className="pl-4 border-l border-zinc-800 my-4 space-y-1 text-zinc-500">
                                <p>test_auth_flow: PASS</p>
                                <p>test_payment_gateway: PASS</p>
                                <p>test_user_creation: PASS</p>
                            </div>
                            <p className="text-white">{'> deployment successful (2.4s)'}</p>
                            <div className="mt-8 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    className="h-full bg-emerald-500"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="order-1 md:order-2"
                    >
                        <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                            <Rocket className="h-6 w-6 text-emerald-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            Release with <br /> Confidence.
                        </h2>
                        <p className="text-xl text-zinc-400 leading-relaxed">
                            Track every version, rollback instantly, and monitor health metrics in real-time.
                            Deployment shouldn't be a guessing game.
                        </p>
                    </motion.div>
                </div>
            </Section>

            {/* Incidents Section */}
            <Section className="border-t border-zinc-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="h-12 w-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-6">
                            <AlertTriangle className="h-6 w-6 text-rose-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            Resolve in <br /> Record Time.
                        </h2>
                        <p className="text-xl text-zinc-400 leading-relaxed">
                            When things break, speed matters. Integrated incident management workflows
                            help you coordinate response and reduce MTTR.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-32 bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />
                        <Activity className="h-32 w-32 text-zinc-800" />
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Activity className="h-32 w-32 text-rose-500" />
                        </motion.div>
                    </motion.div>
                </div>
            </Section>

            {/* Workflows Section */}
            <Section className="border-t border-zinc-900">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="h-16 w-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                            <CheckSquare className="h-8 w-8 text-amber-500" />
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                            Standardize Success.
                        </h2>
                        <p className="text-xl text-zinc-400 leading-relaxed mb-12">
                            Turn best practices into repeatable checklists.
                            Ensure every deployment and incident response follows your golden path.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                            {[
                                { title: 'Pre-flight Checks', desc: 'Never miss a config change.' },
                                { title: 'Incident Response', desc: 'Coordinate roles instantly.' },
                                { title: 'Post-mortems', desc: 'Learn and improve.' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2, duration: 0.5 }}
                                    className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
                                >
                                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-zinc-500 text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </Section>

            {/* Footer */}
            <footer className="border-t border-zinc-900 bg-black py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-zinc-800 rounded-sm" />
                        <span className="text-xs font-mono text-zinc-500">HP_MVP SYSTEM</span>
                    </div>
                    <p className="text-zinc-600 text-xs">
                        &copy; 2024 INTERNAL TOOLS. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MarketingPage;
