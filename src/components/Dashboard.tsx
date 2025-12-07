import React from 'react';
import { Users, TrendingUp, DollarSign, Target, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from './ui/Card';
import { mockMembers, mockGroupMetrics } from '../data/mockData';
import { GroupType } from '../types';

export const Dashboard: React.FC = () => {
  const totalMembers = mockMembers.length;
  const avgUtilization = mockMembers.reduce((acc, m) => acc + m.utilizationRate, 0) / totalMembers;
  const lastMonthAvgUtil = mockMembers.reduce((acc, m) => acc + (m.lastMonthMM * 100), 0) / totalMembers;
  const totalCurrentMM = mockMembers.reduce((acc, m) => acc + m.currentMonthMM, 0);
  const totalAvailableMM = mockMembers.reduce((acc, m) => acc + m.availableMM, 0);

  const totalLastMonthCost = mockMembers.reduce((acc, m) => acc + (m.lastMonthMM * m.hourlyRate * 160), 0);
  const totalCurrentCost = mockMembers.reduce((acc, m) => acc + (m.currentMonthMM * m.hourlyRate * 160), 0);
  const lastMonthIdleCost = mockMembers.reduce((acc, m) => acc + ((1 - m.lastMonthMM) * m.hourlyRate * 160), 0);
  const currentIdleCost = mockMembers.reduce((acc, m) => acc + (m.availableMM * m.hourlyRate * 160), 0);

  const utilizationChange = avgUtilization - lastMonthAvgUtil;
  const idleCostChange = currentIdleCost - lastMonthIdleCost;

  const groupColors: Record<GroupType, { bg: string; text: string; border: string }> = {
    executive: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' },
    management: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300' },
    planning: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-300' },
    design: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300' },
    development: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' },
  };

  const groupLabels: Record<GroupType, string> = {
    executive: '본부장',
    management: '사업관리팀',
    planning: '기획팀',
    design: '디자인팀',
    development: '개발팀',
  };

  const groupedMembers = mockMembers.reduce((acc, member) => {
    if (!acc[member.group]) acc[member.group] = [];
    acc[member.group].push(member);
    return acc;
  }, {} as Record<GroupType, typeof mockMembers>);

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
        <h1 className="text-4xl font-bold mb-4">프로젝트 수행본부 대시보드</h1>
        <p className="text-xl opacity-90">전체 팀원의 가동률 및 투입 현황을 한눈에 확인하세요</p>
      </div>

      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">전체 팀원</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalMembers}명</p>
            </div>
            <Users className="h-16 w-16 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">현재 가동률</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{avgUtilization.toFixed(1)}%</p>
              <div className={`flex items-center mt-2 ${utilizationChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {utilizationChange >= 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                <span className="text-base ml-1">{Math.abs(utilizationChange).toFixed(1)}% vs 지난달</span>
              </div>
            </div>
            <TrendingUp className="h-16 w-16 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">투입 가능 인력</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalAvailableMM.toFixed(1)}MM</p>
            </div>
            <Target className="h-16 w-16 text-purple-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">유휴 비용 (이번달)</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {(currentIdleCost / 1000000).toFixed(0)}백만원
              </p>
              <div className={`flex items-center mt-2 ${idleCostChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {idleCostChange <= 0 ? <ArrowDown className="h-5 w-5" /> : <ArrowUp className="h-5 w-5" />}
                <span className="text-base ml-1">{Math.abs(idleCostChange / 1000000).toFixed(1)}백만 vs 지난달</span>
              </div>
            </div>
            <DollarSign className="h-16 w-16 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* 월별 비교 카드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">지난달 실적</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-600 dark:text-gray-400">가동률</span>
              <span className="text-2xl font-bold">{lastMonthAvgUtil.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                style={{ width: `${lastMonthAvgUtil}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-base text-gray-600 dark:text-gray-400">유휴 인력</p>
                <p className="text-2xl font-bold">{(totalMembers - mockMembers.reduce((acc, m) => acc + m.lastMonthMM, 0)).toFixed(1)}MM</p>
              </div>
              <div>
                <p className="text-base text-gray-600 dark:text-gray-400">유휴 비용</p>
                <p className="text-2xl font-bold text-red-600">{(lastMonthIdleCost / 1000000).toFixed(0)}백만원</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">이번달 예상</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-600 dark:text-gray-400">가동률</span>
              <span className="text-2xl font-bold">{avgUtilization.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                style={{ width: `${avgUtilization}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-base text-gray-600 dark:text-gray-400">유휴 인력</p>
                <p className="text-2xl font-bold">{totalAvailableMM.toFixed(1)}MM</p>
              </div>
              <div>
                <p className="text-base text-gray-600 dark:text-gray-400">유휴 비용</p>
                <p className="text-2xl font-bold text-orange-600">{(currentIdleCost / 1000000).toFixed(0)}백만원</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 그룹별 현황 */}
      <Card>
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">그룹별 가동률 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Object.entries(groupedMembers)
            .filter(([group]) => groupColors[group as GroupType])
            .map(([group, members]) => {
              const groupMetric = mockGroupMetrics.find((g) => g.group === group);
              const avgUtil = members.reduce((acc, m) => acc + m.utilizationRate, 0) / members.length;

              return (
                <div
                  key={group}
                  className={`${groupColors[group as GroupType].bg} ${groupColors[group as GroupType].border} border-2 rounded-xl p-6 space-y-4`}
                >
                  <h3 className={`text-2xl font-bold ${groupColors[group as GroupType].text}`}>
                    {groupLabels[group as GroupType]}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-base text-gray-600 mb-1">팀원 수</p>
                      <p className="text-3xl font-bold">{members.length}명</p>
                    </div>
                    <div>
                      <p className="text-base text-gray-600 mb-1">가동률</p>
                      <p className="text-3xl font-bold">{avgUtil.toFixed(1)}%</p>
                      <div className="w-full bg-white rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${groupColors[group as GroupType].text.replace('text-', 'bg-')}`}
                          style={{ width: `${avgUtil}%` }}
                        />
                      </div>
                    </div>
                    {groupMetric && (
                      <div>
                        <p className="text-base text-gray-600 mb-1">유휴 비용</p>
                        <p className="text-xl font-bold text-red-600">
                          {(groupMetric.currentMonthIdleCost / 1000000).toFixed(1)}백만원
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </Card>

      {/* 팀원 목록 */}
      {Object.entries(groupedMembers)
        .filter(([group]) => groupColors[group as GroupType])
        .map(([group, members]) => (
          <Card key={group}>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              {groupLabels[group as GroupType]} 팀원 현황
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={`${groupColors[member.group].bg} ${groupColors[member.group].border} border rounded-lg p-5`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <p className="text-base text-gray-600">{member.position}</p>
                    </div>
                    <span className={`text-2xl font-bold ${groupColors[member.group].text}`}>
                      {member.utilizationRate.toFixed(0)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">지난달</span>
                      <span className="font-semibold">{member.lastMonthMM.toFixed(2)}MM</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">이번달</span>
                      <span className="font-semibold">{member.currentMonthMM.toFixed(2)}MM</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">투입 가능</span>
                      <span className="font-semibold text-green-600">{member.availableMM.toFixed(2)}MM</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
    </div>
  );
};
