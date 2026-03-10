import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from '../components/Loader';

// Lazy load components
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));
const Register = lazy(() => import('../pages/candidate/Register'));
const Login = lazy(() => import('../pages/candidate/Login'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const ExamInstructions = lazy(() => import('../pages/candidate/ExamInstructions'));
const ExamPage = lazy(() => import('../pages/candidate/ExamPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const CandidatesList = lazy(() => import('../pages/admin/CandidatesList'));
const Vacancies = lazy(() => import('../pages/admin/Vacancies'));
const QuestionBank = lazy(() => import('../pages/admin/QuestionBank'));
const AllInterviews = lazy(() => import('../pages/admin/AllInterviews'));
const TeamManagement = lazy(() => import('../pages/admin/TeamManagement'));
const ProctoringDashboard = lazy(() => import('../pages/admin/ProctoringDashboard'));
const InterviewerDashboard = lazy(() => import('../pages/interviewer/Dashboard'));
const AssignedInterviews = lazy(() => import('../pages/interviewer/AssignedInterviews'));
const TechnicalReview = lazy(() => import('../pages/interviewer/TechnicalReview'));
const HRDashboard = lazy(() => import('../pages/hr/Dashboard'));
const HRProfiles = lazy(() => import('../pages/hr/HRProfiles'));
const CommunicationPortal = lazy(() => import('../pages/hr/CommunicationPortal'));
const Settings = lazy(() => import('../pages/common/Settings'));
const Help = lazy(() => import('../pages/common/Help'));

const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#002D5E]">
        <Loader size="lg" />
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Default Redirection to Login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Candidate Auth & Exam */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/exam-instructions" element={<ExamInstructions />} />
                <Route path="/exam" element={<ExamPage />} />

                {/* System Admin Auth */}
                <Route path="/login-admin" element={<AdminLogin />} />

                {/* Super Admin Module */}
                <Route path="/admin" element={<DashboardLayout role="superadmin" />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="proctoring" element={<ProctoringDashboard />} />
                    <Route path="candidates" element={<CandidatesList />} />
                    <Route path="vacancies" element={<Vacancies />} />
                    <Route path="questions" element={<QuestionBank />} />
                    <Route path="interviews" element={<AllInterviews />} />
                    <Route path="team" element={<TeamManagement />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help" element={<Help />} />
                </Route>

                {/* Interviewer Module */}
                <Route path="/interviewer" element={<DashboardLayout role="interviewer" />}>
                    <Route index element={<InterviewerDashboard />} />
                    <Route path="interviews" element={<AssignedInterviews />} />
                    <Route path="reviews" element={<TechnicalReview />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help" element={<Help />} />
                </Route>

                {/* HR Module */}
                <Route path="/hr" element={<DashboardLayout role="hr" />}>
                    <Route index element={<HRDashboard />} />
                    <Route path="candidates" element={<HRProfiles />} />
                    <Route path="interviews" element={<AllInterviews />} />
                    <Route path="emails" element={<CommunicationPortal />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="help" element={<Help />} />
                </Route>

                {/* Global Settings (Fallback) */}
                <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
