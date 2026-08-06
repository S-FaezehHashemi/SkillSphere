import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectManagementPage from "./pages/ProjectManagementPage";
import ProjectsPage from "./pages/ProjectsPage";
import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ProjectsPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "projects", element: <ProjectManagementPage /> },
      { path: "projects/:id", element: <ProjectDetailPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },
  { path: "/login", element: <GuestRoute><LoginPage /></GuestRoute> },
  { path: "/register", element: <GuestRoute><RegisterPage /></GuestRoute> },
]);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
