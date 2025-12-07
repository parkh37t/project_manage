import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { YearlyUtilization } from './components/YearlyUtilization';
import { MemberManagement } from './components/MemberManagement';
import { ProjectManagement } from './components/ProjectManagement';
import { Analytics } from './components/Analytics';
import { Login } from './components/Login';
import { LayoutDashboard, Target, Users, FolderKanban, BarChart3, LogOut } from 'lucide-react';
import { removeAuthToken } from './services/api';

type Page = 'dashboard' | 'yearly' | 'members' | 'projects' | 'analytics';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-2xl text-white font-semibold">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const navigation = [
    { id: 'dashboard' as Page, name: '대시보드', icon: LayoutDashboard },
    { id: 'yearly' as Page, name: '연간 가동률', icon: Target, badge: '90%' },
    { id: 'members' as Page, name: '구성원 관리', icon: Users, badge: '66명' },
    { id: 'projects' as Page, name: '프로젝트 관리', icon: FolderKanban },
    { id: 'analytics' as Page, name: '분석 및 리포팅', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 네비게이션 바 */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                프로젝트 수행본부
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                인력관리 시스템 | 총 66명 | 목표 90%
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.role === 'admin' ? '관리자' : user.role === 'manager' ? '매니저' : '일반 사용자'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                로그아웃
              </button>
            </div>
          </div>

          <div className="flex space-x-2 mt-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-6 w-6 mr-2" />
                  {item.name}
                  {item.badge && (
                    <span
                      className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'yearly' && <YearlyUtilization />}
        {currentPage === 'members' && <MemberManagement />}
        {currentPage === 'projects' && <ProjectManagement />}
        {currentPage === 'analytics' && <Analytics />}
      </main>

      {/* 푸터 */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-base text-gray-600 dark:text-gray-400">
            © 2024 프로젝트 수행본부 인력관리 시스템. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
