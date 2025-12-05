import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const RegisterPage: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register({ username, email, password });
            toast.success('Registration successful! Welcome to your dashboard.');
            navigate('/');
        } catch (error: any) {
            console.error('Registration failed', error);
            toast.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl mb-6">
                        <LayoutDashboard className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Create an account
                    </h1>
                    <p className="mt-2 text-zinc-400">
                        Get started with your dashboard
                    </p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Username"
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                        />

                        <Input
                            label="Email address"
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />

                        <Input
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                        />

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full"
                            rightIcon={<ArrowRight className="h-4 w-4" />}
                        >
                            Create account
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-4">
                        <div className="text-sm text-zinc-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-white hover:underline">
                                Sign in
                            </Link>
                        </div>
                        <div>
                            <a href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                ← Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 w-full text-center text-zinc-600 text-sm">
                &copy; 2024 HP MVP Internal Tool
            </div>
        </div>
    );
};

export default RegisterPage;
