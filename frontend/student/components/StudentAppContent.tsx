import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Sidebar } from '@/components/Layout/Sidebar';
import { LandingPage } from '@/components/Landing/LandingPage';
import { AdminLogin } from '@/components/Admin/AdminLogin';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { TeacherDashboard } from '@/components/Teacher/TeacherDashboard';
import { AssessmentTest } from '@/components/Assessment/AssessmentTest';
import { ProctoringDemo } from '@/components/Assessment/ProctoringDemo';
import { CourseList } from '@/components/Courses/CourseList';
import { CourseDetail } from '@/components/Courses/CourseDetail';
import { AssessmentAnalytics } from '@/components/Admin/AssessmentAnalytics';
import { LabsList } from '@/components/Labs/LabsList';
import { LabViewer } from '@/components/Labs/LabViewer';
import { Certificates } from '@/components/Certificates/Certificates';
import { Profile } from '@/components/Profile/Profile';
import { Chatbot } from '@/components/Chatbot/Chatbot';
import { VideoLibrary } from '@/components/Video/VideoLibrary';
import { TechnicalQuestions } from '@/components/TechnicalInterview/TechnicalQuestions';
import { NotesTab } from '@/components/Notes/NotesTab';
import '../styles/student.css';

export const StudentAppContent = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<'home' | 'admin' | 'app'>('home');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentRoute('admin');
      return;
    }
    if (path === '/proctor-demo' || new URLSearchParams(window.location.search).get('tab') === 'proctor-demo') {
      setActiveTab('proctor-demo');
      setCurrentRoute('app');
      return;
    }
    if (user) {
      setCurrentRoute('app');
    } else {
      setCurrentRoute('home');
    }
  }, [user]);

  const handleLoginSuccess = () => {
    setCurrentRoute('app');
    if (window.location.pathname === '/admin') {
      window.history.pushState({}, '', '/');
    }
  };

  if (currentRoute === 'admin') {
    if (user && isAdmin()) {
      setCurrentRoute('app');
      return null;
    }
    return (
      <AdminLogin
        onBack={() => {
          setCurrentRoute('home');
          window.history.pushState({}, '', '/');
        }}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  if (!user) {
    return <LandingPage onLogin={handleLoginSuccess} />;
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  const handleLabSelect = (labId: string) => {
    setSelectedLabId(labId);
  };

  const renderContent = () => {
    if (activeTab === 'courses' && selectedCourseId) {
      return <CourseDetail courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />;
    }

    if (activeTab === 'labs' && selectedLabId) {
      return <LabViewer labId={selectedLabId} onBack={() => setSelectedLabId(null)} />;
    }

    switch (activeTab) {
      case 'analytics':
        return isAdmin() ? <AssessmentAnalytics /> : <Dashboard />;
      case 'my-courses':
      case 'create-course':
      case 'students':
        return isTeacher() ? <TeacherDashboard /> : <Dashboard />;
      case 'dashboard':
        return <Dashboard />;
      case 'assessment':
        return isAdmin() ? <AssessmentAnalytics /> : <AssessmentTest />;
      case 'proctor-demo':
        return <ProctoringDemo />;
      case 'courses':
        return <CourseList onCourseSelect={handleCourseSelect} />;
      case 'videos':
        return <VideoLibrary />;
      case 'labs':
        return <LabsList onLabSelect={handleLabSelect} />;
      case 'technical':
        return <TechnicalQuestions />;
      case 'certificates':
        return <Certificates />;
      case 'notes':
        return <NotesTab />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Header onChatToggle={() => setIsChatOpen(!isChatOpen)} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1">{renderContent()}</main>
      </div>
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};
