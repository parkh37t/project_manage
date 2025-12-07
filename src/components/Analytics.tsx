import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { mockMonthlyMetrics, mockGroupMetrics } from '../data/mockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Download, Calendar, DollarSign } from 'lucide-react';
import * as XLSX from 'xlsx';

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'quarterly' | 'idle'>('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // 분기별 데이터 계산
  const quarterlyData = [
    {
      quarter: '2024 Q1',
      totalMM: mockMonthlyMetrics.slice(0, 3).reduce((acc, m) => acc + m.totalMM, 0) / 3,
      utilizedMM: mockMonthlyMetrics.slice(0, 3).reduce((acc, m) => acc + m.utilizedMM, 0) / 3,
      availableMM: mockMonthlyMetrics.slice(0, 3).reduce((acc, m) => acc + m.availableMM, 0) / 3,
      utilizationRate: mockMonthlyMetrics.slice(0, 3).reduce((acc, m) => acc + m.utilizationRate, 0) / 3,
      totalCost: mockMonthlyMetrics.slice(0, 3).reduce((acc, m) => acc + m.totalCost, 0) / 3,
      idleCost: mockMonthlyMetrics.slice(0, 3).reduce((acc, m) => acc + m.idleCost, 0) / 3,
    },
    {
      quarter: '2024 Q2',
      totalMM: mockMonthlyMetrics.slice(3, 6).reduce((acc, m) => acc + m.totalMM, 0) / 3,
      utilizedMM: mockMonthlyMetrics.slice(3, 6).reduce((acc, m) => acc + m.utilizedMM, 0) / 3,
      availableMM: mockMonthlyMetrics.slice(3, 6).reduce((acc, m) => acc + m.availableMM, 0) / 3,
      utilizationRate: mockMonthlyMetrics.slice(3, 6).reduce((acc, m) => acc + m.utilizationRate, 0) / 3,
      totalCost: mockMonthlyMetrics.slice(3, 6).reduce((acc, m) => acc + m.totalCost, 0) / 3,
      idleCost: mockMonthlyMetrics.slice(3, 6).reduce((acc, m) => acc + m.idleCost, 0) / 3,
    },
    {
      quarter: '2024 Q3',
      totalMM: mockMonthlyMetrics.slice(6, 9).reduce((acc, m) => acc + m.totalMM, 0) / 3,
      utilizedMM: mockMonthlyMetrics.slice(6, 9).reduce((acc, m) => acc + m.utilizedMM, 0) / 3,
      availableMM: mockMonthlyMetrics.slice(6, 9).reduce((acc, m) => acc + m.availableMM, 0) / 3,
      utilizationRate: mockMonthlyMetrics.slice(6, 9).reduce((acc, m) => acc + m.utilizationRate, 0) / 3,
      totalCost: mockMonthlyMetrics.slice(6, 9).reduce((acc, m) => acc + m.totalCost, 0) / 3,
      idleCost: mockMonthlyMetrics.slice(6, 9).reduce((acc, m) => acc + m.idleCost, 0) / 3,
    },
    {
      quarter: '2024 Q4',
      totalMM: mockMonthlyMetrics.slice(9, 12).reduce((acc, m) => acc + m.totalMM, 0) / 3,
      utilizedMM: mockMonthlyMetrics.slice(9, 12).reduce((acc, m) => acc + m.utilizedMM, 0) / 3,
      availableMM: mockMonthlyMetrics.slice(9, 12).reduce((acc, m) => acc + m.availableMM, 0) / 3,
      utilizationRate: mockMonthlyMetrics.slice(9, 12).reduce((acc, m) => acc + m.utilizationRate, 0) / 3,
      totalCost: mockMonthlyMetrics.slice(9, 12).reduce((acc, m) => acc + m.totalCost, 0) / 3,
      idleCost: mockMonthlyMetrics.slice(9, 12).reduce((acc, m) => acc + m.idleCost, 0) / 3,
    },
  ];

  // 유휴 분석 데이터
  const idleAnalysisData = mockGroupMetrics.map((group) => ({
    팀명: {
      executive: '본부장',
      management: '사업관리',
      planning: '기획팀',
      design: '디자인팀',
      development: '개발팀',
    }[group.group],
    지난달유휴MM: group.lastMonthIdleMM,
    이번달유휴MM: group.currentMonthIdleMM,
    지난달비용: group.lastMonthIdleCost / 1000000,
    이번달비용: group.currentMonthIdleCost / 1000000,
  }));

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // 월별 데이터
    const monthlyData = mockMonthlyMetrics.map((m) => ({
      월: m.month,
      '전체MM': m.totalMM,
      '투입MM': m.utilizedMM,
      '가용MM': m.availableMM,
      '가동률(%)': m.utilizationRate,
      '총비용(원)': m.totalCost,
      '유휴비용(원)': m.idleCost,
    }));
    const ws1 = XLSX.utils.json_to_sheet(monthlyData);
    XLSX.utils.book_append_sheet(wb, ws1, '월별현황');

    // 분기별 데이터
    const quarterlySheetData = quarterlyData.map((q) => ({
      분기: q.quarter,
      '평균전체MM': q.totalMM.toFixed(2),
      '평균투입MM': q.utilizedMM.toFixed(2),
      '평균가용MM': q.availableMM.toFixed(2),
      '평균가동률(%)': q.utilizationRate.toFixed(2),
      '평균총비용(원)': q.totalCost.toFixed(0),
      '평균유휴비용(원)': q.idleCost.toFixed(0),
    }));
    const ws2 = XLSX.utils.json_to_sheet(quarterlySheetData);
    XLSX.utils.book_append_sheet(wb, ws2, '분기별현황');

    // 유휴 분석
    const idleSheetData = mockGroupMetrics.map((g) => ({
      그룹: {
        executive: '본부장',
        management: '사업관리',
        planning: '기획팀',
        design: '디자인팀',
        development: '개발팀',
      }[g.group],
      지난달유휴MM: g.lastMonthIdleMM,
      이번달유휴MM: g.currentMonthIdleMM,
      지난달비용: g.lastMonthIdleCost,
      이번달비용: g.currentMonthIdleCost,
      절감액: g.lastMonthIdleCost - g.currentMonthIdleCost,
    }));
    const ws3 = XLSX.utils.json_to_sheet(idleSheetData);
    XLSX.utils.book_append_sheet(wb, ws3, '유휴분석');

    XLSX.writeFile(wb, '인력분석리포트.xlsx');
  };

  const totalYearlyUtilization = mockMonthlyMetrics.reduce((acc, m) => acc + m.utilizationRate, 0) / 12;
  const totalYearlyIdleCost = mockMonthlyMetrics.reduce((acc, m) => acc + m.idleCost, 0);
  const avgMonthlyIdleCost = totalYearlyIdleCost / 12;

  // 추이 분석
  const utilizationTrend =
    mockMonthlyMetrics[11].utilizationRate - mockMonthlyMetrics[0].utilizationRate;
  const idleCostTrend = mockMonthlyMetrics[11].idleCost - mockMonthlyMetrics[0].idleCost;

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">분석 및 리포팅</h1>
            <p className="text-xl opacity-90">월별/분기별 Manmonth 추이 및 유휴 인력 분석</p>
          </div>
          <Button onClick={exportToExcel} variant="secondary" size="lg">
            <Download className="mr-2 h-6 w-6" />
            전체 리포트 다운로드
          </Button>
        </div>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">연평균 가동률</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalYearlyUtilization.toFixed(1)}%</p>
            <div className={`flex items-center justify-center mt-2 ${utilizationTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {utilizationTrend >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <span className="ml-1 text-base">{utilizationTrend >= 0 ? '+' : ''}{utilizationTrend.toFixed(1)}% (연초 대비)</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">월평균 유휴 비용</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{(avgMonthlyIdleCost / 1000000).toFixed(0)}백만원</p>
            <div className={`flex items-center justify-center mt-2 ${idleCostTrend <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {idleCostTrend <= 0 ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
              <span className="ml-1 text-base">{Math.abs(idleCostTrend / 1000000).toFixed(0)}백만원 {idleCostTrend <= 0 ? '절감' : '증가'}</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">최고 가동률 달성</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {Math.max(...mockMonthlyMetrics.map((m) => m.utilizationRate)).toFixed(1)}%
            </p>
            <p className="text-base text-gray-600 mt-2">
              {mockMonthlyMetrics.find((m) => m.utilizationRate === Math.max(...mockMonthlyMetrics.map((m) => m.utilizationRate)))?.month}
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-orange-600" />
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">연간 총 유휴 비용</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{(totalYearlyIdleCost / 100000000).toFixed(1)}억원</p>
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
            월별 추이
          </Button>
          <Button
            variant={activeTab === 'quarterly' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('quarterly')}
            size="lg"
          >
            분기별 추이
          </Button>
          <Button
            variant={activeTab === 'idle' ? 'primary' : 'ghost'}
            onClick={() => setActiveTab('idle')}
            size="lg"
          >
            유휴 분석
          </Button>
        </div>

        {/* 월별 추이 탭 */}
        {activeTab === 'monthly' && (
          <div className="space-y-8">
            {/* 가동률 추이 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">월별 가동률 추이</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockMonthlyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" style={{ fontSize: '14px' }} />
                    <YAxis style={{ fontSize: '14px' }} />
                    <Tooltip contentStyle={{ fontSize: '14px' }} />
                    <Legend wrapperStyle={{ fontSize: '16px' }} />
                    <Area
                      type="monotone"
                      dataKey="utilizationRate"
                      name="가동률 (%)"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Manmonth 추이 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">월별 Manmonth 투입 현황</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mockMonthlyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" style={{ fontSize: '14px' }} />
                    <YAxis style={{ fontSize: '14px' }} />
                    <Tooltip contentStyle={{ fontSize: '14px' }} />
                    <Legend wrapperStyle={{ fontSize: '16px' }} />
                    <Bar dataKey="utilizedMM" name="투입 MM" fill="#10b981" />
                    <Bar dataKey="availableMM" name="가용 MM" fill="#f59e0b" />
                    <Line type="monotone" dataKey="totalMM" name="전체 MM" stroke="#8b5cf6" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 비용 추이 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">월별 비용 분석</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockMonthlyMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" style={{ fontSize: '14px' }} />
                    <YAxis style={{ fontSize: '14px' }} />
                    <Tooltip contentStyle={{ fontSize: '14px' }} />
                    <Legend wrapperStyle={{ fontSize: '16px' }} />
                    <Bar dataKey="totalCost" name="총 비용 (원)" fill="#3b82f6" />
                    <Bar dataKey="idleCost" name="유휴 비용 (원)" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 분기별 추이 탭 */}
        {activeTab === 'quarterly' && (
          <div className="space-y-8">
            {/* 분기별 가동률 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">분기별 평균 가동률</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" style={{ fontSize: '14px' }} />
                    <YAxis style={{ fontSize: '14px' }} />
                    <Tooltip contentStyle={{ fontSize: '14px' }} />
                    <Legend wrapperStyle={{ fontSize: '16px' }} />
                    <Bar dataKey="utilizationRate" name="평균 가동률 (%)" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 분기별 MM 현황 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">분기별 평균 Manmonth</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" style={{ fontSize: '14px' }} />
                    <YAxis style={{ fontSize: '14px' }} />
                    <Tooltip contentStyle={{ fontSize: '14px' }} />
                    <Legend wrapperStyle={{ fontSize: '16px' }} />
                    <Bar dataKey="utilizedMM" name="평균 투입 MM" fill="#10b981" />
                    <Bar dataKey="availableMM" name="평균 가용 MM" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 분기별 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quarterlyData.map((quarter) => (
                <Card key={quarter.quarter} className="bg-gradient-to-br from-purple-50 to-pink-50">
                  <h4 className="text-2xl font-bold mb-4">{quarter.quarter}</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-base text-gray-600">평균 가동률</p>
                      <p className="text-3xl font-bold text-purple-600">{quarter.utilizationRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-base text-gray-600">평균 투입 MM</p>
                      <p className="text-2xl font-bold">{quarter.utilizedMM.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-base text-gray-600">평균 유휴 비용</p>
                      <p className="text-2xl font-bold text-red-600">{(quarter.idleCost / 1000000).toFixed(0)}백만원</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 유휴 분석 탭 */}
        {activeTab === 'idle' && (
          <div className="space-y-8">
            {/* 그룹별 유휴 MM 비교 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">그룹별 유휴 Manmonth 비교</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={idleAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="팀명" style={{ fontSize: '14px' }} />
                    <YAxis yAxisId="left" style={{ fontSize: '14px' }} />
                    <YAxis yAxisId="right" orientation="right" style={{ fontSize: '14px' }} />
                    <Tooltip contentStyle={{ fontSize: '14px' }} />
                    <Legend wrapperStyle={{ fontSize: '16px' }} />
                    <Bar yAxisId="left" dataKey="지난달유휴MM" name="지난달 유휴 MM" fill="#ef4444" />
                    <Bar yAxisId="left" dataKey="이번달유휴MM" name="이번달 유휴 MM" fill="#f59e0b" />
                    <Line yAxisId="right" type="monotone" dataKey="지난달비용" name="지난달 비용 (백만원)" stroke="#8b5cf6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="이번달비용" name="이번달 비용 (백만원)" stroke="#3b82f6" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 유휴 비용 상세 */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200">
                <h3 className="text-2xl font-bold mb-6">지난달 유휴 현황</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {mockGroupMetrics.map((group) => (
                    <div key={group.group} className="text-center">
                      <p className="text-lg font-semibold mb-2">
                        {{
                          executive: '본부장',
                          management: '사업관리',
                          planning: '기획팀',
                          design: '디자인팀',
                          development: '개발팀',
                        }[group.group]}
                      </p>
                      <p className="text-3xl font-bold text-yellow-700 mb-2">{group.lastMonthIdleMM.toFixed(2)}MM</p>
                      <p className="text-xl font-bold text-red-600">{(group.lastMonthIdleCost / 1000000).toFixed(1)}백만원</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200">
                <h3 className="text-2xl font-bold mb-6">이번달 예상 현황</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {mockGroupMetrics.map((group) => {
                    const improvement = group.lastMonthIdleMM - group.currentMonthIdleMM;
                    const costSavings = group.lastMonthIdleCost - group.currentMonthIdleCost;

                    return (
                      <div key={group.group} className="text-center">
                        <p className="text-lg font-semibold mb-2">
                          {{
                            executive: '본부장',
                            management: '사업관리',
                            planning: '기획팀',
                            design: '디자인팀',
                            development: '개발팀',
                          }[group.group]}
                        </p>
                        <p className="text-3xl font-bold text-green-700 mb-2">{group.currentMonthIdleMM.toFixed(2)}MM</p>
                        <p className="text-xl font-bold text-orange-600 mb-2">{(group.currentMonthIdleCost / 1000000).toFixed(1)}백만원</p>
                        {improvement > 0 && (
                          <div className="mt-2">
                            <p className="text-base text-green-600 font-semibold flex items-center justify-center">
                              <TrendingDown className="h-5 w-5 mr-1" />
                              {improvement.toFixed(2)}MM 개선
                            </p>
                            <p className="text-sm text-green-600">{(costSavings / 1000000).toFixed(1)}백만원 절감</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
