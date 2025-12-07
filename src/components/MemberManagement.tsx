import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { mockMembers } from '../data/mockData';
import { Member, GroupType } from '../types';
import { Plus, Edit, Trash2, Search, Download, Users, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';

export const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<GroupType | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

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

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = filterGroup === 'all' || member.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const getGroupStats = () => {
    const stats: Record<GroupType, { count: number; avgUtil: number }> = {
      executive: { count: 0, avgUtil: 0 },
      management: { count: 0, avgUtil: 0 },
      planning: { count: 0, avgUtil: 0 },
      design: { count: 0, avgUtil: 0 },
      development: { count: 0, avgUtil: 0 },
    };

    members.forEach((member) => {
      stats[member.group].count++;
      stats[member.group].avgUtil += member.utilizationRate;
    });

    Object.keys(stats).forEach((key) => {
      const group = key as GroupType;
      if (stats[group].count > 0) {
        stats[group].avgUtil = stats[group].avgUtil / stats[group].count;
      }
    });

    return stats;
  };

  const stats = getGroupStats();

  const handleAddMember = (newMember: Omit<Member, 'id'>) => {
    const maxId = Math.max(...members.map((m) => parseInt(m.id.substring(1))));
    const member: Member = {
      ...newMember,
      id: `M${String(maxId + 1).padStart(3, '0')}`,
    };
    setMembers([...members, member]);
    setIsAddModalOpen(false);
  };

  const handleEditMember = (updatedMember: Member) => {
    setMembers(members.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
    setIsEditModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('정말 이 팀원을 삭제하시겠습니까?')) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const exportToExcel = () => {
    const data = members.map((m) => ({
      ID: m.id,
      이름: m.name,
      그룹: groupLabels[m.group],
      직급: m.position,
      '시간당비용(원)': m.hourlyRate,
      '지난달MM': m.lastMonthMM,
      '이번달MM': m.currentMonthMM,
      '가용MM': m.availableMM,
      '가동률(%)': m.utilizationRate,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '팀원목록');
    XLSX.writeFile(wb, '팀원관리.xlsx');
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">팀원 관리</h1>
            <p className="text-xl opacity-90">전체 {members.length}명의 팀원 정보를 관리하세요</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={exportToExcel} variant="secondary" size="lg">
              <Download className="mr-2 h-6 w-6" />
              Excel 다운로드
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)} variant="primary" size="lg">
              <Plus className="mr-2 h-6 w-6" />
              팀원 추가
            </Button>
          </div>
        </div>
      </div>

      {/* 팀별 현황 개요 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {(Object.keys(groupLabels) as GroupType[]).map((group) => (
          <Card key={group} className={`${groupColors[group].bg} ${groupColors[group].border} border-2`}>
            <div className="text-center">
              <Users className={`h-12 w-12 mx-auto mb-4 ${groupColors[group].text}`} />
              <h3 className={`text-2xl font-bold ${groupColors[group].text} mb-2`}>{groupLabels[group]}</h3>
              <p className="text-3xl font-bold mb-2">{stats[group].count}명</p>
              <p className="text-lg text-gray-600">평균 가동률</p>
              <p className="text-2xl font-bold">{stats[group].avgUtil.toFixed(1)}%</p>
            </div>
          </Card>
        ))}
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="이름 또는 직급으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value as GroupType | 'all')}
              className="pl-14 pr-8 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체 그룹</option>
              {(Object.keys(groupLabels) as GroupType[]).map((group) => (
                <option key={group} value={group}>
                  {groupLabels[group]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* 팀원 목록 */}
      <Card>
        <h2 className="text-3xl font-bold mb-6">팀원 목록 ({filteredMembers.length}명)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-6 py-4 text-left font-bold">ID</th>
                <th className="px-6 py-4 text-left font-bold">이름</th>
                <th className="px-6 py-4 text-left font-bold">그룹</th>
                <th className="px-6 py-4 text-left font-bold">직급</th>
                <th className="px-6 py-4 text-right font-bold">시간당 비용</th>
                <th className="px-6 py-4 text-right font-bold">지난달 MM</th>
                <th className="px-6 py-4 text-right font-bold">이번달 MM</th>
                <th className="px-6 py-4 text-right font-bold">가용 MM</th>
                <th className="px-6 py-4 text-right font-bold">가동률</th>
                <th className="px-6 py-4 text-center font-bold">작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <td className="px-6 py-4 font-semibold">{member.id}</td>
                  <td className="px-6 py-4 font-bold">{member.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${groupColors[member.group].bg} ${groupColors[member.group].text}`}
                    >
                      {groupLabels[member.group]}
                    </span>
                  </td>
                  <td className="px-6 py-4">{member.position}</td>
                  <td className="px-6 py-4 text-right">{member.hourlyRate.toLocaleString()}원</td>
                  <td className="px-6 py-4 text-right">{member.lastMonthMM.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">{member.currentMonthMM.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-green-600 font-semibold">{member.availableMM.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-bold">{member.utilizationRate.toFixed(1)}%</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingMember(member);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 추가 모달 */}
      {isAddModalOpen && (
        <MemberModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddMember}
          groupLabels={groupLabels}
        />
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && editingMember && (
        <MemberModal
          member={editingMember}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingMember(null);
          }}
          onSave={handleEditMember}
          groupLabels={groupLabels}
        />
      )}
    </div>
  );
};

// 팀원 추가/수정 모달
interface MemberModalProps {
  member?: Member;
  onClose: () => void;
  onSave: (member: any) => void;
  groupLabels: Record<GroupType, string>;
}

const MemberModal: React.FC<MemberModalProps> = ({ member, onClose, onSave, groupLabels }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    group: member?.group || 'planning',
    position: member?.position || '',
    hourlyRate: member?.hourlyRate || 45000,
    lastMonthMM: member?.lastMonthMM || 0,
    currentMonthMM: member?.currentMonthMM || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const availableMM = 1 - formData.currentMonthMM;
    const utilizationRate = formData.currentMonthMM * 100;

    if (member) {
      onSave({
        ...member,
        ...formData,
        availableMM,
        utilizationRate,
      });
    } else {
      onSave({
        ...formData,
        availableMM,
        utilizationRate,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6">{member ? '팀원 수정' : '새 팀원 추가'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2">이름</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">그룹</label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value as GroupType })}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(Object.keys(groupLabels) as GroupType[]).map((group) => (
                  <option key={group} value={group}>
                    {groupLabels[group]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">직급</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">시간당 비용 (원)</label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold mb-2">지난달 MM</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.lastMonthMM}
                  onChange={(e) => setFormData({ ...formData, lastMonthMM: Number(e.target.value) })}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2">이번달 MM</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.currentMonthMM}
                  onChange={(e) => setFormData({ ...formData, currentMonthMM: Number(e.target.value) })}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" variant="primary" size="lg" className="flex-1">
                {member ? '수정' : '추가'}
              </Button>
              <Button type="button" onClick={onClose} variant="ghost" size="lg" className="flex-1">
                취소
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
