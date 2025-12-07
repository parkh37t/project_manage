import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { mockProjects, mockMembers } from '../data/mockData';
import { Project, ProjectStatus, TeamMember, Member } from '../types';
import {
  Plus,
  FolderKanban,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const getStatusBadge = (status: ProjectStatus) => {
    const badges = {
      pending: { text: '검토 대기', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { text: '승인됨', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      in_progress: { text: '진행중', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
      completed: { text: '완료', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      rejected: { text: '반려됨', color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-semibold ${badge.color}`}>
        <Icon className="h-5 w-5 mr-2" />
        {badge.text}
      </span>
    );
  };

  const handleCreateProject = (newProject: Omit<Project, 'id'>) => {
    const maxId = projects.length > 0 ? Math.max(...projects.map((p) => parseInt(p.id.substring(1)))) : 0;
    const project: Project = {
      ...newProject,
      id: `P${String(maxId + 1).padStart(3, '0')}`,
    };
    setProjects([...projects, project]);
    setIsCreateModalOpen(false);
  };

  const handleReviewProject = (projectId: string, status: 'approved' | 'rejected', comments: string) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              status: status === 'approved' ? 'approved' : 'rejected',
              reviewComments: comments,
              reviewedBy: '김태윤',
              reviewedAt: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );
    setIsReviewModalOpen(false);
    setSelectedProject(null);
  };

  const exportToExcel = () => {
    const data = projects.map((p) => ({
      ID: p.id,
      프로젝트명: p.name,
      상태: p.status,
      시작일: p.startDate,
      종료일: p.endDate,
      예산: p.budget,
      '팀원수': p.teamMembers.length,
      검토자: p.reviewedBy || '-',
      검토일: p.reviewedAt || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '프로젝트목록');
    XLSX.writeFile(wb, '프로젝트관리.xlsx');
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">프로젝트 관리</h1>
            <p className="text-xl opacity-90">전체 {projects.length}개의 프로젝트를 관리하세요</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={exportToExcel} variant="secondary" size="lg">
              <Download className="mr-2 h-6 w-6" />
              Excel 다운로드
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)} variant="primary" size="lg">
              <Plus className="mr-2 h-6 w-6" />
              프로젝트 생성
            </Button>
          </div>
        </div>
      </div>

      {/* 상태별 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {(['pending', 'approved', 'in_progress', 'completed', 'rejected'] as ProjectStatus[]).map((status) => {
          const count = projects.filter((p) => p.status === status).length;
          return (
            <Card key={status}>
              <div className="text-center">
                {getStatusBadge(status)}
                <p className="text-4xl font-bold mt-4">{count}개</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 프로젝트 목록 */}
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => {
          const avgUtilization =
            project.teamMembers.length > 0
              ? project.teamMembers.reduce((acc, tm) => acc + tm.utilizationRate, 0) / project.teamMembers.length
              : 0;

          return (
            <Card key={project.id}>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-3xl font-bold">{project.name}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                  </div>
                  {project.status === 'pending' && (
                    <Button
                      onClick={() => {
                        setSelectedProject(project);
                        setIsReviewModalOpen(true);
                      }}
                      variant="primary"
                      size="md"
                    >
                      검토하기
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-base text-gray-600">시작일</p>
                      <p className="text-lg font-semibold">{project.startDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-base text-gray-600">종료일</p>
                      <p className="text-lg font-semibold">{project.endDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-base text-gray-600">예산</p>
                      <p className="text-lg font-semibold">{(project.budget / 100000000).toFixed(1)}억원</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-base text-gray-600">팀원</p>
                      <p className="text-lg font-semibold">{project.teamMembers.length}명</p>
                    </div>
                  </div>
                </div>

                {/* 팀 구성 */}
                {project.teamMembers.length > 0 && (
                  <div>
                    <h4 className="text-xl font-bold mb-4">팀 구성</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.teamMembers.map((tm) => {
                        const member = mockMembers.find((m) => m.id === tm.memberId);
                        if (!member) return null;

                        return (
                          <div
                            key={tm.memberId}
                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-200"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-lg font-bold">{member.name}</p>
                                <p className="text-base text-gray-600">{member.position}</p>
                              </div>
                              <span className="text-xl font-bold text-blue-600">{(tm.utilizationRate * 100).toFixed(0)}%</span>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600">
                                시작일: <span className="font-semibold">{tm.startDate}</span>
                              </p>
                              {tm.endDate && (
                                <p className="text-gray-600">
                                  종료일: <span className="font-semibold">{tm.endDate}</span>
                                </p>
                              )}
                              {tm.withdrawalDate && (
                                <p className="text-red-600">
                                  철수일: <span className="font-semibold">{tm.withdrawalDate}</span>
                                </p>
                              )}
                              {tm.withdrawalReason && <p className="text-red-600 text-xs mt-2">{tm.withdrawalReason}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 검토 정보 */}
                {project.reviewedBy && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-200">
                    <p className="text-base text-gray-600">
                      검토자: <span className="font-semibold">{project.reviewedBy}</span> | 검토일:{' '}
                      <span className="font-semibold">{project.reviewedAt}</span>
                    </p>
                    {project.reviewComments && (
                      <p className="text-base text-gray-700 mt-2">
                        의견: <span className="font-semibold">{project.reviewComments}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 프로젝트 생성 모달 */}
      {isCreateModalOpen && (
        <ProjectCreateModal onClose={() => setIsCreateModalOpen(false)} onSave={handleCreateProject} />
      )}

      {/* 프로젝트 검토 모달 */}
      {isReviewModalOpen && selectedProject && (
        <ProjectReviewModal
          project={selectedProject}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedProject(null);
          }}
          onReview={handleReviewProject}
        />
      )}
    </div>
  );
};

// 프로젝트 생성 모달
interface ProjectCreateModalProps {
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
}

const ProjectCreateModal: React.FC<ProjectCreateModalProps> = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
    teamMembers: [] as TeamMember[],
  });

  const [selectedMember, setSelectedMember] = useState('');
  const [memberData, setMemberData] = useState({
    startDate: '',
    endDate: '',
    utilizationRate: 0.8,
    isRequired: true,
  });

  const handleAddTeamMember = () => {
    if (!selectedMember) return;

    const newMember: TeamMember = {
      memberId: selectedMember,
      startDate: memberData.startDate,
      endDate: memberData.endDate || undefined,
      utilizationRate: memberData.utilizationRate,
      isRequired: memberData.isRequired,
    };

    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, newMember],
    });

    setSelectedMember('');
    setMemberData({
      startDate: '',
      endDate: '',
      utilizationRate: 0.8,
      isRequired: true,
    });
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((tm) => tm.memberId !== memberId),
    });
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      status: 'pending',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6">새 프로젝트 생성</h2>

          {/* 단계 표시 */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* 단계 1: 기본 정보 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold mb-2">프로젝트명</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2">프로젝트 설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold mb-2">시작일</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">종료일</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2">예산 (원)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {/* 단계 2: 팀 구성 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="text-2xl font-bold mb-4">팀원 추가</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-base font-semibold mb-2">팀원 선택</label>
                    <select
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">팀원 선택...</option>
                      {mockMembers
                        .filter((m) => !formData.teamMembers.some((tm) => tm.memberId === m.id))
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.position})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-base font-semibold mb-2">투입 비율</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={memberData.utilizationRate}
                      onChange={(e) => setMemberData({ ...memberData, utilizationRate: Number(e.target.value) })}
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold mb-2">투입일</label>
                    <input
                      type="date"
                      value={memberData.startDate}
                      onChange={(e) => setMemberData({ ...memberData, startDate: e.target.value })}
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold mb-2">철수일 (선택)</label>
                    <input
                      type="date"
                      value={memberData.endDate}
                      onChange={(e) => setMemberData({ ...memberData, endDate: e.target.value })}
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={memberData.isRequired}
                    onChange={(e) => setMemberData({ ...memberData, isRequired: e.target.checked })}
                    className="w-5 h-5 mr-3"
                  />
                  <label className="text-base font-semibold">필수 투입</label>
                </div>

                <Button onClick={handleAddTeamMember} variant="primary" size="md" className="w-full">
                  <Plus className="mr-2 h-5 w-5" />
                  팀원 추가
                </Button>
              </div>

              {/* 추가된 팀원 목록 */}
              <div>
                <h3 className="text-2xl font-bold mb-4">구성된 팀 ({formData.teamMembers.length}명)</h3>
                <div className="space-y-3">
                  {formData.teamMembers.map((tm) => {
                    const member = mockMembers.find((m) => m.id === tm.memberId);
                    if (!member) return null;

                    return (
                      <div key={tm.memberId} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-lg font-bold">
                            {member.name} ({member.position})
                          </p>
                          <p className="text-base text-gray-600">
                            투입: {tm.startDate} ~ {tm.endDate || '프로젝트 종료'} | 비율: {(tm.utilizationRate * 100).toFixed(0)}%
                            {tm.isRequired && ' | 필수'}
                          </p>
                        </div>
                        <Button onClick={() => handleRemoveTeamMember(tm.memberId)} variant="danger" size="sm">
                          제거
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 단계 3: 최종 검토 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-2 border-green-200">
                <h3 className="text-2xl font-bold mb-4">프로젝트 정보 확인</h3>
                <div className="space-y-3 text-lg">
                  <p>
                    <span className="font-semibold">프로젝트명:</span> {formData.name}
                  </p>
                  <p>
                    <span className="font-semibold">설명:</span> {formData.description}
                  </p>
                  <p>
                    <span className="font-semibold">기간:</span> {formData.startDate} ~ {formData.endDate}
                  </p>
                  <p>
                    <span className="font-semibold">예산:</span> {formData.budget.toLocaleString()}원
                  </p>
                  <p>
                    <span className="font-semibold">팀원:</span> {formData.teamMembers.length}명
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border-2 border-yellow-200">
                <p className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                  프로젝트 생성 후 본부장의 검토를 거쳐야 합니다.
                </p>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex space-x-4 mt-8">
            {step > 1 && (
              <Button onClick={() => setStep(step - 1)} variant="ghost" size="lg" className="flex-1">
                이전
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} variant="primary" size="lg" className="flex-1">
                다음
              </Button>
            ) : (
              <Button onClick={handleSubmit} variant="primary" size="lg" className="flex-1">
                프로젝트 생성
              </Button>
            )}
            <Button onClick={onClose} variant="ghost" size="lg" className="flex-1">
              취소
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 프로젝트 검토 모달
interface ProjectReviewModalProps {
  project: Project;
  onClose: () => void;
  onReview: (projectId: string, status: 'approved' | 'rejected', comments: string) => void;
}

const ProjectReviewModal: React.FC<ProjectReviewModalProps> = ({ project, onClose, onReview }) => {
  const [comments, setComments] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6">프로젝트 검토</h2>

          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-4">{project.name}</h3>
              <div className="space-y-2 text-lg">
                <p>
                  <span className="font-semibold">설명:</span> {project.description}
                </p>
                <p>
                  <span className="font-semibold">기간:</span> {project.startDate} ~ {project.endDate}
                </p>
                <p>
                  <span className="font-semibold">예산:</span> {project.budget.toLocaleString()}원
                </p>
                <p>
                  <span className="font-semibold">팀원:</span> {project.teamMembers.length}명
                </p>
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">검토 의견</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="검토 의견을 입력하세요..."
              />
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={() => onReview(project.id, 'approved', comments)}
                variant="primary"
                size="lg"
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-6 w-6" />
                승인
              </Button>
              <Button
                onClick={() => onReview(project.id, 'rejected', comments)}
                variant="danger"
                size="lg"
                className="flex-1"
              >
                <XCircle className="mr-2 h-6 w-6" />
                반려
              </Button>
              <Button onClick={onClose} variant="ghost" size="lg" className="flex-1">
                취소
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
