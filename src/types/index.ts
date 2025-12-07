export type GroupType = 'executive' | 'management' | 'planning' | 'design' | 'development';

export type ProjectStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';

export interface Member {
  id: string;
  name: string;
  group: GroupType;
  position: string;
  hourlyRate: number; // 시간당 비용
  lastMonthMM: number; // 지난달 투입 Manmonth
  currentMonthMM: number; // 이번달 예상 Manmonth
  availableMM: number; // 가용 Manmonth
  utilizationRate: number; // 가동률 %
  skills?: string[];
}

export interface TeamMember {
  memberId: string;
  startDate: string;
  endDate?: string;
  isRequired: boolean; // 필수 투입 여부
  utilizationRate: number; // 투입 비율
  withdrawalReason?: string; // 중도 철수 사유
  withdrawalDate?: string; // 철수일
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  teamMembers: TeamMember[];
  budget: number;
  reviewComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface MonthlyMetrics {
  month: string;
  totalMM: number;
  utilizedMM: number;
  availableMM: number;
  utilizationRate: number;
  totalCost: number;
  idleCost: number;
}

export interface GroupMetrics {
  group: GroupType;
  totalMembers: number;
  lastMonthUtilization: number;
  currentMonthUtilization: number;
  targetUtilization: number;
  lastMonthIdleMM: number;
  currentMonthIdleMM: number;
  lastMonthIdleCost: number;
  currentMonthIdleCost: number;
}

export interface YearlyGoal {
  year: number;
  targetUtilizationRate: number; // 목표 가동률
  monthlyGoals: {
    month: number;
    target: number;
    actual: number;
    status: 'achieved' | 'on-track' | 'at-risk' | 'delayed';
  }[];
}
