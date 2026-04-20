import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TestsPage = lazy(() => import("./pages/TestsPage"));
const UploadTestPage = lazy(() => import("./pages/UploadTestPage"));
const SessionDetailPage = lazy(() => import("./pages/SessionDetailPage"));
const StudyPlanPage = lazy(() => import("./pages/StudyPlanPage"));

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingScreen message="Loading page..." />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tests" element={<TestsPage />} />
              <Route path="/tests/new" element={<UploadTestPage />} />
              <Route path="/tests/:sessionId" element={<SessionDetailPage />} />
              <Route path="/tests/:sessionId/edit" element={<UploadTestPage />} />
              <Route path="/study-plan" element={<StudyPlanPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
