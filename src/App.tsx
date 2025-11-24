import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import LoginPage from './pages/LoginPage';
import MarketingPage from './pages/MarketingPage'
import { AuthProvider, useAuth } from './context/AuthContext'

const queryClient = new QueryClient()

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {!isAuthenticated ? (
                <>
                    <Route path="/" element={<MarketingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </>
            ) : (
                <Route element={<Layout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="deployments" element={<div className="p-4 text-white">Deployments Module (Coming Soon)</div>} />
                    <Route path="incidents" element={<div className="p-4 text-white">Incidents Module (Coming Soon)</div>} />
                    <Route path="checklists" element={<div className="p-4 text-white">Checklists Module (Coming Soon)</div>} />
                </Route>
            )}
        </Routes>
    );
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
