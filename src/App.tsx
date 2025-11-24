import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import DeploymentsPage from './pages/DeploymentsPage';
import DeploymentDetailsPage from './pages/DeploymentDetailsPage';
import IncidentsPage from './pages/IncidentsPage';
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
                    <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
                    <Route path="/deployments" element={<DeploymentsPage />} />
                    <Route path="/deployments/:deploymentId" element={<DeploymentDetailsPage />} />
                    <Route path="/incidents" element={<IncidentsPage />} />
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
