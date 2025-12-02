import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, LayoutDashboard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ username, password });
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Login failed', error);
      toast.error(error.response?.data || 'Login failed. Please check your credentials.');
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
            Welcome back
          </h1>
          <p className="mt-2 text-zinc-400">
            Sign in to your dashboard
          </p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-zinc-300">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-xl border-0 bg-zinc-950/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 bg-zinc-950/50 py-2.5 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center items-center rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div className="text-sm text-zinc-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:underline">
                Sign up
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

export default LoginPage;
