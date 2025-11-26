import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import DeploymentsPage from './pages/DeploymentsPage';
import DeploymentDetailsPage from './pages/DeploymentDetailsPage';
import IncidentsPage from './pages/IncidentsPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import ChecklistTemplatesPage from './pages/ChecklistTemplatesPage';
import ChecklistRunPage from './pages/ChecklistRunPage';
import LoginPage from './pages/LoginPage';
import MarketingPage from './pages/MarketingPage'
import NotFoundPage from './pages/NotFoundPage';
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
                    <Route path="/incidents/:incidentId" element={<IncidentDetailsPage />} />
                    <Route path="/checklists" element={<ChecklistTemplatesPage />} />
                    <Route path="/checklists/run/:runId" element={<ChecklistRunPage />} />
                    <Route path="*" element={<NotFoundPage />} />
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
                    <Toaster theme="dark" position="top-right" />
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
