import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { mockYearlyGoal, mockGroupMetrics, mockMonthlyMetrics } from '../data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export const YearlyUtilization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'team' | 'insights'>('monthly');

  const goalData = mockYearlyGoal.monthlyGoals.map((goal) => ({
    month: `${goal.month}월`,
    목표: goal.target,
    실적: goal.actual,
    차이: goal.actual - goal.target,
  }));

  const teamData = mockGroupMetrics.map((group) => ({
    팀명: {
      executive: '본부장',
      management: '사업관리',
      planning: '기획팀',
      design: '디자인팀',
      development: '개발팀',
    }[group.group],
    현재가동률: group.currentMonthUtilization,
    목표: group.targetUtilization,
    차이: group.currentMonthUtilization - group.targetUtilization,
  }));

  const getStatusBadge = (status: string) => {
    const badges = {
      achieved: { text: '목표 달성', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'on-track': { text: '순조', color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
      'at-risk': { text: '위험', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      delayed: { text: '지연', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-semibold ${badge.color}`}>
        <Icon className="h-5 w-5 mr-2" />
        {badge.text}
      </span>
    );
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(goalData);
    const ws2 = XLSX.utils.json_to_sheet(teamData);
    XLSX.utils.book_append_sheet(wb, ws1, '월별현황');
    XLSX.utils.book_append_sheet(wb, ws2, '팀별분석');
    XLSX.writeFile(wb, `연간가동률_${mockYearlyGoal.year}.xlsx`);
  };

  const achievedMonths = mockYearlyGoal.monthlyGoals.filter((g) => g.actual >= g.target).length;
  const achievementRate = (achievedMonths / 12) * 100;
  const currentAvg = mockYearlyGoal.monthlyGoals.reduce((acc, g) => acc + g.actual, 0) / 12;
  const projectedYearEnd = currentAvg + (mockYearlyGoal.targetUtilizationRate - currentAvg) * 0.3;

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">연간 가동률 관리 ({mockYearlyGoal.year}년)</h1>
            <p className="text-xl opacity-90">목표 {mockYearlyGoal.targetUtilizationRate}% 달성을 위한 월별 진척 현황</p>
          </div>
          <Button onClick={exportToExcel} variant="secondary" size="lg">
            <Download className="mr-2 h-6 w-6" />
            Excel 다운로드
          </Button>
        </div>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">연간 목표</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{mockYearlyGoal.targetUtilizationRate}%</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">현재 평균</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{currentAvg.toFixed(1)}%</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">달성 확률</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{achievementRate.toFixed(0)}%</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">연말 예상</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{projectedYearEnd.toFixed(1)}%</p>
          </div>
        </Card>
      </div>

      {/* 탭 네비게이션 */}
      <Card>
        <div className="flex space-x-2 mb-8">
          <Button
            variant={activeTab === 'monthly' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('monthly')}
            size="lg"
          >
            월별 현황
          </Button>
          <Button
            variant={activeTab === 'team' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('team')}
            size="lg"
          >
            팀별 분석
          </Button>
          <Button
            variant={activeTab === 'insights' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('insights')}
            size="lg"
          >
            개선 인사이트
          </Button>
        </div>

        {/* 월별 현황 탭 */}
        {activeTab === 'monthly' && (
          <div className="space-y-8">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={goalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" style={{ fontSize: '14px' }} />
                  <YAxis style={{ fontSize: '14px' }} />
                  <Tooltip contentStyle={{ fontSize: '14px' }} />
                  <Legend wrapperStyle={{ fontSize: '16px' }} />
                  <Line type="monotone" dataKey="목표" stroke="#8b5cf6" strokeWidth={3} />
                  <Line type="monotone" dataKey="실적" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mockYearlyGoal.monthlyGoals.map((goal) => (
                <div key={goal.month} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5">
                  <h3 className="text-xl font-bold mb-3">{goal.month}월</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">목표</span>
                      <span className="font-semibold">{goal.target}%</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">실적</span>
                      <span className={`font-semibold ${goal.actual >= goal.target ? 'text-green-600' : 'text-red-600'}`}>
                        {goal.actual}%
                      </span>
                    </div>
                    <div className="mt-3">{getStatusBadge(goal.status)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 팀별 분석 탭 */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="팀명" style={{ fontSize: '14px' }} />
                  <YAxis style={{ fontSize: '14px' }} />
                  <Tooltip contentStyle={{ fontSize: '14px' }} />
                  <Legend wrapperStyle={{ fontSize: '16px' }} />
                  <Bar dataKey="현재가동률" fill="#3b82f6" />
                  <Bar dataKey="목표" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {mockGroupMetrics.map((group) => {
                const teamName = {
                  executive: '본부장',
                  management: '사업관리',
                  planning: '기획팀',
                  design: '디자인팀',
                  development: '개발팀',
                }[group.group];

                const status =
                  group.currentMonthUtilization >= group.targetUtilization
                    ? 'on-track'
                    : group.currentMonthUtilization >= group.targetUtilization - 5
                      ? 'at-risk'
                      : 'delayed';

                return (
                  <div key={group.group} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-2xl font-bold mb-4">{teamName}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-base text-gray-600 mb-1">현재</p>
                        <p className="text-3xl font-bold">{group.currentMonthUtilization.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-base text-gray-600 mb-1">목표</p>
                        <p className="text-2xl font-semibold">{group.targetUtilization}%</p>
                      </div>
                      <div className="mt-4">{getStatusBadge(status)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 개선 인사이트 탭 */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <Card className="bg-blue-50 border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">📊 현황 분석</h3>
              <ul className="space-y-3 text-lg text-blue-800">
                <li>• 현재 연평균 가동률: {currentAvg.toFixed(1)}% (목표 대비 -{(mockYearlyGoal.targetUtilizationRate - currentAvg).toFixed(1)}%)</li>
                <li>• 목표 달성 개월 수: {achievedMonths}/12개월</li>
                <li>• 가장 높은 가동률: {Math.max(...mockYearlyGoal.monthlyGoals.map((g) => g.actual))}% (9월)</li>
                <li>• 가장 낮은 가동률: {Math.min(...mockYearlyGoal.monthlyGoals.map((g) => g.actual))}% (1월)</li>
              </ul>
            </Card>

            <Card className="bg-red-50 border-2 border-red-200">
              <h3 className="text-2xl font-bold mb-4 text-red-900">⚠️ 위험 요소</h3>
              <ul className="space-y-3 text-lg text-red-800">
                <li>• 기획팀 가동률 71.2% (목표 85% 대비 -13.8%)</li>
                <li>• 디자인팀 가동률 76.8% (목표 85% 대비 -8.2%)</li>
                <li>• 개발팀 가동률 74.3% (목표 85% 대비 -10.7%)</li>
                <li>• 4분기 목표 달성을 위해서는 월평균 87% 이상 필요</li>
              </ul>
            </Card>

            <Card className="bg-green-50 border-2 border-green-200">
              <h3 className="text-2xl font-bold mb-4 text-green-900">✅ 권장 조치사항</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-5">
                  <h4 className="text-xl font-bold mb-2 text-green-800">1. 신규 프로젝트 확보 (우선순위: 높음)</h4>
                  <p className="text-lg text-gray-700">
                    • 중소형 프로젝트 3~4건 확보하여 유휴 인력 투입
                    <br />• 예상 효과: 가동률 +8~10% 증가
                  </p>
                </div>

                <div className="bg-white rounded-lg p-5">
                  <h4 className="text-xl font-bold mb-2 text-green-800">2. 팀 간 리소스 재배치 (우선순위: 중간)</h4>
                  <p className="text-lg text-gray-700">
                    • 본부장 및 사업관리팀의 높은 가동률 활용
                    <br />• 기획팀 일부 인원을 타 프로젝트에 교차 투입
                  </p>
                </div>

                <div className="bg-white rounded-lg p-5">
                  <h4 className="text-xl font-bold mb-2 text-green-800">3. 내부 프로젝트 추진 (우선순위: 낮음)</h4>
                  <p className="text-lg text-gray-700">
                    • 사내 시스템 개선, R&D 프로젝트 추진
                    <br />• 예상 효과: 가동률 +3~5% 증가
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};
