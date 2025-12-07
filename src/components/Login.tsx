import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { login, setAuthToken } from '../services/api';
import { LogIn, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ username, password });
      setAuthToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLogin(response.user);
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">프로젝트 수행본부</h1>
          <p className="text-xl text-gray-600">인력관리 시스템</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <p className="text-base text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-lg font-semibold mb-2">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-base font-semibold mb-2">테스트 계정:</p>
          <div className="space-y-1 text-sm text-gray-700">
            <p>• 관리자: admin / password</p>
            <p>• 매니저: manager / password</p>
            <p>• 일반: user / password</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
